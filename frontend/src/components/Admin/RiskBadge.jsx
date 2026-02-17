import React from 'react';

export function RiskBadge({ level }) {
    const colors = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        low: 'bg-green-100 text-green-700 border-green-200'
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colors[level?.toLowerCase()] || colors.low}`}>
            {level?.charAt(0).toUpperCase() + level?.slice(1) || 'Unknown'}
        </span>
    );
}
