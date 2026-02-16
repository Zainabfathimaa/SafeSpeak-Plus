import React from 'react';

export function Step2Details({ formData, updateFormData }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Details</h2>

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description of Incident <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows="6"
                    placeholder="Please describe what happened in as much detail as possible..."
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-text-secondary mt-1 text-right">
                    {formData.description.length} characters
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                    Involved Parties (Optional)
                </label>
                <input
                    type="text"
                    placeholder="Names of people involved (witnesses, aggressors, etc.)"
                    value={formData.involvedParties}
                    onChange={(e) => updateFormData({ involvedParties: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <p className="text-xs text-text-secondary mt-1">
                    Separate names with commas. You can leave this blank if unknown.
                </p>
            </div>
        </div>
    );
}
