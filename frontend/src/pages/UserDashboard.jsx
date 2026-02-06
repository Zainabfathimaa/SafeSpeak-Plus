import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { WelcomeCard } from '../components/WelcomeCard';
import { DashboardCard } from '../components/DashboardCard';
import { PlusCircle, FileText, MessageSquare, ArrowUpRight, BookOpen } from 'lucide-react';

export default function UserDashboard() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-text-primary">
            {/* Header */}
            <Header />
            <div className="flex flex-1">
                {/* Sidebar (hidden on small screens) */}
                <Sidebar />
                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <WelcomeCard />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard
                            icon={PlusCircle}
                            title="Create New Report"
                            buttonText="Report an Incident"
                            to="/report-incident"
                        />
                        <DashboardCard
                            icon={FileText}
                            title="My Active Reports"
                            description="3 Active Reports"
                            buttonText="View My Reports"
                            to="/report-status"
                        />
                        <DashboardCard
                            icon={MessageSquare}
                            title="Messages"
                            description="2 New Messages"
                            buttonText="Open Messages"
                            to="/messages"
                        />
                        <DashboardCard
                            icon={ArrowUpRight}
                            title="Escalation Option"
                            buttonText="Escalate a Case"
                            to="/escalate"
                        />
                        <DashboardCard
                            icon={BookOpen}
                            title="Stories & Awareness"
                            buttonText="Stories & Awareness"
                            to="/stories"
                        />
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
