import Report from '../models/Report.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/emailService.js';

// Helper to generate unique Report ID
// Example: SR-2024-001
const generateReportId = async () => {
    const year = new Date().getFullYear();
    const prefix = `SR-${year}`;

    // Find last report with this prefix
    const lastReport = await Report.findOne({ reportId: { $regex: prefix } })
        .sort({ createdAt: -1 });

    if (!lastReport) {
        return `${prefix}-001`;
    }

    // Extract number and increment
    const lastId = lastReport.reportId;
    const lastNumber = parseInt(lastId.split('-')[2]);
    const nextNumber = lastNumber + 1;

    // Pad with zeros (e.g., 5 -> 005)
    return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
};

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private (User/Anonymous)
export const createReport = async (req, res) => {
    try {
        const {
            incidentType,
            date,
            time,
            location,
            description,
            involvedParties,
            department,
            files
        } = req.body;

        // Generate Report ID
        const reportId = await generateReportId();

        // Determine submitter info
        // req.user is set by authMiddleware
        const submittedBy = {
            userId: req.user.userId,
            isAnonymous: req.user.isAnonymous || false,
            anonymousCode: req.user.anonymousCode
        };

        // Refine Fake-Report logic (check for duplicates within 24 hours)
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const recentDuplicate = await Report.findOne({
            incidentType,
            location,
            createdAt: { $gte: new Date(Date.now() - ONE_DAY) }
        });

        let initialFlags = [];
        let initialAuthScore = 50; // default base score
        let verificationStatus = 'Unverified';

        if (recentDuplicate) {
            initialFlags.push({
                reason: 'Duplicate Report',
                notes: `Auto-flagged: Similar incident reported recently (Report ID: ${recentDuplicate.reportId})`
            });
            initialAuthScore -= 20; // lower score for duplicate
            verificationStatus = 'Requires Clarification';
        }

        const report = await Report.create({
            reportId,
            incidentType,
            date,
            time,
            location,
            description,
            department: department || 'General', // Default if not provided
            involvedParties,
            evidenceFiles: files || [],
            submittedBy,
            status: 'Open',
            riskLevel: 'Medium', // Default risk level, can be updated by AI or Admin later
            flags: initialFlags,
            authenticityScore: Math.max(0, initialAuthScore),
            verificationStatus
        });

        // Flag the old report as well if it isn't already flagged
        if (recentDuplicate && !recentDuplicate.flags.some(f => f.reason === 'Duplicate Report')) {
            recentDuplicate.flags.push({
                reason: 'Duplicate Report',
                notes: `Auto-flagged: Similar incident reported recently (Report ID: ${report.reportId})`
            });
            recentDuplicate.authenticityScore = Math.max(0, recentDuplicate.authenticityScore - 20);
            recentDuplicate.verificationStatus = 'Requires Clarification';
            await recentDuplicate.save();
        }

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report
        });

    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit report',
            error: error.message
        });
    }
};

// @desc    Get all reports (Admin/Staff only)
// @route   GET /api/reports
// @access  Private (Admin/Staff)
export const getAllReports = async (req, res) => {
    try {
        const { status, riskLevel, department } = req.query;

        // Build filter object
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (riskLevel && riskLevel !== 'all') filter.riskLevel = riskLevel;
        if (department && department !== 'all') filter.department = department;

        const reports = await Report.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports',
            error: error.message
        });
    }
};

// @desc    Get logged in user's reports
// @route   GET /api/reports/my-reports
// @access  Private
export const getUserReports = async (req, res) => {
    try {
        const reports = await Report.find({ 'submittedBy.userId': req.user.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your reports',
            error: error.message
        });
    }
};

// @desc    Get single report details
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Check permission (Admin can see all, User can only see their own)
        if (req.user.role === 'user' && report.submittedBy?.userId?.toString() !== req.user.userId?.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this report' });
        }

        res.status(200).json({
            success: true,
            report
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report details',
            error: error.message
        });
    }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Private (Admin/Staff)
export const updateReportStatus = async (req, res) => {
    try {
        const { status, riskLevel, assignedTo } = req.body;

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        if (status) report.status = status;
        if (riskLevel) report.riskLevel = riskLevel;
        if (assignedTo) report.assignedTo = assignedTo;

        await report.save();

        // Populate submittedBy to get user details
        await report.populate('submittedBy.userId', 'email fullName');

        // Send email notification if status changed
        if (status && report.submittedBy?.userId) {
            const user = report.submittedBy.userId;

            // Create in-app notification
            const notif = await Notification.create({
                recipientId: user._id,
                type: 'report_status_updated',
                title: 'Report Status Updated',
                message: `Your report (${report.reportId}) status has been updated to: ${status}`,
                relatedId: report._id,
                relatedType: 'Report',
                priority: 'medium',
                shouldSendEmail: true
            });

            // Send email if user has email
            if (user.email) {
                const subject = `Update on your Report ${report.reportId}`;
                const emailMessage = `
Hello ${user.fullName || 'User'},

The status of your report (${report.reportId}) has been updated.

New Status: ${status}
${riskLevel ? `New Risk Level: ${riskLevel}` : ''}

Log in to your dashboard to view more details.

Thank you,
SafeSpeak Admin Team
                `;

                sendEmail(user.email, subject, emailMessage).catch(err =>
                    console.error('Failed to send report status email:', err)
                );
            }
        }

        res.status(200).json({
            success: true,
            message: 'Report updated successfully',
            report
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update report',
            error: error.message
        });
    }
};

//Export all as default object as well for flexibility
export default {
    createReport,
    getAllReports,
    getUserReports,
    getReportById,
    updateReportStatus
};
