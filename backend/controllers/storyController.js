import Story from '../models/Story.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * ===================================
 * STORY CONTROLLER
 * ===================================
 * Handles all story-related operations
 * - Submission
 * - Admin review
 * - Publishing
 * - Engagement (likes, comments, shares)
 */

// ===================================
// USER: SUBMIT STORY
// ===================================
export const submitStory = async (req, res) => {
  try {
    // ensure req.user is available (auth middleware should set this)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userId = req.user.id;
    const { title, content, category } = req.body;

    // Log minimal payload info for debugging production 500s
    console.log('submitStory called', {
      userId,
      titleLength: title ? title.length : 0,
      contentLength: content ? content.length : 0,
      category
    });

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    if (title.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 5 characters'
      });
    }

    if (content.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Story must be at least 50 characters'
      });
    }

    // Create new story
    const story = new Story({
      title,
      content,
      category: category || 'Personal Experience',
      submittedBy: userId,
      status: 'Pending Review'
    });

    await story.save();
    await story.populate('submittedBy', 'fullName email');

    // Create notification for admins
    // create admin notifications but don't let a notification failure
    // break the entire submission flow. Log errors for debugging.
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        try {
          await Notification.create({
            recipientId: admin._id,
            type: 'system_alert',
            title: 'New Story Submitted',
            message: 'A new story has been submitted for review',
            relatedId: story._id,
            relatedType: 'Story',
            priority: 'medium',
            shouldSendEmail: true
          });
        } catch (notifErr) {
          console.error(`Failed to create notification for admin ${admin._id}:`, notifErr && (notifErr.stack || notifErr.message) || notifErr);
        }
      }
    } catch (adminsErr) {
      console.error('Failed to query admins for notifications:', adminsErr.message || adminsErr);
    }

    res.status(201).json({
      success: true,
      message: 'Story submitted successfully. Awaiting admin review.',
      story
    });

  } catch (error) {
    console.error('Error submitting story:', error && (error.stack || error.message) || error);
    // Provide validation details if available
    const errMessage = error?.message || 'Unknown server error';
    // If it's a Mongoose validation error, include details (helpful for debugging)
    if (error.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map(e => e.message).join('; ');
      return res.status(400).json({ success: false, message: details || errMessage });
    }

    res.status(500).json({
      success: false,
      message: errMessage
    });
  }
};

// ===================================
// USER: GET USER'S OWN STORIES
// ===================================
export const getUserStories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // Filter by status

    let query = { submittedBy: userId };
    if (status) {
      query.status = status;
    }

    const stories = await Story.find(query)
      .populate('submittedBy', 'fullName email')
      .populate('reviewedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      stories
    });

  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: GET PENDING STORIES FOR REVIEW
// ===================================
export const getPendingStories = async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can review stories'
      });
    }

    const stories = await Story.find({ status: 'Pending Review' })
      .populate('submittedBy', 'fullName email department')
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
      success: true,
      count: stories.length,
      stories
    });

  } catch (error) {
    console.error('Error fetching pending stories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending stories',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: APPROVE STORY
// ===================================
export const approveStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { comments } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve stories'
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Update story
    story.status = 'Approved';
    story.isPublished = true;
    story.reviewedBy = req.user.id;
    story.reviewComments = comments || 'Approved';
    story.reviewDate = new Date();

    await story.save();
    await story.populate('submittedBy', 'fullName email');

    // Create notification for user
    await Notification.create({
      recipientId: story.submittedBy._id,
      type: 'story_approved',
      title: 'Your Story Was Approved! 🎉',
      message: `Your story "${story.title}" has been approved and published.`,
      relatedId: story._id,
      relatedType: 'Story',
      priority: 'high',
      shouldSendEmail: true
    });

    res.status(200).json({
      success: true,
      message: 'Story approved and published',
      story
    });

  } catch (error) {
    console.error('Error approving story:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving story',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: REJECT STORY
// ===================================
export const rejectStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { reason, comments } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can reject stories'
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Update story
    story.status = 'Rejected';
    story.reviewedBy = req.user.id;
    story.reviewComments = `Reason: ${reason}\n\nComments: ${comments || 'See reason above'}`;
    story.reviewDate = new Date();
    story.isPublished = false;

    await story.save();
    await story.populate('submittedBy', 'fullName email');

    // Create notification for user
    await Notification.create({
      recipientId: story.submittedBy._id,
      type: 'story_rejected',
      title: 'Story Review - Changes Requested',
      message: `Your story "${story.title}" requires adjustments.\n\nReason: ${reason}`,
      relatedId: story._id,
      relatedType: 'Story',
      priority: 'medium',
      shouldSendEmail: true
    });

    res.status(200).json({
      success: true,
      message: 'Story rejected',
      story
    });

  } catch (error) {
    console.error('Error rejecting story:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting story',
      error: error.message
    });
  }
};

// ===================================
// GET PUBLISHED STORIES (for reading)
// ===================================
export const getPublishedStories = async (req, res) => {
  try {
    const { category } = req.query;

    let query = { isPublished: true, status: 'Approved' };
    if (category) {
      query.category = category;
    }

    const stories = await Story.find(query)
      .populate('submittedBy', 'fullName')
      .populate('comments.commentedBy', 'fullName')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      stories
    });

  } catch (error) {
    console.error('Error fetching published stories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
};

// ===================================
// USER: LIKE STORY
// ===================================
export const likeStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if already liked
    const alreadyLiked = story.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      story.likes = story.likes.filter(id => id.toString() !== userId);
      await story.save();

      return res.status(200).json({
        success: true,
        message: 'Story unliked',
        liked: false,
        likeCount: story.likes.length
      });
    } else {
      // Like
      story.likes.push(userId);
      await story.save();

      res.status(200).json({
        success: true,
        message: 'Story liked',
        liked: true,
        likeCount: story.likes.length
      });
    }

  } catch (error) {
    console.error('Error liking story:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking story',
      error: error.message
    });
  }
};

// ===================================
// USER: COMMENT ON STORY
// ===================================
export const commentOnStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Add comment
    story.comments.push({
      text: text.trim(),
      commentedBy: userId
    });

    await story.save();
    await story.populate('comments.commentedBy', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comments: story.comments
    });

  } catch (error) {
    console.error('Error commenting on story:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// ===================================
// USER: DELETE OWN STORY
// ===================================
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check ownership
    if (story.submittedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own stories'
      });
    }

    await Story.findByIdAndDelete(storyId);

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting story',
      error: error.message
    });
  }
};

// ===================================
// USER: SHARE STORY
// ===================================
export const shareStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Increment share count
    story.shares += 1;
    await story.save();

    res.status(200).json({
      success: true,
      message: 'Share counted',
      shares: story.shares
    });

  } catch (error) {
    console.error('Error sharing story:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing story',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: GET STORY STATISTICS
// ===================================
export const getStoryStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view statistics'
      });
    }

    const totalStories = await Story.countDocuments();
    const approvedStories = await Story.countDocuments({ status: 'Approved', isPublished: true });
    const pendingStories = await Story.countDocuments({ status: 'Pending Review' });
    const rejectedStories = await Story.countDocuments({ status: 'Rejected' });

    res.status(200).json({
      success: true,
      stats: {
        totalStories,
        approvedStories,
        pendingStories,
        rejectedStories
      }
    });

  } catch (error) {
    console.error('Error getting story stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting statistics',
      error: error.message
    });
  }
};
