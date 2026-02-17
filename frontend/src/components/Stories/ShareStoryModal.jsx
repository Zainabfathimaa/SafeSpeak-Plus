import React, { useState } from 'react';
import { X, Send, Lock } from 'lucide-react';

export function ShareStoryModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isAnonymous: true,
        tags: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        alert("Your story has been submitted for review!");
        onClose();
        setFormData({ title: '', content: '', isAnonymous: true, tags: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-2">
                        <Lock className="w-5 h-5" />
                        <h2 className="font-bold text-lg">Share Your Story</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-primary-dark/50 p-1 rounded-full text-white/80 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-text-secondary mb-4">
                        Your voice matters. Sharing your experience helps others feel less alone.
                        All stories are reviewed before posting to ensure safety.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="Give your story a headline..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
                        <textarea
                            required
                            rows="6"
                            placeholder="Write as much or as little as you'd like..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. bullying, advice, courage"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-6">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="anon"
                                checked={formData.isAnonymous}
                                onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                className="rounded text-primary focus:ring-primary"
                            />
                            <label htmlFor="anon" className="text-sm text-gray-600 cursor-pointer select-none">Post Anonymously</label>
                        </div>
                        <button
                            type="submit"
                            className="flex items-center bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-all transform hover:scale-105"
                        >
                            Submit Story
                            <Send className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
