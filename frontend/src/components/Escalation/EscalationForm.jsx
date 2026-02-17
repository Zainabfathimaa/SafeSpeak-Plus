import React, { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';

export function EscalationForm({ type, onCancel }) {
    const [formData, setFormData] = useState({
        reason: '',
        description: '',
        previousReportId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic content based on selection
    const isSuperAdmin = type === 'admin';
    const themeColor = isSuperAdmin ? 'red-600' : 'blue-600';
    const themeBg = isSuperAdmin ? 'bg-red-600' : 'bg-blue-600';
    const title = isSuperAdmin ? 'Escalate to Super Admin' : 'Connect with NGO';

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`Escalation sent to ${isSuperAdmin ? 'Super Admin' : 'Ngo Partners'}!`);
            // Navigate or reset would happen here
        }, 1500);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                <div className={`p-2 rounded-lg ${isSuperAdmin ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-text-secondary">
                        {isSuperAdmin
                            ? "This will alert senior management about negligence or unresolved issues."
                            : "This will share your case details with our trusted external NGO partners."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Report Reference (Optional)</label>
                    <input
                        type="text"
                        placeholder="e.g. REF-2023-001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-mono text-sm"
                        value={formData.previousReportId}
                        onChange={e => setFormData({ ...formData, previousReportId: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Escalation <span className="text-red-500">*</span></label>
                    <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    >
                        <option value="">Select a reason...</option>
                        <option value="no_response">No response received</option>
                        <option value="unsatisfied">Unsatisfied with resolution</option>
                        <option value="bias">Concern about bias/fairness</option>
                        <option value="severity">Incident severity increased</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Statement <span className="text-red-500">*</span></label>
                    <textarea
                        required
                        rows="5"
                        placeholder="Please explain why you are escalating this case. Be as specific as possible."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all resize-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center px-6 py-2 text-white rounded-lg font-medium shadow-sm transition-all
                    ${themeBg} hover:opacity-90 disabled:opacity-70`}
                    >
                        {isSubmitting ? 'Sending...' : 'Submit Escalation'}
                        {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
