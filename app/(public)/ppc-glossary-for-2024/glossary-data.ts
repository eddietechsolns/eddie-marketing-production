export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
  internalLinks?: { label: string; href: string }[];
  relatedService?: { label: string; href: string };
  relatedBlog?: { label: string; href: string };
  relatedResource?: { label: string; href: string };
  faq?: { q: string; a: string }[];
}

export interface GlossaryGroup {
  letter: string;
  terms: GlossaryTerm[];
}

export const GLOSSARY: GlossaryGroup[] = [
  {
    letter: "A",
    terms: [
      {
        term: "A/B Testing (Ad Experiments)",
        definition: "The practice of running two or more ad variants simultaneously to determine which performs better. In Google Ads, use the Experiments tool to split traffic between a control and a treatment — isolating variables like headline, CTA, landing page, or bidding strategy.",
        relatedTerms: ["Responsive Search Ads", "Quality Score", "Conversion Rate"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Ad Auction",
        definition: "The automated process that runs in milliseconds every time a user searches. Google evaluates every eligible ad based on bid, Quality Score, and expected impact of extensions to determine placement and cost.",
        relatedTerms: ["Ad Rank", "Quality Score", "Bid"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Ad Copy",
        definition: "The written text in a paid advertisement — headlines, descriptions, and display URL. Compelling ad copy improves click-through rate and signals relevance to Google, directly influencing Quality Score.",
        relatedTerms: ["Headline", "Quality Score", "Responsive Search Ads", "Click-Through Rate (CTR)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Ad Extensions",
        definition: "Additional information appended to ads, including sitelinks, callouts, structured snippets, call extensions, and price extensions. Extensions increase ad size, improve CTR, and boost Ad Rank at no extra cost.",
        relatedTerms: ["Ad Rank", "Sitelink Extension", "Call Asset (Call Extension)", "Click-Through Rate (CTR)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Ad Group",
        definition: "A container within a campaign holding a set of related keywords and the ads triggered by those keywords. Tight, themed ad groups improve relevance and Quality Score.",
        relatedTerms: ["Campaign", "Keyword", "Quality Score"],
      },
      {
        term: "Ad Rank",
        definition: "The score that determines your ad's position in search results. Calculated from max CPC bid × Quality Score, plus the expected impact of ad extensions and other ad formats. Higher Ad Rank = better position at lower cost.",
        relatedTerms: ["Quality Score", "Bid", "Ad Extensions", "Impression Share"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "What is a good Ad Rank?",
            a: "Ad Rank is relative to competitors — there's no universal 'good' number. Focus on improving Quality Score (especially CTR and landing page experience) to achieve better positions at lower cost. A higher Quality Score lets you outrank competitors with higher bids.",
          },
          {
            q: "How can I increase my Ad Rank without raising my bid?",
            a: "Improve your Quality Score components: write more relevant ad copy to lift CTR, tighten keyword-to-ad group alignment, speed up and improve your landing page. Also ensure you're using all relevant ad extensions — they directly contribute to Ad Rank at no extra cost.",
          },
        ],
      },
      {
        term: "Ad Schedule (Dayparting)",
        definition: "A campaign setting that controls when your ads appear, letting you show ads only on specific days or hours — or apply bid adjustments based on time of day to capitalise on peak conversion windows.",
        relatedTerms: ["Bid Adjustment", "Campaign", "Budget"],
      },
      {
        term: "Attribution Model",
        definition: "The framework for assigning conversion credit to touchpoints in the customer journey. Models include last-click, first-click, linear, time decay, position-based, and data-driven attribution.",
        relatedTerms: ["Conversion", "Conversion Tracking", "Return on Ad Spend (ROAS)"],
        internalLinks: [{ label: "Google Analytics 4 Training", href: "/google-analytics-4-training" }],
        faq: [
          {
            q: "Which attribution model should I use?",
            a: "Data-driven attribution is Google's default and most accurate model for accounts with sufficient conversion data. It uses machine learning to assign credit based on actual user path data. For smaller accounts, position-based or linear attribution gives a fairer picture than last-click, which over-credits search and misses assist channels.",
          },
        ],
      },
      {
        term: "Auction Insights",
        definition: "A Google Ads report showing how your ads perform compared to other advertisers in the same auctions. Key metrics include impression share, overlap rate, position above rate, and top-of-page rate — essential for competitive analysis.",
        relatedTerms: ["Impression Share", "Ad Rank", "Search Impression Share"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How do I use Auction Insights to beat competitors?",
            a: "High Overlap Rate means you're competing in the same auctions. If competitors have a higher Position Above Rate, they're winning more top-of-page placements. Use this to identify which keywords are most contested, then prioritise Quality Score improvements and strategic bid increases rather than just outbidding them across the board.",
          },
        ],
      },
      {
        term: "Audience Targeting",
        definition: "The ability to show ads to specific user segments based on demographics, interests, in-market behaviour, customer lists, or previous site visits (remarketing). Used to increase bid adjustments for high-value audiences.",
        relatedTerms: ["Remarketing", "Customer Match", "In-Market Audience", "Bid Adjustment"],
      },
      {
        term: "Automated Bidding",
        definition: "Google's machine-learning bid optimisation system that adjusts bids in real time using signals like device, location, time of day, search query, and audience behaviour to hit a specified campaign goal.",
        relatedTerms: ["Smart Bidding", "Target CPA (tCPA)", "Target ROAS (tROAS)", "Maximise Conversions"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
    ],
  },
  {
    letter: "B",
    terms: [
      {
        term: "Bid",
        definition: "The maximum amount you're willing to pay per click (CPC) or per thousand impressions (CPM). In a keyword auction, your actual CPC is almost always less than your max bid.",
        relatedTerms: ["Ad Rank", "Quality Score", "Cost per Click (CPC)", "Bid Strategy"],
      },
      {
        term: "Bid Adjustment",
        definition: "A percentage modifier applied to bids for specific signals — device (mobile, desktop, tablet), location, audience segment, or time of day — to increase or decrease bid amounts relative to your base bid.",
        relatedTerms: ["Bid", "Audience Targeting", "Ad Schedule (Dayparting)"],
      },
      {
        term: "Bid Strategy",
        definition: "The method used to set bids in a campaign. Options range from manual CPC to automated strategies like Target CPA, Target ROAS, Maximise Conversions, and Maximise Conversion Value.",
        relatedTerms: ["Smart Bidding", "Manual CPC", "Target CPA (tCPA)", "Target ROAS (tROAS)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Bounce Rate",
        definition: "The percentage of landing page visitors who leave without taking any action. A high bounce rate can signal poor ad-to-landing-page relevance, dragging down Quality Score and increasing CPA.",
        relatedTerms: ["Landing Page Experience", "Quality Score", "Landing Page"],
        internalLinks: [{ label: "Google Analytics 4 Training", href: "/google-analytics-4-training" }],
      },
      {
        term: "Brand Bidding",
        definition: "Bidding on your own brand name as a keyword to secure top ad position, control your messaging, and defend against competitors who may bid on your brand terms. Brand campaigns typically have the highest Quality Scores and lowest CPCs in any account.",
        relatedTerms: ["Target Impression Share", "Quality Score", "Negative Keywords"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Broad Match",
        definition: "A keyword match type that shows ads for searches related to your keyword, including synonyms, related terms, and variations. Provides the widest reach but least control. Best used with Smart Bidding and strong negative keyword lists.",
        relatedTerms: ["Phrase Match", "Exact Match", "Negative Keywords", "Keyword Match Type"],
      },
      {
        term: "Budget",
        definition: "The total amount allocated to a campaign — set as a daily average. Google may spend up to 2× the daily budget on high-traffic days, staying within the monthly budget cap (daily budget × 30.4).",
        relatedTerms: ["Daily Budget", "Impression Share", "Campaign"],
      },
    ],
  },
  {
    letter: "C",
    terms: [
      {
        term: "Call Asset (Call Extension)",
        definition: "An ad asset that adds your business phone number directly to search ads, enabling one-tap calling from mobile results. Calls can be tracked as conversions in Google Ads — critical for service businesses that generate leads by phone.",
        relatedTerms: ["Ad Extensions", "Conversion", "Lead Generation"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Call-to-Action (CTA)",
        definition: "The instruction that prompts a user to take action — 'Get a Free Quote', 'Shop Now', 'Book a Demo'. A clear, benefit-driven CTA directly improves click-through and conversion rates.",
        relatedTerms: ["Ad Copy", "Conversion Rate", "Landing Page"],
      },
      {
        term: "Campaign",
        definition: "The highest-level container in a Google Ads account. Campaigns define budget, bidding strategy, network targeting, location targeting, and ad rotation settings. All ad groups within a campaign share these settings.",
        relatedTerms: ["Ad Group", "Budget", "Bid Strategy", "Network Settings"],
      },
      {
        term: "Click-Through Rate (CTR)",
        definition: "Ad clicks divided by impressions, expressed as a percentage. A higher CTR signals strong ad relevance and positively influences Quality Score, helping reduce CPC and improve Ad Rank.",
        relatedTerms: ["Quality Score", "Ad Rank", "Impression", "Cost per Click (CPC)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Conversion",
        definition: "A desired action completed by a user after clicking your ad — a purchase, form submission, phone call, app download, email sign-up, or chat session. Defined and tracked via Google Ads conversion tracking.",
        relatedTerms: ["Conversion Rate", "Cost per Acquisition (CPA)", "Conversion Tracking", "Return on Ad Spend (ROAS)"],
        faq: [
          {
            q: "What counts as a conversion in Google Ads?",
            a: "Any meaningful action you define: purchases, form completions, phone calls, app downloads, chat initiations, or micro-conversions like newsletter sign-ups. Only track actions you can assign value to — importing too many low-value conversions misleads Smart Bidding and inflates your conversion numbers artificially.",
          },
        ],
      },
      {
        term: "Conversion Rate",
        definition: "The percentage of ad clicks that result in a conversion. Calculated as (Conversions ÷ Clicks) × 100. Improving conversion rate has a compounding effect on CPA and ROAS.",
        relatedTerms: ["Conversion", "Landing Page", "Cost per Acquisition (CPA)", "Return on Ad Spend (ROAS)"],
      },
      {
        term: "Conversion Tracking",
        definition: "The Google Ads feature that records which ad interactions led to valuable customer actions. Set up via Google Tag Manager or direct site tag. Without it, Smart Bidding strategies cannot optimise effectively.",
        relatedTerms: ["Google Tag Manager (GTM)", "Smart Bidding", "Conversion", "Attribution Model"],
        internalLinks: [
          { label: "Google Tag Manager Training", href: "/google-tag-manager-training-2" },
          { label: "Google Analytics 4 Training", href: "/google-analytics-4-training" },
        ],
        faq: [
          {
            q: "Do I need Google Tag Manager to set up conversion tracking?",
            a: "No — you can implement Google Ads conversion tracking directly via the site-wide tag (global site tag). However, Google Tag Manager is the recommended approach because it centralises all tracking tags, avoids developer dependency for future changes, and makes it easier to audit and debug tracking.",
          },
        ],
      },
      {
        term: "Conversion Window",
        definition: "The period after an ad click during which a conversion is credited to that click. Default is 30 days for purchases; shorter for phone calls (60 seconds). Adjusting the window to match your actual sales cycle improves attribution accuracy.",
        relatedTerms: ["Conversion", "Attribution Model", "Conversion Tracking"],
      },
      {
        term: "Cost per Acquisition (CPA)",
        definition: "Total ad spend divided by total conversions. Target CPA is a Smart Bidding strategy that tells Google to automatically set bids to get the most conversions at or below your target CPA.",
        relatedTerms: ["Return on Ad Spend (ROAS)", "Smart Bidding", "Target CPA (tCPA)", "Conversion"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How do I calculate my maximum allowable CPA?",
            a: "Your maximum CPA = average order value × gross margin percentage. If AOV is AED 1,200 and margin is 40%, your breakeven CPA is AED 480. Set your target CPA below this to ensure profitability. For businesses with high customer lifetime value (repeat purchases), you can afford a higher acquisition CPA.",
          },
        ],
      },
      {
        term: "Cost per Click (CPC)",
        definition: "The amount paid each time a user clicks your ad. Actual CPC is almost always below your max bid due to the second-price auction model Google uses. Influenced by Quality Score, competition, and bid.",
        relatedTerms: ["Bid", "Quality Score", "Ad Rank", "Click-Through Rate (CTR)"],
      },
      {
        term: "Cost per Mille (CPM)",
        definition: "Cost per 1,000 ad impressions. Used in display and video campaigns where brand awareness and reach matter more than direct clicks. Target CPM lets you set how much you'll pay per thousand viewable impressions.",
        relatedTerms: ["Display Ads", "Video Ads", "Impression"],
      },
      {
        term: "Customer Match",
        definition: "A targeting feature that allows you to upload customer email lists. Google matches them to signed-in users across Search, Shopping, Gmail, YouTube, and Display — enabling highly targeted ads to existing customers or look-alike audiences.",
        relatedTerms: ["Audience Targeting", "Remarketing", "First-Party Data"],
        faq: [
          {
            q: "What match rate should I expect with Customer Match?",
            a: "Google typically matches 40–60% of uploaded email addresses to signed-in accounts, though rates vary. To maximise match rate: upload hashed emails in the correct format, include full name and postal code alongside email, and use a large, recent list. Customer Match audiences work best for re-engagement and cross-sell campaigns.",
          },
        ],
      },
    ],
  },
  {
    letter: "D",
    terms: [
      {
        term: "Daily Budget",
        definition: "The average amount you're willing to spend per day on a campaign. Google uses daily budgets to pace ad delivery and may overspend on high-traffic days (up to 2×), but the monthly total won't exceed daily budget × 30.4.",
        relatedTerms: ["Budget", "Campaign", "Impression Share"],
      },
      {
        term: "Display Ads",
        definition: "Visual banner, image, or responsive ads served across Google's Display Network — over 2 million websites, apps, and YouTube. Effective for brand awareness, remarketing, and reaching audiences at all funnel stages.",
        relatedTerms: ["Google Display Network (GDN)", "Remarketing", "Cost per Mille (CPM)", "Responsive Search Ads"],
      },
      {
        term: "Dynamic Search Ads (DSA)",
        definition: "Ads that automatically generate headlines and select landing pages by crawling your website content. DSAs capture relevant searches not covered by your keyword list and are best paired with strong negative keyword exclusions.",
        relatedTerms: ["Negative Keywords", "Keyword", "Landing Page", "Search Term Report"],
      },
    ],
  },
  {
    letter: "E",
    terms: [
      {
        term: "Enhanced CPC (ECPC)",
        definition: "A hybrid bidding strategy that adjusts manual bids up or down based on the likelihood of a conversion. A middle ground between full manual control and fully automated Smart Bidding.",
        relatedTerms: ["Manual CPC", "Smart Bidding", "Bid Strategy"],
      },
      {
        term: "Exact Match",
        definition: "A keyword match type that shows ads only when the search query matches your keyword exactly or is a very close variant with the same meaning. Highest precision, lowest impression volume — ideal for bottom-funnel, high-intent terms.",
        relatedTerms: ["Phrase Match", "Broad Match", "Keyword Match Type", "Negative Keywords"],
      },
      {
        term: "Expanded Text Ads (ETA)",
        definition: "A legacy Google Ads format with three headlines and two description fields. Google stopped allowing new ETAs in June 2022. Responsive Search Ads (RSA) is now the standard search ad format.",
        relatedTerms: ["Responsive Search Ads", "Headline", "Ad Copy"],
      },
    ],
  },
  {
    letter: "F",
    terms: [
      {
        term: "Final URL",
        definition: "The actual landing page URL a user is taken to after clicking your ad. Must match the domain shown in the display URL and must be highly relevant to the ad copy and keyword to maintain Quality Score.",
        relatedTerms: ["Landing Page", "Quality Score", "Tracking Template"],
      },
      {
        term: "First-Party Data",
        definition: "Data collected directly from your own customers and prospects — email lists, CRM records, purchase histories, and on-site behaviour. First-party data powers Customer Match and protects targeting accuracy as third-party cookies phase out.",
        relatedTerms: ["Customer Match", "Audience Targeting", "Remarketing"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "Why is first-party data critical for PPC in 2024?",
            a: "With third-party cookies being phased out across browsers, audience targeting that relied on third-party data is becoming less reliable. First-party data (your own customer lists, CRM data, and on-site events) gives you targeting that isn't dependent on third-party identifiers — making it more accurate and future-proof.",
          },
        ],
      },
      {
        term: "Frequency Capping",
        definition: "A setting in display and video campaigns that limits how many times a single user sees your ad in a given time period (per day, week, or month). Reduces ad fatigue and improves brand perception.",
        relatedTerms: ["Display Ads", "Video Ads", "Remarketing"],
      },
    ],
  },
  {
    letter: "G",
    terms: [
      {
        term: "Google Ads Editor",
        definition: "A free desktop application for managing Google Ads accounts offline. Supports bulk editing, campaign copying, find-and-replace, and uploading changes in batches — essential for large account management.",
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Google Display Network (GDN)",
        definition: "Google's advertising network reaching 90%+ of internet users globally across 2 million+ websites, apps, and YouTube. Used for brand awareness, remarketing, interest-based targeting, and prospecting.",
        relatedTerms: ["Display Ads", "Remarketing", "Placement", "Frequency Capping"],
      },
      {
        term: "Google Merchant Center",
        definition: "A platform where retailers upload and manage product feeds (title, price, description, image, availability, GTIN) for Google Shopping Ads and Performance Max campaigns. Feed quality is the single biggest lever in Shopping performance.",
        relatedTerms: ["Google Shopping Ads", "Shopping Feed (Product Feed)", "Performance Max (PMax)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "What makes a high-performing Google Merchant Center feed?",
            a: "Prioritise: (1) Keyword-rich product titles (brand + product type + key attributes in the first 70 characters), (2) accurate GTINs for all products, (3) high-resolution images (800×800px+), (4) precise category mapping, and (5) real-time stock and price sync. Poor feed data is the #1 cause of Shopping underperformance.",
          },
        ],
      },
      {
        term: "Google Shopping Ads",
        definition: "Product listing ads showing product images, titles, prices, and store names directly in search results. Managed through Google Merchant Center. Essential for e-commerce businesses targeting bottom-funnel buyers.",
        relatedTerms: ["Google Merchant Center", "Shopping Feed (Product Feed)", "Performance Max (PMax)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Google Tag Manager (GTM)",
        definition: "A free tag management system that lets you deploy and update tracking tags (Google Ads, Analytics, remarketing pixels, Meta Pixel) on your website without editing site code. Recommended for all PPC conversion tracking implementation.",
        relatedTerms: ["Conversion Tracking", "Attribution Model", "URL Parameters"],
        internalLinks: [{ label: "GTM Training Course", href: "/google-tag-manager-training-2" }],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "Do I need a developer to set up Google Tag Manager?",
            a: "You need a developer to add the initial GTM container snippet to your website (a one-time task). After that, marketers can deploy and update all tracking tags — including conversion actions, remarketing tags, and analytics events — through the GTM interface without touching code.",
          },
        ],
      },
    ],
  },
  {
    letter: "H",
    terms: [
      {
        term: "Headline",
        definition: "The clickable title text of a paid search ad. Responsive Search Ads allow up to 15 headlines (Google shows 2–3 per ad). Pinning headlines forces them into specific positions; unpinned headlines are tested and optimised by Google.",
        relatedTerms: ["Responsive Search Ads", "Ad Copy", "Quality Score", "Click-Through Rate (CTR)"],
      },
      {
        term: "Historical Quality Score",
        definition: "The Quality Score assigned to a keyword based on its cumulative performance history — not just the current period. A keyword inherits Quality Score from its history, which is why relaunching paused keywords or importing from a high-performing account can give early advantages.",
        relatedTerms: ["Quality Score", "Keyword", "Ad Rank"],
      },
    ],
  },
  {
    letter: "I",
    terms: [
      {
        term: "Impression",
        definition: "One instance of your ad being displayed, whether on a search results page, display placement, or video pre-roll. Impressions are counted even if the user doesn't click.",
        relatedTerms: ["Click-Through Rate (CTR)", "Impression Share", "Cost per Mille (CPM)"],
      },
      {
        term: "Impression Share",
        definition: "The percentage of total eligible impressions your ads received. Low impression share can result from insufficient budget (Budget IS) or low Ad Rank (Rank IS). A key diagnostic metric for campaign scale and competitiveness.",
        relatedTerms: ["Ad Rank", "Budget", "Search Impression Share", "Auction Insights"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "In-Market Audience",
        definition: "Users Google identifies as actively researching or comparing products and services similar to yours — high-intent prospects. Can be used for bid adjustments in Search campaigns or as a primary targeting method in Display.",
        relatedTerms: ["Audience Targeting", "Bid Adjustment", "Remarketing"],
      },
    ],
  },
  {
    letter: "K",
    terms: [
      {
        term: "Keyword",
        definition: "A word or phrase that triggers your ad when a user searches for it. Keywords are the fundamental building blocks of search advertising. Match types control how broadly or precisely keywords trigger ad delivery.",
        relatedTerms: ["Keyword Match Type", "Negative Keywords", "Long-Tail Keywords", "Quality Score"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        internalLinks: [{ label: "Google Ads Training", href: "/google-ads-training-2" }],
      },
      {
        term: "Keyword Match Type",
        definition: "Controls how closely a search query must match your keyword to trigger an ad. The three active match types are Broad Match (widest), Phrase Match (medium control), and Exact Match (highest precision).",
        relatedTerms: ["Broad Match", "Phrase Match", "Exact Match", "Negative Keywords"],
        faq: [
          {
            q: "Which keyword match type should I use?",
            a: "Start with a mix: Exact Match for your highest-value, most-proven keywords (lowest waste); Phrase Match for moderate-volume terms where you want some flexibility; Broad Match only with Smart Bidding active and strong negative keyword lists in place. Review the Search Terms Report weekly to refine.",
          },
        ],
      },
      {
        term: "Keyword Planner",
        definition: "A free Google Ads research tool for discovering keyword ideas, estimating monthly search volumes, assessing competition, and forecasting bid ranges. Requires an active Google Ads account to access historical data.",
        relatedTerms: ["Keyword", "Long-Tail Keywords", "Bid"],
        internalLinks: [{ label: "Google Ads Training", href: "/google-ads-training-2" }],
      },
    ],
  },
  {
    letter: "L",
    terms: [
      {
        term: "Landing Page",
        definition: "The web page users reach after clicking your ad. Relevance between ad copy, keyword, and landing page content is the single biggest factor in Quality Score. A dedicated landing page with one clear CTA almost always outperforms a generic homepage.",
        relatedTerms: ["Landing Page Experience", "Quality Score", "Conversion Rate", "Bounce Rate"],
        faq: [
          {
            q: "Should I send PPC traffic to my homepage?",
            a: "Almost never. Dedicated landing pages consistently outperform homepages for PPC traffic because they match the specific intent of the ad and keyword. A homepage serves many audiences and goals; a landing page serves one: converting the ad click into the action you're paying for.",
          },
        ],
      },
      {
        term: "Landing Page Experience",
        definition: "One of the three components of Quality Score. Google rates landing page relevance, transparency, ease of navigation, and mobile-friendliness. Poor landing page experience raises CPC and lowers Ad Rank, even with high bids.",
        relatedTerms: ["Quality Score", "Landing Page", "Bounce Rate", "Ad Rank"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "What makes a good PPC landing page?",
            a: "Google (and your users) reward: (1) relevance — the page content matches the keyword and ad promise, (2) speed — loads under 3 seconds on mobile, (3) clarity — one dominant CTA above the fold, (4) transparency — no hidden fees, misleading claims, or disruptive interstitials, (5) mobile-optimisation. Social proof (reviews, case studies, logos) improves conversion rate further.",
          },
        ],
      },
      {
        term: "Lead Generation",
        definition: "A campaign objective focused on capturing contact information from potential customers through forms, calls, or chat. Lead gen campaigns optimise for form fills and phone calls rather than direct purchases.",
        relatedTerms: ["Conversion", "Cost per Acquisition (CPA)", "Call Asset (Call Extension)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Lifetime Value (LTV / CLV)",
        definition: "The predicted total revenue a customer will generate over their entire relationship with your business. High-LTV customers justify higher CPA targets and larger bid multipliers, making LTV a critical input for accurate campaign budgeting.",
        relatedTerms: ["Cost per Acquisition (CPA)", "Return on Ad Spend (ROAS)", "Conversion"],
      },
      {
        term: "Long-Tail Keywords",
        definition: "Longer, more specific search phrases with lower search volume but higher purchase intent and lower competition — often resulting in lower CPC and higher conversion rates. Examples: 'SEO agency for Dubai restaurants' vs 'SEO agency'.",
        relatedTerms: ["Keyword", "Keyword Match Type", "Cost per Click (CPC)"],
      },
    ],
  },
  {
    letter: "M",
    terms: [
      {
        term: "Manual CPC",
        definition: "A bidding strategy where you set bids for individual keywords or ad groups. Google does not automatically adjust them. Provides maximum control but requires regular monitoring and manual adjustments to stay competitive.",
        relatedTerms: ["Enhanced CPC (ECPC)", "Smart Bidding", "Bid Strategy"],
      },
      {
        term: "Maximise Clicks",
        definition: "An automated bidding strategy that sets bids to get the most clicks within your budget. Does not optimise for conversions. Best for awareness campaigns or when building initial traffic data before switching to conversion-based bidding.",
        relatedTerms: ["Bid Strategy", "Maximise Conversions", "Budget"],
      },
      {
        term: "Maximise Conversions",
        definition: "A Smart Bidding strategy that automatically sets bids to get the most conversions within your daily budget. No CPA target is set — Google spends the full budget to maximise conversion volume.",
        relatedTerms: ["Smart Bidding", "Target CPA (tCPA)", "Conversion", "Budget"],
      },
      {
        term: "Maximise Conversion Value",
        definition: "A Smart Bidding strategy that optimises for total conversion value (revenue) within your budget, without a specific ROAS target. Useful when you want to grow total revenue rather than hit a fixed return ratio.",
        relatedTerms: ["Target ROAS (tROAS)", "Smart Bidding", "Return on Ad Spend (ROAS)"],
      },
      {
        term: "Microsoft Advertising (Bing Ads)",
        definition: "Microsoft's PPC advertising platform serving ads on Bing, Yahoo, and DuckDuckGo. Typically delivers lower CPCs and less competition than Google Ads, with strong performance for B2B and older demographics. Can import campaigns directly from Google Ads.",
        relatedTerms: ["PPC (Pay-Per-Click)", "Bid Strategy", "Search Impression Share"],
        internalLinks: [
          { label: "Bing Ads Service", href: "/advertise-on-bing-with-bing-ads" },
          { label: "Bing Ads Training", href: "/bing-ads-training" },
        ],
      },
    ],
  },
  {
    letter: "N",
    terms: [
      {
        term: "Negative Keywords",
        definition: "Keywords for which you do not want your ads to appear. Essential for eliminating irrelevant traffic, reducing wasted spend, and improving campaign efficiency. Applied at campaign or ad group level. Negative match types also apply (broad, phrase, exact).",
        relatedTerms: ["Keyword Match Type", "Search Term Report", "Wasted Spend", "Budget"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How often should I review my negative keywords?",
            a: "Review your Search Terms Report at least weekly for new accounts, fortnightly for established ones. Build a shared negative keyword list at the account level for common exclusions (e.g., 'free', 'jobs', 'DIY', 'course') and add campaign- or ad-group-level negatives for specific product/service separations. Wasted spend drops significantly within weeks of a thorough negative keyword audit.",
          },
        ],
      },
      {
        term: "Network Settings",
        definition: "Campaign-level settings controlling where ads appear: Google Search Network, Google Search Partners, Microsoft Search Partners, or Google Display Network. Separating search and display into distinct campaigns is best practice — they serve different intent levels and require different bidding.",
        relatedTerms: ["Search Partners", "Google Display Network (GDN)", "Campaign"],
      },
    ],
  },
  {
    letter: "O",
    terms: [
      {
        term: "Optimisation Score",
        definition: "A 0–100% estimate in Google Ads showing how well your account is set to perform based on pending recommendations. Useful as a starting point but should not be followed blindly — some recommendations reduce account control or inflate spend.",
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
    ],
  },
  {
    letter: "P",
    terms: [
      {
        term: "Performance Max (PMax)",
        definition: "Google's fully automated campaign type that serves ads across all channels — Search, Display, YouTube, Discover, Maps, and Gmail — from a single campaign using asset groups and audience signals. Optimises toward conversion goals using AI.",
        relatedTerms: ["Smart Bidding", "Google Merchant Center", "Audience Targeting", "Conversion Tracking"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "Should I use Performance Max instead of standard campaigns?",
            a: "PMax works best when you have strong conversion tracking, rich asset groups (15 headlines, 5 descriptions, images, video), and 50+ monthly conversions. For tight budgets or brand-specific control, supplement PMax with standard Search campaigns for transparency. PMax doesn't allow keyword-level control — run brand campaigns separately to avoid cannibalisation.",
          },
          {
            q: "How do I see what's performing inside Performance Max?",
            a: "PMax reporting is intentionally limited. Use the Insights tab for audience and search theme data, run asset performance reports to see which images and headlines drive results, and check the Search Terms Insight (not a full report) for query themes. For deeper visibility, connect to Looker Studio and segment by asset group.",
          },
        ],
      },
      {
        term: "Phrase Match",
        definition: "A keyword match type that triggers ads when a search includes the meaning of your keyword phrase. More targeted than broad match but broader than exact match. Ideal for balancing reach and relevance.",
        relatedTerms: ["Broad Match", "Exact Match", "Keyword Match Type"],
      },
      {
        term: "Placement",
        definition: "A specific website, app, YouTube channel, or video where your display or video ad appears. Placements can be managed (manually selected), automatic (Google chooses), or excluded if they deliver poor quality traffic.",
        relatedTerms: ["Google Display Network (GDN)", "Display Ads", "Video Ads"],
      },
      {
        term: "PPC (Pay-Per-Click)",
        definition: "An online advertising model where advertisers pay only when a user clicks on their ad. Google Ads, Microsoft Ads (Bing), Meta Ads, and LinkedIn Ads all use variations of the PPC model.",
        relatedTerms: ["Cost per Click (CPC)", "Ad Auction", "Return on Ad Spend (ROAS)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        internalLinks: [{ label: "Google Ads Training", href: "/google-ads-training-2" }],
      },
      {
        term: "Profit on Ad Spend (POAS)",
        definition: "Revenue minus cost of goods sold, divided by ad spend. A more accurate measure of true profitability than ROAS, especially for multi-margin product catalogues. Increasingly used alongside ROAS to ensure campaigns drive real profit, not just top-line revenue.",
        relatedTerms: ["Return on Ad Spend (ROAS)", "Return on Investment (ROI)", "Value-Based Bidding"],
      },
    ],
  },
  {
    letter: "Q",
    terms: [
      {
        term: "Quality Score",
        definition: "Google's 1–10 rating of keyword relevance across three components: expected CTR, ad relevance, and landing page experience. Higher Quality Scores lower your actual CPC and improve Ad Rank — making it one of the highest-leverage optimisation metrics in PPC.",
        relatedTerms: ["Ad Rank", "Click-Through Rate (CTR)", "Landing Page Experience", "Ad Copy"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        internalLinks: [{ label: "Google Ads Training", href: "/google-ads-training-2" }],
        faq: [
          {
            q: "How do I improve my Quality Score?",
            a: "Improve all three components: (1) Raise expected CTR — write more compelling, keyword-relevant headlines and use all available ad extensions. (2) Improve ad relevance — create tighter ad groups where every keyword closely matches every ad. (3) Improve landing page experience — ensure the page is fast, mobile-optimised, relevant to the keyword, and has a clear single CTA. A Quality Score improvement from 5 to 8 can reduce your CPC by up to 37%.",
          },
          {
            q: "Does a low Quality Score mean I should pause a keyword?",
            a: "Not immediately. First investigate why it's low: check the components (expected CTR, ad relevance, landing page). If the keyword is commercially valuable, try improving its dedicated ad copy and landing page before pausing. Pause if: the keyword is irrelevant to your business, historical CTR is well below account average, or it drives zero conversions despite sufficient traffic.",
          },
        ],
      },
    ],
  },
  {
    letter: "R",
    terms: [
      {
        term: "Remarketing",
        definition: "Showing targeted ads to users who have previously visited your website, viewed a product, or interacted with your brand. Remarketing audiences are significantly warmer than cold audiences and typically deliver lower CPAs.",
        relatedTerms: ["Audience Targeting", "Customer Match", "Google Display Network (GDN)", "Cost per Acquisition (CPA)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How long should my remarketing window be?",
            a: "Match the window to your sales cycle. E-commerce / impulse purchases: 7–14 days. Considered purchases (software, B2B services): 30–90 days. High-value B2B: up to 540 days. Segment lists by recency — visitors in the last 7 days convert at far higher rates than those from 60 days ago. Use shorter windows for display and longer for search remarketing lists (RLSA).",
          },
        ],
      },
      {
        term: "Responsive Search Ads (RSA)",
        definition: "The current standard Google Ads search format. You provide up to 15 headlines and 4 descriptions; Google automatically tests combinations and optimises for the highest-performing arrangements per user and context.",
        relatedTerms: ["Headline", "Ad Copy", "Quality Score", "Click-Through Rate (CTR)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Return on Ad Spend (ROAS)",
        definition: "Revenue generated divided by ad spend, expressed as a ratio. Example: 4:1 ROAS means AED 4 in revenue for every AED 1 spent. Target ROAS is a Smart Bidding strategy that tells Google to optimise bids to hit your target return.",
        relatedTerms: ["Target ROAS (tROAS)", "Cost per Acquisition (CPA)", "Smart Bidding", "Profit on Ad Spend (POAS)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "What is a good ROAS for UAE e-commerce?",
            a: "Breakeven ROAS depends on your gross margin. At 40% margin, you need at least 2.5× to cover ad spend. Well-optimised UAE e-commerce typically targets 4–6× ROAS. For B2B services, ROAS is less useful — measure by CPA and lifetime value instead, since deal cycles are longer and revenue doesn't register immediately after the click.",
          },
          {
            q: "What's the difference between ROAS and ROI?",
            a: "ROAS measures revenue ÷ ad spend only — it ignores product costs, fulfilment, and overhead. ROI measures net profit ÷ total investment, including all costs. A 5× ROAS campaign can still deliver negative ROI if margins are thin. Always calculate POAS (Profit on Ad Spend) or true ROI alongside ROAS for a complete picture.",
          },
        ],
      },
      {
        term: "Return on Investment (ROI)",
        definition: "A broader profitability metric: (Revenue − Total Costs) ÷ Total Costs × 100. Unlike ROAS, ROI accounts for all costs (product, fulfilment, overhead), not just ad spend. The definitive measure of marketing profitability.",
        relatedTerms: ["Return on Ad Spend (ROAS)", "Profit on Ad Spend (POAS)", "Cost per Acquisition (CPA)"],
      },
    ],
  },
  {
    letter: "S",
    terms: [
      {
        term: "Search Impression Share",
        definition: "The percentage of search impressions your ads received out of total eligible impressions for your keywords. Lost IS (Budget) and Lost IS (Rank) diagnose exactly why you're missing impressions.",
        relatedTerms: ["Impression Share", "Ad Rank", "Budget", "Auction Insights"],
      },
      {
        term: "Search Partners",
        definition: "Sites in Google's search partner network — non-Google search engines, navigation sites, and Google properties like Maps — that display your search ads. Performance varies significantly by industry. Monitor separately and exclude partners at campaign level if CPAs run above target.",
        relatedTerms: ["Network Settings", "Campaign", "Search Impression Share"],
      },
      {
        term: "Search Term Report",
        definition: "A Google Ads report showing the exact queries that triggered your ads. The most important report in search advertising — use it weekly to identify new keyword opportunities and negative keywords to add.",
        relatedTerms: ["Negative Keywords", "Keyword", "Wasted Spend", "Dynamic Search Ads (DSA)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Shopping Feed (Product Feed)",
        definition: "A structured data file listing product attributes — title, price, description, GTIN, category, image URL, and stock status — uploaded to Google Merchant Center. Feed quality is the single most impactful lever in Google Shopping performance.",
        relatedTerms: ["Google Merchant Center", "Google Shopping Ads", "Performance Max (PMax)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Sitelink Extension",
        definition: "An ad extension adding extra links below your main ad (e.g., Services, Pricing, Contact, Blog). Sitelinks increase ad real estate, improve CTR, and allow users to navigate directly to high-intent pages.",
        relatedTerms: ["Ad Extensions", "Click-Through Rate (CTR)", "Ad Rank"],
      },
      {
        term: "Smart Bidding",
        definition: "A subset of automated bidding strategies that use machine learning and real-time auction signals to optimise for conversion goals. Smart Bidding strategies include Target CPA, Target ROAS, Maximise Conversions, and Maximise Conversion Value.",
        relatedTerms: ["Target CPA (tCPA)", "Target ROAS (tROAS)", "Maximise Conversions", "Conversion Tracking"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How much conversion data does Smart Bidding need?",
            a: "Google recommends 30+ conversions per month for Target CPA, and 50+ for Target ROAS. Below these thresholds, the algorithm lacks signal and can behave erratically — either overspending or under-delivering. Start with Maximise Conversions (no conversion volume requirement) to accumulate data, then transition to Target CPA or ROAS once you reach the threshold.",
          },
          {
            q: "Should I use Smart Bidding or Manual CPC?",
            a: "Smart Bidding outperforms manual CPC in most accounts with sufficient conversion data. For new campaigns or accounts with under 30 monthly conversions, start with Manual CPC or Enhanced CPC to gather clean data. Switch to Smart Bidding with a learning period of 2–4 weeks before evaluating performance — don't judge results during the learning phase.",
          },
        ],
      },
      {
        term: "Smart Campaign",
        definition: "A simplified campaign type designed for small businesses. Google automates targeting, bidding, and ad creation with minimal setup. Provides less control than standard campaigns — best for businesses without dedicated PPC management.",
        relatedTerms: ["Campaign", "Automated Bidding", "Performance Max (PMax)"],
      },
    ],
  },
  {
    letter: "T",
    terms: [
      {
        term: "Target CPA (tCPA)",
        definition: "A Smart Bidding strategy where Google automatically sets bids to get the most conversions at your desired cost per acquisition. Requires sufficient conversion data (30+ conversions per month) to work effectively.",
        relatedTerms: ["Smart Bidding", "Cost per Acquisition (CPA)", "Maximise Conversions", "Conversion Tracking"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How do I set the right target CPA?",
            a: "Set your initial target CPA at 10–20% above your current average CPA to give the algorithm room to find conversions. If you set it too low immediately, delivery will throttle and you may see very few impressions. Gradually lower the target in 10–15% increments every 2–3 weeks as the algorithm learns.",
          },
        ],
      },
      {
        term: "Target Impression Share",
        definition: "A Smart Bidding strategy designed to show your ads in a specific position — absolute top of page, top of page, or anywhere on the page — for a defined percentage of eligible auctions. Used for brand defence and competitor targeting.",
        relatedTerms: ["Brand Bidding", "Impression Share", "Ad Rank", "Auction Insights"],
      },
      {
        term: "Target ROAS (tROAS)",
        definition: "A Smart Bidding strategy that sets bids to maximise total conversion value while hitting your target return on ad spend. Best suited for e-commerce with varied product margins and 50+ conversions per month.",
        relatedTerms: ["Smart Bidding", "Return on Ad Spend (ROAS)", "Maximise Conversion Value"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Tracking Template",
        definition: "A URL template applied at account, campaign, ad group, or keyword level to append UTM tracking parameters automatically. Allows centralised tracking management without editing individual final URLs.",
        relatedTerms: ["URL Parameters", "Final URL", "Conversion Tracking", "Google Tag Manager (GTM)"],
        internalLinks: [{ label: "Google Tag Manager Training", href: "/google-tag-manager-training-2" }],
      },
    ],
  },
  {
    letter: "U",
    terms: [
      {
        term: "URL Parameters",
        definition: "Tags appended to your destination URLs (UTM parameters) to track traffic sources, campaign names, ad groups, and keywords in Google Analytics and other analytics platforms. Essential for cross-channel attribution.",
        relatedTerms: ["Tracking Template", "Attribution Model", "Google Tag Manager (GTM)"],
        internalLinks: [{ label: "Google Analytics 4 Training", href: "/google-analytics-4-training" }],
      },
      {
        term: "User Intent",
        definition: "The underlying goal behind a search query. PPC campaigns target commercial intent (researching options) and transactional intent (ready to buy) for maximum ROI. Understanding intent shapes keyword selection, ad copy, and landing page design.",
        relatedTerms: ["Long-Tail Keywords", "Keyword", "Landing Page", "Conversion Rate"],
      },
    ],
  },
  {
    letter: "V",
    terms: [
      {
        term: "Value-Based Bidding",
        definition: "The practice of optimising bids based on the predicted value of each conversion rather than treating all conversions equally. Implemented via Target ROAS, Conversion Value Rules, or profit-adjusted ROAS targets. Best for businesses with varying product margins.",
        relatedTerms: ["Target ROAS (tROAS)", "Profit on Ad Spend (POAS)", "Smart Bidding", "Return on Ad Spend (ROAS)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
      },
      {
        term: "Video Ads",
        definition: "Ad formats displayed on YouTube and Google's video partner sites. Types include skippable in-stream ads (paid after 30 seconds or completion), non-skippable in-stream ads (6–15 seconds), bumper ads (6 seconds), and video discovery ads.",
        relatedTerms: ["Google Display Network (GDN)", "Cost per Mille (CPM)", "Frequency Capping"],
        internalLinks: [{ label: "Paid Social & Video Advertising", href: "/paid-social-media-advertising" }],
      },
      {
        term: "View-Through Conversion",
        definition: "A conversion recorded when a user sees (but does not click) a display or video ad, then converts through another channel within a defined window. Helps measure the indirect impact of brand awareness campaigns.",
        relatedTerms: ["Conversion", "Attribution Model", "Display Ads", "Video Ads"],
      },
    ],
  },
  {
    letter: "W",
    terms: [
      {
        term: "Wasted Spend",
        definition: "Budget spent on irrelevant clicks that do not convert. The primary cause is insufficient negative keyword coverage. Reducing wasted spend by 20% effectively increases your available budget for profitable traffic by the same amount.",
        relatedTerms: ["Negative Keywords", "Search Term Report", "Budget", "Cost per Acquisition (CPA)"],
        relatedService: { label: "Google Ads Management", href: "/google-adwords-management" },
        faq: [
          {
            q: "How do I identify and reduce wasted ad spend?",
            a: "Run the Search Terms Report filtered to zero-conversion queries with >10 clicks. Add all irrelevant terms as negatives at the appropriate level. Sort by spend (high to low) — often 20% of queries account for 60% of wasted budget. Set up a recurring weekly review so waste doesn't accumulate. Also check placement reports for display campaigns.",
          },
        ],
      },
    ],
  },
];
