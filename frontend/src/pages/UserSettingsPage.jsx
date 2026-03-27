import React, { useState, useEffect, useCallback } from 'react';
import { Save, AlertCircle, Trash2, Shield, BellRing, User, Lock, Palette, CheckCircle2, LogOut, Eye, EyeOff, Info } from 'lucide-react';
import userService from '../services/userService';
import { useToast } from '../hooks/useToast';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Input } from '../components/ui/Input';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const UserSettingsPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Appearance state
  const [appearance, setAppearance] = useState(() => {
    return { theme: localStorage.getItem('safeSpeak_theme') || 'light' };
  });

  // Apply Theme
  useEffect(() => {
    document.documentElement.className = appearance.theme;
    localStorage.setItem('safeSpeak_theme', appearance.theme);
  }, [appearance.theme]);

  // Security tab state
  const [securityData, setSecurityData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  // Profile tab state
  const [profile, setProfile] = useState({ fullName: '', phone: '', department: '' });

  // Notification preferences state
  const [notifyPrefs, setNotifyPrefs] = useState({
    emailNotifications: {
      reportStatusUpdates: true,
      storyUpdates: true,
      newMessages: true,
      systemAlerts: true,
      weeklyDigest: false
    },
    inAppNotifications: {
      reportStatusUpdates: true,
      storyUpdates: true,
      newMessages: true,
      systemAlerts: true
    },
    preferredNotificationTime: '09:00'
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({ idRevealConsent: false });

  // Fetch current settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const userResponse = await userService.getCurrentUser();
      if (userResponse.success && userResponse.user) {
        setProfile({
          fullName: userResponse.user.fullName || '',
          phone: userResponse.user.phone || '',
          department: userResponse.user.department || ''
        });
        setPrivacy({ idRevealConsent: userResponse.user.idRevealConsent || false });
      }

      const prefsResponse = await userService.getPreferences();
      if (prefsResponse.success && prefsResponse.preferences) {
        const prefs = prefsResponse.preferences;
        if (prefs.notificationPreferences) {
          setNotifyPrefs(prev => ({ ...prev, ...prefs.notificationPreferences }));
        }
        if (prefs.appearance) {
          setAppearance(prefs.appearance);
        }
      }
    } catch (error) {
      addToast('error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save profile on field blur
  const handleProfileBlur = useCallback(async () => {
    if (!profile.fullName) return;
    try {
      const response = await userService.updateProfile(profile);
      if (response.success) {
        addToast('success', 'Profile auto-saved ✓');
      }
    } catch (error) {
      addToast('error', 'Failed to auto-save profile');
    }
  }, [profile]);

  // Save appearance immediately on toggle
  const handleThemeChange = async (theme) => {
    const newAppearance = { ...appearance, theme };
    setAppearance(newAppearance);
    try {
      await userService.updateAppearancePreferences(newAppearance);
      addToast('success', `${theme === 'dark' ? 'Dark' : 'Light'} mode applied ✓`);
    } catch (error) {
      addToast('error', 'Failed to save appearance');
    }
  };

  // Save notification toggle immediately
  const handleNotificationToggle = async (category, preference) => {
    const updated = {
      ...notifyPrefs,
      [category]: {
        ...notifyPrefs[category],
        [preference]: !notifyPrefs[category][preference]
      }
    };
    setNotifyPrefs(updated);
    try {
      await userService.updateNotificationPreferences(updated);
      addToast('success', 'Preference updated ✓');
    } catch (error) {
      addToast('error', 'Failed to save preference');
    }
  };

  // Save notification time on blur
  const handleNotifTimeBlur = async () => {
    try {
      await userService.updateNotificationPreferences(notifyPrefs);
      addToast('success', 'Notification time saved ✓');
    } catch (error) {
      addToast('error', 'Failed to save notification time');
    }
  };

  // Save privacy immediately on toggle
  const handleIdConsentChange = async (value) => {
    setPrivacy({ idRevealConsent: value });
    try {
      const response = await userService.updateIdRevealConsent(value);
      if (response.success) {
        addToast('success', value ? 'Identity revealed to admins ✓' : 'You are now fully anonymous ✓');
      }
    } catch (error) {
      addToast('error', 'Failed to save privacy setting');
    }
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
      const { changePassword } = await import('../services/authService');
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

  const executeDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    setIsSaving(true);
    try {
      const response = await userService.deleteAccount();
      if (response.success) {
        addToast('success', 'Account deleted.');
        const { logout } = await import('../services/authService');
        logout();
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } else {
        addToast('error', response.message || 'Failed to delete account');
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to delete account');
    } finally {
      setIsSaving(false);
    }
  };

  // Notification descriptions
  const notifDescriptions = {
    reportStatusUpdates: 'Get alerted when your incident report status changes (reviewed, resolved, escalated, etc.)',
    storyUpdates: 'Get notified when your submitted story is approved, rejected, or gets a comment.',
    newMessages: 'Get notified when you receive a direct message from an admin or the platform.',
    systemAlerts: 'Important announcements about the platform, maintenance windows, and policy changes.',
    weeklyDigest: 'Receive a weekly summary email of your reports, stories, and overall platform activity.'
  };

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'privacy', label: 'Privacy & Identity', icon: Shield },
    { id: 'security', label: 'Account Security', icon: Lock }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto animate-pulse flex gap-8 mt-10">
              <div className="w-64 h-96 bg-gray-200 rounded-2xl" />
              <div className="flex-1 h-[600px] bg-gray-200 rounded-2xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full relative">
          <div className="max-w-6xl mx-auto relative z-10 w-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Account Settings</h1>
              <p className="text-gray-500 text-sm">All changes are saved automatically when you leave a field.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center text-left p-3 rounded-xl transition-all duration-200 ${active
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${active ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary'}`}>
                        <Icon size={18} />
                      </div>
                      <h3 className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-900'}`}>{tab.label}</h3>
                    </button>
                  );
                })}
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm min-h-[500px]">

                  {/* ── PROFILE TAB ── */}
                  {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
                        <p className="text-gray-500 text-sm mt-1">Changes are auto-saved when you click outside a field.</p>
                      </div>

                      <div className="grid gap-6 max-w-xl">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                            onBlur={handleProfileBlur}
                            className="w-full px-5 py-3.5 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-semibold text-gray-800 shadow-sm"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                            onBlur={handleProfileBlur}
                            className="w-full px-5 py-3.5 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-semibold text-gray-800 shadow-sm"
                            placeholder="+91 9876543210"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Department / Course</label>
                          <input
                            type="text"
                            name="department"
                            value={profile.department}
                            onChange={(e) => setProfile(p => ({ ...p, department: e.target.value }))}
                            onBlur={handleProfileBlur}
                            className="w-full px-5 py-3.5 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-semibold text-gray-800 shadow-sm"
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 italic flex items-center gap-1.5">
                        <Info size={12} /> These details are stored privately and hidden from admins unless you share your identity in Privacy settings.
                      </p>
                    </div>
                  )}

                  {/* ── APPEARANCE TAB ── */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Appearance</h2>
                        <p className="text-gray-500 text-sm mt-1">Click a theme to apply it instantly.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        {[
                          { id: 'light', label: 'Light Mode', preview: 'bg-gray-100', inner: 'bg-white' },
                          { id: 'dark', label: 'Dark Mode', preview: 'bg-gray-900', inner: 'bg-gray-700' },
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${appearance.theme === t.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${t.preview} flex items-center justify-center border border-gray-300`}>
                                <div className={`w-5 h-5 rounded-full ${t.inner} border border-gray-300`} />
                              </div>
                              <span className="font-semibold text-gray-900">{t.label}</span>
                            </div>
                            {appearance.theme === t.id && <CheckCircle2 className="text-primary w-5 h-5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── NOTIFICATIONS TAB ── */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                        <p className="text-gray-500 text-sm mt-1">Toggle any preference — it saves automatically.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-10">
                        {/* Email Notifications */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">@</div>
                            <h3 className="font-bold text-gray-800">Email Alerts</h3>
                          </div>
                          <div className="space-y-3">
                            {Object.entries(notifyPrefs.emailNotifications).map(([key, value]) => (
                              <label key={key} className="flex items-start gap-3 cursor-pointer group p-3.5 bg-white border border-gray-100 hover:border-primary/30 hover:bg-blue-50/30 rounded-2xl transition-all shadow-sm">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-800 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">{notifDescriptions[key] || ''}</p>
                                </div>
                                <div className="relative flex-shrink-0 mt-0.5">
                                  <input type="checkbox" checked={value} onChange={() => handleNotificationToggle('emailNotifications', key)} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary cursor-pointer" />
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* In-App Notifications */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <BellRing size={14} />
                            </div>
                            <h3 className="font-bold text-gray-800">In-App Alerts</h3>
                          </div>
                          <div className="space-y-3">
                            {Object.entries(notifyPrefs.inAppNotifications).map(([key, value]) => (
                              <label key={key} className="flex items-start gap-3 cursor-pointer group p-3.5 bg-white border border-gray-100 hover:border-primary/30 hover:bg-blue-50/30 rounded-2xl transition-all shadow-sm">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-800 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">{notifDescriptions[key] || ''}</p>
                                </div>
                                <div className="relative flex-shrink-0 mt-0.5">
                                  <input type="checkbox" checked={value} onChange={() => handleNotificationToggle('inAppNotifications', key)} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary cursor-pointer" />
                                </div>
                              </label>
                            ))}
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Daily Summary Time</label>
                            <p className="text-xs text-gray-500 mb-3">We'll send your in-app digest at this time each day.</p>
                            <input
                              type="time"
                              value={notifyPrefs.preferredNotificationTime}
                              onChange={(e) => setNotifyPrefs(prev => ({ ...prev, preferredNotificationTime: e.target.value }))}
                              onBlur={handleNotifTimeBlur}
                              className="px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-semibold text-gray-800 shadow-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── PRIVACY TAB ── */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Privacy & Identity</h2>
                        <p className="text-gray-500 text-sm mt-1">Click a choice to apply it instantly.</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-primary/20 rounded-2xl p-6 flex gap-4 shadow-sm">
                        <AlertCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                        <div className="text-primary-dark">
                          <p className="font-bold text-lg mb-1">Platform Anonymity Guarantee</p>
                          <p className="text-sm leading-relaxed font-medium opacity-90">
                            By default, your name and contact details are completely hidden from administrators. They will only see an anonymous user ID until you choose to reveal your identity below.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 max-w-2xl">
                        {[
                          {
                            value: false,
                            icon: Shield,
                            title: 'Stay Strictly Anonymous',
                            desc: 'Your email, name, and phone are thoroughly hidden from all admins and reviewers. Reports are linked only to an anonymous code.',
                          },
                          {
                            value: true,
                            icon: User,
                            title: 'Reveal My Identity',
                            desc: 'Trust administrators with your real name and email to help verify and fast-track your reports. You can withdraw consent at any time.',
                          }
                        ].map(opt => {
                          const Icon = opt.icon;
                          const active = privacy.idRevealConsent === opt.value;
                          return (
                            <button
                              key={String(opt.value)}
                              onClick={() => handleIdConsentChange(opt.value)}
                              className={`w-full text-left border-2 rounded-3xl p-6 transition-all duration-300 ${active
                                ? 'border-primary bg-gradient-to-br from-white to-blue-50/50 shadow-xl shadow-primary/10 ring-2 ring-primary/20'
                                : 'border-gray-200 bg-white hover:border-primary/30 shadow-sm hover:shadow-md'}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                  <Icon size={22} />
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900 text-lg">{opt.title}</p>
                                  <p className="text-sm text-gray-600 mt-1">{opt.desc}</p>
                                </div>
                                {active && <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── SECURITY TAB ── */}
                  {activeTab === 'security' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Account Security</h2>
                        <p className="text-gray-500 text-sm mt-1">Change your password or delete your account.</p>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                        <div className="p-8 bg-white/60 border border-gray-100 rounded-3xl shadow-sm space-y-5">
                          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-xl"><Lock size={18} /></div>
                            Change Password
                          </h3>

                          {[
                            { label: 'Current Password', name: 'oldPassword', field: 'old', hint: 'Enter your current account password' },
                            { label: 'New Password', name: 'newPassword', field: 'new', hint: 'Must be at least 6 characters' },
                            { label: 'Confirm New Password', name: 'confirmPassword', field: 'confirm', hint: 'Re-enter your new password to confirm' },
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
                                  className="w-full px-5 py-3.5 pr-12 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-semibold text-gray-800 shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPass(p => ({ ...p, [f.field]: !p[f.field] }))}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPass[f.field] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl disabled:opacity-70 font-bold transition-all flex items-center gap-2 hover:shadow-xl hover:shadow-gray-500/20"
                          >
                            {isSaving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : <><Lock size={16} /> Update Password</>}
                          </button>
                        </div>
                      </form>

                      {/* Sign Out */}
                      <div className="mt-8 pt-8 border-t border-gray-200/50">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                          <div className="p-1.5 bg-gray-100 rounded-lg"><LogOut size={16} /></div>
                          Sign Out
                        </h3>
                        <div className="p-6 border border-gray-200 bg-gray-50 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <h4 className="font-bold text-gray-900">Sign out of SafeSpeak+</h4>
                            <p className="text-gray-500 text-sm mt-1">You will be redirected to the login page. Your data will be preserved.</p>
                          </div>
                          <button
                            onClick={() => setIsSignOutModalOpen(true)}
                            className="flex-shrink-0 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-2xl hover:bg-gray-100 hover:border-gray-300 font-bold transition flex items-center gap-2"
                          >
                            <LogOut size={18} /> Sign Out
                          </button>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="mt-10 pt-8 border-t border-red-100/50">
                        <h3 className="font-bold text-red-600 flex items-center gap-2 mb-5">
                          <div className="p-1.5 bg-red-100 rounded-lg"><AlertCircle size={16} /></div>
                          Danger Zone
                        </h3>
                        <div className="p-8 border border-red-200 bg-gradient-to-r from-red-50 to-white rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
                          <div>
                            <h4 className="font-bold text-gray-900 text-xl">Delete Account</h4>
                            <p className="text-gray-600 mt-2 max-w-md leading-relaxed font-medium text-sm">
                              Permanently delete your account and all associated data including reports, stories, and activity history. This action <strong>cannot be undone</strong>.
                            </p>
                          </div>
                          <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex-shrink-0 px-8 py-4 bg-white text-red-600 border border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300 font-bold transition-all flex items-center gap-2 shadow-sm"
                          >
                            <Trash2 size={20} /> Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure? This will permanently erase your account, all reports, stories, and activity history. This cannot be undone."
        confirmText="Delete Account"
        variant="danger"
      />
      <ConfirmationModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => { logout(); navigate('/login'); }}
        title="Sign Out"
        message="Are you sure you want to sign out of SafeSpeak+?"
        confirmText="Sign Out"
        variant="danger"
      />
    </div>
  );
};

export default UserSettingsPage;
