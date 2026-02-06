import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { Button } from './ui/Button';

export function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Placeholder logout logic – to be replaced with real auth handling
        // For now simply navigate to login page
        navigate('/login');
    };

    return (
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary-dark">SafeSpeak+</span>
                </Link>
                <h1 className="text-lg font-semibold text-text-primary">User Dashboard</h1>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-1">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
        </nav>
    );
}
