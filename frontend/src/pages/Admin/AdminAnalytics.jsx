import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { Footer } from '../../components/Footer';
import { getAnalytics } from '../../services/analyticsService';
import { StatCard } from '../../components/Admin/StatCard';
import { FileText, AlertCircle, Clock, Users, BarChart3, PieChart, Activity } from 'lucide-react';

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics();
                if (data.success) {
                    setAnalytics(data.analytics);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // Helper component for simple horizontal bar charts
    const BarChart = ({ data, title, icon: Icon, colorClass }) => {
        const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-6">
                    <Icon className={`h-5 w-5 mr-3 ${colorClass}`} />
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                </div>

                <div className="space-y-5">
                    {data.length > 0 ? data.map((item, index) => {
                        const percentage = Math.round((item.value / maxValue) * 100);
                        return (
                            <div key={index} className="relative">
                                <div className="flex justify-between text-sm mb-1 pb-1">
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="font-bold text-gray-900">{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-2.5 rounded-full ${colorClass.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center text-sm text-gray-500 py-4 italic">No data available</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            <AdminHeader roleName="Analytics Dashboard" />
            <div className="flex flex-1">
                <AdminSidebar role="admin" />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-text-secondary mt-2">Platform usage statistics and report metrics</p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                <p className="text-gray-500 font-medium">Aggregating statistics...</p>
                            </div>
                        ) : analytics ? (
                            <>
                                {/* KPIs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={FileText}
                                        title="Total Reports"
                                        value={analytics.kpis.totalReports}
                                        subtitle="All time submissions"
                                        color="blue-600"
                                    />
                                    <StatCard
                                        icon={AlertCircle}
                                        title="Open Reports"
                                        value={analytics.kpis.openReports}
                                        subtitle="Awaiting resolution"
                                        color="amber-600"
                                    />
                                    <StatCard
                                        icon={CheckCircle2Icon}
                                        title="Resolved"
                                        value={analytics.kpis.resolvedReports}
                                        subtitle="Successfully handled"
                                        color="green-600"
                                    />
                                    <StatCard
                                        icon={Users}
                                        title="Total Users"
                                        value={analytics.kpis.totalUsers}
                                        subtitle="Registered accounts"
                                        color="indigo-600"
                                    />
                                </div>

                                {/* Charts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-1">
                                        <BarChart
                                            data={analytics.charts.riskLevel}
                                            title="Reports by Risk Level"
                                            icon={Activity}
                                            colorClass="text-red-500"
                                        />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <BarChart
                                            data={analytics.charts.status}
                                            title="Current Status Breakdown"
                                            icon={PieChart}
                                            colorClass="text-amber-500"
                                        />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <BarChart
                                            data={analytics.charts.department}
                                            title="Top Departments"
                                            icon={BarChart3}
                                            colorClass="text-blue-500"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Analytics</h3>
                                <p className="text-gray-500">Failed to load data from the server. Please try again later.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

// Inline icon component since CheckCircle2 isn't exported from lucide-react directly matching CheckCircle2Icon
const CheckCircle2Icon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);
