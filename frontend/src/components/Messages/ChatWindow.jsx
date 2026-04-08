import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, ArrowLeft, RefreshCw, Check, CheckCheck } from 'lucide-react';

export function ChatWindow({ conversation, onBack, onSend, currentUserRole = 'user' }) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    // Focus input on mount and conversation change
    useEffect(() => {
        if (conversation) {
            inputRef.current?.focus();
        }
    }, [conversation?.id]);

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 h-full">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200/50 flex items-center justify-center">
                        <Send className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-lg font-medium">Select a conversation</p>
                    <p className="text-gray-300 text-sm mt-1">Choose a chat from the sidebar to start messaging</p>
                </div>
            </div>
        );
    }

    const isCurrentUser = (senderRole) => {
        if (currentUserRole === 'admin') return senderRole === 'admin';
        return senderRole === 'user';
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (onSend) {
            onSend(newMessage);
        }
        setNewMessage('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                            {currentUserRole === 'admin' ? 'U' : 'A'}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">{conversation.subject}</h3>
                        <p className="text-xs text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            Active Case
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area — WhatsApp style */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: '#f0f2f5'
                }}
            >
                {/* Date separator */}
                <div className="flex justify-center mb-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-500 text-xs px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                        Today
                    </span>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                    {conversation.messages.map((msg) => {
                        const isUser = msg.sender === 'You';
                        return (
                            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`relative max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed
                                        ${isUser
                                            ? 'bg-primary text-white rounded-br-md'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                                        }
                                    `}
                                >
                                    {/* Sender name for non-current user messages */}
                                    {!isUser && (
                                        <p className="text-xs font-semibold mb-1 text-primary">{msg.sender}</p>
                                    )}

                                    {/* Message text */}
                                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                                    {/* Time stamp */}
                                    <p className={`text-[10px] mt-1 text-right flex items-center justify-end space-x-1
                                        ${isUser ? 'text-white/70' : 'text-gray-400'}
                                    `}>
                                        <span>{msg.time}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area — WhatsApp style */}
            <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
                <form onSubmit={handleSend} className="flex items-end space-x-2">
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full px-4 py-2.5 border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 resize-none bg-transparent"
                            style={{ minHeight: '40px', maxHeight: '120px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2.5 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 hover:shadow-lg active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
