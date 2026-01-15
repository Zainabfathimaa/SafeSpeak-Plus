import React from 'react';

export default function UserDashboard() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-text-primary mb-4">User Dashboard</h1>
                <p className="text-text-secondary">Welcome to your dashboard.</p>
            </div>
        </div>
    );
}
