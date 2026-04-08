import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { ArrowLeft, Calendar, Eye, FileText, MessageSquare, Shield, User, Mail, Phone, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/Admin/RiskBadge';
import { StatusBadge } from '../../components/Admin/StatusBadge';
import userService from '../../services/userService';
import { getAllReports } from '../../services/reportService';

export default function AdminUserHistory() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userReports, setUserReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                // Fetch user details
                const userResponse = await userService.getUserById(userId);
                if (userResponse.success) {
                    setUser(userResponse.user);
                } else {
                    setError('User not found');
                    return;
                }

                // Fetch user's reports
                const reportsResponse = await getAllReports();
                if (reportsResponse.success) {
                    const userReportsData = reportsResponse.reports.filter(report =>
                        report.submittedBy?.userId === userId
                    );
                    setUserReports(userReportsData);
                }

            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'counsellor': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'executive': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'compliance-officer': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'department-head': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200'; // user
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden flex-col bg-gray-50">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar role="admin" />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex h-screen overflow-hidden flex-col bg-gray-50">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar role="admin" />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-600 text-xl mb-4">{error || 'User not found'}</p>
                            <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-gray-50/50 text-text-primary">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar role="admin" />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Header */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/admin/users')}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Users</span>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">User History & Details</h1>
                                <p className="text-text-secondary mt-1">Complete activity history for {user.fullName || user.anonymousCode}</p>
                            </div>
                        </div>

                        {/* User Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        {user.role === 'admin' ? <Shield className="h-8 w-8 text-blue-600" /> : <User className="h-8 w-8 text-blue-600" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {user.idRevealConsent ? (user.fullName || 'Unnamed User') : `Anonymous (${user.anonymousCode})`}
                                        </h2>
                                        <p className="text-gray-600">{user.idRevealConsent ? user.email : 'Identity Hidden'}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('-', ' ')}
                                            </span>
                                            {user.isEmailVerified ? (
                                                <div className="flex items-center text-green-600 text-sm">
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Unverified
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Member since</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                                    </p>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email</p>
                                        <p className="text-sm text-gray-600">
                                            {user.idRevealConsent ? user.email : 'Hidden by user'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Phone</p>
                                        <p className="text-sm text-gray-600">
                                            {user.idRevealConsent ? (user.phone || 'Not provided') : 'Hidden by user'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Department</p>
                                        <p className="text-sm text-gray-600">
                                            {user.idRevealConsent ? (user.department || 'Not specified') : 'Hidden by user'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Last Login</p>
                                        <p className="text-sm text-gray-600">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy Settings */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-blue-900">Privacy Settings</h3>
                                        <p className="text-sm text-blue-700 mt-1">
                                            {user.idRevealConsent
                                                ? "User has consented to reveal their identity to administrators"
                                                : "User has chosen to remain strictly anonymous"
                                            }
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        user.idRevealConsent
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.idRevealConsent ? 'Identity Revealed' : 'Anonymous'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reports History */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Reports Submitted</h3>
                                    <p className="text-gray-600 mt-1">{userReports.length} total reports</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">Activity History</span>
                                </div>
                            </div>

                            {userReports.length > 0 ? (
                                <div className="space-y-4">
                                    {userReports.map((report) => (
                                        <div key={report._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h4 className="text-lg font-semibold text-gray-900">{report.incidentType}</h4>
                                                        <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                            {report.reportId}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(report.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{report.location}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{report.department}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(report.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                                        {report.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end space-y-2 ml-4">
                                                    <RiskBadge level={report.riskLevel} />
                                                    <StatusBadge status={report.status} />
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate(`/admin/reports/${report._id}`)}
                                                        className="mt-2 flex items-center space-x-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span>View Report</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            {report.comments && report.comments.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-sm text-gray-500 mb-2">Admin Comments:</p>
                                                    <div className="space-y-1">
                                                        {report.comments.slice(0, 2).map((comment, index) => (
                                                            <p key={index} className="text-sm text-gray-600 italic">
                                                                "{comment.text}"
                                                            </p>
                                                        ))}
                                                        {report.comments.length > 2 && (
                                                            <p className="text-sm text-gray-500">
                                                                +{report.comments.length - 2} more comments
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Reports Submitted</h4>
                                    <p className="text-gray-500">This user hasn't submitted any reports yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Activity Timeline */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Timeline</h3>

                            <div className="space-y-6">
                                {/* Account Creation */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Account Created</p>
                                        <p className="text-sm text-gray-500">
                                            User joined the platform
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(user.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Email Verification */}
                                {user.isEmailVerified && (
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Email Verified</p>
                                            <p className="text-sm text-gray-500">
                                                User verified their email address
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(user.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Reports Submitted */}
                                {userReports.map((report) => (
                                    <div key={report._id} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-orange-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Report Submitted</p>
                                            <p className="text-sm text-gray-500">
                                                Submitted report: {report.incidentType} ({report.reportId})
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(report.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Last Login */}
                                {user.lastLogin && (
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-purple-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Last Login</p>
                                            <p className="text-sm text-gray-500">
                                                User last accessed the platform
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(user.lastLogin).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}