import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="p-4 bg-red-50 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">Page Not Found</h1>
            <p className="text-text-secondary mb-8 max-w-md">
                The page you are looking for doesn't exist or has been moved.
                Please check the URL or return to the homepage.
            </p>
            <Link to="/">
                <Button size="lg" className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Return Home
                </Button>
            </Link>
        </div>
    );
}
