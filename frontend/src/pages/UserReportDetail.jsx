import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { getReportById } from '../services/reportService';
import { ArrowLeft, Calendar, MapPin, Clock, AlertTriangle, FileText, User, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function UserReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            case 'in review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
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
            case 'open': return 1;
            case 'in review': return 2;
            case 'escalated': return 3;
            case 'resolved': return 4;
            case 'closed': return 4;
            default: return 1;
        }
    };

    const steps = [
        { id: 1, label: 'Submitted' },
        { id: 2, label: 'In Review' },
        { id: 3, label: 'Processing' },
        { id: 4, label: 'Resolved' },
    ];

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
                <Header />
                <div className="flex flex-1">
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
                <div className="flex flex-1">
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

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1">
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
                                            <span>{report.department}</span>
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
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={() => navigate('/messages')}
                                        >
                                            Message Admin
                                        </Button>
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={() => navigate('/escalate')}
                                        >
                                            Escalate Report
                                        </Button>
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
