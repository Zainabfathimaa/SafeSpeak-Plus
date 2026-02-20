import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true
    },
    incidentType: {
        type: String,
        required: true
    },
    date: {
        type: String, // Storing as string YYYY-MM-DD from frontend
        required: true
    },
    time: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: 'General'
    },
    involvedParties: {
        type: String,
        required: false
    },
    evidenceFiles: [{
        fileName: String,
        fileUrl: String,
        fileType: String
    }],
    status: {
        type: String,
        enum: ['Open', 'In-Review', 'In-Progress', 'Resolved', 'Escalated', 'Closed'],
        default: 'Open'
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    submittedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Can be null if purely anonymous without user account link (though our flow links them)
        },
        anonymousCode: {
            type: String,
            required: false
        },
        isAnonymous: {
            type: Boolean,
            default: false
        }
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    comments: [{
        text: String,
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
