import React from 'react';
import { Shield } from 'lucide-react';

export function WelcomeCard({ user }) {
    const displayName = user?.fullName || 'Anonymous User';
    // Display last 4 chars of user ID or placeholder if not available
    const displayId = user?.id ? `****${user.id.slice(-4).toUpperCase()}` : '****';

    return (
        <div className="glass-card p-5 mb-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-light transform origin-left transition-transform duration-500 ease-out"></div>
            
            {/* Soft background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>

            <div className="flex items-center space-x-3 mb-2 relative z-10">
                <div className="p-2 bg-primary/10 rounded-xl shadow-inner border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                    <Shield className="h-6 w-6 text-primary drop-shadow-sm" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Welcome back, {displayName}</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">Your secure session is active.</p>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 ml-11 relative z-10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protected ID:</span>
                <span className="text-[11px] font-mono text-primary font-bold bg-primary/5 border border-primary/20 rounded-md px-2 py-0.5 tracking-widest shadow-sm">
                    {displayId}
                </span>
            </div>
        </div>
    );
}
