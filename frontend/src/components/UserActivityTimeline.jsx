import React, { useEffect, useState } from 'react';
import { Activity, FileText, Heart, ShieldAlert, Trash2, Clock, Pencil } from 'lucide-react';
import userService from '../services/userService';

export function UserActivityTimeline() {
    const [loading, setLoading] = useState(true);
    const [activityData, setActivityData] = useState({ metrics: null, timeline: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await userService.getActivity();
                if (res.success) {
                    setActivityData({ metrics: res.metrics, timeline: res.timeline });
                }
            } catch (err) {
                setError('Failed to load activity history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    if (loading) return <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    const { metrics, timeline } = activityData;

    const getActionDetails = (log) => {
        switch (log.action) {
            case 'story_posted':
                return {
                    icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100',
                    text: `You published a story`,
                    subtitle: `"${log.details?.title || 'Unknown'}" — submitted for admin review.`
                };
            case 'story_liked':
                return {
                    icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100',
                    text: `You liked a story`,
                    subtitle: `"${log.details?.title || 'Unknown'}"`
                };
            case 'story_liked_by_other':
                return {
                    icon: Heart, color: 'text-red-500', bg: 'bg-red-100',
                    text: `Someone liked your story`,
                    subtitle: `"${log.details?.title || 'Unknown'}" — your story is getting engagement! 🎉`
                };
            case 'story_edited':
                return {
                    icon: Pencil, color: 'text-indigo-500', bg: 'bg-indigo-100',
                    text: `You edited a story`,
                    subtitle: `"${log.details?.title || 'Unknown'}" — sent back for re-review.`
                };
            case 'story_deleted':
                return {
                    icon: Trash2, color: 'text-gray-500', bg: 'bg-gray-100',
                    text: `You deleted a story`,
                    subtitle: `"${log.details?.title || 'Unknown'}" — permanently removed.`
                };
            case 'report_submitted':
                return {
                    icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-100',
                    text: `You filed an incident report`,
                    subtitle: `Type: ${log.details?.incidentType || 'N/A'} · Report ID: ${log.details?.reportId || 'N/A'}`
                };
            case 'report_escalated':
                return {
                    icon: Activity, color: 'text-red-500', bg: 'bg-red-100',
                    text: `You escalated a report to higher authority`,
                    subtitle: `Report ${log.details?.reportId} · Sent via ${log.details?.contactMethod === 'email' ? 'Email' : 'WhatsApp'} to ${log.details?.contactValue}`
                };
            default:
                return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100', text: 'You performed an action', subtitle: '' };
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-50/30 to-transparent">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                        Your Activity Hub
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5 ml-3.5 italic">Track your engagement profile</p>
                </div>
            </div>

            <div className="p-6">
                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Recent Timeline
                    </h4>
                    
                    {timeline && timeline.length > 0 ? (
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                            {timeline.map((log) => {
                                const { icon: Icon, color, bg, text, subtitle } = getActionDetails(log);
                                return (
                                    <div key={log._id} className="relative">
                                        <div className={`absolute -left-[27px] p-1.5 rounded-full ${bg} ${color} ring-4 ring-white`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="pl-4">
                                            <p className="text-sm text-gray-800 font-semibold">{text}</p>
                                            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(log.createdAt).toLocaleDateString('en-US', {
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 text-sm italic">
                            No activity recorded yet. Start participating in SafeSpeak to build your timeline!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
