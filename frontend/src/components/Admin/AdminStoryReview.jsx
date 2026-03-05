import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, Trash2 } from 'lucide-react';
import storyService from '../../services/storyService';
import { useToast } from '../../hooks/useToast';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export const AdminStoryReview = ({ stories, onRefresh }) => {
  const { addToast } = useToast();
  const [processingId, setProcessingId] = useState(null);
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectForm, setShowRejectForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleApprove = async (storyId) => {
    setProcessingId(storyId);
    try {
      const response = await storyService.approveStory(storyId, 'Approved by admin');
      if (response.success) {
        addToast('success', 'Story approved and published!');
        onRefresh();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to approve story');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (storyId) => {
    if (!rejectReason[storyId]?.trim()) {
      addToast('warning', 'Please provide a reason for rejection');
      return;
    }

    setProcessingId(storyId);
    try {
      const response = await storyService.rejectStory(
        storyId,
        rejectReason[storyId],
        'Please revise and resubmit'
      );
      if (response.success) {
        addToast('success', 'Story rejected. User will be notified.');
        setRejectReason(prev => ({
          ...prev,
          [storyId]: ''
        }));
        setShowRejectForm(null);
        onRefresh();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to reject story');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClick = (storyId) => {
    setStoryToDelete(storyId);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!storyToDelete) return;
    setIsDeleteModalOpen(false);
    setProcessingId(storyToDelete);
    try {
      const response = await storyService.deleteStory(storyToDelete);
      if (response.success) {
        addToast('success', 'Story deleted successfully');
        onRefresh();
      }
    } catch (error) {
      addToast('error', error.message || 'Failed to delete story');
    } finally {
      setProcessingId(null);
      setStoryToDelete(null);
    }
  };

  if (!stories || stories.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No stories pending review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Pending Stories ({stories.length})
      </h3>

      {stories.map(story => (
        <div key={story._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="mb-3">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                ⏳ Pending Review
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Submitted by:</span> {story.submittedBy?.fullName || 'Anonymous'} ({story.submittedBy?.email})
              </p>
              <p>
                <span className="font-medium">Category:</span> {story.category}
              </p>
              <p>
                <span className="font-medium">Date:</span> {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content Preview */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <p className="text-gray-700 line-clamp-4">{story.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {story.content.length} characters • {story.content.split(/\s+/).length} words
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-4">
            {/* Show reject form if expanded */}
            {showRejectForm === story._id && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-red-900 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason[story._id] || ''}
                  onChange={(e) => setRejectReason(prev => ({
                    ...prev,
                    [story._id]: e.target.value
                  }))}
                  placeholder="Explain why this story doesn't meet our guidelines..."
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  rows="3"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              {showRejectForm === story._id ? (
                <>
                  <button
                    onClick={() => {
                      setShowRejectForm(null);
                      setRejectReason(prev => ({
                        ...prev,
                        [story._id]: ''
                      }));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(story._id)}
                    disabled={processingId === story._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition flex items-center gap-2"
                  >
                    {processingId === story._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Confirm Rejection
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDeleteClick(story._id)}
                    disabled={processingId === story._id}
                    className="mr-auto px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50 text-sm font-medium transition flex items-center gap-2"
                    title="Permanently delete story"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button
                    onClick={() => setShowRejectForm(story._id)}
                    disabled={processingId === story._id}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 text-sm font-medium transition flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(story._id)}
                    disabled={processingId === story._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition flex items-center gap-2"
                  >
                    {processingId === story._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Approve & Publish
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default AdminStoryReview;
