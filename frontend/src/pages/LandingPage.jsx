import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, FileText, CheckCircle, Users, Building, AlertTriangle, FileCheck, BarChart3, ArrowRight, Activity, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="w-full lg:w-1/2 text-left z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Lock className="w-4 h-4" />
                                <span>Enterprise-Grade Security</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Your voice matters.<br />
                                <span className="text-primary">Speak safely.</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                                SafeSpeak+ is an anonymous incident reporting platform that protects whistleblowers while ensuring accountability. Report concerns without fear of retaliation.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 h-12 text-base">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Create Anonymous Account
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-200 hover:bg-gray-50 text-gray-700 px-8 h-12 text-base">
                                        Enter with Code
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Identity Protected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <EyeOff className="w-4 h-4" />
                                    <span>End-to-End Encrypted</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative">
                            {/* Abstract Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl -z-10" />

                            {/* Hero Card */}
                            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-lg mx-auto lg:mx-0">
                                <div className="flex items-start justify-between mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Anonymous Reporter</h3>
                                            <p className="text-sm text-gray-500">Identity Protected</p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                        Verified
                                    </span>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="h-2.5 bg-gray-100 rounded-full w-full" />
                                    <div className="h-2.5 bg-gray-100 rounded-full w-3/4" />
                                    <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1.5">Report ID</p>
                                        <p className="font-mono font-medium text-gray-900">SR-2024-0042</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1.5">Risk Level</p>
                                        <p className="font-medium text-yellow-600">Medium</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1.5">Status</p>
                                        <p className="font-medium text-primary">Under Review</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Features */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Enterprise-Grade Features</h2>
                        <p className="text-lg text-gray-600">
                            Built for organizations that take compliance and employee safety seriously.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<Lock className="w-6 h-6 text-primary" />}
                            title="Anonymous Identity"
                            description="Unique code-based system ensures your identity is never exposed to reviewers."
                        />
                        <FeatureCard
                            icon={<Activity className="w-6 h-6 text-primary" />}
                            title="Risk Scoring"
                            description="Automated risk assessment prioritizes critical cases for immediate attention."
                        />
                        <FeatureCard
                            icon={<Clock className="w-6 h-6 text-primary" />}
                            title="SLA Tracking"
                            description="Time-bound case handling with automatic escalation prevents delays."
                        />
                        <FeatureCard
                            icon={<MessageSquare className="w-6 h-6 text-primary" />}
                            title="Secure Messaging"
                            description="Two-way anonymous communication without identity exposure."
                        />
                        <FeatureCard
                            icon={<AlertTriangle className="w-6 h-6 text-primary" />}
                            title="Auto Escalation"
                            description="Cases automatically escalate to higher authority if not addressed."
                        />
                        <FeatureCard
                            icon={<EyeOff className="w-6 h-6 text-primary" />}
                            title="Audit Trail"
                            description="Tamper-proof logging ensures complete transparency and accountability."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-primary" />}
                            title="Whistleblower Mode"
                            description="Enhanced protection for highly sensitive reports."
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-primary" />}
                            title="Role-Based Access"
                            description="Granular permissions ensure the right people see the right data."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600">
                            Simple, secure, and completely anonymous from start to finish.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Step
                            number="01"
                            title="Register Once"
                            description="Verify your identity with your official email. The system generates a unique anonymous code that you'll use for all future access."
                        />
                        <Step
                            number="02"
                            title="Report Anonymously"
                            description="Submit incidents using your anonymous code. Attach evidence securely. Your identity is never visible to case reviewers."
                        />
                        <Step
                            number="03"
                            title="Track Progress"
                            description="Monitor your report status, receive updates, and communicate with reviewers—all while staying completely anonymous."
                        />
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section id="security" className="py-16 bg-[#0F5156] text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Safety is Our Priority</h2>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                SafeSpeak+ is built with security at its core. We employ industry-leading practices to ensure your identity remains protected at all times.
                            </p>

                            <div className="space-y-4">
                                <SecurityItem text="Identity data and report data stored separately" />
                                <SecurityItem text="End-to-end encryption for all communications" />
                                <SecurityItem text="No single person has full system access" />
                                <SecurityItem text="Tamper-proof audit logging" />
                                <SecurityItem text="Compliance with POSH, GDPR, and industry standards" />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Zero Knowledge Architecture</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Even our administrators cannot link your reports to your real identity. The system is designed so that anonymity is mathematically guaranteed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function Step({ number, title, description }) {
    return (
        <div className="relative">
            <div className="text-6xl font-bold text-gray-100 absolute -top-8 -left-4 -z-10 select-none">
                {number}
            </div>
            <div className="pt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function SecurityItem({ text }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-gray-200">{text}</span>
        </div>
    );
}
