import express from 'express';
import {
  register,
  registerAdmin,
  login,
  anonymousLogin,
  getCurrentUser,
  changePassword,
  forgotCode
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/admin-register', registerAdmin);
router.post('/login', login);
router.post('/anonymous-login', anonymousLogin);
router.post('/forgot-code', forgotCode);
router.get('/me', authenticate, getCurrentUser);
router.put('/change-password', authenticate, changePassword);

export default router;
