import React from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';

export default function AdminSettings() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            <AdminHeader roleName="Settings" />
            <div className="flex flex-1">
                <AdminSidebar role="admin" />
                <main className="flex-1 p-6 lg:p-8">
                    <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
                    <p className="text-gray-500">System settings coming soon.</p>
                </main>
            </div>
        </div>
    );
}
