import React, { useState } from 'react';
import { AdminHeader } from '../components/Admin/AdminHeader';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { StatusBadge } from '../components/Admin/StatusBadge';
import { RiskBadge } from '../components/Admin/RiskBadge';
import { StatCard } from '../components/Admin/StatCard';
import { Lock, Eye, EyeOff, Shield, FileText, AlertCircle, Clock } from 'lucide-react';

export default function ComplianceOfficerDashboard() {
    const [whistleblowerCases, setWhistleblowerCases] = useState([
        {
            id: '1',
            reportId: 'WB-2024-0001',
            incidentType: 'Corruption',
            riskLevel: 'High',
            status: 'Confidential',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            classification: 'Highly Sensitive',
            auditLog: [
                { action: 'Case Created', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), user: 'System' },
                { action: 'Marked Confidential', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), user: 'Compliance Officer' },
            ]
        },
        {
            id: '2',
            reportId: 'WB-2024-0002',
            incidentType: 'Breach of Confidentiality',
            riskLevel: 'High',
            status: 'Under Investigation',
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            classification: 'Highly Confidential',
            auditLog: [
                { action: 'Case Created', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), user: 'System' },
                { action: 'Assigned to Compliance', timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(), user: 'Super Admin' },
            ]
        },
        {
            id: '3',
            reportId: 'WB-2024-0003',
            incidentType: 'Policy Violation',
            riskLevel: 'Medium',
            status: 'Under Investigation',
            createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            classification: 'Confidential',
            auditLog: [
                { action: 'Case Created', timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), user: 'System' },
            ]
        },
    ]);

    const [selectedCase, setSelectedCase] = useState(null);
    const [showDetails, setShowDetails] = useState(true);
    const [showAuditLog, setShowAuditLog] = useState(false);

    const totalCases = whistleblowerCases.length;
    const confidentialCases = whistleblowerCases.filter(c => c.status === 'Confidential').length;
    const underInvestigation = whistleblowerCases.filter(c => c.status === 'Under Investigation').length;
    const highRisk = whistleblowerCases.filter(c => c.riskLevel === 'High').length;

    const getClassificationColor = (classification) => {
        if (classification.includes('Highly')) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-amber-100 text-amber-700 border-amber-200';
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <AdminHeader roleName="Compliance Officer Dashboard" />
            <div className="flex flex-1">
                {/* Sidebar */}
                <AdminSidebar role="compliance" />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                                <Lock className="h-8 w-8 text-red-600" />
                                <span>Whistleblower Protection Portal</span>
                            </h1>
                            <p className="text-text-secondary mt-2">Manage highly sensitive incidents with maximum confidentiality and audit trail</p>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                            <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-900">Enhanced Security Active</p>
                                <p className="text-sm text-red-700 mt-1">All actions and access to whistleblower cases are logged and audited. Reporter identities are maximally masked.</p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={FileText}
                                title="Whistleblower Cases"
                                value={totalCases}
                                subtitle="Total protected cases"
                                color="red-600"
                            />
                            <StatCard
                                icon={Lock}
                                title="Confidential"
                                value={confidentialCases}
                                subtitle="Maximum protection"
                                color="purple-600"
                            />
                            <StatCard
                                icon={AlertCircle}
                                title="Under Investigation"
                                value={underInvestigation}
                                subtitle="Active investigations"
                                color="orange-600"
                            />
                            <StatCard
                                icon={Shield}
                                title="High Risk"
                                value={highRisk}
                                subtitle="Require urgent attention"
                                color="red-700"
                            />
                        </div>

                        {/* Main Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cases List */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                            <Lock className="h-5 w-5 text-primary" />
                                            <span>Protected Cases</span>
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                        {whistleblowerCases.map((caseItem) => (
                                            <button
                                                key={caseItem.id}
                                                onClick={() => {
                                                    setSelectedCase(caseItem);
                                                    setShowAuditLog(false);
                                                }}
                                                className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                                                    selectedCase?.id === caseItem.id ? 'bg-red-50 border-l-4 border-red-600' : ''
                                                }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="font-mono text-sm font-semibold text-red-600">
                                                        {caseItem.reportId}
                                                    </div>
                                                    <Lock className="h-4 w-4 text-red-600" />
                                                </div>
                                                <p className="text-sm text-gray-900 font-medium">{caseItem.incidentType}</p>
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <RiskBadge level={caseItem.riskLevel} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Case Details */}
                            <div className="lg:col-span-2">
                                {selectedCase ? (
                                    <div className="space-y-6">
                                        {/* Details Tab */}
                                        {!showAuditLog && (
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4 flex items-center space-x-2">
                                                    <Eye className="h-5 w-5" />
                                                    <span>Case Details</span>
                                                </h3>
                                                <div className="space-y-5">
                                                    <div>
                                                        <p className="text-sm text-text-secondary font-medium">Report ID (Encrypted)</p>
                                                        <p className="text-lg font-mono font-bold text-red-600 mt-1">{selectedCase.reportId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-secondary font-medium">Incident Type</p>
                                                        <p className="text-gray-900 mt-1">{selectedCase.incidentType}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-text-secondary font-medium">Risk Level</p>
                                                            <RiskBadge level={selectedCase.riskLevel} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-text-secondary font-medium">Status</p>
                                                            <StatusBadge status={selectedCase.status} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-secondary font-medium">Classification Level</p>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border mt-1 ${getClassificationColor(selectedCase.classification)}`}>
                                                            {selectedCase.classification}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-secondary font-medium">Created Date</p>
                                                        <p className="text-gray-900 mt-1">{new Date(selectedCase.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Audit Log Tab */}
                                        {showAuditLog && (
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4 flex items-center space-x-2">
                                                    <Clock className="h-5 w-5" />
                                                    <span>Audit Trail</span>
                                                </h3>
                                                <div className="space-y-3">
                                                    {selectedCase.auditLog.map((log, idx) => (
                                                        <div key={idx} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                                                            <div className="w-3 h-3 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{log.action}</p>
                                                                <p className="text-xs text-text-secondary mt-1">
                                                                    {new Date(log.timestamp).toLocaleString()} • {log.user}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tab Buttons */}
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setShowAuditLog(false)}
                                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    !showAuditLog
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => setShowAuditLog(true)}
                                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    showAuditLog
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Audit Trail
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex items-center justify-center min-h-96">
                                        <div className="text-center">
                                            <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-lg">Select a case to view protected details</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
