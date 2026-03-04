import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Who receives this notification
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // What type of notification
  type: {
    type: String,
    enum: [
      'report_status_updated',
      'story_approved',
      'story_rejected',
      'message_received',
      'report_escalated',
      'new_comment',
      'admin_assignment',
      'verification_required',
      'system_alert'
    ],
    required: true
  },

  // Title shown to user
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Description/details
  message: {
    type: String,
    required: true,
    trim: true
  },

  // Link to related resource (report, story, etc.)
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null // Could be Report ID, Story ID, etc.
  },

  relatedType: {
    type: String,
    enum: ['Report', 'Story', 'Message', 'User'],
    default: null
  },

  // Notification status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  readAt: {
    type: Date,
    default: null
  },

  // Send settings
  shouldSendEmail: {
    type: Boolean,
    default: true
  },

  emailSent: {
    type: Boolean,
    default: false
  },

  emailSentAt: {
    type: Date,
    default: null
  },

  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }

}, {
  timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, type: 1 });
notificationSchema.index({ createdAt: -1 }); // For cleanup/archival

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
