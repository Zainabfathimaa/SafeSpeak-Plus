import React, { useState, useMemo } from 'react';
import { Trash2, MessageSquare, Heart, Share2, Search } from 'lucide-react';
import storyService from '../../services/storyService';
import { useToast } from '../../hooks/useToast';

export const UserStoriesList = ({ stories, onDelete, isLoading }) => {
  const { addToast } = useToast();
  const [likedStories, setLikedStories] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Pending Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Draft': '📝',
      'Pending Review': '⏳',
      'Approved': '✅',
      'Rejected': '❌'
    };
    return icons[status] || '📋';
  };

  const handleDelete = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const response = await storyService.deleteStory(storyId);
        if (response.success) {
          addToast('success', 'Story deleted successfully');
          onDelete(storyId);
        }
      } catch (error) {
        addToast('error', error.message || 'Failed to delete story');
      }
    }
  };

  const handleLike = async (storyId) => {
    try {
      const response = await storyService.likeStory(storyId);
      if (response.success) {
        setLikedStories(prev => {
          const newSet = new Set(prev);
          if (response.liked) {
            newSet.add(storyId);
          } else {
            newSet.delete(storyId);
          }
          return newSet;
        });
      }
    } catch (error) {
      addToast('error', 'Failed to like story');
    }
  };

  const handleShare = async (storyId) => {
    try {
      const response = await storyService.shareStory(storyId);
      if (response.success) {
        addToast('success', 'Story shared!');
      }
    } catch (error) {
      addToast('error', 'Failed to share story');
    }
  };

  const filteredStories = useMemo(() => {
    if (!stories) return [];
    if (!searchQuery.trim()) return stories;

    const query = searchQuery.toLowerCase();
    return stories.filter(story =>
      (story.title && story.title.toLowerCase().includes(query)) ||
      (story.content && story.content.toLowerCase().includes(query)) ||
      (story.category && story.category.toLowerCase().includes(query))
    );
  }, [stories, searchQuery]);

  if (!stories || stories.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">No stories yet. Share your first story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search your stories by title, content, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredStories.length === 0 && searchQuery ? (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <p className="text-gray-500">No stories found matching "{searchQuery}"</p>
        </div>
      ) : (
        filteredStories.map((story, idx) => (
          <div
            key={story._id || idx}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-4 relative"
          >
            {/* Header / Status Bar */}
            <div className="p-4 pb-3 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-white border border-gray-100 text-sm`}>
                  {getStatusIcon(story.status)}
                </div>
                <div>
                  <div className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(story.status)}`}>
                    {story.status}
                  </div>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5 ml-1">
                    {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Draft'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(story._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete story"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">{story.title}</h3>
              <div className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider mb-3">
                {story.category}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                {story.content}
              </p>

              {/* Engagement Stats & Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-6">
                  <button
                    onClick={() => handleLike(story._id)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-all font-semibold"
                  >
                    <Heart size={16} fill={likedStories.has(story._id) ? '#EF4444' : 'none'} className={likedStories.has(story._id) ? 'text-red-500' : ''} />
                    <span className="text-xs">{story.likes?.length || 0}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-gray-400 font-semibold">
                    <MessageSquare size={16} />
                    <span className="text-xs">{story.comments?.length || 0}</span>
                  </div>
                  <button
                    onClick={() => handleShare(story._id)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-all font-semibold"
                  >
                    <Share2 size={16} />
                    <span className="text-xs">{story.shares || 0}</span>
                  </button>
                </div>
              </div>

              {/* Admin Feedback Box */}
              {story.reviewComments && (story.status === 'Rejected' || story.status === 'Approved') && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                  <MessageSquare size={14} className="text-blue-600 mt-1 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-0.5">Feedback</p>
                    <p className="text-sm text-blue-800 leading-normal italic">"{story.reviewComments}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserStoriesList;
