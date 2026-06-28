// ─── Structured content data for UAE location pages ──────────────────────────

export interface LocationStat {
  value: string;
  label: string;
}

export interface LocationChallenge {
  title: string;
  description: string;
}

export interface LocationOpportunity {
  title: string;
  description: string;
}

export interface LocalSeoOpportunity {
  category: string;
  description: string;
  exampleKeywords: string[];
}

export interface LocationFAQ {
  question: string;
  answer: string;
}

export interface LocationContent {
  tagline: string;
  stats: LocationStat[];
  opportunities: LocationOpportunity[];
  challenges: LocationChallenge[];
  localSeo: LocalSeoOpportunity[];
  faqs: LocationFAQ[];
}

export const LOCATION_CONTENT: Record<string, LocationContent> = {

  dubai: {
    tagline: "The UAE's largest and most competitive digital market — and the highest-ROI opportunity for businesses that get it right.",
    stats: [
      { value: "350,000+", label: "Registered Businesses" },
      { value: "99%", label: "Internet Penetration" },
      { value: "AED 170B+", label: "Annual GDP" },
    ],
    opportunities: [
      {
        title: "Business Hub Density",
        description: "Dubai hosts 350,000+ registered businesses competing for the same highly connected, mobile-first audience. Strong digital presence is no longer optional — it is the minimum entry requirement for any business that expects to be found and chosen.",
      },
      {
        title: "E-Commerce Growth",
        description: "UAE e-commerce is growing at 35%+ year-on-year, with Dubai as its commercial hub. Businesses that invest in digital infrastructure now — SEO, paid media, conversion optimisation — capture compound returns as online purchase behaviour accelerates.",
      },
      {
        title: "Premium Consumer Market",
        description: "Dubai has the highest per-capita spending in the GCC. Premium, luxury, and aspirational brands perform exceptionally well here. Google Ads and social campaigns targeting this demographic deliver higher average order values and customer lifetime value than most other markets.",
      },
      {
        title: "Tourism and Transient Economy",
        description: "Dubai receives 16M+ annual visitors, creating constant demand cycles in hospitality, retail, healthcare, and experiential services. Digital marketing must capture both resident and visitor intent — two distinct audience segments with different search behaviour and conversion triggers.",
      },
    ],
    challenges: [
      {
        title: "Extreme Market Competition",
        description: "150+ digital marketing agencies operate in Dubai. Competing on generic terms without a clear differentiation strategy — industry specialisation, provable results, transparent pricing — means competing on price alone, which is a losing position in a premium market.",
      },
      {
        title: "High Google Ads CPCs",
        description: "Cost-per-click for competitive industries in Dubai runs AED 25–80 for real estate, AED 30–60 for legal, and AED 20–50 for healthcare. Inefficient campaign structure — broad match keywords, no conversion tracking, no negative keyword discipline — burns budget with minimal lead output.",
      },
      {
        title: "Multilingual Audience Complexity",
        description: "Dubai's population speaks Arabic, English, Hindi, Urdu, Tagalog, and dozens of other languages. Most businesses run English-only campaigns and miss significant audience segments. Arabic search queries often have lower CPCs and higher conversion intent than their English equivalents.",
      },
      {
        title: "Rapidly Shifting Market Conditions",
        description: "Post-pandemic and post-Expo market conditions have normalised significantly. Growth patterns have changed, buyer behaviour has evolved, and digital strategies that worked in 2020-2022 may need systematic recalibration. Businesses relying on momentum rather than active optimisation are losing ground.",
      },
    ],
    localSeo: [
      {
        category: "Business District Searches",
        description: "High-volume commercial intent searches tied to specific Dubai business districts — Business Bay, DIFC, JLT, Jumeirah — represent an underserved local SEO opportunity for most service businesses.",
        exampleKeywords: ["accountant Business Bay", "law firm DIFC", "marketing agency JLT", "IT support Dubai Marina"],
      },
      {
        category: "Residential Neighbourhood Searches",
        description: "Dubai residents search for services within their neighbourhood before travelling. Businesses with location pages and Google Business Profiles optimised for key residential areas capture these high-conversion local searches.",
        exampleKeywords: ["dentist JBR", "gym Dubai Hills", "restaurant Downtown Dubai", "nursery Jumeirah"],
      },
      {
        category: "Near Me and Same-Day Searches",
        description: "'Near me' searches in Dubai convert at exceptionally high rates — the searcher is ready to act. Google Maps optimisation and a complete Google Business Profile with photos, reviews, and services listed are the primary drivers of map pack visibility.",
        exampleKeywords: ["plumber near me Dubai", "car service near me", "pharmacy open now Dubai", "IT repair near me"],
      },
    ],
    faqs: [
      {
        question: "How competitive is the Dubai digital marketing market?",
        answer: "Extremely competitive. Dubai has one of the highest concentrations of digital marketing agencies in the MENA region, with 150+ agencies competing for the same clients. The businesses that succeed invest in measurable, specialist approaches — sector-specific SEO, conversion-tracked Google Ads, and content that genuinely demonstrates expertise — rather than generic 'full-service' marketing that all agencies offer identically.",
      },
      {
        question: "Do I need Arabic-language campaigns in Dubai?",
        answer: "For consumer-facing businesses, yes. While English is widely spoken in Dubai's business community, a significant proportion of local consumers — particularly UAE nationals and Arab expats — search in Arabic. Arabic keywords often have lower CPCs and stronger buyer intent. We recommend bilingual campaigns for most B2C categories: retail, healthcare, food and beverage, beauty, and education.",
      },
      {
        question: "What is a realistic budget for digital marketing in Dubai?",
        answer: "For Google Ads, a minimum of AED 8,000–12,000/month in ad spend is required to generate meaningful data in competitive industries. For a complete programme including SEO, paid media, and social media management, Dubai businesses typically invest AED 15,000–40,000/month. The right budget depends on your industry, target customer value, and growth objectives — not on what other businesses are spending.",
      },
      {
        question: "How long does SEO take for a Dubai business?",
        answer: "Initial ranking improvements typically appear within 60–90 days of technical fixes and content optimisation. Competitive first-page rankings for primary commercial terms take 6–12 months. In highly competitive sectors like real estate, legal, and healthcare, reaching and sustaining top-3 positions requires 12–18 months of consistent effort. The Dubai SEO landscape rewards sustained investment — businesses that stop before results compound leave significant organic traffic on the table.",
      },
      {
        question: "Is Google Business Profile important for Dubai businesses?",
        answer: "Critically important. The Google Maps pack appears at the top of local search results for queries like 'marketing agency Dubai' or 'accountant Business Bay,' and captures the majority of clicks. A fully optimised Google Business Profile — complete services list, keyword-rich description, active photo library, consistent reviews, and regular GBP posts — is the single highest-ROI local SEO action for most Dubai service businesses.",
      },
    ],
  },

  "abu-dhabi": {
    tagline: "The UAE capital's growing digital economy — and a significantly under-served opportunity for businesses with an Abu Dhabi presence.",
    stats: [
      { value: "90,000+", label: "Active Businesses" },
      { value: "AED 1.2T+", label: "GDP" },
      { value: "99%", label: "Internet Penetration" },
    ],
    opportunities: [
      {
        title: "Government and Semi-Government Sector",
        description: "Abu Dhabi's economy is anchored by government and semi-government entities — ADNOC, ADSC, DOH, CBUAE, and dozens of others — whose digitisation programmes and vendor ecosystems create substantial B2B digital marketing demand that is almost entirely underserved by specialist agencies.",
      },
      {
        title: "Healthcare Capital of the UAE",
        description: "Abu Dhabi Health Services (SEHA) expansion, private hospital growth, and the emirate's medical tourism strategy create significant demand for healthcare marketing — patient acquisition, specialist clinic visibility, and reputation management — in a regulated environment where few agencies have genuine compliance expertise.",
      },
      {
        title: "Financial Services Hub",
        description: "ADGM (Abu Dhabi Global Market) and the concentration of major UAE and international banks create demand for sophisticated B2B financial services marketing — a category requiring regulatory understanding, professional tone, and LinkedIn-first content strategies that most agencies manage poorly.",
      },
      {
        title: "Cultural Tourism Growth",
        description: "The Louvre Abu Dhabi, the upcoming Guggenheim, and Abu Dhabi's positioning as a cultural destination create premium hospitality and experience marketing opportunities with audiences that have high average spend and strong digital research behaviour.",
      },
    ],
    challenges: [
      {
        title: "Lower Search Volume Than Dubai",
        description: "Abu Dhabi generates 30–40% lower search volume than Dubai for most commercial categories. This limits the absolute traffic ceiling for any SEO or paid media programme, meaning strategy must prioritise precision over scale — targeting the right queries at the right conversion moments rather than maximising traffic volume.",
      },
      {
        title: "Government Procurement Complexity",
        description: "Public sector clients in Abu Dhabi operate on 6–18 month procurement cycles, require compliance documentation, and are often unreachable through standard digital marketing channels alone. B2B digital strategy must combine awareness marketing with relationship-based sales approaches.",
      },
      {
        title: "Conservative Sector Norms",
        description: "Healthcare, legal, and financial services in Abu Dhabi operate under stricter regulatory and cultural norms than Dubai. Marketing claims must be conservative, compliance-reviewed, and avoid guarantees. Content must reflect the professional, formal communication style expected by Abu Dhabi's institutional audience.",
      },
      {
        title: "Dubai-Centric Marketing Budgets",
        description: "Many UAE businesses allocate 70–80% of their digital marketing budgets to Dubai campaigns — often with a single GTM strategy for the whole UAE. Abu Dhabi requires distinct keyword sets, different audience profiles, separate GMB profiles, and location-specific content to perform well. Generic UAE-wide campaigns rarely convert efficiently in Abu Dhabi.",
      },
    ],
    localSeo: [
      {
        category: "ADGM and Business District Searches",
        description: "High-value B2B searches from financial and legal professionals based in ADGM, Al Maryah Island, and the Abu Dhabi business district represent underserved high-conversion opportunities for B2B service providers.",
        exampleKeywords: ["corporate law firm Abu Dhabi", "financial adviser ADGM", "accounting firm Al Maryah", "business consultant Abu Dhabi"],
      },
      {
        category: "Residential Island Searches",
        description: "Abu Dhabi's residential population is concentrated on Reem Island, Saadiyat Island, Yas Island, and Al Raha. Location-specific service pages for each island capture neighbourhood-level intent that generic 'Abu Dhabi' pages miss.",
        exampleKeywords: ["dentist Reem Island", "gym Saadiyat", "nursery Yas Island", "pharmacy Al Raha Beach"],
      },
      {
        category: "Healthcare and Medical Searches",
        description: "Abu Dhabi is the UAE's healthcare capital, with high search volume for medical specialists, clinics, and health services. DHA and DOH-licensed practitioners who appear in local searches and have positive Google reviews capture disproportionate patient enquiry volume.",
        exampleKeywords: ["cardiologist Abu Dhabi", "physiotherapy clinic Reem Island", "dermatologist Abu Dhabi", "pediatrician Abu Dhabi"],
      },
    ],
    faqs: [
      {
        question: "Is the Abu Dhabi digital marketing market different from Dubai?",
        answer: "Significantly different in audience composition, sector mix, and procurement behaviour. Abu Dhabi's economy is more government-anchored, the audience skews toward UAE nationals and Arab expats at a higher proportion, and the professional services sector is more compliance-conscious. Content tone, keyword strategy, and channel mix that works in Dubai often needs material adjustment for Abu Dhabi.",
      },
      {
        question: "Should I run separate Abu Dhabi campaigns from my Dubai campaigns?",
        answer: "Yes, for any business with meaningful Abu Dhabi revenue or growth ambitions. Separate Google Ads campaigns with Abu Dhabi-specific keywords, location extensions, and ad copy produce significantly better CPLs than UAE-wide campaigns. Abu Dhabi often has lower CPCs than Dubai with comparable intent — making it genuinely undervalued in most UAE advertising budgets.",
      },
      {
        question: "Do Arabic-language campaigns perform well in Abu Dhabi?",
        answer: "Exceptionally well. Abu Dhabi has a higher proportion of UAE national and Arab expat residents than Dubai, meaning Arabic-language campaigns reach a larger and more culturally aligned audience. For consumer categories (healthcare, education, retail, food and beverage), Arabic campaigns in Abu Dhabi often outperform English campaigns by a significant margin.",
      },
      {
        question: "Is Google Business Profile important for Abu Dhabi businesses?",
        answer: "As important as in Dubai, though the competitive environment for GBP rankings in Abu Dhabi is less intense — meaning well-optimised profiles can achieve map pack positions more quickly. With fewer businesses competing for local search visibility, investment in GBP optimisation, local citations, and review management produces faster, more durable results than in Dubai.",
      },
      {
        question: "What industries have the strongest digital marketing ROI in Abu Dhabi?",
        answer: "Healthcare (particularly specialist clinics and private hospitals), professional services (legal, accounting, management consulting), real estate (particularly premium residential and commercial), education (international schools, professional development), and hospitality (premium hotels and restaurants in Abu Dhabi's tourism zones). These sectors have strong search demand, high average customer value, and relatively low organic competition compared to Dubai.",
      },
    ],
  },

  sharjah: {
    tagline: "The UAE's third-largest emirate — an industrial and educational hub with underserved digital marketing opportunity across B2B and residential markets.",
    stats: [
      { value: "100,000+", label: "Registered Businesses" },
      { value: "AED 105B+", label: "GDP" },
      { value: "96%", label: "Internet Penetration" },
    ],
    opportunities: [
      {
        title: "Industrial and B2B Market",
        description: "Sharjah's large industrial free zones — SAIF, Hamriyah Free Zone, and the Sharjah Industrial Area — create concentrated B2B marketing demand for manufacturing suppliers, logistics providers, industrial services, and professional services targeting this sector. Most digital agencies are Dubai-focused and underserve this market.",
      },
      {
        title: "University City and Education",
        description: "Sharjah hosts 7+ universities and is UAE University City, creating constant demand for education marketing, student services, professional development, and graduate employment services. The student population also creates a significant young adult consumer market with strong social media and mobile behaviour.",
      },
      {
        title: "Cross-Emirate Residential Audience",
        description: "A large proportion of Dubai's workforce lives in Sharjah for cost reasons — creating a cross-emirate commuter market that shops, eats, and uses services in both Emirates. Businesses with a Sharjah presence can reach Dubai-income households at Sharjah-level advertising costs.",
      },
      {
        title: "Affordable Market Entry",
        description: "Sharjah has lower CPCs and less competition than Dubai across most commercial categories, making it an efficient market for businesses to establish digital presence and accumulate rankings before expanding UAE-wide. The lower advertising costs mean smaller businesses can compete meaningfully from day one.",
      },
    ],
    challenges: [
      {
        title: "Price-Sensitive Consumer Base",
        description: "Sharjah's residential population has a lower average income than Dubai and Abu Dhabi, making consumers more price-sensitive. Marketing messaging that works on premium value propositions in Dubai may need recalibration for Sharjah — with greater emphasis on quality-for-value, reliability, and practical benefits rather than luxury positioning.",
      },
      {
        title: "B2B Sales Complexity",
        description: "Industrial and manufacturing buyers in Sharjah's free zones have specific technical requirements, longer evaluation cycles, and procurement processes that differ substantially from consumer marketing. B2B digital campaigns require different keywords, content formats, and conversion mechanics than B2C equivalents.",
      },
      {
        title: "Lower Search Volume",
        description: "Sharjah generates 50–60% lower search volume than Dubai for most commercial categories. This limits the absolute traffic potential for any campaign — making precision in keyword selection, audience targeting, and conversion optimisation more important than in higher-volume markets.",
      },
      {
        title: "Dubai-Centric Agency Ecosystem",
        description: "Most UAE digital marketing agencies are headquartered in Dubai and design campaigns primarily for Dubai audiences. Sharjah-specific local SEO, Sharjah-area Google Ads campaigns, and content that reflects Sharjah's distinct market character are systematically underdelivered by generic UAE-wide agency approaches.",
      },
    ],
    localSeo: [
      {
        category: "Industrial Area and Free Zone Searches",
        description: "B2B searches from businesses operating in SAIF Zone, Hamriyah Free Zone, and the Sharjah Industrial Area represent high-value, low-competition local SEO opportunities for industrial service providers.",
        exampleKeywords: ["logistics company SAIF Zone", "industrial supplier Sharjah", "customs agent Hamriyah", "warehouse Sharjah industrial area"],
      },
      {
        category: "Residential Area Searches",
        description: "Sharjah's residential clusters — Al Majaz, Al Nahda, Al Taawun, Muwaileh — generate consistent local search demand for consumer services. Location-specific pages for each area capture neighbourhood-level intent.",
        exampleKeywords: ["dentist Al Majaz", "restaurant Al Nahda Sharjah", "supermarket Muwaileh", "pharmacy Al Taawun"],
      },
      {
        category: "University and Student Area Searches",
        description: "University City and student-dense areas create consistent search demand for affordable services, student accommodation, food, tutoring, and career services. Businesses targeting students benefit from Google Maps visibility near campus.",
        exampleKeywords: ["tutor Sharjah University City", "affordable restaurant near American University Sharjah", "printing shop University City", "student accommodation Sharjah"],
      },
    ],
    faqs: [
      {
        question: "Is Sharjah worth targeting separately from Dubai in digital marketing campaigns?",
        answer: "Yes — particularly for businesses with a physical Sharjah presence or B2B clients in Sharjah's industrial zones. Sharjah-specific campaigns have lower CPCs, less competition, and a distinct audience profile. For consumer businesses with a Sharjah location, Google Business Profile optimisation for Sharjah searches can be highly cost-effective relative to Dubai campaigns.",
      },
      {
        question: "What types of businesses benefit most from Sharjah digital marketing?",
        answer: "B2B businesses serving Sharjah's industrial free zones, education and training providers targeting University City, consumer services for Sharjah's large residential population (particularly Al Nahda and Al Majaz), and affordable / value-oriented consumer brands targeting the cost-conscious Sharjah residential demographic.",
      },
      {
        question: "Do I need Arabic campaigns for Sharjah?",
        answer: "Highly recommended. Sharjah has a higher proportion of UAE national and Arab expat residents than Dubai. Arabic-language campaigns, Arabic Google Business Profile content, and Arabic social media consistently outperform English-only campaigns for consumer categories in Sharjah's residential areas.",
      },
      {
        question: "Can I target Dubai residents who live in Sharjah with advertising?",
        answer: "Yes. Geographic and commute behaviour targeting allows campaigns to reach Sharjah-residing workers with campaigns relevant to their Dubai office locations. LinkedIn in particular allows targeting by employer location. Meta Ads can target by residential location — reaching Sharjah-based consumers with campaigns relevant to their spending behaviour.",
      },
      {
        question: "How competitive is SEO in Sharjah compared to Dubai?",
        answer: "Significantly less competitive. Many commercial search queries in Sharjah — particularly for local services — are won by the first business to invest in local SEO. A well-optimised Google Business Profile, consistent citations across UAE directories, and 15–20 positive reviews can achieve map pack positions in Sharjah that would require substantially more effort in Dubai.",
      },
    ],
  },
};

// Default fallback for locations not in the lookup
export const DEFAULT_LOCATION_CONTENT: Omit<LocationContent, "tagline"> = {
  stats: [
    { value: "99%", label: "UAE Internet Penetration" },
    { value: "AED 1.5T+", label: "UAE National GDP" },
    { value: "11M+", label: "UAE Population" },
  ],
  opportunities: [
    {
      title: "Highly Connected Market",
      description: "The UAE has one of the world's highest internet and smartphone penetration rates, creating a digital-first audience that relies on online search and social media to discover and evaluate businesses.",
    },
    {
      title: "Strong Consumer Spending",
      description: "UAE consumers have among the highest average spending levels in the world. Premium positioning, digital advertising, and brand-building deliver strong returns in this high-value consumer market.",
    },
    {
      title: "Multilingual Audience",
      description: "Arabic, English, Hindi, and other language communities create distinct audience segments — each with different search behaviour, platform preferences, and content expectations.",
    },
    {
      title: "Mobile-First Behaviour",
      description: "Over 70% of UAE web traffic and searches happen on mobile devices. Businesses with mobile-optimised websites, Google Maps visibility, and fast-loading pages capture the majority of intent-driven traffic.",
    },
  ],
  challenges: [
    {
      title: "Competitive Digital Landscape",
      description: "UAE businesses face strong competition from international brands, regional competitors, and a large number of local businesses investing in digital marketing.",
    },
    {
      title: "Multilingual Content Requirements",
      description: "Effective UAE digital marketing requires content in multiple languages — Arabic and English at minimum — which most businesses underinvest in.",
    },
    {
      title: "High Advertising Costs",
      description: "UAE Google Ads CPCs are among the highest in the MENA region, making campaign efficiency and conversion optimisation essential for positive ROI.",
    },
    {
      title: "Regulatory Compliance",
      description: "Healthcare, financial services, and legal marketing in the UAE must comply with sector-specific advertising regulations, adding complexity that generic agencies often miss.",
    },
  ],
  localSeo: [
    {
      category: "Google Business Profile Visibility",
      description: "A complete, optimised GBP is the single highest-ROI local SEO action for most UAE businesses.",
      exampleKeywords: ["[service] near me", "[service] [city]", "[service] [neighbourhood]"],
    },
  ],
  faqs: [
    {
      question: "How long does digital marketing take to produce results in the UAE?",
      answer: "SEO typically shows initial results within 60–90 days and meaningful traffic improvements at 3–6 months. Google Ads can produce leads within 48 hours of launch. Social media audience building takes 3–6 months to establish meaningful engagement. The right timeline depends on your channel mix, budget, and competitive environment.",
    },
  ],
};
