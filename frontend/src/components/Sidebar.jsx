import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, ArrowUpRight, BookOpen, Settings, LogOut } from 'lucide-react';
import { logout } from '../services/authService';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useState } from 'react';

export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/report-status', label: 'My Reports', icon: FileText },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
        { path: '/stories', label: 'Stories', icon: BookOpen },
    ];

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
            <aside className="hidden md:block w-64 glass-panel border-r border-white/40 h-screen sticky top-0 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
                <nav className="flex flex-col flex-grow p-5 space-y-2.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold group relative overflow-hidden
                        ${isActive(item.path)
                                    ? 'bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,1),_0_2px_10px_rgba(0,0,0,0.04)]'
                                    : 'text-slate-500 hover:text-primary hover:bg-white/60 hover:shadow-sm'}`}
                        >
                            <item.icon className={`h-5 w-5 z-10 ${isActive(item.path) ? 'text-primary drop-shadow-sm' : 'text-slate-400 group-hover:text-primary transition-colors'}`} />
                            <span className="z-10">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-5 border-t border-white/50 space-y-2.5 bg-gradient-to-t from-white/40 to-transparent">
                    <Link
                        to="/settings"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold group
                    ${isActive('/settings')
                                ? 'bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,1),_0_2px_10px_rgba(0,0,0,0.04)]'
                                : 'text-slate-500 hover:text-primary hover:bg-white/60 hover:shadow-sm'}`}
                    >
                        <Settings className={`h-5 w-5 ${isActive('/settings') ? 'text-primary drop-shadow-sm' : 'text-slate-400 group-hover:text-primary transition-colors'}`} />
                        <span>Settings</span>
                    </Link>

                    <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold group text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
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
