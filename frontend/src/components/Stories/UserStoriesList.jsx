import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Heart, Share2 } from 'lucide-react';
import storyService from '../../services/storyService';
import { useToast } from '../../hooks/useToast';

export const UserStoriesList = ({ stories, onDelete, isLoading }) => {
  const { addToast } = useToast();
  const [likedStories, setLikedStories] = useState(new Set());

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

  if (!stories || stories.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">No stories yet. Share your first story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map(story => (
        <div key={story._id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getStatusIcon(story.status)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                    {story.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{story.title}</h3>
                <p className="text-sm text-gray-600">
                  Category: <span className="font-medium">{story.category}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(story._id)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Delete story"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-gray-700 line-clamp-3">{story.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(story.createdAt).toLocaleDateString()} {new Date(story.createdAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Admin Comments (if rejected or has feedback) */}
          {story.reviewComments && (story.status === 'Rejected' || story.status === 'Approved') && (
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">Admin Feedback:</p>
              <p className="text-sm text-blue-800">{story.reviewComments}</p>
            </div>
          )}

          {/* Engagement Stats & Actions */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex gap-6 text-sm text-gray-600">
              <button
                onClick={() => handleLike(story._id)}
                className="flex items-center gap-2 hover:text-red-500 transition"
              >
                <Heart size={18} fill={likedStories.has(story._id) ? 'currentColor' : 'none'} />
                <span>{story.likes?.length || 0}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span>{story.comments?.length || 0}</span>
              </div>
              <button
                onClick={() => handleShare(story._id)}
                className="flex items-center gap-2 hover:text-blue-500 transition"
              >
                <Share2 size={18} />
                <span>{story.shares || 0}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStoriesList;
