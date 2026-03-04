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
            className="group bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden mb-6 relative hover:-translate-y-1"
          >
            {/* Header / Status Bar */}
            <div className="p-6 pb-4 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-transparent border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-white shadow-sm border border-gray-100`}>
                  <span className="text-xl leading-none">{getStatusIcon(story.status)}</span>
                </div>
                <div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getStatusColor(story.status)} shadow-sm`}>
                    {story.status}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter ml-1">
                    {story.createdAt ? new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(story._id)}
                className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 transform scale-90 hover:scale-100"
                title="Delete story"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-7">
              <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">{story.title}</h3>
              <div className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-100/50">
                {story.category}
              </div>
              <p className="text-gray-600 leading-relaxed font-medium line-clamp-3 mb-6 bg-gray-50/30 p-4 rounded-2xl border border-gray-100/50">
                {story.content}
              </p>

              {/* Engagement Stats & Bottom Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100/50">
                <div className="flex gap-8">
                  <button
                    onClick={() => handleLike(story._id)}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-red-500 transition-all font-bold group/btn"
                  >
                    <div className="p-2 rounded-full group-hover/btn:bg-red-50 transition-colors">
                      <Heart size={18} fill={likedStories.has(story._id) ? '#EF4444' : 'none'} className={likedStories.has(story._id) ? 'text-red-500' : ''} />
                    </div>
                    <span className="text-sm">{story.likes?.length || 0}</span>
                  </button>
                  <div className="flex items-center gap-2.5 text-gray-400 font-bold">
                    <div className="p-2 rounded-full">
                      <MessageSquare size={18} />
                    </div>
                    <span className="text-sm">{story.comments?.length || 0}</span>
                  </div>
                  <button
                    onClick={() => handleShare(story._id)}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-blue-500 transition-all font-bold group/btn"
                  >
                    <div className="p-2 rounded-full group-hover/btn:bg-blue-50 transition-colors">
                      <Share2 size={18} />
                    </div>
                    <span className="text-sm">{story.shares || 0}</span>
                  </button>
                </div>
              </div>

              {/* Admin Feedback Box */}
              {story.reviewComments && (story.status === 'Rejected' || story.status === 'Approved') && (
                <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/80 rounded-2xl flex gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                    <MessageSquare size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Counsellor Feedback</p>
                    <p className="text-sm text-blue-900/80 font-medium leading-relaxed italic">"{story.reviewComments}"</p>
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
