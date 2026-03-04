import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Trash2, Shield, BellRing, User, Lock } from 'lucide-react';
import userService from '../../services/userService';
import { useToast } from '../../hooks/useToast';

export const UserSettingsPage = () => {
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
      const { changePassword } = await import('../../services/authService');
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

  const handleDeleteAccount = () => {
    addToast('warning', 'Account deletion requires admin approval first.');
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 h-96 bg-gray-200 rounded-2xl" />
          <div className="flex-1 h-[600px] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User, desc: 'Update your personal details' },
    { id: 'notifications', label: 'Notifications', icon: BellRing, desc: 'Manage alerts & emails' },
    { id: 'privacy', label: 'Privacy & Identity', icon: Shield, desc: 'Control your anonymity' },
    { id: 'security', label: 'Account Security', icon: Lock, desc: 'Passwords & authentication' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 min-h-[calc(100vh-100px)]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">Account Settings</h1>
        <p className="text-gray-500 text-lg">Manage your profile, preferences, and privacy</p>
      </div>

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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-[1.02] border border-gray-100 shadow-sm'
                  }`}
              >
                <div className={`p-2 rounded-xl mr-4 ${isActive ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
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
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full relative overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
                  <p className="text-gray-500 text-sm mt-1">These details are kept private unless explicitly shared.</p>
                </div>

                <div className="grid gap-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department / Course</label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-800"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 font-bold transition-all flex items-center gap-2 transform active:scale-95"
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">@</div>
                      <h3 className="font-bold text-gray-800">Email Alerts</h3>
                    </div>
                    {Object.entries(notifyPrefs.emailNotifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer group p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="relative inline-flex items-center">
                          <input type="checkbox" checked={value} onChange={() => handleNotificationToggle('emailNotifications', key)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><BellRing size={16} /></div>
                      <h3 className="font-bold text-gray-800">In-App Alerts</h3>
                    </div>
                    {Object.entries(notifyPrefs.inAppNotifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer group p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="relative inline-flex items-center">
                          <input type="checkbox" checked={value} onChange={() => handleNotificationToggle('inAppNotifications', key)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                      </label>
                    ))}

                    <div className="pt-6 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Daily Summary Time
                      </label>
                      <input
                        type="time"
                        value={notifyPrefs.preferredNotificationTime}
                        onChange={(e) => setNotifyPrefs(prev => ({ ...prev, preferredNotificationTime: e.target.value }))}
                        className="w-full max-w-[150px] px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-gray-800 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveNotificationPrefs}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 font-bold transition-all flex items-center gap-2 transform active:scale-95"
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

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-6 flex gap-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div className="text-blue-900 relative z-10">
                    <p className="font-bold text-lg mb-2">Platform Anonymity Guarantee</p>
                    <p className="text-blue-800 leading-relaxed font-medium opacity-90">
                      By default, everything you submit is cryptographically linked to an anonymous code. Admins cannot see your name or email unless you explicitly provide consent below.
                      Revealing your identity can help expedite highly sensitive cases by preventing fake report flagging.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <label className={`block border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${!privacy.idRevealConsent
                      ? 'border-blue-500 bg-white shadow-md shadow-blue-500/10'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="idConsent"
                          checked={!privacy.idRevealConsent}
                          onChange={() => handleIdConsentChange(false)}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          <Shield size={18} className={!privacy.idRevealConsent ? 'text-blue-600' : 'text-gray-400'} />
                          Stay Strictly Anonymous
                        </p>
                        <p className="text-gray-500 font-medium text-sm mt-1">My email and name are thoroughly hidden from administrators and reviewers during investigations.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${privacy.idRevealConsent
                      ? 'border-indigo-500 bg-white shadow-md shadow-indigo-500/10'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="idConsent"
                          checked={privacy.idRevealConsent}
                          onChange={() => handleIdConsentChange(true)}
                          className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          <User size={18} className={privacy.idRevealConsent ? 'text-indigo-600' : 'text-gray-400'} />
                          Reveal My Identity
                        </p>
                        <p className="text-gray-500 font-medium text-sm mt-1">Trust administrators with my real name and email address to help verify and fast-track my reports.</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSavePrivacy}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 font-bold transition-all flex items-center gap-2 transform active:scale-95"
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

                <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                  <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl space-y-5">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                      <Lock size={18} className="text-gray-500" />
                      Change Password
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
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

                {/* Danger Zone */}
                <div className="mt-12 pt-8 border-t border-red-100">
                  <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
                    Danger Zone
                  </h3>
                  <div className="p-6 border border-red-200 bg-red-50/50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900">Delete Account</h4>
                      <p className="text-sm text-gray-600 mt-1 max-w-md">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-shrink-0 px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 font-bold transition-all flex items-center gap-2"
                    >
                      <Trash2 size={18} /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
