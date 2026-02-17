import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Shield, Bell, Lock, User, Eye, LogOut, ChevronRight, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function SettingsPage() {
    // Mock state for toggles (visual only)
    const [emailNotifs, setEmailNotifs] = React.useState(true);
    const [twoFactor, setTwoFactor] = React.useState(false);

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-start space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-text-secondary">{description}</p>
            </div>
        </div>
    );

    const Toggle = ({ checked, onChange }) => (
        <button onClick={() => onChange(!checked)} className={`transition-colors ${checked ? 'text-primary' : 'text-gray-300'}`}>
            {checked ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
        </button>
    );

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <Header />
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
                            <p className="text-text-secondary">Manage your account security, privacy, and preferences.</p>
                        </div>

                        {/* Account & Security */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <SectionHeader
                                icon={Shield}
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
