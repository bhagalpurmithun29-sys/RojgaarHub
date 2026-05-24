import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  createBooking,
  getMyBookings,
  respondToBooking,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
} from '../controllers/bookingController';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);
router.put('/:id/reschedule', protect, rescheduleBooking);
router.put('/:id/respond', protect, respondToBooking);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
