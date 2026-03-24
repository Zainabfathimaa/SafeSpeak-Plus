import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Key, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { loginUser, anonymousLogin, saveSession } from '../services/authService';
import toastService from '../services/toastService';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState('code'); // 'code' or 'email'
    const [formData, setFormData] = useState({
        accessCode: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;

            if (loginMethod === 'code') {
                // Anonymous code login
                response = await anonymousLogin(formData.accessCode);
            } else {
                // Email & password login
                response = await loginUser(formData.email, formData.password);
            }

            // Check if login was successful
            if (response.success) {
                toastService.success('Login successful! Redirecting to your dashboard...');

                // Prepare user data
                const userData = {
                    email: response.user?.email || formData.email,
                    fullName: response.user?.fullName,
                    role: response.user?.role || 'user',
                    id: response.user?.id,
                    loginMethod: loginMethod,
                    loginTime: new Date().toISOString()
                };

                // Save session centrally
                saveSession(response.token, userData);

                // Route based on role
                const roleDashboards = {
                    admin: '/admin-dashboard',
                    counsellor: '/counsellor-dashboard',
                    executive: '/executive-dashboard',
                    'compliance-officer': '/compliance-officer-dashboard',
                    'department-head': '/department-head-dashboard',
                    user: '/dashboard'
                };

                const redirectUrl = roleDashboards[userData.role] || '/dashboard';
                setTimeout(() => {
                    navigate(redirectUrl);
                }, 1500);
            } else {
                // Login failed, show error message
                toastService.error(response.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            // Handle unexpected errors
            toastService.error('An error occurred. Please check your connection and try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="text-center pt-8 pb-6 px-8 bg-gradient-to-b from-primary/5 to-transparent">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">SafeSpeak+ Portal</h1>
                    <p className="text-text-secondary mt-2 text-sm">
                        Select your login method
                    </p>
                </div>

                {/* Toggle */}
                <div className="px-8 mb-6">
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setLoginMethod('code')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                loginMethod === 'code'
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <Key className="h-4 w-4" />
                            Anonymous Code
                        </button>
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                loginMethod === 'email'
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <Mail className="h-4 w-4" />
                            Admin Login
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">

                        {loginMethod === 'code' ? (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 items-start">
                                    <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">For Reporting & Tracking</p>
                                        Use the anonymous code generated when you submitted a report to check its status safely.
                                    </div>
                                </div>

                                <Input
                                    label="Anonymous Access Code"
                                    type="text"
                                    name="accessCode"
                                    placeholder="e.g. A7X-992-B4Q"
                                    required
                                    value={formData.accessCode}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="text-lg tracking-wide font-mono"
                                />
                                <div className="flex justify-end">
                                    <Link to="/forgot-code" className="text-xs text-primary hover:underline font-medium">
                                        Forgot code?
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3 items-start mb-4">
                                    <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-purple-800">
                                        <p className="font-semibold mb-1">Administrative Access</p>
                                        For Platform Administrators only.
                                    </div>
                                </div>

                                <Input
                                    label="College Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="name@cmr.edu.in"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <div className="flex justify-end items-center">
                                    <Link to="/forgot-code" className="text-xs text-primary hover:underline font-medium">
                                        Forgot your code?
                                    </Link>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : (loginMethod === 'code' ? 'Access Report' : 'Secure Login')}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-bold">
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
