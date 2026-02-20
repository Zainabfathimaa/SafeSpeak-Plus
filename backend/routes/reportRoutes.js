import express from 'express';
import {
    createReport,
    getAllReports,
    getUserReports,
    getReportById,
    updateReportStatus
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Routes
// All routes are protected (require login)

// Create Report (Any logged in user/anonymous)
router.post('/', authenticate, createReport);

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

export default router;
