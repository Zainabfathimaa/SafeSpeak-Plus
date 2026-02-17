import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react';

export function ChatWindow({ conversation, onBack }) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
                <div className="text-center text-gray-400">
                    <p>Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // In a real app, this would send to API
        console.log("Sending:", newMessage);
        setNewMessage('');
        // For demo, we can't easily push to props without a real state manager or callback, 
        // so we'll just clear input for now.
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h3 className="font-bold text-gray-800">{conversation.subject}</h3>
                        <p className="text-xs text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Active Case
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.messages.map((msg) => {
                    const isUser = msg.sender === 'You';
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-sm text-sm
                  ${isUser
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}
                `}
                            >
                                {!isUser && <p className="text-xs font-bold mb-1 text-primary-dark">{msg.sender}</p>}
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSend} className="flex items-center space-x-2 bg-gray-100 rounded-xl px-2 py-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
