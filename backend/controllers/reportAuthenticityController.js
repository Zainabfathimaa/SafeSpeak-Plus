import Report from '../models/Report.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * ===================================
 * REPORT AUTHENTICITY & VERIFICATION CONTROLLER
 * ===================================
 * Prevents false accusations and fake reports
 * Admins can verify authenticity and set risk levels
 */

// ===================================
// CALCULATE AUTHENTICITY SCORE
// ===================================
const calculateAuthenticityScore = (report) => {
  let score = 50; // Start at 50 (neutral)

  // Check completeness of report
  const hasLocation = report.location && report.location.trim().length > 0;
  const hasDescription = report.description && report.description.trim().length > 100;
  const hasEvidence = report.evidenceFiles && report.evidenceFiles.length > 0;
  const hasInvolvedParties = report.involvedParties && report.involvedParties.trim().length > 0;
  const hasTime = report.time && report.time.trim().length > 0;

  if (hasLocation) score += 10;
  if (hasDescription) score += 10;
  if (hasEvidence) score += 15;
  if (hasInvolvedParties) score += 10;
  if (hasTime) score += 5;

  // Check date consistency
  const reportDate = new Date(report.date);
  const today = new Date();
  const daysDifference = Math.floor((today - reportDate) / (1000 * 60 * 60 * 24));

  // Recent reports (within 7 days) are more likely authentic
  if (daysDifference <= 7) score += 10;
  else if (daysDifference <= 30) score += 5;
  else if (daysDifference > 365) score -= 10; // Old reports might be less reliable

  // Check description quality
  const descriptionWords = report.description.split(/\s+/).length;
  if (descriptionWords >= 50) score += 10;
  if (descriptionWords >= 100) score += 5;

  // Ensure score stays in 0-100 range
  return Math.max(0, Math.min(100, score));
};

// ===================================
// ADMIN: VERIFY REPORT AUTHENTICITY
// ===================================
export const verifyReportAuthenticity = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { verificationStatus, flags, isVerifiedAuthentic, affectedParty } = req.body;

    // Check admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can verify reports'
      });
    }

    const report = await Report.findById(reportId)
      .populate('submittedBy.userId', 'email fullName');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Calculate authenticity score
    const authenticityScore = calculateAuthenticityScore(report);

    // Update report
    report.authenticityScore = authenticityScore;
    report.verificationStatus = verificationStatus || 'Under Review';
    report.isVerifiedAuthentic = isVerifiedAuthentic || false;

    if (affectedParty) {
      report.affectedParty = affectedParty;
    }

    // Add flags if provided
    if (flags && Array.isArray(flags)) {
      flags.forEach(flag => {
        if (!report.flags.find(f => f.reason === flag.reason)) {
          report.flags.push({
            reason: flag.reason,
            flaggedBy: req.user.id,
            notes: flag.notes
          });
        }
      });
    }

    await report.save();

    // Create notification for user
    if (report.submittedBy.userId) {
      const message = isVerifiedAuthentic 
        ? 'Your report has been verified and is being processed.'
        : `Your report is under review. Authenticity Score: ${authenticityScore}/100`;

      await Notification.create({
        recipientId: report.submittedBy.userId._id,
        type: 'verification_required',
        title: 'Report Verification Status Updated',
        message,
        relatedId: report._id,
        relatedType: 'Report',
        priority: flags && flags.length > 0 ? 'high' : 'medium',
        shouldSendEmail: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report verification updated',
      report: {
        _id: report._id,
        reportId: report.reportId,
        authenticityScore: report.authenticityScore,
        verificationStatus: report.verificationStatus,
        isVerifiedAuthentic: report.isVerifiedAuthentic,
        flags: report.flags,
        affectedParty: report.affectedParty
      }
    });

  } catch (error) {
    console.error('Error verifying report:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying report',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: SET REPORT RISK LEVEL
// ===================================
export const setReportRiskLevel = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { riskLevel } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can set risk levels'
      });
    }

    const validRiskLevels = ['Low', 'Medium', 'High', 'Critical'];
    if (!validRiskLevels.includes(riskLevel)) {
      return res.status(400).json({
        success: false,
        message: `Risk level must be one of: ${validRiskLevels.join(', ')}`
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.riskLevel = riskLevel;
    await report.save();

    // Create notification
    if (report.submittedBy.userId) {
      await Notification.create({
        recipientId: report.submittedBy.userId,
        type: 'report_status_updated',
        title: 'Report Risk Level Updated',
        message: `Your report has been classified as ${riskLevel} risk.`,
        relatedId: report._id,
        relatedType: 'Report',
        priority: riskLevel === 'Critical' ? 'critical' : 'medium',
        shouldSendEmail: true
      });
    }

    res.status(200).json({
      success: true,
      message: `Risk level set to ${riskLevel}`,
      report: {
        _id: report._id,
        reportId: report.reportId,
        riskLevel: report.riskLevel
      }
    });

  } catch (error) {
    console.error('Error setting risk level:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting risk level',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: FLAG SUSPICIOUS REPORT
// ===================================
export const flagSuspiciousReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { reason, notes } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can flag reports'
      });
    }

    const validReasons = [
      'Duplicate Report',
      'Suspicious Details',
      'Consistency Issues',
      'Insufficient Evidence',
      'Potential False Accusation'
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: `Reason must be one of: ${validReasons.join(', ')}`
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if already flagged with this reason
    const alreadyFlagged = report.flags.some(f => f.reason === reason);
    if (alreadyFlagged) {
      return res.status(400).json({
        success: false,
        message: 'Report already flagged with this reason'
      });
    }

    // Add flag
    report.flags.push({
      reason,
      flaggedBy: req.user.id,
      notes
    });

    // Lower authenticity score for flagged reports
    report.authenticityScore = Math.max(0, report.authenticityScore - 20);
    report.verificationStatus = 'Requires Clarification';

    await report.save();

    // Notify user
    if (report.submittedBy.userId) {
      await Notification.create({
        recipientId: report.submittedBy.userId,
        type: 'verification_required',
        title: 'Additional Information Needed',
        message: `Your report requires clarification. Reason: ${reason}. ${notes ? `Note: ${notes}` : ''}`,
        relatedId: report._id,
        relatedType: 'Report',
        priority: 'high',
        shouldSendEmail: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report flagged successfully',
      flag: {
        reason,
        notes,
        flaggedAt: new Date()
      },
      authenticityScore: report.authenticityScore
    });

  } catch (error) {
    console.error('Error flagging report:', error);
    res.status(500).json({
      success: false,
      message: 'Error flagging report',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: GET AUTHENTICITY METRICS
// ===================================
export const getAuthenticityMetrics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view metrics'
      });
    }

    const totalReports = await Report.countDocuments();
    const verifiedReports = await Report.countDocuments({ isVerifiedAuthentic: true });
    const flaggedReports = await Report.countDocuments({ 'flags.0': { $exists: true } });
    const avgAuthenticityScore = await Report.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$authenticityScore' }
        }
      }
    ]);

    const riskDistribution = await Report.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalReports,
        verifiedReports,
        verificationRate: `${((verifiedReports / totalReports) * 100).toFixed(2)}%`,
        flaggedReports,
        flagRate: `${((flaggedReports / totalReports) * 100).toFixed(2)}%`,
        avgAuthenticityScore: avgAuthenticityScore[0]?.avgScore?.toFixed(2) || 0,
        riskDistribution
      }
    });

  } catch (error) {
    console.error('Error getting authenticity metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting metrics',
      error: error.message
    });
  }
};

// ===================================
// ADMIN: GET REPORTS WITH LOW AUTHENTICITY
// ===================================
export const getLowAuthenticityReports = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view reports'
      });
    }

    const { threshold = 40 } = req.query; // Default: authenticity score < 40

    const reports = await Report.find({
      $or: [
        { authenticityScore: { $lt: parseInt(threshold) } },
        { 'flags.0': { $exists: true } },
        { verificationStatus: 'Requires Clarification' }
      ]
    })
      .populate('submittedBy.userId', 'email fullName anonymousCode')
      .populate('flags.flaggedBy', 'fullName')
      .sort({ authenticityScore: 1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });

  } catch (error) {
    console.error('Error getting low authenticity reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};
