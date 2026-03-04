import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Flag, TrendingUp } from 'lucide-react';
import reportAuthenticityService from '../../services/reportAuthenticityService';
import { useToast } from '../../hooks/useToast';

export const AdminReportAudit = ({ report, onUpdate }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showRiskLevelForm, setShowRiskLevelForm] = useState(false);
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState(report.riskLevel || 'Medium');
  const [flagData, setFlagData] = useState({
    reason: 'Suspicious Details',
    notes: ''
  });

  const handleSetRiskLevel = async () => {
    setIsLoading(true);
    try {
      const response = await reportAuthenticityService.setReportRiskLevel(report._id, selectedRiskLevel);
      if (response.success) {
        addToast('success', `Risk level set to ${selectedRiskLevel}`);
        setShowRiskLevelForm(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to update risk level');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlagReport = async () => {
    if (!flagData.reason) {
      addToast('warning', 'Please select a reason');
      return;
    }

    setIsLoading(true);
    try {
      const response = await reportAuthenticityService.flagSuspiciousReport(
        report._id,
        flagData.reason,
        flagData.notes
      );
      if (response.success) {
        addToast('success', 'Report flagged. User will be notified.');
        setShowFlagForm(false);
        setFlagData({ reason: 'Suspicious Details', notes: '' });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to flag report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAuthenticity = async () => {
    setIsLoading(true);
    try {
      const response = await reportAuthenticityService.verifyReportAuthenticity(
        report._id,
        {
          verificationStatus: 'Verified',
          isVerifiedAuthentic: true
        }
      );
      if (response.success) {
        addToast('success', 'Report marked as verified authentic');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to verify report');
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthenticityColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Report Audit & Verification</h3>

      {/* Authenticity Score */}
      <div className={`p-4 rounded-lg ${getAuthenticityColor(report.authenticityScore || 50)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Authenticity Score</p>
            <p className="text-2xl font-bold">{report.authenticityScore || 50}/100</p>
          </div>
          <TrendingUp size={32} className="opacity-50" />
        </div>
        <p className="text-xs mt-2 opacity-75">
          Based on evidence completeness, description quality, and report details
        </p>
      </div>

      {/* Risk Level */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-gray-900">Risk Level</p>
          <span className={`px-4 py-2 rounded-full font-medium text-sm ${getRiskLevelColor(report.riskLevel || 'Medium')}`}>
            {report.riskLevel || 'Not Set'}
          </span>
        </div>

        {!showRiskLevelForm ? (
          <button
            onClick={() => setShowRiskLevelForm(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Update Risk Level →
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Risk Level
              </label>
              <select
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">🟢 Low Risk</option>
                <option value="Medium">🟡 Medium Risk</option>
                <option value="High">🟠 High Risk</option>
                <option value="Critical">🔴 Critical Risk</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRiskLevelForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSetRiskLevel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition"
              >
                {isLoading ? 'Updating...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Status */}
      <div>
        <p className="font-medium text-gray-900 mb-3">Verification Status</p>
        <div className="space-y-2">
          {report.isVerifiedAuthentic ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-sm text-green-800 font-medium">✓ Verified Authentic</p>
            </div>
          ) : (
            <button
              onClick={handleVerifyAuthenticity}
              disabled={isLoading}
              className="w-full p-3 flex items-center gap-2 border-2 border-dashed border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition disabled:opacity-50 text-sm font-medium text-green-700"
            >
              <CheckCircle size={18} />
              Mark as Verified Authentic
            </button>
          )}
        </div>
      </div>

      {/* Flags Alert */}
      {report.flags && report.flags.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-red-900 mb-2">Flags & Concerns</p>
              <ul className="space-y-1">
                {report.flags.map((flag, idx) => (
                  <li key={idx} className="text-sm text-red-800">
                    • <strong>{flag.reason}</strong> {flag.notes && `- ${flag.notes}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Flag Report Button */}
      {!showFlagForm ? (
        <button
          onClick={() => setShowFlagForm(true)}
          className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <Flag size={16} />
          Flag as Suspicious
        </button>
      ) : (
        <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <div>
            <label className="block text-sm font-medium text-red-900 mb-2">
              Reason for Flag
            </label>
            <select
              value={flagData.reason}
              onChange={(e) => setFlagData(prev => ({
                ...prev,
                reason: e.target.value
              }))}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Duplicate Report">🔄 Duplicate Report</option>
              <option value="Suspicious Details">🚩 Suspicious Details</option>
              <option value="Consistency Issues">⚠️ Consistency Issues</option>
              <option value="Insufficient Evidence">📋 Insufficient Evidence</option>
              <option value="Potential False Accusation">❌ Potential False Accusation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-900 mb-2">
              Additional Notes
            </label>
            <textarea
              value={flagData.notes}
              onChange={(e) => setFlagData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              placeholder="Document your concerns..."
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowFlagForm(false);
                setFlagData({ reason: 'Suspicious Details', notes: '' });
              }}
              className="flex-1 px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-100 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleFlagReport}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition"
            >
              {isLoading ? 'Flagging...' : 'Flag Report'}
            </button>
          </div>
        </div>
      )}

      {/* Report Details Summary */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
        <p className="text-gray-700">
          <span className="font-medium">Submitted:</span> {new Date(report.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Report ID:</span> {report.reportId}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Status:</span> {report.status}
        </p>
        {report.verificationStatus && (
          <p className="text-gray-700">
            <span className="font-medium">Verification:</span> {report.verificationStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminReportAudit;
