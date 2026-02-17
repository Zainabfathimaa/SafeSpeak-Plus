import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileText } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { SLATimer } from './SLATimer';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';

export function ReportTable({ reports, onViewReport }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Report ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Department</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Risk Level</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">SLA Timer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reports && reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-primary font-semibold">
                                        {report.reportId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {report.incidentType || 'General'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {report.department || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <RiskBadge level={report.riskLevel} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={report.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <SLATimer createdDate={report.createdAt} riskLevel={report.riskLevel} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onViewReport(report.id)}
                                            className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors font-medium"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">
                                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No reports found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
