import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { Footer } from '../../components/Footer';
import userService from '../../services/userService';
import { Search, Shield, User, CheckCircle2, XCircle, MailWarning } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.anonymousCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'counsellor': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'executive': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'compliance-officer': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'department-head': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200'; // user
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            <AdminHeader roleName="User Management" />
            <div className="flex flex-1">
                <AdminSidebar role="admin" />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-text-secondary mt-2">View and manage all registered users and staff</p>
                        </div>

                        {/* Filters and Search */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or anon code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>

                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter Role:</span>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pl-3 pr-10 py-2 border bg-white"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="counsellor">Counsellor</option>
                                    <option value="executive">Executive</option>
                                    <option value="compliance-officer">Compliance Officer</option>
                                    <option value="department-head">Department Head</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                    Loading users...
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">User Info</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Role</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Email Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Joined Date</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Reports</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                                    {user.role === 'admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 border-b border-transparent">
                                                                        {user.fullName || (user.anonymousCode ? `Anon: ${user.anonymousCode}` : 'Unnamed User')}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {user.idRevealConsent ? (user.email || 'No email (Anonymous)') : 'Hidden by user'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('-', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {user.isEmailVerified ? (
                                                                <div className="flex items-center text-green-600 text-sm font-medium">
                                                                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                                                    Verified
                                                                </div>
                                                            ) : user.email ? (
                                                                <div className="flex items-center text-amber-600 text-sm font-medium">
                                                                    <MailWarning className="h-4 w-4 mr-1.5" />
                                                                    Pending
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center text-gray-500 text-sm font-medium">
                                                                    <XCircle className="h-4 w-4 mr-1.5" />
                                                                    N/A
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                            {/* We don't have report count per user directly in the user model right now, so placeholder */}
                                                            <span className="text-gray-400 text-xs italic">Analytics</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                        <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                                        <p className="text-lg font-medium text-gray-900">No users found</p>
                                                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
