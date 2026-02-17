import React from 'react';
import { Link } from 'react-router-dom';
import { StoryCard } from './Stories/StoryCard';
import { stories } from '../data/stories';
import { ArrowRight } from 'lucide-react';

export function DashboardStories() {
    // Take the first 3 stories for the dashboard preview
    const recentStories = stories.slice(0, 3);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-pink-500 pl-4">Community Stories</h3>
                <Link to="/stories" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center group">
                    View All Stories
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentStories.map(story => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>
        </div>
    );
}
