import express from 'express';
import {
  verifyReportAuthenticity,
  setReportRiskLevel,
  flagSuspiciousReport,
  getAuthenticityMetrics,
  getLowAuthenticityReports
} from '../controllers/reportAuthenticityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * ===================================
 * REPORT AUTHENTICITY ROUTES
 * ===================================
 * All routes require admin authentication
 */

// Verify report authenticity (PUT /api/reports/:reportId/verify)
router.put('/:reportId/verify', authenticate, verifyReportAuthenticity);

// Set report risk level (PUT /api/reports/:reportId/risk-level)
router.put('/:reportId/risk-level', authenticate, setReportRiskLevel);

// Flag suspicious report (PUT /api/reports/:reportId/flag)
router.put('/:reportId/flag', authenticate, flagSuspiciousReport);

// Get authenticity metrics (GET /api/reports/authenticity/metrics)
router.get('/authenticity/metrics', authenticate, getAuthenticityMetrics);

// Get low authenticity reports (GET /api/reports/authenticity/low-authenticity)
router.get('/authenticity/low-authenticity', authenticate, getLowAuthenticityReports);

export default router;
