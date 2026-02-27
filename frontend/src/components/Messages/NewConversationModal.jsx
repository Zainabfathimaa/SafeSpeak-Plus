import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Loader2, FileText, AlertCircle } from 'lucide-react';
import { getUserReports } from '../../services/reportService';
import { sendMessage } from '../../services/messageService';

export function NewConversationModal({ isOpen, onClose, onConversationCreated }) {
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState('');
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        const fetchReports = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getUserReports();
                if (response.success) {
                    setReports(response.reports);
                    if (response.reports.length > 0) {
                        setSelectedReportId(response.reports[0]._id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch reports:', err);
                setError('Could not load your reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReportId || !messageText.trim()) return;

        setSending(true);
        setError('');
        try {
            const res = await sendMessage(selectedReportId, messageText.trim());
            if (res.success) {
                setMessageText('');
                setSelectedReportId('');
                onConversationCreated?.();
                onClose();
            } else {
                setError('Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Failed to start conversation:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Contact Admin</h2>
                            <p className="text-xs text-gray-500">Start a new conversation about a report</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {error && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Loading your reports...</span>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">You don't have any reports yet.</p>
                            <p className="text-gray-400 text-xs mt-1">Submit a report first to start a conversation with admin.</p>
                        </div>
                    ) : (
                        <>
                            {/* Report Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Report
                                </label>
                                <select
                                    value={selectedReportId}
                                    onChange={(e) => setSelectedReportId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-all"
                                >
                                    {reports.map((r) => (
                                        <option key={r._id} value={r._id}>
                                            {r.reportId} — {r.incidentType} ({r.status})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message to admin here... (e.g. request an update, ask a question, provide additional information)"
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedReportId || !messageText.trim() || sending}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="w-4 h-4" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
