import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    // The report this message thread belongs to
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true,
        index: true
    },

    // Who sent the message
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Role snapshot at time of sending (for display purposes)
    senderRole: {
        type: String,
        enum: ['user', 'admin', 'counsellor', 'executive', 'compliance-officer', 'department-head', 'system'],
        required: true
    },

    // The message body
    text: {
        type: String,
        required: [true, 'Message text is required'],
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },

    // Whether the message has been read by the recipient(s)
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Whether the message has been delivered to the recipient(s)
    deliveredTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Index for efficient conversation queries
messageSchema.index({ reportId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
