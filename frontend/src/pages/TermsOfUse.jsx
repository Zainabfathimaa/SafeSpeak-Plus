import React from 'react';
import { FileText } from 'lucide-react';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-3 text-sm">{children}</div>
    </div>
);

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5"
                        style={{ background: 'rgba(15,81,86,0.08)' }}>
                        <FileText className="w-6 h-6" style={{ color: '#0F5156' }} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Use</h1>
                    <p className="text-sm text-gray-400">SafeSpeak+ &nbsp;|&nbsp; Effective Date: 1 April 2026 &nbsp;|&nbsp; Version 1.0</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-10">

                    <Section title="1. Acceptance of Terms">
                        <p>
                            By accessing or using SafeSpeak+ (the "Platform"), you confirm that you have read, understood, and agree to be bound by these Terms of Use. These terms apply to all users of the Platform, including reporters, reviewers, and administrators.
                        </p>
                        <p>
                            If you do not accept these terms in full, you must not use the Platform. Access is granted solely to authorised members of the institution.
                        </p>
                    </Section>

                    <Section title="2. Platform Purpose & Scope">
                        <p>
                            SafeSpeak+ is an internal, institutional platform designed to enable anonymous reporting of workplace incidents, grievances, policy violations, and related concerns. Its purpose is to facilitate accountability, provide a safe reporting channel, and support institutional governance.
                        </p>
                        <p>
                            The Platform is not a public service and is not intended for use outside the institution. Access by unauthorised individuals is prohibited.
                        </p>
                    </Section>

                    <Section title="3. Permitted Use">
                        <p>You may use SafeSpeak+ to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Register as an authorised user using your institutional email address.</li>
                            <li>Submit genuine incident reports relating to events within the institutional environment.</li>
                            <li>Track the status of your submitted reports.</li>
                            <li>Communicate with reviewers through the platform's anonymous messaging system.</li>
                        </ul>
                        <p>
                            All use of the Platform must be in good faith and in accordance with institutional policies.
                        </p>
                    </Section>

                    <Section title="4. User Obligations">
                        <p>As a registered user, you agree to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Keep your anonymous access code confidential and not share it with any other person.</li>
                            <li>Use the Platform only for its intended purpose of legitimate incident reporting.</li>
                            <li>Refrain from submitting false, misleading, or malicious reports.</li>
                            <li>Not attempt to identify or de-anonymise other users of the Platform.</li>
                            <li>Not attempt to circumvent, disable, or reverse-engineer any security feature of the Platform.</li>
                            <li>Report any suspected security vulnerability to the administrator promptly.</li>
                        </ul>
                    </Section>

                    <Section title="5. Report Submission Guidelines">
                        <p>
                            Reports submitted through SafeSpeak+ must relate to genuine incidents or concerns that fall within the scope of institutional policy. Users must not submit reports that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Contain false information or unsubstantiated allegations presented as fact.</li>
                            <li>Are intended to harass, intimidate, or harm any individual.</li>
                            <li>Are submitted repeatedly on the same matter without new information (duplicate reports).</li>
                            <li>Include content that is offensive, defamatory, or in violation of applicable law.</li>
                        </ul>
                        <p>
                            Submission of a report does not guarantee investigation. The institution reserves the right to categorise, prioritise, and close reports in accordance with its internal governance procedures.
                        </p>
                    </Section>

                    <Section title="6. Anonymity Disclaimer">
                        <p>
                            While SafeSpeak+ is designed to protect user anonymity through structural separation of identity and report data, the Platform does not provide an absolute legal guarantee of anonymity in all circumstances.
                        </p>
                        <p>
                            In cases involving credible threats to personal safety, ongoing criminal activity, or a binding legal order, the institution may initiate a formally governed disclosure process. Such actions are subject to institutional oversight and recorded in the audit log.
                        </p>
                        <p>
                            Users are advised not to include personally identifying information within the body of their reports if they wish to maintain anonymity.
                        </p>
                    </Section>

                    <Section title="7. Intellectual Property">
                        <p>
                            All software, design elements, and written content comprising SafeSpeak+ are the intellectual property of the development team and/or the institution. No part of the Platform may be reproduced, distributed, or adapted without express written permission.
                        </p>
                        <p>
                            Report content submitted by users remains the property of the submitting user; however, by submitting a report, users grant the institution a non-exclusive licence to process and act upon the information for the purposes described in the Privacy Policy.
                        </p>
                    </Section>

                    <Section title="8. Limitation of Liability">
                        <p>
                            SafeSpeak+ is provided on an "as-is" basis. To the fullest extent permitted by applicable law, the institution and the development team shall not be liable for any indirect, incidental, or consequential damages arising from:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Reliance on information submitted through the Platform.</li>
                            <li>Outcomes of institutional investigations initiated through the Platform.</li>
                            <li>Temporary unavailability of the Platform due to maintenance or technical issues.</li>
                        </ul>
                        <p>
                            The institution makes reasonable efforts to maintain the availability and security of the Platform but does not guarantee uninterrupted access.
                        </p>
                    </Section>

                    <Section title="9. Modifications">
                        <p>
                            These Terms of Use may be revised at any time. Users will be notified of significant changes through the Platform interface. Continued use of SafeSpeak+ following the publication of revised terms constitutes acceptance of the updated terms.
                        </p>
                        <p>
                            It is the responsibility of each user to review these terms periodically. The effective date at the top of this document reflects the most recent revision.
                        </p>
                    </Section>

                    <Section title="10. Governing Authority">
                        <p>
                            These Terms of Use are governed by the internal policies of the institution and, where applicable, the laws of India. Any dispute arising from the use of SafeSpeak+ shall first be addressed through the institution's internal grievance resolution process before any external recourse is sought.
                        </p>
                        <p>
                            For questions about these Terms of Use, please contact the designated system administrator through the institution's official IT support channel.
                        </p>
                    </Section>

                </div>

                <p className="text-center text-xs text-gray-400 mt-8">&copy; {new Date().getFullYear()} SafeSpeak+. All rights reserved.</p>
            </div>
        </div>
    );
}
