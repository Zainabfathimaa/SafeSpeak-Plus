import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export function StoryCard({ story }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${story.colorClass || 'bg-teal-500'}`}>
                        {story.author[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{story.author}</p>
                        <p className="text-xs text-text-secondary">{story.date}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <h3 className="font-bold text-lg text-gray-800 mb-2">{story.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-grow">
                {story.snippet}
                <span className="text-primary hover:underline cursor-pointer ml-1 font-medium">Read more</span>
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400">
                <button className="flex items-center space-x-1 hover:text-red-500 transition-colors group">
                    <Heart className="w-4 h-4 group-hover:fill-current" />
                    <span className="text-xs">{story.likes}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{story.comments}</span>
                </button>
                <button className="hover:text-gray-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
