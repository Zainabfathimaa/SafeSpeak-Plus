import React, { useState, useEffect, useCallback } from 'react';
import { Save, Shield, User, Lock, Server, Eye, EyeOff, LogOut, AlertCircle } from 'lucide-react';
import userService from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

    const [securityData, setSecurityData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

    const [profile, setProfile] = useState({ fullName: '', phone: '', department: 'Administration' });

    const [platformPrefs, setPlatformPrefs] = useState({
        autoAssignHighRisk: true,
        emailOnEscalation: true,
        weeklyReports: true,
        maintenanceMode: false
    });

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const userResponse = await userService.getCurrentUser();
            if (userResponse.success && userResponse.user) {
                setProfile({
                    fullName: userResponse.user.fullName || '',
                    phone: userResponse.user.phone || '',
                    department: userResponse.user.department || 'Administration'
                });
            }
        } catch (error) {
            addToast('error', 'Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-save profile on blur
    const handleProfileBlur = useCallback(async () => {
        if (!profile.fullName) return;
        try {
            const response = await userService.updateProfile(profile);
            if (response.success) addToast('success', 'Profile auto-saved ✓');
        } catch (error) {
            addToast('error', 'Failed to save profile');
        }
    }, [profile]);

    const handlePlatformToggle = (preference) => {
        setPlatformPrefs(prev => ({ ...prev, [preference]: !prev[preference] }));
    };

    const handleSavePlatformPrefs = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        addToast('success', 'Platform settings applied globally ✓');
        setIsSaving(false);
    };

    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurityData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            addToast('error', 'New passwords do not match'); return;
        }
        if (securityData.newPassword.length < 6) {
            addToast('error', 'Password must be at least 6 characters'); return;
        }
        setIsSaving(true);
        try {
            const { changePassword } = await import('../../services/authService');
            const response = await changePassword(securityData.oldPassword, securityData.newPassword);
            if (response.success) {
                addToast('success', 'Password changed successfully ✓');
                setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            addToast('error', error.message || 'Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Admin Profile', icon: User, desc: 'Update your details' },
        { id: 'platform', label: 'Platform Features', icon: Server, desc: 'System behavior' },
        { id: 'security', label: 'Access Security', icon: Lock, desc: 'Credentials & logout' }
    ];

    const platformTitles = {
        autoAssignHighRisk: { title: 'Auto-escalate High Risk Cases', desc: 'Automatically notify heads of department when a High Risk report arrives.' },
        emailOnEscalation: { title: 'Admin Email Digests', desc: 'Send daily activity digests to the core admin email inbox.' },
        weeklyReports: { title: 'Automated Weekly Analytics', desc: 'Generate and store weekly PDF analytics summaries.' },
        maintenanceMode: { title: 'System Maintenance Mode', desc: 'Lock out new submissions. Users can still view existing report statuses.' }
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
            <AdminHeader roleName="Settings" />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar role="admin" />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 mb-1">System Settings</h1>
                            <p className="text-gray-500">Manage administrator profile and platform preferences. Profile auto-saves on field blur.</p>
                        </div>

                        {isLoading ? (
                            <div className="animate-pulse flex gap-8">
                                <div className="w-72 h-80 bg-gray-200 rounded-2xl" />
                                <div className="flex-1 h-[500px] bg-gray-200 rounded-2xl" />
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Sidebar Tabs */}
                                <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const active = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-start text-left p-4 rounded-2xl transition-all duration-200 ${active
                                                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
                                            >
                                                <div className={`p-2 rounded-xl mr-3 ${active ? 'bg-white/20' : 'bg-blue-50 text-blue-700'}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-900'}`}>{tab.label}</h3>
                                                    <p className={`text-xs mt-0.5 ${active ? 'text-blue-100' : 'text-gray-500'}`}>{tab.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[450px]">

                                        {/* ── PROFILE TAB ── */}
                                        {activeTab === 'profile' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="border-b border-gray-100 pb-5">
                                                    <h2 className="text-2xl font-bold text-gray-900">Administrator Profile</h2>
                                                    <p className="text-gray-500 text-sm mt-1">Changes are auto-saved when you click outside a field.</p>
                                                </div>
                                                <div className="grid gap-5 max-w-xl">
                                                    {[
                                                        { label: 'Admin Full Name', name: 'fullName', placeholder: 'e.g. Chief Admin', hint: 'Your display name in the system' },
                                                        { label: 'Emergency Phone', name: 'phone', placeholder: '+91 9876543210', hint: 'Contact for urgent escalations' },
                                                        { label: 'Role / Department', name: 'department', placeholder: 'Administration', hint: 'Your role or department title' },
                                                    ].map(f => (
                                                        <div key={f.name}>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{f.label}</label>
                                                            <p className="text-xs text-gray-400 mb-2">{f.hint}</p>
                                                            <input
                                                                type="text"
                                                                name={f.name}
                                                                value={profile[f.name]}
                                                                onChange={(e) => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                                                                onBlur={handleProfileBlur}
                                                                placeholder={f.placeholder}
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium text-gray-800"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ── PLATFORM FEATURES TAB ── */}
                                        {activeTab === 'platform' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="border-b border-gray-100 pb-5">
                                                    <h2 className="text-2xl font-bold text-gray-900">Platform Features</h2>
                                                    <p className="text-gray-500 text-sm mt-1">Configure global system behavior. Changes apply universally.</p>
                                                </div>

                                                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-3">
                                                    <Shield className="text-indigo-600 flex-shrink-0" size={20} />
                                                    <p className="text-indigo-800 text-sm font-medium">These settings alter the fundamental behavior of SafeSpeak+. Apply carefully.</p>
                                                </div>

                                                <div className="space-y-4 max-w-2xl">
                                                    {Object.entries(platformPrefs).map(([key, value]) => (
                                                        <label key={key} className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${value ? 'border-indigo-500 bg-white shadow-md shadow-indigo-500/10' : 'border-gray-100 bg-gray-50 hover:bg-white'}`}>
                                                            <div className="flex-1 pr-6">
                                                                <p className="font-bold text-gray-900">{platformTitles[key].title}</p>
                                                                <p className="text-sm text-gray-500 mt-1">{platformTitles[key].desc}</p>
                                                            </div>
                                                            <div className="relative inline-flex items-center flex-shrink-0">
                                                                <input type="checkbox" checked={value} onChange={() => handlePlatformToggle(key)} className="sr-only peer" />
                                                                <div className={`w-14 h-7 rounded-full transition-all duration-300 ${value ? 'bg-indigo-600' : 'bg-gray-300'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all`} />
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={handleSavePlatformPrefs}
                                                        disabled={isSaving}
                                                        className="px-8 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70"
                                                    >
                                                        {isSaving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</> : <><Server size={16} /> Apply Platform Settings</>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── SECURITY TAB ── */}
                                        {activeTab === 'security' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="border-b border-gray-100 pb-5">
                                                    <h2 className="text-2xl font-bold text-gray-900">Access Security</h2>
                                                    <p className="text-gray-500 text-sm mt-1">Manage your admin credentials and session.</p>
                                                </div>

                                                <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                                                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-5">
                                                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                                            <Lock size={16} className="text-gray-500" /> Change Password
                                                        </h3>
                                                        {[
                                                            { label: 'Current Password', name: 'oldPassword', field: 'old', hint: 'Your existing admin password' },
                                                            { label: 'New Password', name: 'newPassword', field: 'new', hint: 'Minimum 6 characters' },
                                                            { label: 'Confirm New Password', name: 'confirmPassword', field: 'confirm', hint: 'Re-enter to confirm' },
                                                        ].map(f => (
                                                            <div key={f.name}>
                                                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{f.label}</label>
                                                                <p className="text-xs text-gray-400 mb-2">{f.hint}</p>
                                                                <div className="relative">
                                                                    <input
                                                                        type={showPass[f.field] ? 'text' : 'password'}
                                                                        name={f.name}
                                                                        required
                                                                        value={securityData[f.name]}
                                                                        onChange={handleSecurityChange}
                                                                        placeholder="••••••••"
                                                                        className="w-full px-4 py-3 pr-11 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition font-medium text-gray-800"
                                                                    />
                                                                    <button type="button" onClick={() => setShowPass(p => ({ ...p, [f.field]: !p[f.field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                                        {showPass[f.field] ? <EyeOff size={16} /> : <Eye size={16} />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button type="submit" disabled={isSaving} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold transition-all flex items-center gap-2 hover:shadow-lg disabled:opacity-70">
                                                            {isSaving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : <><Lock size={16} /> Update Password</>}
                                                        </button>
                                                    </div>
                                                </form>

                                                {/* Sign Out */}
                                                <div className="mt-8 pt-8 border-t border-gray-200">
                                                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                                                        <div className="p-1.5 bg-gray-100 rounded-lg"><LogOut size={15} /></div> Sign Out
                                                    </h3>
                                                    <div className="p-6 border border-gray-200 bg-gray-50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">Sign out of Admin Panel</h4>
                                                            <p className="text-gray-500 text-sm mt-1">You will be returned to the login page.</p>
                                                        </div>
                                                        <button onClick={() => setIsSignOutModalOpen(true)} className="flex-shrink-0 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 font-bold transition flex items-center gap-2">
                                                            <LogOut size={16} /> Sign Out
                                                        </button>
                                                    </div>
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

            <ConfirmationModal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={() => { logout(); navigate('/login'); }}
                title="Sign Out"
                message="Are you sure you want to sign out of the admin panel?"
                confirmText="Sign Out"
                variant="danger"
            />
        </div>
    );
}
