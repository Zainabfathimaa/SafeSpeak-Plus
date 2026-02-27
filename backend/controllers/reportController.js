import Report from '../models/Report.js';
import User from '../models/User.js';

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
            riskLevel: 'Medium' // Default risk level, can be updated by AI or Admin later
        });

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
