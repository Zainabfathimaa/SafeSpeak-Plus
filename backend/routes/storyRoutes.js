import express from 'express';
import {
  submitStory,
  getUserStories,
  getPendingStories,
  approveStory,
  rejectStory,
  getPublishedStories,
  likeStory,
  commentOnStory,
  deleteStory,
  shareStory,
  getStoryStats
} from '../controllers/storyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * ===================================
 * STORY ROUTES
 * ===================================
 */

// ===================================
// USER ROUTES
// ===================================

// Submit new story (POST /api/stories/submit)
router.post('/submit', authenticate, submitStory);

// Get user's own stories (GET /api/stories/my-stories)
router.get('/my-stories', authenticate, getUserStories);

// Get published stories (GET /api/stories/published)
router.get('/published', authenticate, getPublishedStories);

// Like story (POST /api/stories/:storyId/like)
router.post('/:storyId/like', authenticate, likeStory);

// Comment on story (POST /api/stories/:storyId/comment)
router.post('/:storyId/comment', authenticate, commentOnStory);

// Share story (POST /api/stories/:storyId/share)
router.post('/:storyId/share', authenticate, shareStory);

// Delete story (DELETE /api/stories/:storyId)
router.delete('/:storyId', authenticate, deleteStory);

// ===================================
// ADMIN ROUTES
// ===================================

// Get pending stories for review (GET /api/stories/admin/pending)
router.get('/admin/pending', authenticate, getPendingStories);

// Approve story (PUT /api/stories/admin/:storyId/approve)
router.put('/admin/:storyId/approve', authenticate, approveStory);

// Reject story (PUT /api/stories/admin/:storyId/reject)
router.put('/admin/:storyId/reject', authenticate, rejectStory);

// Get story statistics (GET /api/stories/admin/stats)
router.get('/admin/stats', authenticate, getStoryStats);

export default router;
