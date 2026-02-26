import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { ConversationList } from '../../components/Messages/ConversationList';
import { ChatWindow } from '../../components/Messages/ChatWindow';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '../../services/messageService';

export default function AdminMessages() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch conversation list on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await getConversations();
                if (res.success && res.conversations.length > 0) {
                    const convs = res.conversations.map(c => ({
                        id: c.id,
                        subject: c.subject,
                        reportId: c.reportId,
                        lastMessage: c.lastMessage,
                        lastSender: c.lastSenderRole === 'admin' ? 'You' : c.lastSenderRole.charAt(0).toUpperCase() + c.lastSenderRole.slice(1),
                        lastTime: new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        messages: []
                    }));
                    setConversations(convs);
                    setActiveConversationId(convs[0].id);
                }
            } catch (err) {
                console.error('Failed to load conversations:', err);
            } finally {
                setLoading(false);
            }
        };
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
                        sender: m.senderRole === 'admin' ? 'You' : (m.sender?.fullName || 'Student'),
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

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary overflow-hidden">
                <AdminHeader roleName="Admin / Messages" />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar role="admin" />
                    <main className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary animate-pulse">Loading messages...</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50 text-text-primary overflow-hidden">
            <AdminHeader roleName="Admin / Messages" />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar role="admin" />

                <main className="flex-1 flex overflow-hidden">
                    {conversations.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-text-secondary">No message threads yet.</p>
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
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
