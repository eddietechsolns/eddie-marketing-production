import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Eddie Marketing Solutions FZE. Learn how we collect, use, and protect your personal data.",
  path: "/privacy",
});

const LAST_UPDATED = "1 January 2025";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-700">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-p:leading-7">

        <p>
          Eddie Marketing Solutions FZE (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the website
          at <strong>eddietechsolns.com</strong>. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website or use our services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect personal information you voluntarily provide when you fill in a contact form, request a proposal,
          or subscribe to our newsletter. This includes name, email address, phone number, company name, and any message
          content you submit.
        </p>
        <p>
          We also automatically collect certain technical data via cookies and analytics tools, including IP address,
          browser type, pages visited, and time spent on site.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Respond to enquiries and deliver requested services</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Cookies &amp; Analytics</h2>
        <p>
          We use Google Analytics 4 to understand website traffic. This tool collects anonymised usage data. You can
          opt out of Google Analytics by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-Out Browser Add-on
          </a>.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share data with trusted
          service providers (e.g. email platforms, CRM tools) who assist us in operating our business, subject to
          confidentiality agreements.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain personal data only as long as necessary for the purpose it was collected or as required by law.
          You may request deletion of your data at any time by contacting us.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data,
          or to object to its processing. To exercise these rights, please contact us at{" "}
          <a href="mailto:info@eddietechsolns.com">info@eddietechsolns.com</a>.
        </p>

        <h2>7. Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information. However, no method of
          internet transmission is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of significant changes by posting a notice
          on our website. Your continued use of the site after changes constitutes acceptance of the revised policy.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          <strong>Eddie Marketing Solutions FZE</strong><br />
          Dubai, United Arab Emirates<br />
          <a href="mailto:info@eddietechsolns.com">info@eddietechsolns.com</a>
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 flex gap-4 flex-wrap">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Home
        </Link>
        <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Terms of Service →
        </Link>
      </div>
    </div>
  );
}
