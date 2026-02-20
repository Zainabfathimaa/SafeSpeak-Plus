import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, TrendingUp, Lock, Settings, AlertCircle, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useState } from 'react';

export function AdminSidebar({ role = 'admin' }) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    // Define menu items based on role
    const getMenuItems = () => {
        const baseItems = [
            { path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
            // { path: '/admin/reports', label: 'All Reports', icon: FileText }, // Redundant with dashboard logic for now
        ];

        const roleSpecificItems = {
            admin: [
                { path: '/admin/users', label: 'Users', icon: Users },
                { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
            ],
            counsellor: [
                { path: '/counsellor/assigned', label: 'Assigned Cases', icon: AlertCircle },
            ],
            compliance: [
                { path: '/compliance/whistleblower', label: 'Whistleblower Cases', icon: Lock },
            ],
            executive: [
                { path: '/executive/analytics', label: 'Risk Analytics', icon: TrendingUp },
            ]
        };

        return [...baseItems, ...(roleSpecificItems[role] || [])];
    };

    const menuItems = getMenuItems();



    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    return (
        <>
            <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shadow-sm flex flex-col justify-between">
                <nav className="flex flex-col flex-grow p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium
                        ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                                    : 'text-text-secondary hover:text-primary hover:bg-gray-50'}`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-primary' : 'text-gray-400'}`} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link
                        to="/admin/settings"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium
                    ${isActive('/admin/settings')
                                ? 'bg-primary/10 text-primary border-r-4 border-primary'
                                : 'text-text-secondary hover:text-primary hover:bg-gray-50'}`}
                    >
                        <Settings className={`h-5 w-5 ${isActive('/admin/settings') ? 'text-primary' : 'text-gray-400'}`} />
                        <span>Settings</span>
                    </Link>

                    <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                confirmText="Sign Out"
                variant="danger"
            />
        </>
    );
}
