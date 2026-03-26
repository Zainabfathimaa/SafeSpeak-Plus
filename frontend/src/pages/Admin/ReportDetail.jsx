import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { getReportById, updateReportStatus } from '../../services/reportService';
import { ArrowLeft, Calendar, MapPin, Clock, AlertTriangle, FileText, User, CheckCircle, XCircle } from 'lucide-react';
import { RiskBadge } from '../../components/Admin/RiskBadge';
import { StatusBadge } from '../../components/Admin/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToast } from '../../hooks/useToast';

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const { addToast } = useToast();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await getReportById(id);
                if (response.success) {
                    setReport(response.report);
                } else {
                    setError('Report not found');
                }
            } catch (err) {
                setError('Failed to fetch report details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            const response = await updateReportStatus(id, { status: newStatus });
            if (response.success) {
                setReport(response.report);
                addToast('success', `Status updated to ${newStatus}`);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            addToast('error', 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleMessageReporter = () => {
        // Navigate to the messages page. The messages component will fetch threads.
        navigate('/admin/messages', { state: { reportId: id } });
    };

    const handleEscalateClick = () => {
        setActionType('escalate');
        setIsConfirmModalOpen(true);
    };

    const handleFlagSpamClick = () => {
        setActionType('flag');
        setIsConfirmModalOpen(true);
    };

    const executeAction = async () => {
        setIsConfirmModalOpen(false);
        if (actionType === 'escalate') {
            await handleStatusChange('Escalated');
        } else if (actionType === 'flag') {
            await handleStatusChange('Archived/Spam');
        }
        setActionType(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen overflow-hidden bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="h-screen overflow-hidden bg-gray-50 flex flex-col justify-center items-center">
                <p className="text-red-600 text-xl mb-4">{error || 'Report not found'}</p>
                <Button onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <AdminHeader roleName="Case Reviewer" />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar role="admin" />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {/* Back Button & Title */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="flex items-center text-text-secondary hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Dashboard
                            </button>
                            <div className="flex items-center space-x-3">
                                <label className="text-sm font-medium text-gray-700">Update Status:</label>
                                <select
                                    value={report.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={updating}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer min-w-[160px]"
                                >
                                    <option value="Pending Validation">Pending Validation</option>
                                    <option value="Open">Open</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Appealed">Appealed</option>
                                    <option value="Needs Info">Needs Info</option>
                                    <option value="Requires Clarification">Requires Clarification</option>
                                    <option value="Escalated">Escalated</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Archived/Spam">Archived/Spam</option>
                                </select>
                                {updating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                            </div>
                        </div>

                        {report.status?.toLowerCase() === 'needs info' && (
                            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-orange-800">You requested more information</h3>
                                    <p className="text-sm text-orange-700 mt-1">
                                        The reporter has been notified. Don't forget to send them a specific message using the 'Message Reporter' action below so they know what to provide.
                                    </p>
                                </div>
                                <Button size="sm" onClick={handleMessageReporter} className="ml-4 flex-shrink-0 bg-white border-orange-200 text-orange-700 hover:bg-orange-50" variant="outline">
                                    Message Now
                                </Button>
                            </div>
                        )}

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* specific Report Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Main Info Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{report.incidentType}</h1>
                                            <p className="text-sm font-mono text-text-secondary">Reference: {report.reportId}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <StatusBadge status={report.status} />
                                            <RiskBadge level={report.riskLevel} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                        <div className="flex items-center text-text-secondary">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>{new Date(report.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-text-secondary">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span>{report.time || 'Time not specified'}</span>
                                        </div>
                                        <div className="flex items-center text-text-secondary">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{report.location}</span>
                                        </div>
                                        <div className="flex items-center text-text-secondary">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>{report.department}{report.course ? ` - ${report.course}` : ''}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-2">Description</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
                                        {report.description}
                                    </p>

                                    {report.involvedParties && (
                                        <>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-2">Involved Parties</h3>
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {report.involvedParties}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Evidence Section */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-primary" />
                                        Evidence & Attachments
                                    </h3>
                                    {report.evidenceFiles && report.evidenceFiles.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {report.evidenceFiles.map((file, index) => (
                                                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                    <FileText className="h-8 w-8 text-gray-400 mr-3" />
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                                                        <p className="text-xs text-gray-500">{file.fileType}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No evidence attached to this report.</p>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Reporter Info (Hidden/Anonymous) */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Reporter Information</h3>
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                                        <AlertTriangle className="h-5 w-5 text-blue-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-900">Anonymous Reporter</p>
                                            <p className="text-xs text-blue-700">Identity protected by system</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        The reporter has chosen to remain anonymous. You cannot see their personal details unless they explicitly revealed them in the description.
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={handleMessageReporter}
                                        >
                                            Message Reporter
                                        </Button>
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={handleEscalateClick}
                                            disabled={updating || report.status === 'Escalated'}
                                        >
                                            {report.status === 'Escalated' ? 'Already Escalated' : 'Escalate to Supervisor'}
                                        </Button>
                                        <Button
                                            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                                            variant="outline"
                                            onClick={handleFlagSpamClick}
                                            disabled={updating || report.status === 'Archived/Spam'}
                                        >
                                            Flag as Spam / Archive
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={executeAction}
                title={actionType === 'escalate' ? "Confirm Escalation" : "Flag as Spam"}
                message={
                    actionType === 'escalate'
                        ? "Are you sure you want to escalate this report to a supervisor?"
                        : "Are you sure you want to flag this report as spam? It will be closed."
                }
                confirmText={actionType === 'escalate' ? "Escalate" : "Flag as Spam"}
                variant={actionType === 'escalate' ? "warning" : "danger"}
            />
        </div>
    );
}
