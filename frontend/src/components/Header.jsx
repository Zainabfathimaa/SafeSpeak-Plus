import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, Settings } from 'lucide-react';
import { logout } from '../services/authService';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useState } from 'react';
import { Button } from './ui/Button';
import { NotificationBell } from './NotificationBell';

export function Header() {
    const navigate = useNavigate();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    return (
        <>
            <nav className="border-b border-primary-dark bg-primary sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Shield className="h-8 w-8 text-white" />
                        <span className="text-xl font-bold text-white">SafeSpeak+</span>
                    </Link>
                    <h1 className="text-lg font-semibold text-white/90 hidden md:block">User Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        <Button variant="ghost" onClick={handleSettingsClick} className="flex items-center space-x-1 text-white hover:bg-primary-dark hover:text-white">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Button>
                        <Button variant="ghost" onClick={handleLogoutClick} className="flex items-center space-x-1 text-white hover:bg-primary-dark hover:text-white">
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out? You will need to sign in again to access your dashboard."
                confirmText="Logout"
                variant="danger"
            />
        </>
    );
}
