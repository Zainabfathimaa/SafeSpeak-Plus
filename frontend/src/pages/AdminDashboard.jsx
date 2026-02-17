import React, { useState } from 'react';
import { AdminHeader } from '../components/Admin/AdminHeader';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { Footer } from '../components/Footer';
import { ReportTable } from '../components/Admin/ReportTable';
import { FilterPanel } from '../components/Admin/FilterPanel';
import { StatCard } from '../components/Admin/StatCard';
import { RiskBadge } from '../components/Admin/RiskBadge';
import { AlertCircle, FileText, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
    // Mock data - replace with API call
    const [reports, setReports] = useState([
        {
            id: '1',
            reportId: 'SR-2024-0001',
            incidentType: 'Harassment',
            department: 'HR',
            riskLevel: 'High',
            status: 'In-Review',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            location: 'Building A'
        },
        {
            id: '2',
            reportId: 'SR-2024-0002',
            incidentType: 'Bullying',
            department: 'IT',
            riskLevel: 'Medium',
            status: 'In-Progress',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            location: 'Building B'
        },
        {
            id: '3',
            reportId: 'SR-2024-0003',
            incidentType: 'Discrimination',
            department: 'Finance',
            riskLevel: 'High',
            status: 'Escalated',
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            location: 'Building C'
        },
        {
            id: '4',
            reportId: 'SR-2024-0004',
            incidentType: 'General Complaint',
            department: 'Operations',
            riskLevel: 'Low',
            status: 'Open',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            location: 'Building A'
        },
        {
            id: '5',
            reportId: 'SR-2024-0005',
            incidentType: 'Harassment',
            department: 'Marketing',
            riskLevel: 'Medium',
            status: 'Resolved',
            createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            location: 'Building D'
        },
    ]);

    const [filteredReports, setFilteredReports] = useState(reports);
    const [selectedView, setSelectedView] = useState('all');

    const handleFilterChange = (filters) => {
        let filtered = [...reports];

        if (filters.riskLevel !== 'all') {
            filtered = filtered.filter(r => r.riskLevel.toLowerCase() === filters.riskLevel);
        }
        if (filters.status !== 'all') {
            filtered = filtered.filter(r => r.status.toLowerCase().replace(' ', '-') === filters.status);
        }
        if (filters.department !== 'all') {
            filtered = filtered.filter(r => r.department.toLowerCase() === filters.department);
        }

        setFilteredReports(filtered);
    };

    const handleReset = () => {
        setFilteredReports(reports);
    };

    const handleViewReport = (reportId) => {
        // Navigate to report detail view
        console.log('View report:', reportId);
    };

    // Calculate statistics
    const totalReports = reports.length;
    const highRiskReports = reports.filter(r => r.riskLevel === 'High').length;
    const openReports = reports.filter(r => r.status === 'Open').length;
    const escalatedReports = reports.filter(r => r.status === 'Escalated').length;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <AdminHeader roleName="Case Reviewer Dashboard" />
            <div className="flex flex-1">
                {/* Sidebar */}
                <AdminSidebar role="admin" />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Case Reviewer Dashboard</h1>
                            <p className="text-text-secondary mt-2">Manage and review all incident reports</p>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={FileText}
                                title="Total Reports"
                                value={totalReports}
                                subtitle="All time"
                                color="blue-600"
                            />
                            <StatCard
                                icon={AlertCircle}
                                title="High Risk Cases"
                                value={highRiskReports}
                                subtitle="Require urgent action"
                                color="red-600"
                            />
                            <StatCard
                                icon={Clock}
                                title="Open Cases"
                                value={openReports}
                                subtitle="Awaiting review"
                                color="amber-600"
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Escalated"
                                value={escalatedReports}
                                subtitle="Sent to higher authority"
                                color="orange-600"
                            />
                        </div>

                        {/* Filter Section */}
                        <FilterPanel
                            onFilterChange={handleFilterChange}
                            onReset={handleReset}
                        />

                        {/* Reports Table */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-primary pl-4">
                                All Reports ({filteredReports.length})
                            </h2>
                            <ReportTable
                                reports={filteredReports}
                                onViewReport={handleViewReport}
                            />
                        </div>
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
