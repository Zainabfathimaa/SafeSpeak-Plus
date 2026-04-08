import express from 'express';
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  getUserPreferences,
  updateNotificationPreferences,
  updateAppearancePreferences,
  updateIdRevealConsent,
  getIdRevealConsentStatus,
  deleteAccount,
  getUserActivity,
  completeOnboarding
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

// Delete User Account (DELETE /api/user/account)
router.delete('/account', authenticate, deleteAccount);

// Get User Activity (GET /api/user/activity)
router.get('/activity', authenticate, getUserActivity);

// Complete Onboarding (PUT /api/user/onboarding/complete)
router.put('/onboarding/complete', authenticate, completeOnboarding);

// ===================================
// NOTIFICATION & PREFERENCES
// ===================================

// Get user notification preferences (GET /api/user/preferences)
router.get('/preferences', authenticate, getUserPreferences);

// Update notification preferences (PUT /api/user/preferences)
router.put('/preferences', authenticate, updateNotificationPreferences);

// Update appearance preferences (PUT /api/user/appearance)
router.put('/appearance', authenticate, updateAppearancePreferences);

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

// Get user by ID (Admin only) (GET /api/user/:id)
router.get('/:id', authenticate, getUserById);
export default router;
