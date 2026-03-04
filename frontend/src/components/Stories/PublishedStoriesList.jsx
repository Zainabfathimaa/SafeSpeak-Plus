import React, { useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import storyService from '../../services/storyService';
import { useToast } from '../../hooks/useToast';

export const PublishedStoriesList = ({ stories, isLoading }) => {
  const { addToast } = useToast();
  const [list, setList] = useState(stories || []);
  const [likedStories, setLikedStories] = useState(new Set());
  const [expandedComments, setExpandedComments] =useState(new Set());
  const [newComment, setNewComment] = useState({});

  // keep local list in sync when props change
  useEffect(() => {
    setList(stories || []);
  }, [stories]);

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

  const handleComment = async (storyId) => {
    if (!newComment[storyId]?.trim()) {
      addToast('warning', 'Please enter a comment');
      return;
    }

    try {
      const response = await storyService.commentOnStory(storyId, newComment[storyId]);
      if (response.success) {
        addToast('success', 'Comment added!');
        // increment local comment count (optimistic update)
        setList(prev =>
          prev.map(s =>
            s._id === storyId
              ? { ...s, comments: [...(s.comments || []), { text: newComment[storyId] }] }
              : s
          )
        );
  const handleShare = async (storyId) => {
    try {
      const response = await storyService.shareStory(storyId);
      if (response.success) {
        addToast('success', 'Story shared!');
        // update share count in UI
        setList(prev =>
          prev.map(s =>
            s._id === storyId ? { ...s, shares: (s.shares || 0) + 1 } : s
          )
        );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  // search state for live filtering
  const [searchTerm, setSearchTerm] = React.useState('');

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (!list || list.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No stories published yet.</p>
      </div>
    );
  }

  // apply search filter
  const displayedStories = list.filter(s => {
    if (!searchTerm) return true;
    const lc = searchTerm.toLowerCase();
    return s.title.toLowerCase().includes(lc) || s.content.toLowerCase().includes(lc);
  });

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search stories..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {displayedStories.map(story => (
        <div key={story._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {story.category}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{story.title}</h2>
              </div>
              {story.isFeatured && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              By <span className="font-medium">{story.submittedBy?.fullName || 'Anonymous'}</span> • 
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{story.content}</p>
          </div>

          {/* Engagement Stats */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-8 text-sm text-gray-600">
            <button
              onClick={() => handleLike(story._id)}
              className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer"
            >
              <Heart size={18} fill={likedStories.has(story._id) ? 'currentColor' : 'none'} />
              <span>{story.likes?.length || 0} Likes</span>
            </button>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>{story.comments?.length || 0} Comments</span>
            </div>
            <button
              onClick={() => handleShare(story._id)}
              className="flex items-center gap-2 hover:text-blue-500 transition cursor-pointer"
            >
              <Share2 size={18} />
              <span>{story.shares || 0} Shares</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            {/* Add Comment */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-3">Add your comment</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment[story._id] || ''}
                  onChange={(e) => setNewComment(prev => ({
                    ...prev,
                    [story._id]: e.target.value
                  }))}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => handleComment(story._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Comments List */}
            {story.comments && story.comments.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-900">Comments ({story.comments.length})</p>
                {story.comments.slice(0, 3).map((comment, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-700">
                      {comment.commentedBy?.fullName || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {story.comments.length > 3 && (
                  <button
                    onClick={() => setExpandedComments(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(story._id)) {
                        newSet.delete(story._id);
                      } else {
                        newSet.add(story._id);
                      }
                      return newSet;
                    })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {expandedComments.has(story._id) ? 'Show less' : `Show more (${story.comments.length - 3})`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublishedStoriesList;
