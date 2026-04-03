import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Trash2, Shield, BellRing, User, Lock, Palette, CheckCircle2, LogOut } from 'lucide-react';
import userService from '../services/userService';
import { useToast } from '../hooks/useToast';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Input } from '../components/ui/Input';

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
    { id: 'privacy', label: 'Privacy & Identity', icon: Shield, desc: 'Control your anonymity' },
    { id: 'security', label: 'Account Security', icon: Lock, desc: 'Passwords & authentication' }
  ];

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-gray-50 text-gray-900 text-sm">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between mb-8 pb-5 border-b border-gray-200">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">Manage your profile, security, and platform preferences.</p>
              </div>
              <div className="mt-4 flex md:ml-4 md:mt-0">
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>

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
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`}
                    >
                      <Icon className={`mr-3 flex-shrink-0 h-4 w-4 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary/70'}`} />
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
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Profile</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>Update your personal details. These are kept private unless explicitly shared.</p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 max-w-xl">
                          <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleProfileChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                placeholder="Your full name"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="mt-1">
                              <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                placeholder="+1 (555) 000-0000"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Department / Course</label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="department"
                                value={profile.department}
                                onChange={handleProfileChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                                placeholder="e.g. Computer Science"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-b-lg border-t border-gray-200">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 transition-colors"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === 'appearance' && (
                    <div className="animate-in fade-in duration-300">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Appearance</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>Customize your platform interface and experience.</p>
                        </div>
                        <div className="mt-6 max-w-xl">
                          <label className="block text-sm font-medium text-gray-700 mb-3">System Theme</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setAppearance(prev => ({ ...prev, theme: 'light' }))}
                              className={`flex items-center justify-between px-4 py-3 border rounded-md transition-colors ${appearance.theme === 'light' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-white border border-gray-300 shadow-sm" />
                                <span className="font-medium text-gray-900 text-sm">Light Mode</span>
                              </div>
                              {appearance.theme === 'light' && <CheckCircle2 className="text-primary w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setAppearance(prev => ({ ...prev, theme: 'dark' }))}
                              className={`flex items-center justify-between px-4 py-3 border rounded-md transition-colors ${appearance.theme === 'dark' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600 shadow-sm" />
                                <span className="font-medium text-gray-900 text-sm">Dark Mode</span>
                              </div>
                              {appearance.theme === 'dark' && <CheckCircle2 className="text-primary w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-b-lg border-t border-gray-200">
                        <button
                          onClick={handleSaveAppearance}
                          disabled={isSaving}
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 transition-colors"
                        >
                          {isSaving ? 'Saving...' : 'Save Preferences'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="animate-in fade-in duration-300">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>Control how and when we alert you about activity.</p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                              <span className="w-6 h-6 rounded-md bg-gray-100 flex justify-center items-center">@</span>
                              Email Alerts
                            </h4>
                            <div className="space-y-4">
                              {Object.entries(notifyPrefs.emailNotifications).map(([key, value]) => (
                                <div key={key} className="flex items-start">
                                  <div className="flex h-5 items-center">
                                    <input
                                      type="checkbox"
                                      checked={value}
                                      onChange={() => handleNotificationToggle('emailNotifications', key)}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-700 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                              <span className="w-6 h-6 rounded-md bg-gray-100 flex justify-center items-center"><BellRing className="w-3.5 h-3.5" /></span>
                              In-App Alerts
                            </h4>
                            <div className="space-y-4">
                              {Object.entries(notifyPrefs.inAppNotifications).map(([key, value]) => (
                                <div key={key} className="flex items-start">
                                  <div className="flex h-5 items-center">
                                    <input
                                      type="checkbox"
                                      checked={value}
                                      onChange={() => handleNotificationToggle('inAppNotifications', key)}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-700 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Daily Summary Time
                              </label>
                              <input
                                type="time"
                                value={notifyPrefs.preferredNotificationTime}
                                onChange={(e) => setNotifyPrefs(prev => ({ ...prev, preferredNotificationTime: e.target.value }))}
                                className="block w-full max-w-[150px] rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-b-lg border-t border-gray-200">
                        <button
                          onClick={handleSaveNotificationPrefs}
                          disabled={isSaving}
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 transition-colors"
                        >
                          {isSaving ? 'Saving...' : 'Save Preferences'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Privacy Tab */}
                  {activeTab === 'privacy' && (
                    <div className="animate-in fade-in duration-300">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Privacy & Identity</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500 mb-6">
                          <p>Configure how much of your identity is shared with administrators.</p>
                        </div>
                        
                        <div className="rounded-md bg-primary/10 p-4 mb-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-primary-dark">Platform Anonymity Guarantee</h3>
                              <div className="mt-2 text-sm text-primary-dark">
                                <p>By default, everything you submit is cryptographically linked to an anonymous code. Admins cannot see your name or email unless you explicitly provide consent below. Revealing your identity can help expedite highly sensitive cases.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 max-w-2xl px-2">
                          <label className={`relative block rounded-lg border px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none ${!privacy.idRevealConsent ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="idConsent"
                                checked={!privacy.idRevealConsent}
                                onChange={() => handleIdConsentChange(false)}
                                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                              />
                              <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">Stay Strictly Anonymous</span>
                                <span className="block text-sm text-gray-500 mt-1">My email and name are thoroughly hidden from administrators during investigations.</span>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-4 sm:flex-shrink-0 sm:flex sm:items-center">
                              <Shield className={`w-5 h-5 ${!privacy.idRevealConsent ? 'text-primary' : 'text-gray-400'}`} />
                            </div>
                          </label>

                          <label className={`relative block rounded-lg border px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none ${privacy.idRevealConsent ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="idConsent"
                                checked={privacy.idRevealConsent}
                                onChange={() => handleIdConsentChange(true)}
                                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                              />
                              <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">Reveal My Identity</span>
                                <span className="block text-sm text-gray-500 mt-1">Trust administrators with my real name and email address to help verify my reports.</span>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-4 sm:flex-shrink-0 sm:flex sm:items-center">
                              <User className={`w-5 h-5 ${privacy.idRevealConsent ? 'text-primary' : 'text-gray-400'}`} />
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-b-lg border-t border-gray-200">
                        <button
                          onClick={handleSavePrivacy}
                          disabled={isSaving}
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 transition-colors"
                        >
                          {isSaving ? 'Saving...' : 'Apply Setting'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="animate-in fade-in duration-300">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Account Security</h3>
                        <div className="mt-2 text-sm text-gray-500 mb-6">
                          <p>Manage your password and account deletion options.</p>
                        </div>
                        
                        <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium text-gray-700">Current Password</label>
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

                        <div className="mt-10 border-t border-gray-200 pt-6">
                          <h4 className="text-base font-medium text-red-600">Danger Zone</h4>
                          <div className="mt-4 flex rounded-md bg-red-50 p-4 border border-red-200">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3 sm:flex sm:items-start sm:justify-between w-full gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                                <div className="mt-1 text-sm text-red-700">
                                  <p>Permanently remove your account and all associated data. This action cannot be undone.</p>
                                </div>
                              </div>
                              <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={handleDeleteAccountClick}
                                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 transition-colors"
                                >
                                  Delete Account
                                </button>
                              </div>
                            </div>
                          </div>
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
