import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { WelcomeCard } from '../components/WelcomeCard';
import { DashboardCard } from '../components/DashboardCard';
import { DashboardStories } from '../components/DashboardStories';
import { PlusCircle, FileText, MessageSquare, ArrowUpRight, BookOpen } from 'lucide-react';

import { getUser } from '../services/authService';

export default function UserDashboard() {
    const user = getUser();
    const [stats, setStats] = React.useState({
        active: 0,
        total: 0
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getUserReports } = await import('../services/reportService');
                const response = await getUserReports();
                if (response.success) {
                    const reports = response.reports;
                    setStats({
                        total: reports.length,
                        active: reports.filter(r => r.status !== 'Resolved' && r.status !== 'Closed').length
                    });
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <Header />
            <div className="flex flex-1">
                {/* Sidebar (hidden on small screens) */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <WelcomeCard user={user} />

                        {/* Stories Section */}
                        <DashboardStories />

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-primary pl-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                <DashboardCard
                                    icon={PlusCircle}
                                    title="New Report"
                                    description="Submit securely."
                                    buttonText="Report"
                                    to="/report-incident"
                                    color="blue-600"
                                />
                                <div className="relative">
                                    <DashboardCard
                                        icon={FileText}
                                        title="Active Reports"
                                        description={`${stats.active} ongoing case${stats.active !== 1 ? 's' : ''}.`}
                                        buttonText="View Status"
                                        to="/report-status"
                                        color="emerald-600"
                                    />
                                    {stats.active > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                                            {stats.active}
                                        </span>
                                    )}
                                </div>
                                <DashboardCard
                                    icon={MessageSquare}
                                    title="Messages"
                                    description="Secure inbox."
                                    buttonText="Open"
                                    to="/messages"
                                    color="violet-600"
                                />
                                <DashboardCard
                                    icon={ArrowUpRight}
                                    title="Escalate"
                                    description="Request review."
                                    buttonText="Escalate"
                                    to="/escalate"
                                    color="orange-600"
                                />
                                <DashboardCard
                                    icon={BookOpen}
                                    title="Stories"
                                    description="Read & share."
                                    buttonText="Browse"
                                    to="/stories"
                                    color="pink-600"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
