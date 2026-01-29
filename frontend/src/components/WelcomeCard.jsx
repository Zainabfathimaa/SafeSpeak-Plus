import React from 'react';
import { Shield } from 'lucide-react';

export function WelcomeCard() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold text-text-primary">Welcome, Anonymous User</h2>
            </div>
            <p className="text-sm text-text-secondary mb-1">Your identity is fully protected.</p>
            <p className="text-sm font-mono text-text-secondary bg-gray-50 rounded px-2 py-1 inline-block">****A92X</p>
        </div>
    );
}
