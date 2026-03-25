import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

/**
 * Reusable card for dashboard actions.
 * Props:
 *  - icon: React component (e.g., from lucide-react)
 *  - title: string
 *  - description: string (optional)
 *  - buttonText: string
 *  - to: route path string
 *  - color: string (optional tailwind color class for the top border, default 'primary')
 */
export function DashboardCard({ icon: Icon, title, description, buttonText, to, color = "primary" }) {
    // Map of color names to Tailwind classes if passing abstract names, or just use direct classes.
    // Simplifying: we'll assume color prop might pass a specific border class or we default to primary.
    // For now, let's just make it look good with a default premium look, and maybe vary slightly if needed.

    return (
        <div className="group glass-card p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden h-full">
            {/* Soft decorative background glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${color}/5 rounded-full blur-3xl group-hover:bg-${color}/10 transition-colors duration-500`} />
            
            {/* Colored Top Border Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-${color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {/* Icon with background bubble */}
                    {Icon && (
                        <div className={`p-3.5 rounded-2xl bg-${color}/10 text-${color} group-hover:bg-${color}/20 group-hover:scale-110 transition-all duration-300 shadow-inner`}>
                            <Icon className="h-6 w-6 drop-shadow-sm" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors tracking-tight">{title}</h2>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex-grow">
                {description ? (
                    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                ) : (
                    <p className="text-sm text-gray-400 italic">Manage your {title.toLowerCase()} here.</p>
                )}
            </div>

            <Link to={to} className="mt-auto w-full relative z-10">
                <Button
                    className={`w-full justify-center shadow-sm border-2 transition-all duration-300 font-bold
                    bg-white/50 text-${color} border-${color}/20 hover:bg-${color} hover:text-white hover:border-${color} hover:shadow-md`}
                >
                    {buttonText}
                </Button>
            </Link>
        </div>
    );
}
