import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary-dark">SafeSpeak+</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                        Features
                    </button>
                    <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                        How It Works
                    </button>
                    <button onClick={() => scrollToSection('security')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                        Security
                    </button>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button>Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg animate-slide-in-down">
                    <div className="p-4 flex flex-col space-y-4">
                        <button onClick={() => scrollToSection('features')} className="text-left text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-left text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                            How It Works
                        </button>
                        <button onClick={() => scrollToSection('security')} className="text-left text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                            Security
                        </button>
                        <div className="h-px bg-gray-100 my-2" />
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">Login</Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full">Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
