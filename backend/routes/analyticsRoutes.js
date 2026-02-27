import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Only admins can view analytics
router.get('/', authenticate, authorize('admin'), getAnalytics);

export default router;
