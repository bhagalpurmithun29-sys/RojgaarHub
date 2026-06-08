import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User';
import Wallet from '../models/Wallet';
import Payment, { PaymentStatus } from '../models/Payment';
import Booking from '../models/Booking';

interface AuthRequest extends Request {
  user?: any;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockSecret123',
});

// @desc    Create Razorpay Order for Wallet Top-up
// @route   POST /api/payments/order
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body; // amount in INR

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_wallet_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment & Update Wallet Balance
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mockSecret123');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = shasum.digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature || process.env.NODE_ENV !== 'production';

    if (isSignatureValid) {
      // Find or create Wallet
      let wallet = await Wallet.findOne({ ownerId: req.user._id });
      if (!wallet) {
        wallet = await Wallet.create({ ownerId: req.user._id, balance: 0, transactions: [] });
      }

      // Add balance to Wallet
      wallet.balance += Number(amount);
      wallet.transactions.push({
        amount: Number(amount),
        type: 'credit',
        description: 'Wallet top-up via Razorpay',
        referenceId: razorpay_payment_id || 'manual_topup',
        date: new Date(),
      });

      await wallet.save();

      res.json({
        success: true,
        message: 'Payment verified and wallet balance updated.',
        balance: wallet.balance,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process payments for custom bookings under Mixed Commission Model
// @route   POST /api/payments/process-booking
// @access  Private (Customer)
export const processBookingPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, paymentMethod } = req.body; // paymentMethod: 'cash' or 'wallet'

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: Customer mismatch.' });
    }

    // Mixed Commission Model variables
    const laborFee = booking.totalAmount;
    const platformFee = 50; // Flat INR 50 customer platform fee
    const tax = Math.round(laborFee * 0.18); // 18% GST on labor fee
    const discount = 0;
    const customerTotal = laborFee + platformFee + tax - discount;

    const commissionDeducted = Math.round(laborFee * 0.15); // 15% platform commission on labour earnings
    const labourPayout = laborFee - commissionDeducted;

    if (paymentMethod === 'wallet') {
      let customerWallet = await Wallet.findOne({ ownerId: req.user._id });
      if (!customerWallet || customerWallet.balance < customerTotal) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      // Debit customer wallet
      customerWallet.balance -= customerTotal;
      customerWallet.transactions.push({
        amount: customerTotal,
        type: 'debit',
        description: `Paid for Booking ID ${bookingId}`,
        referenceId: bookingId,
        date: new Date(),
      });
      await customerWallet.save();
    }

    // Credit labour wallet
    let labourWallet = await Wallet.findOne({ ownerId: booking.labour });
    if (!labourWallet) {
      labourWallet = await Wallet.create({ ownerId: booking.labour, balance: 0, transactions: [] });
    }

    labourWallet.balance += labourPayout;
    labourWallet.transactions.push({
      amount: labourPayout,
      type: 'credit',
      description: `Earning from Booking ID ${bookingId} (Platform commission deducted)`,
      referenceId: bookingId,
      date: new Date(),
    });
    await labourWallet.save();

    // Create Payment database log
    const payment = await Payment.create({
      bookingId,
      customerId: req.user._id,
      amount: customerTotal,
      platformFee,
      tax,
      discount,
      paymentMethod,
      paymentStatus: PaymentStatus.SUCCESS,
    });

    booking.paymentStatus = 'completed';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking invoice finalized and processed successfully.',
      payment,
      customerView: {
        laborFee,
        platformFee,
        tax,
        discount,
        totalPaid: customerTotal,
      },
      labourView: {
        totalEarned: laborFee,
        commissionDeducted,
        finalPayout: labourPayout,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Worker payout requests
// @route   POST /api/payments/withdraw
// @access  Private (Labour/Contractor)
export const requestWithdraw = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, bankAccountDetails } = req.body;

    let wallet = await Wallet.findOne({ ownerId: req.user._id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Debit wallet balance
    wallet.balance -= amount;
    wallet.withdrawHistory.push({
      amount,
      status: 'pending',
      bankAccountDetails,
      requestedAt: new Date(),
    });

    // Add transaction record for frontend history
    wallet.transactions.push({
      amount: amount,
      type: 'debit',
      description: `Withdrawal request to ${bankAccountDetails}`,
      referenceId: `wd_${Date.now()}`,
      date: new Date(),
    });

    await wallet.save();

    res.json({
      success: true,
      message: 'Payout withdrawal request registered. Under review.',
      wallet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Invoice Details
// @route   GET /api/payments/booking/:id/invoice
// @access  Private
export const generateInvoiceDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('customer labour', 'name email phoneNumber');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = await Payment.findOne({ bookingId: id });

    // Format invoice details mapping variables
    const laborFee = booking.totalAmount;
    const platformFee = payment ? payment.platformFee : 50;
    const tax = payment ? payment.tax : Math.round(laborFee * 0.18);
    const totalAmount = laborFee + platformFee + tax;

    res.json({
      success: true,
      invoice: {
        bookingId: id,
        date: booking.date,
        timeSlot: booking.timeSlot,
        customerDetails: booking.customer,
        labourDetails: booking.labour,
        breakdown: {
          laborFee,
          platformFee,
          tax,
          totalAmount,
        },
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Wallet details
// @route   GET /api/payments/wallet
// @access  Private
export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    let wallet = await Wallet.findOne({ ownerId: req.user._id });
    
    if (!wallet) {
      // Auto-create empty wallet
      wallet = await Wallet.create({ ownerId: req.user._id, balance: 0, transactions: [], withdrawHistory: [] });
    }

    res.json({
      success: true,
      wallet
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
