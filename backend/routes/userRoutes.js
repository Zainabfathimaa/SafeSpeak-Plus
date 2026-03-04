import express from 'express';
import {
  getAllUsers,
  getCurrentUser,
  updateUserProfile,
  getUserPreferences,
  updateNotificationPreferences,
  updateIdRevealConsent,
  getIdRevealConsentStatus
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * ===================================
 * USER ROUTES
 * ===================================
 */

// ===================================
// PUBLIC ROUTES (User Info)
// ===================================

// Get current user profile (GET /api/user/profile)
router.get('/profile', authenticate, getCurrentUser);

// Update user profile (PUT /api/user/profile)
router.put('/profile', authenticate, updateUserProfile);

// ===================================
// NOTIFICATION & PREFERENCES
// ===================================

// Get user notification preferences (GET /api/user/preferences)
router.get('/preferences', authenticate, getUserPreferences);

// Update notification preferences (PUT /api/user/preferences)
router.put('/preferences', authenticate, updateNotificationPreferences);

// ===================================
// PRIVACY & CONSENT
// ===================================

// Get ID reveal consent status (GET /api/user/consent/status)
router.get('/consent/status', authenticate, getIdRevealConsentStatus);

// Update ID reveal consent (PUT /api/user/consent/id-reveal)
router.put('/consent/id-reveal', authenticate, updateIdRevealConsent);

// ===================================
// ADMIN ROUTES
// ===================================

// Get all users (Admin only) (GET /api/user/all)
router.get('/all', authenticate, getAllUsers);
export default router;
