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
        enum: ['Pending Validation', 'Needs Info', 'Open', 'In-Review', 'In-Progress', 'Resolved', 'Escalated', 'Closed', 'Appealed', 'Archived/Spam'],
        default: 'Pending Validation'
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
    }],

    // ===================================
    // AUTHENTICITY & VERIFICATION TRACKING
    // ===================================

    // Admin review/verification status
    verificationStatus: {
        type: String,
        enum: ['Unverified', 'Verified', 'Under Review', 'Requires Clarification', 'Flagged'],
        default: 'Unverified'
    },

    // Authenticity score (0-100)
    // Automatically calculated based on:
    // - Evidence completeness
    // - Detail level
    // - Description clarity
    // - Time consistency
    authenticityScore: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
    },

    // Flags for suspicious reports
    flags: [{
        reason: {
            type: String,
            enum: ['Duplicate Report', 'Suspicious Details', 'Consistency Issues', 'Insufficient Evidence', 'Potential False Accusation'],
            required: true
        },
        flaggedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        flaggedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],

    // Has admin confirmed authenticity?
    isVerifiedAuthentic: {
        type: Boolean,
        default: false
    },

    // User has given permission to reveal their identity
    userConsentedIdReveal: {
        type: Boolean,
        default: false
    },

    // Affected person information (for admins to identify false accusations)
    affectedParty: {
        name: String,
        email: String,
        department: String
    },

    // User's confidence level in this report
    confidence: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },

    // ===================================
    // ESCALATION DETAILS
    // ===================================
    escalationDetails: {
        isEscalated: {
            type: Boolean,
            default: false
        },
        escalatedTo: {
            type: String,
            default: null
        },
        message: {
            type: String,
            default: null
        },
        identityDisclosed: {
            type: Boolean,
            default: false
        },
        escalatedAt: {
            type: Date,
            default: null
        }
    }

}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
