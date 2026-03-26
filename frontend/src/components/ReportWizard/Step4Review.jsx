import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function Step4Review({ formData }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Review Report</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            You are about to submit this report. Please verify all details are correct.
                            Your report will be handled confidentially.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Incident Type</div>
                    <div className="col-span-2 text-sm text-text-primary font-semibold">{formData.incidentType || 'Not specified'}</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Department & Course</div>
                    <div className="col-span-2 text-sm text-text-primary">
                        {formData.department ? `${formData.department}${formData.course ? ` - ${formData.course}` : ''}` : 'Not specified'}
                    </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Date & Time</div>
                    <div className="col-span-2 text-sm text-text-primary">
                        {formData.date || 'Not specified'} {formData.time ? `at ${formData.time}` : ''}
                    </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Location</div>
                    <div className="col-span-2 text-sm text-text-primary">{formData.location || 'Not specified'}</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Description</div>
                    <div className="col-span-2 text-sm text-text-primary whitespace-pre-wrap">{formData.description || 'No description provided.'}</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Involved Parties</div>
                    <div className="col-span-2 text-sm text-text-primary">{formData.involvedParties || 'None listed'}</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-sm font-medium text-text-secondary">Evidence</div>
                    <div className="col-span-2 text-sm text-text-primary">
                        {formData.files.length > 0 ? `${formData.files.length} file(s) attached` : 'No evidence uploaded'}
                    </div>
                </div>
            </div>
        </div>
    );
}
