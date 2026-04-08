import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ConversationList } from '../components/Messages/ConversationList';
import { ChatWindow } from '../components/Messages/ChatWindow';
import { NewConversationModal } from '../components/Messages/NewConversationModal';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '../services/messageService';
import { getCurrentUser } from '../services/authService';
import { MessageSquare, Plus } from 'lucide-react';
import toastService from '../services/toastService';

const POLL_INTERVAL = 5000; // 5 seconds

export default function Messages() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const pollRef = useRef(null);
    const msgPollRef = useRef(null);

    // Fetch conversation list
    const fetchConversations = useCallback(async (silent = false) => {
        try {
            const res = await getConversations();
            if (res.success) {
                const convs = (res.conversations || []).map(c => ({
                    id: c.id,
                    subject: c.subject,
                    reportId: c.reportId,
                    lastMessage: c.lastMessage,
                    lastSender: c.lastSenderRole === 'user' ? 'You' : c.lastSenderRole.charAt(0).toUpperCase() + c.lastSenderRole.slice(1),
                    lastTime: new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    messages: []
                }));
                setConversations(convs);
                if (!activeConversationId && convs.length > 0) {
                    setActiveConversationId(convs[0].id);
                }
            } else {
                if (!silent) toastService.error('Failed to load conversations');
            }
        } catch (err) {
            if (!silent) {
                console.error('Failed to load conversations:', err);
                toastService.error('Error loading conversations. Please try again.');
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [activeConversationId]);

    // Initial load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const userRes = await getCurrentUser();
                if (userRes.success) {
                    setCurrentUser(userRes.user);
                }
            } catch (err) {
                console.error('Failed to get current user:', err);
            }
            await fetchConversations();
        };
        loadInitialData();
    }, []);

    // Poll conversations for new threads
    useEffect(() => {
        pollRef.current = setInterval(() => fetchConversations(true), POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, [fetchConversations]);

    // Fetch messages for active conversation
    const fetchMessages = useCallback(async () => {
        if (!activeConversationId || !currentUser) return;
        try {
            const res = await getMessages(activeConversationId);
            if (res.success) {
                const msgs = res.messages.map(m => {
                    let status = 'sent';
                    if (m.sender._id === currentUser.id) {
                        // Message sent by current user
                        const hasRead = m.readBy && m.readBy.length > 0;
                        const hasDelivered = m.deliveredTo && m.deliveredTo.length > 0;
                        if (hasRead) {
                            status = 'read';
                        } else if (hasDelivered) {
                            status = 'delivered';
                        }
                    }
                    return {
                        id: m._id,
                        sender: m.senderRole === 'user' ? 'You' : (m.sender?.fullName || m.senderRole.charAt(0).toUpperCase() + m.senderRole.slice(1)),
                        senderRole: m.senderRole,
                        text: m.text,
                        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status
                    };
                });
                setActiveConversation(prev => {
                    const conv = conversations.find(c => c.id === activeConversationId);
                    return { ...(conv || prev || {}), messages: msgs };
                });
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    }, [activeConversationId, conversations, currentUser]);

    useEffect(() => {
        fetchMessages();
    }, [activeConversationId, conversations]);

    // Poll messages for live chat
    useEffect(() => {
        if (!activeConversationId) return;
        msgPollRef.current = setInterval(fetchMessages, POLL_INTERVAL);
        return () => clearInterval(msgPollRef.current);
    }, [activeConversationId, fetchMessages]);

    const handleSelectConversation = (id) => {
        setActiveConversationId(id);
        setShowMobileChat(true);
    };

    const handleSendMessage = async (text) => {
        if (!text.trim() || !activeConversationId) return;
        try {
            const res = await sendMessageApi(activeConversationId, text);
            if (res.success) {
                const newMsg = {
                    id: res.message._id,
                    sender: 'You',
                    senderRole: 'user',
                    text: res.message.text,
                    time: new Date(res.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'sent'
                };
                setActiveConversation(prev => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMsg]
                }));
                // Also refresh conversation list to update last message
                fetchConversations(true);
                toastService.success('Message sent successfully');
            } else {
                toastService.error('Failed to send message');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            toastService.error('Error sending message. Please try again.');
        }
    };

    const handleConversationCreated = async () => {
        setLoading(true);
        await fetchConversations();
        setLoading(false);
        toastService.success('New conversation created!');
    };

    if (loading) {
        return (
            <div className="flex h-screen flex-col bg-background text-text-primary overflow-hidden">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                            <p className="text-text-secondary">Loading messages...</p>
                        </div>
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
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
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
                                    currentUserRole="user"
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
