import React, { useState } from 'react';
import { AdminHeader } from '../components/Admin/AdminHeader';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import { Footer } from '../components/Footer';
import { StatCard } from '../components/Admin/StatCard';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Activity } from 'lucide-react';

export default function ExecutiveDashboard() {
    // Mock analytics data
    const [analyticsData] = useState({
        totalCases: 145,
        activeCases: 32,
        resolvedCases: 98,
        slaViolations: 5,
        riskDistribution: {
            high: 8,
            medium: 18,
            low: 106
        },
        departmentRisk: [
            { dept: 'HR', risk: 'High', cases: 8 },
            { dept: 'IT', risk: 'Medium', cases: 12 },
            { dept: 'Finance', risk: 'Low', cases: 6 },
            { dept: 'Operations', risk: 'Medium', cases: 4 },
            { dept: 'Marketing', risk: 'Low', cases: 2 }
        ],
        resolutionRate: 67.6,
        avgResolutionTime: '3.2 days'
    });

    const getRiskColor = (risk) => {
        switch(risk.toLowerCase()) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-amber-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getRiskBgColor = (risk) => {
        switch(risk.toLowerCase()) {
            case 'high': return 'bg-red-50';
            case 'medium': return 'bg-amber-50';
            case 'low': return 'bg-green-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary">
            {/* Header */}
            <AdminHeader roleName="Executive Dashboard" />
            <div className="flex flex-1">
                {/* Sidebar */}
                <AdminSidebar role="executive" />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Executive Risk Dashboard</h1>
                            <p className="text-text-secondary mt-2">High-level overview of incident management and organizational risk</p>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Activity}
                                title="Total Cases"
                                value={analyticsData.totalCases}
                                subtitle="All time"
                                color="blue-600"
                            />
                            <StatCard
                                icon={Clock}
                                title="Active Cases"
                                value={analyticsData.activeCases}
                                subtitle="Currently open"
                                color="amber-600"
                            />
                            <StatCard
                                icon={CheckCircle}
                                title="Resolved"
                                value={analyticsData.resolvedCases}
                                subtitle="Successfully closed"
                                color="green-600"
                            />
                            <StatCard
                                icon={AlertTriangle}
                                title="SLA Violations"
                                value={analyticsData.slaViolations}
                                subtitle="Overdue cases"
                                color="red-600"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Risk Distribution */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-primary pl-4">
                                    Risk Distribution
                                </h2>
                                <div className="space-y-6">
                                    {/* High Risk */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">High Risk</span>
                                            <span className="text-sm font-semibold text-red-600">{analyticsData.riskDistribution.high}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-red-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${(analyticsData.riskDistribution.high / analyticsData.totalCases) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Medium Risk */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                                            <span className="text-sm font-semibold text-amber-600">{analyticsData.riskDistribution.medium}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-amber-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${(analyticsData.riskDistribution.medium / analyticsData.totalCases) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Low Risk */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Low Risk</span>
                                            <span className="text-sm font-semibold text-green-600">{analyticsData.riskDistribution.low}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${(analyticsData.riskDistribution.low / analyticsData.totalCases) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-primary pl-4">
                                    Performance Metrics
                                </h2>
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <div className="text-4xl font-bold text-green-600">{analyticsData.resolutionRate}%</div>
                                            <p className="text-sm text-text-secondary mt-1">Case Resolution Rate</p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '67.6%' }}></div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <div className="text-4xl font-bold text-primary">{analyticsData.avgResolutionTime}</div>
                                            <p className="text-sm text-text-secondary mt-1">Average Resolution Time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Department Risk Index */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-primary pl-4 flex items-center space-x-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                <span>Department Risk Index</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {analyticsData.departmentRisk.map((dept, idx) => (
                                    <div 
                                        key={idx}
                                        className={`rounded-lg p-4 ${getRiskBgColor(dept.risk)} border-l-4 ${getRiskColor(dept.risk).replace('bg-', 'border-').replace('-500', '-400')}`}
                                    >
                                        <p className="font-semibold text-gray-900">{dept.dept}</p>
                                        <p className="text-sm text-text-secondary mt-1">{dept.cases} cases</p>
                                        <div className={`inline-block mt-3 px-2 py-1 rounded text-xs font-semibold text-white ${getRiskColor(dept.risk)}`}>
                                            {dept.risk} Risk
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risk Heatmap */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-primary pl-4">
                                Weekly Incident Trends
                            </h2>
                            <div className="flex items-end justify-between h-64 gap-2">
                                {[45, 52, 38, 65, 42, 58, 72].map((value, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center">
                                        <div className="w-full bg-gray-200 rounded-t" style={{ height: `${(value / 72) * 100}%` }}>
                                            <div className="w-full h-full bg-gradient-to-t from-primary to-primary-light rounded-t transition-all duration-300 hover:from-primary-dark hover:to-primary"></div>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-2 font-medium">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-text-secondary text-center mt-4">Incident reports by day of week</p>
                        </div>
                    </div>
                </main>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}
