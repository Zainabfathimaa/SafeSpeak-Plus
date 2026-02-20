import React from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';

export default function AdminUsers() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            <AdminHeader roleName="User Management" />
            <div className="flex flex-1">
                <AdminSidebar role="admin" />
                <main className="flex-1 p-6 lg:p-8">
                    <h1 className="text-2xl font-bold mb-4">User Management</h1>
                    <p className="text-gray-500">User management functionality coming soon.</p>
                </main>
            </div>
        </div>
    );
}
