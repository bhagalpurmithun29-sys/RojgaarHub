import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
  sendInAppNotification,
  getNotifications,
  markNotificationRead,
  triggerSOS,
  createDispute,
  updateDisputeStatus,
} from '../controllers/supportController';

const router = express.Router();

router.post('/notifications', protect, sendInAppNotification);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.post('/sos', protect, triggerSOS);
router.post('/disputes', protect, createDispute);
router.put('/disputes/:id', protect, authorize('admin'), updateDisputeStatus);

export default router;
