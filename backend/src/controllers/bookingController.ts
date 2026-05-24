import { Request, Response } from 'express';
import Booking, { BookingStatus } from '../models/Booking';

interface AuthRequest extends Request {
  user?: any;
}

// Generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// @desc    Create a new booking with auto double-booking prevention
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { labourId, bookingType, date, timeSlot, address, totalAmount } = req.body;

    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create a booking' });
    }

    // Auto Overlap Prevention: Check if the worker is already booked at the exact date and slot
    const existingConflict = await Booking.findOne({
      labour: labourId,
      date: new Date(date),
      timeSlot,
      status: { $nin: [BookingStatus.REJECTED, BookingStatus.CANCELLED] }
    });

    if (existingConflict) {
      return res.status(400).json({ 
        message: 'Auto Overlap Prevention Alert: This professional is already booked for the selected date and time slot! Please choose another slot.' 
      });
    }

    const otps = {
      arrivalOTP: generateOTP(),
      startOTP: generateOTP(),
      completeOTP: generateOTP(),
    };

    const booking = await Booking.create({
      customer: req.user._id,
      labour: labourId,
      bookingType,
      date: new Date(date),
      timeSlot,
      address,
      totalAmount,
      otps,
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule an existing booking (keeping same Booking ID)
// @route   PUT /api/bookings/:id/reschedule
// @access  Private (Customer)
export const rescheduleBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reschedule this booking' });
    }

    // Double Booking Prevention check for rescheduled slot
    const existingConflict = await Booking.findOne({
      _id: { $ne: booking._id },
      labour: booking.labour,
      date: new Date(date),
      timeSlot,
      status: { $nin: [BookingStatus.REJECTED, BookingStatus.CANCELLED] }
    });

    if (existingConflict) {
      return res.status(400).json({ 
        message: 'Reschedule Conflict: The worker is already booked at this new time slot! Please select an alternative hour.' 
      });
    }

    // Preserve same booking document / ID
    booking.date = new Date(date);
    booking.timeSlot = timeSlot;
    booking.status = BookingStatus.REQUESTED; // Reset status back to review status
    
    // Refresh security OTP tokens
    booking.otps = {
      arrivalOTP: generateOTP(),
      startOTP: generateOTP(),
      completeOTP: generateOTP(),
    };

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user.role === 'customer' 
      ? { customer: req.user._id } 
      : { labour: req.user._id };

    const bookings = await Booking.find(query)
      .populate('customer', 'name phone')
      .populate('labour', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or Reject a booking
// @route   PUT /api/bookings/:id/respond
// @access  Private (Labour)
export const respondToBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.labour.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this booking' });
    }

    if (status === BookingStatus.ACCEPTED || status === BookingStatus.REJECTED) {
      booking.status = status;
      const updatedBooking = await booking.save();
      return res.json(updatedBooking);
    }

    res.status(400).json({ message: 'Invalid status response' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Arrived, Started, Completed) using OTP
// @route   PUT /api/bookings/:id/status
// @access  Private (Labour)
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, otp } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.labour.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // OTP Verification Logic
    let isOtpValid = false;
    if (status === BookingStatus.ARRIVED && otp === booking.otps.arrivalOTP) isOtpValid = true;
    else if (status === BookingStatus.WORK_STARTED && otp === booking.otps.startOTP) isOtpValid = true;
    else if (status === BookingStatus.COMPLETED && otp === booking.otps.completeOTP) isOtpValid = true;

    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP for the requested status' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking with 30-minute grace period cancellation policy & penalties
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify authorized user (Customer or Labour)
    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isLabour = booking.labour.toString() === req.user._id.toString();

    if (!isCustomer && !isLabour) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Calculate elapsed time since creation in minutes
    const elapsedMinutes = Math.floor((Date.now() - booking.createdAt.getTime()) / 1000 / 60);
    let penaltyApplied = false;
    let penaltyAmount = 0;

    if (elapsedMinutes > 30) {
      penaltyApplied = true;
      penaltyAmount = 150; // INR 150 penalty for late cancellations
      console.warn(`⚠️ Cancellation grace period exceeded: ${elapsedMinutes} minutes elapsed. Penalty of INR ${penaltyAmount} applied.`);
      
      // Fetch and debit customer wallet in database
      const Wallet = (await import('../models/Wallet')).default;
      let wallet = await Wallet.findOne({ ownerId: booking.customer });
      if (wallet) {
        wallet.balance -= penaltyAmount;
        wallet.transactions.push({
          amount: penaltyAmount,
          type: 'debit',
          description: `Late cancellation penalty fee for booking: ${id}`,
          referenceId: String(id),
          date: new Date(),
        });
        await wallet.save();
      }
    }

    booking.status = BookingStatus.CANCELLED;
    const updatedBooking = await booking.save();

    res.json({
      success: true,
      message: `Booking successfully cancelled. Elapsed time: ${elapsedMinutes} mins.`,
      penaltyApplied,
      penaltyAmount,
      booking: updatedBooking,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
