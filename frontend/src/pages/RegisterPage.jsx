import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Key, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { registerUser, registerAdmin } from '../services/authService';
import toastService from '../services/toastService';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [registerMethod, setRegisterMethod] = useState('user'); // 'user' or 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '' // Only for admin
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const sanitizedEmail = formData.email.trim().toLowerCase();
        if (!sanitizedEmail.includes('@')) {
            toastService.error('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            toastService.error('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            let response;
            if (registerMethod === 'user') {
                response = await registerUser(sanitizedEmail, formData.password);
            } else {
                if (!formData.fullName) {
                    toastService.error('Full Name is required for Administrator accounts.');
                    setLoading(false);
                    return;
                }
                response = await registerAdmin(sanitizedEmail, formData.password, formData.fullName);
            }

            if (response.success) {
                if (registerMethod === 'user') {
                    toastService.success('Registration successful! Check your email for your Anonymous Code.');
                    setSuccess('user');
                    setTimeout(() => {
                        navigate('/login');
                    }, 5000);
                } else {
                    toastService.success('Admin registration successful! You can now log in.');
                    setSuccess('admin');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } else {
                toastService.error(response.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            toastService.error('An error occurred. Please check your connection and try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success === 'user') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Mail className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Registration Successful! 📧</h2>
                    <p className="text-text-secondary mb-6">
                        We've securely generated your Anonymous Access Code and sent it to <span className="font-semibold">{formData.email}</span>
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 text-left">
                        <p className="text-sm font-semibold text-gray-800 mb-3">📧 What to do next:</p>
                        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                            <li>Check your college email inbox</li>
                            <li><strong>Check your SPAM or JUNK folders</strong> if you don't see it within 2 minutes</li>
                            <li>Find the email titled "Registration Successful"</li>
                            <li>Locate your unique Anonymous Access Code</li>
                            <li>Go to the Login page and use it to securely access the platform.</li>
                        </ol>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-amber-800">
                            <strong>💡 Note:</strong> Your email address is strictly used for code retrieval and is completely decoupled from your reports to ensure guaranteed anonymity.
                        </p>
                    </div>

                    <p className="text-xs text-text-secondary mb-6">
                        Redirecting to login page in 5 seconds...
                    </p>

                    <Button onClick={() => navigate('/login')} className="w-full">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    if (success === 'admin') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <UserCheck className="h-12 w-12 text-purple-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Admin Account Created</h2>
                    <p className="text-text-secondary mb-6">
                        Your administrative identity has been securely registered.
                    </p>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6 text-left">
                        <p className="text-sm text-purple-800">
                            <strong>Login Instructions:</strong> Please use the "Admin Login" tab on the Login page using your registered email and password.
                        </p>
                    </div>

                    <p className="text-xs text-text-secondary mb-6">
                        Redirecting to login page in 3 seconds...
                    </p>

                    <Button onClick={() => navigate('/login')} className="w-full">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative z-10">
            <div className="max-w-md w-full glass-card overflow-hidden">
                <div className="text-center pt-8 pb-4">
                    <div className="flex justify-center mb-3">
                        <div className="p-2 bg-primary/10 rounded-full shadow-sm">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Platform Registration</h1>
                </div>

                {/* Role Tabs */}
                <div className="px-8 mb-6">
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setRegisterMethod('user')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                registerMethod === 'user'
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <Key className="h-4 w-4" />
                            Anonymous Track
                        </button>
                        <button
                            type="button"
                            onClick={() => setRegisterMethod('admin')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                registerMethod === 'admin'
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <Shield className="h-4 w-4" />
                            Admin Access
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                        {registerMethod === 'user' ? (
                            <div className="space-y-5">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Guaranteed Anonymity</p>
                                    Registering here generates a disconnected Anonymous Code. Your email is never visibly linked to your reports.
                                </div>
                                <Input
                                    label="College Email (@cmr.edu.in)"
                                    type="email"
                                    name="email"
                                    placeholder="yourname@cmr.edu.in"
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
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm text-purple-800">
                                    <p className="font-semibold mb-1">Administrative Registration</p>
                                    For official institution staff. Your identity is retained for formal communication.
                                </div>
                                <Input
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    placeholder="Dr. John Smith"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <Input
                                    label="Official Email Address"
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
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (registerMethod === 'user' ? 'Register Securely' : 'Create Admin Account')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
