import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { WelcomeCard } from '../components/WelcomeCard';
import { DashboardCard } from '../components/DashboardCard';
import { DashboardStories } from '../components/DashboardStories';
import { StorySubmissionModal } from '../components/Stories/StorySubmissionModal';
import { UserStoriesList } from '../components/Stories/UserStoriesList';
import { PlusCircle, FileText, MessageSquare, ArrowUpRight, BookOpen } from 'lucide-react';

import { getUser } from '../services/authService';
import storyService from '../services/storyService';

export default function UserDashboard() {
    const user = getUser();
    const [stats, setStats] = React.useState({
        active: 0,
        total: 0
    });
    const [isStoryModalOpen, setIsStoryModalOpen] = React.useState(false);
    const [storyRefreshTrigger, setStoryRefreshTrigger] = React.useState(0);
    const [userStories, setUserStories] = React.useState([]);
    const [storiesLoading, setStoriesLoading] = React.useState(true);
    const [editingStory, setEditingStory] = React.useState(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getUserReports } = await import('../services/reportService');
                const response = await getUserReports();
                if (response.success) {
                    const reports = response.reports;
                    setStats({
                        total: reports.length,
                        active: reports.filter(r => r.status !== 'Resolved' && r.status !== 'Closed').length
                    });
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    const handleStorySubmitted = () => {
        setIsStoryModalOpen(false);
        setEditingStory(null);
        setStoryRefreshTrigger(prev => prev + 1);
    };

    const handleEditStory = (story) => {
        setEditingStory(story);
        setIsStoryModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsStoryModalOpen(false);
        setEditingStory(null);
    };

    // fetch user's own stories when trigger increments
    React.useEffect(() => {
        const fetchUserStories = async () => {
            setStoriesLoading(true);
            try {
                const res = await storyService.getUserStories();
                if (res.success) {
                    setUserStories(res.stories || []);
                } else {
                    console.error('Failed to load user stories:', res.message);
                }
            } catch (err) {
                console.error('Error fetching user stories:', err);
            } finally {
                setStoriesLoading(false);
            }
        };
        fetchUserStories();

        // poll every minute in case admin approved while user is on page
        const interval = setInterval(fetchUserStories, 60000);
        return () => clearInterval(interval);
    }, [storyRefreshTrigger]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <WelcomeCard user={user} />

                        {/* Stories Section */}
                        <DashboardStories />

                        {/* Your Stories Section */}
                        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/30 to-transparent">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        Your Stories
                                    </h3>
                                    <p className="text-xs text-text-secondary mt-0.5 ml-3.5 italic">Manage your shared experiences</p>
                                </div>
                                <button
                                    onClick={() => { setEditingStory(null); setIsStoryModalOpen(true); }}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 font-bold text-sm flex items-center gap-2 group transform hover:-translate-y-0.5"
                                >
                                    <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                    Submit New Story
                                </button>
                            </div>
                            <div className="p-6">
                                <UserStoriesList
                                    stories={userStories}
                                    isLoading={storiesLoading}
                                    onDelete={(deletedId) => setUserStories(prev => prev.filter(s => s._id !== deletedId))}
                                    onEdit={handleEditStory}
                                    refreshTrigger={storyRefreshTrigger}
                                />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-primary pl-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                <DashboardCard
                                    icon={PlusCircle}
                                    title="New Report"
                                    description="Submit securely."
                                    buttonText="Report"
                                    to="/report-incident"
                                    color="blue-600"
                                />
                                <div className="relative">
                                    <DashboardCard
                                        icon={FileText}
                                        title="Active Reports"
                                        description={`${stats.active} ongoing case${stats.active !== 1 ? 's' : ''}.`}
                                        buttonText="View Status"
                                        to="/report-status"
                                        color="emerald-600"
                                    />
                                    {stats.active > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                                            {stats.active}
                                        </span>
                                    )}
                                </div>
                                <DashboardCard
                                    icon={MessageSquare}
                                    title="Messages"
                                    description="Secure inbox."
                                    buttonText="Open"
                                    to="/messages"
                                    color="violet-600"
                                />
                                <DashboardCard
                                    icon={ArrowUpRight}
                                    title="Escalate"
                                    description="Select report for review."
                                    buttonText="Escalate"
                                    to="/report-status"
                                    color="orange-600"
                                />
                                <DashboardCard
                                    icon={BookOpen}
                                    title="Stories"
                                    description="Read & share."
                                    buttonText="Browse"
                                    to="/stories"
                                    color="pink-600"
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Story Submission Modal */}
                <StorySubmissionModal
                    isOpen={isStoryModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={handleStorySubmitted}
                    editData={editingStory}
                />

            </div>
        </div>
    );
}
