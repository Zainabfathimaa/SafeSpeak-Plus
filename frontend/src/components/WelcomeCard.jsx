import React from 'react';
import { Shield } from 'lucide-react';

export function WelcomeCard({ user }) {
    const displayName = user?.fullName || 'Anonymous User';
    // Display last 4 chars of user ID or placeholder if not available
    const displayId = user?.id ? `****${user.id.slice(-4).toUpperCase()}` : '****';

    return (
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-sm border border-gray-100 p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Welcome, {displayName}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-1 ml-11">Your identity is fully protected.</p>
            <p className="text-sm font-mono text-primary font-medium bg-primary/5 border border-primary/20 rounded px-2 py-1 inline-block ml-11 mt-1">{displayId}</p>
        </div>
    );
}
