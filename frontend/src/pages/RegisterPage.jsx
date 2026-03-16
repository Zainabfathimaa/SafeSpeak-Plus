import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { registerUser, anonymousLogin, saveToken } from '../services/authService';
import toastService from '../services/toastService';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if email ends with @cmr.edu.in
        const sanitizedEmail = formData.email.trim().toLowerCase();
        if (!sanitizedEmail.endsWith('@cmr.edu.in')) {
            toastService.error('Please use your college email (@cmr.edu.in)');
            return;
        }

        // Validation: Check minimum password length
        if (formData.password.length < 6) {
            toastService.error('Password must be at least 6 characters long.');
            return;
        }


        // Start loading
        setLoading(true);

        try {
            // Call backend API to register user
            const response = await registerUser(
                sanitizedEmail,
                formData.password
            );

            if (response.success) {
                toastService.success('Registration successful! Check your email for your Anonymous Code.');
                setSuccess(true);

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
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
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Create Anonymous Account</h1>
                    <p className="text-text-secondary mt-2">Register once to receive your anonymous access code</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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


                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register Securely'}
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
