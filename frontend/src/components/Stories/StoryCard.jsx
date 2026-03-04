import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export function StoryCard({ story }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${story.colorClass || 'bg-teal-500 shadow-sm'}`}>
                        {(story.author?.[0] || 'A').toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm leading-none mb-1">{story.author || 'Anonymous User'}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">
                            {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
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
            <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                {(story.tags || []).map((tag, idx) => (
                    <span key={idx} className="bg-gray-100/80 backdrop-blur-sm text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight hover:bg-gray-200 transition-colors">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400">
                <button className="flex items-center space-x-1.5 hover:text-red-500 transition-colors group">
                    <Heart className="w-4 h-4 group-hover:fill-current" />
                    <span className="text-xs font-bold">{story.likes?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors group">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-bold">{story.comments?.length || 0}</span>
                </button>
                <button className="hover:text-gray-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
