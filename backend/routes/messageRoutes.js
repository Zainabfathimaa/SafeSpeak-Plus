import express from 'express';
import {
    getConversations,
    getMessagesByReport,
    sendMessage
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication

// Get conversation list (user sees own, admin/staff sees all)
router.get('/', authenticate, getConversations);

// Get messages for a specific report thread
router.get('/:reportId', authenticate, getMessagesByReport);

// Send a new message on a report thread
router.post('/:reportId', authenticate, sendMessage);

export default router;
