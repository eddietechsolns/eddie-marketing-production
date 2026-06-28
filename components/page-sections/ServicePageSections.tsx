import Link from "next/link";
import { StatCard, FeatureCard } from "@/components/ui/Card";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/components/ui/FaqAccordion";

// ─── Service cluster data ─────────────────────────────────────────────────────

interface ServiceStat {
  value: string;
  label: string;
  accent: "blue" | "orange" | "green";
}

interface ServiceBenefit {
  title: string;
  desc: string;
}

interface ServiceDeliverable {
  title: string;
  desc: string;
}

interface ProcessStep {
  number: string;
  title: string;
  desc: string;
}

interface ServiceData {
  tagline: string;
  stats: ServiceStat[];
  benefits: ServiceBenefit[];
  challenges?: { title: string; desc: string }[];
  deliverables: ServiceDeliverable[];
  process: ProcessStep[];
  faqs: FaqItem[];
  cta: string;
}

const SERVICE_DATA: Record<string, ServiceData> = {
  SEO: {
    tagline: "Sustainable organic growth that compounds over time and reduces your reliance on paid ads",
    stats: [
      { value: "+380%", label: "Average Organic Traffic Growth", accent: "blue" },
      { value: "Top 3", label: "Average Keyword Ranking", accent: "orange" },
      { value: "6 Mo", label: "Average Time to First-Page Rankings", accent: "green" },
      { value: "9.4x", label: "Average ROI on SEO Investment", accent: "blue" },
    ],
    benefits: [
      { title: "Long-Term Compounding Returns", desc: "Unlike paid ads, SEO results compound over time — rankings achieved today keep driving traffic for years" },
      { title: "High-Intent Traffic", desc: "Organic search visitors have the highest purchase intent of any marketing channel" },
      { title: "Brand Authority", desc: "Top organic rankings signal credibility and authority to prospects who trust organic results more than ads" },
      { title: "Reduced Ad Dependency", desc: "Strong organic rankings reduce your reliance on paid traffic and cut long-term customer acquisition costs" },
    ],
    deliverables: [
      { title: "Technical SEO Audit & Fixes", desc: "Full crawl of your site covering page speed, Core Web Vitals, indexation, and schema" },
      { title: "Keyword Strategy", desc: "In-depth keyword research mapping intent to pages across your entire site" },
      { title: "On-Page Optimisation", desc: "Title tags, meta descriptions, heading structures, and content optimisation" },
      { title: "Content Creation", desc: "SEO-optimised blog posts, landing pages, and resource content targeting your highest-value keywords" },
      { title: "Link Building", desc: "High-authority, relevant backlinks acquired through editorial outreach" },
      { title: "Monthly Reporting", desc: "Full ranking, traffic, and conversion tracking with month-on-month comparison" },
    ],
    process: [
      { number: "01", title: "Audit & Strategy", desc: "We begin with a comprehensive technical audit and competitive analysis to identify your biggest opportunities" },
      { number: "02", title: "Keyword Mapping", desc: "We map high-value keywords to existing and new pages, prioritising by search volume and commercial intent" },
      { number: "03", title: "On-Page & Technical", desc: "We implement all technical fixes and on-page optimisations across your priority pages" },
      { number: "04", title: "Content & Links", desc: "We produce strategic content and acquire high-authority backlinks to build domain authority" },
      { number: "05", title: "Monitor & Scale", desc: "We track rankings weekly and iterate the strategy based on data — compounding growth month on month" },
    ],
    faqs: [
      { question: "How long does SEO take to work?", answer: "Meaningful ranking improvements typically appear within 3–6 months of beginning optimisation. Full compounding results — where rankings, traffic, and leads all grow consistently — develop over 12+ months. Technical fixes and quick-win keyword wins often deliver visible improvements within the first 8 weeks." },
      { question: "How do you choose which keywords to target?", answer: "We research keywords by search volume, commercial intent, and ranking difficulty. We prioritise terms your ideal customers actually search when they're ready to buy, not just browse — focusing on keywords that drive enquiries and revenue, not just traffic." },
      { question: "Is link building still important for SEO?", answer: "Yes — backlinks remain one of Google's top ranking signals. We acquire links through editorial outreach, digital PR, and content partnerships — never paid link schemes or link farms that risk Google penalties. Every link we build is from a relevant, authoritative source." },
      { question: "Do you handle technical SEO as well as content?", answer: "Yes — every engagement starts with a technical audit covering site speed, crawlability, Core Web Vitals, indexation, and schema markup. Technical fixes often deliver some of the fastest early ranking wins, before content improvements compound on top." },
      { question: "How is SEO performance measured?", answer: "We track keyword rankings, organic traffic growth, conversion rates, and organic lead or revenue attribution. Monthly reports compare these metrics against the same period last year and the previous month, so you always have clear context for the numbers." },
      { question: "Can SEO work alongside Google Ads?", answer: "Yes — SEO and paid search are complementary channels. Ads provide immediate traffic while SEO builds your long-term organic position. Together they maximise your total search engine real estate and typically reduce overall cost per lead as organic traffic grows." },
    ],
    challenges: [
      { title: "Ranking for keywords that never convert", desc: "Many sites attract high-volume traffic from informational searches — because the keyword strategy targets volume over buyer intent. Ranking higher only amplifies this problem." },
      { title: "Algorithm updates erasing months of gains", desc: "Google's core updates can cause significant ranking drops for sites that haven't built authority correctly across technical, content, and link signals — wiping out progress overnight." },
      { title: "Technical issues silently suppressing rankings", desc: "Slow page speed, duplicate content, crawl errors, and Core Web Vitals failures suppress rankings even when content quality is high — and most businesses are unaware the issues exist." },
      { title: "Competitors outranking you despite weaker content", desc: "Domain authority built through high-quality backlinks is the hardest SEO signal to overcome. Without a systematic link acquisition approach, well-written content loses to established competitors." },
      { title: "No clear link between SEO and business outcomes", desc: "Without proper conversion tracking and channel attribution, it's impossible to demonstrate what SEO contributes to leads and revenue — making the investment hard to justify or scale." },
    ],
    cta: "Start Growing Your Organic Traffic",
  },
  "Google Ads": {
    tagline: "Performance-driven Google Ads campaigns that deliver qualified leads at a predictable cost",
    stats: [
      { value: "6.2x", label: "Average ROAS Achieved", accent: "blue" },
      { value: "-42%", label: "Average Cost-Per-Lead Reduction", accent: "orange" },
      { value: "48h", label: "Campaign Launch Time", accent: "green" },
      { value: "100%", label: "Certified Google Partners", accent: "blue" },
    ],
    benefits: [
      { title: "Immediate Visibility", desc: "Google Ads puts your business at the top of search results from day one — no waiting for organic rankings" },
      { title: "Precise Audience Targeting", desc: "Reach exactly the right audience by keyword, location, device, time, and intent signal" },
      { title: "Full Budget Control", desc: "Set precise daily and monthly budgets — you only pay when someone clicks your ad" },
      { title: "Measurable ROI", desc: "Every click, lead, and sale is tracked — you always know exactly what your ad spend is returning" },
    ],
    deliverables: [
      { title: "Campaign Architecture", desc: "Structured campaigns, ad groups, and match types engineered for maximum Quality Score" },
      { title: "Ad Copy Creation", desc: "Multiple ad variants tested continuously to find the highest-performing messaging" },
      { title: "Landing Page Recommendations", desc: "Conversion rate optimisation guidance for pages receiving paid traffic" },
      { title: "Bid Strategy Management", desc: "Smart bidding strategies configured and monitored to hit your CPA and ROAS targets" },
      { title: "Negative Keyword Management", desc: "Ongoing negative keyword builds to eliminate wasted spend on irrelevant searches" },
      { title: "Monthly Performance Reports", desc: "Full breakdown of impressions, clicks, conversions, CPA, and ROAS every month" },
    ],
    process: [
      { number: "01", title: "Discovery & Audit", desc: "We audit your existing campaigns (or start fresh) and research the competitive landscape" },
      { number: "02", title: "Strategy & Build", desc: "We design your campaign architecture, write ad copy, and build all campaigns and ad groups" },
      { number: "03", title: "Launch & Test", desc: "We launch campaigns with controlled budgets and A/B test ad variants from week one" },
      { number: "04", title: "Optimise Weekly", desc: "Every week, we optimise bids, refine targeting, cut waste, and expand what's working" },
      { number: "05", title: "Scale & Report", desc: "We scale winning campaigns and report full ROAS and lead metrics monthly" },
    ],
    faqs: [
      { question: "How much budget do I need to start Google Ads?", answer: "The right budget depends on your industry, location, and target CPA. As a minimum, we recommend enough monthly budget to generate statistically meaningful data — typically AED 3,000–10,000/month for the UAE market. We'll recommend a specific starting budget based on your goals and competitive landscape before launch." },
      { question: "How quickly will we see results from Google Ads?", answer: "You'll start getting impressions and clicks from day one. Meaningful conversion data typically develops within the first 2–4 weeks, and we optimise aggressively in the first 90 days to achieve your target CPA. Most clients see significant improvement in cost-per-lead within the first 60 days." },
      { question: "What is Quality Score and why does it matter?", answer: "Quality Score is Google's rating of your ad relevance, expected click-through rate, and landing page experience. Higher scores mean lower cost-per-click and better ad positions for the same bid. Our campaign architecture is specifically designed to maximise Quality Score, reducing your costs over time." },
      { question: "Do you keep ownership of the Google Ads account?", answer: "The account is always under your name — you retain full ownership and access. We work inside your account, not ours, so you always have complete visibility and control. If you ever part ways with us, you keep every campaign, every conversion, and every piece of historical data." },
      { question: "How do you prevent wasted ad spend?", answer: "Negative keyword management, tight match type control, landing page optimisation, device and location bid adjustments, and weekly bid reviews all work together to eliminate waste. We provide full search term reports so you can see exactly what queries are triggering your ads." },
      { question: "What types of Google Ads campaigns do you manage?", answer: "We manage Search campaigns, Performance Max, Google Shopping, Display and Remarketing, YouTube, and Google Hotel Ads depending on your business type and goals. Most clients start with Search for the highest-intent traffic, then expand to other campaign types as budgets and data allow." },
    ],
    challenges: [
      { title: "Budget consumed by irrelevant searches", desc: "Broad-match keywords without a disciplined negative keyword strategy drive expensive clicks from queries that will never convert — and most campaigns never surface these wasted queries in reports." },
      { title: "High spend with poor conversion rates", desc: "Sending paid traffic to a generic homepage rather than a purpose-built landing page is the most common cause of high cost-per-lead and disappointing ROAS — the page, not the ad, is often the problem." },
      { title: "Competitors intercepting your branded traffic", desc: "Without a branded keyword campaign, competitors bid on your brand name and divert prospects who were already searching specifically for your business — the easiest wins on Google to give away." },
      { title: "Campaigns running budget at non-converting hours", desc: "Without ad scheduling and location bid adjustments calibrated to actual conversion data, budgets run during periods when your audience is browsing rather than buying." },
      { title: "No reliable attribution between spend and revenue", desc: "Without correctly configured conversion tracking, it's impossible to measure true ROAS, teach smart bidding the right signals, or make confident decisions about budget allocation." },
    ],
    cta: "Launch Your Google Ads Campaign",
  },
  "Social Media": {
    tagline: "Social media marketing that builds brand awareness, drives engagement, and generates real business leads",
    stats: [
      { value: "+520%", label: "Average Engagement Growth", accent: "blue" },
      { value: "3.8x", label: "Average Lead Growth via Social", accent: "orange" },
      { value: "14M+", label: "Social Impressions Delivered", accent: "green" },
      { value: "98%", label: "Client Satisfaction Rate", accent: "blue" },
    ],
    benefits: [
      { title: "Brand Visibility at Scale", desc: "Reach millions of potential customers on the platforms they use every day" },
      { title: "Community Building", desc: "Build a loyal audience that advocates for your brand and returns repeatedly" },
      { title: "Targeted Lead Generation", desc: "Meta and LinkedIn ads generate qualified leads at a fraction of traditional marketing costs" },
      { title: "Competitor Intelligence", desc: "Social monitoring gives real-time insight into competitor positioning and market sentiment" },
    ],
    deliverables: [
      { title: "Social Media Strategy", desc: "Platform selection, content strategy, audience definitions, and KPI framework" },
      { title: "Content Creation", desc: "Professional graphics, videos, carousels, and written content tailored to each platform" },
      { title: "Community Management", desc: "Daily monitoring, comment responses, and community engagement" },
      { title: "Paid Social Campaigns", desc: "Meta, LinkedIn, TikTok, and Twitter/X ad campaigns targeting your ideal audience" },
      { title: "Influencer Coordination", desc: "Identification and management of relevant influencer partnerships" },
      { title: "Monthly Analytics Report", desc: "Full reach, engagement, follower, and lead tracking with actionable insights" },
    ],
    process: [
      { number: "01", title: "Audit & Strategy", desc: "We audit your current social presence and develop a channel-specific strategy" },
      { number: "02", title: "Content Planning", desc: "We build a 30-day content calendar aligned with your brand voice and campaign goals" },
      { number: "03", title: "Content Production", desc: "We produce all graphics, videos, and copy — ready for your approval before posting" },
      { number: "04", title: "Publish & Engage", desc: "We post to schedule, monitor for comments, and manage community interactions daily" },
      { number: "05", title: "Analyse & Improve", desc: "Monthly reporting drives ongoing optimisation of content mix, posting times, and paid spend" },
    ],
    faqs: [
      { question: "Which social media platforms should we be on?", answer: "It depends on your audience and goals. For B2C brands, Instagram and Facebook deliver the highest reach and engagement. For B2B, LinkedIn is most effective. TikTok and YouTube work well for visual and video content. We audit your audience and recommend the right platform mix rather than spreading thin across all of them." },
      { question: "How often should we post on social media?", answer: "For most businesses, 3–5 posts per week provides consistent visibility without diminishing returns. Quality matters more than frequency — we build a content calendar that sustains this output with original, high-value content rather than filler posts that harm engagement rates." },
      { question: "Can you run paid ads alongside organic content?", answer: "Yes — and we recommend it. Organic reach on most platforms has declined significantly; paid social extends your reach to new audiences while organic content builds community and trust with existing followers. The two work best together with a coordinated strategy and shared audience data." },
      { question: "How do you measure social media ROI?", answer: "We track engagement, follower growth, reach, and — most importantly — leads and conversions generated from social. We set up conversion tracking to trace social traffic all the way to form submissions, calls, and sales. Vanity metrics like likes are reported for context, but decisions are driven by lead and revenue data." },
      { question: "Do you create all the content, or do we need to supply materials?", answer: "We create everything — graphics, video content, copy, and imagery. We brief you before the content calendar is finalised to capture your brand voice, any product updates, upcoming campaigns, and approvals. Some clients prefer to supply raw photography; we can work with either approach." },
    ],
    challenges: [
      { title: "Posting consistently without business results", desc: "Consistent posting that generates neither enquiries nor website traffic signals a content strategy disconnected from commercial objectives — activity mistaken for marketing." },
      { title: "Organic reach declining despite strong content", desc: "Platform algorithm changes have dramatically reduced organic post reach. Paid amplification is now necessary to maintain audience visibility, even for high-quality content." },
      { title: "No editorial framework for consistent output", desc: "Reactive, ad hoc content production leads to inconsistent quality, missed trend opportunities, and brand messaging that drifts without a structured planning process." },
      { title: "Social activity invisible in business reporting", desc: "Without conversion tracking, UTM parameters, and proper attribution setup, social media cannot be credited for the leads and sales it genuinely generates." },
      { title: "Audience fatigue from repetitive content formats", desc: "Using the same content type repeatedly, or ignoring platform-native formats like Reels and carousels, leads to falling engagement rates that are very difficult to reverse once established." },
    ],
    cta: "Grow Your Social Media Presence",
  },
  "Content Marketing": {
    tagline: "Strategic content that attracts your ideal audience, builds authority, and converts visitors into leads",
    stats: [
      { value: "+340%", label: "Average Organic Traffic from Content", accent: "blue" },
      { value: "7.8x", label: "Average Content ROI", accent: "orange" },
      { value: "60+", label: "Content Pieces Produced Monthly", accent: "green" },
      { value: "94%", label: "Client Retention Rate", accent: "blue" },
    ],
    benefits: [
      { title: "Sustainable Organic Growth", desc: "Quality content builds lasting organic traffic that doesn't switch off when you stop paying" },
      { title: "Authority & Trust", desc: "Helpful, expert content positions your brand as the trusted authority in your field" },
      { title: "Lead Nurturing at Scale", desc: "Content guides prospects through every stage of the buying journey automatically" },
      { title: "SEO Amplification", desc: "Strategic content creation is the highest-leverage SEO activity for domain authority growth" },
    ],
    deliverables: [
      { title: "Content Strategy", desc: "Full audit of existing content and a strategic plan targeting your highest-value keyword opportunities" },
      { title: "Blog Articles", desc: "SEO-optimised long-form articles researched, written, and published to your schedule" },
      { title: "Landing Pages", desc: "Conversion-focused pages for your key services and target audiences" },
      { title: "Guides & Resources", desc: "In-depth guides and downloadable resources that generate leads and build authority" },
      { title: "Case Studies", desc: "Client success stories written and formatted to maximise sales and marketing impact" },
      { title: "Content Distribution", desc: "Multi-channel distribution across social media, email, and partner publications" },
    ],
    process: [
      { number: "01", title: "Keyword & Topic Research", desc: "We identify the topics and keywords your audience is actively searching for" },
      { number: "02", title: "Content Planning", desc: "We build a prioritised content calendar aligned with your commercial goals" },
      { number: "03", title: "Content Creation", desc: "Our specialist writers produce high-quality, thoroughly researched content" },
      { number: "04", title: "Optimise & Publish", desc: "Every piece is optimised for SEO, formatted for readability, and published to schedule" },
      { number: "05", title: "Track & Iterate", desc: "We monitor performance and update content to maintain rankings and freshness" },
    ],
    faqs: [
      { question: "How is content marketing different from just blogging?", answer: "Content marketing is a strategic discipline covering every type of content — blog posts, long-form guides, case studies, landing pages, video scripts, email sequences, and more. Blogging is one tactic within a broader content strategy. Without strategy, blogging alone rarely moves business metrics; with it, content becomes your most powerful lead generation and SEO asset." },
      { question: "How long does content marketing take to show ROI?", answer: "Content marketing is a medium-to-long-term investment. Most clients see meaningful organic traffic improvements within 4–6 months; full compounding returns — where content consistently generates leads month on month — develop over 12–18 months. We supplement the organic ramp with PPC for clients who need immediate lead flow while content builds." },
      { question: "Do your writers understand our industry?", answer: "We brief our writers thoroughly and match specialist writers to relevant industries — we have writers with backgrounds in finance, legal, healthcare, technology, and construction. For highly technical content, we interview your subject matter experts and incorporate their knowledge before our writers produce the final piece." },
      { question: "How do you ensure content ranks in Google?", answer: "Every piece of content is planned around keyword research, competitor gap analysis, and search intent matching. We structure content to satisfy what Google rewards — comprehensive topic coverage, clear heading hierarchy, strong internal linking, and schema markup where relevant. Content is also updated periodically to maintain freshness signals." },
      { question: "Can content marketing work for niche or technical industries?", answer: "Yes — in fact, technical and niche industries often see the biggest content marketing returns because there's less authoritative content competing for specialist search terms. We work with your internal experts to produce accurate, deeply helpful content that ranks well because it genuinely answers questions your prospects are searching for." },
    ],
    challenges: [
      { title: "Content published where nobody sees it", desc: "Without keyword research and competitive analysis, content lands on pages 4–10 where less than 1% of searchers reach — significant investment with no organic return." },
      { title: "No content-to-lead attribution model", desc: "Without tracking which content generates leads and at what volume, it's impossible to justify investment or focus effort on the highest-ROI topics and formats." },
      { title: "Content that informs but never converts", desc: "Educational content without strong calls-to-action, lead magnets, or conversion pathways builds traffic without building a pipeline — awareness without commercial result." },
      { title: "No topic cluster or internal linking strategy", desc: "Without a deliberate internal linking architecture, individual articles compete against each other and dilute the domain authority signals Google needs to rank them." },
      { title: "Effort spread too thin across too many formats", desc: "Attempting blogs, videos, podcasts, and social content simultaneously without mastering any single channel produces low-quality output across all of them — momentum without traction." },
    ],
    cta: "Start Your Content Strategy",
  },
  "Web Design": {
    tagline: "High-converting websites designed to grow your business and represent your brand with confidence",
    stats: [
      { value: "+180%", label: "Average Conversion Rate Improvement", accent: "blue" },
      { value: "0.8s", label: "Average Page Load Speed", accent: "orange" },
      { value: "500+", label: "Websites Delivered", accent: "green" },
      { value: "100%", label: "Mobile-First Builds", accent: "blue" },
    ],
    benefits: [
      { title: "Designed to Convert", desc: "Every design decision is driven by conversion best practices — not just aesthetics" },
      { title: "Fast Loading", desc: "Page speed is a ranking factor and a conversion factor — our sites score 90+ on Core Web Vitals" },
      { title: "Mobile-First", desc: "Over 60% of web traffic is mobile — every site we build is designed mobile-first" },
      { title: "CMS Flexibility", desc: "Easy-to-manage content management so you can update your site without developer help" },
    ],
    deliverables: [
      { title: "UX Strategy & Wireframes", desc: "User journey mapping and wireframes before a pixel of design is produced" },
      { title: "Custom Design", desc: "Bespoke design aligned with your brand identity, not a purchased template" },
      { title: "Development", desc: "Clean, semantic code built on Next.js, WordPress, or your preferred platform" },
      { title: "SEO Foundation", desc: "Technical SEO built into every page — site structure, schema, speed, and meta" },
      { title: "CMS Setup & Training", desc: "Full content management setup with team training so you can manage the site independently" },
      { title: "Ongoing Support", desc: "Post-launch maintenance, security updates, and feature additions as your business grows" },
    ],
    process: [
      { number: "01", title: "Discovery & Strategy", desc: "We learn your business, audience, and goals — then define the strategy and sitemap" },
      { number: "02", title: "UX & Wireframes", desc: "We map out user journeys and wireframe every key page before design begins" },
      { number: "03", title: "Design", desc: "We produce full visual designs in Figma for your review and approval" },
      { number: "04", title: "Development", desc: "We build the site to pixel precision with clean, fast, accessible code" },
      { number: "05", title: "Launch & Handover", desc: "We test extensively, launch, and train your team — then stay on for ongoing support" },
    ],
    faqs: [
      { question: "How long does a website project take?", answer: "A standard marketing website takes 6–10 weeks from kick-off to launch. Larger sites with ecommerce, custom integrations, or complex CMS requirements take 10–16 weeks. We provide a detailed project timeline in the first week, with clear milestones and client approval points built in." },
      { question: "Will we be able to edit the website ourselves after launch?", answer: "Yes — we build on content management systems (WordPress, Next.js with headless CMS, or your preferred platform) and provide team training included in the project. You'll be able to update text, images, and pages without developer help. Structural changes and new features are handled by our ongoing support team." },
      { question: "Do you design for mobile first?", answer: "Always. Over 60% of web traffic is mobile, and Google uses mobile-first indexing for all rankings. Every site we build is designed and tested on mobile devices before desktop. We test across multiple devices and screen sizes before launch." },
      { question: "Is SEO included in the website build?", answer: "Yes — our standard builds include technical SEO foundations: correct heading hierarchy, meta tags, page speed optimisation, schema markup, XML sitemaps, canonical tags, and Google Search Console setup. This ensures your new site launches with strong SEO health. Ongoing content and link building SEO is a separate service." },
      { question: "Do you redesign existing websites or only build new ones?", answer: "Both. We frequently redesign existing websites — auditing your current content, design, and conversion performance, preserving what's working well, and improving areas where users are dropping off. Redesigns typically deliver faster results than new builds because they retain existing SEO authority." },
      { question: "What happens after the website launches?", answer: "We provide a post-launch period of included bug fixes and technical support. After that, we offer ongoing maintenance plans covering security updates, plugin and dependency management, performance monitoring, content updates, and new page builds. We remain available for additions and improvements as your business grows." },
    ],
    challenges: [
      { title: "Sites that look great but load too slowly", desc: "Visually impressive sites on heavy page builders often score below 50 on Core Web Vitals — costing search rankings and losing impatient visitors before they see your offer." },
      { title: "Homepage messaging that fails the 5-second test", desc: "If a visitor can't understand what you do and who you serve within 5 seconds of arriving, they bounce — regardless of how much budget you invest to drive traffic to the page." },
      { title: "Forms and landing pages disconnected from tracking", desc: "Without conversion tracking and CRM integration on every form, you lose the attribution data that connects marketing spend to actual leads and sales." },
      { title: "Mobile experience treated as an afterthought", desc: "With 60–70% of traffic arriving on mobile, a website designed desktop-first and adapted to mobile will consistently underperform against mobile-native competitors." },
      { title: "Redesigns that destroy existing SEO rankings", desc: "Launching a new site without a URL migration plan and 301 redirect mapping can erase years of accumulated organic rankings in a single deployment — a common and expensive mistake." },
    ],
    cta: "Start Your Website Project",
  },
  "Email Marketing": {
    tagline: "Email marketing campaigns that nurture leads, retain customers, and drive consistent revenue",
    stats: [
      { value: "42x", label: "Average Email Marketing ROI", accent: "blue" },
      { value: "38%", label: "Average Open Rate", accent: "orange" },
      { value: "+270%", label: "Average Revenue from Email", accent: "green" },
      { value: "96%", label: "Client Retention Rate", accent: "blue" },
    ],
    benefits: [
      { title: "Highest ROI Channel", desc: "Email consistently delivers the highest return on investment of any digital marketing channel" },
      { title: "Direct Audience Ownership", desc: "Your email list is an asset you own — unlike social followers, it can't be taken away" },
      { title: "Personalisation at Scale", desc: "Advanced segmentation and automation deliver the right message to the right person automatically" },
      { title: "Customer Lifetime Value", desc: "Email is the primary tool for retaining customers, increasing order frequency, and growing LTV" },
    ],
    deliverables: [
      { title: "Email Strategy", desc: "Full email marketing audit and strategy covering list health, segmentation, and automation mapping" },
      { title: "Campaign Creation", desc: "Designed and copywritten email campaigns for promotions, newsletters, and announcements" },
      { title: "Automation Sequences", desc: "Welcome series, cart abandonment, re-engagement, and post-purchase automation flows" },
      { title: "List Segmentation", desc: "Advanced list segmentation ensuring every subscriber receives relevant, personalised content" },
      { title: "A/B Testing", desc: "Subject line, content, and send time testing to continuously improve open and click rates" },
      { title: "Performance Reporting", desc: "Full open, click, conversion, and revenue reporting for every campaign sent" },
    ],
    process: [
      { number: "01", title: "Audit & Strategy", desc: "We audit your current email performance and identify your highest-impact opportunities" },
      { number: "02", title: "Segmentation & Setup", desc: "We clean your list, build segments, and set up your email platform correctly" },
      { number: "03", title: "Automation Build", desc: "We design and build your core automation flows — welcome, abandoned cart, re-engagement" },
      { number: "04", title: "Campaign Calendar", desc: "We create and execute a monthly campaign calendar of newsletters and promotions" },
      { number: "05", title: "Test & Optimise", desc: "Continuous A/B testing and monthly reporting drives steady performance improvement" },
    ],
    faqs: [
      { question: "Which email platform do you use?", answer: "We work across all major platforms — Klaviyo, Mailchimp, ActiveCampaign, HubSpot, and Brevo. For ecommerce clients, we recommend Klaviyo for its depth of segmentation and automation. For B2B and service businesses, we typically recommend HubSpot or ActiveCampaign. We'll recommend the best fit based on your tech stack and needs." },
      { question: "How do you grow an email list?", answer: "Through lead magnets (guides, templates, tools), gated content, website pop-up opt-ins, and paid social lead generation campaigns. We design list growth as a deliberate strategy with a clear offer for subscribers — not an afterthought. List quality matters more than size; we focus on attracting genuinely interested subscribers." },
      { question: "What is email automation and why does it matter?", answer: "Email automation sends the right message at the right time based on subscriber behaviour — welcome sequences for new subscribers, abandoned cart reminders, post-purchase thank-yous, re-engagement campaigns for lapsed subscribers, and more. Automated emails typically generate 320% more revenue per email than broadcast campaigns because they're precisely timed and personalised." },
      { question: "How do you avoid our emails going to spam?", answer: "Proper authentication (SPF, DKIM, and DMARC setup), list hygiene (removing invalid and inactive addresses), domain warm-up protocols for new sending domains, and content best practices all contribute to strong deliverability. We audit your full deliverability setup before any campaign goes live and monitor spam rates continuously." },
      { question: "What open rates should we realistically expect?", answer: "Industry benchmarks vary widely by sector (15–40%), but the benchmark matters less than your own trend over time. We focus on improving your specific baseline month-on-month through A/B testing of subject lines, preview text, send times, and audience segmentation — sustained improvement in your numbers, not chasing an industry average." },
    ],
    challenges: [
      { title: "Declining open rates with no recovery strategy", desc: "Without consistent subject line testing, list segmentation, and sender reputation management, email performance deteriorates over time — a gradual but significant revenue leak." },
      { title: "No segmentation — everyone gets the same message", desc: "Sending the same broadcast to cold prospects, active customers, and lapsed subscribers produces low engagement across all segments and an above-average unsubscribe rate." },
      { title: "Sequences that nurture without driving decisions", desc: "Nurture sequences that build awareness without introducing commercial offers or urgency fail to convert subscribers who were ready to act — leaving pipeline value on the table." },
      { title: "Emails landing in spam without explanation", desc: "Misconfigured authentication (SPF, DKIM, DMARC), poor list hygiene, and high spam complaint rates silently prevent emails from reaching the inbox — making the list effectively worthless." },
      { title: "No testing framework for systematic improvement", desc: "Without A/B testing of subject lines, send times, content structure, and calls-to-action, there is no mechanism for improving performance over time — results plateau then decline." },
    ],
    cta: "Launch Your Email Marketing Strategy",
  },
  Analytics: {
    tagline: "Clear data and reporting that connects your marketing activity to real business outcomes",
    stats: [
      { value: "100%", label: "Campaigns with Full Tracking", accent: "blue" },
      { value: "3.2x", label: "Average Decision-Making Speed Increase", accent: "orange" },
      { value: "98%", label: "Data Accuracy Rate", accent: "green" },
      { value: "50+", label: "KPIs Tracked Per Client", accent: "blue" },
    ],
    benefits: [
      { title: "Clear Business Attribution", desc: "Know exactly which channels, campaigns, and keywords are generating your leads and revenue" },
      { title: "Smarter Budget Allocation", desc: "Data-driven budget decisions that move spend to what's working and cut what isn't" },
      { title: "Faster Optimisation", desc: "Real-time dashboards allow rapid campaign adjustments based on live performance data" },
      { title: "Executive Reporting", desc: "Clear, jargon-free reports that communicate performance to stakeholders and leadership" },
    ],
    deliverables: [
      { title: "GA4 Setup & Audit", desc: "Full Google Analytics 4 configuration, goal tracking, and data layer implementation" },
      { title: "Conversion Tracking", desc: "Phone calls, form submissions, and e-commerce transactions fully tracked across all channels" },
      { title: "Custom Dashboards", desc: "Real-time Looker Studio dashboards showing your key performance metrics at a glance" },
      { title: "Channel Attribution", desc: "Multi-touch attribution modelling showing the true contribution of each marketing channel" },
      { title: "Monthly Reports", desc: "Clear monthly reports covering all channel performance against your KPIs" },
      { title: "Quarterly Strategy Reviews", desc: "Data-driven quarterly reviews with strategic recommendations for the next period" },
    ],
    process: [
      { number: "01", title: "Tracking Audit", desc: "We audit all existing tracking and identify gaps, errors, and missing conversion events" },
      { number: "02", title: "Implementation", desc: "We implement correct tracking across GA4, GTM, and all ad platforms" },
      { number: "03", title: "Dashboard Build", desc: "We build custom dashboards showing the metrics that matter to your business" },
      { number: "04", title: "Attribution Setup", desc: "We configure attribution models to accurately credit each channel's contribution" },
      { number: "05", title: "Ongoing Reporting", desc: "Monthly performance reviews with data-driven optimisation recommendations" },
    ],
    faqs: [
      { question: "What tracking does every business need as a minimum?", answer: "At minimum: Google Analytics 4 with correct event tracking, Google Tag Manager for tag management, conversion tracking for all form submissions and phone calls, and campaign UTM parameters for all paid and email campaigns. Most businesses also benefit from Meta Pixel and LinkedIn Insight Tag for paid social attribution." },
      { question: "What is GA4 and how is it different from the old Google Analytics?", answer: "GA4 is Google's current analytics platform, which permanently replaced Universal Analytics in July 2023. It uses an event-based data model instead of session-based, offering better cross-device tracking, more powerful audience building, and native integration with Google Ads. If you're still on Universal Analytics data, we can help you migrate and rebuild historical comparisons." },
      { question: "How do you attribute leads to the right marketing channels?", answer: "We implement UTM tracking across all campaigns, connect your CRM to analytics where possible, and apply multi-touch attribution models to show each channel's true contribution — not just the last click before conversion. This gives you an accurate picture of which channels are actually influencing your leads and sales." },
      { question: "What is a custom marketing dashboard and do we need one?", answer: "A custom dashboard is a single live view of your key performance metrics across all channels, updated automatically in real time. We build them in Looker Studio (free, Google's BI tool) so you can check performance any time without waiting for a monthly report. They're especially useful for clients running multiple channels simultaneously." },
      { question: "Which marketing metrics should we actually focus on?", answer: "The metrics that directly reflect business outcomes: leads generated, cost per lead, conversion rate, and — where trackable — revenue attributed to marketing. Secondary metrics like traffic, impressions, and engagement provide useful context but shouldn't drive budget decisions on their own. We report everything but make recommendations based on business-impact metrics only." },
    ],
    challenges: [
      { title: "Tracking gaps producing unreliable data", desc: "Missing conversion fires, double-counted events, and absent UTM parameters produce reports that look complete but lead to decisions based on inaccurate attribution." },
      { title: "No link between marketing activity and revenue", desc: "Without proper channel attribution and CRM integration, marketing teams cannot demonstrate which campaigns and channels are responsible for the leads and revenue the business generates." },
      { title: "Reports that inform without driving decisions", desc: "Dashboards showing many metrics but providing no clear narrative leave stakeholders asking 'so what?' — data without insight produces paralysis rather than action." },
      { title: "GA4 migration introducing new tracking gaps", desc: "Many businesses migrated from Universal Analytics to GA4 without correctly configuring events, conversions, or filters — leaving them with data that looks fine but is missing critical information." },
      { title: "Budget decisions made without cross-channel data", desc: "When individual channel performance is tracked in silos and never unified, budget decisions are made by instinct rather than evidence — often rewarding the loudest channel rather than the most effective one." },
    ],
    cta: "Get Full Marketing Visibility",
  },

  "Display & Programmatic": {
    tagline: "Programmatic display, remarketing, and targeted advertising that keeps your brand in front of the right audience across the web",
    stats: [
      { value: "4.8x", label: "Average Display ROAS", accent: "blue" },
      { value: "+67%", label: "Average Remarketing Conversion Lift", accent: "orange" },
      { value: "1B+", label: "Monthly Impressions Available", accent: "green" },
      { value: "98%", label: "Brand-Safe Placements", accent: "blue" },
    ],
    benefits: [
      { title: "Reach at Scale", desc: "Display and programmatic campaigns reach your audience across millions of websites, apps, and platforms — maintaining brand visibility throughout the buyer journey" },
      { title: "Precision Remarketing", desc: "Re-engage visitors who left without converting using customised creative tailored to their specific browsing behaviour and intent signals" },
      { title: "Automated Buying Efficiency", desc: "Programmatic buying optimises ad placements and bids in real time — ensuring your budget reaches the highest-converting audiences at the lowest possible cost" },
      { title: "Full-Funnel Coverage", desc: "Display advertising supports every stage of the funnel — awareness at the top, consideration in the middle, and conversion remarketing at the bottom" },
    ],
    deliverables: [
      { title: "Audience Strategy", desc: "Custom audience segments built from first-party data, intent signals, and demographic targeting" },
      { title: "Creative Production", desc: "Display ad creative in all standard sizes, optimised for each placement and audience segment" },
      { title: "Programmatic Setup", desc: "Campaign build across Google Display Network, DV360, or preferred DSP with brand-safety controls" },
      { title: "Remarketing Lists", desc: "Pixel implementation and audience list strategy for re-engaging site visitors at each funnel stage" },
      { title: "Bid Optimisation", desc: "Automated and manual bid adjustments to maximise viewable impressions and minimise cost-per-conversion" },
      { title: "Monthly Performance Report", desc: "Impression, click, conversion, and ROAS reporting with audience performance breakdown" },
    ],
    process: [
      { number: "01", title: "Audience Research", desc: "We map your ideal customer segments and identify the targeting parameters that define them — demographics, interests, in-market signals, and custom intent" },
      { number: "02", title: "Campaign Architecture", desc: "We build separate campaigns for each audience stage — awareness, consideration, and remarketing — with distinct creative strategies and bidding approaches" },
      { number: "03", title: "Creative & Launch", desc: "We produce display creative in all required formats and launch campaigns with controlled budgets across your chosen placements and networks" },
      { number: "04", title: "Optimise & Refine", desc: "Weekly optimisation of placements, bids, audience segments, and creative variants to improve click-through rates and reduce cost-per-conversion" },
      { number: "05", title: "Scale & Report", desc: "We scale top-performing audiences and placements while reporting full funnel impact, including view-through attribution, monthly" },
    ],
    faqs: [
      { question: "What is the difference between display advertising and programmatic advertising?", answer: "Display advertising is a broad category covering all visual ad formats shown on websites, apps, and platforms. Programmatic advertising is the automated, real-time bidding technology used to buy display ad placements at scale. All programmatic advertising is display advertising, but not all display ads are bought programmatically. We use programmatic buying for most display campaigns because it optimises placements and bids automatically based on performance data, reducing waste." },
      { question: "What is remarketing and why does it work so well?", answer: "Remarketing (also called retargeting) shows ads to people who have previously visited your website or interacted with your brand. These audiences convert at significantly higher rates than cold audiences because they already know your brand and have demonstrated interest. Remarketing campaigns consistently deliver the highest ROAS of any display channel and are the most cost-efficient way to recover lost conversions from visitors who didn't enquire on first visit." },
      { question: "How much budget do display campaigns need?", answer: "Display campaigns can run effectively at modest budgets because the cost per impression (CPM) is typically lower than search CPC. Meaningful campaign data and optimisation opportunities generally require a minimum of AED 2,000–5,000 per month. Remarketing campaigns — targeting smaller, warmer audiences — can run efficiently at lower budgets than broad awareness campaigns." },
      { question: "How do you ensure our ads appear in brand-safe environments?", answer: "We implement brand safety controls at the campaign level — excluding categories of content (adult, violence, illegal), specific websites that don't meet quality standards, and using Inclusion Lists for premium placements where appropriate. All campaigns are monitored for placement quality, and we exclude underperforming or inappropriate placements in weekly optimisation reviews." },
      { question: "What ad formats do you create and manage?", answer: "We design and manage all standard display formats including responsive display ads, static banner ads (all IAB standard sizes), HTML5 animated ads, native ads, video ads (in-stream and out-stream), and rich media formats. Creative is produced specifically for each campaign objective — awareness creative differs from remarketing creative in messaging and design." },
    ],
    challenges: [
      { title: "Display spend with no measurable conversion impact", desc: "Running display campaigns optimised for impressions and clicks rather than viewable conversions produces activity that looks busy in reports but drives no measurable business outcomes." },
      { title: "Ads appearing on brand-unsafe or low-quality placements", desc: "Without placement exclusions and brand-safety controls, programmatic buying can serve ads alongside irrelevant or damaging content — harming brand perception while burning budget." },
      { title: "Remarketing lists too small to generate meaningful reach", desc: "Remarketing audiences built from low-traffic sites deliver minimal scale, failing to re-engage the volume of prospects needed to move the needle on conversion rates." },
      { title: "Creative fatigue reducing performance week over week", desc: "Display campaigns running the same creative for extended periods see click-through rates decline steadily — without a refresh schedule, performance erodes and costs per click rise." },
      { title: "No view-through attribution for upper-funnel campaigns", desc: "Display campaigns that influence decisions without generating direct clicks are invisible in last-click models — causing businesses to cut campaigns that were actually contributing to conversions." },
    ],
    cta: "Launch Your Display Campaign",
  },

  "Local Marketing": {
    tagline: "Local search optimisation that puts your business in front of customers the moment they search for your services nearby",
    stats: [
      { value: "Top 3", label: "Average Map Pack Result", accent: "blue" },
      { value: "+340%", label: "Average Local Traffic Growth", accent: "orange" },
      { value: "76%", label: "Local Searchers Visit Within 24 Hours", accent: "green" },
      { value: "200+", label: "UAE Directories Covered", accent: "blue" },
    ],
    benefits: [
      { title: "Map Pack Visibility", desc: "Appearing in Google's top-3 map results puts your business in front of buyers with active, immediate intent — the highest-converting placement in local search" },
      { title: "High-Intent Local Traffic", desc: "Local searchers have the strongest buying intent of any online audience — they are actively looking for what you offer within your service area" },
      { title: "Review Authority", desc: "A strong Google review profile builds trust with new customers before they even visit your website — driving more calls, direction requests, and enquiries" },
      { title: "Geographic Authority", desc: "Location-specific website content establishes your business as the go-to authority for searches in your area, compounding organic local rankings over time" },
    ],
    deliverables: [
      { title: "Google Business Profile Optimisation", desc: "Complete GBP rebuild — categories, services, keyword-rich description, photo library, attributes, and Q&A management" },
      { title: "Local Citation Building", desc: "Consistent NAP listings across 200+ UAE business directories, with audit and correction of existing inconsistencies" },
      { title: "Review Strategy", desc: "A systematic review generation and response programme — authentic, policy-compliant, and designed to build volume steadily" },
      { title: "Location Landing Pages", desc: "Geo-targeted pages for every area you serve, with locally-relevant copy, structured data, and embedded maps" },
      { title: "Local Link Building", desc: "Backlinks from UAE-based publications, local directories, and community platforms that signal geographic authority" },
      { title: "Monthly Local Report", desc: "Map pack ranking positions, GBP insight data (calls, direction requests), review volume, and citation health" },
    ],
    process: [
      { number: "01", title: "Local SEO Audit", desc: "We audit your GBP completeness, current map pack rankings, NAP consistency across directories, review profile, and website local content coverage" },
      { number: "02", title: "GBP Optimisation", desc: "Complete Google Business Profile rebuild — every field optimised for search visibility and customer conversion, including posting schedule" },
      { number: "03", title: "Citation Build", desc: "Existing citations are corrected; new listings built across 200+ UAE directories prioritised by authority and local relevance" },
      { number: "04", title: "Content & Reviews", desc: "Location-specific landing pages written for each service area; review generation programme implemented with templates and response protocols" },
      { number: "05", title: "Monthly Reporting", desc: "Map pack positions, GBP calls and direction requests, review volume and rating trend, and local organic traffic — reported monthly with forward plan" },
    ],
    faqs: [
      { question: "What is local SEO and how is it different from regular SEO?", answer: "Local SEO focuses on improving your visibility in location-based search results — particularly Google Maps and the 'map pack' of three businesses shown for queries like 'dentist near me' or 'accountant Dubai Marina.' Regular SEO targets broader keyword rankings. Local SEO adds specific layers: Google Business Profile optimisation, citation consistency, review management, and location-specific website content. Both work together — strong local SEO reinforces organic rankings, and vice versa." },
      { question: "How long does it take to appear in Google Maps?", answer: "With a fully optimised Google Business Profile and an active citation building programme, most businesses see map pack improvement within 60–90 days. Competitive sectors (healthcare, hospitality, legal) in premium Dubai locations can take 4–6 months. Review volume is often the limiting factor — businesses with few reviews rank behind those with strong review profiles regardless of other optimisations. We address all factors simultaneously." },
      { question: "How do you generate more Google reviews without violating Google's policies?", answer: "We implement a systematic review generation programme that asks satisfied customers to leave a review at the right moment — typically post-service via email or SMS, with a direct review link. We do not offer incentives for reviews (which Google prohibits) or use fake accounts. The approach is about consistent volume from genuine customers, with a professional response protocol for both positive and negative reviews." },
      { question: "Do we need location pages on our website for every area we serve?", answer: "Yes — for most businesses that serve multiple locations or areas. Google rewards location-specific content when ranking for area-based searches. A generic 'Services' page competing for 'dentist Business Bay,' 'dentist Jumeirah,' and 'dentist Abu Dhabi' simultaneously will be outperformed by competitors with dedicated pages for each area. Each location page targets a distinct cluster of search queries that a single generic page cannot rank for effectively." },
      { question: "Do you handle both local SEO and Google Business Profile management?", answer: "Yes — local SEO and GBP management are closely integrated in our approach, because your GBP profile and your website's local authority signals work together to determine map pack rankings. We manage GBP as part of every local marketing programme: setup, regular posting, Q&A management, photo strategy, service listing, and monthly reporting from GBP insights." },
    ],
    challenges: [
      { title: "Not appearing in the Google Maps pack for key searches", desc: "Without a fully optimised Google Business Profile and consistent local citations, businesses remain invisible in the map pack — where the majority of high-intent local searchers click." },
      { title: "Thin review profile losing business to competitors", desc: "Prospects comparing local options consistently choose the business with 50+ reviews over one with 5 — even when the quality of service is identical. Review volume is a genuine buying signal." },
      { title: "No systematic process for generating reviews", desc: "Relying on satisfied customers to leave reviews spontaneously produces a trickle. Businesses with high review volumes have a consistent, friction-free follow-up process — not better luck." },
      { title: "Inconsistent NAP data across directories hurting rankings", desc: "Inconsistent business name, address, or phone number across Google, Yelp, and UAE directories sends mixed signals to Google's local algorithm — reducing trust and suppressing map pack positions." },
      { title: "No location-specific content for the areas you serve", desc: "A single generic service page competing for searches across multiple UAE locations is consistently outranked by competitors with dedicated, locally-relevant pages for each area they serve." },
    ],
    cta: "Dominate Local Search",
  },

  "Web Development": {
    tagline: "Custom web development delivering fast, scalable websites and applications built for performance, growth, and business results",
    stats: [
      { value: "0.8s", label: "Average Page Load Speed", accent: "blue" },
      { value: "90+", label: "Average Core Web Vitals Score", accent: "orange" },
      { value: "500+", label: "Websites & Applications Delivered", accent: "green" },
      { value: "100%", label: "Mobile-First Builds", accent: "blue" },
    ],
    benefits: [
      { title: "Built for Performance", desc: "Every website we build targets 90+ Core Web Vitals scores — fast loading improves both Google rankings and user conversion rates" },
      { title: "Scalable Architecture", desc: "We choose the right technology stack for your business needs — from headless Next.js for marketing speed to robust e-commerce platforms for complex product catalogues" },
      { title: "SEO-Ready from Day One", desc: "Technical SEO foundations are built into every project — correct semantic structure, schema markup, sitemap, canonical tags, and page speed from launch" },
      { title: "CMS Flexibility", desc: "Your team can update content independently — we build on platforms your non-technical staff can manage without developer help" },
    ],
    deliverables: [
      { title: "Technical Scoping", desc: "Full requirements analysis and technology stack recommendation before development begins" },
      { title: "Custom Development", desc: "Clean, maintainable code built on the framework best suited to your project — Next.js, WordPress, Shopify, or custom" },
      { title: "CMS Setup & Training", desc: "Content management configuration with team training so you can update the site independently" },
      { title: "Third-Party Integrations", desc: "CRM, payment gateway, booking system, and API integrations built and tested to specification" },
      { title: "Performance Optimisation", desc: "Speed, Core Web Vitals, and accessibility audited and optimised before launch" },
      { title: "Post-Launch Support", desc: "Bug fixing, security updates, and ongoing feature development after launch" },
    ],
    process: [
      { number: "01", title: "Discovery & Scoping", desc: "We define your functional requirements, user journeys, integrations, and technology stack — producing a detailed project brief and timeline" },
      { number: "02", title: "Architecture & Design", desc: "Site architecture, wireframes, and design are approved before development begins — preventing costly changes mid-build" },
      { number: "03", title: "Development", desc: "We build to the approved specification with clean, documented code, regular client builds for review, and thorough testing throughout" },
      { number: "04", title: "QA & Launch", desc: "Cross-device testing, performance optimisation, SEO setup, and security hardening — then a managed launch with full monitoring" },
      { number: "05", title: "Support & Iteration", desc: "Post-launch support, team training, and ongoing development as your product and business requirements evolve" },
    ],
    faqs: [
      { question: "Which technology platform do you build on?", answer: "We work across multiple platforms depending on your requirements. For marketing-focused websites, we typically recommend Next.js for performance and SEO. For content-heavy sites with non-technical teams, WordPress remains the most manageable CMS. For e-commerce, Shopify or WooCommerce depending on product complexity. For web applications, we assess your functional requirements and recommend the appropriate stack — we are platform-agnostic and focused on choosing the right tool for each project." },
      { question: "How long does web development take?", answer: "A standard marketing website takes 6–10 weeks from kick-off to launch. E-commerce builds with custom functionality typically take 10–16 weeks. Web applications with complex integrations or custom logic are scoped specifically. We provide a detailed timeline in the first week with clear milestones and client approval points." },
      { question: "Will the website be easy to update ourselves?", answer: "Yes — we build for maintainability. Your team will be able to update pages, blog posts, product listings, and imagery without developer help. We configure the CMS to expose exactly what your team needs to edit while protecting the structural elements that shouldn't change. Team training is included in every project." },
      { question: "Is SEO included in the development?", answer: "Yes — technical SEO foundations are built into every project as standard: correct heading hierarchy, meta tag configuration, schema markup, XML sitemap, canonical tag setup, Core Web Vitals optimisation, and Google Search Console integration. This ensures your site launches with strong technical health. Content SEO (keyword targeting, content creation, link building) is a separate ongoing service." },
      { question: "Do you rebuild existing websites or only build from scratch?", answer: "Both. We frequently rebuild or redesign existing websites — migrating content, improving UX and performance, and preserving existing SEO authority through careful URL management and redirect implementation. Rebuilds follow the same process as new builds, with the additional steps of content migration, SEO audit, and 301 redirect mapping to prevent ranking losses at launch." },
    ],
    challenges: [
      { title: "Projects that go over budget and past deadline", desc: "Poorly scoped builds without clear functional requirements frequently expand mid-project — adding cost, delaying launch, and straining the working relationship between client and agency." },
      { title: "Sites that perform poorly immediately after launch", desc: "Websites built without performance as a core requirement often score below 60 on Core Web Vitals at launch — affecting search rankings and visitor conversion rates from day one." },
      { title: "CMS the marketing team can't use independently", desc: "Development built for technical convenience rather than editor usability leaves marketing managers unable to update content without developer help — the opposite of the intended outcome." },
      { title: "Rebuilds that destroy existing organic rankings", desc: "Launching a new site without a URL migration strategy and 301 redirect mapping transfers zero domain authority from the old site — erasing years of SEO progress at a single go-live." },
      { title: "Third-party integrations that break at the worst moment", desc: "CRM connections, payment gateways, and booking integrations that aren't stress-tested before launch often fail during high-traffic periods — damaging both revenue and brand trust." },
    ],
    cta: "Start Your Web Development Project",
  },

  Design: {
    tagline: "Professional graphic design, photography, and visual content that builds brand recognition, communicates quality, and drives engagement",
    stats: [
      { value: "+94%", label: "Higher Engagement with Visual Content", accent: "blue" },
      { value: "7s", label: "Average Brand Impression Window", accent: "orange" },
      { value: "500+", label: "Design Projects Delivered", accent: "green" },
      { value: "100%", label: "Brand-Consistent Outputs", accent: "blue" },
    ],
    benefits: [
      { title: "Brand Consistency at Every Touchpoint", desc: "Professionally designed assets ensure your brand looks consistent and credible across your website, social media, printed materials, and advertising" },
      { title: "First Impressions That Convert", desc: "Prospects form an opinion of your brand in seconds — high-quality design communicates the level of professionalism and trust they can expect from your service" },
      { title: "Multi-Channel Asset Production", desc: "From social media graphics to print-ready brochures and video content, we produce all the visual assets your marketing campaigns need" },
      { title: "Conversion-Focused Design", desc: "Our design work is informed by conversion principles — visual hierarchy, contrast, and directional cues guide users toward the actions that grow your business" },
    ],
    deliverables: [
      { title: "Brand Identity & Guidelines", desc: "Logo design, colour palette, typography system, and a brand guidelines document for consistent cross-channel usage" },
      { title: "Marketing Collateral", desc: "Brochures, flyers, presentations, and print-ready materials produced to brand specification" },
      { title: "Social Media Creative", desc: "Platform-optimised graphic and video content for Instagram, LinkedIn, Facebook, and TikTok" },
      { title: "Digital Ad Creative", desc: "Display ad creative in all standard sizes, produced and optimised for each campaign objective" },
      { title: "Photography & Video", desc: "Professional commercial photography and videography for websites, social media, and advertising use" },
      { title: "Infographics & Data Visualisation", desc: "Complex information transformed into clear, shareable visual assets that build authority and generate engagement" },
    ],
    process: [
      { number: "01", title: "Brief & Discovery", desc: "We document your brand, audience, tone, and design requirements — ensuring all creative work is anchored to your business goals and brand standards" },
      { number: "02", title: "Concept Development", desc: "We produce initial concepts for your review — typically two to three directions — allowing you to choose the approach that best fits your vision" },
      { number: "03", title: "Refinement", desc: "Based on your feedback, we refine the selected concept through revision rounds until the output meets the brief exactly" },
      { number: "04", title: "Production", desc: "Final assets are produced in all required formats and sizes — print-ready, web-optimised, and social-formatted as needed" },
      { number: "05", title: "Delivery & Handover", desc: "All source files and formatted exports are delivered with a usage guide — so your team can adapt assets correctly in the future" },
    ],
    faqs: [
      { question: "Do you offer brand identity design as well as individual assets?", answer: "Yes — we offer everything from complete brand identity projects (logo, colour system, typography, guidelines) to individual asset production for specific campaigns. For new businesses or those rebranding, we recommend starting with a brand identity project to establish the foundation that all subsequent design work is built on." },
      { question: "Can you produce both digital and print-ready design?", answer: "Yes — we deliver assets in both digital formats (RGB, web-optimised) and print-ready formats (CMYK, high-resolution PDF) depending on the intended use. We brief the use cases at the start of each project to ensure the correct specifications are applied from the outset." },
      { question: "How many revision rounds are included?", answer: "Our standard projects include two to three rounds of revisions after initial concept delivery. Additional revision rounds beyond the agreed scope are available at the project's hourly rate. We find that clear briefing upfront — which we invest in before design begins — significantly reduces the number of revisions needed." },
      { question: "Do you offer photography and video production?", answer: "Yes — our team includes professional photographers and videographers available for commercial shoots covering products, team, office/workspace, and lifestyle content. All photography and video production is briefed, planned, and produced to agreed usage rights, and can be combined with graphic design and retouching in a single project scope." },
      { question: "Can you produce social media content on an ongoing basis?", answer: "Yes — we offer monthly social media content production retainers covering graphic posts, video reels, story formats, and carousel assets across all platforms. Ongoing retainers are planned on a monthly content calendar that we produce and share for approval before scheduling. This is typically delivered alongside our social media management service for maximum strategic alignment." },
    ],
    challenges: [
      { title: "Inconsistent brand presentation across every channel", desc: "Without documented brand guidelines and a centralised asset library, each new piece of marketing looks slightly different — eroding the cumulative brand recognition that drives trust and recall." },
      { title: "Creative that blends into the feed rather than stopping it", desc: "Generic stock imagery and uninspired layouts produce ads that are mentally filtered out by audiences — the first barrier to any paid campaign performing at its potential." },
      { title: "Assets produced without production specifications", desc: "Creative produced at the wrong resolution or format requires expensive rework before it can be used — a hidden cost of working without a proper brief and specification process." },
      { title: "No centralised brand asset library for the team", desc: "Without approved assets and usage guidelines in one accessible place, every new piece of content risks inconsistency — costing time and silently diluting the brand identity." },
      { title: "Design that looks impressive but doesn't communicate the offer", desc: "Visually striking work that prioritises aesthetics over hierarchy and clarity can fail to communicate the core value proposition — beautiful but unconvincing to the target buyer." },
    ],
    cta: "Elevate Your Brand Design",
  },

  "Conversion Rate Optimisation": {
    tagline: "Data-driven CRO that turns more of your existing traffic into leads and customers — without increasing your ad spend",
    stats: [
      { value: "+180%", label: "Average Conversion Rate Improvement", accent: "blue" },
      { value: "-42%", label: "Average Cost-Per-Lead Reduction", accent: "orange" },
      { value: "6 Wk", label: "Average Time to First CRO Wins", accent: "green" },
      { value: "4.3x", label: "Average ROI on CRO Investment", accent: "blue" },
    ],
    benefits: [
      { title: "More Revenue from Existing Traffic", desc: "CRO improves results from traffic you're already paying for — increasing conversion rate means every pound of ad spend delivers more leads and sales" },
      { title: "Compounding Returns", desc: "Conversion improvements compound with traffic growth — a 50% conversion rate increase doubles the value of every future traffic improvement you make" },
      { title: "Data-Driven Decisions", desc: "Every change is informed by user behaviour data — heatmaps, session recordings, and statistical A/B tests replace opinion with evidence" },
      { title: "Reduced Cost Per Lead", desc: "Higher conversion rates reduce your effective cost-per-acquisition from all traffic sources simultaneously — paid, organic, social, and email" },
    ],
    deliverables: [
      { title: "CRO Audit", desc: "Full analysis of your conversion funnel — identifying every point where users are dropping off and the most likely causes" },
      { title: "Heatmap & Session Recording Analysis", desc: "Visual analysis of how users actually interact with your pages — revealing UX issues invisible in standard analytics" },
      { title: "A/B Testing Programme", desc: "Structured testing of headlines, CTAs, forms, page layouts, and copy against statistically meaningful traffic volumes" },
      { title: "Landing Page Optimisation", desc: "Redesign of underperforming landing pages based on CRO best practices and your specific audience data" },
      { title: "Form & Checkout Optimisation", desc: "Reducing friction in enquiry forms, checkout flows, and lead capture to increase completion rates" },
      { title: "Monthly CRO Report", desc: "Test results, conversion rate trends, and prioritised recommendations for the next testing sprint" },
    ],
    process: [
      { number: "01", title: "Data Audit", desc: "We audit your analytics setup, identify your highest-value conversion points, and pinpoint where users are leaving the funnel before converting" },
      { number: "02", title: "User Research", desc: "Heatmaps, session recordings, scroll maps, and user surveys reveal the behavioural patterns and friction points behind your conversion rate" },
      { number: "03", title: "Hypothesis Development", desc: "We build a prioritised test backlog — each hypothesis grounded in data, with a clear expected impact on conversion rate and supporting evidence" },
      { number: "04", title: "A/B Testing", desc: "Tests are run to statistical significance before any conclusion is drawn — we do not make decisions based on insufficient data" },
      { number: "05", title: "Implement & Iterate", desc: "Winning variants are implemented permanently; learnings inform the next sprint — compounding improvements month over month" },
    ],
    faqs: [
      { question: "What is conversion rate optimisation (CRO)?", answer: "CRO is the systematic process of improving the percentage of website visitors who take a desired action — completing a form, making a purchase, calling your business, or booking an appointment. CRO uses data (analytics, heatmaps, user recordings) and structured testing (A/B tests) to identify why visitors aren't converting and to find improvements that increase the proportion who do." },
      { question: "How much traffic do I need for CRO to work?", answer: "A/B testing requires enough traffic to reach statistical significance — generally a minimum of 200–300 conversions per variant per test period for reliable conclusions. For lower-traffic sites, we focus on qualitative research methods (heatmaps, session recordings, user surveys) to identify and implement improvements without formal A/B testing, then validate results in aggregate over time." },
      { question: "How does CRO differ from UX design?", answer: "UX design is about creating a good overall user experience. CRO is specifically focused on improving the rate at which users complete your target actions — often using UX improvements as a tool. CRO is more narrowly commercial: every change is evaluated against its impact on conversion rate and revenue. A CRO programme might identify that a UX redesign is needed, or it might find that a single headline change produces the biggest conversion lift." },
      { question: "What pages benefit most from CRO?", answer: "The highest-value CRO targets are the pages with the most traffic that lead directly to conversion: landing pages receiving paid traffic, service pages, pricing pages, and checkout or enquiry forms. The ROI from improving a high-traffic, high-intent page is significantly greater than improving a low-traffic page — so we always prioritise by traffic volume multiplied by conversion value." },
      { question: "How quickly will we see results from a CRO programme?", answer: "Initial qualitative improvements (UX fixes, form simplification, headline changes) can produce measurable conversion improvements within the first 4–6 weeks. A/B testing programmes require longer — typically 4–8 weeks per test to reach statistical significance at typical traffic volumes. Most clients see meaningful cumulative conversion rate improvement within 3 months, with compounding gains developing over 6–12 months as the test backlog is systematically worked through." },
    ],
    challenges: [
      { title: "Significant traffic converting at less than 1%", desc: "Most websites convert between 0.5–2% of visitors. Businesses that drive paid traffic without optimising the on-page experience are leaving the majority of their acquisition spend unrealised." },
      { title: "No systematic process for identifying conversion blockers", desc: "Gut-feel assumptions about why visitors aren't converting lead to full redesigns that change everything at once — making it impossible to know what actually caused any improvement or decline." },
      { title: "A/B tests run on insufficient traffic volumes", desc: "Testing two page variants with 200 monthly visitors produces statistically meaningless results. Many businesses make permanent changes based on underpowered tests that could easily reverse if run longer." },
      { title: "Form abandonment at the point of highest intent", desc: "High drop-off at enquiry or checkout forms — where visitor intent peaks — typically indicates friction: too many fields, unclear value, or trust gaps at the moment that matters most." },
      { title: "Mobile conversion rates far below desktop", desc: "Sites where mobile converts at half the desktop rate despite receiving the majority of traffic have a mobile experience problem — usually discoverable through session recordings within an hour." },
    ],
    cta: "Improve Your Conversion Rate",
  },

  "Reputation Management": {
    tagline: "Online reputation management that protects your brand, builds trust with prospects, and ensures your digital presence reflects the quality of your business",
    stats: [
      { value: "93%", label: "Consumers Check Reviews Before Buying", accent: "blue" },
      { value: "+34%", label: "Average Conversion Lift from Strong Reviews", accent: "orange" },
      { value: "48h", label: "Average Response Time to Brand Mentions", accent: "green" },
      { value: "4.8★", label: "Average Client Review Rating Achieved", accent: "blue" },
    ],
    benefits: [
      { title: "Trust That Converts", desc: "A strong online reputation — positive reviews, professional responses, and credible brand mentions — directly increases the proportion of prospects who choose you over competitors" },
      { title: "Brand Monitoring Across Platforms", desc: "We monitor your brand mentions across Google, social media, review platforms, and news sources — so you know about issues before they escalate" },
      { title: "Review Volume & Rating Management", desc: "A systematic approach to generating authentic positive reviews builds the social proof that influences buying decisions across every platform where your audience researches" },
      { title: "Crisis Response Preparedness", desc: "A documented crisis response process ensures negative publicity is addressed professionally and promptly — minimising long-term brand damage" },
    ],
    deliverables: [
      { title: "Reputation Audit", desc: "Comprehensive audit of your current online presence across review platforms, search results, social media, and news coverage" },
      { title: "Review Generation Programme", desc: "A policy-compliant process for systematically generating authentic reviews from satisfied customers across Google, Facebook, and sector-relevant platforms" },
      { title: "Review Monitoring & Response", desc: "Monitoring of all new reviews with professional response drafts for your approval — maintaining your brand voice across all responses" },
      { title: "Brand Mention Monitoring", desc: "Real-time alerts for mentions of your brand across the web, with weekly monitoring reports" },
      { title: "Content Strategy", desc: "Positive content creation and distribution that strengthens your brand's search presence and displaces negative content from prominent positions" },
      { title: "Monthly Reputation Report", desc: "Review volume, rating trends, sentiment analysis, and brand mention summary — with recommended actions for the next period" },
    ],
    process: [
      { number: "01", title: "Reputation Audit", desc: "We audit your current review profile, search result landscape, brand mention sentiment, and any existing reputation issues — producing a priority action plan" },
      { number: "02", title: "Monitoring Setup", desc: "We configure brand monitoring across Google, social platforms, review sites, and news sources — with real-time alerts for your team" },
      { number: "03", title: "Review Programme", desc: "We implement a review generation process — request templates, timing strategy, and response protocols for positive and negative reviews" },
      { number: "04", title: "Content & Suppression", desc: "Where negative content is prominent in search results, we develop a content strategy designed to strengthen positive results and displace damaging content over time" },
      { number: "05", title: "Monitor & Maintain", desc: "Ongoing monthly monitoring, review response, and reporting — with a forward plan based on reputation trends and any emerging issues" },
    ],
    faqs: [
      { question: "What does online reputation management actually involve?", answer: "ORM covers the practices that shape how your business appears when someone searches for it online. This includes managing your review profile across Google, Facebook, and sector-specific platforms; monitoring for brand mentions in news, social media, and forums; responding to reviews professionally; producing content that strengthens your brand's positive online presence; and — where needed — developing strategies to displace damaging content from prominent search positions." },
      { question: "Can you remove negative reviews from Google?", answer: "Reviews can only be removed by Google when they violate Google's review policies — fake reviews, reviews from competitors, spam, or content that is clearly not a genuine customer experience. We identify reviews that qualify for removal requests and manage the submission process. For legitimate negative reviews, we focus on professional response, resolution where possible, and building positive review volume that contextualises individual negatives. We do not guarantee removal of specific reviews." },
      { question: "How quickly can a reputation be repaired?", answer: "It depends on the severity and extent of the damage. For businesses with a manageable number of negative reviews and no major news coverage, meaningful improvement in review ratings and search presence typically takes 3–6 months of consistent positive review generation. For businesses facing significant negative search results or news coverage, a sustained content strategy over 12+ months is often needed. We set realistic expectations at the outset." },
      { question: "How do you generate authentic reviews without violating platform policies?", answer: "We design review generation processes that comply fully with Google's and other platforms' policies. This means asking satisfied customers to share their genuine experience, at the right moment, with a frictionless process (a direct link to your review page). We do not offer incentives for reviews, use fake accounts, or post on behalf of customers. The approach is about consistent, systematic follow-up — which generates far more reviews than hoping customers will review spontaneously." },
      { question: "Do you monitor social media as well as review platforms?", answer: "Yes — our monitoring covers Google reviews, Facebook reviews, Trustpilot and sector-specific review platforms, social media mentions (Instagram, Twitter/X, LinkedIn, Facebook), news and blog coverage, and forum discussions. We provide weekly monitoring reports and real-time alerts for high-priority mentions so your team can respond promptly to significant brand events." },
    ],
    challenges: [
      { title: "Negative reviews visible in branded search results", desc: "A prominent negative review on page one of Google branded results can reduce click-through rate by 20–30% — directly reducing how many prospects reach your website each month." },
      { title: "Review volume too thin to establish credibility", desc: "Businesses with fewer than 20 Google reviews lose business to competitors with 50+ every day — not because service quality is lower, but because the social proof simply isn't there." },
      { title: "No proactive process for collecting reviews", desc: "Satisfied customers rarely leave reviews spontaneously. Businesses with strong review profiles have a deliberate, systematic follow-up process built into their service delivery — not better fortune." },
      { title: "Brand mentions spreading without a monitoring system", desc: "Negative social media conversations or press coverage discovered days later are far harder to address than those caught within hours — when a timely response can still shape the narrative." },
      { title: "Inaccurate business information across UAE directories", desc: "Outdated phone numbers, incorrect trading hours, or inconsistent addresses across Google, Facebook, and local directories erode trust and send mixed signals to prospects doing due diligence." },
    ],
    cta: "Protect Your Online Reputation",
  },

  "Digital Marketing": {
    tagline: "Full-service digital marketing for UAE businesses — integrated strategy, expert execution, and results you can measure",
    stats: [
      { value: "6.4x", label: "Average Marketing ROI Delivered", accent: "blue" },
      { value: "+290%", label: "Average Lead Growth", accent: "orange" },
      { value: "150+", label: "UAE & GCC Clients Served", accent: "green" },
      { value: "12 Yrs", label: "Digital Marketing Experience", accent: "blue" },
    ],
    benefits: [
      { title: "Integrated Multi-Channel Strategy", desc: "SEO, PPC, social media, content, and email working together — coordinated by senior strategists who see the full picture, not siloed channel teams" },
      { title: "UAE & GCC Market Expertise", desc: "Deep understanding of UAE consumer behaviour, Arabic search patterns, and the competitive dynamics of Dubai, Abu Dhabi, and Sharjah markets" },
      { title: "Results-First Approach", desc: "Every activity is measured against business outcomes — leads, revenue, and customer acquisition cost — not vanity metrics like impressions or likes" },
      { title: "Senior Team, Direct Access", desc: "Your campaigns are run by senior specialists, not handed off to juniors. You have direct access to the strategist accountable for your results" },
    ],
    deliverables: [
      { title: "Digital Marketing Audit", desc: "Comprehensive audit of your current digital presence — SEO health, paid performance, social channels, content gaps, and competitor positioning" },
      { title: "Integrated Strategy", desc: "A channel-by-channel marketing strategy with clear objectives, KPIs, budget allocation, and 12-month roadmap" },
      { title: "Campaign Management", desc: "End-to-end management of all active channels — Google Ads, Meta, LinkedIn, SEO, email, and content — with weekly optimisation" },
      { title: "Content & Creative", desc: "Ad creative, landing pages, blog content, and social assets produced in-house — aligned to your brand and campaign goals" },
      { title: "Analytics & Attribution", desc: "Full tracking setup ensuring every lead and sale is correctly attributed — GA4, Google Tag Manager, CRM integration" },
      { title: "Monthly Performance Report", desc: "Board-ready monthly reports covering all channels, KPIs, and a forward strategy — with data-driven recommendations for the next period" },
    ],
    process: [
      { number: "01", title: "Discovery & Audit", desc: "We audit your business, audience, competitive landscape, and existing digital marketing — identifying your highest-priority opportunities" },
      { number: "02", title: "Strategy Development", desc: "We build a fully integrated, channel-specific strategy aligned to your commercial goals and UAE market dynamics" },
      { number: "03", title: "Launch & Execute", desc: "We launch all campaigns with precision — coordinating across channels, with creative, copy, tracking, and bid strategy ready from day one" },
      { number: "04", title: "Optimise Weekly", desc: "Every channel is reviewed weekly — bids adjusted, content updated, ad creative refreshed, and budget reallocated to what's performing" },
      { number: "05", title: "Report & Scale", desc: "Monthly reporting drives strategy reviews — we scale what's working and evolve the plan as your business and market change" },
    ],
    faqs: [
      { question: "What does a full-service digital marketing agency actually do?", answer: "A full-service agency manages every element of your online marketing — search engine optimisation (SEO), Google Ads and PPC, social media marketing, content creation, email marketing, website development, and conversion rate optimisation. Rather than managing separate vendors for each channel, you work with a single strategic team that coordinates all activity to a unified goal. This produces better results because your channels reinforce each other instead of competing for the same audience." },
      { question: "How much does digital marketing cost in the UAE?", answer: "Digital marketing investment in the UAE typically ranges from AED 5,000–25,000/month for SMEs depending on the channels required, market competitiveness, and campaign scale. PPC budgets are additional to management fees. We provide a transparent cost breakdown in our strategy proposal — no hidden fees or lock-in contracts. Most clients see a positive ROI within the first 90 days of an integrated programme." },
      { question: "How long before we see results from digital marketing?", answer: "PPC campaigns typically generate leads within the first 2–4 weeks. SEO improvements become measurable within 3–6 months. A fully integrated strategy typically shows clear composite ROI within 6 months, with compounding results over 12+ months as channels build on each other. We provide a channel-by-channel timeline in your strategy document so expectations are set clearly from the start." },
      { question: "Do you specialise in the UAE and GCC market?", answer: "Yes — we are a UAE-based agency with deep expertise in the Dubai, Abu Dhabi, and wider GCC market. This includes understanding of Arabic and English search behaviour, UAE consumer buying patterns, local platform usage (WhatsApp for business, regional social platforms), UAE business regulations affecting advertising, and competitive dynamics across the sectors we serve. We also run international campaigns for clients targeting UK, US, European, and global audiences." },
      { question: "What makes Eddie Marketing different from other UAE digital agencies?", answer: "Our clients work directly with the senior specialist managing their campaigns — not account executives who relay messages to a delivery team. We are metrics-driven: every recommendation is backed by data, and we measure ourselves against your commercial outcomes (leads, revenue, cost-per-acquisition) not impressions or clicks. Our 12 years of UAE market experience means we build strategies grounded in what actually works in this market, not what works in US case studies." },
      { question: "Do you work with businesses in specific industries?", answer: "We work across most sectors — real estate, hospitality, finance, healthcare, education, legal, construction, e-commerce, technology, and professional services. Our UAE market experience is deepest in B2B services, real estate, hospitality, and e-commerce. We tailor every strategy to the specific buyer behaviour and competitive dynamics of your sector rather than applying a generic template." },
    ],
    challenges: [
      { title: "Channel tactics running in silos without a shared strategy", desc: "Spending on SEO, ads, and social separately with no unified strategy or attribution model means channels compete for credit rather than compounding their combined impact." },
      { title: "Not knowing which UAE channels to prioritise with limited budget", desc: "The UAE digital landscape has distinct platform preferences, competitive dynamics, and buyer behaviour — generic channel allocation without local expertise produces poor ROI." },
      { title: "No measurement framework to calculate marketing ROI", desc: "Launching campaigns without proper conversion tracking and attribution makes it impossible to calculate true cost-per-acquisition or make evidence-based budget decisions." },
      { title: "Confusing organic and paid channel roles", desc: "Not understanding when SEO versus paid ads is the right tool — or how they work together — leads to over-investing in one and underinvesting in the other for the stage of business growth." },
      { title: "Working with multiple agencies without expertise to evaluate results", desc: "Without a solid understanding of what good performance looks like in each channel, businesses can't tell whether their agencies are delivering genuine results or managing perceptions." },
    ],
    cta: "Get a Free Digital Marketing Strategy",
  },
};

const DEFAULT_SERVICE_DATA: ServiceData = {
  tagline: "Professional digital marketing services that deliver measurable business growth",
  stats: [
    { value: "+320%", label: "Average Performance Improvement", accent: "blue" },
    { value: "96%", label: "Client Retention Rate", accent: "orange" },
    { value: "6.1x", label: "Average Marketing ROI", accent: "green" },
    { value: "12 Yrs", label: "Marketing Experience", accent: "blue" },
  ],
  benefits: [
    { title: "Proven Results", desc: "Every strategy is built on data and tested methodology — not guesswork or trends" },
    { title: "Senior Team Expertise", desc: "Your account is managed by senior specialists, not account executives with minimal experience" },
    { title: "Transparent Reporting", desc: "You always know what your investment is returning — full data, no smoke and mirrors" },
    { title: "Long-Term Partnership", desc: "We build long-term partnerships focused on your sustained growth, not short-term gains" },
  ],
  deliverables: [
    { title: "Strategy Development", desc: "A customised strategy aligned to your specific business goals and competitive landscape" },
    { title: "Campaign Execution", desc: "Professional execution across all agreed channels and tactics" },
    { title: "Regular Optimisation", desc: "Ongoing testing and refinement to continuously improve performance" },
    { title: "Performance Tracking", desc: "Full tracking setup ensuring every conversion and lead is attributed correctly" },
    { title: "Monthly Reporting", desc: "Clear monthly performance reports with data-driven recommendations" },
    { title: "Strategy Reviews", desc: "Quarterly strategic reviews to align the plan with your evolving business goals" },
  ],
  process: [
    { number: "01", title: "Discovery", desc: "We learn your business, goals, audience, and competitive landscape in detail" },
    { number: "02", title: "Strategy", desc: "We develop a customised, data-backed strategy targeting your highest-value opportunities" },
    { number: "03", title: "Launch", desc: "We implement the strategy with precision — on time and to the agreed brief" },
    { number: "04", title: "Optimise", desc: "We continuously test, refine, and improve based on real performance data" },
    { number: "05", title: "Scale", desc: "We scale what's working and compound your results month on month" },
  ],
  faqs: [
    { question: "How long before we see results from digital marketing?", answer: "PPC campaigns typically show results within 2–4 weeks. SEO takes 3–6 months for meaningful ranking improvements, with compounding growth over 12+ months. We provide a clear channel-by-channel timeline in your strategy so you know exactly what to expect and when." },
    { question: "What does a typical engagement look like?", answer: "We start with a discovery and strategy phase (2–3 weeks), then move to implementation and launch. You receive a full monthly report with performance data and recommendations. Most engagements are structured as 6-month strategies, which is the minimum time needed to properly build, optimise, and demonstrate clear ROI." },
    { question: "Do you work with businesses outside the UAE?", answer: "Yes — while we specialise in UAE and GCC markets, we run campaigns for clients in the UK, US, Europe, and globally. Our team includes regional specialists across all major markets." },
    { question: "How transparent is your reporting?", answer: "Completely transparent — you receive a full monthly report covering every channel's performance against agreed KPIs, and your live dashboard is accessible 24/7. We never hide data behind agency jargon; you always know exactly what your investment is returning." },
    { question: "What makes Eddie different from other digital marketing agencies?", answer: "Our clients work directly with senior specialists — the strategist who presents your plan manages your campaigns. We combine full-service capability (SEO, PPC, social, content, web) with the strategic depth of a specialist boutique, without the overhead and account-executive layers of a large agency." },
  ],
  cta: "Start Your Marketing Strategy",
};

// ─── Case Study Card ──────────────────────────────────────────────────────────

interface CaseStudyCardData {
  slug: string;
  title: string;
  clientName: string | null;
  serviceType: string | null;
  trafficIncreasePercent: number | null;
  leadIncreasePercent?: number | null;
}

function CaseStudyCard({ cs }: { cs: CaseStudyCardData }) {
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        {cs.serviceType && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {cs.serviceType}
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 leading-snug">
        {cs.clientName}
      </h3>
      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{cs.title}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        {cs.trafficIncreasePercent && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            +{cs.trafficIncreasePercent}% traffic
          </span>
        )}
        {cs.leadIncreasePercent && (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            +{cs.leadIncreasePercent}% leads
          </span>
        )}
      </div>
      <span className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
        View case study →
      </span>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ServicePageSectionsProps {
  serviceCluster: string;
  caseStudies: CaseStudyCardData[];
}

export function ServicePageSections({ serviceCluster, caseStudies }: ServicePageSectionsProps) {
  const data = SERVICE_DATA[serviceCluster] ?? DEFAULT_SERVICE_DATA;

  return (
    <>
      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2 text-center">
            {serviceCluster} Results
          </p>
          <p className="text-center text-sm text-slate-500 mb-8 max-w-xl mx-auto">
            {data.tagline}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} accent={stat.accent} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Benefits (Business Case) ───────────────────────────────────── */}
      <div className="bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
                Why {serviceCluster}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                The Business Case for {serviceCluster}
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {data.tagline}
              </p>
              <div className="space-y-4">
                {data.benefits.map((b, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-0.5">{b.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.stats.map((stat, i) => (
                <div key={i} className={`rounded-xl p-6 text-center ${
                  i === 0 ? "bg-blue-600 text-white" :
                  i === 1 ? "ems-gradient-bg text-white" :
                  i === 2 ? "bg-slate-900 text-white" :
                  "bg-slate-100 text-slate-900"
                }`}>
                  <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
                  <div className="text-xs font-medium opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Challenges We Solve ───────────────────────────────────────── */}
      {data.challenges && data.challenges.length > 0 && (
        <div className="bg-white py-14 md:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500 mb-2">Common Pain Points</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Challenges We Solve</h2>
              <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed">
                These are the problems our {serviceCluster} clients most commonly face before engaging us — and exactly what we address.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.challenges.map((c, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-5 h-5 bg-red-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H2.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">{c.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed pl-7">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── What's Included ───────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
              What You Get
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {serviceCluster} Service Deliverables
            </h2>
            <p className="text-slate-500 mt-2">Everything included in your {serviceCluster} engagement with Eddie Marketing</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.deliverables.map((d, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-teal-50 rounded flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{d.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed pl-7">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <div className="bg-slate-950 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Our {serviceCluster} Process
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.process.map((step, i) => (
              <div key={i} className="relative">
                {i < data.process.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-white/10 z-0 -translate-y-0.5" style={{ width: "calc(100% - 2rem)" }} />
                )}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative z-10">
                  <div className="text-3xl font-black ems-gradient-text mb-2 font-mono">{step.number}</div>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Case Studies ──────────────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <div className="bg-white py-14 md:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 mb-2">
                  Proof of Work
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {serviceCluster} Results We&apos;ve Delivered
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                All case studies →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {caseStudies.slice(0, 3).map((cs) => (
                <CaseStudyCard key={cs.slug} cs={cs} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <FaqAccordion
        items={data.faqs}
        eyebrow={serviceCluster}
        title={`${serviceCluster} FAQs`}
      />

      {/* ── Why Eddie ─────────────────────────────────────────────────── */}
      <div className="bg-slate-50 py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] ems-gradient-text mb-2">
              Why Eddie Marketing
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Why Our Clients Trust Us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Senior Specialist Team", desc: "Your campaigns are run by senior specialists with years of hands-on experience" },
              { title: "Results-First Approach", desc: "We measure success in the metrics that move your business forward — not vanity numbers" },
              { title: "Transparent Reporting", desc: "Monthly reports show exactly what your investment is returning, with no hidden data" },
              { title: "UAE & Global Expertise", desc: "We run successful campaigns across UAE, GCC, Europe, and global markets simultaneously" },
            ].map((item, i) => (
              <FeatureCard
                key={i}
                title={item.title}
                description={item.desc}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
