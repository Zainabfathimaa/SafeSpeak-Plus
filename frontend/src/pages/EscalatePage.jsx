import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { EscalationPathCard } from '../components/Escalation/EscalationPathCard';
import { EscalationForm } from '../components/Escalation/EscalationForm';
import { ShieldAlert, HeartHandshake } from 'lucide-react';

export default function EscalatePage() {
    const [selectedPath, setSelectedPath] = useState(null); // 'admin' | 'ngo' | null

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">Escalate a Case</h1>
                            <p className="text-text-secondary max-w-2xl mx-auto">
                                If you feel your report hasn't been handled correctly, or if you need external support,
                                you can escalate your case here. We take these requests very seriously.
                            </p>
                        </div>

                        {/* Selection Cards */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 transition-all duration-500 ${selectedPath ? 'opacity-50 scale-95 pointer-events-none' : 'opacity-100'}`}>
                            <EscalationPathCard
                                title="Super Admin Review"
                                description="Directly alert senior management about negligence, bias, or lack of response from the standard team."
                                icon={ShieldAlert}
                                colorClass="red-600"
                                active={selectedPath === 'admin'}
                                onClick={() => setSelectedPath(selectedPath === 'admin' ? null : 'admin')}
                            />
                            <EscalationPathCard
                                title="External NGO Support"
                                description="Share your case details with our trusted 3rd-party NGO partners for independent advice and counseling."
                                icon={HeartHandshake}
                                colorClass="blue-600"
                                active={selectedPath === 'ngo'}
                                onClick={() => setSelectedPath(selectedPath === 'ngo' ? null : 'ngo')}
                            />
                        </div>

                        {/* Form Area */}
                        {selectedPath && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <EscalationForm
                                    type={selectedPath}
                                    onCancel={() => setSelectedPath(null)}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
