import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, ArrowUpRight, BookOpen } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
            <nav className="flex flex-col h-full p-4 space-y-4">
                <Link to="/dashboard" className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                </Link>
                <Link to="/report-status" className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                    <FileText className="h-5 w-5" />
                    <span>My Reports</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                </Link>
                <Link to="/escalate" className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                    <ArrowUpRight className="h-5 w-5" />
                    <span>Escalate</span>
                </Link>
                <Link to="/stories" className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                    <BookOpen className="h-5 w-5" />
                    <span>Stories</span>
                </Link>
                {/* Spacer to push logout or other items to bottom if needed */}
                <div className="flex-grow"></div>
            </nav>
        </aside>
    );
}
