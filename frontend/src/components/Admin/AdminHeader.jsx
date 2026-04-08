import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { NotificationBell } from '../Notifications/NotificationBell';

export function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <nav className="border-b border-primary-dark bg-primary sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/admin" className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-white" />
                    <span className="text-xl font-bold text-white">SafeSpeak+</span>
                </Link>
                <h1 className="text-lg font-semibold text-white/90 hidden md:block">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <NotificationBell />
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-white hover:bg-primary-dark hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
