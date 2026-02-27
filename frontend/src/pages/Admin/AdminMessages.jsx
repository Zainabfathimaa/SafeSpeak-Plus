import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { ConversationList } from '../../components/Messages/ConversationList';
import { ChatWindow } from '../../components/Messages/ChatWindow';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '../../services/messageService';
import { MessageSquare } from 'lucide-react';

const POLL_INTERVAL = 5000; // 5 seconds

export default function AdminMessages() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [loading, setLoading] = useState(true);
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
                    lastSender: c.lastSenderRole === 'admin' ? 'You' : c.lastSenderRole.charAt(0).toUpperCase() + c.lastSenderRole.slice(1),
                    lastTime: new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    messages: []
                }));
                setConversations(convs);
                if (!activeConversationId && convs.length > 0) {
                    setActiveConversationId(convs[0].id);
                }
            }
        } catch (err) {
            if (!silent) console.error('Failed to load conversations:', err);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [activeConversationId]);

    // Initial load
    useEffect(() => {
        fetchConversations();
    }, []);

    // Poll conversations
    useEffect(() => {
        pollRef.current = setInterval(() => fetchConversations(true), POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, [fetchConversations]);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        if (!activeConversationId) return;
        try {
            const res = await getMessages(activeConversationId);
            if (res.success) {
                const msgs = res.messages.map(m => ({
                    id: m._id,
                    sender: m.senderRole === 'admin' ? 'You' : (m.sender?.fullName || 'Student'),
                    senderRole: m.senderRole,
                    text: m.text,
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setActiveConversation(prev => {
                    const conv = conversations.find(c => c.id === activeConversationId);
                    return { ...(conv || prev || {}), messages: msgs };
                });
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    }, [activeConversationId, conversations]);

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
                    senderRole: 'admin',
                    text: res.message.text,
                    time: new Date(res.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setActiveConversation(prev => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMsg]
                }));
                fetchConversations(true);
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen flex-col bg-gray-50/50 text-text-primary overflow-hidden">
                <AdminHeader roleName="Admin / Messages" />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar role="admin" />
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
        <div className="flex h-screen flex-col bg-gray-50/50 text-text-primary overflow-hidden">
            <AdminHeader roleName="Admin / Messages" />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar role="admin" />

                <main className="flex-1 flex overflow-hidden">
                    {conversations.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-200/50 flex items-center justify-center">
                                    <MessageSquare className="w-10 h-10 text-gray-300" />
                                </div>
                                <p className="text-gray-400 text-lg font-medium">No message threads yet</p>
                                <p className="text-gray-300 text-sm mt-1">Messages from users will appear here</p>
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
                                    currentUserRole="admin"
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
