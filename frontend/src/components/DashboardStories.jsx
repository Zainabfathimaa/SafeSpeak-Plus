import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoryCard } from './Stories/StoryCard';
import { ArrowRight } from 'lucide-react';
import storyService from '../services/storyService';
import { useToast } from '../hooks/useToast';

export function DashboardStories() {
    const [recentStories, setRecentStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchPublishedStories();
    }, []);

    const fetchPublishedStories = async () => {
        try {
            setIsLoading(true);
            const response = await storyService.getPublishedStories();
            if (response.success && response.stories) {
                // Take the first 3 published stories
                setRecentStories(response.stories.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
            // Silently fail - show loading spinner instead of error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-pink-500 pl-4">Community Stories</h3>
                <Link to="/stories" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center group">
                    View All Stories
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
                    ))}
                </div>
            ) : recentStories.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No stories yet. Be the first to share one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentStories.map(story => (
                        <StoryCard key={story._id} story={story} />
                    ))}
                </div>
            )}
        </div>
    );
}
