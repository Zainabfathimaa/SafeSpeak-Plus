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
                                <DashboardCard
                                    icon={FileText}
                                    title="Active Reports"
                                    description="Track status."
                                    buttonText="View"
                                    to="/report-status"
                                    color="emerald-600"
                                />
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
                                    title="Escolate"
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
