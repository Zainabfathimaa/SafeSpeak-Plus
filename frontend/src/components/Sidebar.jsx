import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, ArrowUpRight, BookOpen, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Menu } from 'lucide-react';

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

    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <aside className={`hidden md:block glass-panel border-r border-white/40 h-screen sticky top-0 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-4 flex justify-end">
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-white/40 rounded transition-colors">
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <nav className="flex flex-col flex-grow p-4 space-y-2.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold group relative overflow-hidden
                        ${isActive(item.path)
                                    ? 'bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,1),_0_2px_10px_rgba(0,0,0,0.04)]'
                                    : 'text-slate-500 hover:text-primary hover:bg-white/60 hover:shadow-sm'}`}
                        >
                            <item.icon className={`h-5 w-5 flex-shrink-0 z-10 ${isActive(item.path) ? 'text-primary drop-shadow-sm' : 'text-slate-400 group-hover:text-primary transition-colors'}`} />
                            {!isCollapsed && <span className="z-10 whitespace-nowrap">{item.label}</span>}
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
                        <Settings className={`h-5 w-5 flex-shrink-0 ${isActive('/settings') ? 'text-primary drop-shadow-sm' : 'text-slate-400 group-hover:text-primary transition-colors'}`} />
                        {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}
