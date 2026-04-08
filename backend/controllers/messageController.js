import Message from '../models/Message.js';
import Report from '../models/Report.js';

// @desc    Get all conversation threads for the current user
// @route   GET /api/messages
// @access  Private
export const getConversations = async (req, res) => {
    try {
        const { userId, role } = req.user;

        // Admins / staff see all reports that have messages, users see only their own
        let reportFilter = {};
        if (role === 'user') {
            reportFilter = { 'submittedBy.userId': userId };
        }

        // Get reports that qualify
        const reports = await Report.find(reportFilter).select('reportId incidentType status submittedBy').lean();
        const reportIds = reports.map(r => r._id);

        // Get the latest message per report
        const latestMessages = await Message.aggregate([
            { $match: { reportId: { $in: reportIds } } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$reportId',
                    lastMessage: { $first: '$text' },
                    lastSenderRole: { $first: '$senderRole' },
                    lastTime: { $first: '$createdAt' },
                    messageCount: { $sum: 1 }
                }
            }
        ]);

        // Build a map for quick lookup
        const messageMap = {};
        latestMessages.forEach(m => {
            messageMap[m._id.toString()] = m;
        });

        // Build conversation list
        const conversations = reports
            .filter(r => messageMap[r._id.toString()]) // only reports with messages
            .map(report => {
                const msg = messageMap[report._id.toString()];
                return {
                    id: report._id,
                    subject: `Report: ${report.incidentType}`,
                    reportId: report.reportId,
                    lastMessage: msg.lastMessage,
                    lastSenderRole: msg.lastSenderRole,
                    lastTime: msg.lastTime,
                    messageCount: msg.messageCount,
                    status: report.status
                };
            })
            .sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations', error: error.message });
    }
};

// @desc    Get all messages for a specific report
// @route   GET /api/messages/:reportId
// @access  Private
export const getMessagesByReport = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const report = await Report.findById(req.params.reportId);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Permission check: users can only see messages on their own reports
        if (role === 'user' && report.submittedBy?.userId?.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to view these messages' });
        }

        const messages = await Message.find({ reportId: req.params.reportId })
            .populate('sender', 'fullName email role idRevealConsent anonymousCode')
            .sort({ createdAt: 1 });

        const processedMessages = messages.map(msg => {
            const msgObj = msg.toObject();
            if (msgObj.sender && msgObj.sender.role === 'user' && !msgObj.sender.idRevealConsent) {
                msgObj.sender.email = `Hidden (${msgObj.sender.anonymousCode || 'Anonymous'})`;
                msgObj.sender.fullName = 'Anonymous User';
            }
            return msgObj;
        });

        res.status(200).json({ success: true, messages: processedMessages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
    }
};

// @desc    Send a new message on a report thread
// @route   POST /api/messages/:reportId
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: 'Message text is required' });
        }

        const report = await Report.findById(req.params.reportId);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Permission check
        if (role === 'user' && report.submittedBy?.userId?.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to message on this report' });
        }

        const message = await Message.create({
            reportId: req.params.reportId,
            sender: userId,
            senderRole: role,
            text: text.trim(),
            readBy: [userId] // sender has read it
        });

        // Populate sender info before returning
        await message.populate('sender', 'fullName email role idRevealConsent anonymousCode');

        const msgObj = message.toObject();
        if (msgObj.sender && msgObj.sender.role === 'user' && !msgObj.sender.idRevealConsent) {
            msgObj.sender.email = `Hidden (${msgObj.sender.anonymousCode || 'Anonymous'})`;
            msgObj.sender.fullName = 'Anonymous User';
        }

        res.status(201).json({ success: true, message: msgObj });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
};

export default { getConversations, getMessagesByReport, sendMessage };
