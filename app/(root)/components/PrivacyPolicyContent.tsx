import Link from "next/link";
import Image from "next/image";

const PrivacyPolicyContent = () => {
  return (
    <div>
      <div className="bg-amber-50 rounded-b-lg max-h-[50vh] flex flex-col">
        {/* Content */}
        <div className="max-w-7xl p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                1. Introduction
              </h3>
              <p className="text-gray-700 mb-3">
                Welcome to Toolin' Around ("we," "our," or "us"). We are
                committed to protecting your privacy and ensuring you have a
                positive experience using our tool-sharing platform. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our service.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                2. Information We Collect
              </h3>
              <p className="text-gray-700 mb-2">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
                <li>
                  Account information (name, email address, password, phone
                  number)
                </li>
                <li>Profile information (location, profile photo, bio)</li>
                <li>
                  Tool listings (descriptions, photos, availability, pricing)
                </li>
                <li>Transaction and booking information</li>
                <li>Communications between users through our platform</li>
                <li>
                  Payment information (processed securely through third-party
                  payment processors)
                </li>
              </ul>
              <p className="text-gray-700">
                We also automatically collect certain information about your
                device and how you interact with our service, including IP
                address, browser type, operating system, pages visited, and
                usage patterns.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                3. How We Use Your Information
              </h3>
              <p className="text-gray-700 mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Provide, maintain, and improve our tool-sharing platform
                </li>
                <li>Process transactions and send related notifications</li>
                <li>
                  Facilitate communication between tool owners and borrowers
                </li>
                <li>
                  Send you updates, newsletters, and promotional materials (you
                  can opt-out anytime)
                </li>
                <li>Verify your identity and prevent fraud</li>
                <li>
                  Respond to your comments, questions, and customer service
                  requests
                </li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                4. Information Sharing and Disclosure
              </h3>
              <p className="text-gray-700 mb-3">
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  <strong>Other Users:</strong> Your profile information and
                  tool listings are visible to other users to facilitate tool
                  sharing
                </li>
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who
                  perform services on our behalf (payment processing, hosting,
                  analytics)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with any
                  merger, sale of assets, or acquisition
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                5. Data Security
              </h3>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                6. Your Rights and Choices
              </h3>
              <p className="text-gray-700 mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Access and update your account information at any time</li>
                <li>Request deletion of your account and personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of the personal data we hold about you</li>
                <li>
                  Object to or restrict certain processing of your information
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                7. Cookies and Tracking
              </h3>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to enhance your
                experience, analyze usage, and deliver personalized content. You
                can control cookies through your browser settings, but disabling
                them may affect functionality.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                8. Children's Privacy
              </h3>
              <p className="text-gray-700">
                Our service is not intended for users under the age of 18. We do
                not knowingly collect personal information from children under
                18. If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                9. Changes to This Privacy Policy
              </h3>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date. Your continued
                use of the service after changes constitutes acceptance of the
                updated policy.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                10. Contact Us
              </h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                <Link
                  href="mailto:fakenamedev@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@fakenamedev.com
                </Link>
              </p>
              <div className="mt-4 text-end">
                <Image
                  src="/logos/ta-wht.png"
                  alt="Toolin' Around Logo"
                  width={300}
                  height={300}
                  className="w-10 h-10 rounded-lg"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
