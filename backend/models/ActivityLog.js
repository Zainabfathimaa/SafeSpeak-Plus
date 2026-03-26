import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['story_posted', 'story_liked', 'story_deleted', 'report_submitted', 'report_escalated', 'story_liked_by_other', 'story_edited'],
    required: true
  },
  targetType: {
    type: String, // 'Story' or 'Report'
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: Object, // Flexible for extra metadata (e.g. title of story, reportId)
    default: {}
  }
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
