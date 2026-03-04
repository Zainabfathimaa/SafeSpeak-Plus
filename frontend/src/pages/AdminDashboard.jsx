import React, { useState, useEffect } from 'react';
import { getAllReports } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '../components/Admin/AdminHeader';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { Footer } from '../components/Footer';
import { ReportTable } from '../components/Admin/ReportTable';
import { FilterPanel } from '../components/Admin/FilterPanel';
import { StatCard } from '../components/Admin/StatCard';
import { RiskBadge } from '../components/Admin/RiskBadge';
import { AlertCircle, FileText, TrendingUp, Clock } from 'lucide-react';
import toastService from '../services/toastService';

export default function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getAllReports();
                if (response.success) {
                    setReports(response.reports);
                    toastService.success(`Loaded ${response.reports.length} reports`);
                } else {
                    toastService.error('Failed to load reports');
                }
            } catch (error) {
                console.error('Failed to fetch reports:', error);
                toastService.error('Error loading reports. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedView, setSelectedView] = useState('all');

    useEffect(() => {
        setFilteredReports(reports);
    }, [reports]);

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

    const navigate = useNavigate();

    const handleViewReport = (reportId) => {
        navigate(`/admin/reports/${reportId}`);
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
