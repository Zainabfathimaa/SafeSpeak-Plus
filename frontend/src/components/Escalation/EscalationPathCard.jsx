import React from 'react';
import { ChevronRight } from 'lucide-react';

export function EscalationPathCard({ title, description, icon: Icon, onClick, colorClass, active }) {
    return (
        <div
            onClick={onClick}
            className={`relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 p-6 flex flex-col items-center text-center
        ${active
                    ? `border-${colorClass} bg-${colorClass}/5 shadow-md scale-[1.02]`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
      `}
        >
            <div className={`p-4 rounded-full mb-4 ${active ? `bg-${colorClass} text-white` : `bg-${colorClass}/10 text-${colorClass}`}`}>
                <Icon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-text-secondary mb-6">{description}</p>

            <button className={`mt-auto text-sm font-semibold flex items-center ${active ? `text-${colorClass}` : 'text-gray-400'}`}>
                Select Option <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            {active && (
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-${colorClass}`}></div>
            )}
        </div>
    );
}
