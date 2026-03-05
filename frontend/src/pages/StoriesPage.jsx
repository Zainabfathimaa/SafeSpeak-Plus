import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { StoryCard } from '../components/Stories/StoryCard';
import { ShareStoryModal } from '../components/Stories/ShareStoryModal';
import { Search, PenTool } from 'lucide-react';
import { stories } from '../data/stories';

export default function StoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1">
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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {stories.map(story => (
                                <StoryCard key={story.id} story={story} />
                            ))}
                            {/* Add a placeholder empty state if requested, but for now just cards */}
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
