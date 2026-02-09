import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function ForgotCodePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate email
        if (!email.toLowerCase().endsWith('@cmr.edu.in')) {
            setError('Please use your college email (@cmr.edu.in)');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-code`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (data.success) {
                // Show success message
                setSuccess(true);

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to send code. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please check your connection.');
            console.error('Forgot code error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Check Your Email! 📧</h2>
                    <p className="text-text-secondary mb-6">
                        We've sent your anonymous code to <span className="font-semibold">{email}</span>
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                        <p className="text-sm text-blue-800">
                            Your anonymous access code is on its way. Check your email inbox (and spam folder just in case).
                        </p>
                    </div>

                    <p className="text-xs text-text-secondary mb-6">
                        Redirecting to login page in 3 seconds...
                    </p>

                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
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
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Forgot Your Code?</h1>
                    <p className="text-text-secondary mt-2">No problem! We'll send it to your email.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">Error</p>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="College Email (@cmr.edu.in)"
                        type="email"
                        placeholder="yourname@cmr.edu.in"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send My Code'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary">
                    Remember your code?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
