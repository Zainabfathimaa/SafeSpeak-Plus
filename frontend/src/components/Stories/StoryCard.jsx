import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import storyService from '../../services/storyService';
import { useToast } from '../../hooks/useToast';

export function StoryCard({ story }) {
    const { addToast } = useToast();
    const [likes, setLikes] = React.useState(story.likes?.length || 0);
    const [isLiked, setIsLiked] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleLike = async (e) => {
        e.preventDefault();
        try {
            const res = await storyService.likeStory(story._id);
            if (res.success) {
                setLikes(res.likeCount);
                setIsLiked(res.liked);
                addToast('success', res.liked ? 'Story liked!' : 'Story unliked');
            }
        } catch (err) {
            addToast('error', 'Login to like stories');
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            const res = await storyService.shareStory(story._id);
            if (res.success) {
                addToast('success', 'Story shared!');
            }
        } catch (err) {
            addToast('error', 'Failed to share');
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${story.colorClass || 'bg-teal-500 shadow-sm'}`}>
                        {(story.author?.[0] || 'A').toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-xs leading-none mb-0.5">{story.author || 'Anonymous'}</p>
                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">
                            {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-base text-gray-800 mb-1.5">{story.title}</h3>
            <p className={`text-gray-600 text-xs leading-relaxed mb-1 flex-grow ${isExpanded ? '' : 'line-clamp-2'}`}>
                {isExpanded ? story.content : (story.snippet || story.content)}
            </p>
            {story.content && story.content.length > 100 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-blue-600 text-[10px] font-semibold hover:underline mb-3 mt-1 text-left"
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            )}

            <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                {(story.tags || []).slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-400">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 hover:text-red-500 transition-colors group ${isLiked ? 'text-red-500' : ''}`}
                >
                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="text-[10px] font-bold">{likes}</span>
                </button>
            </div>
        </div>
    );
}
