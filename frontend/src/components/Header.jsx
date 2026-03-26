import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Activity, X } from 'lucide-react'; // Added Activity and X
import { NotificationBell } from './Notifications/NotificationBell';
import { UserActivityTimeline } from './UserActivityTimeline';

export function Header() {
    const navigate = useNavigate();
    const [isActivityOpen, setIsActivityOpen] = useState(false);

    // Logout removed based on user request
    return (
        <>
            <nav className="bg-primary/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-primary/10 transition-all duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Shield className="h-8 w-8 text-white" />
                        <span className="text-xl font-bold text-white">SafeSpeak+</span>
                    </Link>
                    <h1 className="text-lg font-semibold text-white/90 hidden md:block">User Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsActivityOpen(true)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative group"
                            title="View Activity History"
                        >
                            <Activity className="h-5 w-5" />
                        </button>
                        
                        <NotificationBell />
                    </div>
                </div>
            </nav>

            {/* Activity History Modal */}
            {isActivityOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
                    <div className="relative w-full max-w-4xl bg-transparent my-auto">
                        <button 
                            onClick={() => setIsActivityOpen(false)}
                            className="absolute -top-10 right-0 p-2 text-white hover:text-red-400 bg-black/20 hover:bg-white/10 rounded-full transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-2xl scrollbar-hide">
                            <UserActivityTimeline />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
