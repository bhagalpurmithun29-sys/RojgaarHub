import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  upsertProfile,
  getProfileById,
  uploadKYC,
  searchProfiles,
} from '../controllers/profileController';

const router = express.Router();

router.post('/', protect, upsertProfile);
router.post('/kyc', protect, uploadKYC);
router.get('/search', searchProfiles);
router.get('/:id', getProfileById);

export default router;
