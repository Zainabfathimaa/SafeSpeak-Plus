import React from 'react';
import { Search, Plus } from 'lucide-react';

export function ConversationList({ conversations, activeId, onSelect, mobileView, onNewConversation }) {
    return (
        <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${mobileView ? 'w-full' : 'w-80 md:w-96'}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    {onNewConversation && (
                        <button
                            onClick={onNewConversation}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>New</span>
                        </button>
                    )}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50
              ${activeId === conv.id ? 'bg-blue-50/60 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
            `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-semibold text-sm ${activeId === conv.id ? 'text-primary' : 'text-gray-900'}`}>
                                {conv.subject}
                            </h3>
                            <span className="text-xs text-text-secondary">{conv.lastTime}</span>
                        </div>
                        <p className="text-xs text-text-secondary mb-2">Report ID: {conv.reportId}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                            <span className="font-medium">{conv.lastSender}:</span> {conv.lastMessage}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

