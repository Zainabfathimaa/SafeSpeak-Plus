import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Footer() {
    return (
        <footer style={{ background: '#0F5156' }} className="text-white mt-auto">

            {/* Main Footer Body */}
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

                    {/* Brand */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-white/80" />
                            <span className="text-lg font-bold tracking-wide">SafeSpeak<span className="text-white/60">+</span></span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                            A secure, anonymous incident reporting platform for institutional use — ensuring accountability while protecting every voice.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-2 text-sm text-white/70">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-semibold">Legal</p>
                        <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
                        <Link to="/terms-of-use" className="hover:text-white transition-colors duration-200">Terms of Use</Link>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex flex-col gap-2 text-sm text-white/70">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-semibold">Compliance</p>
                        <span>Anonymous Reporting System</span>
                        <span>End-to-End Encrypted</span>
                        <span>Tamper-Proof Audit Trail</span>
                    </div>
                </div>
            </div>

            {/* Bottom Legal Bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} className="py-5">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                        <span>&copy; {new Date().getFullYear()} SafeSpeak+. All rights reserved.</span>
                        <span className="hidden md:inline text-white/25">|</span>
                        <span>Version 1.0</span>
                        <span className="hidden md:inline text-white/25">|</span>
                        <span>For authorised institutional use only.</span>
                    </div>
                    <div className="text-center md:text-right">
                        Developed by <span className="text-white/65 font-medium">Zainab Fathima, Mohammed Kamran Shahid &amp; Srinivasan V</span> &mdash; 2026
                    </div>
                </div>
            </div>

        </footer>
    );
}
