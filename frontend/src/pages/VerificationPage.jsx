import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';
import { Button } from '../components/ui/Button';

/**
 * ===================================
 * VERIFICATION PAGE COMPONENT
 * ===================================
 * 
 * PURPOSE:
 * Handles email verification when user clicks link in email
 * 
 * FLOW:
 * 1. User registers with email
 * 2. User receives verification email
 * 3. User clicks link: /verify-email?token=abc123
 * 4. This page loads
 * 5. Page extracts token from URL
 * 6. Page calls verifyEmail(token)
 * 7. Backend validates token (not expired)
 * 8. Backend generates anonymous code
 * 9. Page displays code
 * 10. User copies code
 * 11. User goes to login and uses code
 * 
 * TOKEN EXPIRY:
 * - Valid for 24 hours from email send
 * - If expired: user must register again
 * - Error message explains this
 */

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [anonymousCode, setAnonymousCode] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      // Get token from URL: ?token=abc123
      const token = searchParams.get('token');

      if (!token) {
        // No token in URL - invalid access
        setStatus('error');
        setMessage('No verification token found. Please check your email link.');
        return;
      }

      try {
        // Call backend to verify token
        const response = await verifyEmail(token);

        if (response.success) {
          // Success! We have the anonymous code
          setStatus('success');
          setAnonymousCode(response.anonymousCode);
          setMessage(response.message || 'Email verified successfully!');
        } else {
          // Verification failed
          setStatus('error');
          setMessage(response.message || 'Failed to verify email. Token may be expired.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyToken();
  }, [searchParams]);

  /**
   * COPY CODE FUNCTION
   * Copies anonymous code to clipboard
   */
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(anonymousCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  /**
   * GO TO LOGIN FUNCTION
   * Navigates to login page so user can use code
   */
  const handleGoToLogin = () => {
    navigate('/login');
  };

  /**
   * RETRY FUNCTION
   * For expired tokens, user must register again
   */
  const handleRetry = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ===== LOADING STATE ===== */}
        {status === 'loading' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full animate-spin">
                <div className="w-12 h-12 bg-blue-500 rounded-full opacity-30"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Email
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {/* ===== SUCCESS STATE ===== */}
        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Success Icon */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 text-center mb-6">
              {message}
            </p>

            {/* Anonymous Code Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-3 font-semibold">
                Your Access Code (Keep this safe!)
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-white border border-gray-300 rounded px-4 py-3 text-lg font-mono font-bold text-gray-800 tracking-wider">
                  {anonymousCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-semibold"
                  title="Copy to clipboard"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                📌 Save this code. You'll need it to login.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>How to login:</strong> Use your access code above instead of a password. This keeps your reports anonymous.
              </p>
            </div>

            {/* Buttons */}
            <Button
              onClick={handleGoToLogin}
              className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Login
            </Button>
          </div>
        )}

        {/* ===== ERROR STATE ===== */}
        {status === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Error Icon */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 text-center mb-6">
              {message}
            </p>

            {/* Error Info Box */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 mb-2">
                <strong>What happened?</strong>
              </p>
              <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
                <li>Verification link may have expired (24-hour limit)</li>
                <li>Token may be invalid or already used</li>
                <li>Please register again to get a new link</li>
              </ul>
            </div>

            {/* Button */}
            <Button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Register Again
            </Button>

            {/* Back to Home Link */}
            <div className="text-center mt-4">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
