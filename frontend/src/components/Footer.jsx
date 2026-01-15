import React from 'react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-text-secondary">
                <p className="mb-4">&copy; {new Date().getFullYear()} SafeSpeak+. All rights reserved.</p>
                <div className="flex justify-center space-x-6 text-sm">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                </div>
            </div>
        </footer>
    );
}
