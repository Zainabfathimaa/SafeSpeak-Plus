import React from 'react';

export function Footer() {
    return (
        <footer className="bg-white border-t-4 border-primary py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-text-secondary">
                <p className="mb-4">&copy; {new Date().getFullYear()} SafeSpeak+. All rights reserved.</p>
                <div className="flex justify-center space-x-6 text-sm">
                    <span className="text-gray-500">Privacy Policy</span>
                    <span className="text-gray-500">Terms of Service</span>
                    <span className="text-gray-500">Contact IT Support</span>
                </div>
            </div>
        </footer>
    );
}
