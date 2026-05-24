"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.respondToBooking = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importStar(require("../models/Booking"));
// Generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
    try {
        const { labourId, bookingType, date, timeSlot, address, totalAmount } = req.body;
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Only customers can create a booking' });
        }
        const otps = {
            arrivalOTP: generateOTP(),
            startOTP: generateOTP(),
            completeOTP: generateOTP(),
        };
        const booking = await Booking_1.default.create({
            customer: req.user._id,
            labour: labourId,
            bookingType,
            date,
            timeSlot,
            address,
            totalAmount,
            otps,
        });
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBooking = createBooking;
// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const query = req.user.role === 'customer'
            ? { customer: req.user._id }
            : { labour: req.user._id };
        const bookings = await Booking_1.default.find(query)
            .populate('customer', 'name phone')
            .populate('labour', 'name phone')
            .sort({ createdAt: -1 });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyBookings = getMyBookings;
// @desc    Accept or Reject a booking
// @route   PUT /api/bookings/:id/respond
// @access  Private (Labour)
const respondToBooking = async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const booking = await Booking_1.default.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.labour.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to respond to this booking' });
        }
        if (status === Booking_1.BookingStatus.ACCEPTED || status === Booking_1.BookingStatus.REJECTED) {
            booking.status = status;
            const updatedBooking = await booking.save();
            return res.json(updatedBooking);
        }
        res.status(400).json({ message: 'Invalid status response' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.respondToBooking = respondToBooking;
// @desc    Update booking status (Arrived, Started, Completed) using OTP
// @route   PUT /api/bookings/:id/status
// @access  Private (Labour)
const updateBookingStatus = async (req, res) => {
    try {
        const { status, otp } = req.body;
        const booking = await Booking_1.default.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.labour.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // OTP Verification Logic
        let isOtpValid = false;
        if (status === Booking_1.BookingStatus.ARRIVED && otp === booking.otps.arrivalOTP)
            isOtpValid = true;
        else if (status === Booking_1.BookingStatus.WORK_STARTED && otp === booking.otps.startOTP)
            isOtpValid = true;
        else if (status === Booking_1.BookingStatus.COMPLETED && otp === booking.otps.completeOTP)
            isOtpValid = true;
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP for the requested status' });
        }
        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
