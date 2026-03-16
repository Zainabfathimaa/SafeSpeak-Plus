import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { StoryCard } from '../components/Stories/StoryCard';
import { ShareStoryModal } from '../components/Stories/ShareStoryModal';
import { Search, PenTool, Loader2, AlertCircle } from 'lucide-react';
import storyService from '../services/storyService';

export default function StoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStories = async () => {
        setLoading(true);
        try {
            const response = await storyService.getPublishedStories();
            if (response.success) {
                setStories(response.stories);
            } else {
                setError('Failed to fetch stories');
            }
        } catch (err) {
            console.error('Error fetching stories:', err);
            setError('An error occurred while loading stories.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchStories();
    }, []);

    const filteredStories = stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-gray-50 relative">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Community Stories</h1>
                                <p className="text-text-secondary mt-2 max-w-xl">
                                    A safe space to share experiences, find support, and inspire change.
                                    Read how others are making our campus safer.
                                </p>
                            </div>
                            {/* Search Bar */}
                            <div className="relative w-full md:w-72">
                                <input
                                    type="text"
                                    placeholder="Search stories & tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Status Message */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                <p className="text-text-secondary animate-pulse text-lg">Gathering community voices...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto my-12">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
                                <p className="text-red-700 mb-6">{error}</p>
                                <button
                                    onClick={fetchStories}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!loading && !error && filteredStories.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 max-w-2xl mx-auto my-12">
                                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PenTool className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No stories found</h3>
                                <p className="text-text-secondary mb-8">
                                    Be the first to break the silence. Share your story with the community.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
                                >
                                    Share Your Story
                                </button>
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {filteredStories.map(story => (
                                <StoryCard key={story._id || story.id} story={story} />
                            ))}
                        </div>
                    </div>

                    {/* Floating Action Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center z-40 group"
                        aria-label="Share your story"
                    >
                        <PenTool className="w-6 h-6" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:pl-2 text-sm font-semibold">
                            Write a Story
                        </span>
                    </button>

                    {/* Modal */}
                    <ShareStoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </main>
            </div>
        </div>
    );
}
