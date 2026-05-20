import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
  getSystemStats,
  updateUserStatus,
  approveKYC,
  toggleFeatureFlag,
  updateCMS,
} from '../controllers/adminController';

const router = express.Router();

// All administrative console commands protected under secure double authorization checking guards
router.use(protect, authorize('admin'));

router.get('/stats', getSystemStats);
router.put('/users/:id/status', updateUserStatus);
router.put('/kyc/:profileId', approveKYC);
router.put('/feature-flags', toggleFeatureFlag);
router.put('/cms', updateCMS);

export default router;
