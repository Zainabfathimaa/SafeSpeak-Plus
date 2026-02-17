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
        <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            {/* Colored Top Border Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-${color}`}></div>

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {/* Icon with background bubble */}
                    {Icon && (
                        <div className={`p-3 rounded-xl bg-${color}/10 text-${color} group-hover:bg-${color}/20 transition-colors`}>
                            <Icon className="h-6 w-6" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
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

            <Link to={to} className="mt-auto w-full">
                <Button className="w-full justify-center shadow-none hover:shadow-md transition-all" variant="outline">
                    {buttonText}
                </Button>
            </Link>
        </div>
    );
}
