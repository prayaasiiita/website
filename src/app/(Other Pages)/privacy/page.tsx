export const metadata = {
    title: "Privacy Policy | Prayaas",
    description: "Privacy Policy for Prayaas IIIT Allahabad",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white text-(--ngo-dark)">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 md:pt-32">
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 text-sm">Last updated: {new Date().toISOString().split("T")[0]}</p>
                </div>

                <div className="space-y-8 text-base sm:text-lg leading-relaxed text-(--ngo-gray)">
                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">1. Who we are</h2>
                        <p>
                            Prayaas is a student-run initiative at IIIT Allahabad committed to providing educational support
                            and community programs for underprivileged children. This policy explains how we handle your
                            information when you interact with our website or initiatives.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">2. Information we collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Contact details (name, email, phone) when you reach out or submit forms.</li>
                            <li>Messages or inquiries you send us.</li>
                            <li>Donation intent info you choose to share (we do not process payments on this site).</li>
                            <li>Technical data such as IP address, browser type, device info, and basic analytics (non-identifying).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">3. How we use information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To respond to your inquiries and coordinate volunteer or program participation.</li>
                            <li>To improve site performance and user experience.</li>
                            <li>To share updates about Prayaas activities where you have requested them.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">4. Sharing and disclosure</h2>
                        <p>
                            We do not sell or rent personal data. We may share minimal information with trusted service providers
                            (e.g., hosting, analytics, email) who operate under confidentiality obligations, and only as needed to
                            run the site or communicate with you. We may disclose information if required by law or to protect our
                            rights and the safety of users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">5. Cookies and analytics</h2>
                        <p>
                            We may use cookies or similar technologies to keep the site reliable and to understand aggregate usage.
                            You can adjust your browser settings to refuse cookies, though some features may not function optimally.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">6. Data retention</h2>
                        <p>
                            We retain personal information only as long as necessary for the purposes described above or as required
                            by law. When no longer needed, data is deleted or anonymized.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">7. Your choices</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You may request access, correction, or deletion of your personal information.</li>
                            <li>You can opt out of non-essential communications at any time.</li>
                            <li>Disable cookies in your browser if you prefer not to be tracked for analytics.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">8. Security</h2>
                        <p>
                            We use reasonable technical and organizational safeguards to protect information. However, no website or
                            internet transmission is completely secure, so we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">9. Children&apos;s privacy</h2>
                        <p>
                            Our site is intended for volunteers, donors, and supporters. We do not knowingly collect personal
                            information from children under 13. If you believe a child has provided personal data, please contact us
                            so we can delete it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">10. Changes to this policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Material changes will be noted by updating the
                            effective date at the top of this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold text-(--ngo-dark) mb-3">11. Contact</h2>
                        <p>
                            For questions or requests about this policy, contact us at <a className="text-(--ngo-orange) hover:underline" href="mailto:prayaas@iiita.ac.in">prayaas@iiita.ac.in</a>.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}
