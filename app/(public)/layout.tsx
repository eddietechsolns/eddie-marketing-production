import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, webSiteSchema } from "@/lib/schema";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[organizationSchema(), webSiteSchema()]} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:ems-gradient-bg focus:text-white focus:text-sm focus:font-semibold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
