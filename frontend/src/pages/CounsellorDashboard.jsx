import React, { useState } from 'react';
import { AdminHeader } from '../components/Admin/AdminHeader';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { StatusBadge } from '../components/Admin/StatusBadge';
import { RiskBadge } from '../components/Admin/RiskBadge';
import { StatCard } from '../components/Admin/StatCard';
import { Heart, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function CounsellorDashboard() {
    const [assignedCases, setAssignedCases] = useState([
        {
            id: '1',
            reportId: 'SR-2024-0001',
            incidentType: 'Harassment',
            riskLevel: 'High',
            status: 'In-Progress',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            unreadMessages: 2,
            supportNeeded: 'Emotional Support'
        },
        {
            id: '2',
            reportId: 'SR-2024-0002',
            incidentType: 'Bullying',
            riskLevel: 'Medium',
            status: 'In-Progress',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            unreadMessages: 0,
            supportNeeded: 'Career Guidance'
        },
        {
            id: '3',
            reportId: 'SR-2024-0005',
            incidentType: 'Discrimination',
            riskLevel: 'High',
            status: 'In-Review',
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            unreadMessages: 1,
            supportNeeded: 'Mental Health Support'
        },
    ]);

    const [selectedCase, setSelectedCase] = useState(null);
    const [caseNotes, setCaseNotes] = useState({});
    const [newNote, setNewNote] = useState('');

    const totalCases = assignedCases.length;
    const activeCases = assignedCases.filter(c => c.status === 'In-Progress').length;
    const completedCases = assignedCases.filter(c => c.status === 'Resolved').length;
    const unreadTotal = assignedCases.reduce((sum, c) => sum + c.unreadMessages, 0);

    const handleAddNote = () => {
        if (selectedCase && newNote.trim()) {
            setCaseNotes({
                ...caseNotes,
                [selectedCase.id]: [...(caseNotes[selectedCase.id] || []), {
                    timestamp: new Date().toISOString(),
                    note: newNote
                }]
            });
            setNewNote('');
        }
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <AdminHeader roleName="Counsellor Dashboard" />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar role="counsellor" />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Counsellor Dashboard</h1>
                            <p className="text-text-secondary mt-2">Provide confidential support and guidance</p>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Heart}
                                title="Assigned Cases"
                                value={totalCases}
                                subtitle="Under your care"
                                color="pink-600"
                            />
                            <StatCard
                                icon={Clock}
                                title="Active Cases"
                                value={activeCases}
                                subtitle="Currently ongoing"
                                color="amber-600"
                            />
                            <StatCard
                                icon={CheckCircle}
                                title="Completed"
                                value={completedCases}
                                subtitle="Successfully resolved"
                                color="green-600"
                            />
                            <StatCard
                                icon={MessageSquare}
                                title="Unread Messages"
                                value={unreadTotal}
                                subtitle="Awaiting your response"
                                color="violet-600"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cases List */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-900">Your Cases</h2>
                                    </div>
                                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                        {assignedCases.map((caseItem) => (
                                            <button
                                                key={caseItem.id}
                                                onClick={() => setSelectedCase(caseItem)}
                                                className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${selectedCase?.id === caseItem.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="font-mono text-sm font-semibold text-primary">
                                                        {caseItem.reportId}
                                                    </div>
                                                    {caseItem.unreadMessages > 0 && (
                                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                            {caseItem.unreadMessages}
                                                        </span>
                                                    )}
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

                            {/* Case Details and Notes */}
                            <div className="lg:col-span-2">
                                {selectedCase ? (
                                    <div className="space-y-6">
                                        {/* Case Summary */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">
                                                Case Summary
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-text-secondary font-medium">Report ID</p>
                                                        <p className="text-lg font-mono font-bold text-primary">{selectedCase.reportId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-secondary font-medium">Incident Type</p>
                                                        <p className="text-lg font-semibold text-gray-900">{selectedCase.incidentType}</p>
                                                    </div>
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
                                                    <p className="text-sm text-text-secondary font-medium">Support Needed</p>
                                                    <p className="text-gray-900 mt-1">{selectedCase.supportNeeded}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Confidential Notes */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4 flex items-center space-x-2">
                                                <Lock className="h-5 w-5" />
                                                <span>Confidential Notes (Visible to Counsellor Only)</span>
                                            </h3>

                                            {/* Existing Notes */}
                                            <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-32 max-h-48 overflow-y-auto">
                                                {caseNotes[selectedCase.id] && caseNotes[selectedCase.id].length > 0 ? (
                                                    <div className="space-y-3">
                                                        {caseNotes[selectedCase.id].map((note, idx) => (
                                                            <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                                                <p className="text-xs text-text-secondary font-medium">
                                                                    {new Date(note.timestamp).toLocaleString()}
                                                                </p>
                                                                <p className="text-gray-900 text-sm mt-2">{note.note}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-text-secondary text-sm italic">No notes yet. Add your observations here.</p>
                                                )}
                                            </div>

                                            {/* Add New Note */}
                                            <div className="space-y-2">
                                                <textarea
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Add a confidential note about this case... (visible only to you)"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                                    rows={3}
                                                />
                                                <button
                                                    onClick={handleAddNote}
                                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                                                >
                                                    Add Note
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex items-center justify-center min-h-96">
                                        <div className="text-center">
                                            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-lg">Select a case to view details and add notes</p>
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

import { Lock } from 'lucide-react';
