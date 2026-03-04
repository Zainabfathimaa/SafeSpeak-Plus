import React from 'react';
import { Shield } from 'lucide-react';

export function WelcomeCard({ user }) {
    const displayName = user?.fullName || 'Anonymous User';
    // Display last 4 chars of user ID or placeholder if not available
    const displayId = user?.id ? `****${user.id.slice(-4).toUpperCase()}` : '****';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>
            <div className="flex items-center space-x-2 mb-1">
                <div className="p-1.5 bg-primary/10 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Welcome, {displayName}</h2>
            </div>
            <p className="text-xs text-text-secondary mb-1 ml-9">Your identity is fully protected.</p>
            <p className="text-[10px] font-mono text-primary font-bold bg-primary/5 border border-primary/20 rounded-md px-1.5 py-0.5 inline-block ml-9 mt-0.5 tracking-tight">{displayId}</p>
        </div>
    );
}
