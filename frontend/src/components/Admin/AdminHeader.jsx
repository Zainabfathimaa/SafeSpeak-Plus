import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { NotificationBell } from '../Notifications/NotificationBell';

export function AdminHeader() {
    return (
        <nav className="border-b border-primary-dark bg-primary sticky  top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/admin" className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-white" />
                    <span className="text-xl font-bold text-white">SafeSpeak+</span>
                </Link>
                <h1 className="text-lg font-semibold text-white/90 hidden md:block">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <NotificationBell />
                </div>
            </div>
        </nav>
    );
}
