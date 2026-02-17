import React from 'react';

export function StatusBadge({ status }) {
    const colors = {
        open: 'bg-blue-100 text-blue-700 border-blue-200',
        'in-review': 'bg-purple-100 text-purple-700 border-purple-200',
        'in-progress': 'bg-cyan-100 text-cyan-700 border-cyan-200',
        resolved: 'bg-green-100 text-green-700 border-green-200',
        closed: 'bg-gray-100 text-gray-700 border-gray-200',
        escalated: 'bg-orange-100 text-orange-700 border-orange-200'
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colors[status?.toLowerCase()] || colors.open}`}>
            {status?.replace('-', ' ').charAt(0).toUpperCase() + status?.slice(1).replace('-', ' ') || 'Unknown'}
        </span>
    );
}
