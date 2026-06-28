// ─── Content-Aware Image Library ──────────────────────────────────────────────
//
// Replaces imported WordPress images with curated, topically relevant Unsplash
// photos. Selection is deterministic: same slug + section index always returns
// the same image (no random flicker on re-render or SSR).
//
// Usage:
//   import { getSectionImage } from "@/lib/page-images";
//   const img = getSectionImage("physician-advertising", 0, "What We Do");
//   // → { src: "https://images.unsplash.com/…", alt: "Medical professional…" }

export interface CuratedImage {
  src: string;
  alt: string;
}

// ─── Photo pools by topic ──────────────────────────────────────────────────────
// All URLs use Unsplash CDN with stable photo IDs.
// Format: ?auto=format&fit=crop&w=900&q=80 for consistent presentation.

const POOLS: Record<string, CuratedImage[]> = {
  // ── SEO / Organic Search ───────────────────────────────────────────────────
  seo: [
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      alt: "Analytics dashboard showing organic traffic growth",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Laptop displaying SEO metrics and keyword rankings",
    },
    {
      src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=900&q=80",
      alt: "Data visualisation and search analytics charts",
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80",
      alt: "Professional reviewing SEO audit and search data",
    },
    {
      src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
      alt: "Digital marketing dashboard with SEO performance metrics",
    },
    {
      src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=900&q=80",
      alt: "Team reviewing website analytics and search engine results",
    },
  ],

  // ── Link Building ──────────────────────────────────────────────────────────
  linkbuilding: [
    {
      src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=900&q=80",
      alt: "Network connections representing authority and backlinks",
    },
    {
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      alt: "Digital outreach and link building strategy planning",
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      alt: "Domain authority growth and backlink analytics dashboard",
    },
    {
      src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      alt: "Digital PR and editorial outreach for link acquisition",
    },
    {
      src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=900&q=80",
      alt: "Authority and ranking growth charts for link building campaigns",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "SEO specialist reviewing backlink profile and organic growth",
    },
  ],

  // ── PPC / Google Ads ───────────────────────────────────────────────────────
  ppc: [
    {
      src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80",
      alt: "PPC campaign dashboard showing ad performance metrics",
    },
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Digital advertising strategy and campaign planning",
    },
    {
      src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      alt: "Google Ads management and conversion tracking analytics",
    },
    {
      src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
      alt: "Paid advertising dashboard with ROI and cost-per-click data",
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      alt: "Campaign optimisation and conversion funnel analytics",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Marketing specialist analysing paid search campaign results",
    },
  ],

  // ── Content Marketing ──────────────────────────────────────────────────────
  content: [
    {
      src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      alt: "Content strategy and editorial planning workflow",
    },
    {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
      alt: "Content creator working on blog and digital marketing material",
    },
    {
      src: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=900&q=80",
      alt: "Editorial team planning content calendar and publishing workflow",
    },
    {
      src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
      alt: "Reading and researching for content marketing strategy",
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80",
      alt: "Digital publishing and content production pipeline",
    },
    {
      src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=900&q=80",
      alt: "Content marketing team reviewing performance and engagement data",
    },
  ],

  // ── Social Media Marketing ─────────────────────────────────────────────────
  social: [
    {
      src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=900&q=80",
      alt: "Social media marketing and engagement analytics",
    },
    {
      src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80",
      alt: "Social media content creation and brand engagement",
    },
    {
      src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80",
      alt: "Social media analytics dashboard showing follower growth",
    },
    {
      src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
      alt: "Community management and social media strategy planning",
    },
    {
      src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      alt: "Social media advertising campaigns on Facebook and Instagram",
    },
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Digital marketing strategy meeting for social media campaigns",
    },
  ],

  // ── Healthcare Marketing (general) ─────────────────────────────────────────
  healthcare: [
    {
      src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
      alt: "Healthcare professional in a modern medical environment",
    },
    {
      src: "https://images.unsplash.com/photo-1530497610245-768d60fcf09c?auto=format&fit=crop&w=900&q=80",
      alt: "Modern clinical environment with advanced medical technology",
    },
    {
      src: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=900&q=80",
      alt: "Healthcare facility reception and patient engagement area",
    },
    {
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80",
      alt: "Medical team collaborating in a hospital setting",
    },
    {
      src: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=900&q=80",
      alt: "Digital health marketing analytics and patient acquisition data",
    },
    {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
      alt: "Healthcare branding and patient communication strategy",
    },
  ],

  // ── Physician Advertising ──────────────────────────────────────────────────
  physician: [
    {
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
      alt: "Physician consultation in a professional medical office",
    },
    {
      src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
      alt: "Medical professional reviewing patient records digitally",
    },
    {
      src: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80",
      alt: "Doctor in a modern clinic providing specialist care",
    },
    {
      src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=80",
      alt: "Specialist physician advertising and patient acquisition strategy",
    },
    {
      src: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=900&q=80",
      alt: "Medical clinic digital marketing analytics and growth metrics",
    },
    {
      src: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=80",
      alt: "Modern medical practice with advanced clinical facilities",
    },
  ],

  // ── Hospital Marketing ─────────────────────────────────────────────────────
  hospital: [
    {
      src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80",
      alt: "Modern hospital facility with state-of-the-art medical equipment",
    },
    {
      src: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=900&q=80",
      alt: "Hospital reception and patient services area",
    },
    {
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80",
      alt: "Medical team in a hospital environment providing patient care",
    },
    {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
      alt: "Hospital digital marketing and patient outreach strategy",
    },
    {
      src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
      alt: "Healthcare specialist in a hospital setting",
    },
    {
      src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
      alt: "Advanced hospital facilities and clinical operations",
    },
  ],

  // ── Hospitality / Hotels ───────────────────────────────────────────────────
  hospitality: [
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      alt: "Luxury hotel room with premium furnishings and modern design",
    },
    {
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
      alt: "Resort swimming pool with stunning views and luxury amenities",
    },
    {
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
      alt: "Hotel lobby with elegant decor and professional hospitality service",
    },
    {
      src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
      alt: "Luxury resort destination with world-class facilities",
    },
    {
      src: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80",
      alt: "Premium travel experience and hospitality destination marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      alt: "Hotel marketing strategy for direct booking and revenue growth",
    },
  ],

  // ── Legal Marketing ────────────────────────────────────────────────────────
  legal: [
    {
      src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
      alt: "Law office library with legal references and professional environment",
    },
    {
      src: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=900&q=80",
      alt: "Legal professional providing expert consultation in a law firm",
    },
    {
      src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
      alt: "Justice and legal framework for law firm digital marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=900&q=80",
      alt: "Attorney reviewing case strategy in a professional legal setting",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
      alt: "Senior legal professional with expertise in client acquisition",
    },
    {
      src: "https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=900&q=80",
      alt: "Law firm branding and digital marketing strategy",
    },
  ],

  // ── Real Estate Marketing ──────────────────────────────────────────────────
  realestate: [
    {
      src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
      alt: "Luxury property development with premium residential design",
    },
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
      alt: "Modern commercial building for real estate marketing campaigns",
    },
    {
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
      alt: "Luxury residential property for high-net-worth buyer marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
      alt: "Real estate exterior photography for property marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=900&q=80",
      alt: "Property development landscape and architectural marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
      alt: "Modern real estate development and construction project",
    },
  ],

  // ── Financial Services Marketing ───────────────────────────────────────────
  financial: [
    {
      src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
      alt: "Financial analytics dashboard showing investment and growth data",
    },
    {
      src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",
      alt: "Investment growth and financial planning strategy",
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      alt: "Financial marketing analytics and client acquisition metrics",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Financial services professional reviewing digital marketing data",
    },
    {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
      alt: "Banking and financial services digital marketing strategy",
    },
    {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
      alt: "Fintech and financial services growth marketing",
    },
  ],

  // ── Education Marketing ────────────────────────────────────────────────────
  education: [
    {
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
      alt: "University campus with students and educational facilities",
    },
    {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
      alt: "Students learning in a modern educational environment",
    },
    {
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
      alt: "Academic library and educational resources for student marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1434030216411-0b793f4b6f1a?auto=format&fit=crop&w=900&q=80",
      alt: "Education marketing strategy for student enrolment campaigns",
    },
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      alt: "Collaborative academic environment for higher education marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
      alt: "Educational institution student acquisition and digital outreach",
    },
  ],

  // ── eCommerce / Retail ─────────────────────────────────────────────────────
  ecommerce: [
    {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
      alt: "Online shopping experience and ecommerce conversion strategy",
    },
    {
      src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80",
      alt: "Retail store with premium product display and merchandising",
    },
    {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
      alt: "eCommerce analytics and digital retail performance dashboard",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "eCommerce marketing strategy for product sales and growth",
    },
    {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
      alt: "Digital commerce team optimising online store performance",
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80",
      alt: "Online retail growth analytics and conversion optimisation",
    },
  ],

  // ── Web Design / Development ───────────────────────────────────────────────
  webdesign: [
    {
      src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80",
      alt: "Web development code and UI design on dual monitors",
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      alt: "UX designer creating a modern website interface and wireframes",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Professional web designer reviewing responsive website on laptop",
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80",
      alt: "Modern website analytics and performance metrics dashboard",
    },
    {
      src: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80",
      alt: "Web designer working on website user experience and UI design",
    },
    {
      src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80",
      alt: "UI/UX design process for high-conversion website creation",
    },
  ],

  // ── Home Services / Contractors ────────────────────────────────────────────
  homeservices: [
    {
      src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80",
      alt: "Home improvement contractor performing professional services",
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
      alt: "Modern home renovation project with quality craftsmanship",
    },
    {
      src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      alt: "Professional contractor with tools for home services work",
    },
    {
      src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
      alt: "Home interior with premium finishes for services marketing",
    },
    {
      src: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80",
      alt: "HVAC and home services professional providing expertise",
    },
    {
      src: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80",
      alt: "Professional home services team ready to assist clients",
    },
  ],

  // ── Email Marketing ────────────────────────────────────────────────────────
  email: [
    {
      src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      alt: "Email marketing campaign dashboard with open rates and CTR metrics",
    },
    {
      src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
      alt: "Email automation workflow and subscriber engagement analytics",
    },
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Email marketing strategy planning and campaign management",
    },
    {
      src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      alt: "Digital communications and email marketing performance",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Marketing professional reviewing email campaign results",
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80",
      alt: "Email list management and subscriber segmentation analytics",
    },
  ],

  // ── General Digital Marketing (fallback) ──────────────────────────────────
  marketing: [
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Digital marketing strategy session with growth analytics",
    },
    {
      src: "https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=900&q=80",
      alt: "Marketing team collaborating on campaign strategy and execution",
    },
    {
      src: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=900&q=80",
      alt: "Professional marketing team reviewing campaign performance data",
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      alt: "Marketing analytics dashboard showing growth and conversions",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Business growth strategy with digital marketing insights",
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80",
      alt: "Data-driven marketing campaign reporting and performance review",
    },
  ],
};

// ─── Slug → primary pool mapping ──────────────────────────────────────────────

const SLUG_POOL_MAP: Record<string, string> = {
  // SEO
  "link-building": "linkbuilding",
  "on-page-seo": "seo",
  "seo-services": "seo",
  "technical-seo": "seo",
  "local-seo": "seo",
  "seo-dubai": "seo",
  "seo-agency": "seo",
  "organic-seo": "seo",
  "search-engine-optimisation": "seo",

  // PPC / Google Ads
  "google-adwords-management": "ppc",
  "google-ads": "ppc",
  "ppc-management": "ppc",
  "pay-per-click": "ppc",
  "facebook-advertising": "social",
  "instagram-advertising": "social",
  "social-media-advertising": "social",

  // Content
  "content-marketing": "content",
  "blog-writing": "content",
  "copywriting": "content",
  "content-strategy": "content",

  // Social
  "social-media-marketing": "social",
  "social-media-management": "social",
  "social-media": "social",

  // Healthcare
  "physician-advertising": "physician",
  "doctor-marketing": "physician",
  "medical-marketing": "healthcare",
  "healthcare-marketing": "healthcare",
  "hospital-advertising": "hospital",
  "hospital-marketing": "hospital",
  "medical-advertising": "healthcare",
  "clinic-marketing": "healthcare",
  "dental-marketing": "healthcare",
  "dentist-advertising": "healthcare",

  // Hospitality
  "hotel-advertising": "hospitality",
  "hotel-marketing": "hospitality",
  "restaurant-marketing": "hospitality",
  "tourism-marketing": "hospitality",
  "hospitality-marketing": "hospitality",
  "travel-marketing": "hospitality",

  // Legal
  "lawyers-advertising": "legal",
  "law-firm-marketing": "legal",
  "legal-marketing": "legal",
  "attorney-marketing": "legal",
  "legal-advertising": "legal",

  // Real Estate
  "real-estate-marketing": "realestate",
  "property-marketing": "realestate",
  "real-estate-advertising": "realestate",

  // Financial
  "financial-marketing-agency": "financial",
  "finance-marketing": "financial",
  "banking-marketing": "financial",
  "insurance-marketing": "financial",

  // Education
  "education-marketing": "education",
  "school-marketing": "education",
  "university-marketing": "education",

  // eCommerce
  "ecommerce-marketing": "ecommerce",
  "online-store-marketing": "ecommerce",
  "retail-marketing": "ecommerce",

  // Web Design
  "web-design": "webdesign",
  "website-design": "webdesign",
  "web-development": "webdesign",
  "website-development": "webdesign",

  // Home Services
  "home-services-marketing": "homeservices",
  "contractor-marketing": "homeservices",

  // Email
  "email-marketing": "email",
};

// ─── Section heading → pool override mapping ───────────────────────────────────

const HEADING_OVERRIDES: Array<[RegExp, string]> = [
  [/seo|search engine|organic|ranking|keyword|backlink|link.build/i, "seo"],
  [/ppc|google.ad|adword|pay.per.click|paid.search|campaign/i, "ppc"],
  [/content.market|blog|editorial|publish|copywrite/i, "content"],
  [/social.media|facebook|instagram|linkedin|twitter|tiktok/i, "social"],
  [/physician|doctor|specialist|medical.profess/i, "physician"],
  [/hospital|clinic|healthcare|patient|health.service/i, "healthcare"],
  [/hotel|resort|restaurant|hospitality|tourism|travel|booking/i, "hospitality"],
  [/lawyer|attorney|law.firm|legal/i, "legal"],
  [/real.estate|property|housing|commercial.build/i, "realestate"],
  [/financial|finance|banking|invest|insurance/i, "financial"],
  [/education|school|university|college|student/i, "education"],
  [/ecommerce|online.shop|retail|product/i, "ecommerce"],
  [/web.design|website|ui.ux|development|responsive/i, "webdesign"],
  [/email.market|newsletter|automation|drip/i, "email"],
];

// ─── Public API ────────────────────────────────────────────────────────────────

/** Returns the primary image pool name for a given page slug. */
export function getPoolForSlug(slug: string): string {
  return SLUG_POOL_MAP[slug] ?? "marketing";
}

/** Returns a pool override for a section heading, or null. */
function getPoolForHeading(heading: string): string | null {
  for (const [pattern, pool] of HEADING_OVERRIDES) {
    if (pattern.test(heading)) return pool;
  }
  return null;
}

/**
 * Deterministically select a curated image for a content section.
 *
 * @param slug        — page slug (e.g. "physician-advertising")
 * @param sectionIdx  — 0-based index of the section on the page
 * @param heading     — the section's h2 text (used for topic override)
 */
export function getSectionImage(
  slug: string,
  sectionIdx: number,
  heading: string
): CuratedImage {
  // Heading-level override takes priority (e.g. an SEO section on a legal page)
  const poolName = getPoolForHeading(heading) ?? getPoolForSlug(slug);
  const pool = POOLS[poolName] ?? POOLS.marketing;

  // Deterministic pick: cycle through the pool
  return pool[sectionIdx % pool.length]!;
}

/** Returns the entire curated pool for a given page slug (for advanced usage). */
export function getPageImagePool(slug: string): CuratedImage[] {
  const poolName = getPoolForSlug(slug);
  return POOLS[poolName] ?? POOLS.marketing;
}
