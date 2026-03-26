import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { getReportById, appealReport, escalateReport } from '../services/reportService';
import { ArrowLeft, Calendar, MapPin, Clock, AlertTriangle, FileText, User, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import useToast from '../hooks/useToast';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

export default function UserReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Core Report State
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Appeal State
    const [isAppealing, setIsAppealing] = useState(false);
    const [appealReason, setAppealReason] = useState('');
    const [appealEvidence, setAppealEvidence] = useState('');
    const [submittingAppeal, setSubmittingAppeal] = useState(false);
    const [appealSuccess, setAppealSuccess] = useState(false);

    // Escalation State
    const [isEscalating, setIsEscalating] = useState(false);
    const [escalationMethod, setEscalationMethod] = useState('email');
    const [escalationContact, setEscalationContact] = useState('');
    const [escalationMessage, setEscalationMessage] = useState('');
    const [escalationProof, setEscalationProof] = useState(null);
    const [submittingEscalation, setSubmittingEscalation] = useState(false);

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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'in review': case 'in-review': case 'appealed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'open': case 'pending validation': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'needs info': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'closed': case 'archived/spam': return 'bg-red-100 text-red-800 border-red-200';
            case 'escalated': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRiskColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Timeline steps
    const getStatusStep = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending validation': case 'needs info': case 'open': return 1;
            case 'in review': case 'in-review': case 'appealed': return 2;
            case 'escalated': case 'in-progress': return 3;
            case 'resolved': case 'closed': case 'archived/spam': return 4;
            default: return 1;
        }
    };

    const steps = [
        { id: 1, label: 'Submitted' },
        { id: 2, label: 'In Review' },
        { id: 3, label: 'Processing' },
        { id: 4, label: 'Resolved/Closed' },
    ];

    const handleAppeal = async () => {
        if (!appealReason) {
            addToast('error', 'Please provide a reason for your appeal.');
            return;
        }

        setSubmittingAppeal(true);
        try {
            const res = await appealReport(id, { reason: appealReason, evidence: appealEvidence });
            if (res.success) {
                setAppealSuccess(true);
                setReport(res.report);
                setIsAppealing(false);
                addToast('success', 'Your appeal has been successfully submitted.', 5000);
            } else {
                addToast('error', res.message || 'Failed to submit appeal');
            }
        } catch (err) {
            addToast('error', 'An error occurred while submitting your appeal.');
            console.error(err);
        } finally {
            setSubmittingAppeal(false);
        }
    };

    const handleEscalate = async () => {
        if (!escalationContact) {
            addToast('error', `Please provide an ${escalationMethod === 'email' ? 'email address' : 'phone number'}.`);
            return;
        }
        
        setSubmittingEscalation(true);
        try {
            const payload = {
                message: escalationMessage,
                contactMethod: escalationMethod,
                contactValue: escalationContact,
                ...(escalationProof && { proofImageBase64: escalationProof })
            };
            const res = await escalateReport(id, payload);

            if (res.success) {
                setReport(res.report);
                setIsEscalating(false);
                addToast('warning', '⚠️ You are no longer anonymous for this escalation.', 12000);
                addToast('success', res.message || 'Report escalated successfully.', 8000);
                
                if (res.whatsappUrl) {
                    window.open(res.whatsappUrl, '_blank');
                }
            } else {
                addToast('error', res.message || 'Failed to escalate report');
            }
        } catch (err) {
            addToast('error', 'An error occurred while escalating your report.');
            console.error(err);
        } finally {
            setSubmittingEscalation(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex flex-col items-center justify-center">
                        <p className="text-red-600 text-xl mb-4">{error || 'Report not found'}</p>
                        <Button onClick={() => navigate('/report-status')}>Back to My Reports</Button>
                    </main>
                </div>
            </div>
        );
    }

    const currentStep = getStatusStep(report.status);
    const canAppeal = report.status?.toLowerCase() === 'closed' || report.status?.toLowerCase() === 'archived/spam';

    // Escalate Logic: Can escalate if untouched > 48h, or flagged as Critical, or closed/archived. Not allowed if already escalated or resolved.
    const isTerminalStatus = ['resolved', 'closed', 'archived/spam', 'escalated'].includes(report.status?.toLowerCase());
    const reportAgeHours = (new Date() - new Date(report.createdAt)) / (1000 * 60 * 60);
    const canEscalate = report.status?.toLowerCase() !== 'escalated' && report.status?.toLowerCase() !== 'resolved' && (
        reportAgeHours > 48 || 
        report.riskLevel === 'Critical' || 
        ['closed', 'archived/spam'].includes(report.status?.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-5xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/report-status')}
                            className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to My Reports
                        </button>

                        {/* Banner for specific statuses */}
                        {report.status?.toLowerCase() === 'needs info' && (
                            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg flex items-start">
                                <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold text-orange-800">Additional Information Required</h3>
                                    <p className="text-sm text-orange-700 mt-1">
                                        An admin needs more details to process this report. Please check your messages and reply with the requested information.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 bg-white border-orange-200 text-orange-700 hover:bg-orange-50"
                                        onClick={() => navigate('/messages')}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Go to Messages
                                    </Button>
                                </div>
                            </div>
                        )}

                        {appealSuccess && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-sm text-green-800 font-medium">Your appeal has been successfully submitted and is pending review.</span>
                            </div>
                        )}

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Main Report Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Main Info Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{report.incidentType}</h1>
                                            <p className="text-sm font-mono text-text-secondary">Reference: {report.reportId}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                            {report.riskLevel && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(report.riskLevel)}`}>
                                                    {report.riskLevel} Risk
                                                </span>
                                            )}
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

                                {/* Escalation Form (Conditionally rendered) */}
                                {isEscalating && canEscalate && (
                                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 form-animate">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                                            <ArrowUpRight className="h-5 w-5 mr-2 text-red-600" />
                                            Escalate Report
                                        </h3>
                                        <p className="text-sm text-text-secondary mb-4">
                                            Escalate this case directly to the official University Super Admin for a final review.
                                            <strong> Warning: By escalating, your identity will be disclosed to the reviewing authority to facilitate the investigation.</strong>
                                        </p>
                                        <div className="space-y-4">
                                            {/* Contact Method Toggles */}
                                            <div className="flex gap-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="escalateMethod" 
                                                        value="email" 
                                                        checked={escalationMethod === 'email'} 
                                                        onChange={() => setEscalationMethod('email')}
                                                        className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Send via Email</span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="escalateMethod" 
                                                        value="whatsapp" 
                                                        checked={escalationMethod === 'whatsapp'} 
                                                        onChange={() => setEscalationMethod('whatsapp')}
                                                        className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Send via WhatsApp</span>
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Authority {escalationMethod === 'email' ? 'Email Address' : 'Phone Number'} *
                                                </label>
                                                <input
                                                    type={escalationMethod === 'email' ? 'email' : 'tel'}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm mb-4"
                                                    value={escalationContact}
                                                    onChange={(e) => setEscalationContact(e.target.value)}
                                                    placeholder={escalationMethod === 'email' ? 'e.g., higheradmin@university.edu' : 'e.g., +1234567890'}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Against Admin / Reason for Escalation</label>
                                                <textarea
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                                    rows="3"
                                                    value={escalationMessage}
                                                    onChange={(e) => setEscalationMessage(e.target.value)}
                                                    placeholder="Detail your complaint against the reviewing administration, why it was handled poorly, and why higher-level review is required..."
                                                ></textarea>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Attach Proof Screenshot (Optional)
                                                </label>
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setEscalationProof(reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            setEscalationProof(null);
                                                        }
                                                    }}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Upload a screenshot showing the admin's unhelpful response or lack thereof.</p>
                                            </div>

                                            <div className="flex gap-3 justify-end mt-4">
                                                <Button variant="outline" onClick={() => setIsEscalating(false)} disabled={submittingEscalation}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleEscalate}
                                                    disabled={submittingEscalation}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    {submittingEscalation ? 'Escalating...' : 'Confirm Escalation'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Appeal Form (Conditionally rendered) */}
                                {isAppealing && canAppeal && (
                                    <div className="bg-white rounded-xl shadow-sm border border-primary p-6 form-animate">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Appeal Decision</h3>
                                        <p className="text-sm text-text-secondary mb-4">
                                            If you believe this report was closed or archived in error, you can submit additional context to request a secondary review from a senior administrator.
                                        </p>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Appeal *</label>
                                                <textarea
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    rows="3"
                                                    value={appealReason}
                                                    onChange={(e) => setAppealReason(e.target.value)}
                                                    placeholder="Explain why this decision should be reconsidered..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Context / Evidence (Optional)</label>
                                                <textarea
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    rows="2"
                                                    value={appealEvidence}
                                                    onChange={(e) => setAppealEvidence(e.target.value)}
                                                    placeholder="Links, witness names, or other details..."
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-3 justify-end mt-4">
                                                <Button variant="outline" onClick={() => setIsAppealing(false)} disabled={submittingAppeal}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleAppeal} disabled={submittingAppeal}>
                                                    {submittingAppeal ? 'Submitting...' : 'Submit Appeal'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Evidence Section */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-primary" />
                                        Evidence & Attachments
                                    </h3>
                                    {report.evidenceFiles && report.evidenceFiles.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {report.evidenceFiles.map((file, index) => (
                                                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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

                            {/* Right Sidebar */}
                            <div className="space-y-6">
                                {/* Status Timeline */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Case Progress</h3>
                                    <div className="space-y-4">
                                        {steps.map((step) => {
                                            const isCompleted = step.id <= currentStep;
                                            const isCurrent = step.id === currentStep;
                                            return (
                                                <div key={step.id} className="flex items-center space-x-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                                            ${isCompleted ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-300'}
                                                            ${isCurrent ? 'ring-4 ring-blue-50' : ''}
                                                        `}
                                                    >
                                                        {isCompleted ? <CheckCircle2 className="w-5 h-5 fill-primary text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        {canAppeal && !isAppealing && (
                                            <Button
                                                className="w-full justify-start bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                                variant="outline"
                                                onClick={() => setIsAppealing(true)}
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Appeal Decision
                                            </Button>
                                        )}
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={() => navigate('/messages')}
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Message Admin
                                        </Button>
                                        {canEscalate && !isEscalating && (
                                            <Button
                                                className="w-full justify-start text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                variant="outline"
                                                onClick={() => setIsEscalating(true)}
                                            >
                                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                                Escalate Report
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Submission Info */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Submission Info</h3>
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-900">Anonymous Report</p>
                                            <p className="text-xs text-blue-700">Your identity is protected</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        Submitted on {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
