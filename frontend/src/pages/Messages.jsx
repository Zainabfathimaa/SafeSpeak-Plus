import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ConversationList } from '../components/Messages/ConversationList';
import { ChatWindow } from '../components/Messages/ChatWindow';
import { NewConversationModal } from '../components/Messages/NewConversationModal';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '../services/messageService';
import { MessageSquare, Plus } from 'lucide-react';

export default function Messages() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showNewConversation, setShowNewConversation] = useState(false);

    // Fetch conversation list
    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            if (res.success && res.conversations.length > 0) {
                const convs = res.conversations.map(c => ({
                    id: c.id,
                    subject: c.subject,
                    reportId: c.reportId,
                    lastMessage: c.lastMessage,
                    lastSender: c.lastSenderRole === 'user' ? 'You' : c.lastSenderRole.charAt(0).toUpperCase() + c.lastSenderRole.slice(1),
                    lastTime: new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    messages: [] // will be filled when selected
                }));
                setConversations(convs);
                if (!activeConversationId) {
                    setActiveConversationId(convs[0].id);
                }
            }
        } catch (err) {
            console.error('Failed to load conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Fetch messages when active conversation changes
    useEffect(() => {
        if (!activeConversationId) return;
        const fetchMessages = async () => {
            try {
                const res = await getMessages(activeConversationId);
                if (res.success) {
                    const msgs = res.messages.map(m => ({
                        id: m._id,
                        sender: m.senderRole === 'user' ? 'You' : (m.sender?.fullName || m.senderRole.charAt(0).toUpperCase() + m.senderRole.slice(1)),
                        text: m.text,
                        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));
                    const conv = conversations.find(c => c.id === activeConversationId);
                    if (conv) {
                        setActiveConversation({ ...conv, messages: msgs });
                    }
                }
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };
        fetchMessages();
    }, [activeConversationId, conversations]);

    const handleSelectConversation = (id) => {
        setActiveConversationId(id);
        setShowMobileChat(true);
    };

    const handleSendMessage = async (text) => {
        if (!text.trim() || !activeConversationId) return;
        try {
            const res = await sendMessageApi(activeConversationId, text);
            if (res.success) {
                // Append the new message locally
                const newMsg = {
                    id: res.message._id,
                    sender: 'You',
                    text: res.message.text,
                    time: new Date(res.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setActiveConversation(prev => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMsg]
                }));
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleConversationCreated = async () => {
        setLoading(true);
        await fetchConversations();
    };

    if (loading) {
        return (
            <div className="flex h-screen flex-col bg-background text-text-primary overflow-hidden">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary animate-pulse">Loading messages...</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background text-text-primary overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 flex overflow-hidden">
                    {conversations.length === 0 ? (
                        /* Empty State — Contact Admin */
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center max-w-md mx-auto px-6">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Messages Yet</h2>
                                <p className="text-text-secondary mb-8">
                                    Start a conversation with an admin about one of your reports. Get updates, ask questions, or provide additional information.
                                </p>
                                <button
                                    onClick={() => setShowNewConversation(true)}
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Contact Admin</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Conversations List Panel */}
                            <div className={`
                                ${showMobileChat ? 'hidden md:block' : 'block'} 
                                w-full md:w-auto h-full z-0
                            `}>
                                <ConversationList
                                    conversations={conversations}
                                    activeId={activeConversationId}
                                    onSelect={handleSelectConversation}
                                    onNewConversation={() => setShowNewConversation(true)}
                                />
                            </div>

                            {/* Chat Window Panel */}
                            <div className={`
                                ${showMobileChat ? 'block' : 'hidden md:flex'} 
                                flex-1 h-full z-10
                            `}>
                                <ChatWindow
                                    conversation={activeConversation}
                                    onBack={() => setShowMobileChat(false)}
                                    onSend={handleSendMessage}
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* New Conversation Modal */}
            <NewConversationModal
                isOpen={showNewConversation}
                onClose={() => setShowNewConversation(false)}
                onConversationCreated={handleConversationCreated}
            />
        </div>
    );
}
