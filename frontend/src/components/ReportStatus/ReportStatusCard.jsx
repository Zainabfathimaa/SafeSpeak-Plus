import React from 'react';
import { ChevronRight, Calendar, MapPin, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ReportStatusCard({ report }) {
    // Steps for the timeline
    const steps = [
        { id: 1, label: 'Submitted', date: report.submittedAt },
        { id: 2, label: 'Received', date: report.receivedAt },
        { id: 3, label: 'In Review', date: report.reviewedAt },
        { id: 4, label: 'Resolved', date: report.resolvedAt },
    ];

    // Determine current step index (1-based from report.statusStep)
    const currentStep = report.statusStep || 1;

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'in review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'received': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <span className="text-lg font-bold text-text-primary">{report.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                            {report.status}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary space-x-4">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 opacity-70" />
                            {report.date}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                            {report.location}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-gray-400">ID: {report.id}</span>
                </div>
            </div>

            {/* Body: Description Snippet */}
            <div className="p-5">
                <p className="text-text-secondary text-sm line-clamp-2 mb-6">
                    {report.description}
                </p>

                {/* Timeline Stepper */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                    <div
                        className="absolute top-3 left-0 h-0.5 bg-primary -z-10 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>

                    <div className="flex justify-between">
                        {steps.map((step, index) => {
                            const isCompleted = step.id <= currentStep;
                            const isCurrent = step.id === currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300
                                    ${isCompleted ? 'border-primary text-primary' : 'border-gray-200 text-gray-300'}
                                    ${isCurrent ? 'ring-4 ring-blue-50' : ''}
                                `}
                                    >
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4 fill-primary text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Link
                    to={`/reports/${report.id}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark flex items-center transition-colors"
                >
                    View Full Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </div>
    );
}
