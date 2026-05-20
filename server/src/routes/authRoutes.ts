import express from 'express';
import { 
  registerUser, 
  authUser, 
  forgotPassword, 
  resetPassword, 
  googleLogin, 
  sendOTP, 
  verifyOTP, 
  logoutUser, 
  logoutAllDevices 
} from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/google', googleLogin);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.post('/logout', logoutUser);
router.post('/logout-all', logoutAllDevices);

export default router;
