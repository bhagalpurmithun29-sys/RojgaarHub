import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  createOrder,
  verifyPayment,
  processBookingPayment,
  requestWithdraw,
  generateInvoiceDetails,
  getWallet,
} from '../controllers/paymentController';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/process-booking', protect, processBookingPayment);
router.post('/withdraw', protect, requestWithdraw);
router.get('/booking/:id/invoice', protect, generateInvoiceDetails);
router.get('/wallet', protect, getWallet);

export default router;
