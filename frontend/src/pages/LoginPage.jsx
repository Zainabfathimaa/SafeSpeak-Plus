import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Key, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { loginUser, anonymousLogin, saveToken } from '../services/authService';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState('code'); // 'code' or 'email'
    const [formData, setFormData] = useState({
        accessCode: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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
                // Save token to localStorage
                saveToken(response.token);
                
                // Show success message
                console.log('Login successful!');
                
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                // Login failed, show error message
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            // Handle unexpected errors
            setError('An error occurred. Please check your connection and try again.');
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
                    <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
                    <p className="text-text-secondary mt-2 text-sm">
                        Securely access your dashboard
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
                            Email & Password
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="px-8 pb-8">
                    {/* Error Message Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-red-800">Login Error</p>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">

                        {loginMethod === 'code' ? (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 items-start">
                                    <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Maximum Privacy</p>
                                        Using your anonymous code ensures your identity remains completely hidden from administrators.
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
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
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
                                <div className="flex justify-end">
                                    <a href="#" className="text-xs text-primary hover:underline font-medium">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-12 text-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : (loginMethod === 'code' ? 'Enter Securely' : 'Sign In')}
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
