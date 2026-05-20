import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
  evaluateTrustScore,
  scanFakeAccount,
  scanSpamPattern,
  getFlaggedCases,
} from '../controllers/securityController';

const router = express.Router();

router.get('/trust-score/:userId', protect, evaluateTrustScore);
router.post('/scan-fake-account', protect, scanFakeAccount);
router.post('/scan-spam', protect, scanSpamPattern);
router.get('/flagged-cases', protect, authorize('admin'), getFlaggedCases);

export default router;
