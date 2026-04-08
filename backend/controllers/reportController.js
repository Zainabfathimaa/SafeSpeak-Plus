import Report from '../models/Report.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
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
            course,
            files,
            userConsentedIdReveal
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
            course: course || null,
            involvedParties,
            evidenceFiles: files || [],
            submittedBy,
            status: 'Open',
            riskLevel: 'Pending', // User requested 'Pending' as default until manually reviewed
            userConsentedIdReveal: userConsentedIdReveal === true, // Explicitly set from request
            flags: initialFlags,
            authenticityScore: Math.max(0, initialAuthScore),
            verificationStatus
        });

        // NOTIFICATION: Notify the user that their report was submitted
        if (req.user.userId) {
            try {
                await Notification.create({
                    recipientId: req.user.userId,
                    type: 'system_alert',
                    title: 'Incident Reported Successfully ✅',
                    message: `Your report (${reportId}) has been securely submitted. You can track its progress in your dashboard.`,
                    relatedId: report._id,
                    relatedType: 'Report',
                    priority: 'medium',
                    shouldSendEmail: true
                });
            } catch (err) {
                console.error('Failed to notify user of new report:', err);
            }
        }

        // NOTIFICATION: Notify all admins about the new report
        try {
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                await Notification.create({
                    recipientId: admin._id,
                    type: 'system_alert',
                    title: 'New Incident Reported 🔴',
                    message: `A new ${incidentType} case (${reportId}) has been submitted and is awaiting initial review.`,
                    relatedId: report._id,
                    relatedType: 'Report',
                    priority: 'medium'
                });
            }
        } catch (notifErr) {
            console.error('Failed to notify admins of new report:', notifErr);
        }

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

        try {
            await ActivityLog.create({
                userId: req.user.userId,
                action: 'report_submitted',
                targetType: 'Report',
                targetId: report._id,
                details: { reportId: report.reportId, incidentType: report.incidentType }
            });
        } catch (logErr) {
            console.error('Activity Log Error:', logErr);
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

        const reports = await Report.find(filter)
            .populate('submittedBy.userId', 'fullName email idRevealConsent anonymousCode')
            .sort({ createdAt: -1 });

        // Hide user identity if not consented
        const processedReports = reports.map(report => {
            const reportObj = report.toObject();
            
            // Check if identity should be revealed
            // It should be revealed if the user has consented for THIS report
            // OR if the user has a global profile setting to reveal identity
            const isRevealed = reportObj.userConsentedIdReveal === true || 
                               (reportObj.submittedBy?.userId?.idRevealConsent === true);
            reportObj.isIdentityRevealed = isRevealed;

            if (reportObj.submittedBy?.userId && !isRevealed) {
                reportObj.submittedBy.userId.email = `Hidden (${reportObj.submittedBy.anonymousCode || 'Anonymous'})`;
                reportObj.submittedBy.userId.fullName = 'Anonymous User';
                // Also remove sensitive phone if exists
                if (reportObj.submittedBy.userId.phone) reportObj.submittedBy.userId.phone = 'Hidden';
            }
            return reportObj;
        });

        res.status(200).json({
            success: true,
            count: processedReports.length,
            reports: processedReports
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
        const mongoose = (await import('mongoose')).default;
        const id = req.params.id;
        let query;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { reportId: id };
        }
        const report = await Report.findOne(query).populate('submittedBy.userId', 'fullName email idRevealConsent anonymousCode');

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Check permission (Admin can see all, User can only see their own)
        const reportUserId = report.submittedBy?.userId?._id?.toString() || report.submittedBy?.userId?.toString();
        
        // If it's a user, they must be the owner
        if (req.user.role === 'user') {
            const currentUserId = req.user.userId?.toString();
            // If the report belongs to someone else, block it
            if (reportUserId && reportUserId !== currentUserId) {
                return res.status(403).json({ success: false, message: 'Not authorized to view this report' });
            }
            // If the report has no userId but matches the user's anonymousCode (fallback)
            if (!reportUserId && report.submittedBy?.anonymousCode !== req.user.anonymousCode) {
                 // But wait, the authenticate middleware should have linked the user. 
                 // If not, we check the anonymousCode if it exists on the user.
                 // For now, let's keep it simple: if there's no owner ID, we check if it matches their code
                 if (report.submittedBy?.anonymousCode !== req.user.anonymousCode) {
                    return res.status(403).json({ success: false, message: 'Not authorized to view this report' });
                 }
            }
        }

        const reportObj = report.toObject();

        // Check if identity should be revealed
        // A report's identity is revealed if the user specifically consented for this report 
        // OR if the user has a global consent setting in their profile
        const isRevealed = reportObj.userConsentedIdReveal === true || 
                           (reportObj.submittedBy?.userId?.idRevealConsent === true);
        reportObj.isIdentityRevealed = isRevealed;

        // Hide user identity if not consented
        if (reportObj.submittedBy?.userId && !isRevealed) {
            reportObj.submittedBy.userId.email = `Hidden (${reportObj.submittedBy.anonymousCode || 'Anonymous'})`;
            reportObj.submittedBy.userId.fullName = 'Anonymous User';
            if (reportObj.submittedBy.userId.phone) reportObj.submittedBy.userId.phone = 'Hidden';
        }

        res.status(200).json({
            success: true,
            report: reportObj
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
        const mongoose = (await import('mongoose')).default;
        const id = req.params.id;
        let query;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { reportId: id };
        }

        const report = await Report.findOne(query);

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

// @desc    Appeal a closed or archived report
// @route   POST /api/reports/:id/appeal
// @access  Private (User who submitted)
export const appealReport = async (req, res) => {
    try {
        const { evidence, reason } = req.body;
        const mongoose = (await import('mongoose')).default;
        const id = req.params.id;
        let query;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { reportId: id };
        }
        const report = await Report.findOne(query);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Check permission (Admin can see all, User can only see their own)
        const reportUserId = report.submittedBy?.userId?._id?.toString() || report.submittedBy?.userId?.toString();
        
        // If it's a user, they must be the owner
        if (req.user.role === 'user') {
            const currentUserId = req.user.userId?.toString();
            // If the report belongs to someone else and doesn't match anonymousCode, block it
            const isOwner = reportUserId === currentUserId || ( !reportUserId && report.submittedBy?.anonymousCode === req.user.anonymousCode);
            
            if (!isOwner) {
                return res.status(403).json({ success: false, message: 'Not authorized to appeal this report' });
            }
        }

        // Prevent spam appeals
        if (report.status === 'Appealed') {
            return res.status(400).json({ success: false, message: 'This report is already under appeal review' });
        }

        report.status = 'Appealed';
        report.verificationStatus = 'Under Review';

        // Add appeal as a special comment/flag
        report.comments.push({
            text: `*** APPEAL REQUEST ***\nReason: ${reason}\nAdditional Context: ${evidence || 'None provided'}`,
            commentedBy: req.user.userId
        });

        await report.save();

        // Create notification for the user who submitted (if not completely anonymous or if userId provided)
        const userId = report.submittedBy?.userId;
        if (userId) {
            try {
                await Notification.create({
                    recipientId: userId,
                    type: 'system_alert',
                    title: 'Report Appealed Successfully ✅',
                    message: `Your appeal for report (Ref: ${report.reportId}) has been submitted and is under review.`,
                    relatedId: report._id,
                    relatedType: 'Report',
                    priority: 'medium',
                    shouldSendEmail: true
                });
            } catch (notifErr) {
                console.error('Failed to create user notification for report appeal:', notifErr);
            }
        }

        // Notify admins
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            await Notification.create({
                recipientId: admin._id,
                type: 'system_alert',
                title: 'Report Appealed',
                message: `A user has appealed report ${report.reportId}. Secondary review required.`,
                relatedId: report._id,
                relatedType: 'Report',
                priority: 'high',
                shouldSendEmail: false
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appeal submitted successfully',
            report
        });

    } catch (error) {
        console.error('Error appealing report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit appeal',
            error: error.message
        });
    }
};

// @desc    Escalate a report to a super admin
// @route   POST /api/reports/:id/escalate
// @access  Private (User who submitted)
export const escalateReport = async (req, res) => {
    try {
        const { message, contactMethod, contactValue, proofImageBase64 } = req.body;
        
        const mongoose = (await import('mongoose')).default;
        const id = req.params.id;
        let query;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { reportId: id };
        }
        const report = await Report.findOne(query);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Check permission (Admin can see all, User can only see their own)
        const reportUserId = report.submittedBy?.userId?._id?.toString() || report.submittedBy?.userId?.toString();
        
        // If it's a user, they must be the owner
        if (req.user.role === 'user') {
            const currentUserId = req.user.userId?.toString();
            // If the report belongs to someone else and doesn't match anonymousCode, block it
            const isOwner = reportUserId === currentUserId || ( !reportUserId && report.submittedBy?.anonymousCode === req.user.anonymousCode);
            
            if (!isOwner) {
                return res.status(403).json({ success: false, message: 'Not authorized to escalate this report' });
            }
        }

        if (report.escalationDetails?.isEscalated) {
            return res.status(400).json({ success: false, message: 'This report has already been escalated.' });
        }

        // Dynamic import of dependencies
        let PDFDocument;
        let axios;
        try {
            PDFDocument = (await import('pdfkit')).default;
            axios = (await import('axios')).default;
        } catch (e) {
            console.error("Dependencies not found, ensure they are installed", e);
            return res.status(500).json({ success: false, message: 'Required libraries missing.' });
        }

        // Create PDF Promise to prevent unhandled promise rejections hanging the server
        const generatePdfBuffer = () => new Promise(async (resolve, reject) => {
            const doc = new PDFDocument();
            const pdfChunks = [];

            doc.on('data', chunk => pdfChunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(pdfChunks)));
            doc.on('error', err => reject(err));

            // Build the PDF Content
            doc.fontSize(20).text('SafeSpeak+ Official Escalation File', { align: 'center' });
            doc.moveDown(2);

            // PART 1: COMPLAINT AGAINST ADMIN
            doc.fontSize(16).fillColor('red').text('PART 1: COMPLAINT AGAINST ADMINISTRATION', { underline: true });
            doc.moveDown();
            
            // Show real identity since it's disclosed
            const userEmail = req.user.email || 'N/A';
            const userName = req.user.fullName || 'Anonymous Registered User';
            
            doc.fontSize(12).fillColor('black').text(`Escalated by: ${userName} (${userEmail})`);
            doc.moveDown();
            doc.fontSize(12).text('Grievance / Reason for Escalation:');
            doc.text(message || 'No additional message provided by user.', { italic: true });
            doc.moveDown(2);

            // PART 2: ORIGINAL MAIN ISSUE
            doc.fontSize(16).fillColor('blue').text('PART 2: ORIGINAL INCIDENT DETAILS (THE MAIN ISSUE)', { underline: true });
            doc.moveDown();
            doc.fontSize(12).fillColor('black').text(`Report ID: ${report.reportId}`);
            doc.text(`Incident Type: ${report.incidentType}`);
            doc.text(`Severity Level: ${report.riskLevel}`);
            doc.text(`Location: ${report.location} (${report.department})`);
            doc.text(`Date & Time: ${report.date} ${report.time || ''}`);
            doc.moveDown();

            doc.fontSize(14).text('Original Description Submitted:', { underline: true });
            doc.fontSize(12).text(report.description);
            doc.moveDown();

            if (report.involvedParties) {
                doc.fontSize(14).text('Involved Parties:', { underline: true });
                doc.fontSize(12).text(report.involvedParties);
                doc.moveDown();
            }

            if (proofImageBase64) {
                try {
                    doc.addPage();
                    doc.fontSize(14).text('Escalation Proof / Supporting Screenshot (Complaint against Admin):', { underline: true });
                    doc.moveDown();
                    
                    const base64Data = proofImageBase64.replace(/^data:image\/\w+;base64,/, "");
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    
                    doc.image(imageBuffer, {
                        fit: [500, 600],
                        align: 'center',
                        valign: 'center'
                    });
                } catch (imgErr) {
                    console.error('Failed to embed proof image:', imgErr);
                    doc.text('\n[Error: Failed to embed the escalation proof image.]', { color: 'red' });
                }
            }

            // ADD ORIGINAL REPORT IMAGES IF ANY
            if (report.evidenceFiles && report.evidenceFiles.length > 0) {
                for (const file of report.evidenceFiles) {
                    if (file.fileType?.includes('image') || file.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        try {
                            const response = await axios.get(file.fileUrl, { responseType: 'arraybuffer' });
                            const imgBuffer = Buffer.from(response.data, 'utf-8');
                            
                            doc.addPage();
                            doc.fontSize(14).text(`Original Evidence: ${file.fileName}`, { underline: true });
                            doc.moveDown();
                            
                            doc.image(imgBuffer, {
                                fit: [500, 600],
                                align: 'center',
                                valign: 'center'
                            });
                        } catch (err) {
                            console.warn(`Failed to fetch original image for PDF: ${file.fileUrl}`, err.message);
                        }
                    }
                }
            }

            doc.fillColor('grey').text('This document was automatically generated by the SafeSpeak+ platform upon user escalation.', { align: 'center' });
            doc.end();
        });

        const pdfBuffer = await generatePdfBuffer();

        // Mark report as escalated
        report.status = 'Escalated';
        report.escalationDetails = {
            isEscalated: true,
            escalatedTo: contactValue,
            contactMethod: contactMethod,
            message: message,
            identityDisclosed: true,
            escalatedAt: new Date(),
            pdfContent: pdfBuffer // Storing buffer in mongo for easy retrieval later! Serverless-safe!
        };

        await report.save();

        // Activity Log
        try {
            await ActivityLog.create({
                userId: req.user.userId,
                action: 'report_escalated',
                targetType: 'Report',
                targetId: report._id,
                details: { reportId: report.reportId, contactMethod, contactValue }
            });
        } catch (logErr) {
            console.error('Activity Log Error:', logErr);
        }

        // Notify user of status change and ID disclosure
        await Notification.create({
            recipientId: req.user.userId,
            type: 'system_alert',
            title: 'Case Escalated',
            message: `Your report (${report.reportId}) was escalated to ${contactValue}. Note: Anonymity has been lifted for this higher-level review.`,
            relatedId: report._id,
            relatedType: 'Report',
            priority: 'high',
            shouldSendEmail: true
        });

        if (contactMethod === 'email') {
            // Dispatch Email to Admin
            const subject = `URGENT: Escalated Incident Report - ${report.reportId}`;
            const emailMessage = `
Hello,

An incident report has been escalated to you by a user on the SafeSpeak+ platform. 
They claim standard procedures have failed or they require urgent higher-level review.

Escalation Message from User:
-------------------------------------------
${message || 'No additional message provided.'}
-------------------------------------------

Please find the full case details attached as a PDF. Note: The user's identity has been disclosed for this review and will be visible if they were a registered user.

Best Regards,
SafeSpeak+ System Security
            `;

            const attachments = [
                {
                    filename: `SafeSpeak_Escalation_${report.reportId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ];

            try {
                const emailService = (await import('../utils/emailService.js')).default;
                const result = await emailService.sendEmail(
                    contactValue,
                    subject,
                    emailMessage,
                    null, // html (will default to text)
                    attachments
                );
                
                if (!result.success) {
                    throw new Error(result.message);
                }
            } catch (err) {
                console.error('Failed to send escalated email with PDF:', err);
                return res.status(500).json({ success: false, message: 'Escalation recorded, but failed to send the email. ' + err.message });
            }

            return res.status(200).json({
                success: true,
                message: `Report successfully escalated. A PDF has been dispatched via email to ${contactValue}.`,
                report
            });

        } else if (contactMethod === 'whatsapp') {
            // Generate WhatsApp Link
            const backendUrl = process.env.BACKEND_URL || 'https://safespeak-plus.onrender.com'; 
            // Using the new unique root-level path to avoid route shadowing conflicts
            const pdfDownloadUrl = `${backendUrl}/api/escalation/download/${report._id}`;
            
            const waMessage = `🚨 *URGENT ESCALATION: SafeSpeak+ Incident*\n\n*Report ID:* ${report.reportId}\n*User Message:* ${message || 'N/A'}\n\n🔓 *Action Required:* Please review the secure PDF report details here:\n${pdfDownloadUrl}\n\n_Note: This link leads to a professionally generated incident report summary._`;
            
            // Clean phone number (remove +, spaces, dashes)
            const cleanPhone = contactValue.replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

            return res.status(200).json({
                success: true,
                message: 'Report successfully escalated. WhatsApp link generated.',
                whatsappUrl,
                report
            });
        }

    } catch (error) {
        console.error('Error escalating report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to escalate report',
            error: error.message
        });
    }
};

// @desc    Download the escalated PDF
// @route   GET /api/reports/:id/escalation-pdf
// @access  Public (or protected if token provided, but WA links need it public theoretically. For security, we can make it public if ID is known)
export const getEscalationPdf = async (req, res) => {
    try {
        console.log(`[DEBUG] Escalation PDF requested for ID: ${req.params.id}`);
        const mongoose = (await import('mongoose')).default;
        const id = req.params.id;
        let query;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { reportId: id };
        }
        const report = await Report.findOne(query);
        
        if (!report) {
            console.log(`[DEBUG] Report not found for query:`, query);
            return res.status(404).send('Report not found in database.');
        }

        if (!report.escalationDetails || !report.escalationDetails.pdfContent) {
            console.log(`[DEBUG] Escalation details or PDF content missing for report:`, report.reportId);
            return res.status(404).send('Escalation PDF content not found in document.');
        }

        console.log(`[DEBUG] Serving PDF buffer for report: ${report.reportId}, size: ${report.escalationDetails.pdfContent.length} bytes`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="SafeSpeak_Escalation_${report.reportId}.pdf"`);
        
        // Serve buffer directly
        res.send(report.escalationDetails.pdfContent);
    } catch (error) {
        res.status(500).send('Error retrieving PDF');
    }
};

export default {
    createReport,
    getAllReports,
    getUserReports,
    getReportById,
    updateReportStatus,
    appealReport,
    escalateReport,
    getEscalationPdf
};
