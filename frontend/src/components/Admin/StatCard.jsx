import React from 'react';

export function StatCard({ icon: Icon, title, value, subtitle, color = 'primary' }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">{title}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-2 rounded-lg bg-${color.split('-')[0]}-50 text-${color}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
