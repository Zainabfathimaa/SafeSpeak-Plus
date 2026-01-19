import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { registerUser } from '../services/authService';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        gmailAddress: '',
        gmailPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if email ends with @cmr.edu.in
        if (!formData.email.toLowerCase().endsWith('@cmr.edu.in')) {
            setError('Please use your college email (@cmr.edu.in)');
            return;
        }

        // Validation: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please re-enter.');
            return;
        }

        // Validation: Check minimum password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        // Validation: Check Gmail fields
        if (!formData.gmailAddress || !formData.gmailPassword) {
            setError('Please provide your Gmail address and app password.');
            return;
        }

        // Start loading
        setLoading(true);
        setError('');

        try {
            // Call backend API to register user
            const response = await registerUser(
                formData.email,
                formData.password,
                formData.confirmPassword,
                formData.gmailAddress,
                formData.gmailPassword
            );

            // Check if registration was successful
            if (response.success) {
                // Show success message
                setSuccess(true);

                // Redirect to login after 5 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                // Registration failed, show error message
                setError(response.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            // Handle unexpected errors
            setError('An error occurred. Please check your connection and try again.');
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
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Check Your Email! 📧</h2>
                    <p className="text-text-secondary mb-6">
                        We've sent a verification link to <span className="font-semibold">{formData.email}</span>
                    </p>
                    
                    {/* Instructions Box */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 text-left">
                        <p className="text-sm font-semibold text-gray-800 mb-3">📧 What to do next:</p>
                        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                            <li>Check your college email inbox</li>
                            <li>Click the verification link</li>
                            <li>Your anonymous code is in the email</li>
                            <li>Save the code and use it to login</li>
                        </ol>
                    </div>

                    {/* Info Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-amber-800">
                            <strong>💡 Tip:</strong> Check your spam/junk folder if you don't see the email.
                        </p>
                    </div>

                    {/* Countdown Message */}
                    <p className="text-xs text-text-secondary mb-6">
                        Redirecting to login page in 5 seconds...
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

                {/* Error Message Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">Registration Error</p>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                )}

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

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3">📧 Gmail Information</p>
                        <p className="text-xs text-gray-500 mb-4">We'll send your anonymous code to your personal Gmail</p>
                        
                        <Input
                            label="Your Gmail Address"
                            type="email"
                            name="gmailAddress"
                            placeholder="yourname@gmail.com"
                            required
                            value={formData.gmailAddress}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <Input
                            label="Gmail App Password"
                            type="password"
                            name="gmailPassword"
                            placeholder="Your 16-character app password"
                            required
                            value={formData.gmailPassword}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        
                        <p className="text-xs text-gray-500 mt-2">
                            🔒 Get it from: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">myaccount.google.com/apppasswords</a>
                        </p>
                    </div>

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
