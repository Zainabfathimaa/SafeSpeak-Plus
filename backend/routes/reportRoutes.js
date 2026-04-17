import express from 'express';
import {
    createReport,
    getAllReports,
    getUserReports,
    getReportById,
    updateReportStatus,
    appealReport,
    escalateReport,
    getEscalationPdf,
    getReportsByUserId
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

// Limit to 5 reports per IP per 24 hours
const reportLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many reports created from this IP, please try again after 24 hours'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

// Routes
// All routes are protected (require login)

// Create Report (Any logged in user/anonymous)
// reportLimiter temporarily disabled as per request
router.post('/', authenticate, createReport);

// Get User's Own Reports
router.get('/my-reports', authenticate, getUserReports);

// Get Escalation PDF (Accessible via ID for supervisors)
// Moved higher up to avoid shadowing issues with generic /:id
router.get('/:id/escalation-pdf', getEscalationPdf);

// Get All Reports (Admin only)
router.get('/', authenticate, authorize('admin'), getAllReports);

// Get Reports for a specific user (Admin only)
router.get('/user/:userId', authenticate, authorize('admin'), getReportsByUserId);

// Get Single Report (User sees own, Staff sees all)
router.get('/:id', authenticate, getReportById);

// Update Report Status (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), updateReportStatus);

// Appeal a closed/archived report (User only)
router.post('/:id/appeal', authenticate, appealReport);

// Escalate a report to super admin (User only)
router.post('/:id/escalate', authenticate, escalateReport);

export default router;
