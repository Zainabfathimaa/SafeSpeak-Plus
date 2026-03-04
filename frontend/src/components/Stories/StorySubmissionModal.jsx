import React, { useState } from 'react';
import { X } from 'lucide-react';
import storyService from '../../services/storyService';
import { useToast } from '../../hooks/useToast';

export const StorySubmissionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Personal Experience'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        addToast('error', 'Please enter a story title');
        setIsLoading(false);
        return;
      }

      if (formData.title.length < 5) {
        addToast('error', 'Title must be at least 5 characters');
        setIsLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        addToast('error', 'Please enter your story');
        setIsLoading(false);
        return;
      }

      if (formData.content.length < 50) {
        addToast('error', 'Story must be at least 50 characters');
        setIsLoading(false);
        return;
      }

      // Submit
      const response = await storyService.submitStory(formData);

      if (response.success) {
        // Build the URL for the user to view their stories
        const currentUrl = window.location.origin;
        addToast('success', `${response.message} View at: ${currentUrl}/dashboard`);
        setFormData({
          title: '',
          content: '',
          category: 'Personal Experience'
        });
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to submit story');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Share Your Story</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Personal Experience">Personal Experience</option>
              <option value="Awareness">Awareness</option>
              <option value="Support">Support</option>
              <option value="Guidance">Guidance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title *
              <span className="text-xs text-gray-500 font-normal ml-1">
                (min 5 characters)
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your story a meaningful title"
              maxLength="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Story *
              <span className="text-xs text-gray-500 font-normal ml-1">
                (min 50 characters)
              </span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your experience, insights, or message. Be authentic and detailed..."
              maxLength="5000"
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/5000</p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Please note:</strong> Your story will be reviewed by our admin team before publication.
              Ensure it's appropriate and follows our community guidelines.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Story for Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StorySubmissionModal;
