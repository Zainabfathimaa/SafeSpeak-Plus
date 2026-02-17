import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ConversationList } from '../components/Messages/ConversationList';
import { ChatWindow } from '../components/Messages/ChatWindow';

// Mock Data
const MOCK_CONVERSATIONS = [
    {
        id: 1,
        subject: 'Report: Bullying in Library',
        reportId: 'REF-2023-001',
        lastMessage: 'Status updated to In Review',
        lastSender: 'System',
        lastTime: '10:42 AM',
        messages: [
            { id: 1, sender: 'You', text: 'I wanted to add that there was a third student involved.', time: '10:30 AM' },
            { id: 2, sender: 'Admin', text: 'Thank you for the update. We have noted this in the file.', time: '10:35 AM' },
            { id: 3, sender: 'System', text: 'Status updated to In Review', time: '10:42 AM' }
        ]
    },
    {
        id: 2,
        subject: 'Report: Safety Hazard',
        reportId: 'REF-2023-002',
        lastMessage: 'Can you provide a photo?',
        lastSender: 'Admin',
        lastTime: 'Yesterday',
        messages: [
            { id: 1, sender: 'You', text: 'The railing feels very loose.', time: 'Yesterday 2:00 PM' },
            { id: 2, sender: 'Admin', text: 'Can you provide a photo of the specific section?', time: 'Yesterday 2:15 PM' }
        ]
    }
];

export default function Messages() {
    const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0].id);
    const [showMobileChat, setShowMobileChat] = useState(false);

    const handleSelectConversation = (id) => {
        setActiveConversationId(id);
        setShowMobileChat(true); // Switch to chat view on mobile
    };

    const activeConversation = MOCK_CONVERSATIONS.find(c => c.id === activeConversationId);

    return (
        <div className="flex h-screen flex-col bg-background text-text-primary overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 flex overflow-hidden">
                    {/* Desktop: Split View. Mobile: Toggle between List and Window */}

                    {/* Conversations List Panel */}
                    <div className={`
                    ${showMobileChat ? 'hidden md:block' : 'block'} 
                    w-full md:w-auto h-full z-0
                `}>
                        <ConversationList
                            conversations={MOCK_CONVERSATIONS}
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
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
