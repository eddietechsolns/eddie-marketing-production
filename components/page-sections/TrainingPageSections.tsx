import Link from "next/link";
import { FeatureCard } from "@/components/ui/Card";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/components/ui/FaqAccordion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseModule {
  title: string;
  topics: string[];
}

interface TrainingData {
  tagline: string;
  level: string;
  duration: string;
  overview: string;
  audience: string[];
  outcomes: string[];
  curriculum: CourseModule[];
  certification: string;
  faqs: FaqItem[];
  industries: string[];
  challenges: string[];
}

// ─── All Training Courses (for Related Courses section) ───────────────────────

const ALL_TRAINING_COURSES = [
  { slug: "google-ads-training-2", title: "Google Ads Training" },
  { slug: "google-analytics-4-training", title: "Google Analytics 4 Training" },
  { slug: "google-analytics-training", title: "Google Analytics Training" },
  { slug: "google-tag-manager-training-2", title: "Google Tag Manager Training" },
  { slug: "facebook-ads-training-2", title: "Facebook Ads Training" },
  { slug: "bing-ads-training", title: "Bing Ads Training" },
  { slug: "digital-marketing-training-dubai", title: "Digital Marketing Training Dubai" },
  { slug: "content-creation-strategy-training-2", title: "Content Creation Strategy Training" },
  { slug: "wordpress-training", title: "WordPress Training" },
];

// ─── Course Configs ───────────────────────────────────────────────────────────

const TRAINING_CONFIG: Record<string, TrainingData> = {
  "google-ads-training-2": {
    tagline: "Master Google Ads from campaign setup to advanced bidding — and start generating qualified leads immediately",
    level: "Beginner to Advanced",
    duration: "2 Days (16 Hours)",
    overview: "This intensive Google Ads training programme takes you from the fundamentals of campaign structure to advanced bidding strategies, audience targeting, and Performance Max campaigns. Whether you are new to paid search or want to deepen your current knowledge, you will leave with the hands-on skills to build, manage, and optimise profitable Google Ads campaigns for any business.",
    audience: [
      "Marketing managers who want full ownership of their paid search campaigns",
      "Business owners managing their own Google Ads account",
      "PPC executives and digital marketing coordinators",
      "Freelancers and consultants expanding their paid media services",
      "Agency account managers preparing for Google certification",
    ],
    outcomes: [
      "Build a fully structured Google Ads campaign from scratch",
      "Conduct keyword research and apply the right match types",
      "Write high-converting responsive search ads",
      "Set up conversion tracking and Google Tag Manager integration",
      "Configure smart bidding strategies aligned to campaign goals",
      "Build and refine audience segments and custom intent audiences",
      "Set up and interpret Google Ads reports and dashboards",
      "Identify and eliminate wasted spend with negative keywords",
    ],
    curriculum: [
      { title: "Module 1: Google Ads Fundamentals", topics: ["Platform overview and account structure", "Campaign types: Search, Display, Shopping, Performance Max", "Quality Score and Ad Rank explained", "Navigating the Google Ads interface"] },
      { title: "Module 2: Keyword Research & Match Types", topics: ["Keyword research tools and methodology", "Broad, phrase, exact, and negative match types", "Search term reports and query mining", "Building a keyword architecture"] },
      { title: "Module 3: Ad Copywriting", topics: ["Responsive search ads (RSAs) best practices", "Writing headlines and descriptions that convert", "Ad extensions: sitelinks, callouts, structured snippets", "Ad strength and performance signals"] },
      { title: "Module 4: Bidding & Budget Strategy", topics: ["Manual CPC vs smart bidding strategies", "Target CPA, Target ROAS, and Maximise Conversions", "Budget allocation across campaigns", "Bid adjustments by device, location, and audience"] },
      { title: "Module 5: Conversion Tracking", topics: ["Setting up conversion actions in Google Ads", "Google Tag Manager integration", "Tracking phone calls, forms, and purchases", "Attribution models compared"] },
      { title: "Module 6: Reporting & Optimisation", topics: ["Key metrics: CTR, CPC, CPA, ROAS, Impression Share", "Building custom dashboards and reports", "Weekly and monthly optimisation routines", "Scaling profitable campaigns"] },
    ],
    certification: "Participants who complete this course receive an Eddie Marketing Certificate of Completion. The programme is designed to fully prepare you for the Google Ads Search and Performance Max certification exams — with exam preparation guidance included on Day 2.",
    faqs: [
      { question: "Do I need a Google Ads account before the training?", answer: "No — we set up a training environment in class. If you have an existing account, you are welcome to bring it and we will use real campaign data to make the training directly applicable to your business. We recommend having Google Analytics 4 connected before Day 1 if you have an existing account." },
      { question: "Is this training suitable for complete beginners?", answer: "Yes — the course starts from the fundamentals and builds to advanced strategies over 2 days. Beginners will leave with the ability to launch a campaign confidently. More experienced participants benefit from the advanced modules on Smart Bidding, Performance Max, and audience targeting." },
      { question: "Will I get a certificate?", answer: "Yes — all participants receive an Eddie Marketing Certificate of Completion. The training is also specifically structured to prepare you for Google's own certification exams (Google Ads Search and Performance Max), with exam guidance included on Day 2." },
      { question: "Is the training available online?", answer: "Yes — we offer in-person training at our Dubai facility, live online sessions via Zoom, and corporate group training at your offices or a venue of your choice. Online participants receive the same materials, exercises, and certificate." },
      { question: "How much hands-on practice is included?", answer: "This is a hands-on workshop — not a lecture. Participants build actual campaigns, write real ad copy, configure conversion tracking, and run optimisation exercises throughout both days. You leave with a working campaign structure ready to deploy." },
      { question: "How does this training compare to Google's free online courses?", answer: "Google's free courses are self-paced video tutorials with limited hands-on practice. This training is an instructor-led workshop where you build real campaigns in a live account, receive immediate feedback, and can ask questions specific to your business throughout both days. Most participants find they learn in 2 days what it would take weeks of self-study to achieve, with far better retention because of the practical exercises." },
      { question: "Can we use our company's actual Google Ads account during training?", answer: "Yes — and we encourage it. Working inside your real account with your actual campaign data makes every module immediately applicable to your business. We recommend granting manager access to our trainer account before Day 1. Alternatively, we have demonstration accounts available for participants who prefer not to use a live account." },
    ],
    industries: ["E-Commerce & Retail", "Real Estate", "Healthcare", "Legal & Professional Services", "Hospitality & Tourism", "Education", "Finance", "Technology & SaaS"],
    challenges: [
      "Burning through budget on keywords that click but never convert — without any way to identify why",
      "Running campaigns without proper conversion tracking, so there's no way to measure true ROAS or optimise bidding",
      "Using broad match keywords without a negative keyword strategy, driving expensive, irrelevant traffic",
      "Setting bids manually without understanding automated bidding strategies and when each applies",
      "Creating landing pages that don't match ad messaging, destroying Quality Score and raising your cost-per-click",
    ],
  },

  "google-analytics-4-training": {
    tagline: "Understand your audience, measure what matters, and make data-driven decisions with Google Analytics 4",
    level: "Beginner to Intermediate",
    duration: "1 Day (8 Hours)",
    overview: "This full-day Google Analytics 4 training gives marketers, analysts, and business owners a thorough understanding of GA4 — from initial setup through to advanced reporting, event tracking, and attribution. Participants will learn how to configure GA4 correctly, build custom reports, interpret user journey data, and connect GA4 insights directly to marketing decisions. By the end of the day, you will have the confidence to navigate GA4 independently, identify what is and is not working in your digital marketing, and use data to make smarter business decisions.",
    audience: [
      "Marketing professionals responsible for campaign performance reporting",
      "Business owners who want to understand their website data",
      "Digital analysts moving from Universal Analytics to GA4",
      "Web developers responsible for analytics implementation",
      "PPC and SEO specialists who need to track and attribute conversions",
    ],
    outcomes: [
      "Set up Google Analytics 4 correctly with GA4 best practices",
      "Configure key events: purchases, leads, page views, and custom events",
      "Build exploration reports and funnel analyses in GA4",
      "Understand user acquisition, engagement, and retention metrics",
      "Connect GA4 to Google Ads for conversion-based bidding",
      "Create custom dimensions and metrics for your specific business",
      "Interpret audience segments and behavioral data",
      "Build a measurement plan aligned to business goals",
    ],
    curriculum: [
      { title: "Module 1: GA4 Fundamentals", topics: ["GA4 vs Universal Analytics: key differences", "Account and property structure", "Data streams and the GA4 data model", "Navigating the GA4 interface"] },
      { title: "Module 2: Event Tracking & Configuration", topics: ["Automatically collected, enhanced, and custom events", "Key events and conversion setup", "Google Tag Manager integration", "Debugging with GA4 DebugView"] },
      { title: "Module 3: Reporting & Explorations", topics: ["Standard reports: acquisition, engagement, monetisation", "Exploration reports: funnel, path, cohort, segment overlap", "Custom dimensions and metrics", "Data filters and comparisons"] },
      { title: "Module 4: Audiences & Attribution", topics: ["Audience builder: behavioural and demographic segments", "Publishing audiences to Google Ads", "Attribution models in GA4", "Connecting GA4 data to business outcomes"] },
    ],
    certification: "All participants receive an Eddie Marketing Certificate of Completion for Google Analytics 4 Training. The course content aligns with the Google Analytics Certification exam, with exam preparation guidance included.",
    faqs: [
      { question: "Do I need prior GA4 experience?", answer: "No — the course starts with GA4 fundamentals. Prior Google Analytics experience (Universal Analytics) is helpful but not required. If you are completely new to analytics, we recommend taking this course before our Google Ads training so you have a strong measurement foundation." },
      { question: "My business is still on Universal Analytics — is this course still relevant?", answer: "Universal Analytics is no longer collecting data. All businesses should now be on GA4. This course teaches GA4 from the ground up, with specific sections covering the differences from Universal Analytics to make the transition smooth for those with prior GA experience." },
      { question: "What tools do I need to bring?", answer: "A laptop with access to your Google account, Google Analytics 4 property, and ideally Google Tag Manager. We provide a training environment for exercises — but having your own data makes the sessions immediately applicable to your business." },
      { question: "Is this training available for corporate groups?", answer: "Yes — we offer group training for teams of 4 or more at your offices or a venue of your choice. Group sessions can be customised to focus on the specific events and reporting your business uses. Contact us for group pricing." },
      { question: "Does this course cover the transition from Universal Analytics to GA4?", answer: "Yes — the transition from UA to GA4 is addressed throughout the course. We cover the key differences in data model (session-based vs event-based), how to find your familiar UA reports within GA4's interface, and how to configure GA4 correctly so you're not losing insight you had in Universal Analytics. Participants who used UA extensively find this context particularly valuable." },
      { question: "Will I learn how to set up e-commerce tracking in GA4?", answer: "E-commerce tracking is covered in the course, including the GA4 e-commerce event schema (view_item, add_to_cart, purchase), how to implement it via Google Tag Manager, and how to read the Monetisation reports. You'll leave able to audit an existing e-commerce implementation and identify tracking gaps." },
      { question: "Will I learn how to connect GA4 with Google Ads?", answer: "Yes — linking GA4 to your Google Ads account is a core part of the course. This includes how to import GA4 conversions into Google Ads for smarter bidding, how to analyse the path from click to conversion across both platforms, and how to use GA4 audience segments in your Google Ads targeting." },
    ],
    industries: ["E-Commerce & Retail", "B2B Services", "Healthcare", "Real Estate", "Hospitality & Tourism", "Finance & Legal", "Education", "Technology"],
    challenges: [
      "GA4's event-based model is fundamentally different from Universal Analytics — most users can't find the data they need",
      "Standard reports look unfamiliar and the most useful analytics are hidden inside Explorations",
      "Custom events and conversions require manual setup that most teams have never completed correctly",
      "Attribution windows and data-driven attribution are widely misunderstood, leading to incorrect channel credit",
      "GA4 property configuration has critical pitfalls — wrong data retention, missing filters, incorrectly marked conversions",
    ],
  },

  "google-analytics-training": {
    tagline: "Learn how to read your website data and use analytics insights to drive smarter marketing decisions",
    level: "Beginner to Intermediate",
    duration: "1 Day (8 Hours)",
    overview: "This practical analytics training gives you the skills to understand your website data, identify what is and is not working in your digital marketing, and use data insights to make better business decisions. Covering both Google Analytics fundamentals and the transition to GA4, this course is designed for marketers and business owners who want to stop guessing and start acting on evidence. You will leave with a working analytics dashboard, a clear reporting framework, and the ability to present data insights to stakeholders in a way that drives action.",
    audience: [
      "Marketing managers who want to understand their website performance",
      "Business owners who need to read and interpret analytics reports",
      "Digital marketing coordinators responsible for monthly reporting",
      "Sales managers who want to understand the customer journey online",
      "Anyone tasked with measuring digital marketing performance",
    ],
    outcomes: [
      "Understand the key metrics that matter for your business",
      "Read traffic reports and identify top performing channels",
      "Set up and interpret goal and conversion tracking",
      "Understand audience demographics and behaviour flow",
      "Create and schedule custom reports for your stakeholders",
      "Identify website pages that need improvement",
      "Connect analytics data to marketing spend decisions",
      "Present data insights clearly to non-technical stakeholders",
    ],
    curriculum: [
      { title: "Module 1: Analytics Fundamentals", topics: ["How web analytics works: cookies, sessions, users", "Account structure and property settings", "The analytics interface orientation", "Key terms: sessions, bounce rate, conversion rate, goals"] },
      { title: "Module 2: Acquisition Reporting", topics: ["Organic, paid, referral, social and direct traffic", "Campaign tagging with UTM parameters", "Which channels are driving your best visitors", "Comparing channel performance"] },
      { title: "Module 3: Behaviour & Engagement", topics: ["Top pages, landing pages, and exit pages", "Bounce rate analysis and what it really means", "User flow and funnel analysis", "Site speed and Core Web Vitals in analytics"] },
      { title: "Module 4: Goals, Events & Conversion", topics: ["Setting up goals and conversion events", "Micro and macro conversions", "E-commerce tracking overview", "Attribution and multi-channel funnels"] },
      { title: "Module 5: Reporting & Dashboards", topics: ["Custom reports and dimensions", "Scheduled email reports", "Building a monthly analytics report", "Introduction to GA4 and the migration path"] },
    ],
    certification: "Participants receive an Eddie Marketing Certificate of Completion in Web Analytics. Course content prepares participants for the Google Analytics Certification exam.",
    faqs: [
      { question: "Is this course suitable if I have never used Google Analytics before?", answer: "Yes — the course is designed for beginners. We start with the fundamentals of how analytics works, what each metric means, and how to navigate the interface, before moving to practical reporting and decision-making." },
      { question: "Does this course cover GA4 or Universal Analytics?", answer: "The course covers both, with the majority of practical time spent on GA4 (the current Google Analytics standard). We include a section specifically on reading GA4 versus UA reports and understanding the differences, which is particularly helpful for those who have used Universal Analytics previously." },
      { question: "How much of this training is hands-on?", answer: "Around 60% of the day is hands-on exercises using real analytics accounts. We work through live reports, build custom dashboards, configure goals, and interpret actual data — so you leave with practical skills, not just theory." },
      { question: "How does this course differ from the GA4-specific training?", answer: "This course takes a broader view of Google Analytics as a discipline — covering data strategy, report interpretation, and applying analytics insights to business decisions — while also covering GA4's interface and setup. The GA4 course goes deeper into technical implementation: event tracking, conversions API, and custom dimensions. If you're completely new to analytics, start here; if you need to master GA4's technical configuration, the dedicated GA4 training is the right choice." },
      { question: "What reports will I be able to build after the course?", answer: "After this training you'll be able to build traffic source breakdowns, landing page performance reports, conversion funnel analysis, audience behaviour reports, and custom explorations that answer specific business questions. You'll also know how to schedule reports for stakeholders and set up automated alerts when key metrics change unexpectedly." },
      { question: "Will I learn how to connect Google Analytics with Google Ads?", answer: "Yes — linking GA4 to your Google Ads account is covered, including how to import GA4 conversions into Google Ads for smarter bidding, how to analyse the path from click to conversion, and how to identify which campaigns drive genuinely engaged sessions rather than just clicks." },
      { question: "Can I bring my own analytics account to work on during the course?", answer: "Yes, and we strongly recommend it. Working on your own data makes every session directly applicable to your business. We'll use your actual traffic reports, conversion data, and channel breakdowns as the basis for exercises. Participants without a GA4 property can use a demonstration account provided by the trainer." },
    ],
    industries: ["Professional Services", "Healthcare", "Real Estate", "Retail", "Hospitality", "Education", "Finance", "B2B"],
    challenges: [
      "Reading traffic numbers without understanding what they actually mean for marketing decisions",
      "Confusing sessions, users, and pageviews — and drawing incorrect conclusions from each metric",
      "No goals or conversion events set up, making it impossible to tie website activity to business outcomes",
      "Pulling reports that look good in a presentation but don't answer actual marketing or sales questions",
      "No consistent process for presenting analytics insights to stakeholders in a way that drives action or budget decisions",
    ],
  },

  "google-tag-manager-training-2": {
    tagline: "Implement tracking across your website without touching code — and take full control of your marketing data",
    level: "Intermediate",
    duration: "1 Day (8 Hours)",
    overview: "This hands-on Google Tag Manager training gives marketers, analysts, and developers the skills to deploy tracking code, set up conversion tracking, and manage all their marketing tags from a single container — without relying on a developer for every change. Participants will build a working GTM container from scratch during the course, with practical exercises covering Google Ads, GA4, Facebook Pixel, and custom event tracking. You will leave ready to deploy and manage tags independently, with a clean, version-controlled container you can use immediately at work.",
    audience: [
      "Marketers who want to implement tracking without developer dependency",
      "Digital analysts responsible for conversion tracking and data accuracy",
      "Web developers learning how to structure a clean tag architecture",
      "PPC specialists who need to set up conversion actions",
      "Agency professionals managing tracking across multiple client accounts",
    ],
    outcomes: [
      "Set up and configure a Google Tag Manager container",
      "Understand tags, triggers, variables, and the data layer",
      "Deploy Google Analytics 4 tracking via GTM",
      "Configure Google Ads conversion tracking in GTM",
      "Set up Facebook and Meta Pixel via GTM",
      "Track button clicks, form submissions, and scroll depth",
      "Use GTM Preview Mode to test and debug tags",
      "Publish and version-control your GTM container",
    ],
    curriculum: [
      { title: "Module 1: GTM Fundamentals", topics: ["What GTM is and how it works", "Account and container structure", "Tags, triggers, and variables explained", "Installing GTM on a website (WordPress and custom)"] },
      { title: "Module 2: Built-In Triggers & Variables", topics: ["Page view, DOM ready, and window load triggers", "Click triggers: all elements, links, buttons", "Form submission triggers", "Built-in variables: URL, referrer, click text"] },
      { title: "Module 3: Google Analytics 4 via GTM", topics: ["GA4 Configuration tag setup", "Custom event tags for key interactions", "Enhanced measurement and custom dimensions", "Debugging GA4 events with DebugView"] },
      { title: "Module 4: Conversion Tracking", topics: ["Google Ads conversion tracking via GTM", "Facebook / Meta Pixel implementation", "LinkedIn Insight Tag", "Third-party tool deployment: Hotjar, Intercom, HubSpot"] },
      { title: "Module 5: The Data Layer", topics: ["What the data layer is and why it matters", "Reading values from the data layer", "Custom data layer pushes from a developer", "E-commerce data layer structure"] },
      { title: "Module 6: Testing, Publishing & Governance", topics: ["GTM Preview Mode and Tag Assistant", "Version history and rollback", "User permissions and access levels", "GTM best practices and naming conventions"] },
    ],
    certification: "Participants receive an Eddie Marketing Certificate of Completion in Google Tag Manager. The course prepares you for the Google Analytics Certification exam, which covers GTM fundamentals.",
    faqs: [
      { question: "Do I need coding knowledge to attend?", answer: "No coding knowledge is required for most of the course. GTM is specifically designed to allow marketers to deploy tracking without code. We do cover the data layer in Module 5, which involves reading JavaScript objects — this section is accessible to non-developers with clear explanations, and we have a developer track available for those who want to go deeper." },
      { question: "What access do I need for the training?", answer: "You will need admin access to a GTM container and a website where you can install or test the GTM snippet. We provide training environments for the exercises, but working with your own site makes the learning immediately applicable. Having GA4 and Google Ads access is also helpful for the conversion tracking modules." },
      { question: "Is GTM relevant for WordPress websites?", answer: "Absolutely — GTM is one of the most valuable tools for WordPress site owners and developers. The course includes specific exercises for GTM installation on WordPress, and all tracking exercises are designed to work with any CMS including WordPress, Shopify, and custom-built sites." },
      { question: "What is the difference between GTM and hard-coding tags on a website?", answer: "Hard-coding means a developer edits the site's source files to add tracking scripts — a slow, expensive process with no version control. GTM loads a single container snippet on the site and all other tags are then managed through the GTM interface, versioned, and published with rollback ability. Marketing teams can deploy and iterate on tracking without touching the site's codebase, reducing time-to-deploy from days to minutes." },
      { question: "Can I use what I learn in this course immediately at work?", answer: "Yes — the course is structured around practical exercises using real GTM containers. You'll deploy Google Analytics 4 tags, conversion tracking for Google Ads, and Meta Pixel during the session itself. Most participants return to work and immediately take over tag management tasks they previously had to request from a developer, saving their team time and reducing dependency on the development queue." },
      { question: "How do I prevent GTM changes from breaking the live website?", answer: "GTM has built-in safeguards: Preview Mode lets you test every tag change in a sandboxed environment before publishing, and version history lets you roll back to any previous container state instantly. We cover both extensively in Module 6. A properly governed GTM container is significantly safer than manually editing code on a live site, because no change goes live without deliberate publication." },
    ],
    industries: ["E-Commerce", "B2B Services", "Healthcare", "Real Estate", "Hospitality", "Education", "Retail", "Technology"],
    challenges: [
      "Needing a developer to add or change any tracking tag — slowing down marketing campaigns by days or weeks",
      "Tags firing on wrong pages or triggering multiple times, corrupting conversion data and skewing bidding algorithms",
      "Not understanding the difference between tags, triggers, and variables — leading to configurations that break silently",
      "Publishing untested GTM containers to a live website and breaking tracking or site functionality",
      "No version control or audit trail — nobody can explain what changed, when, or why when tracking discrepancies appear",
    ],
  },

  "facebook-ads-training-2": {
    tagline: "Build, manage and scale profitable Meta advertising campaigns across Facebook and Instagram",
    level: "Beginner to Advanced",
    duration: "2 Days (16 Hours)",
    overview: "This comprehensive Facebook and Instagram Ads training covers the full Meta advertising platform — from account structure and audience building to creative strategy, campaign optimisation, and scaling. Participants learn how to build effective campaigns for every objective: brand awareness, lead generation, and direct sales — with hands-on exercises throughout both days using real Meta Ads accounts. You will leave with a full-funnel campaign structure, a creative testing framework, and the practical skills to manage and grow Meta ad spend profitably.",
    audience: [
      "Marketing managers responsible for social media advertising",
      "Business owners running their own Facebook or Instagram ads",
      "Social media managers expanding into paid advertising",
      "E-commerce brands wanting to profitably scale Meta spend",
      "Agency professionals managing Meta campaigns for clients",
    ],
    outcomes: [
      "Build correctly structured Meta ad campaigns from scratch",
      "Define and reach your ideal audience using Core, Custom, and Lookalike audiences",
      "Write and design ad creative that stops the scroll and converts",
      "Set up the Meta Pixel and conversion API for accurate tracking",
      "Test ad creatives and audiences with structured A/B testing",
      "Optimise campaigns based on ROAS, CPA, and funnel position",
      "Retarget website visitors and customer lists effectively",
      "Scale winning ad sets without sacrificing performance",
    ],
    curriculum: [
      { title: "Module 1: Meta Ads Fundamentals", topics: ["Facebook Business Manager setup and navigation", "Campaign, ad set, and ad structure", "Campaign objectives: awareness, traffic, engagement, leads, sales", "The Meta auction and how ads are delivered"] },
      { title: "Module 2: Audience Building", topics: ["Core audiences: demographics, interests, behaviours", "Custom audiences: website visitors, customer lists, engagement", "Lookalike audiences: creation and best practices", "Audience sizing and overlap analysis"] },
      { title: "Module 3: Meta Pixel & Tracking", topics: ["Installing and verifying the Meta Pixel", "Standard events and custom conversions", "Conversions API (CAPI) overview", "Tracking accuracy and iOS 14+ implications"] },
      { title: "Module 4: Creative Strategy", topics: ["Ad formats: image, video, carousel, collection, instant experience", "What makes high-performing Meta creative", "Writing copy that converts: hooks, body, CTA", "Creative testing frameworks"] },
      { title: "Module 5: Campaign Optimisation", topics: ["Reading Meta Ads Manager reports and breakdowns", "Cost-per-result benchmarks by objective and industry", "Budget optimisation: CBO vs ABO", "Diagnosing and fixing underperforming campaigns"] },
      { title: "Module 6: Scaling & Advanced Strategy", topics: ["Horizontal vs vertical scaling", "Full-funnel campaign structure: TOFU, MOFU, BOFU", "Retargeting sequences and dynamic ads", "Reporting to clients and stakeholders"] },
    ],
    certification: "Participants receive an Eddie Marketing Certificate of Completion in Meta Advertising. The course covers all content areas of the Meta Certified Digital Marketing Associate exam.",
    faqs: [
      { question: "Do I need a Facebook Business Manager account before the training?", answer: "Yes — we recommend setting up a Facebook Business Manager account before Day 1 so we can work with your actual account structure during the hands-on exercises. We provide setup guidance when you book. If you have an existing account with ad history, bring it — working with real data makes every session more valuable." },
      { question: "Has iOS 14 made Facebook Ads less effective?", answer: "iOS 14 reduced the accuracy of pixel-based tracking for iOS users, affecting remarketing and conversion optimisation. However, Facebook Ads remains highly effective, especially for Android audiences and with the Conversions API (CAPI) implemented. We cover CAPI and its impact in full on Day 1 — you will understand exactly how to set up tracking for maximum accuracy in the post-iOS 14 environment." },
      { question: "Is this training relevant for Instagram Ads?", answer: "Yes — Facebook and Instagram are managed through the same Meta Ads Manager platform. All campaigns, audiences, and reporting covered in this training apply equally to Instagram. We specifically cover Instagram placements, creative formats for Reels and Stories, and how to tailor your creative strategy for each platform." },
      { question: "Does this course cover Meta Ads (Facebook and Instagram) or just Facebook?", answer: "The course covers the full Meta advertising ecosystem — Facebook feed, Instagram feed, Reels, Stories, Audience Network, and Messenger placements — all managed through Meta Ads Manager. You'll learn how to configure campaigns for each placement, when to use Advantage+ placements versus manual selection, and how creative requirements differ across surfaces." },
      { question: "How does iOS privacy affect Meta Pixel tracking, and how does Conversions API help?", answer: "Apple's App Tracking Transparency changes significantly reduced the data available through the browser Meta Pixel for iOS users. Conversions API (CAPI) solves this by sending conversion events directly from your server to Meta — bypassing the browser entirely. The course covers CAPI setup and how to verify event quality in Events Manager, so your tracking remains as accurate as possible in a privacy-first world." },
      { question: "Will I learn how to create video ads or is this a production course?", answer: "This course focuses on advertising strategy and platform mechanics — not video production. However, we cover how to brief and structure video creative for Meta ads effectively: hook timing, caption requirements, aspect ratios, and what makes video perform on each placement. You'll leave knowing exactly what to ask of a creative team or freelancer to get Meta-optimised video assets." },
    ],
    industries: ["E-Commerce & Retail", "Hospitality & Tourism", "Healthcare & Beauty", "Real Estate", "Food & Beverage", "Fashion & Lifestyle", "Education", "Finance"],
    challenges: [
      "Ad fatigue setting in within weeks — cost-per-result creeping up as the same audience sees the same creative repeatedly",
      "Targeting audiences that are too broad or too narrow, wasting spend on people who will never buy",
      "Ad creative that doesn't stop the scroll — generic imagery and weak hooks that blend invisibly into the feed",
      "Constantly editing campaigns during the learning phase and resetting the algorithm, preventing stable optimisation",
      "iOS privacy changes reducing pixel data accuracy without understanding Conversions API as the correct solution",
    ],
  },

  "bing-ads-training": {
    tagline: "Reach high-intent Microsoft Search audiences that your competitors are ignoring — at a lower cost than Google",
    level: "Beginner to Intermediate",
    duration: "1 Day (8 Hours)",
    overview: "This focused Microsoft Advertising (Bing Ads) training gives you the practical skills to build, manage, and optimise paid search campaigns on the Microsoft Advertising platform. Covering campaign setup, audience targeting, ad copywriting, bidding, and performance reporting, you will leave equipped to launch campaigns immediately and reach a high-value audience that is often underserved by advertisers focused only on Google. Special attention is given to Microsoft's unique LinkedIn audience targeting and the import process for existing Google Ads campaigns.",
    audience: [
      "PPC professionals wanting to expand beyond Google Ads",
      "Marketing managers responsible for multi-channel paid search",
      "Business owners wanting to reach B2B audiences on LinkedIn-integrated search",
      "Google Ads specialists adding Microsoft Advertising to their skill set",
      "Agencies wanting to offer Microsoft Advertising services to clients",
    ],
    outcomes: [
      "Set up and navigate a Microsoft Advertising account",
      "Import and adapt Google Ads campaigns for Microsoft",
      "Build campaigns with the correct structure and keyword match types",
      "Write effective Expanded Text Ads and Responsive Search Ads for Bing",
      "Target LinkedIn profile audiences through Microsoft Audience Network",
      "Configure Universal Event Tracking (UET) for conversion measurement",
      "Optimise bids and budgets for Microsoft's auction dynamics",
      "Report on Microsoft Advertising performance and compare to Google",
    ],
    curriculum: [
      { title: "Module 1: Microsoft Advertising Overview", topics: ["The Microsoft Search Network: Bing, Yahoo, AOL", "Why Microsoft Ads? Audience quality and lower CPC", "Account structure vs Google Ads", "Navigating the Microsoft Advertising interface"] },
      { title: "Module 2: Campaign Setup", topics: ["Importing campaigns from Google Ads", "Campaign, ad group, and keyword structure", "Keyword match types and negative keywords", "Geo-targeting and scheduling"] },
      { title: "Module 3: Ad Copywriting & Formats", topics: ["Responsive Search Ads on Microsoft", "Ad extensions: sitelinks, callouts, call extensions", "Dynamic search ads", "Microsoft's ad approval policies"] },
      { title: "Module 4: Audience & LinkedIn Targeting", topics: ["Microsoft Audience Network overview", "LinkedIn profile targeting: company, industry, job function", "In-market and custom audiences", "Remarketing on Microsoft"] },
      { title: "Module 5: Tracking, Bidding & Reporting", topics: ["Universal Event Tracking (UET) setup", "Conversion goals and value tracking", "Smart bidding: Enhanced CPC, Target CPA, Target ROAS", "Microsoft Advertising reports vs Google Ads"] },
    ],
    certification: "Participants receive an Eddie Marketing Certificate of Completion in Microsoft Advertising. The course prepares you for the Microsoft Advertising Certified Professional (MACP) exam.",
    faqs: [
      { question: "Is Microsoft Advertising worth using alongside Google Ads?", answer: "Yes — especially for B2B businesses. Microsoft Search typically delivers lower CPCs than Google for equivalent keywords, and the LinkedIn audience targeting (available exclusively on Microsoft Advertising) is extremely valuable for reaching professionals by job title, industry, and company size. Many UAE businesses see 20–40% lower cost-per-lead on Microsoft versus Google for the same keywords." },
      { question: "Can I just import my Google Ads campaigns to Microsoft?", answer: "Yes — Microsoft Advertising has a direct Google Ads import feature that migrates your campaigns, keywords, ads, and bid strategies in minutes. This course covers the import process and the key adjustments you need to make after importing — because Microsoft's auction dynamics, audience behaviour, and platform features require specific adaptations to maximise performance." },
      { question: "What are the minimum budget requirements?", answer: "Microsoft Advertising is generally less competitive than Google, meaning budgets can go further. Most UAE businesses can start with AED 1,000–2,000 per month to generate meaningful data. We cover budget strategy specific to the UAE market in Module 5." },
      { question: "Is Microsoft Advertising still worth learning given Google's market dominance?", answer: "Absolutely. Microsoft Bing powers searches on Bing, Yahoo, AOL, and hundreds of partner sites. In many B2B sectors and in the UAE and GCC markets, Bing's audience skews toward older, higher-income, and professional decision-makers who are precisely the buyers most businesses want to reach. CPCs on Microsoft Ads are typically 30–70% lower than equivalent Google Ads terms, making it a highly efficient complement to any paid search programme." },
      { question: "Does the course cover Microsoft Advertising's LinkedIn profile targeting?", answer: "Yes — LinkedIn profile targeting is one of Microsoft Ads' most powerful differentiators and is covered in depth in Module 4. You'll learn how to layer LinkedIn company name, job title, industry, and seniority data onto your search campaigns to reach specific professional audiences — a capability unique to Microsoft Advertising — and how to measure whether the additional targeting improves conversion quality." },
      { question: "What is Universal Event Tracking (UET) and how is it different from Google Tag Manager?", answer: "UET is Microsoft Advertising's tracking tag — the equivalent of Google's conversion tracking and similar in function to Google Tag Manager, but specific to the Microsoft Ads ecosystem. The course covers UET setup, installation, and conversion goal configuration in Module 5. If you already use Google Tag Manager, we cover how to deploy UET through GTM, which is the most efficient approach for sites that already have GTM installed." },
    ],
    industries: ["B2B Technology", "Professional Services", "Finance & Legal", "Healthcare", "Education", "Manufacturing", "Real Estate", "E-Commerce"],
    challenges: [
      "Importing Google Ads campaigns without adjusting for Bing's different audience behaviour, resulting in wasted spend",
      "Missing Microsoft Advertising's LinkedIn profile targeting — one of its most powerful differentiators unavailable in Google Ads",
      "Applying Google Ads bidding strategies directly to Microsoft Ads without accounting for the smaller search volume",
      "Underestimating the Microsoft Shopping opportunity in sectors where Bing CPCs run 30–50% lower than Google",
      "Configuring Universal Event Tracking incorrectly because the UET tag and conversion setup differ from Google's approach",
    ],
  },

  "digital-marketing-training-dubai": {
    tagline: "The complete digital marketing programme — from strategy and SEO to paid media, social, and analytics, built for UAE professionals",
    level: "Beginner to Advanced",
    duration: "5 Days (40 Hours)",
    overview: "This comprehensive digital marketing training programme is the most complete course we offer — covering every major discipline from search engine optimisation and Google Ads to social media, content strategy, email marketing, analytics, and conversion rate optimisation. Delivered over 5 intensive days in Dubai, the course is designed for professionals who want to understand and execute the full digital marketing mix, and businesses building an internal marketing capability. You will leave with a working knowledge of every major digital channel, the ability to build and execute a multi-channel strategy, and confidence in using analytics to measure and improve performance.",
    audience: [
      "Marketing managers wanting a complete digital marketing skill set",
      "Business owners building their first in-house marketing team",
      "Graduates and career changers entering digital marketing",
      "Traditional marketers transitioning to digital channels",
      "Entrepreneurs wanting to market their own businesses effectively",
    ],
    outcomes: [
      "Build and execute a complete digital marketing strategy",
      "Conduct keyword research and implement technical and on-page SEO",
      "Set up and manage Google Ads campaigns",
      "Plan and run paid social campaigns on Meta and LinkedIn",
      "Develop a content marketing strategy and editorial calendar",
      "Set up and use Google Analytics 4 for measurement and reporting",
      "Write high-converting ad copy and landing page content",
      "Understand conversion rate optimisation principles",
      "Present digital marketing data and ROI to stakeholders",
    ],
    curriculum: [
      { title: "Day 1: Digital Marketing Strategy & SEO", topics: ["Digital marketing channels overview", "Customer journey mapping and buyer personas", "SEO fundamentals: on-page, off-page, technical", "Keyword research and content planning"] },
      { title: "Day 2: Google Ads & PPC", topics: ["Google Ads campaign structure", "Keyword match types and negative keywords", "Ad copywriting and extensions", "Bidding strategies and conversion tracking"] },
      { title: "Day 3: Social Media & Paid Social", topics: ["Organic social strategy for UAE platforms", "Facebook and Instagram Ads fundamentals", "LinkedIn Ads for B2B businesses", "Content creation and creative strategy"] },
      { title: "Day 4: Content, Email & E-Commerce", topics: ["Content marketing strategy and editorial planning", "Blog writing for SEO and engagement", "Email marketing: lists, automation, campaigns", "E-commerce marketing fundamentals"] },
      { title: "Day 5: Analytics, CRO & Reporting", topics: ["Google Analytics 4 and Google Tag Manager", "Conversion rate optimisation principles", "A/B testing methodology", "Building a monthly marketing report and presenting to leadership"] },
    ],
    certification: "Participants receive a comprehensive Eddie Marketing Digital Marketing Certificate upon completing all 5 days. The programme is structured to prepare participants for Google Ads Search, GA4, and Meta Blueprint certification exams — with exam guidance included throughout.",
    faqs: [
      { question: "Is this course suitable for complete beginners?", answer: "Yes — we start each module from first principles, making the programme accessible to complete beginners. At the same time, the depth of content means experienced marketers also gain significant new knowledge, especially in the analytics, paid media strategy, and CRO days. We recommend telling us your background when booking so we can tailor the pace appropriately." },
      { question: "Is the training delivered in Dubai?", answer: "Yes — the standard programme is delivered at our Dubai training facility. We also offer corporate group delivery at your offices for teams of 6 or more, and a live online version for participants who cannot attend in person. Online delivery covers the same curriculum with the same hands-on exercises." },
      { question: "Will I get hands-on practice or is it mostly theory?", answer: "Around 65% of each day is hands-on practical work. Every module includes live exercises using real accounts — you will run actual keyword research, build real campaigns, analyse real analytics data, and write real ad copy. Theory is taught in context, not in isolation from practice." },
      { question: "What platforms and tools are covered?", answer: "The programme covers: Google Ads, Google Analytics 4, Google Tag Manager, Google Search Console, Meta Ads Manager (Facebook and Instagram), LinkedIn Campaign Manager, Mailchimp or similar for email, and SEO tools including SEMrush and Google's own keyword planner. All tools used have free tiers available." },
      { question: "Is this relevant to marketing in the UAE specifically?", answer: "Yes — the programme is designed specifically for the UAE market. All examples, case studies, budgets, and benchmarks are drawn from UAE and GCC campaigns. We cover UAE-specific considerations: Arabic search behaviour, WhatsApp marketing, UAE platform preferences (Snapchat, TikTok), and UAE advertising regulations." },
    ],
    industries: ["All Industries — the programme is sector-agnostic and covers case studies from Real Estate, Healthcare, Hospitality, E-Commerce, Legal, Finance, Technology, and B2B Services"],
    challenges: [
      "Running channel tactics in silos — spending on SEO, ads, and social with no unified strategy or shared attribution model",
      "Not knowing which channels to prioritise in the UAE market when working with a limited budget",
      "Launching websites and campaigns without a measurement framework, making it impossible to calculate true ROI",
      "Confusing organic and paid strategies — not understanding when each is appropriate or how they reinforce each other",
      "Working with multiple agencies or freelancers without enough expertise to evaluate whether their work is quality",
    ],
  },

  "content-creation-strategy-training-2": {
    tagline: "Build a content strategy that attracts customers, builds authority, and drives organic growth — without guesswork",
    level: "Beginner to Intermediate",
    duration: "2 Days (16 Hours)",
    overview: "This practical content creation and strategy training gives marketers, business owners, and content creators the skills to plan, produce, and distribute content that ranks in search, builds brand authority, and generates qualified leads. You will build a full content strategy during the two-day workshop — leaving with a working editorial calendar, keyword-mapped content plan, and the skills to produce every type of content your marketing needs. The course covers written content, social formats, video scripts, and distribution strategy across every major channel.",
    audience: [
      "Marketing managers responsible for content production and SEO",
      "Business owners who want to produce content that generates leads",
      "Social media managers expanding into strategic content marketing",
      "Copywriters and content creators wanting to add strategy to their skills",
      "In-house marketing teams building a content programme from scratch",
    ],
    outcomes: [
      "Audit existing content and identify gaps versus competitors",
      "Build a keyword-mapped content strategy targeting your audience",
      "Create a 3-month editorial calendar with topic clusters",
      "Write SEO-optimised blog posts that rank and convert",
      "Produce content for every stage of the buyer journey",
      "Distribute content across social, email, and owned channels",
      "Brief external writers effectively for consistent output",
      "Measure content performance with GA4 and Search Console",
    ],
    curriculum: [
      { title: "Module 1: Content Strategy Foundations", topics: ["What is content marketing and why it works", "Customer journey mapping: TOFU, MOFU, BOFU content", "Competitor content audit methodology", "Defining your content pillars and brand voice"] },
      { title: "Module 2: Keyword Research for Content", topics: ["Keyword research tools: Google Keyword Planner, SEMrush, Answer The Public", "Search intent: informational, navigational, commercial, transactional", "Topic clusters and pillar page architecture", "Mapping keywords to content types"] },
      { title: "Module 3: Content Production", topics: ["Writing blog posts that rank: structure, headings, length", "On-page SEO: title tags, meta descriptions, internal links", "Social content formats: carousels, videos, stories, posts", "Repurposing one piece of content across multiple formats"] },
      { title: "Module 4: Editorial Planning & Distribution", topics: ["Building a 3-month editorial calendar", "Content distribution across owned, earned, and paid channels", "Email marketing integration with content", "Guest posting, PR, and link acquisition through content"] },
      { title: "Module 5: Measurement & Iteration", topics: ["Key content metrics: organic traffic, time on page, conversions", "Google Search Console for content performance", "Updating and refreshing existing content", "Scaling: using AI tools, freelancers, and systems"] },
    ],
    certification: "Participants receive an Eddie Marketing Certificate of Completion in Content Marketing Strategy.",
    faqs: [
      { question: "Do I need writing experience before attending?", answer: "No — the course teaches you how to write effective content from first principles. We focus on structured, strategic writing rather than creative or journalistic writing. If you already write professionally, the strategy and SEO modules will significantly amplify the impact of your existing skills." },
      { question: "Is AI content covered in this training?", answer: "Yes — AI writing tools (ChatGPT, Claude, Gemini, and SEO-specific tools) are covered in Module 5 as part of scaling your content output. We cover how to use AI tools effectively for research, drafting, and ideation — and equally how to ensure the output is original, accurate, and genuinely helpful rather than generic AI filler that harms SEO." },
      { question: "How quickly will our content start generating traffic and leads?", answer: "Content marketing is a medium-to-long-term investment. Realistically, well-optimised content begins ranking meaningfully within 3–6 months of publication, with compounding traffic growth over 12+ months. We cover this timeline honestly in Module 1, and we include strategies for getting faster wins through social distribution and email to your existing audience while organic rankings develop." },
      { question: "Is this course focused on written content or does it cover video and social?", answer: "The course covers the full content mix — written (blogs, long-form, landing page copy), visual (infographics, carousels), video (scripts and short-form strategy), and social (platform-specific formats). The central framework is content strategy and distribution, which applies across all formats. You will leave with a content system that works across channels, not just skills in one medium." },
      { question: "Will I learn how to brief and manage external writers?", answer: "Yes — the course includes a module on briefing, editorial workflow, and quality control for content production teams. You'll learn how to write a brief that gets you what you need, how to establish a review process that maintains quality without slowing production, and how to set measurable targets that keep a content team accountable for business outcomes rather than just output volume." },
      { question: "How do I measure whether content marketing is actually working?", answer: "Content ROI measurement is covered in Module 5. You'll learn how to set up content performance dashboards in Google Analytics 4, define conversion events that attribute leads to specific pieces of content, and report on content's contribution to pipeline. We also cover leading indicators — time on page, scroll depth, returning visitor rate — and how to use them to evaluate content quality before traffic volume builds." },
    ],
    industries: ["B2B Services", "E-Commerce", "Healthcare", "Real Estate", "Finance & Legal", "Technology", "Education", "Professional Services"],
    challenges: [
      "Publishing content regularly but ranking on page 4 or 5 where less than 1% of searchers ever reach",
      "No editorial calendar — content is produced reactively and inconsistently, making it impossible to build topical authority",
      "Writing for search engines rather than the actual audience, producing robotic content that ranks but doesn't convert",
      "Not knowing how to repurpose one piece of content across multiple channels to maximise its investment",
      "Underestimating the role of distribution — great content without a promotion plan reaches almost no one",
    ],
  },

  "wordpress-training": {
    tagline: "Build, manage and grow your WordPress website with confidence — no developer dependency required",
    level: "Beginner to Intermediate",
    duration: "1 Day (8 Hours)",
    overview: "This hands-on WordPress training gives business owners, marketing teams, and content managers the practical skills to build and manage their WordPress website independently. From understanding the WordPress admin to adding pages, editing content, managing plugins, improving site speed, and implementing basic SEO — you will leave with the ability to run and grow your site without waiting for developer help. The course covers both the native block editor and popular page builders, with specific attention to the issues most commonly encountered by non-technical site managers.",
    audience: [
      "Business owners who want to manage their own WordPress website",
      "Marketing managers responsible for website content updates",
      "Content editors who need to publish pages, posts, and media",
      "Small business teams without a dedicated web developer",
      "Virtual assistants and admin staff managing client websites",
    ],
    outcomes: [
      "Navigate the WordPress admin dashboard with confidence",
      "Create and edit pages, posts, and custom content types",
      "Manage media: upload, edit, and optimise images",
      "Install, activate, and configure essential plugins",
      "Set up and use Yoast or RankMath for basic on-page SEO",
      "Back up and restore a WordPress site",
      "Understand WordPress security best practices",
      "Troubleshoot common WordPress issues independently",
    ],
    curriculum: [
      { title: "Module 1: WordPress Fundamentals", topics: ["What is WordPress and how it works", "Hosting, domain, and WordPress installation overview", "Navigating the WordPress dashboard", "Understanding themes, plugins, and the block editor"] },
      { title: "Module 2: Content Management", topics: ["Creating and editing pages and posts", "Using the Gutenberg block editor effectively", "Working with the WordPress media library", "Managing categories, tags, and custom fields"] },
      { title: "Module 3: Plugins & Customisation", topics: ["Essential plugins: Yoast SEO, WooCommerce, Contact Form 7, Akismet", "Installing, activating, and updating plugins safely", "Theme customisation with the WordPress Customizer", "Menus, widgets, and sidebar management"] },
      { title: "Module 4: SEO & Performance", topics: ["On-page SEO with Yoast or RankMath: titles, meta, focus keywords", "Image optimisation for web performance", "Site speed: caching plugins and image compression", "Connecting Google Analytics 4 and Google Search Console"] },
      { title: "Module 5: Security & Maintenance", topics: ["WordPress backup strategies and restoration", "Security plugins: Wordfence and iThemes Security", "Keeping WordPress core, themes, and plugins updated", "Common WordPress errors and how to fix them"] },
    ],
    certification: "Participants receive an Eddie Marketing Certificate of Completion in WordPress Website Management.",
    faqs: [
      { question: "Do I need any technical background to attend?", answer: "No — this course is designed for non-technical users. We assume no prior knowledge of coding, web design, or server management. Everything is taught through the WordPress admin interface, which is designed to be used without code. Basic computer literacy (using a web browser, creating documents) is all that is required." },
      { question: "Which WordPress builder does this course cover?", answer: "The course primarily covers the native WordPress block editor (Gutenberg), which is built into all WordPress installations. We also cover Elementor and Divi at an introductory level, as they are widely used by UAE website owners. If your site uses a specific page builder, let us know when booking and we will tailor the content accordingly." },
      { question: "My website was built by a developer — can I still learn to manage it?", answer: "Yes — and this is one of the most common situations our students are in. Even if your theme or structure was built by a developer, the content management, SEO, and maintenance modules apply fully. We will help you understand what you can safely edit yourself versus what requires developer input, so you can be more independent without risking your site." },
      { question: "Is WooCommerce covered?", answer: "WooCommerce is introduced in Module 3, covering basic product management, order handling, and plugin configuration. For businesses that need deeper WooCommerce training (shipping, payment gateways, stock management, email automation), we offer a dedicated WooCommerce workshop as a half-day add-on." },
      { question: "Will I learn how to make my WordPress site load faster and rank on Google?", answer: "Yes — site speed and SEO fundamentals are covered in Module 4. You'll learn how to assess your site's performance using Google PageSpeed Insights, configure caching and image compression plugins correctly, and avoid common mistakes that slow WordPress sites down. For SEO, we cover Yoast or RankMath configuration, XML sitemap setup, permalink structure, and meta field management so your site is properly indexed and competitive in search results." },
      { question: "Is WordPress website management covered, or just the initial build?", answer: "Both. The course covers building pages and posts from scratch, maintaining and updating existing sites, managing plugins safely (updates, conflicts, security patches), running backups, and troubleshooting common errors. You'll leave able to both build a new page confidently and take ownership of an existing site — including making changes without risking breaking it." },
    ],
    industries: ["Small Business", "E-Commerce & Retail", "Hospitality & Tourism", "Professional Services", "Healthcare", "Real Estate", "Education", "Nonprofits"],
    challenges: [
      "Accidentally breaking a live website when installing plugins or making updates without understanding the risks",
      "No backup strategy — losing hours of work when something goes wrong during a plugin update or theme change",
      "Installing too many plugins that slow page speed, create conflicts, and introduce security vulnerabilities",
      "Missing the SEO basics — no XML sitemap, incorrect permalink structure, and metadata fields left blank across all pages",
      "Publishing pages that look broken on mobile because they were only tested on desktop during editing",
    ],
  },
};

// ─── Default (fallback) ───────────────────────────────────────────────────────

const DEFAULT_TRAINING: TrainingData = {
  tagline: "Practical digital marketing training for UAE professionals — delivered by certified industry experts",
  level: "All Levels",
  duration: "1–2 Days",
  overview: "This hands-on training programme gives marketing professionals, business owners, and digital teams the practical skills to plan, execute, and measure effective digital marketing campaigns. All exercises use real accounts and real data — so skills are immediately applicable when you return to work.",
  audience: [
    "Marketing professionals wanting to deepen specialist skills",
    "Business owners who want to understand and manage their digital marketing",
    "Marketing coordinators and executives expanding their skill set",
    "Freelancers and consultants adding new services",
  ],
  outcomes: [
    "Understand the key principles and best practices of the subject area",
    "Apply skills immediately to your own campaigns and accounts",
    "Measure performance and make data-driven optimisation decisions",
    "Avoid the most common and costly mistakes in the discipline",
  ],
  curriculum: [
    { title: "Module 1: Fundamentals", topics: ["Core concepts and platform overview", "Account setup and structure", "Key terminology and metrics"] },
    { title: "Module 2: Strategy & Planning", topics: ["Goal setting and KPI definition", "Audience research and targeting", "Campaign planning and budgeting"] },
    { title: "Module 3: Execution", topics: ["Campaign build and launch", "Creative and copy best practices", "Tracking and measurement setup"] },
    { title: "Module 4: Optimisation & Reporting", topics: ["Performance analysis and reporting", "Optimisation techniques", "Scaling and iteration"] },
  ],
  certification: "Participants receive an Eddie Marketing Certificate of Completion, recognising their achievement in completing a professional training programme.",
  faqs: [
    { question: "Is the training available online?", answer: "Yes — all our training programmes are available in-person (Dubai), live online (Zoom), and as corporate group sessions delivered at your offices. Online participants receive the same materials, exercises, and certificate as in-person attendees." },
    { question: "How many participants are in each session?", answer: "We limit group sizes to a maximum of 12 participants to ensure every attendee gets individual attention and hands-on practice time. Corporate group sessions can be larger and are structured accordingly." },
    { question: "Do I get course materials to keep?", answer: "Yes — all participants receive a comprehensive digital workbook covering all modules, step-by-step exercise guides, and a reference sheet of key settings, shortcuts, and best practices for the discipline covered." },
  ],
  industries: ["All Industries"],
  challenges: [
    "Learning from online tutorials without hands-on practice in real accounts",
    "Making costly mistakes early because there is no expert to guide decision-making",
    "Not knowing what questions to ask when working with agencies or freelancers",
    "Applying tactics without a strategy — busy but not moving the needle",
    "Spending time and budget on the wrong channels for your business type and market",
  ],
};

// ─── Static data (same for every training page) ───────────────────────────────

const TRAINING_FORMATS = [
  {
    name: "In-Person — Dubai",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    desc: "Attend our Dubai training facility for the full in-person experience — face-to-face with the trainer, real-account exercises, and networking with fellow participants.",
    badge: "Most Popular",
  },
  {
    name: "Live Online",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    desc: "Attend via Zoom from anywhere in the world. Same curriculum, same exercises, same certificate — with interactive Q&A and screen-share practice throughout.",
    badge: null,
  },
  {
    name: "Corporate Group",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    desc: "We deliver the programme at your offices or a venue of your choice for groups of 4 or more. Content customised to your tools, accounts, and business context.",
    badge: "Best for Teams",
  },
];

const STUDENT_BENEFITS = [
  { title: "Small Class Sizes", desc: "Maximum 12 participants per session — guaranteed individual attention and meaningful hands-on practice time for every attendee" },
  { title: "Real Accounts, Real Data", desc: "All exercises use real marketing accounts and real campaign data — not simulations — so skills transfer immediately to your daily work" },
  { title: "Comprehensive Materials", desc: "Digital workbook, step-by-step exercise guides, and reference sheets — all yours to keep and reference after the course" },
  { title: "Certificate of Completion", desc: "Eddie Marketing Certificate of Completion, recognised by UAE employers and clients as evidence of practical training in the discipline" },
  { title: "Post-Training Support", desc: "30 days of post-training email support — bring your real-world questions after you return to work and our trainers will help you apply what you learned" },
  { title: "Exam Preparation Guidance", desc: "Where relevant, the course includes guidance on preparing for the official certification exam for the platform covered" },
];

const WHY_TRAIN_WITH_EDDIE = [
  { title: "Practitioner-Led Training", desc: "Every course is delivered by a practitioner who runs live campaigns — not a career trainer who teaches theory without day-to-day execution experience" },
  { title: "UAE Market Expertise", desc: "All examples, benchmarks, and case studies are drawn from UAE and GCC campaigns — immediately applicable to the market you actually operate in" },
  { title: "Hands-On Focus", desc: "We spend at least 60% of every session on practical exercises — you build real campaigns and analyse real data, not complete worksheet exercises" },
  { title: "Small Groups Guaranteed", desc: "We cap every session at 12 participants — so the trainer knows your name, your business, and your questions by the end of Day 1" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface TrainingPageSectionsProps {
  slug: string;
  pageTitle: string;
  serviceCategories: { slug: string; name: string }[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrainingPageSections({ slug, pageTitle, serviceCategories }: TrainingPageSectionsProps) {
  const data = TRAINING_CONFIG[slug] ?? DEFAULT_TRAINING;
  const relatedCourses = ALL_TRAINING_COURSES.filter((c) => c.slug !== slug);

  return (
    <>
      {/* ── Course Meta Bar ───────────────────────────────────────────── */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {[
              { label: "Level", value: data.level },
              { label: "Duration", value: data.duration },
              { label: "Format", value: "In-Person · Online · Corporate" },
              { label: "Certificate", value: "Included" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Course Overview ───────────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-3">Course Overview</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-5 tracking-tight">
                What You&apos;ll Learn
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {data.overview}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 mb-4">Course at a Glance</p>
              <ul className="space-y-4">
                {[
                  { label: "Support", value: "30-Day Post-Training Email Support", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
                  { label: "Group Training", value: "Corporate & Team Bookings Available", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
                  { label: "Materials", value: "Course Notes & Resources Included", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
                ].map(({ label, value, icon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Who Should Attend ─────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Is This For Me?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Who Should Attend</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {data.audience.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-5">
                <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Challenges This Course Addresses ──────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500 mb-2">Why This Course Matters</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Challenges This Course Addresses</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
              These are the real problems this training is built to solve — issues we see consistently across UAE marketing teams and businesses every day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {data.challenges.map((challenge, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl border border-slate-200 p-5">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Learning Outcomes ─────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">What You&apos;ll Take Away</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Learning Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {data.outcomes.map((outcome, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pt-1">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Course Curriculum ─────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">What We Cover</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Course Curriculum</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.curriculum.map((module, i) => (
              <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg ems-gradient-bg text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-sm font-bold text-white">{module.title}</h3>
                </div>
                <ul className="space-y-2">
                  {module.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Training Formats ──────────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">How We Deliver</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Training Formats</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAINING_FORMATS.map((format) => (
              <div key={format.name} className="relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                {format.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-600">
                    {format.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  {format.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{format.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{format.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Certification ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-200 mb-2">Certification</p>
              <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">What You Earn</h2>
              <p className="text-blue-100 leading-relaxed">{data.certification}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <FaqAccordion
        items={data.faqs}
        eyebrow={pageTitle}
        title="Frequently Asked Questions"
      />

      {/* ── Industries Served ─────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Who We Train</p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Industries Served</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {data.industries.map((industry) => (
              <span
                key={industry}
                className="inline-block px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Train With Eddie ──────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Why Choose Us</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Why Train With Eddie Marketing</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_TRAIN_WITH_EDDIE.map((item) => (
              <FeatureCard
                key={item.title}
                title={item.title}
                description={item.desc}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Student Benefits ──────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">What&apos;s Included</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Student Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STUDENT_BENEFITS.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{benefit.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related Courses ───────────────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">Keep Learning</p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Related Courses</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCourses.slice(0, 8).map((course) => (
              <Link
                key={course.slug}
                href={`/${course.slug}`}
                className="group flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                  {course.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related Services ──────────────────────────────────────────── */}
      {serviceCategories.length > 0 && (
        <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">Ready to Outsource?</p>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Related Managed Services</h2>
                <p className="text-slate-500 text-sm mt-1 max-w-lg">
                  Prefer to have our specialists manage your campaigns? Explore our done-for-you services.
                </p>
              </div>
              <Link href="/services" className="hidden sm:inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                All services →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceCategories.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                    View service →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
