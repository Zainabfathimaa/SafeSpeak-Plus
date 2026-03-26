import express from 'express';
import {
  register,
  login,
  anonymousLogin,
  getCurrentUser,
  changePassword,
  forgotCode,
  forgotPasswordOtp,
  resetPasswordOtp
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/anonymous-login', anonymousLogin);
router.post('/forgot-code', forgotCode);
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/reset-password-otp', resetPasswordOtp);
router.get('/me', authenticate, getCurrentUser);
router.put('/change-password', authenticate, changePassword);

export default router;
