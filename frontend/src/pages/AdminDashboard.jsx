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
import { AdminStoryReview } from '../components/Admin/AdminStoryReview';
import { AlertCircle, FileText, TrendingUp, Clock, BookOpen } from 'lucide-react';
import toastService from '../services/toastService';

export default function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState('reports');
    // pending stories state for review tab
    const [pendingStories, setPendingStories] = useState([]);
    const [storyLoading, setStoryLoading] = useState(false);
    const [storyRefreshTrigger, setStoryRefreshTrigger] = useState(0);

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

    // fetch pending stories when Dashboard loads or refresh triggered
    useEffect(() => {
        const fetchPending = async () => {
            setStoryLoading(true);
            try {
                const res = await storyService.getPendingStories();
                if (res.success) {
                    setPendingStories(res.stories || []);
                } else {
                    toastService.error('Failed to load pending stories');
                }
            } catch (err) {
                console.error('Error fetching pending stories:', err);
                toastService.error('Error loading pending stories');
            } finally {
                setStoryLoading(false);
            }
        };
        fetchPending();
    }, [storyRefreshTrigger]);

    const [filteredReports, setFilteredReports] = useState([]);

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

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 gap-8">
                            <button
                                onClick={() => setSelectedView('reports')}
                                className={`pb-4 font-medium transition flex items-center gap-2 ${
                                    selectedView === 'reports'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <FileText size={18} />
                                All Reports
                            </button>
                            <button
                                onClick={() => setSelectedView('stories')}
                                className={`pb-4 font-medium transition flex items-center gap-2 ${
                                    selectedView === 'stories'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <BookOpen size={18} />
                                Story Review
                                {pendingStories.length > 0 && (
                                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 text-white bg-red-600 rounded-full">
                                    {pendingStories.length}
                                  </span>
                                )}
                            </button>
                        </div>

                        {/* Reports View */}
                        {selectedView === 'reports' && (
                            <>
                                {/* Stats Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div onClick={() => setSelectedView('reports')} className="cursor-pointer">
                                    <StatCard
                                        icon={FileText}
                                        title="Total Reports"
                                        value={totalReports}
                                        subtitle="All time"
                                        color="blue-600"
                                    />
                                </div>
                                    <div onClick={() => setSelectedView('reports')} className="cursor-pointer">
                                    <StatCard
                                        icon={AlertCircle}
                                        title="High Risk Cases"
                                        value={highRiskReports}
                                        subtitle="Require urgent action"
                                        color="red-600"
                                    />
                                </div>
                                    <div onClick={() => setSelectedView('reports')} className="cursor-pointer">
                                    <StatCard
                                        icon={Clock}
                                        title="Open Cases"
                                        value={openReports}
                                        subtitle="Awaiting review"
                                        color="amber-600"
                                    />
                                </div>
                                    <div onClick={() => setSelectedView('reports')} className="cursor-pointer">
                                    <StatCard
                                        icon={TrendingUp}
                                        title="Escalated"
                                        value={escalatedReports}
                                        subtitle="Sent to higher authority"
                                        color="orange-600"
                                    />
                                </div>
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
                            </>
                        )}

                        {/* Stories View */}
                        {selectedView === 'stories' && (
                            <AdminStoryReview
                                stories={pendingStories}
                                onRefresh={() => setStoryRefreshTrigger(prev => prev + 1)}
                            />
                        )}
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
