import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Lightbulb, Shield, Bell, Settings, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

const OnboardingGuide = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const steps = [
        {
            title: "Welcome to SafeSpeak+",
            description: "Your safe space for anonymous reporting and sharing. Let's take a quick tour of your new dashboard.",
            icon: <Shield className="w-12 h-12 text-primary" />,
            color: "blue"
        },
        {
            title: "Submit a Report",
            description: "Use the 'Report Incident' button to securely and anonymously report any issues. You can attach images as evidence.",
            icon: <FileText className="w-12 h-12 text-amber-500" />,
            color: "amber"
        },
        {
            title: "Stay Notified",
            description: "Check the notification bell for real-time updates on your reports, messages from admins, and story approvals.",
            icon: <Bell className="w-12 h-12 text-blue-500" />,
            color: "blue"
        },
        {
            title: "Manage Your Stories",
            description: "Share your experiences in the 'My Stories' section. Once approved by an admin, they'll be visible to the community.",
            icon: <Lightbulb className="w-12 h-12 text-green-500" />,
            color: "green"
        },
        {
            title: "Privacy Settings",
            description: "Control your anonymity and notification preferences in the Settings page. Your safety is our priority.",
            icon: <Settings className="w-12 h-12 text-gray-500" />,
            color: "gray"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        if (onComplete) onComplete();
    };

    if (!isVisible) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 animate-in zoom-in-95 duration-300">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                </div>

                <button 
                    onClick={handleComplete}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-12 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 mb-6 animate-bounce-subtle">
                        {step.icon}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {step.description}
                    </p>

                    <div className="flex items-center justify-between mt-8">
                        <button 
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center text-sm font-medium transition-colors ${
                                currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-primary'
                            }`}
                        >
                            <ChevronLeft size={18} className="mr-1" />
                            Back
                        </button>

                        <div className="flex gap-1.5">
                            {steps.map((_, i) => (
                                <div 
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        i === currentStep ? 'w-6 bg-primary' : 'bg-gray-200'
                                    }`}
                                ></div>
                            ))}
                        </div>

                        <Button 
                            onClick={handleNext}
                            className="flex items-center px-6"
                        >
                            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                            {currentStep !== steps.length - 1 && <ChevronRight size={18} className="ml-1" />}
                        </Button>
                    </div>

                    <button 
                        onClick={handleComplete}
                        className="mt-6 text-xs font-semibold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                    >
                        Skip Tour
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default OnboardingGuide;
