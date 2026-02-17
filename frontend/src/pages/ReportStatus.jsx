import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ReportStatusCard } from '../components/ReportStatus/ReportStatusCard';
import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReportStatus() {
    // Mock Data - In a real app, fetch from API
    const mockReports = [
        {
            id: 'REF-2023-001',
            type: 'Bullying',
            status: 'In Review',
            statusStep: 3,
            date: 'Oct 24, 2023',
            location: 'Library',
            description: 'Two older students were repeatedly harassing a younger student near the quiet zone. I observed them taking books and...',
            submittedAt: 'Oct 24',
            receivedAt: 'Oct 24',
            reviewedAt: 'Pending',
            resolvedAt: null
        },
        {
            id: 'REF-2023-002',
            type: 'Safety Hazard',
            status: 'Received',
            statusStep: 2,
            date: 'Oct 26, 2023',
            location: 'Science Block B',
            description: 'There is a loose railing on the second floor staircase in the science block. It feels very unstable when you lean on it.',
            submittedAt: 'Oct 26',
            receivedAt: 'Oct 26',
            reviewedAt: null,
            resolvedAt: null
        },
        {
            id: 'REF-2023-003',
            type: 'Discrimination',
            status: 'Submitted',
            statusStep: 1,
            date: 'Nov 01, 2023',
            location: 'Cafeteria',
            description: 'I witnessed a group making inappropriate comments towards another student based on their background during lunch break.',
            submittedAt: 'Nov 01',
            receivedAt: null,
            reviewedAt: null,
            resolvedAt: null
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Active Reports</h1>
                                <p className="text-text-secondary mt-1">
                                    Track the status and progress of your submitted reports safely.
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-300 text-text-primary py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                        <option>All Statuses</option>
                                        <option>In Review</option>
                                        <option>Resolved</option>
                                    </select>
                                    <Filter className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                </div>
                                <Link
                                    to="/report-incident"
                                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    + New Report
                                </Link>
                            </div>
                        </div>

                        {/* Reports Grid */}
                        {mockReports.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {mockReports.map((report) => (
                                    <ReportStatusCard key={report.id} report={report} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-xl font-medium text-gray-400 mb-2">No active reports found</p>
                                <p className="text-gray-500 mb-6">You haven't submitted any reports yet.</p>
                                <Link
                                    to="/report-incident"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Submit a new report
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
