import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle, Mail, User, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { registerUser, registerAdmin, anonymousLogin, saveToken } from '../services/authService';
import toastService from '../services/toastService';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [registrationType, setRegistrationType] = useState('user'); // 'user' or 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'admin'
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Verify it's a valid email format
        const sanitizedEmail = formData.email.trim().toLowerCase();
        if (!sanitizedEmail.includes('@')) {
            toastService.error('Please enter a valid email address');
            return;
        }

        // Validation: Check minimum password length
        if (formData.password.length < 6) {
            toastService.error('Password must be at least 6 characters long.');
            return;
        }

        // Additional validation for admin registration
        if (registrationType === 'admin') {
            if (!formData.fullName.trim()) {
                toastService.error('Full name is required for admin registration');
                return;
            }
        }

        // Start loading
        setLoading(true);

        try {
            let response;

            if (registrationType === 'user') {
                // User registration - current flow
                response = await registerUser(
                    sanitizedEmail,
                    formData.password
                );
            } else {
                // Admin registration - new flow
                response = await registerAdmin({
                    email: sanitizedEmail,
                    password: formData.password,
                    fullName: formData.fullName,
                    role: formData.role
                });
            }

            if (response.success) {
                if (registrationType === 'user') {
                    toastService.success('Registration successful! Check your email for your Anonymous Code.');
                    setSuccess(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    toastService.success('Admin registration successful! You can now login with your credentials.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } else {
                // Registration failed, show error message
                toastService.error(response.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            // Handle unexpected errors
            toastService.error('An error occurred. Please check your connection and try again.');
            console.error('Registration error:', err);
        } finally {
            // Stop loading
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Mail className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>
                    {registrationType === 'user' ? (
                        <>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">Registration Successful! 📧</h2>
                            <p className="text-text-secondary mb-6">
                                We've securely generated your Anonymous Access Code and sent it to <span className="font-semibold">{formData.email}</span>
                            </p>

                            {/* Instructions Box */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 text-left">
                                <p className="text-sm font-semibold text-gray-800 mb-3">📧 What to do next:</p>
                                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                                    <li>Check your college email inbox</li>
                                    <li>Find the email titled "Registration Successful"</li>
                                    <li>Locate your unique Anonymous Access Code</li>
                                    <li>Go to the Login page and use it to securely access the platform.</li>
                                </ol>
                            </div>

                            {/* Spam Folder Warning */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-red-800">
                                    <strong>⚠️ Important:</strong> Your anonymous code has been sent to your email. If you don't find it in your inbox, please check your <strong>Spam</strong> or <strong>Junk</strong> folder. Sometimes our emails get marked as spam by email providers.
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-amber-800">
                                    <strong>💡 Note:</strong> Your email address is strictly used for code retrieval and is completely decoupled from your reports to ensure guaranteed anonymity.
                                </p>
                            </div>

                            {/* Countdown Message */}
                            <p className="text-xs text-text-secondary mb-6">
                                Redirecting to login page in 3 seconds...
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">Admin Registration Successful! ✅</h2>
                            <p className="text-text-secondary mb-6">
                                Welcome <span className="font-semibold">{formData.fullName}</span>! Your admin account has been created.
                            </p>

                            {/* Instructions Box */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6 text-left">
                                <p className="text-sm font-semibold text-gray-800 mb-3">🔐 What to do next:</p>
                                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                                    <li>Use your email and password to login</li>
                                    <li>Select "Admin Login" on the login page</li>
                                    <li>Access your admin dashboard</li>
                                </ol>
                            </div>

                            {/* Countdown Message */}
                            <p className="text-xs text-text-secondary mb-6">
                                Redirecting to login page in 2 seconds...
                            </p>
                        </>
                    )}

                    {/* Manual Navigation Button */}
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full"
                    >
                        Go to Login
                    </Button>

                    {/* Back to Register Link */}
                    <div className="mt-4 text-center text-sm">
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-primary hover:underline font-medium"
                        >
                            Back to Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative z-10">
            <div className="max-w-md w-full glass-card p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
                    <p className="text-text-secondary mt-2">Choose your registration type</p>
                </div>

                {/* Registration Type Toggle */}
                <div className="mb-6">
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setRegistrationType('user')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                registrationType === 'user'
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <Key className="h-4 w-4" />
                            User Registration
                        </button>
                        <button
                            onClick={() => setRegistrationType('admin')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                registrationType === 'admin'
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <Shield className="h-4 w-4" />
                            Admin Registration
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {registrationType === 'user' ? (
                        <>
                            {/* User Registration Info */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 items-start">
                                <Key className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Anonymous Reporting Account</p>
                                    Register once to receive your anonymous access code for secure report tracking.
                                </div>
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
                        </>
                    ) : (
                        <>
                            {/* Admin Registration Info */}
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3 items-start">
                                <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-purple-800">
                                    <p className="font-semibold mb-1">Administrative Account</p>
                                    For platform administrators, counsellors, and staff members.
                                </div>
                            </div>

                            <Input
                                label="Full Name"
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={loading}
                            />

                            <Input
                                label="College Email (@cmr.edu.in)"
                                type="email"
                                name="email"
                                placeholder="admin@cmr.edu.in"
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
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : (registrationType === 'user' ? 'Register for Anonymous Code' : 'Register Admin Account')}
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
    );
}
