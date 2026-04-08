import React from 'react';
import { Shield } from 'lucide-react';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-3 text-sm">{children}</div>
    </div>
);

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5"
                        style={{ background: 'rgba(15,81,86,0.08)' }}>
                        <Shield className="w-6 h-6" style={{ color: '#0F5156' }} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                    <p className="text-sm text-gray-400">SafeSpeak+ &nbsp;|&nbsp; Effective Date: 1 April 2026 &nbsp;|&nbsp; Version 1.0</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-10">

                    <Section title="1. Introduction">
                        <p>
                            SafeSpeak+ is an anonymous incident reporting platform operated for use within the institution. This Privacy Policy explains how we collect, store, and protect information submitted through the platform.
                        </p>
                        <p>
                            By accessing or using SafeSpeak+, you agree to the practices described in this policy. If you do not agree, you should discontinue use of the platform and contact your institutional administrator.
                        </p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p>SafeSpeak+ collects two distinct categories of information:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>
                                <strong>Registration Information:</strong> Your institutional email address, used solely to verify that you are an authorised user and to generate your anonymous access code. This information is stored separately from your reports.
                            </li>
                            <li>
                                <strong>Report Content:</strong> Details of any incident you submit, including descriptions, supporting materials, and category classification. This content is stored without any link to your identity.
                            </li>
                            <li>
                                <strong>System Logs:</strong> Standard access logs for security and audit purposes, retained in accordance with institutional IT policy.
                            </li>
                        </ul>
                        <p>
                            We do not collect browsing history, cookies for advertising, or any data beyond what is operationally necessary to run the platform.
                        </p>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <p>Information collected is used exclusively for the following purposes:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>To verify institutional membership at registration and issue an anonymous access code.</li>
                            <li>To process, route, and track incident reports submitted through the platform.</li>
                            <li>To facilitate secure, anonymous communication between reporters and administrators.</li>
                            <li>To produce aggregated, non-identifiable analytics for institutional use.</li>
                            <li>To maintain an audit trail as required by institutional governance requirements.</li>
                        </ul>
                        <p>
                            Your data is not sold, shared with third parties for commercial purposes, or used for profiling.
                        </p>
                    </Section>

                    <Section title="4. Anonymity & Identity Protection">
                        <p>
                            SafeSpeak+ is designed so that your identity is structurally separated from your reports. Once your institutional email is verified and your anonymous code is issued, your email address is no longer associated with any subsequent activity on the platform.
                        </p>
                        <p>
                            Administrators and reviewers can only see report content and the anonymous code. No administrator has access to a mapping between codes and real identities. This design is enforced at the database level and cannot be circumvented through the administrative interface.
                        </p>
                        <p>
                            In exceptional circumstances — such as a credible threat to personal safety or a binding legal order — the institution's designated authority may initiate a formally governed identity disclosure process. Any such action is logged immutably and subject to institutional oversight.
                        </p>
                    </Section>

                    <Section title="5. Data Retention">
                        <p>
                            Report data is retained for a period not exceeding three years from the date of closure, unless a longer retention period is required by applicable law or institutional policy. Registration data (email addresses) is retained only for the duration of your active account and deleted upon account closure.
                        </p>
                        <p>
                            Audit log entries are retained for a minimum of five years in accordance with institutional governance standards.
                        </p>
                    </Section>

                    <Section title="6. Third-Party Services">
                        <p>
                            SafeSpeak+ does not integrate with third-party advertising networks, social media platforms, or analytics services that process personal data externally. All data processing occurs within the institution's hosted infrastructure.
                        </p>
                        <p>
                            Email delivery services used for OTP verification are configured to transmit only the minimum necessary data (recipient address and one-time code) and do not retain message content.
                        </p>
                    </Section>

                    <Section title="7. Your Rights">
                        <p>As a user of SafeSpeak+, you have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Request confirmation of what data is held about you.</li>
                            <li>Request correction of inaccurate registration information.</li>
                            <li>Request deletion of your account and associated registration data.</li>
                            <li>Withdraw from platform use at any time without consequence.</li>
                        </ul>
                        <p>
                            Because report content is stored anonymously, it cannot be linked back to you after submission — this is a deliberate privacy protection, not a limitation.
                        </p>
                    </Section>

                    <Section title="8. Contact">
                        <p>
                            For any queries relating to this Privacy Policy, data handling practices, or to exercise your rights, please contact the designated system administrator through your institution's official IT support channel.
                        </p>
                        <p>
                            This policy may be updated periodically. Continued use of the platform following any update constitutes acceptance of the revised policy.
                        </p>
                    </Section>

                </div>

                <p className="text-center text-xs text-gray-400 mt-8">&copy; {new Date().getFullYear()} SafeSpeak+. All rights reserved.</p>
            </div>
        </div>
    );
}
