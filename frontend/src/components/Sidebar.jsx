import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, ArrowUpRight, BookOpen, Settings, LogOut } from 'lucide-react';
import { logout } from '../services/authService';

export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/report-status', label: 'My Reports', icon: FileText },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
        { path: '/escalate', label: 'Escalate', icon: ArrowUpRight },
        { path: '/stories', label: 'Stories', icon: BookOpen },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col justify-between">
            <nav className="flex flex-col flex-grow p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium
                        ${isActive(item.path)
                                ? 'bg-primary/10 text-primary border-r-4 border-primary'
                                : 'text-text-secondary hover:text-primary hover:bg-gray-50'}`}
                    >
                        <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
                <Link
                    to="/settings"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium
                    ${isActive('/settings')
                            ? 'bg-primary/10 text-primary border-r-4 border-primary'
                            : 'text-text-secondary hover:text-primary hover:bg-gray-50'}`}
                >
                    <Settings className={`h-5 w-5 ${isActive('/settings') ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                    <span>Settings</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
