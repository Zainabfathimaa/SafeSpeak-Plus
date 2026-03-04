import React, { useState, useEffect } from 'react';
import { Save, Shield, BellRing, User, Lock, Server } from 'lucide-react';
import userService from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';

export default function AdminSettings() {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

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

    // Platform preferences state
    const [platformPrefs, setPlatformPrefs] = useState({
        autoAssignHighRisk: true,
        emailOnEscalation: true,
        weeklyReports: true,
        maintenanceMode: false
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

    const handlePlatformToggle = (preference) => {
        setPlatformPrefs(prev => ({ ...prev, [preference]: !prev[preference] }));
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

    const handleSavePlatformPrefs = async () => {
        setIsSaving(true);
        try {
            // Simulate API call for platform preferences
            await new Promise(resolve => setTimeout(resolve, 800));
            addToast('success', 'Platform preferences saved across the system');
        } catch (error) {
            addToast('error', 'Failed to save preferences');
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
        { id: 'platform', label: 'Platform Features', icon: Server, desc: 'System behavior' },
        { id: 'security', label: 'Access Security', icon: Lock, desc: 'Admin credentials' }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary relative overflow-hidden">
            <div className="relative z-10 flex flex-col flex-1 w-full">
                <AdminHeader roleName="Settings" />
                <div className="flex flex-1">
                    <AdminSidebar role="admin" />
                    <main className="flex-1 p-6 lg:p-8 xl:p-10 relative">

                        <div className="max-w-6xl mx-auto min-h-[calc(100vh-160px)]">
                            <div className="mb-10">
                                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 mb-2">System Settings</h1>
                                <p className="text-gray-500 text-lg">Manage administrator profile and global platform preferences</p>
                            </div>

                            {isLoading ? (
                                <div className="animate-pulse flex flex-col md:flex-row gap-8">
                                    <div className="w-full md:w-72 h-96 bg-gray-200 rounded-2xl" />
                                    <div className="flex-1 h-[600px] bg-gray-200 rounded-2xl" />
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Sidebar Tabs */}
                                    <div className="w-full md:w-72 flex-shrink-0 space-y-2">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            const isActive = activeTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`w-full flex items-start text-left p-4 rounded-2xl transition-all duration-300 ${isActive
                                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-600/30 scale-100'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-[1.02] border border-gray-100 shadow-sm'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-xl mr-4 ${isActive ? 'bg-white/20' : 'bg-blue-50 text-blue-700'}`}>
                                                        <Icon size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>{tab.label}</h3>
                                                        <p className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>{tab.desc}</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1">
                                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full relative overflow-hidden">
                                            {/* Decorative background blob */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>

                                            {/* Profile Tab */}
                                            {activeTab === 'profile' && (
                                                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <div className="border-b border-gray-100 pb-5">
                                                        <h2 className="text-2xl font-bold text-gray-900">Administrator Profile</h2>
                                                        <p className="text-gray-500 text-sm mt-1">Reviewers and staff details.</p>
                                                    </div>

                                                    <div className="grid gap-6 max-w-xl">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Full Name</label>
                                                            <input
                                                                type="text"
                                                                name="fullName"
                                                                value={profile.fullName}
                                                                onChange={handleProfileChange}
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                                                                placeholder="e.g. Chief Admin"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Phone</label>
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                value={profile.phone}
                                                                onChange={handleProfileChange}
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role / Department</label>
                                                            <input
                                                                type="text"
                                                                name="department"
                                                                value={profile.department}
                                                                onChange={handleProfileChange}
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                                        <button
                                                            onClick={handleSaveProfile}
                                                            disabled={isSaving}
                                                            className="px-8 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70 font-bold transition-all flex items-center gap-2 transform active:scale-95"
                                                        >
                                                            {isSaving ? (
                                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                                            ) : (
                                                                <><Save size={18} /> Save Admin Details</>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Platform Features Tab */}
                                            {activeTab === 'platform' && (
                                                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <div className="border-b border-gray-100 pb-5">
                                                        <h2 className="text-2xl font-bold text-gray-900">Platform Features</h2>
                                                        <p className="text-gray-500 text-sm mt-1">Configure global platform behavior and automation.</p>
                                                    </div>

                                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 mb-6">
                                                        <div className="flex items-center gap-3 text-indigo-800 font-bold text-lg mb-2">
                                                            <Shield size={22} className="text-indigo-600" />
                                                            Global System Rules
                                                        </div>
                                                        <p className="text-indigo-800/80 text-sm font-medium">
                                                            These settings alter the fundamental behavior of SafeSpeak+. Changes here apply universally to all users and reports immediately.
                                                        </p>
                                                    </div>

                                                    <div className="space-y-4 max-w-2xl">
                                                        {Object.entries(platformPrefs).map(([key, value]) => {
                                                            const titles = {
                                                                autoAssignHighRisk: { title: "Auto-escalate High Risk Cases", desc: "Automatically notify heads of department immediately when a High Risk report lands." },
                                                                emailOnEscalation: { title: "Admin Email Digests", desc: "Send daily digests of system activity to the core admin email inbox." },
                                                                weeklyReports: { title: "Automated Weekly Analytics", desc: "Generate and securely store weekly PDF analytic summaries natively." },
                                                                maintenanceMode: { title: "System Maintenance Mode", desc: "Lock out new submissions. Users can still view existing statuses." }
                                                            };
                                                            return (
                                                                <label key={key} className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${value ? 'border-indigo-500 bg-white shadow-md shadow-indigo-500/10' : 'border-gray-100 bg-gray-50 hover:bg-white'
                                                                    }`}>
                                                                    <div className="flex-1 pr-6">
                                                                        <p className="font-bold text-gray-900">{titles[key].title}</p>
                                                                        <p className="text-sm text-gray-500 mt-1 font-medium">{titles[key].desc}</p>
                                                                    </div>
                                                                    <div className="relative inline-flex items-center flex-shrink-0">
                                                                        <input type="checkbox" checked={value} onChange={() => handlePlatformToggle(key)} className="sr-only peer" />
                                                                        <div className={`w-14 h-7 peer-focus:outline-none rounded-full peer transition-all duration-300 ${value ? 'bg-indigo-600' : 'bg-gray-300'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all shadow-inner`}></div>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                                        <button
                                                            onClick={handleSavePlatformPrefs}
                                                            disabled={isSaving}
                                                            className="px-8 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70 font-bold transition-all flex items-center gap-2 transform active:scale-95"
                                                        >
                                                            {isSaving ? (
                                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</>
                                                            ) : (
                                                                <><Server size={18} /> Apply Platform Settings</>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Security Tab */}
                                            {activeTab === 'security' && (
                                                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <div className="border-b border-gray-100 pb-5">
                                                        <h2 className="text-2xl font-bold text-gray-900">Access Security</h2>
                                                        <p className="text-gray-500 text-sm mt-1">Manage admin credentials safely.</p>
                                                    </div>

                                                    <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                                                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-5">
                                                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Lock size={18} className="text-gray-500" />
                                                                Rotate Password
                                                            </h3>

                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Admin Password</label>
                                                                <input
                                                                    type="password"
                                                                    name="oldPassword"
                                                                    required
                                                                    value={securityData.oldPassword}
                                                                    onChange={handleSecurityChange}
                                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-gray-800"
                                                                    placeholder="••••••••"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                                                    <input
                                                                        type="password"
                                                                        name="newPassword"
                                                                        required
                                                                        value={securityData.newPassword}
                                                                        onChange={handleSecurityChange}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-gray-800"
                                                                        placeholder="••••••••"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                                                    <input
                                                                        type="password"
                                                                        name="confirmPassword"
                                                                        required
                                                                        value={securityData.confirmPassword}
                                                                        onChange={handleSecurityChange}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-gray-800"
                                                                        placeholder="••••••••"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end pt-2">
                                                            <button
                                                                type="submit"
                                                                disabled={isSaving}
                                                                className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:shadow-lg hover:shadow-gray-500/30 disabled:opacity-70 font-bold transition-all flex items-center gap-2 transform active:scale-95"
                                                            >
                                                                {isSaving ? (
                                                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                                                                ) : (
                                                                    <><Lock size={18} /> Update Password</>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </form>
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
        </div>
    );
}
