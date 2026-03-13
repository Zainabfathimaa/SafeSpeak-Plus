import express from 'express';
import {
    createReport,
    getAllReports,
    getUserReports,
    getReportById,
    updateReportStatus,
    appealReport
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
router.post('/', authenticate, reportLimiter, createReport);

// Get User's Own Reports
router.get('/my-reports', authenticate, getUserReports);

// Get All Reports (Admin/Staff only)
// Explicitly list allowed roles for accessing all reports
router.get('/', authenticate, authorize('admin', 'counsellor', 'executive', 'compliance-officer', 'department-head'), getAllReports);

// Get Single Report (User sees own, Staff sees all)
// Logic for permission check is inside the controller
router.get('/:id', authenticate, getReportById);

// Update Report Status (Admin/Staff only)
router.patch('/:id/status', authenticate, authorize('admin', 'counsellor', 'executive'), updateReportStatus);

// Appeal a closed/archived report (User only)
router.post('/:id/appeal', authenticate, appealReport);

export default router;
