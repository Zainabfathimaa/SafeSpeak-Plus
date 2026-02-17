import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { WelcomeCard } from '../components/WelcomeCard';
import { DashboardCard } from '../components/DashboardCard';
import { PlusCircle, FileText, MessageSquare, ArrowUpRight, BookOpen } from 'lucide-react';

export default function UserDashboard() {
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
                        <WelcomeCard />

                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DashboardCard
                                    icon={PlusCircle}
                                    title="Create New Report"
                                    description="Submit a new incident report securely and anonymously."
                                    buttonText="Report an Incident"
                                    to="/report-incident"
                                    color="blue-600"
                                />
                                <DashboardCard
                                    icon={FileText}
                                    title="My Active Reports"
                                    description="Track status updates on your 3 active cases."
                                    buttonText="View My Reports"
                                    to="/report-status"
                                    color="emerald-600"
                                />
                                <DashboardCard
                                    icon={MessageSquare}
                                    title="Messages"
                                    description="You have 2 new secure messages from administrators."
                                    buttonText="Open Messages"
                                    to="/messages"
                                    color="violet-600"
                                />
                                <DashboardCard
                                    icon={ArrowUpRight}
                                    title="Escalation Option"
                                    description="Request review for cases that need urgent attention."
                                    buttonText="Escalate a Case"
                                    to="/escalate"
                                    color="orange-600"
                                />
                                <DashboardCard
                                    icon={BookOpen}
                                    title="Stories & Awareness"
                                    description="Read community stories and safety resources."
                                    buttonText="Browse Stories"
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
