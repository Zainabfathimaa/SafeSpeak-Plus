import React, { useState, useEffect } from 'react';
import { Save, Shield, BellRing, User, Lock, Server, LogOut } from 'lucide-react';
import userService from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { Input } from '../../components/ui/Input';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

export default function AdminSettings() {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Security tab state
    const [securityData, setSecurityData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Profile tab state
    const [profile, setProfile] = useState({
        fullName: '',
        phone: '',
        department: 'Administration'
    });



    // Fetch current settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            // Fetch profile
            const userResponse = await userService.getCurrentUser();
            if (userResponse.success && userResponse.user) {
                setProfile({
                    fullName: userResponse.user.fullName || '',
                    phone: userResponse.user.phone || '',
                    department: userResponse.user.department || 'Administration'
                });
            }
            // Note: Ideally we would fetch platform preferences from backend here too
        } catch (error) {
            addToast('error', 'Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };



    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await userService.updateProfile(profile);
            if (response.success) {
                addToast('success', 'Admin Profile updated successfully');
            }
        } catch (error) {
            addToast('error', error.message || 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };



    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurityData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            addToast('error', 'New passwords do not match');
            return;
        }
        if (securityData.newPassword.length < 6) {
            addToast('error', 'New password must be at least 6 characters');
            return;
        }

        setIsSaving(true);
        try {
            const { changePassword } = await import('../../services/authService');
            const response = await changePassword(securityData.oldPassword, securityData.newPassword);
            if (response.success) {
                addToast('success', 'Admin Password changed successfully');
                setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            addToast('error', error.message || 'Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Admin Profile', icon: User, desc: 'Update details' },

        { id: 'security', label: 'Access Security', icon: Lock, desc: 'Admin credentials' }
    ];

    return (
        <>
            <div className="flex h-screen overflow-hidden flex-col bg-gray-50 text-gray-900 text-sm">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                <AdminSidebar role="admin" />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="md:flex md:items-center md:justify-between mb-8 pb-5 border-b border-gray-200">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">System Settings</h1>
                                <p className="mt-1 text-sm text-gray-500">Manage administrator profile and global platform preferences.</p>
                            </div>
                            <div className="mt-4 flex md:ml-4 md:mt-0">
                                <button
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 focus:ring-2 focus:ring-primary hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut className="-ml-0.5 mr-1.5 h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="animate-pulse flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-64 h-96 bg-gray-200 rounded-md" />
                                <div className="flex-1 max-w-3xl h-[600px] bg-gray-200 rounded-md" />
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Sidebar Tabs */}
                                <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full group flex items-center text-left px-3 py-2 rounded-md transition-colors text-sm font-medium ${isActive
                                                    ? 'bg-primary/10 text-primary-dark'
                                                    : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
                                                    }`}
                                            >
                                                <Icon className={`mr-3 flex-shrink-0 h-4 w-4 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                                                <span className="truncate">{tab.label}</span>
                                            </button>
                                        )
                                    })}
                                </nav>

                                {/* Content Area */}
                                <div className="flex-1 max-w-3xl">
                                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                                            {/* Profile Tab */}
                                            {activeTab === 'profile' && (
                                                <div className="animate-in fade-in duration-300">
                                                    <div className="px-4 py-5 sm:p-6">
                                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Administrator Profile</h3>
                                                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                                                            <p>Reviewers and staff details.</p>
                                                        </div>
                                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 max-w-xl">
                                                            <div className="sm:col-span-6">
                                                                <label className="block text-sm font-medium text-gray-700">Admin Full Name</label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="text"
                                                                        name="fullName"
                                                                        value={profile.fullName}
                                                                        onChange={handleProfileChange}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                                                        placeholder="e.g. Chief Admin"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="sm:col-span-6">
                                                                <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="tel"
                                                                        name="phone"
                                                                        value={profile.phone}
                                                                        onChange={handleProfileChange}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="sm:col-span-6">
                                                                <label className="block text-sm font-medium text-gray-700">Role / Department</label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="text"
                                                                        name="department"
                                                                        value={profile.department}
                                                                        onChange={handleProfileChange}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-b-lg border-t border-gray-200">
                                                        <button
                                                            onClick={handleSaveProfile}
                                                            disabled={isSaving}
                                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark disabled:opacity-70 transition-colors"
                                                        >
                                                            {isSaving ? 'Saving...' : 'Save Admin Details'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}



                                            {/* Security Tab */}
                                            {activeTab === 'security' && (
                                                <div className="animate-in fade-in duration-300">
                                                    <div className="px-4 py-5 sm:p-6">
                                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Access Security</h3>
                                                        <div className="mt-2 text-sm text-gray-500 mb-6">
                                                            <p>Manage admin credentials safely.</p>
                                                        </div>
                                                        <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                                                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                                <div className="sm:col-span-6">
                                                                    <label className="block text-sm font-medium text-gray-700">Current Admin Password</label>
                                                                    <div className="mt-1">
                                                                        <input
                                                                            type="password"
                                                                            name="oldPassword"
                                                                            required
                                                                            value={securityData.oldPassword}
                                                                            onChange={handleSecurityChange}
                                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="sm:col-span-3">
                                                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                                                    <div className="mt-1">
                                                                        <input
                                                                            type="password"
                                                                            name="newPassword"
                                                                            required
                                                                            value={securityData.newPassword}
                                                                            onChange={handleSecurityChange}
                                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="sm:col-span-3">
                                                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                                                    <div className="mt-1">
                                                                        <input
                                                                            type="password"
                                                                            name="confirmPassword"
                                                                            required
                                                                            value={securityData.confirmPassword}
                                                                            onChange={handleSecurityChange}
                                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    type="submit"
                                                                    disabled={isSaving}
                                                                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark disabled:opacity-70 transition-colors"
                                                                >
                                                                    {isSaving ? 'Updating...' : 'Update Password'}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={async () => {
                    const { logout } = await import('../../services/authService');
                    logout();
                    window.location.href = '/login';
                }}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                confirmText="Sign Out"
                variant="danger"
            />
        </>
    );
}
