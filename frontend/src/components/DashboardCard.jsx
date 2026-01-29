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
 */
export function DashboardCard({ icon: Icon, title, description, buttonText, to }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            </div>
            {description && <p className="text-sm text-text-secondary mb-4">{description}</p>}
            <Link to={to} className="mt-auto self-start">
                <Button>{buttonText}</Button>
            </Link>
        </div>
    );
}
