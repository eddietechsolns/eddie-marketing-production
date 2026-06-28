export type ToolCategory =
  | "SEO"
  | "Google Ads"
  | "Social Media"
  | "Content Marketing"
  | "Email Marketing"
  | "Analytics"
  | "Website Development"
  | "Business Tools"
  | "AI Marketing";

export type ToolType = "calculator" | "generator" | "checklist" | "reference";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface HowItWorksStep {
  step: string;
  description: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface EducationalSection {
  heading: string;
  body: string;
}

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  type: ToolType;
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  comingSoon?: boolean;
  updatedAt: string;
  difficulty: Difficulty;
  timeToComplete: string;
  howItWorks: HowItWorksStep[];
  faqs: FaqEntry[];
  relatedToolSlugs: string[];
  relatedKeywords: string[];
  iconEmoji: string;
  educationalContent?: EducationalSection[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "SEO",
  "Google Ads",
  "Social Media",
  "Content Marketing",
  "Email Marketing",
  "Analytics",
  "Website Development",
  "Business Tools",
  "AI Marketing",
];

export const CATEGORY_DESCRIPTIONS: Record<ToolCategory, string> = {
  "SEO": "Optimise your website for search engines and grow organic traffic.",
  "Google Ads": "Plan, budget, and measure your paid search campaigns.",
  "Social Media": "Build engagement, grow your audience, and measure social ROI.",
  "Content Marketing": "Create content that attracts, educates, and converts.",
  "Email Marketing": "Maximise open rates, click-throughs, and email revenue.",
  "Analytics": "Turn data into decisions with these measurement tools.",
  "Website Development": "Audit, optimise, and improve your website's performance.",
  "Business Tools": "Plan budgets, calculate ROI, and make smarter marketing investments.",
  "AI Marketing": "Leverage AI tools and prompts to accelerate your marketing output.",
};

export const TOOLS: Tool[] = [
  // ─── SEO ───────────────────────────────────────────────────────────────────
  {
    slug: "meta-title-generator",
    name: "Meta Title & Description Generator",
    tagline: "Craft click-worthy meta tags that rank and convert",
    description:
      "Generate compelling meta titles and descriptions in seconds. Enter your page type, primary keyword, and brand name to receive multiple optimised options that stay within Google's character limits and are designed to maximise click-through rates.",
    category: "SEO",
    type: "generator",
    tags: ["meta tags", "on-page SEO", "click-through rate", "SERP"],
    featured: true,
    isNew: false,
    updatedAt: "2025-06-01",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      {
        step: "Enter Your Details",
        description:
          "Provide your page type (homepage, service, blog), primary keyword, brand name, and an optional unique selling point.",
      },
      {
        step: "Generate Options",
        description:
          "The tool produces five meta title variants and three meta description options, each within Google's recommended character limits.",
      },
      {
        step: "Copy & Apply",
        description:
          "Select your favourite option, copy it, and paste it into your CMS or page settings. Test multiple variants over time using A/B testing.",
      },
    ],
    faqs: [
      {
        question: "How long should a meta title be?",
        answer:
          "Google typically displays the first 50–60 characters of a meta title. Aim for 55 characters to ensure it appears in full on desktop and mobile search results without being truncated.",
      },
      {
        question: "Does the meta description affect rankings?",
        answer:
          "Meta descriptions are not a direct Google ranking factor, but they significantly influence click-through rate (CTR). A compelling description can improve organic traffic even without a rankings change.",
      },
      {
        question: "Should I include the brand name in the meta title?",
        answer:
          "For most pages, yes — especially the homepage. Place the brand name at the end (e.g., 'Primary Keyword | Brand Name') to keep the primary keyword prominent. For blog posts, the brand name is optional.",
      },
      {
        question: "Can Google rewrite my meta title?",
        answer:
          "Yes. Google may rewrite meta titles if it determines they are misleading, too short, or too keyword-stuffed. Writing natural, accurate titles reduces the chance of rewrites.",
      },
      {
        question: "How many keywords should I target per page?",
        answer:
          "Focus on one primary keyword per page, supported by 2–4 closely related secondary keywords. Trying to rank for too many unrelated keywords dilutes relevance and confuses search engines.",
      },
    ],
    relatedToolSlugs: ["serp-ctr-calculator", "seo-audit-checklist", "blog-title-generator"],
    relatedKeywords: ["meta title", "meta description", "on-page SEO", "SERP optimisation"],
    iconEmoji: "🏷️",
  },
  {
    slug: "keyword-difficulty-estimator",
    name: "Keyword Difficulty Estimator",
    tagline: "Know which keywords you can realistically rank for",
    description:
      "Estimate how competitive a keyword is before investing time and budget. Input the average monthly search volume, number of authoritative domains ranking on page one, and your own domain authority to receive a difficulty score and strategic recommendation.",
    category: "SEO",
    type: "calculator",
    tags: ["keyword research", "SEO strategy", "domain authority", "competition"],
    featured: true,
    isNew: false,
    updatedAt: "2025-05-20",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Enter Keyword Metrics",
        description:
          "Input the average monthly search volume for your target keyword, found via Google Keyword Planner or Ahrefs.",
      },
      {
        step: "Assess Competition",
        description:
          "Count the number of domains with a Domain Authority (DA) above 50 currently ranking on page one, and enter your own site's DA.",
      },
      {
        step: "Receive Your Score",
        description:
          "Get a difficulty score from 0–100 with a recommendation: target now, target with content investment, or deprioritise.",
      },
    ],
    faqs: [
      {
        question: "What is keyword difficulty?",
        answer:
          "Keyword difficulty is a score (typically 0–100) that estimates how hard it would be to rank on the first page of Google for a given search term. Higher scores mean more competition from authoritative websites.",
      },
      {
        question: "What domain authority score do I need to rank?",
        answer:
          "There is no universal answer, but as a guide: DA 20–35 can rank for low-competition local or niche keywords; DA 40–55 is suitable for mid-competition terms; DA 60+ is needed for high-competition commercial terms.",
      },
      {
        question: "Should I only target low-difficulty keywords?",
        answer:
          "Not exclusively. Low-difficulty keywords have lower traffic potential. A balanced strategy targets easy wins for quick results while building authority to pursue higher-volume, competitive terms over 6–12 months.",
      },
      {
        question: "How do I find my domain authority?",
        answer:
          "Use free tools like Moz Link Explorer, Ahrefs' free website authority checker, or Semrush's domain overview. Note that each tool uses its own scoring algorithm, so scores may vary across platforms.",
      },
    ],
    relatedToolSlugs: ["serp-ctr-calculator", "meta-title-generator", "seo-audit-checklist"],
    relatedKeywords: ["keyword research", "keyword difficulty", "SEO competition", "domain authority"],
    iconEmoji: "🎯",
  },
  {
    slug: "serp-ctr-calculator",
    name: "SERP Click-Through Rate Calculator",
    tagline: "Estimate your organic traffic potential from any ranking position",
    description:
      "Calculate how much organic traffic you can expect based on your keyword's monthly search volume and your current or target Google ranking position. Uses industry-average CTR benchmarks to give you realistic traffic projections.",
    category: "SEO",
    type: "calculator",
    tags: ["click-through rate", "organic traffic", "SERP", "ranking"],
    featured: false,
    isNew: false,
    updatedAt: "2025-04-10",
    difficulty: "Beginner",
    timeToComplete: "2 min",
    howItWorks: [
      {
        step: "Enter Search Volume",
        description: "Input the average monthly searches for your target keyword from Google Search Console or Keyword Planner.",
      },
      {
        step: "Select Your Position",
        description: "Choose your current ranking position (1–10) or target position to estimate potential traffic.",
      },
      {
        step: "View Traffic Projections",
        description: "See estimated monthly clicks, annual traffic, and how much improvement you'd gain by moving up one or two positions.",
      },
    ],
    faqs: [
      {
        question: "What is a good click-through rate for SEO?",
        answer:
          "Position 1 on Google typically achieves a 28–35% CTR. Position 2 drops to around 15%, and position 3 to 11%. By position 10, CTR falls below 3%. This is why ranking in the top 3 results has such a disproportionate impact on organic traffic.",
      },
      {
        question: "Does having a featured snippet increase CTR?",
        answer:
          "Featured snippets can significantly increase CTR for informational queries — sometimes to 40–50%. However, for transactional queries, they may actually reduce clicks by answering the question directly on the SERP.",
      },
      {
        question: "How can I improve my CTR without changing rankings?",
        answer:
          "Optimise your meta title and description to be more compelling, add structured data markup to earn rich snippets, use numbers and power words in titles, and ensure your URL is clean and descriptive.",
      },
      {
        question: "Are these CTR estimates accurate for every industry?",
        answer:
          "The estimates use industry-average benchmarks. Actual CTR varies by query type (branded vs. non-branded), device, location, and presence of ads or other SERP features. Use Google Search Console for your actual CTR data.",
      },
    ],
    relatedToolSlugs: ["keyword-difficulty-estimator", "meta-title-generator", "conversion-rate-calculator"],
    relatedKeywords: ["organic traffic", "CTR", "SERP ranking", "click-through rate"],
    iconEmoji: "📊",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    tagline: "Control which pages Google crawls and indexes",
    description:
      "Generate a valid robots.txt file by selecting your CMS platform and choosing which directories to allow or block. Prevent search engines from crawling admin pages, duplicate content, and staging environments — without accidentally blocking your entire site.",
    category: "SEO",
    type: "generator",
    tags: ["robots.txt", "crawl budget", "technical SEO", "indexing"],
    featured: false,
    isNew: true,
    updatedAt: "2025-06-15",
    difficulty: "Intermediate",
    timeToComplete: "4 min",
    howItWorks: [
      {
        step: "Select Your Platform",
        description: "Choose your CMS (WordPress, Shopify, custom) to pre-populate common directories that should be blocked.",
      },
      {
        step: "Customise Rules",
        description: "Toggle which user agents to target (Googlebot, all bots) and add custom allow/disallow paths for your specific setup.",
      },
      {
        step: "Copy Your File",
        description: "Copy the generated robots.txt content and upload it to your website's root directory. Test it with Google Search Console.",
      },
    ],
    faqs: [
      {
        question: "What is a robots.txt file?",
        answer:
          "A robots.txt file is a plain text file placed at the root of your website that tells search engine crawlers which pages or sections they should not visit. It's part of the Robots Exclusion Protocol.",
      },
      {
        question: "Does disallowing a page remove it from Google's index?",
        answer:
          "No. Blocking crawling prevents Google from reading the page, but if other sites link to it, Google may still index the URL without the content. To remove indexed pages, use the noindex meta tag or Google Search Console.",
      },
      {
        question: "Can I have different rules for different bots?",
        answer:
          "Yes. You can specify rules per user agent (e.g., Googlebot, Bingbot, or all bots using *). This lets you, for example, allow Google but disallow other crawlers from accessing certain content.",
      },
      {
        question: "What happens if I block everything by accident?",
        answer:
          "Blocking all crawlers (Disallow: / for User-agent: *) will prevent Google from indexing your entire site, causing your pages to eventually disappear from search results. Always test your robots.txt using Google Search Console's robots.txt tester before uploading.",
      },
    ],
    relatedToolSlugs: ["seo-audit-checklist", "core-web-vitals-checklist", "meta-title-generator"],
    relatedKeywords: ["robots.txt", "technical SEO", "crawl budget", "Google indexing"],
    iconEmoji: "🤖",
  },
  {
    slug: "seo-audit-checklist",
    name: "SEO Audit Checklist",
    tagline: "A 50-point checklist to find and fix every SEO issue",
    description:
      "Run through a comprehensive 50-point SEO audit covering technical health, on-page optimisation, content quality, link profile, and local SEO. Track your progress as you go and identify the highest-impact opportunities to improve your rankings.",
    category: "SEO",
    type: "checklist",
    tags: ["SEO audit", "technical SEO", "on-page SEO", "site health"],
    featured: false,
    isNew: false,
    updatedAt: "2025-05-01",
    difficulty: "Intermediate",
    timeToComplete: "30 min",
    howItWorks: [
      {
        step: "Work Through Each Category",
        description: "The checklist is divided into five categories: Technical, On-Page, Content, Off-Page, and Local SEO. Tick each item as you audit your site.",
      },
      {
        step: "Note Issues Found",
        description: "For each unchecked item, note the specific page or issue in your own audit document for prioritisation and fixing.",
      },
      {
        step: "Prioritise & Action",
        description: "Focus on Technical and On-Page issues first as they tend to have the fastest impact. Address content and off-page factors as an ongoing strategy.",
      },
    ],
    faqs: [
      {
        question: "How often should I run an SEO audit?",
        answer:
          "A full SEO audit should be conducted quarterly. In between, monitor Google Search Console weekly for crawl errors, index coverage issues, and Core Web Vitals regressions.",
      },
      {
        question: "What are the most common technical SEO issues?",
        answer:
          "The most common issues include: broken internal links, missing or duplicate meta tags, slow page load speeds, non-mobile-friendly pages, missing XML sitemaps, blocked crawl paths in robots.txt, and HTTPS errors.",
      },
      {
        question: "Do I need specialist tools for an SEO audit?",
        answer:
          "Free tools like Google Search Console, Google PageSpeed Insights, and Bing Webmaster Tools cover most audit items. For deeper analysis, tools like Screaming Frog (free up to 500 URLs) and Ahrefs' free tier are helpful.",
      },
      {
        question: "How long does an SEO audit take?",
        answer:
          "A basic audit for a small site (under 50 pages) takes 2–4 hours. A thorough audit for a large ecommerce or service site can take 1–3 days depending on the number of pages, technical complexity, and backlink profile size.",
      },
    ],
    relatedToolSlugs: ["robots-txt-generator", "core-web-vitals-checklist", "keyword-difficulty-estimator"],
    relatedKeywords: ["SEO audit", "site health", "technical SEO checklist", "website optimisation"],
    iconEmoji: "✅",
  },

  // ─── Google Ads ────────────────────────────────────────────────────────────
  {
    slug: "google-ads-budget-calculator",
    name: "Google Ads Budget Calculator",
    tagline: "Calculate exactly how much to spend on Google Ads to hit your targets",
    description:
      "Work backwards from your revenue or lead targets to determine the right Google Ads monthly budget. Input your target conversions, average cost-per-click, and conversion rate to get a budget recommendation with profit projections.",
    category: "Google Ads",
    type: "calculator",
    tags: ["Google Ads", "PPC budget", "cost per click", "conversions"],
    featured: true,
    isNew: false,
    updatedAt: "2025-05-15",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Set Your Goal",
        description: "Enter your monthly target: number of leads or sales, your average conversion value, and the profit margin on each conversion.",
      },
      {
        step: "Enter Campaign Data",
        description: "Input your average cost-per-click (CPC) and your website's conversion rate. Use industry benchmarks if you're just starting out.",
      },
      {
        step: "Get Your Budget",
        description: "Receive a recommended monthly budget, expected ROAS, and profit projection. Adjust inputs to model different scenarios.",
      },
    ],
    faqs: [
      {
        question: "What is a good starting budget for Google Ads?",
        answer:
          "For most small to medium businesses in competitive markets, AED 3,000–8,000 (USD 800–2,200) per month is a reasonable starting point. This gives enough data for Google's algorithm to optimise, while keeping risk manageable. Always match the budget to your conversion value — a high-ticket service can justify a larger budget.",
      },
      {
        question: "How long should I run campaigns before judging performance?",
        answer:
          "Allow at least 30–60 days and a minimum of 30–50 conversions before making major changes. Google's Smart Bidding algorithms require this data to exit the learning phase and deliver optimal results.",
      },
      {
        question: "What is a good conversion rate for Google Ads?",
        answer:
          "The average Google Ads conversion rate across industries is 3.75% for search campaigns. Service industries often achieve 5–8%, while highly competitive ecommerce categories may see 1–2%. Compare your rate against your specific industry benchmarks.",
      },
      {
        question: "Should I use manual CPC or Smart Bidding?",
        answer:
          "Smart Bidding strategies (Target CPA, Target ROAS, Maximise Conversions) generally outperform manual CPC once you have sufficient conversion data (at least 30 conversions per month per campaign). Start with Manual CPC or Maximise Clicks to gather initial data.",
      },
      {
        question: "How do I reduce wasted ad spend?",
        answer:
          "Add negative keywords regularly, use exact and phrase match types, segment campaigns by intent, schedule ads for peak conversion hours, and review the Search Terms report weekly to filter irrelevant traffic.",
      },
    ],
    relatedToolSlugs: ["roas-calculator", "ad-copy-generator", "marketing-roi-calculator"],
    relatedKeywords: ["Google Ads budget", "PPC", "pay-per-click", "Google Adwords", "CPC"],
    iconEmoji: "💰",
  },
  {
    slug: "roas-calculator",
    name: "ROAS & Profit Calculator",
    tagline: "Is your ad spend profitable? Find out instantly",
    description:
      "Calculate your Return on Ad Spend (ROAS), gross profit, and net profit from any advertising campaign. Go beyond ROAS to understand true campaign profitability by factoring in cost of goods sold and operating margins.",
    category: "Google Ads",
    type: "calculator",
    tags: ["ROAS", "return on ad spend", "profit", "Google Ads", "campaign ROI"],
    featured: false,
    isNew: false,
    updatedAt: "2025-04-22",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      {
        step: "Enter Revenue & Spend",
        description: "Input your total ad spend and the total revenue attributed to those ads during the same period.",
      },
      {
        step: "Add Margins",
        description: "Enter your gross margin percentage so the tool can calculate true profit, not just revenue.",
      },
      {
        step: "See Profitability",
        description: "View your ROAS, gross profit, net profit, and whether your campaign is profitable after accounting for ad costs.",
      },
    ],
    faqs: [
      {
        question: "What is ROAS and why does it matter?",
        answer:
          "ROAS (Return on Ad Spend) measures how much revenue you earn for every dollar/dirham spent on advertising. A ROAS of 4x means you earn AED 4 for every AED 1 spent. It's the primary metric for measuring advertising efficiency.",
      },
      {
        question: "What ROAS do I need to be profitable?",
        answer:
          "Your minimum profitable ROAS depends on your gross margin. If your margin is 50%, you need at least a 2x ROAS to break even. The formula is: Minimum ROAS = 1 / Gross Margin. At a 25% margin, you need 4x ROAS to break even.",
      },
      {
        question: "What is the difference between ROAS and ROI?",
        answer:
          "ROAS measures revenue generated per dollar of ad spend (Revenue / Ad Spend). ROI measures profit relative to total investment (Net Profit / Investment). ROAS ignores costs of goods, while ROI accounts for all costs. Both metrics are needed for a complete picture.",
      },
      {
        question: "How do I track ROAS accurately?",
        answer:
          "Implement Google Ads conversion tracking with revenue values, connect Google Analytics 4 (GA4) and import conversions, or use a CRM integration to attribute revenue to campaigns. Without accurate conversion tracking, ROAS figures are unreliable.",
      },
    ],
    relatedToolSlugs: ["google-ads-budget-calculator", "marketing-roi-calculator", "conversion-rate-calculator"],
    relatedKeywords: ["ROAS", "return on ad spend", "Google Ads ROI", "advertising profit"],
    iconEmoji: "📈",
  },
  {
    slug: "ad-copy-generator",
    name: "Google Ads Copy Generator",
    tagline: "Write high-converting ad headlines and descriptions in minutes",
    description:
      "Generate compliant Google Ads headlines (30 chars) and descriptions (90 chars) for Responsive Search Ads. Enter your product or service, key benefits, and target audience to receive multiple headline and description options optimised for relevance and CTR.",
    category: "Google Ads",
    type: "generator",
    tags: ["ad copy", "Google Ads", "RSA", "responsive search ads", "copywriting"],
    featured: false,
    isNew: false,
    updatedAt: "2025-03-18",
    difficulty: "Beginner",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Describe Your Offer",
        description: "Enter your product or service name, primary benefit, target audience, and unique selling point (USP).",
      },
      {
        step: "Add Campaign Details",
        description: "Specify your target keyword and call to action (e.g., 'Get a Free Quote', 'Shop Now', 'Book Today').",
      },
      {
        step: "Generate & Select",
        description: "Receive 15 headlines and 4 description options. Select the best ones for your Responsive Search Ad — Google recommends at least 5 headlines and 2 descriptions.",
      },
    ],
    faqs: [
      {
        question: "How many headlines does a Responsive Search Ad need?",
        answer:
          "Google allows up to 15 headlines and 4 descriptions in a Responsive Search Ad (RSA). Google recommends providing at least 5 unique headlines and 2 descriptions to give the algorithm room to test combinations and find the highest-performing variants.",
      },
      {
        question: "Should my primary keyword appear in the headline?",
        answer:
          "Yes — include your primary keyword in at least one headline to improve ad relevance and Quality Score. Google may bold the matching keyword in search results, which increases visibility and CTR.",
      },
      {
        question: "What is the character limit for Google Ads headlines?",
        answer:
          "Each headline has a maximum of 30 characters. Each description has a maximum of 90 characters. These limits include spaces. The tool automatically flags any text that exceeds these limits.",
      },
      {
        question: "Can I pin specific headlines to fixed positions?",
        answer:
          "Yes. In Google Ads, you can pin headlines or descriptions to specific positions (1, 2, or 3). This is useful for mandatory legal disclaimers or brand taglines, but over-pinning limits Google's ability to optimise combinations — use sparingly.",
      },
    ],
    relatedToolSlugs: ["google-ads-budget-calculator", "roas-calculator", "meta-title-generator"],
    relatedKeywords: ["ad copy", "Google Ads", "responsive search ads", "PPC copywriting"],
    iconEmoji: "✍️",
  },
  {
    slug: "quality-score-guide",
    name: "Google Ads Quality Score Guide",
    tagline: "Improve your Quality Score to pay less and rank higher",
    description:
      "A comprehensive reference guide to understanding, diagnosing, and improving your Google Ads Quality Score. Learn how each component (Expected CTR, Ad Relevance, Landing Page Experience) is weighted and what specific actions to take for each score level.",
    category: "Google Ads",
    type: "reference",
    tags: ["Quality Score", "Google Ads", "Ad Rank", "landing page", "CTR"],
    featured: false,
    isNew: false,
    updatedAt: "2025-02-28",
    difficulty: "Intermediate",
    timeToComplete: "10 min",
    howItWorks: [
      {
        step: "Understand the Components",
        description: "Quality Score is made up of three components: Expected CTR (most important), Ad Relevance, and Landing Page Experience. Each is rated Below Average, Average, or Above Average.",
      },
      {
        step: "Diagnose Your Score",
        description: "Use the score tables in this guide to identify which component is dragging your score down and why.",
      },
      {
        step: "Apply the Fixes",
        description: "Follow the actionable improvement tips for each component — from ad copy rewriting to landing page speed optimisation.",
      },
    ],
    faqs: [
      {
        question: "What is Quality Score in Google Ads?",
        answer:
          "Quality Score is a 1–10 rating Google gives each keyword based on the expected performance of your ads when triggered by that keyword. A higher score means Google considers your ads more relevant and useful, and rewards you with lower CPCs and better ad positions.",
      },
      {
        question: "How much does Quality Score affect my CPC?",
        answer:
          "Quality Score has a significant impact on CPC. Moving from a QS of 5 to 7 can reduce your CPC by approximately 28%. Moving from 5 to 10 can reduce it by up to 50%. Conversely, a QS below 5 can increase your CPC by 25–400% compared to the benchmark.",
      },
      {
        question: "What is the most important component of Quality Score?",
        answer:
          "Expected CTR carries the most weight, followed by Landing Page Experience. Ad Relevance matters, but improving it alone rarely moves the needle significantly. Focus on writing compelling ads with strong call-to-actions and ensuring your landing pages load fast and match the ad's intent.",
      },
      {
        question: "Can Quality Score be improved quickly?",
        answer:
          "Expected CTR and Ad Relevance can improve within days of updating ad copy. Landing Page Experience improvements (speed, content relevance) can take 1–2 weeks for Google to re-evaluate. Pause low-performing keywords rather than letting them pull down campaign-level quality.",
      },
    ],
    relatedToolSlugs: ["google-ads-budget-calculator", "ad-copy-generator", "roas-calculator"],
    relatedKeywords: ["Quality Score", "Google Ads", "Ad Rank", "CPC reduction", "landing page"],
    iconEmoji: "⭐",
  },

  // ─── Social Media ──────────────────────────────────────────────────────────
  {
    slug: "engagement-rate-calculator",
    name: "Social Media Engagement Rate Calculator",
    tagline: "Benchmark your social performance across every platform",
    description:
      "Calculate your engagement rate for Instagram, LinkedIn, Facebook, TikTok, or X (Twitter). See how your rate compares to platform benchmarks and get actionable tips to improve your social media performance.",
    category: "Social Media",
    type: "calculator",
    tags: ["engagement rate", "social media", "Instagram", "LinkedIn", "TikTok"],
    featured: false,
    isNew: false,
    updatedAt: "2025-05-10",
    difficulty: "Beginner",
    timeToComplete: "2 min",
    howItWorks: [
      {
        step: "Select Your Platform",
        description: "Choose Instagram, LinkedIn, Facebook, TikTok, or X to apply the correct engagement rate formula for that network.",
      },
      {
        step: "Enter Your Stats",
        description: "Input your follower count, average likes, comments, and shares/saves per post over your last 10–30 posts.",
      },
      {
        step: "Compare & Improve",
        description: "See your engagement rate, a benchmark comparison for your follower tier, and personalised recommendations.",
      },
    ],
    faqs: [
      {
        question: "How is engagement rate calculated?",
        answer:
          "The standard formula is: Engagement Rate = (Total Engagements / Total Followers) × 100. For Instagram and TikTok, engagements include likes, comments, saves, and shares. For LinkedIn, they include reactions, comments, and reposts.",
      },
      {
        question: "What is a good engagement rate?",
        answer:
          "Benchmarks vary by platform and follower count. On Instagram: 1–3% is average, 3–6% is good, 6%+ is excellent. On LinkedIn: 2% is considered strong for company pages. Micro-influencers (under 10K followers) typically see higher rates (5–10%) than mega-influencers.",
      },
      {
        question: "Does follower count affect engagement rate?",
        answer:
          "Yes — engagement rate typically declines as follower count grows. Accounts with 1K–10K followers often see 5–10% engagement, while accounts with 1M+ followers typically see under 2%. This is why brands often get better ROI working with micro-influencers.",
      },
      {
        question: "Which platform has the highest average engagement rate?",
        answer:
          "TikTok currently has the highest average engagement rate (5–18%), followed by Instagram (1–5%). LinkedIn has lower rates overall but higher quality engagement from a professional audience. Facebook's organic reach and engagement have declined significantly since 2020.",
      },
    ],
    relatedToolSlugs: ["hashtag-generator", "conversion-rate-calculator", "marketing-roi-calculator"],
    relatedKeywords: ["engagement rate", "social media marketing", "Instagram analytics", "LinkedIn marketing"],
    iconEmoji: "💬",
  },
  {
    slug: "hashtag-generator",
    name: "Hashtag Strategy Generator",
    tagline: "Find the right hashtags to reach your target audience",
    description:
      "Generate a tailored hashtag strategy for your social media posts. Enter your industry, content topic, and target platform to receive a mix of high-volume, medium, and niche hashtags — sized for maximum reach without getting lost in a sea of content.",
    category: "Social Media",
    type: "generator",
    tags: ["hashtags", "Instagram", "LinkedIn", "TikTok", "social media reach"],
    featured: false,
    isNew: true,
    updatedAt: "2025-06-20",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      {
        step: "Enter Your Details",
        description: "Select your industry, describe your content topic in a few words, and choose your target platform.",
      },
      {
        step: "Choose Your Strategy",
        description: "Select between a reach-focused strategy (more high-volume hashtags) or a niche strategy (more specific, less competitive hashtags).",
      },
      {
        step: "Copy Your Hashtags",
        description: "Copy your recommended hashtag set — formatted and ready to paste into your post or caption.",
      },
    ],
    faqs: [
      {
        question: "How many hashtags should I use on Instagram?",
        answer:
          "Instagram recommends using 3–5 highly relevant hashtags rather than the old strategy of using 30. Since the algorithm now focuses on interest-based content distribution, fewer, more targeted hashtags tend to outperform hashtag stuffing.",
      },
      {
        question: "Do hashtags work on LinkedIn?",
        answer:
          "Yes, but use them sparingly. LinkedIn best practice is 3–5 hashtags per post. Place them at the end of your text rather than in the body, and focus on professional, industry-specific tags rather than trending hashtags.",
      },
      {
        question: "Should I use trending or niche hashtags?",
        answer:
          "A mix of both works best. Trending hashtags expose your content to a large audience but face intense competition. Niche hashtags have smaller but more targeted audiences with higher engagement potential. A 20% trending / 80% niche split is a solid starting point.",
      },
      {
        question: "How do I find the best hashtags for my industry?",
        answer:
          "Research competitors in your niche to see what hashtags they use, check the explore/discover section of each platform, look at hashtag post counts (aim for 50K–500K on Instagram for mid-competition tags), and use analytics to track which hashtags drive the most reach on your own posts.",
      },
    ],
    relatedToolSlugs: ["engagement-rate-calculator", "blog-title-generator", "ai-content-brief-generator"],
    relatedKeywords: ["hashtags", "Instagram marketing", "social media strategy", "content reach"],
    iconEmoji: "#️⃣",
  },

  // ─── Content Marketing ─────────────────────────────────────────────────────
  {
    slug: "blog-title-generator",
    name: "Blog Post Title Generator",
    tagline: "Headlines that get clicked, shared, and ranked",
    description:
      "Generate 10 compelling blog post titles for any topic, keyword, or audience. Choose from multiple formats — how-to guides, listicles, question-based titles, and expert roundups — each crafted to maximise click-through rate and search intent alignment.",
    category: "Content Marketing",
    type: "generator",
    tags: ["blog titles", "content marketing", "headline writing", "SEO content"],
    featured: true,
    isNew: false,
    updatedAt: "2025-05-28",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      {
        step: "Enter Your Topic",
        description: "Describe your blog topic or paste in your primary keyword. Specify your target audience and the desired content format (how-to, list, guide, case study).",
      },
      {
        step: "Set Your Tone",
        description: "Choose between professional, conversational, or bold/provocative tone to match your brand voice.",
      },
      {
        step: "Generate & Pick",
        description: "Receive 10 title options across different formats. Copy your favourite or use them as inspiration to craft your own variation.",
      },
    ],
    faqs: [
      {
        question: "What makes a great blog post title?",
        answer:
          "The best blog titles are specific (include numbers or specific outcomes), address a clear pain point or desire, use power words that evoke emotion or urgency, include the target keyword naturally, and stay under 60 characters for full display in search results.",
      },
      {
        question: "Should my blog title match my SEO meta title exactly?",
        answer:
          "Not necessarily. Your H1 (on-page title) can be slightly longer and more engaging, while your meta title should be optimised for the SERP character limit (~55 characters). They should convey the same topic but don't need to be identical.",
      },
      {
        question: "Do numbers in titles really improve click-through rates?",
        answer:
          "Yes — studies consistently show that numbered list titles (e.g., '7 Ways to...' or '15 Mistakes...') outperform generic titles by 20–45% in CTR. Odd numbers (7, 11, 15) tend to perform slightly better than even numbers.",
      },
      {
        question: "How do I know if my title matches search intent?",
        answer:
          "Search the keyword in Google and examine the top-ranking pages' titles and formats. If most results are 'X Ways to...', that tells you the searcher expects a listicle. If results are 'What is X', they want a definition. Your title should match the dominant format on the SERP.",
      },
    ],
    relatedToolSlugs: ["meta-title-generator", "reading-time-calculator", "ai-content-brief-generator"],
    relatedKeywords: ["blog post titles", "content marketing", "headline writing", "blog SEO"],
    iconEmoji: "📝",
  },
  {
    slug: "reading-time-calculator",
    name: "Reading Time Calculator",
    tagline: "Know your content length before you publish",
    description:
      "Calculate the estimated reading time of any piece of content and get benchmarks for your content type. See if your article, blog post, or landing page copy is the right length for your audience and SEO goals.",
    category: "Content Marketing",
    type: "calculator",
    tags: ["reading time", "word count", "content length", "blog posts"],
    featured: false,
    isNew: false,
    updatedAt: "2025-03-05",
    difficulty: "Beginner",
    timeToComplete: "1 min",
    howItWorks: [
      {
        step: "Enter Word Count",
        description: "Paste your content or enter the word count. The tool uses an average adult reading speed of 238 words per minute.",
      },
      {
        step: "Select Content Type",
        description: "Choose your content type (blog post, landing page, email, whitepaper) to receive length benchmarks for your format.",
      },
      {
        step: "Check Your Benchmarks",
        description: "See your estimated reading time, comparison to top-ranking content in your niche, and a recommendation on whether to expand or trim.",
      },
    ],
    faqs: [
      {
        question: "What is the ideal blog post length for SEO?",
        answer:
          "The average first-page Google result contains approximately 1,447 words. Long-form content (1,500–2,500 words) consistently outranks shorter content for competitive, informational keywords. However, quality and relevance matter more than length — a concise 800-word post can outrank a padded 3,000-word article.",
      },
      {
        question: "Does content length affect time-on-page metrics?",
        answer:
          "Yes. Longer content naturally increases time-on-page (dwell time), which is a positive engagement signal. However, if content is poorly structured or irrelevant, visitors bounce quickly regardless of length. Use headers, bullet points, and visuals to maintain engagement throughout.",
      },
      {
        question: "What reading speed should I use for planning?",
        answer:
          "The average adult reads approximately 200–250 words per minute for online content (slightly slower than print due to screen reading). For specialist or technical content, assume 150–180 words per minute. Children and non-native speakers read more slowly, around 100–150 WPM.",
      },
      {
        question: "Should service pages be long or short?",
        answer:
          "Service pages benefit from moderate length: 600–1,500 words is typically optimal. They need enough content to cover the service thoroughly, build trust, and include relevant keywords — but not so much that they lose the visitor's attention before reaching the CTA.",
      },
    ],
    relatedToolSlugs: ["blog-title-generator", "meta-title-generator", "ai-content-brief-generator"],
    relatedKeywords: ["content length", "word count", "reading time", "blog post length", "SEO content"],
    iconEmoji: "⏱️",
  },

  // ─── Email Marketing ───────────────────────────────────────────────────────
  {
    slug: "email-roi-calculator",
    name: "Email Marketing ROI Calculator",
    tagline: "Calculate the revenue potential of your email list",
    description:
      "Project the monthly and annual revenue potential of your email marketing programme. Enter your list size, open rate, click-through rate, and average conversion value to see your email channel's full ROI — including comparison to paid media cost-per-lead.",
    category: "Email Marketing",
    type: "calculator",
    tags: ["email marketing", "email ROI", "list size", "open rate", "email revenue"],
    featured: false,
    isNew: false,
    updatedAt: "2025-04-30",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Enter Your List Metrics",
        description: "Input your email list size, average open rate (%), and click-through rate (%) for your campaigns.",
      },
      {
        step: "Add Conversion Data",
        description: "Enter your average conversion rate from email clicks and the average revenue value per conversion.",
      },
      {
        step: "See Your ROI",
        description: "View projected monthly revenue, annual revenue, and cost-per-lead compared to paid channels, plus tips to improve each metric.",
      },
    ],
    faqs: [
      {
        question: "What is the average ROI of email marketing?",
        answer:
          "Email marketing consistently delivers one of the highest ROIs of any digital channel — on average, USD 36 for every USD 1 spent (DMA, 2023). This makes it significantly more cost-effective than paid search (avg. ~$2 per dollar spent) for most businesses.",
      },
      {
        question: "What is a good email open rate?",
        answer:
          "Average open rates vary by industry but generally fall between 20–40% for B2B and 25–45% for B2C lists. Marketing, advertising, and technology sectors see lower open rates (~18–22%), while non-profit and government emails often exceed 35%.",
      },
      {
        question: "How do I improve my email click-through rate?",
        answer:
          "Improve CTR by: using a single, clear CTA per email (not multiple competing links); making the CTA button large and visually distinct; personalising content for each segment; keeping email copy concise and benefit-focused; and A/B testing subject lines, send times, and CTA copy.",
      },
      {
        question: "What email frequency is optimal?",
        answer:
          "Most B2B audiences respond well to 2–4 emails per month. E-commerce brands can often send 3–7 emails weekly. The right frequency depends on content quality — if every email provides genuine value, higher frequency is sustainable. Monitor unsubscribe rates; anything above 0.5% per campaign signals over-sending.",
      },
    ],
    relatedToolSlugs: ["email-subject-line-tester", "conversion-rate-calculator", "marketing-roi-calculator"],
    relatedKeywords: ["email marketing ROI", "email revenue", "email list", "email marketing strategy"],
    iconEmoji: "📧",
  },
  {
    slug: "email-subject-line-tester",
    name: "Email Subject Line Tester",
    tagline: "Test your subject lines before you hit send",
    description:
      "Analyse your email subject line for length, spam trigger words, emoji usage, personalisation, and emotional appeal. Get an overall score out of 100 and specific improvement suggestions to maximise your open rate.",
    category: "Email Marketing",
    type: "generator",
    tags: ["email subject line", "open rate", "email marketing", "spam words"],
    featured: false,
    isNew: true,
    updatedAt: "2025-06-10",
    difficulty: "Beginner",
    timeToComplete: "2 min",
    howItWorks: [
      {
        step: "Enter Your Subject Line",
        description: "Type or paste your email subject line into the tool. Include the preview text (pre-header) if you have one for a more complete analysis.",
      },
      {
        step: "Select Your Audience",
        description: "Choose B2B or B2C audience type and your industry to apply relevant benchmarks and spam word filters.",
      },
      {
        step: "Review Your Score",
        description: "See your subject line score, flags for spam trigger words, character count, and personalisation tips — with rewritten alternatives.",
      },
    ],
    faqs: [
      {
        question: "What makes an email subject line effective?",
        answer:
          "The most effective subject lines are: short (35–50 characters for full mobile display), personalised (using the recipient's first name increases open rates by 26%), create curiosity or urgency without being clickbait, clearly indicate the email's value, and avoid spam trigger words.",
      },
      {
        question: "What words should I avoid in email subject lines?",
        answer:
          "Common spam trigger words include: 'Free', 'Earn money', 'Act now', 'Click here', 'Guaranteed', 'No risk', 'Congratulations', 'Winner', and excessive punctuation (!!!, ???). These can trigger spam filters or damage sender reputation.",
      },
      {
        question: "Do emojis in subject lines improve open rates?",
        answer:
          "Emojis can improve open rates when used sparingly and appropriately for the brand tone. Studies show a 20–25% improvement in open rates with a single relevant emoji. Avoid using more than one emoji, and always test with your specific audience — B2B audiences generally respond less positively to emojis.",
      },
      {
        question: "What is the optimal email subject line length?",
        answer:
          "Aim for 35–50 characters (6–10 words) so the subject line displays in full on mobile devices. Over 60% of emails are opened on mobile. Shorter subject lines (under 30 characters) can also perform well by creating intrigue.",
      },
    ],
    relatedToolSlugs: ["email-roi-calculator", "blog-title-generator", "ai-content-brief-generator"],
    relatedKeywords: ["email subject line", "email open rate", "email marketing", "email copywriting"],
    iconEmoji: "📬",
  },

  // ─── Analytics ─────────────────────────────────────────────────────────────
  {
    slug: "conversion-rate-calculator",
    name: "Conversion Rate Calculator",
    tagline: "Turn traffic data into revenue projections",
    description:
      "Calculate your conversion rate, cost per conversion, and revenue per visitor from any traffic source. Model improvement scenarios to see the revenue impact of even small conversion rate lifts — and understand whether to invest in more traffic or better conversion.",
    category: "Analytics",
    type: "calculator",
    tags: ["conversion rate", "CRO", "cost per conversion", "revenue per visitor"],
    featured: false,
    isNew: false,
    updatedAt: "2025-04-15",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      {
        step: "Enter Traffic & Conversions",
        description: "Input your monthly website visitors and the number of conversions (leads, sales, sign-ups) in the same period.",
      },
      {
        step: "Add Revenue Data",
        description: "Enter your average conversion value and monthly marketing spend to calculate cost per conversion and marketing ROI.",
      },
      {
        step: "Model Improvements",
        description: "Use the scenario modeller to see what happens to revenue if you improve conversion rate by 0.5%, 1%, or 2% — without spending more on traffic.",
      },
    ],
    faqs: [
      {
        question: "What is a good conversion rate for a website?",
        answer:
          "The average website conversion rate across industries is 2–5%. E-commerce typically converts at 1–4%, B2B lead generation at 2–5%, and service businesses at 3–8% (depending on the quality of traffic and the offer). Focus on beating your own historical average rather than industry figures.",
      },
      {
        question: "How do I improve my conversion rate?",
        answer:
          "CRO (Conversion Rate Optimisation) improvements include: faster page load speeds, clearer value propositions above the fold, fewer form fields, social proof (reviews, case studies, client logos), strong CTAs, mobile optimisation, and A/B testing key page elements.",
      },
      {
        question: "Should I invest in more traffic or better conversion?",
        answer:
          "If your conversion rate is below 1%, focus on conversion first — more traffic to a broken funnel is wasted spend. Once you're converting at 2%+, additional traffic investment makes sense. A 1% CVR improvement often delivers more ROI than doubling your ad budget.",
      },
      {
        question: "What is a micro-conversion?",
        answer:
          "Micro-conversions are small actions that indicate engagement and intent before a main conversion: newsletter sign-ups, content downloads, video views, product page visits, and add-to-cart actions. Tracking micro-conversions helps identify where users drop off in the funnel.",
      },
    ],
    relatedToolSlugs: ["cost-per-lead-calculator", "marketing-roi-calculator", "google-ads-budget-calculator"],
    relatedKeywords: ["conversion rate", "CRO", "website conversions", "Google Analytics"],
    iconEmoji: "🔄",
  },
  {
    slug: "cost-per-lead-calculator",
    name: "Cost Per Lead Calculator",
    tagline: "Benchmark your lead generation efficiency across channels",
    description:
      "Calculate and compare your cost per lead (CPL) across multiple marketing channels. Understand which channels are most efficient for your business and how to allocate budget to maximise the number of qualified leads within your marketing spend.",
    category: "Analytics",
    type: "calculator",
    tags: ["cost per lead", "CPL", "lead generation", "marketing efficiency", "channel ROI"],
    featured: false,
    isNew: false,
    updatedAt: "2025-03-22",
    difficulty: "Beginner",
    timeToComplete: "4 min",
    howItWorks: [
      {
        step: "Add Your Channels",
        description: "Enter the monthly spend and number of leads generated for each marketing channel (Google Ads, social media, SEO, email, events).",
      },
      {
        step: "Weight Lead Quality",
        description: "Optionally assign a lead quality score to each channel (1–5) to account for the fact that leads from different sources convert to customers at different rates.",
      },
      {
        step: "Compare & Optimise",
        description: "View CPL for each channel, ranked best to worst. See which channels deliver the lowest cost qualified leads and where to reallocate budget.",
      },
    ],
    faqs: [
      {
        question: "What is a good cost per lead?",
        answer:
          "CPL varies dramatically by industry. B2B technology: USD 50–200. Legal services: USD 150–400. Healthcare: USD 30–100. Real estate: USD 50–200. Digital marketing services: USD 40–150. Focus on cost per qualified lead rather than cost per raw lead, as lead quality varies by channel.",
      },
      {
        question: "Which marketing channel has the lowest cost per lead?",
        answer:
          "SEO consistently produces the lowest long-term CPL once established (often USD 10–30 for organic leads), but requires 6–12 months of investment. Email marketing to existing lists has near-zero CPL. Google Ads and paid social have higher CPL but generate leads immediately. A balanced mix is optimal.",
      },
      {
        question: "How do I reduce my cost per lead?",
        answer:
          "Reduce CPL by improving landing page conversion rates, tightening audience targeting in paid ads, using negative keywords to reduce wasted spend, improving ad Quality Scores, nurturing leads through email sequences, and investing in organic channels (SEO, content) that compound over time.",
      },
      {
        question: "Should I focus on CPL or cost per acquisition (CPA)?",
        answer:
          "CPA (cost per acquisition/sale) is the more meaningful metric because it accounts for lead-to-customer conversion rates. A channel with a high CPL but high close rate may deliver lower CPA than a channel with a low CPL but poor quality leads. Track both.",
      },
    ],
    relatedToolSlugs: ["conversion-rate-calculator", "marketing-roi-calculator", "google-ads-budget-calculator"],
    relatedKeywords: ["cost per lead", "lead generation", "CPL", "marketing ROI", "channel performance"],
    iconEmoji: "🎯",
  },

  // ─── Website Development ───────────────────────────────────────────────────
  {
    slug: "core-web-vitals-checklist",
    name: "Core Web Vitals Checklist",
    tagline: "Pass Google's page experience signals and protect your rankings",
    description:
      "A practical 35-point checklist to diagnose and fix Core Web Vitals issues — Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). Includes specific developer actions and tools for each metric.",
    category: "Website Development",
    type: "checklist",
    tags: ["Core Web Vitals", "LCP", "INP", "CLS", "page speed", "technical SEO"],
    featured: false,
    isNew: false,
    updatedAt: "2025-05-05",
    difficulty: "Advanced",
    timeToComplete: "45 min",
    howItWorks: [
      {
        step: "Measure Your Current Vitals",
        description: "Run your URL through Google PageSpeed Insights and Chrome User Experience Report (CrUX) to get your current LCP, INP, and CLS scores.",
      },
      {
        step: "Work Through Each Section",
        description: "The checklist is divided by metric. Tick each optimisation as you implement it and note the before/after score improvement.",
      },
      {
        step: "Verify & Monitor",
        description: "After implementing fixes, re-run PageSpeed Insights. Set up Google Search Console Core Web Vitals monitoring to track improvements over 28 days.",
      },
    ],
    faqs: [
      {
        question: "What are Core Web Vitals?",
        answer:
          "Core Web Vitals are a set of specific, measurable metrics Google uses to evaluate the real-world user experience of web pages. They consist of LCP (loading performance), INP (interactivity), and CLS (visual stability). Google uses these as ranking signals as part of its Page Experience update.",
      },
      {
        question: "What is a good LCP score?",
        answer:
          "A good LCP score is 2.5 seconds or less. 2.5–4.0 seconds needs improvement. Over 4 seconds is poor. LCP measures the time it takes for the largest visible content element (usually a hero image or headline) to load from when the user first navigates to the page.",
      },
      {
        question: "What causes Cumulative Layout Shift (CLS)?",
        answer:
          "CLS is caused by elements shifting on the page during loading: images without defined dimensions, fonts loading late (FOUT/FOIT), dynamically injected content (ads, banners), and animations that shift other content. Reserve space for images and ads with explicit width/height attributes.",
      },
      {
        question: "How much do Core Web Vitals affect rankings?",
        answer:
          "Core Web Vitals are a confirmed Google ranking signal, but content relevance and authority remain the primary factors. However, at the same relevance level, pages with better Core Web Vitals have a ranking advantage. For competitive queries where results are closely matched, CWV can be the tiebreaker.",
      },
    ],
    relatedToolSlugs: ["seo-audit-checklist", "robots-txt-generator", "mobile-readiness-checklist"],
    relatedKeywords: ["Core Web Vitals", "LCP", "page speed", "website performance", "technical SEO"],
    iconEmoji: "⚡",
  },
  {
    slug: "mobile-readiness-checklist",
    name: "Mobile Readiness Checklist",
    tagline: "Audit your website for the 60%+ of visitors browsing on mobile",
    description:
      "A 28-point mobile UX and technical checklist to ensure your website delivers an excellent experience across all devices. From tap target sizes and viewport settings to mobile load speeds and mobile-first indexing requirements.",
    category: "Website Development",
    type: "checklist",
    tags: ["mobile SEO", "mobile UX", "responsive design", "mobile-first indexing"],
    featured: false,
    isNew: false,
    updatedAt: "2025-04-01",
    difficulty: "Intermediate",
    timeToComplete: "20 min",
    howItWorks: [
      {
        step: "Test on Real Devices",
        description: "Test your site on iOS and Android devices, not just browser emulation. Use BrowserStack for cross-device testing if you don't have physical devices.",
      },
      {
        step: "Run the Checklist",
        description: "Work through each category: Viewport & Layout, Navigation, Forms, Speed, Content, and Mobile SEO. Flag any failing items.",
      },
      {
        step: "Prioritise by Impact",
        description: "Address speed and layout issues first (highest impact), then navigation and forms, then content and SEO-specific items.",
      },
    ],
    faqs: [
      {
        question: "What is mobile-first indexing?",
        answer:
          "Since 2019, Google uses the mobile version of your website as the primary version for indexing and ranking. If your mobile site has missing content, slower load times, or different structured data compared to desktop, your rankings may be negatively affected.",
      },
      {
        question: "What is the minimum tap target size for mobile?",
        answer:
          "Google recommends a minimum tap target size of 48×48 CSS pixels for buttons and links, with at least 8 pixels between targets. Targets smaller than 44×44 pixels are difficult to tap accurately on touchscreens and increase user frustration.",
      },
      {
        question: "How do I test my website's mobile speed?",
        answer:
          "Use Google PageSpeed Insights (mobile tab), Google's Test My Site tool, and Chrome DevTools with mobile device emulation. Focus on Time to Interactive (TTI) and First Contentful Paint (FCP) on a simulated 4G connection to reflect typical mobile conditions.",
      },
      {
        question: "Should my mobile site have the same content as desktop?",
        answer:
          "Yes. Since Google primarily uses the mobile version for indexing, any content hidden on mobile (text, images, schema markup) may not be indexed. Avoid using hidden content patterns like collapsed tabs that Google cannot reliably crawl on mobile.",
      },
    ],
    relatedToolSlugs: ["core-web-vitals-checklist", "seo-audit-checklist", "conversion-rate-calculator"],
    relatedKeywords: ["mobile SEO", "responsive design", "mobile-first indexing", "mobile UX"],
    iconEmoji: "📱",
  },

  // ─── Business Tools ────────────────────────────────────────────────────────
  {
    slug: "marketing-budget-calculator",
    name: "Marketing Budget Calculator",
    tagline: "Allocate your marketing budget for maximum growth",
    description:
      "Calculate the recommended marketing budget for your business based on revenue, growth stage, and industry. Then see how to allocate that budget across channels — SEO, Google Ads, social media, content, and email — for optimal results.",
    category: "Business Tools",
    type: "calculator",
    tags: ["marketing budget", "budget allocation", "digital marketing spend", "ROI planning"],
    featured: true,
    isNew: false,
    updatedAt: "2025-05-25",
    difficulty: "Intermediate",
    timeToComplete: "8 min",
    howItWorks: [
      {
        step: "Enter Business Metrics",
        description: "Input your annual revenue (or monthly revenue target), industry, and growth stage (startup, growth, established, enterprise).",
      },
      {
        step: "Set Your Priorities",
        description: "Select your primary marketing goal: brand awareness, lead generation, e-commerce sales, or customer retention.",
      },
      {
        step: "Get Your Budget Plan",
        description: "Receive a total budget recommendation as a percentage of revenue, with a suggested channel allocation and expected outcomes per channel.",
      },
    ],
    faqs: [
      {
        question: "What percentage of revenue should be spent on marketing?",
        answer:
          "The U.S. SBA recommends 7–8% of revenue for B2C businesses and 2–5% for B2B. High-growth companies and startups often invest 15–25%+ to build market share. Established businesses with strong organic presence can operate effectively at 3–5%. The right figure depends on growth targets, competition, and profit margins.",
      },
      {
        question: "How should I allocate my marketing budget across channels?",
        answer:
          "A common starting allocation for SMBs: SEO/content 25–30%, paid search 25–30%, social media 15–20%, email 10–15%, analytics/tools 5–10%. Adjust based on where your customers are and your current strengths. Invest more in channels where you already see positive ROI.",
      },
      {
        question: "Should I invest in SEO or Google Ads first?",
        answer:
          "If you need leads immediately, start with Google Ads for quick results while building your SEO foundation in parallel. SEO takes 3–6 months to show meaningful results but compounds over time. Google Ads stops delivering the moment you pause spend. The ideal strategy runs both simultaneously.",
      },
      {
        question: "How do I justify marketing spend to stakeholders?",
        answer:
          "Connect every channel to measurable outcomes: CPL, CPA, revenue attributed, ROAS. Set clear quarterly targets and report progress monthly. Present the cost of not marketing (market share loss to competitors) alongside the expected ROI. Use this calculator's output as part of your budget proposal.",
      },
    ],
    relatedToolSlugs: ["marketing-roi-calculator", "google-ads-budget-calculator", "cost-per-lead-calculator"],
    relatedKeywords: ["marketing budget", "budget allocation", "digital marketing spend", "marketing strategy"],
    iconEmoji: "💼",
  },
  {
    slug: "marketing-roi-calculator",
    name: "Marketing ROI Calculator",
    tagline: "Prove the value of every pound and dirham you spend on marketing",
    description:
      "Calculate the true return on investment from your marketing activities. Factor in all marketing costs — staff, agencies, tools, and ad spend — against attributed revenue to get an accurate picture of your marketing programme's profitability.",
    category: "Business Tools",
    type: "calculator",
    tags: ["marketing ROI", "return on investment", "marketing performance", "attribution"],
    featured: false,
    isNew: false,
    updatedAt: "2025-04-08",
    difficulty: "Beginner",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Enter All Marketing Costs",
        description: "Input your total monthly marketing investment including ad spend, agency fees, software subscriptions, and staff costs attributed to marketing.",
      },
      {
        step: "Add Revenue Attribution",
        description: "Enter the revenue attributed to marketing during the same period. Use your CRM or analytics platform for multi-touch attribution where possible.",
      },
      {
        step: "View Your ROI",
        description: "See your marketing ROI percentage, revenue multiplier, and cost per AED of revenue generated — with benchmarks for your industry.",
      },
    ],
    faqs: [
      {
        question: "What is a good marketing ROI?",
        answer:
          "A 5:1 revenue-to-cost ratio (400% ROI) is generally considered strong for most businesses. A 10:1 ratio (900% ROI) is exceptional. Below 2:1 means your marketing costs are barely justified. However, benchmarks vary — industries with long sales cycles (B2B, real estate) accept lower short-term ROI for higher lifetime value.",
      },
      {
        question: "How do I accurately attribute revenue to marketing?",
        answer:
          "Use a multi-touch attribution model in your CRM or analytics platform. Common models include: last-click (simple but credits only the final touchpoint), linear (distributes credit equally), and data-driven (uses ML to weight touchpoints by actual conversion influence). Google Analytics 4 supports data-driven attribution by default.",
      },
      {
        question: "Should I include staff costs in my marketing ROI calculation?",
        answer:
          "Yes — for a true ROI picture, include all costs attributable to marketing: agency fees, ad spend, software/tools, a proportional share of marketing staff salaries, and design or production costs. Excluding staff costs overstates ROI and leads to under-resourced marketing teams.",
      },
      {
        question: "What is the difference between marketing ROI and ROAS?",
        answer:
          "ROAS (Return on Ad Spend) measures revenue generated per dollar of advertising spend only. Marketing ROI includes all marketing costs (staff, tools, agencies, content production) against all marketing-attributed revenue. ROAS is a campaign-level metric; ROI is a programme-level metric.",
      },
    ],
    relatedToolSlugs: ["marketing-budget-calculator", "roas-calculator", "customer-lifetime-value-calculator"],
    relatedKeywords: ["marketing ROI", "return on investment", "marketing performance", "revenue attribution"],
    iconEmoji: "💹",
  },
  {
    slug: "customer-lifetime-value-calculator",
    name: "Customer Lifetime Value Calculator",
    tagline: "Know how much each customer is really worth to your business",
    description:
      "Calculate the lifetime value (LTV) of your average customer. Understand how much you can afford to spend to acquire each customer and model the revenue impact of improving retention, purchase frequency, or average order value.",
    category: "Business Tools",
    type: "calculator",
    tags: ["customer lifetime value", "CLV", "LTV", "customer retention", "acquisition cost"],
    featured: false,
    isNew: false,
    updatedAt: "2025-03-30",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Enter Customer Purchase Data",
        description: "Input your average order/transaction value, average purchase frequency per year, and average customer lifespan in years.",
      },
      {
        step: "Add Your Margins",
        description: "Enter your gross profit margin (%) to calculate the true profit contribution of each customer over their lifetime.",
      },
      {
        step: "See CLV & Max CPA",
        description: "View your Customer Lifetime Value, the maximum cost per acquisition (CPA) you can afford, and a model showing the impact of improving each input by 10%.",
      },
    ],
    faqs: [
      {
        question: "What is Customer Lifetime Value (CLV)?",
        answer:
          "CLV is the total net profit a business expects to generate from a customer throughout their entire relationship. It helps businesses determine how much to invest in acquiring and retaining customers. Formula: CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan × Gross Margin.",
      },
      {
        question: "What is the ideal LTV to CAC ratio?",
        answer:
          "A healthy LTV:CAC ratio is 3:1 or higher — meaning a customer is worth at least 3× what it costs to acquire them. A ratio below 1:1 means you're losing money on each customer. Ratios above 5:1 may indicate underinvestment in growth and missed market share opportunities.",
      },
      {
        question: "How can I increase customer lifetime value?",
        answer:
          "Increase CLV by: improving retention (loyalty programmes, excellent service), increasing purchase frequency (email marketing, personalised recommendations), upselling and cross-selling, increasing average order value (bundling, minimum order incentives), and reducing churn through proactive customer success.",
      },
      {
        question: "How does CLV affect my marketing budget decisions?",
        answer:
          "CLV sets your maximum allowable customer acquisition cost (CAC). If your CLV is AED 5,000, you can afford to spend up to AED 1,600–1,700 per new customer (at a 3:1 ratio) and still be profitable. Without knowing CLV, marketing budget decisions are guesswork.",
      },
    ],
    relatedToolSlugs: ["marketing-roi-calculator", "cost-per-lead-calculator", "conversion-rate-calculator"],
    relatedKeywords: ["customer lifetime value", "CLV", "LTV", "customer acquisition cost", "retention"],
    iconEmoji: "👥",
  },

  // ─── AI Marketing ──────────────────────────────────────────────────────────
  {
    slug: "ai-marketing-prompt-library",
    name: "AI Marketing Prompt Library",
    tagline: "500+ proven prompts to supercharge your marketing with AI",
    description:
      "A curated library of 500+ professionally crafted AI prompts organised by marketing function. From SEO and ad copywriting to social media captions and email sequences — find, customise, and apply prompts for ChatGPT, Claude, and Gemini.",
    category: "AI Marketing",
    type: "reference",
    tags: ["AI prompts", "ChatGPT", "Claude", "AI marketing", "content generation"],
    featured: true,
    isNew: true,
    updatedAt: "2025-06-22",
    difficulty: "Beginner",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Browse by Category",
        description: "Navigate the prompt library by marketing function: SEO, Ads, Social, Email, Content, Analytics, or Strategy.",
      },
      {
        step: "Customise the Prompt",
        description: "Each prompt includes [PLACEHOLDERS] to fill in with your brand, product, audience, and goals. Customise and copy in seconds.",
      },
      {
        step: "Apply & Iterate",
        description: "Paste the prompt into ChatGPT, Claude, or Gemini. Follow the included tips to refine the output if needed.",
      },
    ],
    faqs: [
      {
        question: "What AI models work with these prompts?",
        answer:
          "The prompts are designed to work with all major large language models: ChatGPT (GPT-4o), Claude (3.5 Sonnet/Opus), Google Gemini (1.5 Pro), and Microsoft Copilot. Some prompts include model-specific tips for optimal output.",
      },
      {
        question: "Can I use AI-generated content for SEO?",
        answer:
          "Yes — Google's guidelines explicitly state that AI-generated content is acceptable if it is helpful, accurate, and designed for users, not to manipulate rankings. The key is quality and editorial review. Always fact-check AI output and add unique insights, data, and brand voice before publishing.",
      },
      {
        question: "How do I write a better AI prompt?",
        answer:
          "Effective prompts include: a clear role instruction ('Act as an expert digital marketer'), specific context (industry, audience, product), a defined output format (list, email, paragraph), constraints (word count, tone), and examples of what good looks like. The more context you provide, the better the output.",
      },
      {
        question: "What marketing tasks are best suited to AI?",
        answer:
          "AI excels at: first-draft content creation, generating variations for A/B testing, summarising research, repurposing content across formats, writing ad copy variations, creating content briefs, and analysing competitor messaging. AI struggles with: real-time data, specific local knowledge, and original creative concepts without direction.",
      },
    ],
    relatedToolSlugs: ["ai-content-brief-generator", "blog-title-generator", "ad-copy-generator"],
    relatedKeywords: ["AI marketing", "ChatGPT prompts", "AI content", "marketing automation", "AI strategy"],
    iconEmoji: "🤖",
  },
  {
    slug: "ai-content-brief-generator",
    name: "AI Content Brief Generator",
    tagline: "Build better briefs — get better content from writers and AI",
    description:
      "Generate a comprehensive content brief in minutes. Input your target keyword, audience, and goals to receive a detailed brief including recommended word count, H2 structure, key points to cover, competitor gaps, and suggested internal links.",
    category: "AI Marketing",
    type: "generator",
    tags: ["content brief", "AI content", "SEO content", "content strategy", "briefing"],
    featured: false,
    isNew: true,
    updatedAt: "2025-06-18",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      {
        step: "Enter Your Keyword & Goal",
        description: "Provide your primary keyword, content type (blog, guide, service page, landing page), and the primary goal (rank for keyword, generate leads, educate).",
      },
      {
        step: "Define Your Audience",
        description: "Describe your target reader: their role, pain points, knowledge level, and what they need to know to take action.",
      },
      {
        step: "Generate Your Brief",
        description: "Receive a complete content brief with title options, recommended heading structure, key points per section, word count target, and a prompt to use with your AI writing tool.",
      },
    ],
    faqs: [
      {
        question: "What should a content brief include?",
        answer:
          "A complete content brief should include: target keyword and search intent, recommended title options, audience definition and pain points, suggested H2 structure with key points per section, target word count, tone and style guidelines, internal and external links to include, CTA recommendation, and a definition of 'done' (what does a successful piece achieve).",
      },
      {
        question: "How does a content brief improve AI content quality?",
        answer:
          "AI models produce better output when given more specific context. A brief gives the AI the keyword, structure, audience, and tone — reducing the need for multiple rounds of editing. A well-briefed AI can produce a publication-ready first draft in one attempt rather than requiring 5+ iterations.",
      },
      {
        question: "Should I create a brief for every piece of content?",
        answer:
          "For any content targeting a keyword or with a defined conversion goal, yes — even a 10-minute brief pays for itself in time saved during editing and revision. Short social posts or internal emails don't need formal briefs.",
      },
      {
        question: "Can I use this brief with freelance writers?",
        answer:
          "Absolutely. The output is formatted as a professional brief suitable for both human writers and AI tools. For freelancers, add your brand voice guidelines, any mandatory sources to reference, and a target publish date to make the brief complete.",
      },
    ],
    relatedToolSlugs: ["ai-marketing-prompt-library", "blog-title-generator", "reading-time-calculator"],
    relatedKeywords: ["content brief", "AI content", "content strategy", "SEO content brief", "content marketing"],
    iconEmoji: "📋",
  },

  // ── Phase 14B Tools ────────────────────────────────────────────────────────

  {
    slug: "seo-audit-tool",
    name: "SEO Audit Tool",
    tagline: "Full website SEO health check in under 2 minutes",
    description:
      "Run a comprehensive SEO audit across technical, on-page, and off-page signals. Enter your URL and get a prioritised action list covering meta tags, heading structure, page speed, mobile-friendliness, broken links, schema markup, and more — all benchmarked against Google's ranking criteria.",
    category: "SEO",
    type: "checklist",
    tags: ["SEO audit", "website health", "technical SEO", "on-page SEO", "site analysis"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "5 min",
    howItWorks: [
      { step: "Enter Your URL", description: "Paste your website or landing page URL into the audit tool — no account or installation required." },
      { step: "Audit Runs Instantly", description: "The tool checks 40+ SEO factors including meta tags, headings, image alt text, canonical tags, page speed signals, and structured data." },
      { step: "Get a Prioritised Action Plan", description: "Receive a scored report with critical, medium, and low-priority issues. Fix the red items first for the fastest ranking gains." },
    ],
    faqs: [
      { question: "How often should I run an SEO audit?", answer: "Run a full audit quarterly, or after major site changes such as a redesign, CMS migration, or new product launch. Monitor your Core Web Vitals monthly." },
      { question: "What is a good SEO audit score?", answer: "Above 80 is generally healthy. Scores between 60–79 indicate fixable issues. Below 60 suggests critical problems that are likely suppressing your rankings significantly." },
      { question: "Does this tool check backlinks?", answer: "This tool focuses on on-site and technical factors. For backlink analysis, pair it with a tool like Ahrefs or Google Search Console's link report." },
      { question: "Will fixing audit issues guarantee a ranking improvement?", answer: "Fixing technical errors removes barriers to ranking — it doesn't guarantee positions. But issues like broken pages, duplicate content, and missing meta tags actively suppress your ability to rank, so fixing them is always worthwhile." },
    ],
    relatedToolSlugs: ["seo-roi-calculator", "core-web-vitals-checker", "xml-sitemap-validator"],
    relatedKeywords: ["SEO audit", "website audit", "technical SEO checklist", "SEO health check", "on-page SEO"],
    iconEmoji: "🔍",
    educationalContent: [
      {
        heading: "What Is an SEO Audit and Why Does It Matter?",
        body: "An SEO audit is a systematic review of every factor that influences your website's visibility in search engines. Google evaluates hundreds of signals — from page speed and mobile usability to content quality and structured data — and any one of them can hold your site back. A regular audit identifies which signals are working for you and which are creating friction that prevents your pages from reaching the rankings they deserve.",
      },
      {
        heading: "The Three Pillars of a Complete SEO Audit",
        body: "A thorough audit covers three areas. Technical SEO examines crawlability, indexation, site speed, and mobile-friendliness — these are the foundations search engines need to access and understand your content. On-page SEO reviews your title tags, headings, content quality, internal links, and keyword usage on each page. Off-page SEO looks at your backlink profile, domain authority, and brand signals. Most quick wins are found in technical and on-page issues, which this tool prioritises.",
      },
      {
        heading: "How to Prioritise Your Audit Findings",
        body: "Not every audit issue has the same impact. Critical errors — broken pages, duplicate content, missing canonical tags, pages blocked by robots.txt — should be fixed immediately as they directly prevent Google from indexing your content. Medium-priority issues like missing alt text, slow images, or thin content should be scheduled for the next sprint. Low-priority improvements such as heading hierarchy and internal link anchor text can be addressed during routine content updates. Work the list in order and you will see measurable improvements within 4–8 weeks.",
      },
    ],
  },

  {
    slug: "seo-roi-calculator",
    name: "SEO ROI Calculator",
    tagline: "Calculate the true return on your SEO investment",
    description:
      "Justify your SEO budget with hard numbers. Enter your current organic traffic, average conversion rate, deal value, and estimated traffic growth targets to calculate projected revenue, payback period, and 12-month ROI. Ideal for marketing managers presenting the business case for SEO to stakeholders.",
    category: "SEO",
    type: "calculator",
    tags: ["SEO ROI", "organic traffic value", "SEO investment", "return on investment", "SEO budget"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      { step: "Enter Your Traffic & Conversion Baseline", description: "Input your current monthly organic visitors, lead conversion rate, and average contract or order value." },
      { step: "Set Your Growth Targets", description: "Enter your projected traffic growth (%) after 6 and 12 months based on your keyword targets and content plan." },
      { step: "See Your Full ROI Projection", description: "The calculator outputs projected revenue uplift, SEO cost as a percentage of revenue, payback period, and 12-month ROI compared to paid alternatives." },
    ],
    faqs: [
      { question: "How do I estimate SEO traffic growth?", answer: "Conservative estimates for a well-executed SEO programme are 20–40% year-on-year growth. Aggressive campaigns targeting high-volume keywords can reach 100%+ in competitive niches within 12–18 months. We recommend using a conservative 25% for initial projections." },
      { question: "What conversion rate should I use?", answer: "Average B2B website conversion rates are 2–5%. If you don't know your rate, use 3% as a starting point and update the calculator once you have actual data from Google Analytics." },
      { question: "How long before SEO generates a positive ROI?", answer: "Most businesses see positive SEO ROI within 6–12 months for mid-competition keywords. Highly competitive industries may take 12–18 months, but the compounding nature of organic rankings makes the long-term ROI far superior to paid channels." },
      { question: "Does this calculator account for agency fees?", answer: "Yes — enter your total monthly SEO spend (agency retainer or in-house salary equivalent) and the calculator factors this into the payback and ROI calculations." },
    ],
    relatedToolSlugs: ["seo-audit-tool", "keyword-difficulty-checker", "marketing-roi-calculator"],
    relatedKeywords: ["SEO ROI", "organic traffic value", "SEO investment calculator", "digital marketing ROI", "SEO payback"],
    iconEmoji: "📈",
    educationalContent: [
      {
        heading: "Why SEO ROI Is Notoriously Hard to Measure",
        body: "Unlike Google Ads where every conversion is tracked to an exact spend, SEO results are cumulative and multi-touch. A visitor may find your blog post organically in month 1, return via a branded search in month 3, and convert via a direct visit in month 5. Attribution models often credit the last click, undervaluing the organic touchpoint. This calculator uses a simplified but directionally accurate model that most CFOs find credible for budget approval.",
      },
      {
        heading: "The Compounding Advantage of SEO Investment",
        body: "Paid ads stop the moment you stop paying. SEO builds an asset — your organic rankings — that continues to generate traffic even if you pause spending. A blog post that ranks on page one today will typically continue producing leads for 2–5 years with minimal maintenance. This compounding effect means the true ROI of SEO grows significantly over a 3-year horizon compared to any paid channel at equivalent spend.",
      },
      {
        heading: "Key Inputs That Most Businesses Get Wrong",
        body: "The biggest mistake is using website-wide conversion rates instead of organic-specific rates. Organic traffic converts 3–5× better than paid traffic on average because users are further along in the research phase. Use your Google Analytics organic segment conversion rate, not your blended site rate. Second, use your customer lifetime value — not just the first transaction — when calculating deal value to capture the full revenue impact.",
      },
    ],
  },

  {
    slug: "keyword-difficulty-checker",
    name: "Keyword Difficulty Checker",
    tagline: "Find out how hard it really is to rank for your target keyword",
    description:
      "Estimate the competitive difficulty of any keyword before you invest in content creation. Input a keyword and receive an estimated difficulty score, monthly search volume range, suggested domain authority needed to compete, recommended content length, and a verdict on whether to target, monitor, or avoid the keyword.",
    category: "SEO",
    type: "calculator",
    tags: ["keyword difficulty", "keyword research", "SEO competition", "domain authority", "search volume"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      { step: "Enter Your Keyword", description: "Type any keyword or phrase you're considering targeting. Be as specific as possible — long-tail keywords have lower difficulty and higher intent." },
      { step: "Set Your Domain Context", description: "Enter your website's estimated Domain Authority (DA) so the tool can compare your competitive strength against the keyword's typical top-10 requirements." },
      { step: "Get Your Targeting Verdict", description: "Receive a difficulty score, competition level, estimated time to rank, content requirements, and a clear recommendation: Target Now, Target with Strong Content, or Monitor & Build Authority First." },
    ],
    faqs: [
      { question: "What is a good keyword difficulty score to target?", answer: "New or low-authority sites (DA 0–30) should focus on keywords scoring 0–30 difficulty. Established sites (DA 30–60) can target up to 60. High-authority domains (DA 60+) can compete for 60–100 scores, though it still requires exceptional content." },
      { question: "How is keyword difficulty calculated?", answer: "Keyword difficulty is primarily driven by the domain authority and backlink profiles of the pages currently ranking in the top 10. A keyword with ten DA-90 pages in the top 10 is almost impossible for a new site to crack without years of authority building." },
      { question: "Should I only target easy keywords?", answer: "Not exclusively. A balanced strategy targets quick-win low-difficulty keywords to build early traffic and authority, while publishing cornerstone content targeting medium-difficulty keywords to build long-term ranking assets. Ignoring competitive keywords entirely means missing high-intent searches." },
      { question: "How does this differ from the Keyword Difficulty Estimator?", answer: "This checker focuses on competitive analysis — can YOUR site rank? — whereas the estimator provides a broader difficulty score based on industry signals. Use both together for the most complete picture before investing in content creation." },
    ],
    relatedToolSlugs: ["seo-audit-tool", "seo-roi-calculator", "keyword-difficulty-estimator"],
    relatedKeywords: ["keyword difficulty", "keyword research", "SEO competition", "long-tail keywords", "domain authority"],
    iconEmoji: "🎯",
    educationalContent: [
      {
        heading: "Keyword Difficulty vs Search Volume: Finding the Sweet Spot",
        body: "The biggest mistake in keyword research is targeting only high-volume keywords. A keyword with 50,000 monthly searches but difficulty score of 90 will take years to rank for — if ever. A keyword with 500 monthly searches at difficulty 20 can be on page one within 90 days with strong content. The real opportunity lies in the intersection: moderate volume (500–5,000 searches/month) with difficulty under 40. These 'golden keywords' generate significant traffic without requiring domain authority you don't yet have.",
      },
      {
        heading: "How Search Intent Changes Difficulty Strategy",
        body: "A keyword's difficulty score doesn't tell the full story. 'What is SEO' (informational) has different competitive dynamics than 'SEO agency Dubai' (transactional). Informational keywords reward content depth and backlinks. Transactional keywords reward local relevance, reviews, and service pages. Always align your content format to the search intent before worrying about difficulty — a well-matched piece of content often outranks technically superior content that doesn't satisfy intent.",
      },
      {
        heading: "Building a Keyword Targeting Roadmap",
        body: "Effective keyword strategy works in tiers. Start with Tier 3 — long-tail, low-difficulty keywords (blog posts, guides, FAQs) — to build topical authority and early traffic. Progress to Tier 2 — medium-difficulty category and service terms — once you have 20–30 indexed pages. Finally, target Tier 1 — high-competition, high-volume head terms — after establishing domain authority through consistent link acquisition and content publishing. Trying to skip tiers is the most common reason SEO campaigns fail to deliver ROI.",
      },
    ],
  },

  {
    slug: "meta-description-generator",
    name: "Meta Description Generator",
    tagline: "Write click-worthy meta descriptions that boost organic CTR",
    description:
      "Create compelling meta descriptions that match search intent and drive clicks. Input your page topic, target keyword, and audience, and receive 3 ready-to-use meta descriptions with character counts, click-through rate predictions, and optimisation tips. Perfect for SEO managers, content writers, and business owners updating their site.",
    category: "SEO",
    type: "generator",
    tags: ["meta description", "SERP snippet", "organic CTR", "on-page SEO", "search snippet"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      { step: "Enter Your Page Details", description: "Provide your page topic, the primary keyword you're targeting, and your target audience (e.g. 'small business owners in Dubai')." },
      { step: "Choose a Writing Style", description: "Select your preferred tone — informational, persuasive, or question-led — to match your brand voice and content type." },
      { step: "Get Three Optimised Variants", description: "Receive three distinct meta descriptions with character counts, keyword placement scores, and a recommendation on which variant is likely to achieve the highest CTR." },
    ],
    faqs: [
      { question: "How long should a meta description be?", answer: "Google typically displays 155–160 characters on desktop and around 120 characters on mobile. Aim for 145–155 characters to avoid truncation on most devices. Always include your primary keyword within the first 100 characters." },
      { question: "Do meta descriptions affect SEO rankings?", answer: "Meta descriptions are not a direct ranking factor. However, they strongly influence click-through rate, and a higher CTR signals relevance to Google — which can indirectly improve rankings over time. More importantly, a compelling description drives more traffic from your existing rankings." },
      { question: "Can Google rewrite my meta description?", answer: "Yes — Google rewrites meta descriptions in roughly 70% of searches. They are most likely to use yours when it closely matches the search query and clearly describes the page content. Keeping descriptions specific, accurate, and keyword-relevant maximises the chances Google uses your version." },
      { question: "Should every page have a unique meta description?", answer: "Yes. Duplicate meta descriptions are a missed CTR opportunity and a minor negative signal. Priority pages — homepage, service pages, top blog posts — should always have crafted, unique descriptions. For large sites with thousands of pages, use a templated approach for lower-priority pages." },
    ],
    relatedToolSlugs: ["meta-title-generator", "seo-audit-tool", "blog-title-generator"],
    relatedKeywords: ["meta description", "SERP CTR", "on-page SEO", "search snippet optimisation", "Google snippet"],
    iconEmoji: "✍️",
    educationalContent: [
      {
        heading: "Why Your Meta Description Is Your First Sales Pitch",
        body: "Before a user clicks your result, before they read your content, they read your meta description. It is a 155-character advertisement for your page inside Google's results. Yet most businesses either leave it blank (letting Google guess) or write a generic summary. A well-crafted meta description answers the user's implicit question — 'is this result worth my click?' — with specificity, a clear benefit, and a soft call to action. Improving your meta descriptions across your top 20 pages is one of the highest-leverage on-page SEO actions you can take.",
      },
      {
        heading: "The Formula for a High-CTR Meta Description",
        body: "The most effective meta descriptions follow a simple formula: [Problem or Desire] + [Your Solution] + [Specific Proof or Benefit] + [Soft CTA]. For example: 'Struggling to rank in Dubai? Our SEO agency has delivered 300+ first-page results for UAE businesses. See our case studies.' This structure earns clicks because it matches intent, demonstrates credibility, and creates a reason to act. Notice how it avoids vague language like 'we offer quality services' — specificity always outperforms generality in SERPs.",
      },
      {
        heading: "Common Meta Description Mistakes That Hurt CTR",
        body: "The four most damaging mistakes are: (1) Exceeding 160 characters — truncated descriptions look incomplete and reduce trust; (2) Omitting the target keyword — Google bolds matching words in descriptions, making keyword-relevant descriptions visually stand out; (3) Copying the first sentence of the page — this rarely addresses the searcher's intent; (4) Using passive voice and corporate jargon — users skim descriptions in milliseconds and respond to clear, active language. Audit your top-traffic pages first, as improving their descriptions can lift traffic without any ranking change.",
      },
    ],
  },

  {
    slug: "google-ads-roi-calculator",
    name: "Google Ads ROI Calculator",
    tagline: "Calculate your full Google Ads return including hidden costs",
    description:
      "Go beyond ROAS to calculate your true Google Ads profitability. Factor in ad spend, agency management fees, product/service margins, and customer lifetime value to determine your real cost per acquisition, profit per conversion, and overall campaign ROI — with a breakeven analysis showing exactly what you need to hit profitability.",
    category: "Google Ads",
    type: "calculator",
    tags: ["Google Ads ROI", "PPC return", "cost per acquisition", "campaign profitability", "ad spend efficiency"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      { step: "Enter Your Campaign Costs", description: "Input your total monthly ad spend plus any agency or management fees. The tool distinguishes between media spend and overhead costs." },
      { step: "Add Revenue & Margin Data", description: "Enter your average order value or contract value, gross margin percentage, and close rate if you're tracking leads rather than direct sales." },
      { step: "See True Profitability", description: "Get your true ROI (not just ROAS), profit per conversion, breakeven cost-per-click, and a 12-month projection comparing your current performance against target benchmarks." },
    ],
    faqs: [
      { question: "What is the difference between ROAS and ROI?", answer: "ROAS (Return on Ad Spend) measures revenue generated per AED spent on ads: AED 5 revenue per AED 1 spend = 5x ROAS. ROI measures net profit after ALL costs — ad spend, fees, cost of goods, and overhead. A campaign with 5x ROAS can still be unprofitable if margins are thin. This calculator shows you the ROI figure your finance team actually cares about." },
      { question: "What is a good Google Ads ROI?", answer: "A positive ROI (greater than 0%) is the baseline. Strong performers achieve 100–300% ROI in competitive B2B markets. E-commerce benchmarks range from 200–500% ROI when factoring in customer lifetime value. The right benchmark depends entirely on your margins and LTV, which is why this calculator is essential." },
      { question: "How should I account for leads vs direct sales?", answer: "For lead-gen campaigns, multiply your conversion volume by your sales close rate and average deal value. If you get 100 leads per month at a 20% close rate with a AED 10,000 deal value, your revenue attribution is AED 200,000 — use this as your revenue figure in the calculator." },
      { question: "Should agency fees be included in my ROI calculation?", answer: "Absolutely. Agency fees are a real cost of running your Google Ads. Excluding them inflates your reported ROI and can mask a truly unprofitable campaign. Always calculate ROI on total marketing investment, not just media spend." },
    ],
    relatedToolSlugs: ["google-ads-budget-calculator", "roas-calculator", "cost-per-lead-calculator"],
    relatedKeywords: ["Google Ads ROI", "PPC ROI calculator", "cost per acquisition", "Google Ads profitability", "campaign ROI"],
    iconEmoji: "💰",
    educationalContent: [
      {
        heading: "Why ROAS Alone Misleads Marketing Decisions",
        body: "Return on Ad Spend is the most commonly reported Google Ads metric — and one of the most misleading when used in isolation. A 4x ROAS sounds impressive, but if your product margin is 25%, you are breaking even at best after cost of goods alone. Add agency fees, fulfilment costs, and customer service overhead, and you may be actively losing money. True ROI calculations that factor in ALL revenue and ALL costs give you the number that determines whether your campaigns are actually building your business.",
      },
      {
        heading: "The Hidden Costs of Google Ads Most Businesses Miss",
        body: "Beyond media spend, the true cost of Google Ads includes: management fees (agency retainers or in-house PPC manager salaries), landing page development and A/B testing costs, creative production for display and video ads, attribution platform costs, and the cost of your sales team's time following up on leads. These overhead costs typically add 30–50% to the media spend figure. Building them into your ROI model gives you a realistic picture and helps you make smarter bidding and budget decisions.",
      },
      {
        heading: "How Customer Lifetime Value Changes the ROI Equation",
        body: "Calculating ROI on the first transaction significantly undervalues campaigns that drive repeat customers. If your average customer makes 3 purchases over their lifetime at an average order value of AED 500, their LTV is AED 1,500 — not AED 500. Advertising to acquire a customer at AED 400 CPA looks expensive at a single-order view but delivers 275% LTV ROI. Businesses that measure Google Ads ROI against LTV almost always justify higher bids, winning the auctions their single-order competitors can't afford to enter.",
      },
    ],
  },

  {
    slug: "website-cost-calculator",
    name: "Website Cost Calculator",
    tagline: "Estimate your website development budget before you talk to an agency",
    description:
      "Get a realistic cost estimate for your website project before entering any agency conversations. Select your website type, required features, CMS preference, and design complexity to receive a detailed cost breakdown — from basic brochure sites to complex ecommerce platforms — with timeline estimates and the key questions every client should ask their developer.",
    category: "Website Development",
    type: "calculator",
    tags: ["website cost", "web design pricing", "development budget", "website investment", "agency pricing"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "5 min",
    howItWorks: [
      { step: "Select Your Website Type", description: "Choose from brochure site, service business site, ecommerce store, SaaS platform, or custom web application — each has a distinct cost profile." },
      { step: "Configure Your Feature Set", description: "Toggle the features you need: blog, booking system, payment gateway, CRM integration, multilingual support, live chat, and more. The estimate updates in real time." },
      { step: "Receive Your Budget Range & Timeline", description: "Get a realistic development cost range (low/mid/high), recommended platforms, typical agency vs freelancer cost breakdown, and a project timeline estimate." },
    ],
    faqs: [
      { question: "How much does a business website cost in the UAE?", answer: "A basic brochure website in the UAE ranges from AED 3,000–15,000. A professional service business site with SEO runs AED 15,000–50,000. Custom ecommerce or web applications start from AED 50,000 and scale to AED 500,000+ depending on complexity. These ranges reflect established agency rates, not freelance marketplace pricing." },
      { question: "Should I choose WordPress, Shopify, or a custom build?", answer: "WordPress suits most service businesses and blogs — it's flexible, SEO-friendly, and has a vast ecosystem. Shopify is the clear choice for ecommerce with physical inventory. Custom builds are only justified when your requirements cannot be met by any established platform — they cost 3–5× more and take longer to deliver." },
      { question: "Why do agency quotes vary so much for the same website?", answer: "Agencies price based on their hourly rate, discovery process, design depth, post-launch support, and their experience with your industry. A AED 5,000 quote and a AED 50,000 quote for 'a website' are literally describing different deliverables — the brief is just too vague to compare them meaningfully." },
      { question: "What ongoing costs should I budget for after launch?", answer: "Plan for hosting (AED 1,000–5,000/year), domain renewal (AED 50–300/year), SSL certificate (often included in hosting), security updates and maintenance (AED 500–3,000/month), and content updates. Larger sites on managed hosting with regular support can run AED 5,000–15,000/month in ongoing costs." },
    ],
    relatedToolSlugs: ["marketing-budget-calculator", "landing-page-grader", "core-web-vitals-checker"],
    relatedKeywords: ["website cost", "web design price Dubai", "development budget", "website investment", "CMS comparison"],
    iconEmoji: "💻",
    educationalContent: [
      {
        heading: "What Actually Determines Website Development Cost",
        body: "Website costs are driven by four factors: scope (how many pages and features), design complexity (template vs bespoke vs interactive), platform (WordPress vs Shopify vs custom), and the agency's expertise level. The single biggest cost driver is custom functionality — each bespoke feature (booking engine, custom dashboard, real-time pricing) can add AED 5,000–30,000 to a project. Understanding which features are truly essential vs. nice-to-have is the most valuable exercise a client can do before issuing a brief.",
      },
      {
        heading: "The Hidden Costs Every Website Budget Misses",
        body: "Most website budgets focus on development but overlook: content creation (copywriting, photography, and video can match or exceed development cost), SEO setup (keyword research, on-page optimisation, and technical setup), training your team on the CMS, integration testing, and post-launch bug fixes. A well-managed project budgets 20–30% of the build cost for these ancillary requirements. Skipping them is the leading reason websites underperform despite large initial investments.",
      },
      {
        heading: "Build vs Buy vs Template: A Decision Framework",
        body: "Template-based builds (using premium themes on WordPress or Shopify) deliver 80% of a custom site's quality at 30% of the cost and timeline. They are the right choice for most SMEs. Semi-custom builds — a template customised significantly by a developer — hit the sweet spot for businesses that need brand differentiation without custom-build pricing. Fully custom builds are justified only when: your business model is the product (SaaS, marketplace, platform), your competitive advantage depends on the user experience, or regulatory requirements mandate it. In all other cases, the extra cost rarely delivers proportionate return.",
      },
    ],
  },

  {
    slug: "landing-page-grader",
    name: "Landing Page Grader",
    tagline: "Grade your landing page against 25 conversion best practices",
    description:
      "Know exactly why your landing page isn't converting. Answer 25 questions about your page's hero, trust signals, form design, messaging clarity, and CTA, and receive an overall conversion score with a detailed breakdown of what to fix first. Used by marketing teams to prioritise CRO improvements before A/B testing.",
    category: "Website Development",
    type: "checklist",
    tags: ["landing page optimisation", "CRO", "conversion rate", "A/B testing", "page grader"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "8 min",
    howItWorks: [
      { step: "Answer the Conversion Audit Questions", description: "Work through 25 yes/no questions covering your hero section, headline, CTA, trust signals, form design, page speed, and mobile experience." },
      { step: "Review Your Scores by Category", description: "See how your page scores across 5 categories: Clarity, Trust, Urgency, Friction Reduction, and Technical Performance. Each category is scored independently." },
      { step: "Get Your Fix-It Priority List", description: "Receive a ranked list of improvements ordered by their estimated impact on conversion rate, with specific recommendations for each failing element." },
    ],
    faqs: [
      { question: "What is a good landing page conversion rate?", answer: "Average landing page conversion rates vary by industry and traffic source: B2B lead-gen pages average 2–5%, SaaS free trial pages 5–15%, and e-commerce pages 1–3%. Google Ads traffic typically converts at 3–6%. If you're below industry benchmarks, this tool will identify exactly which elements are causing the gap." },
      { question: "Should I A/B test or fix obvious issues first?", answer: "Fix obvious issues first — always. A/B testing is valuable when your page is fundamentally sound and you're optimising marginal improvements. If your hero headline is unclear, your form has 10 fields, or you have no social proof, fix those before running split tests. This grader helps you identify which category you're in." },
      { question: "How many form fields should a landing page have?", answer: "Research consistently shows conversion rates drop for each additional form field beyond 3. For lead-gen pages, aim for 3 fields maximum (name, email, phone or company). Every additional field needs to be justified by the value it provides to your sales process versus the conversions it costs you." },
      { question: "What makes a landing page hero section effective?", answer: "An effective hero answers three questions within 3 seconds: What is this? Who is it for? What should I do next? It should have a benefit-led headline (not a tagline), a supporting subheadline that adds specificity, a single primary CTA button, and a trust signal (rating, client logos, or a key statistic). Anything that doesn't serve these purposes is clutter." },
    ],
    relatedToolSlugs: ["conversion-rate-calculator", "core-web-vitals-checker", "website-cost-calculator"],
    relatedKeywords: ["landing page optimisation", "CRO audit", "conversion rate", "landing page checklist", "lead generation"],
    iconEmoji: "📊",
    educationalContent: [
      {
        heading: "The Psychology Behind High-Converting Landing Pages",
        body: "Conversion rate optimisation is fundamentally applied psychology. Visitors make micro-decisions within milliseconds of arriving on your page: Is this relevant to my search? Is this company trustworthy? Is this too complicated? Each element of your page either resolves or amplifies these anxieties. The highest-impact elements — headline clarity, primary CTA contrast, social proof placement, and form length — influence the largest share of these decisions. Improving them systematically, guided by a structured audit like this grader, consistently outperforms random design changes.",
      },
      {
        heading: "The Five Conversion Killers Found on Most Landing Pages",
        body: "After auditing thousands of landing pages, five issues account for the majority of underperformance: (1) Headline focused on features rather than outcomes — 'Advanced Marketing Platform' vs 'Get 3× More Leads in 90 Days'; (2) Competing CTAs that split visitor attention; (3) No social proof above the fold — logos, ratings, or testimonials need to be immediately visible; (4) Forms with unnecessary fields that raise commitment anxiety; (5) Page load times over 3 seconds — each additional second of load time reduces conversions by 7%. The grader scores all five.",
      },
      {
        heading: "How to Use Grading to Prioritise Your CRO Roadmap",
        body: "Not every failing grade point has the same conversion impact. This grader weights improvements by their typical effect size: headline clarity and CTA design typically move the needle 15–30%; social proof placement 10–20%; form length 10–15%; page speed 5–10%; and visual hierarchy 5–15%. Tackle high-weight failures first, then run controlled A/B tests to validate each change. Document your changes and results — this institutional knowledge compounds into a permanent conversion advantage.",
      },
    ],
  },

  {
    slug: "core-web-vitals-checker",
    name: "Core Web Vitals Checker",
    tagline: "Audit your site's Core Web Vitals and fix ranking issues fast",
    description:
      "Core Web Vitals are Google's user experience ranking factors — and failing them can suppress your rankings even with excellent content. Enter your URL to audit your LCP, CLS, and INP scores against Google's thresholds, identify the specific elements causing failures, and receive a prioritised fix list with developer-ready recommendations.",
    category: "Website Development",
    type: "checklist",
    tags: ["Core Web Vitals", "LCP", "CLS", "INP", "page experience", "Google ranking factors"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Intermediate",
    timeToComplete: "5 min",
    howItWorks: [
      { step: "Enter Your Page URL", description: "Input the URL of the page you want to audit — your homepage, landing page, or any page where rankings matter most." },
      { step: "Review Your Vitals Scores", description: "See your LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), and INP (Interaction to Next Paint) scores colour-coded as Good, Needs Improvement, or Poor." },
      { step: "Get Developer-Ready Fix Instructions", description: "Each failing metric is accompanied by the specific element causing the issue and concrete fix recommendations you can hand directly to your developer." },
    ],
    faqs: [
      { question: "Do Core Web Vitals directly affect Google rankings?", answer: "Yes — Google confirmed Core Web Vitals as ranking signals in 2021. They act as a tiebreaker between pages of similar quality: if your content is equal to a competitor's, better Web Vitals can push you above them. On highly competitive queries, CWV differences can mean 1–3 position swings." },
      { question: "What are the Core Web Vitals thresholds?", answer: "LCP (loading): Good < 2.5s, Needs Improvement 2.5–4s, Poor > 4s. CLS (visual stability): Good < 0.1, Needs Improvement 0.1–0.25, Poor > 0.25. INP (interactivity): Good < 200ms, Needs Improvement 200–500ms, Poor > 500ms. Your page needs to hit 'Good' on all three to be considered CWV-passing." },
      { question: "My CWV pass in PageSpeed Insights but fail in Search Console — why?", answer: "PageSpeed Insights uses lab data (simulated conditions). Google Search Console uses field data — real user experiences on real devices. Field data accounts for users on slower connections and older phones, which is why it's more representative and more important. Always prioritise fixing field data issues first." },
      { question: "What is the fastest way to improve my LCP score?", answer: "The fastest LCP wins come from: preloading your hero image using a <link rel='preload'> tag, hosting images on a CDN rather than your server, eliminating render-blocking scripts above the fold, and moving to a faster hosting provider. These changes alone can improve LCP by 1–2 seconds on many sites." },
    ],
    relatedToolSlugs: ["seo-audit-tool", "landing-page-grader", "website-cost-calculator"],
    relatedKeywords: ["Core Web Vitals", "LCP fix", "CLS fix", "page experience", "Google page speed", "website performance"],
    iconEmoji: "⚡",
    educationalContent: [
      {
        heading: "Understanding Google's Core Web Vitals: LCP, CLS, and INP",
        body: "Core Web Vitals measure three dimensions of user experience. Largest Contentful Paint (LCP) measures how fast the main content of a page loads — it should happen within 2.5 seconds. Cumulative Layout Shift (CLS) measures visual stability — unexpected layout jumps (like an image pushing text down) create a frustrating experience that Google penalises. Interaction to Next Paint (INP) replaced FID in 2024 and measures overall page responsiveness — how quickly the page reacts to all user interactions, not just the first one. Failing any of the three can suppress your rankings.",
      },
      {
        heading: "Why Mobile Core Web Vitals Matter More Than Desktop",
        body: "Google uses mobile-first indexing, meaning your mobile CWV scores are the ones that influence rankings — not your desktop scores. Most sites pass desktop CWV with ease but fail on mobile due to unoptimised images, heavy JavaScript that blocks rendering, and font loading delays. When auditing your CWV, always check mobile scores first. If you're short on development resources, prioritise the mobile CWV fixes that block the most ranking potential.",
      },
      {
        heading: "The Developer Handoff: Turning CWV Data into Fixes",
        body: "The gap between knowing your CWV scores and actually improving them is usually a developer communication problem. Developers need specific information: which element is the LCP element (use Chrome DevTools to identify it), what is causing the CLS (look for images without width/height attributes, dynamic content insertion, and late-loading web fonts), and which interactions are slow for INP (use the Interaction Observer in DevTools). Our checker provides this information in developer-ready format, reducing back-and-forth and getting fixes shipped faster.",
      },
    ],
  },

  {
    slug: "utm-builder",
    name: "UTM Builder",
    tagline: "Build clean, consistent UTM tracking URLs for every campaign",
    description:
      "Create properly formatted UTM tracking URLs with a click. Paste your destination URL, fill in your campaign parameters, and get a clean tracking link you can use in emails, social ads, banners, and any offline-to-online campaign. Includes a UTM naming convention guide to keep your analytics data clean and reportable in Google Analytics 4 and any BI tool.",
    category: "Analytics",
    type: "generator",
    tags: ["UTM parameters", "campaign tracking", "Google Analytics", "marketing attribution", "URL builder"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "2 min",
    howItWorks: [
      { step: "Enter Your Destination URL", description: "Paste the page URL you're sending traffic to — your homepage, a landing page, a product page, or a blog post." },
      { step: "Fill In Your Campaign Parameters", description: "Add utm_source (where the traffic comes from), utm_medium (how it travels), utm_campaign (what initiative it's part of), and optionally utm_term and utm_content for granular tracking." },
      { step: "Copy Your Tracking URL", description: "Get a clean, properly encoded URL ready to paste into your email tool, ad platform, or printed material. The tool also shows you how this data will appear in GA4 reports." },
    ],
    faqs: [
      { question: "Which UTM parameters are mandatory?", answer: "Technically, no UTM parameter is mandatory — but source, medium, and campaign are the minimum meaningful set. Without these three, your analytics data will lack the context needed to compare campaign performance. Term and content are optional and most useful for paid search and multivariate testing." },
      { question: "Should I use UTM parameters on internal links?", answer: "No — never UTM-tag internal links on your own website. When a user clicks an internally UTM-tagged link, Google Analytics starts a new session and resets their source, destroying the original attribution data. UTMs are for external traffic entering your site only." },
      { question: "Are UTM parameters case-sensitive?", answer: "Yes — 'Google' and 'google' are treated as separate sources in Google Analytics 4. This is why consistent naming conventions are critical. Always use lowercase and underscores or hyphens for spaces. Inconsistent casing is the most common cause of fragmented analytics data." },
      { question: "How do UTM parameters appear in GA4?", answer: "In GA4, UTM data flows into the Traffic Acquisition report under Session source/medium and Campaign dimensions. You can build custom Explorations to cross-reference UTM campaign with conversion events, giving you a full picture of which campaigns drive which outcomes — not just sessions." },
    ],
    relatedToolSlugs: ["conversion-rate-calculator", "cost-per-lead-calculator", "marketing-roi-calculator"],
    relatedKeywords: ["UTM parameters", "UTM builder", "campaign tracking", "Google Analytics tracking", "marketing attribution"],
    iconEmoji: "🔗",
    educationalContent: [
      {
        heading: "What Are UTM Parameters and Why Every Marketer Needs Them",
        body: "UTM parameters are short text strings appended to URLs that tell Google Analytics exactly where a visitor came from and which campaign sent them. Without UTMs, GA4 groups much of your traffic as 'Direct' or '(not set)' — making it impossible to measure which email campaign, social post, or ad generated a conversion. With UTMs, every session is labelled with its true source, giving you the attribution data you need to make intelligent budget decisions.",
      },
      {
        heading: "Building a UTM Naming Convention That Keeps Data Clean",
        body: "The biggest UTM mistake isn't forgetting to add parameters — it's adding them inconsistently. 'Email' and 'email' and 'EMAIL' create three separate sources in GA4. The solution is a naming convention document your whole team follows. Define: always use lowercase, use hyphens not spaces (email-newsletter not email newsletter), standardise your source list (google, facebook, linkedin, email, offline), and define your medium taxonomy (cpc, organic-social, email, display, print). Five minutes building the convention saves hours untangling messy data.",
      },
      {
        heading: "Advanced UTM Strategies: Beyond Basic Campaign Tracking",
        body: "Once basic UTM tracking is in place, advanced strategies include: using utm_content to A/B test ad creative variants and see which image or copy drives more conversions; tracking offline touchpoints by printing QR codes with UTM URLs on business cards or event materials; building UTM-tagged landing pages for each influencer or partner to measure referral quality; and automating UTM generation in email platforms like Klaviyo or Mailchimp to ensure every campaign link is tracked without manual intervention.",
      },
    ],
  },

  {
    slug: "xml-sitemap-validator",
    name: "XML Sitemap Validator",
    tagline: "Validate your XML sitemap for errors that block Google indexing",
    description:
      "An XML sitemap tells search engines which pages to crawl and how often. Errors in your sitemap can prevent Google from discovering your content, delay indexing of new pages, and waste crawl budget on pages that should be excluded. This validator checks your sitemap for common errors and produces a submission-ready report for Google Search Console.",
    category: "SEO",
    type: "checklist",
    tags: ["XML sitemap", "sitemap validation", "Google indexing", "crawl budget", "technical SEO"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      { step: "Enter Your Sitemap URL", description: "Paste the full URL of your XML sitemap — typically yoursite.com/sitemap.xml or yoursite.com/sitemap_index.xml for larger sites." },
      { step: "Validation Runs Automatically", description: "The tool checks for malformed XML, HTTP error URLs, blocked pages (robots.txt conflicts), noindex pages in the sitemap, and sitemap size limits." },
      { step: "Get a Clean Submission Report", description: "Receive a pass/fail for each check with specific URLs causing issues, instructions to fix each error, and a verification link for Google Search Console submission." },
    ],
    faqs: [
      { question: "What is an XML sitemap and do I need one?", answer: "An XML sitemap is a file that lists the URLs on your website you want search engines to index. It's not strictly required — Google can crawl your site without one — but it significantly speeds up discovery of new content, ensures all your important pages are considered for indexing, and helps Google understand your site's priority structure. It's especially important for large sites, new websites, and sites with pages that are poorly internally linked." },
      { question: "What are the most common XML sitemap errors?", answer: "The most common errors are: including URLs that return 301 redirects (use the final destination URL instead), including noindex pages (a contradiction that confuses crawlers), blocked URLs in robots.txt (another contradiction), incorrect lastmod dates, and exceeding the 50,000 URL or 50MB limit per sitemap file." },
      { question: "How often should I update my sitemap?", answer: "Your CMS (WordPress, Shopify, etc.) should generate and update your sitemap automatically whenever you publish or update content. If it doesn't, submit a new version to Google Search Console after major content additions. Google re-crawls submitted sitemaps when they detect changes via your ping or Search Console submission." },
      { question: "Should every page be in my sitemap?", answer: "No — only include pages you want indexed. Exclude admin pages, thank-you pages, duplicate content URLs, pagination pages (or handle with canonical tags), and any page blocked by noindex tags. Including pages you don't want indexed wastes crawl budget and can confuse Google's signals about your site's content quality." },
    ],
    relatedToolSlugs: ["seo-audit-tool", "robots-txt-generator", "schema-generator"],
    relatedKeywords: ["XML sitemap", "sitemap validator", "Google indexing", "crawl budget", "technical SEO audit"],
    iconEmoji: "🗺️",
    educationalContent: [
      {
        heading: "Why Your XML Sitemap Is a Crawl Budget Investment",
        body: "Every time Google crawls your website, it allocates a 'crawl budget' — a limit on how many pages it will crawl in a given period. For small sites this is rarely an issue. For sites with thousands of pages — ecommerce, news, portfolio sites — crawl budget management becomes critical. A clean sitemap guides Google to your most important pages first, preventing crawl budget from being wasted on low-value pages like search filter combinations, session-ID URLs, or outdated content. This is why a validated, optimised sitemap is a meaningful ranking input for larger sites.",
      },
      {
        heading: "The Sitemap Contradiction Problem: noindex vs Sitemap Inclusion",
        body: "One of the most common technical SEO errors is including noindex pages in your XML sitemap — a direct contradiction. The sitemap tells Google 'please crawl and index these URLs' while the noindex tag says 'do not index this page.' Google resolves this contradiction by following the noindex tag, but it wastes crawl budget, creates confusing signals, and can delay indexing of your other pages. Always audit your sitemap against your noindex tags — they should never overlap.",
      },
      {
        heading: "Sitemap Structure for Large and Multi-Language Sites",
        body: "Large sites should use a sitemap index file that links to multiple individual sitemaps — one for pages, one for blog posts, one for products, etc. This makes crawl prioritisation more manageable and errors easier to isolate. Multi-language sites using hreflang tags should include all language variants of each URL in the sitemap (or use a separate sitemap per language) so Google correctly identifies and serves the right language version to users in different regions — critical for UAE businesses targeting both English and Arabic audiences.",
      },
    ],
  },

  {
    slug: "schema-generator",
    name: "Schema Generator",
    tagline: "Generate structured data markup for rich search results",
    description:
      "Schema markup helps Google understand your content and display rich results — star ratings, FAQs, products, events, and more — directly in search results, increasing visibility and CTR without changing rankings. Select your schema type, fill in the fields, and get ready-to-paste JSON-LD code for your website.",
    category: "SEO",
    type: "generator",
    tags: ["schema markup", "JSON-LD", "structured data", "rich snippets", "Google rich results"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Intermediate",
    timeToComplete: "8 min",
    howItWorks: [
      { step: "Select Your Schema Type", description: "Choose from Organisation, LocalBusiness, Article, FAQ, Product, Review, Event, Service, or BreadcrumbList — the most impactful types for UAE businesses." },
      { step: "Fill In Your Details", description: "Complete the structured fields for your chosen schema type. The tool validates required vs. recommended fields and shows you which properties unlock rich result eligibility." },
      { step: "Copy Your JSON-LD Code", description: "Get clean, validated JSON-LD code to paste into your page's <head> section or CMS. The tool also generates a Google Rich Results Test link so you can verify your markup immediately." },
    ],
    faqs: [
      { question: "Does schema markup improve my rankings?", answer: "Schema markup is not a direct ranking factor, but it significantly improves your search result appearance. FAQ schema adds expandable questions below your result, Review schema adds star ratings, and Event schema adds dates and locations. These visual enhancements increase CTR by 10–40% on affected queries, meaning more traffic from the same ranking position." },
      { question: "Which schema types should a UAE business implement first?", answer: "Prioritise in this order: (1) Organisation or LocalBusiness — establishes your business identity with Google; (2) FAQ — adds expandable questions to your result for free; (3) Review/AggregateRating — star ratings dramatically increase CTR; (4) Service — for each service page; (5) BreadcrumbList — improves how your URL appears in results. Implement these five and you'll unlock rich results on your most important pages." },
      { question: "What is JSON-LD and why is it preferred over Microdata?", answer: "JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data. Unlike Microdata or RDFa, JSON-LD lives in a single <script> block in your page head — it doesn't require wrapping individual HTML elements, making it far easier to implement and maintain, especially if you're using a CMS." },
      { question: "How do I know if my schema is working?", answer: "Use Google's Rich Results Test (search.google.com/test/rich-results) to validate your markup and see which rich results you're eligible for. Allow 1–4 weeks after implementation for rich results to appear in Search Console's Enhancement reports. Not all pages with valid schema will show rich results — Google selects them based on quality and relevance signals." },
    ],
    relatedToolSlugs: ["seo-audit-tool", "xml-sitemap-validator", "local-seo-scorecard"],
    relatedKeywords: ["schema markup", "structured data", "JSON-LD", "rich snippets", "Google rich results", "FAQ schema"],
    iconEmoji: "🏷️",
    educationalContent: [
      {
        heading: "How Schema Markup Gives You a Larger Footprint in Search Results",
        body: "A standard Google search result shows a title, URL, and meta description — roughly 350 characters of real estate. FAQ schema can double or triple this footprint by adding expandable questions directly beneath your result, pushing competitors further down the page. Review schema adds star ratings that instantly signal social proof. Event schema adds dates and registration links. All of these enhancements appear without any ranking improvement — you win more of the page simply by speaking Google's language.",
      },
      {
        heading: "The 5 Schema Types Every UAE Business Should Implement",
        body: "LocalBusiness schema is the foundation — it tells Google your name, address, phone, opening hours, and accepted payment methods in machine-readable format. This reinforces your Google Business Profile and helps with local pack rankings. FAQ schema is the highest-ROI quick win — one implementation can add 3–5 expandable questions to your result that take up a third of the above-the-fold search page. Service schema on each service page clarifies what you offer. Review schema powered by third-party review platforms adds the star rating display. Organisation schema on your homepage establishes your brand entity with Google's Knowledge Graph.",
      },
      {
        heading: "Common Schema Mistakes That Prevent Rich Results",
        body: "The most frequent schema errors that prevent rich results from appearing: (1) Implementing schema on pages where the marked-up content isn't actually visible to users — Google requires the schema to match on-page content; (2) Using spammy review markup — Google ignores self-serving reviews without third-party verification; (3) Missing required properties — each schema type has required fields; omitting them prevents eligibility; (4) Incorrect nesting of schema types; (5) Not testing with the Rich Results Test before publishing. Our generator validates against all of these rules before producing your code.",
      },
    ],
  },

  {
    slug: "open-graph-preview",
    name: "Open Graph Preview",
    tagline: "Preview and optimise how your pages look when shared on social media",
    description:
      "Every link shared on LinkedIn, Facebook, WhatsApp, and Twitter/X renders a social card — but most websites have broken or missing Open Graph tags that result in blank cards, wrong images, or generic titles. Enter your URL to preview exactly how your page appears on each platform and get specific fixes for any tag issues.",
    category: "Content Marketing",
    type: "generator",
    tags: ["Open Graph", "social sharing", "OG tags", "LinkedIn preview", "Facebook preview", "social media metadata"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "3 min",
    howItWorks: [
      { step: "Enter Your Page URL", description: "Paste the URL of any page on your site — a blog post, service page, or homepage — to fetch its current Open Graph metadata." },
      { step: "Preview Across Platforms", description: "See a live rendering of how your link card will look on LinkedIn, Facebook, Twitter/X, and WhatsApp — each platform has different image dimensions and title truncation rules." },
      { step: "Get Your Tag Fix Instructions", description: "Receive a complete audit of your og:title, og:description, og:image, og:image:width/height, og:type, and Twitter Card tags with specific code snippets to fix any missing or incorrect tags." },
    ],
    faqs: [
      { question: "Why does my link look blank when shared on LinkedIn?", answer: "Blank LinkedIn shares usually mean your og:image is missing, the image URL is not absolute (must start with https://), the image is smaller than LinkedIn's minimum (1200×627px recommended), or the image returns a non-200 HTTP status. LinkedIn is the strictest platform for OG image requirements — use our preview to identify the exact issue." },
      { question: "What size should my Open Graph image be?", answer: "The universally recommended OG image size is 1200×630px (1.91:1 ratio). This renders well on all platforms. Use a JPG or PNG under 8MB. Always include og:image:width and og:image:height tags — without these, platforms may not display the image correctly and will wait for the image to load before determining its dimensions, causing a poor sharing experience." },
      { question: "Does Open Graph affect SEO?", answer: "Not directly — OG tags are for social sharing, not search rankings. However, pages that get shared frequently earn natural backlinks and social signals that have indirect SEO value. More importantly, a compelling OG card increases the click-through rate on shared links, driving real referral traffic without any paid promotion." },
      { question: "How do I update my OG tags on WordPress?", answer: "Install the Yoast SEO or Rank Math plugin — both include a social tab in the page editor where you can set custom OG titles, descriptions, and images per page without touching code. For headless or custom sites, OG tags go in the <head> section of your HTML and can be dynamically generated per page using your templating system." },
    ],
    relatedToolSlugs: ["meta-description-generator", "meta-title-generator", "blog-title-generator"],
    relatedKeywords: ["Open Graph", "social sharing preview", "OG tags", "LinkedIn card", "Facebook share image", "social metadata"],
    iconEmoji: "🖼️",
    educationalContent: [
      {
        heading: "What Is Open Graph and Why It Controls Your Social Presence",
        body: "Open Graph is a protocol (originally created by Facebook) that allows any webpage to specify exactly how it should appear when shared on social media. When someone shares a link on LinkedIn or WhatsApp, the platform reads your OG tags to build the preview card. Without properly configured OG tags, platforms fall back to guessing — often choosing the wrong image, pulling a fragment of text, or displaying a blank card. Every time a link to your site is shared with a broken card, you lose the free branding impression and click opportunity.",
      },
      {
        heading: "Platform-Specific Differences Every Marketer Should Know",
        body: "LinkedIn prioritises og:image at 1200×627px and truncates og:title at 70 characters. Facebook follows the same image ratio but is more forgiving with slightly smaller images. Twitter/X requires its own Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) — OG tags are used as a fallback but dedicated Twitter Card tags perform better. WhatsApp fetches the first og:image it finds and is particularly sensitive to image HTTPS requirements. Our preview tool renders each platform's card separately so you can see and fix platform-specific issues.",
      },
      {
        heading: "Using Open Graph Strategically for Content Marketing",
        body: "Beyond fixing broken tags, use OG metadata strategically. Design your OG images as mini-advertisements — include your brand colours, a bold headline, and a visual element that stops the scroll. Different pages should have different OG images; using the same logo image on every page is a missed opportunity. For blog posts and campaign pages, create custom OG images sized 1200×630px that match the content's value proposition. Track referral traffic from social platforms in GA4 to measure the impact of OG improvements on actual traffic.",
      },
    ],
  },

  {
    slug: "local-seo-scorecard",
    name: "Local SEO Scorecard",
    tagline: "Score your local SEO across 25 ranking signals and close the gaps",
    description:
      "Dominating local search results in Dubai, Abu Dhabi, and across the UAE requires a distinct set of optimisations beyond standard SEO. This scorecard evaluates your Google Business Profile, citation consistency, local content, review velocity, and on-site local signals — and tells you exactly where your local search presence is losing ground to competitors.",
    category: "SEO",
    type: "checklist",
    tags: ["local SEO", "Google Business Profile", "local search", "citation building", "UAE local SEO"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "10 min",
    howItWorks: [
      { step: "Answer 25 Local SEO Questions", description: "Work through questions covering your Google Business Profile completeness, review count and velocity, citation consistency, local content, and on-page local signals like NAP data and LocalBusiness schema." },
      { step: "See Your Score by Pillar", description: "Your results are broken into 5 pillars: GBP Optimisation, Citation & NAP Consistency, Review Management, Local Content, and Technical Local SEO. Each pillar is scored independently." },
      { step: "Get a Local SEO Action Plan", description: "Receive a ranked action plan showing which improvements will have the fastest impact on your local pack and map rankings in your target cities and neighbourhoods." },
    ],
    faqs: [
      { question: "What are the most important local SEO ranking factors?", answer: "Google's local ranking is primarily driven by three factors: Relevance (does your business match the search query?), Distance (how close is the business to the searcher?), and Prominence (how well-known and reviewed is the business?). Of these, prominence — driven by your review count, review quality, citations, and links — is the factor you have the most control over." },
      { question: "How many Google reviews do I need to rank locally?", answer: "There's no magic number, but businesses in the Dubai local pack typically have 50–200+ reviews for competitive terms. More important than total count is recency and response rate. Google favours businesses that consistently earn new reviews over those with many old ones. Aim for at least 5 new reviews per month." },
      { question: "What is NAP consistency and why does it matter?", answer: "NAP stands for Name, Address, Phone number. Your NAP details must be identical across every directory listing, social profile, and your website. Even minor inconsistencies — 'LLC' vs 'L.L.C.', different phone number formats — dilute Google's confidence in your business data and can suppress local rankings. Audit and standardise your NAP details across all platforms." },
      { question: "Is local SEO different for the UAE market?", answer: "Yes — several unique factors affect UAE local SEO: many businesses list both an Arabic and English name (both should be consistent), the UAE uses a PO Box system rather than street addresses (you can still rank, but location accuracy is harder to establish), and Google Maps data quality in some UAE areas lags behind Western markets. Optimising your Google Business Profile with precise map pins, service areas, and Arabic business descriptions helps significantly." },
    ],
    relatedToolSlugs: ["seo-audit-tool", "schema-generator", "keyword-difficulty-checker"],
    relatedKeywords: ["local SEO", "Google Business Profile", "local pack", "Google Maps ranking", "UAE local SEO", "citation building"],
    iconEmoji: "📍",
    educationalContent: [
      {
        heading: "The Three Pillars of Local Search Dominance",
        body: "Local SEO success is built on three interconnected pillars. Your Google Business Profile is the single highest-impact asset — an incomplete or poorly optimised GBP is the most common reason local businesses fail to appear in the map pack. Citation building ensures your business information is consistent and present across the directories, data aggregators, and industry platforms that Google uses to verify your business's legitimacy. Local content — city-specific landing pages, neighbourhood guides, local case studies — gives Google keyword relevance signals that generic service pages cannot provide.",
      },
      {
        heading: "How the Google Local Pack Algorithm Works",
        body: "The local pack — the three businesses shown above organic results with a map — is determined by a separate algorithm from standard organic rankings. It weighs: proximity to the searcher (you can't fully control this), relevance of your GBP category and services to the query (optimise your primary and secondary categories carefully), and authority signals including review volume and sentiment, citation quantity and consistency, GBP engagement rate (calls, website clicks, direction requests), and links from local websites. Businesses that understand and optimise all of these signals systematically dominate their local area.",
      },
      {
        heading: "Local SEO in the UAE: Unique Considerations and Opportunities",
        body: "The UAE market has distinct local SEO characteristics. First, dual-language optimisation matters — many searches occur in Arabic, and businesses that create Arabic-language GBP descriptions and website content reach a segment their English-only competitors miss entirely. Second, the UAE's transient population creates high search volume for 'new to [city]' queries — content addressing this intent earns links and local authority. Third, UAE review platforms (including Google, Zomato, Tripadvisor, and local directories) contribute to prominence signals differently than Western markets. A coordinated review strategy across all relevant platforms builds authority faster than focusing on Google alone.",
      },
    ],
  },

  {
    slug: "business-growth-calculator",
    name: "Business Growth Calculator",
    tagline: "Project your revenue growth and set data-driven targets",
    description:
      "Turn your revenue ambitions into a concrete financial roadmap. Input your current revenue, target growth rate, and the marketing investment you plan to make to get a month-by-month projection showing cumulative revenue, breakeven points, and how different growth scenarios compare over 12 and 36 months — with industry benchmark comparisons for UAE SMEs.",
    category: "Business Tools",
    type: "calculator",
    tags: ["revenue growth", "business projections", "CAGR", "growth rate", "financial planning"],
    isNew: true,
    comingSoon: true,
    updatedAt: "2026-06-26",
    difficulty: "Beginner",
    timeToComplete: "5 min",
    howItWorks: [
      { step: "Enter Your Revenue Baseline", description: "Input your current monthly or annual revenue and your industry sector. The tool uses sector-specific UAE growth benchmarks for comparison." },
      { step: "Set Your Growth Targets & Investment", description: "Enter your target annual growth rate and planned marketing investment. The calculator models conservative, realistic, and aggressive scenarios based on your inputs." },
      { step: "See Your 12 & 36-Month Projections", description: "Get a month-by-month revenue projection, cumulative marketing ROI, breakeven month, and a comparison between organic growth (no additional marketing) and accelerated growth with your planned investment." },
    ],
    faqs: [
      { question: "What is a realistic revenue growth rate for a UAE SME?", answer: "UAE SMEs in services sectors typically grow 15–25% annually in a strong market. High-growth sectors like tech, e-commerce, and professional services can achieve 30–60% annual growth in their early stages. A well-executed digital marketing strategy typically adds 20–40% incremental growth above organic baseline by compounding SEO, paid, and retention efforts." },
      { question: "What is CAGR and how should I use it?", answer: "Compound Annual Growth Rate (CAGR) is the rate at which a business grows over multiple years, assuming reinvestment of growth. It's useful for comparing your growth performance against benchmarks and for setting multi-year targets. A 25% CAGR means your business doubles roughly every 3 years — achievable for established UAE SMEs in growing sectors with consistent marketing investment." },
      { question: "How do I account for seasonality in my projections?", answer: "This calculator uses smoothed monthly projections. To account for UAE-specific seasonality (Ramadan slowdowns, summer departure of expats, peak Q1 and Q4), adjust your monthly targets by 15–25% for high and low seasons. We recommend building a seasonally adjusted version of this projection in a spreadsheet once you've established your baseline." },
      { question: "How much should I invest in marketing to hit my growth target?", answer: "A general benchmark is 5–15% of target revenue for B2B businesses and 10–20% for B2C. Growth-stage businesses targeting rapid expansion often invest 20–30%. Use the Marketing Budget Calculator alongside this tool to size your marketing investment against your growth projections." },
    ],
    relatedToolSlugs: ["marketing-budget-calculator", "customer-lifetime-value-calculator", "marketing-roi-calculator"],
    relatedKeywords: ["business growth", "revenue projections", "CAGR", "growth calculator", "financial planning", "UAE SME growth"],
    iconEmoji: "🚀",
    educationalContent: [
      {
        heading: "Understanding the Mathematics of Business Growth",
        body: "Revenue growth seems simple — earn more than last year. But compound growth has non-linear mathematics that most business owners underestimate. A business growing at 25% annually doesn't just add 25% to this year's number — it adds 25% of a growing base. AED 1M growing at 25% annually becomes AED 3.8M after 6 years without any strategic changes in the growth rate. This compounding dynamic means that small, consistent improvements in growth rate have dramatic effects over a 5-year horizon — which is why sustainable marketing programmes that build brand equity and recurring revenue streams consistently outperform one-off campaigns.",
      },
      {
        heading: "The Marketing Investment That Drives Non-Linear Growth",
        body: "Not all marketing investment drives the same growth. Activities that compound — SEO, email list building, content marketing, brand building — generate diminishing cost per acquisition over time. Activities that plateau — paid advertising, trade events, outbound calling — maintain roughly constant cost per acquisition regardless of spend level. The highest-ROI growth strategies layer compounding activities as the base and use paid channels for immediate revenue needs. A business investing 40% of its marketing budget in compounding activities and 60% in paid channels will outperform one doing the opposite within 18–24 months.",
      },
      {
        heading: "Setting Growth Targets That Finance, Marketing, and Operations Can All Commit To",
        body: "The most common growth planning failure is setting an aspirational revenue target without working backwards through the operational implications. 40% revenue growth sounds exciting until you realise it requires: 40% more sales capacity, 40% more delivery capacity, new customer success processes, and a marketing budget that can generate 40% more qualified pipeline. Use this calculator's projections as the starting point for a cross-functional conversation — finance models the cash flow, operations models the headcount, and marketing models the channel budget required to hit the number. Growth targets only succeed when all three departments have bought in to the plan.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((t) => t.featured);
}

export function getNewTools(): Tool[] {
  return TOOLS.filter((t) => t.isNew);
}

export function getRecentlyUpdatedTools(limit = 6): Tool[] {
  return [...TOOLS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedToolSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((t): t is Tool => t !== undefined);
}

export const TYPE_LABELS: Record<ToolType, string> = {
  calculator: "Calculator",
  generator: "Generator",
  checklist: "Checklist",
  reference: "Reference",
};

export const TYPE_COLORS: Record<ToolType, string> = {
  calculator: "bg-blue-100 text-blue-700",
  generator: "bg-purple-100 text-purple-700",
  checklist: "bg-green-100 text-green-700",
  reference: "bg-amber-100 text-amber-700",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: "text-green-600",
  Intermediate: "text-amber-600",
  Advanced: "text-red-600",
};
