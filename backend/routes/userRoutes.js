import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Only admins can view all users
router.get('/', authenticate, authorize('admin'), getAllUsers);

export default router;
