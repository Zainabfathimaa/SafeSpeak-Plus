import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  // Story metadata
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [100, 'Story title cannot exceed 100 characters']
  },

  content: {
    type: String,
    required: [true, 'Story content is required'],
    trim: true,
    maxlength: [5000, 'Story cannot exceed 5000 characters']
  },

  // Who submitted this story
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Story classification
  category: {
    type: String,
    enum: ['Personal Experience', 'Awareness', 'Support', 'Guidance', 'Other'],
    default: 'Personal Experience'
  },

  // Review status
  status: {
    type: String,
    enum: ['Draft', 'Pending Review', 'Approved', 'Rejected'],
    default: 'Draft'
  },

  // Admin review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  reviewComments: {
    type: String,
    trim: true,
    default: null
  },

  reviewDate: {
    type: Date,
    default: null
  },

  // Featured story?
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Engagement
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  comments: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  shares: {
    type: Number,
    default: 0
  },

  // Images (if story has images)
  images: [{
    imageUrl: String,
    caption: String
  }],

  // Visibility
  isPublished: {
    type: Boolean,
    default: false // Only show when approved and published
  }

}, {
  timestamps: true
});

// Index for efficient queries
storySchema.index({ submittedBy: 1, status: 1 });
storySchema.index({ status: 1, isPublished: 1 });
storySchema.index({ createdAt: -1 });

const Story = mongoose.model('Story', storySchema);

export default Story;
