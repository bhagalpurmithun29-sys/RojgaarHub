import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  sendMessage,
  getChatHistory,
  deleteMessage,
  blockUser,
  reportUser,
} from '../controllers/communicationController';

const router = express.Router();

router.post('/messages', protect, sendMessage);
router.get('/chat/:receiverId', protect, getChatHistory);
router.delete('/messages/:id', protect, deleteMessage);
router.post('/block', protect, blockUser);
router.post('/report', protect, reportUser);

export default router;
