import React from 'react';

export function StatCard({ icon: Icon, title, value, subtitle, color = 'primary' }) {
    return (
        <div className="glass-card p-5 group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex flex-col mb-2">
                <div>
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">{title}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                    {subtitle && (
                        <p className="text-[11px] text-slate-500 font-medium tracking-wide">{subtitle}</p>
                    )}
                    {Icon && (
                        <div className={`p-2.5 rounded-xl bg-${color.split('-')[0]}-50/50 text-${color} group-hover:bg-${color.split('-')[0]}-100 transition-colors shadow-inner`}>
                            <Icon className="h-5 w-5 drop-shadow-sm" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
