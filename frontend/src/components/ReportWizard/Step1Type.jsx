import React from 'react';

export function Step1Type({ formData, updateFormData }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Incident Basics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Type of Incident <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.incidentType}
                        onChange={(e) => updateFormData({ incidentType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="">Select an incident type</option>
                        <option value="Bullying">Bullying</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Discrimination">Discrimination</option>
                        <option value="Safety Hazard">Safety Hazard</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Date of Incident <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateFormData({ date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Time (Approximate)
                    </label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => updateFormData({ time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Science Lab, Corridor B, Playground"
                        value={formData.location}
                        onChange={(e) => updateFormData({ location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
