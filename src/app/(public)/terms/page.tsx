export const metadata = {
    title: "Terms of Service | Prayaas",
    description: "Terms of Service for Prayaas IIIT Allahabad",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white text-(--ngo-dark)">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Terms of Service
                    </h1>
                    <p className="text-gray-600 text-sm">Last updated: {new Date().toISOString().split("T")[0]}</p>
                </div>

                <div className="space-y-8 text-lg leading-relaxed text-(--ngo-gray)">
                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">1. Acceptance of terms</h2>
                        <p>
                            By accessing or using the Prayaas website, you agree to these Terms of Service. If you do not agree,
                            please do not use the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">2. About Prayaas</h2>
                        <p>
                            Prayaas is a student-run initiative at IIIT Allahabad focused on educational and community programs for
                            underprivileged children. The site shares information about our work and provides ways to connect or
                            participate.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">3. Eligibility</h2>
                        <p>
                            You must be at least 13 years old to use this site. By using the site, you represent that you meet this
                            requirement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">4. Accounts and access</h2>
                        <p>
                            Certain areas (e.g., admin dashboard) may require authentication. You are responsible for maintaining the
                            confidentiality of your credentials and for all activities under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">5. Acceptable use</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Do not interfere with site security or operation.</li>
                            <li>Do not misuse forms, send spam, or attempt unauthorized access.</li>
                            <li>Do not submit unlawful, defamatory, or infringing content.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">6. Content ownership</h2>
                        <p>
                            Site content is owned by Prayaas or its licensors and protected by applicable laws. You may not reuse or
                            redistribute content without permission, except for personal, non-commercial use with proper attribution.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">7. Donations</h2>
                        <p>
                            Donation links may direct you to third-party processors. Those transactions are governed by the processor&apos;s
                            terms and privacy policy. Prayaas does not store or process payment details on this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">8. Third-party links</h2>
                        <p>
                            Our site may contain links to third-party sites. We are not responsible for their content or practices.
                            Use third-party sites at your own discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">9. Disclaimers</h2>
                        <p>
                            The site is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not guarantee that
                            the site will be uninterrupted, secure, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">10. Limitation of liability</h2>
                        <p>
                            To the fullest extent permitted by law, Prayaas and its student volunteers will not be liable for any
                            indirect, incidental, special, consequential, or punitive damages arising from your use of the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">11. Indemnity</h2>
                        <p>
                            You agree to indemnify and hold Prayaas and its members harmless from any claims arising out of your use of
                            the site or violation of these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">12. Termination</h2>
                        <p>
                            We may suspend or terminate access to the site at any time if we believe you have violated these terms or
                            to protect site integrity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">13. Governing law</h2>
                        <p>
                            These terms are governed by the laws of India, without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">14. Changes to terms</h2>
                        <p>
                            We may update these terms periodically. Continued use of the site after changes take effect means you
                            accept the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-(--ngo-dark) mb-3">15. Contact</h2>
                        <p>
                            For questions about these terms, contact us at <a className="text-(--ngo-orange)" href="mailto:prayaas@iiita.ac.in">prayaas@iiita.ac.in</a>.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}
