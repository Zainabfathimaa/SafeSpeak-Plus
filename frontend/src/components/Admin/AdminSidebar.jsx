import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, TrendingUp, Lock, Settings, AlertCircle } from 'lucide-react';

export function AdminSidebar({ role = 'admin' }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    // Define menu items based on role
    const getMenuItems = () => {
        const baseItems = [
            { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/admin/reports', label: 'All Reports', icon: FileText },
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

    return (
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shadow-sm">
            <nav className="flex flex-col h-full p-4 space-y-2">
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

                <div className="flex-grow"></div>

                <div className="pt-4 border-t border-gray-100">
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
                </div>
            </nav>
        </aside>
    );
}
