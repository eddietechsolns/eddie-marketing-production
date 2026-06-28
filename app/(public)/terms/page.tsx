import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Eddie Marketing Solutions FZE. Read our terms and conditions for using our digital marketing services.",
  path: "/terms",
});

const LAST_UPDATED = "1 January 2025";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-700">Terms of Service</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-p:leading-7">

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the website at <strong>eddietechsolns.com</strong> and any
          services provided by Eddie Marketing Solutions FZE (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
          By accessing this site or engaging our services, you agree to these Terms.
        </p>

        <h2>1. Services</h2>
        <p>
          We provide digital marketing services including SEO, Google Ads management, social media marketing,
          web design, content marketing, email marketing, and related consultancy. The scope, deliverables, and
          fees for each engagement are defined in a separate Service Agreement or Statement of Work.
        </p>

        <h2>2. Use of Website</h2>
        <p>
          You agree not to use this website for any unlawful purpose or in any way that could damage, disable,
          or impair the site. You may not attempt to gain unauthorised access to any part of the site or its
          related systems.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this website — including text, graphics, logos, and software — is the property of
          Eddie Marketing Solutions FZE and protected by applicable intellectual property laws. You may not
          reproduce, distribute, or create derivative works without our express written consent.
        </p>

        <h2>4. Client Work &amp; Confidentiality</h2>
        <p>
          Work produced for clients remains confidential until mutually agreed for publication (e.g. case studies,
          portfolio items). We will not disclose client data to third parties without consent, except as required
          by law.
        </p>

        <h2>5. Disclaimers</h2>
        <p>
          This website is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee specific
          marketing outcomes, as results depend on many factors outside our control including market conditions,
          competition, and algorithm changes by third-party platforms.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Eddie Marketing Solutions FZE shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of this website or our services.
        </p>

        <h2>7. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the
          exclusive jurisdiction of the courts of Dubai, UAE.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Continued use of the website after changes
          are posted constitutes acceptance of the revised Terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:info@eddietechsolns.com">info@eddietechsolns.com</a>.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 flex gap-4 flex-wrap">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Home
        </Link>
        <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Privacy Policy →
        </Link>
      </div>
    </div>
  );
}
