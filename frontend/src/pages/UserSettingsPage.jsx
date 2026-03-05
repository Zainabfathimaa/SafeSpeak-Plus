import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Trash2, Shield, BellRing, User, Lock, Palette, CheckCircle2 } from 'lucide-react';
import userService from '../services/userService';
import { useToast } from '../hooks/useToast';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const UserSettingsPage = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Appearance state (Functional)
  const [appearance, setAppearance] = useState(() => {
    // Load from local storage or default
    const savedTheme = localStorage.getItem('safeSpeak_theme');
    return {
      theme: savedTheme || 'light'
    };
  });

  // Apply Theme Changes
  useEffect(() => {
    document.documentElement.className = appearance.theme;

    // Save to local storage instantly for immediate persistence without Backend API
    localStorage.setItem('safeSpeak_theme', appearance.theme);
  }, [appearance]);

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
    department: ''
  });

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
  const [privacy, setPrivacy] = useState({
    idRevealConsent: false
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
          department: userResponse.user.department || ''
        });
      }

      // Fetch preferences
      const prefsResponse = await userService.getPreferences();
      if (prefsResponse.success && prefsResponse.preferences) {
        setNotifyPrefs(prefsResponse.preferences.notificationPreferences || notifyPrefs);
        setPrivacy({
          idRevealConsent: prefsResponse.preferences.idRevealConsent || false
        });
        if (prefsResponse.preferences.appearance) {
          setAppearance(prefsResponse.preferences.appearance);
        }
      }
    } catch (error) {
      addToast('error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (category, preference) => {
    setNotifyPrefs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [preference]: !prev[category][preference]
      }
    }));
  };

  const handleIdConsentChange = (value) => {
    setPrivacy(prev => ({
      ...prev,
      idRevealConsent: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await userService.updateProfile(profile);
      if (response.success) {
        addToast('success', 'Profile updated successfully');
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotificationPrefs = async () => {
    setIsSaving(true);
    try {
      const response = await userService.updateNotificationPreferences(notifyPrefs);
      if (response.success) {
        addToast('success', 'Notification preferences saved');
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      const response = await userService.updateIdRevealConsent(privacy.idRevealConsent);
      if (response.success) {
        addToast('success', response.message);
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to save privacy settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const { changePassword } = await import('../services/authService');
      const response = await changePassword(securityData.oldPassword, securityData.newPassword);
      if (response.success) {
        addToast('success', 'Password changed successfully');
        setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setIsDeleteModalOpen(true);
  };

  const executeDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    setIsSaving(true);
    try {
      const response = await userService.deleteAccount();
      if (response.success) {
        addToast('success', 'Your account has been deleted.');
        const { logout } = await import('../services/authService');
        logout();
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        addToast('error', response.message || 'Failed to delete account');
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to delete account');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    setIsSaving(true);
    try {
      const response = await userService.updateAppearancePreferences(appearance);
      if (response.success) {
        addToast('success', 'Appearance preferences saved globally');
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to save appearance settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse flex flex-col md:flex-row gap-8 mt-10">
                <div className="w-full md:w-64 h-96 bg-gray-200 rounded-2xl" />
                <div className="flex-1 h-[600px] bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User, desc: 'Update your personal details' },
    { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Themes & styling' },
    { id: 'notifications', label: 'Notifications', icon: BellRing, desc: 'Manage alerts & emails' },
    { id: 'privacy', label: 'Privacy & Identity', icon: Shield, desc: 'Control your anonymity' },
    { id: 'security', label: 'Account Security', icon: Lock, desc: 'Passwords & authentication' }
  ];

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full relative">
          <div className="max-w-6xl mx-auto relative z-10 w-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Account Settings
              </h1>
              <p className="text-gray-500 text-sm">
                Manage your personal profile, security, and preferences.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full group flex items-center text-left p-3 rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>{tab.label}</h3>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm h-full relative overflow-hidden">

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
                        <p className="text-gray-500 text-sm mt-1">These details are kept private unless explicitly shared.</p>
                      </div>

                      <div className="grid gap-6 max-w-xl">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider text-xs">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider text-xs">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider text-xs">Department / Course</label>
                          <input
                            type="text"
                            name="department"
                            value={profile.department}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                      </div>

                      <div className="pt-8 mt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 font-bold transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                          {isSaving ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                          ) : (
                            <><Save size={18} /> Save Changes</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Appearance</h2>
                        <p className="text-gray-500 text-sm mt-1">Customize your platform experience.</p>
                      </div>

                      <div className="space-y-8 max-w-2xl">
                        {/* Theme Toggle */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-4 block">System Theme</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setAppearance(prev => ({ ...prev, theme: 'light' }))}
                              className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${appearance.theme === 'light' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                  <div className="w-5 h-5 rounded-full bg-white shadow-sm border border-gray-300"></div>
                                </div>
                                <span className="font-semibold text-gray-900">Light Mode</span>
                              </div>
                              {appearance.theme === 'light' && <CheckCircle2 className="text-primary w-5 h-5 mr-1" />}
                            </button>
                            <button
                              onClick={() => setAppearance(prev => ({ ...prev, theme: 'dark' }))}
                              className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${appearance.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                                  <div className="w-5 h-5 rounded-full bg-gray-800 shadow-sm border border-gray-600"></div>
                                </div>
                                <span className="font-semibold text-gray-900">Dark Mode</span>
                              </div>
                              {appearance.theme === 'dark' && <CheckCircle2 className="text-primary w-5 h-5 mr-1" />}
                            </button>
                          </div>
                        </div>


                      </div>

                      <div className="pt-8 mt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={handleSaveAppearance}
                          disabled={isSaving}
                          className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 font-bold transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                          {isSaving ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                          ) : (
                            <><Palette size={18} /> Apply Appearance</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                        <p className="text-gray-500 text-sm mt-1">Control how and when we alert you about activity.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">@</div>
                            <h3 className="font-bold text-gray-800">Email Alerts</h3>
                          </div>
                          {Object.entries(notifyPrefs.emailNotifications).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between cursor-pointer group p-4 bg-white/60 border border-gray-100 hover:border-primary/30 hover:bg-primary/5/50 rounded-2xl transition-all shadow-sm mb-3">
                              <span className="text-gray-700 font-medium group-hover:text-primary-dark capitalize text-[15px]">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <div className="relative inline-flex items-center">
                                <input type="checkbox" checked={value} onChange={() => handleNotificationToggle('emailNotifications', key)} className="sr-only peer" />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                              </div>
                            </label>
                          ))}
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><BellRing size={16} /></div>
                            <h3 className="font-bold text-gray-800">In-App Alerts</h3>
                          </div>
                          {Object.entries(notifyPrefs.inAppNotifications).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between cursor-pointer group p-4 bg-white/60 border border-gray-100 hover:border-primary/30 hover:bg-primary/5/50 rounded-2xl transition-all shadow-sm mb-3">
                              <span className="text-gray-700 font-medium group-hover:text-primary-dark capitalize text-[15px]">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <div className="relative inline-flex items-center">
                                <input type="checkbox" checked={value} onChange={() => handleNotificationToggle('inAppNotifications', key)} className="sr-only peer" />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                              </div>
                            </label>
                          ))}

                          <div className="pt-6 mt-2 border-t border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-xs">
                              Daily Summary Time
                            </label>
                            <input
                              type="time"
                              value={notifyPrefs.preferredNotificationTime}
                              onChange={(e) => setNotifyPrefs(prev => ({ ...prev, preferredNotificationTime: e.target.value }))}
                              className="w-full max-w-[150px] px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 mt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={handleSaveNotificationPrefs}
                          disabled={isSaving}
                          className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 font-bold transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                          {isSaving ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                          ) : (
                            <><Save size={18} /> Save Preferences</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Privacy Tab */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Privacy & Identity</h2>
                        <p className="text-gray-500 text-sm mt-1">Configure how much of your identity is shared with administrators.</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-primary/20 rounded-2xl p-6 flex gap-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <AlertCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                        <div className="text-primary-dark relative z-10">
                          <p className="font-bold text-lg mb-2">Platform Anonymity Guarantee</p>
                          <p className="text-primary-dark leading-relaxed font-medium opacity-90">
                            By default, everything you submit is cryptographically linked to an anonymous code. Admins cannot see your name or email unless you explicitly provide consent below.
                            Revealing your identity can help expedite highly sensitive cases by preventing fake report flagging.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 max-w-2xl">
                        <label className={`block border-2 rounded-3xl p-6 cursor-pointer transition-all duration-500 ${!privacy.idRevealConsent
                          ? 'border-primary bg-gradient-to-br from-white to-blue-50/50 shadow-xl shadow-primary/10 scale-100 ring-2 ring-primary/20'
                          : 'border-white bg-white/60 hover:bg-white hover:border-primary/30 shadow-sm hover:shadow-md scale-[0.98]'
                          }`}>
                          <div className="flex items-start gap-5">
                            <div className="relative flex items-center justify-center mt-1">
                              <input
                                type="radio"
                                name="idConsent"
                                checked={!privacy.idRevealConsent}
                                onChange={() => handleIdConsentChange(false)}
                                className="w-6 h-6 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-xl flex items-center gap-3">
                                <div className={`p-2 rounded-xl flex items-center justify-center ${!privacy.idRevealConsent ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                  <Shield size={20} strokeWidth={2.5} />
                                </div>
                                Stay Strictly Anonymous
                              </p>
                              <p className={`mt-2 text-[15px] leading-relaxed ${!privacy.idRevealConsent ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>My email and name are thoroughly hidden from administrators and reviewers during investigations.</p>
                            </div>
                          </div>
                        </label>

                        <label className={`block border-2 rounded-3xl p-6 cursor-pointer transition-all duration-500 ${privacy.idRevealConsent
                          ? 'border-primary bg-gradient-to-br from-white to-indigo-50/50 shadow-xl shadow-primary/10 scale-100 ring-2 ring-primary/20'
                          : 'border-white bg-white/60 hover:bg-white hover:border-primary/30 shadow-sm hover:shadow-md scale-[0.98]'
                          }`}>
                          <div className="flex items-start gap-5">
                            <div className="relative flex items-center justify-center mt-1">
                              <input
                                type="radio"
                                name="idConsent"
                                checked={privacy.idRevealConsent}
                                onChange={() => handleIdConsentChange(true)}
                                className="w-6 h-6 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-xl flex items-center gap-3">
                                <div className={`p-2 rounded-xl flex items-center justify-center ${privacy.idRevealConsent ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                  <User size={20} strokeWidth={2.5} />
                                </div>
                                Reveal My Identity
                              </p>
                              <p className={`mt-2 text-[15px] leading-relaxed ${privacy.idRevealConsent ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>Trust administrators with my real name and email address to help verify and fast-track my reports.</p>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div className="pt-8 mt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={handleSavePrivacy}
                          disabled={isSaving}
                          className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-70 font-bold transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                          {isSaving ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                          ) : (
                            <><Shield size={18} /> Apply Privacy Setting</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border-b border-gray-100 pb-5">
                        <h2 className="text-2xl font-bold text-gray-900">Account Security</h2>
                        <p className="text-gray-500 text-sm mt-1">Update your password and manage account deletion.</p>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                        <div className="p-8 bg-white/60 border border-white rounded-3xl shadow-sm space-y-6">
                          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-100 rounded-xl text-gray-600">
                              <Lock size={20} strokeWidth={2.5} />
                            </div>
                            Change Password
                          </h3>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider text-xs">Current Password</label>
                            <input
                              type="password"
                              name="oldPassword"
                              required
                              value={securityData.oldPassword}
                              onChange={handleSecurityChange}
                              className="w-full px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                              placeholder="••••••••"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider text-xs">New Password</label>
                              <input
                                type="password"
                                name="newPassword"
                                required
                                value={securityData.newPassword}
                                onChange={handleSecurityChange}
                                className="w-full px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                                placeholder="••••••••"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider text-xs">Confirm Password</label>
                              <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={securityData.confirmPassword}
                                onChange={handleSecurityChange}
                                className="w-full px-5 py-3.5 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-gray-800 shadow-sm hover:border-gray-300/80"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl hover:shadow-xl hover:shadow-gray-500/30 disabled:opacity-70 font-bold transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                          >
                            {isSaving ? (
                              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                            ) : (
                              <><Lock size={18} /> Update Password</>
                            )}
                          </button>
                        </div>
                      </form>

                      {/* Danger Zone */}
                      <div className="mt-14 pt-10 border-t border-red-100/50">
                        <h3 className="font-bold text-red-600 flex items-center gap-2 mb-5">
                          <div className="p-1.5 bg-red-100 rounded-lg"><AlertCircle size={18} strokeWidth={2.5} /></div>
                          Danger Zone
                        </h3>
                        <div className="p-8 border border-red-200 bg-gradient-to-r from-red-50 to-white rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
                          <div>
                            <h4 className="font-bold text-gray-900 text-xl">Delete Account</h4>
                            <p className="text-gray-600 mt-2 max-w-md leading-relaxed font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>
                          </div>
                          <button
                            onClick={handleDeleteAccountClick}
                            className="flex-shrink-0 px-8 py-4 bg-white text-red-600 border border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300 font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
        message="Are you absolutely sure you want to permanently delete your account? This action cannot be undone."
        confirmText="Delete Account"
        variant="danger"
      />
    </div>
  );
};

export default UserSettingsPage;
