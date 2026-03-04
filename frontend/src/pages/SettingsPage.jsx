import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Save, AlertCircle } from 'lucide-react';
import userService from '../services/userService';
import { useToast } from '../hooks/useToast';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
      {/* Header */}
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <div className="max-w-4xl mx-auto p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-gray-200 rounded-lg" />
                <div className="h-64 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8 gap-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 font-medium transition ${
                    activeTab === 'profile'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`pb-4 font-medium transition ${
                    activeTab === 'notifications'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`pb-4 font-medium transition ${
                    activeTab === 'privacy'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Privacy & Consent
                </button>
              </div>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      {Object.entries(notifyPrefs.emailNotifications).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleNotificationToggle('emailNotifications', key)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">In-App Notifications</h3>
                    <div className="space-y-3">
                      {Object.entries(notifyPrefs.inAppNotifications).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleNotificationToggle('inAppNotifications', key)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Notification Time
                    </label>
                    <input
                      type="time"
                      value={notifyPrefs.preferredNotificationTime}
                      onChange={(e) => setNotifyPrefs(prev => ({
                        ...prev,
                        preferredNotificationTime: e.target.value
                      }))}
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveNotificationPrefs}
                    disabled={isSaving}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Preferences
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">ID Reveal Consent</p>
                      <p>
                        If you enable this, admins will be able to see your email address and real name when reviewing your reports.
                        This helps them identify false accusations. You can change this anytime.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="idConsent"
                        checked={!privacy.idRevealConsent}
                        onChange={() => handleIdConsentChange(false)}
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Keep Anonymous</p>
                        <p className="text-sm text-gray-600">My identity remains hidden from admins</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition">
                      <input
                        type="radio"
                        name="idConsent"
                        checked={privacy.idRevealConsent}
                        onChange={() => handleIdConsentChange(true)}
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Reveal Identity ✓</p>
                        <p className="text-sm text-gray-600">Admins can see my email and name for report verification</p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handleSavePrivacy}
                    disabled={isSaving}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Privacy Settings
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
                                title="Account & Security"
                                description="Protect your account and manage your anonymous identity."
                            />

                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-800">Anonymous ID</p>
                                        <p className="text-sm text-text-secondary">Your unique identifier for reporting.</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-600">****A92X</code>
                                        <Button variant="outline" className="text-sm">Regenerate</Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-800">Change Password</p>
                                        <p className="text-sm text-text-secondary">Update your password regularly to stay safe.</p>
                                    </div>
                                    <Button variant="outline" className="text-sm">Update</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                                        <p className="text-sm text-text-secondary">Add an extra layer of security.</p>
                                    </div>
                                    <Toggle checked={twoFactor} onChange={setTwoFactor} />
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <SectionHeader
                                icon={Bell}
                                title="Notifications"
                                description="Choose how you want to be updated about your reports."
                            />

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Email Notifications</p>
                                        <p className="text-sm text-text-secondary">Get updates sent to your registered email.</p>
                                    </div>
                                    <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Danger Zone */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <SectionHeader
                                icon={Lock}
                                title="Privacy & Data"
                                description="Control your data deletion preferences."
                            />

                            <div className="space-y-6">
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <p className="font-medium text-red-600">Delete Account</p>
                                        <p className="text-sm text-text-secondary">Permanently remove your account and all data.</p>
                                    </div>
                                    <Button variant="destructive" className="flex items-center bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
