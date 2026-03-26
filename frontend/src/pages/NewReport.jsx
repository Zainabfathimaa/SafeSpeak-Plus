import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { StepIndicator } from '../components/ReportWizard/StepIndicator';
import { Step1Type } from '../components/ReportWizard/Step1Type';
import { Step2Details } from '../components/ReportWizard/Step2Details';
import { Step3Evidence } from '../components/ReportWizard/Step3Evidence';
import { Step4Review } from '../components/ReportWizard/Step4Review';
import toastService from '../services/toastService';

export default function NewReport() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        incidentType: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: '',
        description: '',
        department: '',
        course: '',
        involvedParties: '',
        files: []
    });

    const steps = ['Type & Location', 'Details', 'Evidence', 'Review'];

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        // Basic validation
        if (currentStep === 1 && (!formData.incidentType || !formData.date || !formData.location)) {
            toastService.error("Please fill in all required fields.");
            return;
        }
        if (currentStep === 2 && !formData.description) {
            toastService.error("Please provide a description.");
            return;
        }

        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { createReport } = await import('../services/reportService');
            // Transform form data to match backend expectation
            const payload = {
                incidentType: formData.incidentType,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                description: formData.description,
                department: formData.department || 'General',
                course: formData.course || null,
                involvedParties: formData.involvedParties,
                files: formData.files
            };

            const response = await createReport(payload);

            if (response.success) {
                toastService.success('Your report has been submitted successfully. Thank you for contributing to a safer campus environment.');
                setTimeout(() => {
                    navigate('/report-status');
                }, 1500);
            } else {
                toastService.error("Failed to submit report: " + response.message);
            }
        } catch (error) {
            console.error(error);
            toastService.error("An error occurred while submitting the report.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background text-text-primary">
            {/* Header */}
            <Header />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Report an Incident</h1>
                            <p className="text-text-secondary mt-2">
                                Your safety is our priority. Please provide as much detail as possible.
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <StepIndicator currentStep={currentStep} steps={steps} />
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[400px]">
                            {currentStep === 1 && <Step1Type formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 2 && <Step2Details formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 3 && <Step3Evidence formData={formData} updateFormData={updateFormData} />}
                            {currentStep === 4 && <Step4Review formData={formData} />}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                            ${currentStep === 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'}`}
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Back
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
                                >
                                    Next Step
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105
                                ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                    {!isSubmitting && <Save className="w-5 h-5 ml-2" />}
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
}
