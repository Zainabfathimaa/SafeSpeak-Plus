import React from 'react';
import { Check } from 'lucide-react';

export function StepIndicator({ currentStep, steps }) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center bg-background px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                    ${isCompleted ? 'bg-primary border-primary text-white' :
                                        isCurrent ? 'bg-white border-primary text-primary' : 'bg-white border-gray-300 text-gray-400'}
                `}
                            >
                                {isCompleted ? <Check className="w-6 h-6" /> : <span className="font-semibold">{stepNum}</span>}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${isCurrent ? 'text-primary' : 'text-text-secondary'}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
