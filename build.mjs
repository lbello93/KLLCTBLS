// kllctbls static site generator — zero dependencies.
// Usage: node build.mjs   → writes HTML, sitemap.xml, robots.txt, site.webmanifest into ./public
// Edit SITE / content below, then rebuild.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public');

// ───────────────────────────── Site config ─────────────────────────────
const SITE = {
  url: 'https://kllctbls.com',          // ← production origin, no trailing slash
  name: 'kllctbls',
  email: 'leo@kllctbls.com',
  tagline: '#ForTheHobby',
  locale: 'en_US',
  themeColor: '#3D0956',
  ogImage: '/assets/img/og-image.jpg',
  // Paste a form endpoint (Formspree, Basin, Getform, your API…) to receive form posts.
  // Left empty, the contact form opens the visitor's email app with the message pre-filled.
  formEndpoint: '',
  sameAs: [],                            // e.g. ['https://www.instagram.com/kllctbls/']
  lastmod: '2026-11-15',
};

// Intrinsic image sizes (prevents layout shift)
const DIM = {
  'card-back.webp': [410, 601], 'card-face-design.webp': [514, 738], 'card-face-sponsorship.webp': [514, 738], 'card-face-tech.webp': [516, 738],
  'design-brand-sticker.webp': [589, 456], 'design-events-sticker.webp': [597, 436], 'design-social-sticker.webp': [551, 510],
  'floor-1.webp': [768, 1000], 'floor-2.webp': [768, 1000], 'floor-3.webp': [768, 1000], 'floor-4.webp': [768, 1000], 'floor-5.webp': [768, 1000], 'floor-6.webp': [768, 1000], 'floor-7.webp': [768, 1000],
  'hero-show.webp': [824, 1074], 'img-1b88.webp': [824, 512], 'logo-light.webp': [440, 241], 'pack-wrapper.webp': [488, 830],
  'pass-card-0.webp': [400, 613], 'pass-card-1.webp': [400, 613], 'pass-card-2.webp': [400, 613], 'pass-card-3.webp': [400, 613],
  'pass-stage-0.webp': [400, 726], 'pass-stage-1.webp': [400, 726], 'pass-stage-2.webp': [400, 726], 'pass-stage-3.webp': [400, 726],
  'swp-logo.webp': [600, 486], 'swp-1.webp': [720, 1280], 'swp-2.webp': [720, 1280], 'swp-3.webp': [864, 1080], 'swp-4.webp': [864, 1080],
  'frcs-logo.webp': [300, 90], 'frcs-1.webp': [720, 1280], 'frcs-2.webp': [720, 1280], 'frcs-3.webp': [720, 1280],
  'dallas-logo.webp': [264, 230], 'dallas-1.webp': [1080, 1080], 'dallas-2.webp': [1080, 720], 'dallas-3.webp': [1080, 1080], 'dallas-4.webp': [1080, 1080],
  'show-photo-1.webp': [826, 1072], 'sponsor-events-sticker.webp': [727, 784], 'sponsor-strategy-sticker.webp': [757, 703],
  'tech-landing-sticker.webp': [720, 649], 'tech-mobile-sticker.webp': [547, 637], 'tech-platform-sticker.webp': [725, 642],
};

// ───────────────────────────── Content ─────────────────────────────
const PIL = {
  Sponsorship: { b: '#FD8083', d: '#B23A42', t: '#FFE8E8' },
  Design: { b: '#EE1F7B', d: '#B8125C', t: '#FCE4EF' },
  Tech: { b: '#2FBFB4', d: '#137A72', t: '#DFF5F3' },
};

const PILLARS = {
  sponsorship: {
    key: 'Sponsorship', path: '/sponsorship/', no: 'No. 01', tone: 'coral', rotate: -5, series: 'Sponsorship series',
    title: 'Sports Card Show Sponsorship & Event Planning | kllctbls',
    description: 'Sponsorship strategy, rate cards, activations and event planning for sports card shows. The right brands for your crowd — $350K+ in sponsor revenue generated.',
    h1: 'Partnerships that amplify culture.',
    lede: 'Keep the iconic brands coming back — with sponsorships built on fit, not on filler.',
    cta: { label: 'Book a call', href: '/contact/', holo: true },
    accTitle: 'What we run for your show',
    band: 'Keep the iconic brands coming back',
    pills: [['-44cqw', '-20cqw'], ['-44cqw', '20cqw']],
    stats: true,
    services: [
      { id: 'sponsorship-strategy', name: 'Sponsorship Strategy', img: 'sponsor-strategy-sticker.webp',
        copy: ["Connecting shows with the right sponsors for impactful partnerships that resonate. Our strategy ensures every partnership enhances your event's value and visibility."],
        items: ['Sponsor Fit Mapping', 'Tier & Rate Card Design', 'Audience Insights', 'Activation Concepts'] },
      { id: 'event-planning', name: 'Event Planning & Execution', img: 'sponsor-events-sticker.webp',
        copy: ['From concept to reality, we manage every detail of your sports card show to create experiences that attendees remember and talk about. Seamless logistics, engaging activations, and more.'],
        items: ['Floor Plan & Logistics', 'Vendor Management', 'On-Site Activations', 'Run of Show', 'Post-Show Reporting'] },
    ],
  },
  design: {
    key: 'Design', path: '/design/', no: 'No. 02', tone: 'pink', rotate: 5, series: 'Design series',
    title: 'Brand, Event & Social Design for Card Shows | kllctbls',
    description: 'Logo design, brand identity, event branding, signage and social media design for card shows and hobby businesses — built to be the brand everyone points to.',
    h1: 'Built to become the brand everyone points to.',
    lede: 'Collectors notice everything, from logos to banners. <span style="color:var(--ink-80)">We help hobby businesses look as professional as the communities they\'ve built.</span>',
    ledeStrong: true,
    cta: { label: 'Explore the collection', href: '/portfolio/', holo: false },
    accTitle: 'Build a brand worth collecting',
    band: 'Look like the show everyone wants to be at',
    pills: [['-40cqw', '-36cqw'], ['-48cqw', '0cqw'], ['-40cqw', '36cqw']],
    services: [
      { id: 'brand-kits-logo-design', name: 'Brand Kits & Logo Design', img: 'design-brand-sticker.webp',
        copy: ["A strong brand isn't just a logo. It's the reason people remember you. From logos and visual systems to websites and brand assets, we create identities that collectors recognize, partners trust, and communities rally behind."],
        items: ['Logo Design', 'Brand Identity Systems', 'Brand Guidelines', 'Website Design', 'Creative Asset Design', 'Merchandise Graphics', 'Marketing Collateral'] },
      { id: 'event-marketing', name: 'Event Marketing', img: 'design-events-sticker.webp',
        copy: ['Every great event is a collection of moments. We design the pieces that bring those moments together. From the first ticket purchase to the final photo at the show, we help create experiences that feel polished, memorable, and unmistakably yours.'],
        items: ['Event Branding', 'Standees & Signage', 'Tickets', 'Lanyards', 'Floor Graphics', 'Stage Visuals', 'Sponsor Assets', 'Visitor Experience Design'] },
      { id: 'social-media-design', name: 'Social Media Design', img: 'design-social-sticker.webp',
        copy: ['The hobby never stops scrolling. We create content systems that help your brand stay visible, recognizable, and relevant across every platform that matters.', 'Because getting attention is one thing. Keeping it is another.'],
        items: ['Social Media Posts', 'Reels & Campaign Assets', 'Product Launch Graphics', 'Event Promotions', 'Community Announcements', 'Content Templates', 'Creative Direction'] },
    ],
  },
  tech: {
    key: 'Tech', path: '/tech/', no: 'No. 03', tone: 'teal', rotate: -4, series: 'Tech series',
    title: 'Websites, Platforms & Apps for the Hobby | kllctbls',
    description: 'Landing pages, member and business platforms, and iOS & Android apps for card shows and hobby businesses. Build it once. Build it right.',
    h1: 'Build it once. Build it right.',
    lede: 'The hobby deserves technology that keeps up with it. Systems built to scale communities.',
    cta: { label: 'Book a call', href: '/contact/', holo: true },
    accTitle: 'Three tiers, one foundation',
    band: 'Systems built to scale communities',
    pills: [['-40cqw', '-36cqw'], ['-48cqw', '0cqw'], ['-40cqw', '36cqw']],
    services: [
      { id: 'landing-page', name: 'Landing Page', img: 'tech-landing-sticker.webp',
        copy: ['Your website has one job: make a strong first impression. We make sure it does exactly that.', 'Perfect for businesses looking to build credibility, attract customers, and create a professional online presence from day one.'],
        items: ['Responsive Website', 'Contact Forms', 'SEO Foundation', 'Professional Brand Integration', 'Launch & Deployment'] },
      { id: 'business-platform', name: 'Business Platform', img: 'tech-platform-sticker.webp',
        copy: ['Behind every growing hobby business is a platform that can keep up.', 'Built for memberships, registrations, communities, events, and day-to-day operations. Technology that helps you spend less time managing spreadsheets and more time growing the business.'],
        items: ['Customer Accounts', 'Secure Login System', 'User Dashboards', 'Admin Management', 'Database Management', 'Email Automation'] },
      { id: 'mobile-app', name: 'Mobile App', img: 'tech-mobile-sticker.webp',
        copy: ["Your business doesn't stop at the desktop. Neither should your customers.", 'Extend your experience beyond the browser with a mobile application built around convenience, engagement, and long-term growth.'],
        items: ['iOS & Android Apps', 'User Accounts & Login', 'Real-Time Updates', 'Platform Integrations', 'Scalable Architecture'] },
    ],
  },
};

const IL = (src, alt, pillar) => ({ src, alt, pillar, illus: true });
const PH = (src, alt, pillar) => ({ src, alt, pillar, illus: false });
const PROJECTS = [
  { id: 'dallas-card-show', world: 'hobby', slug: 'Exhibit 001', name: 'Dallas Card Show', initial: 'DC', logo: 'dallas-logo.webp', pillars: ['Sponsorship'], icon: 'trophy', statLabel: 'Sponsorship, from zero', stat: '$300K+',
    summary: "The sponsorship program for one of the country's largest card shows, built from zero to $300K+.",
    challenge: 'In 2022 one of the largest sports card shows in the country had no sponsorship program: no packages, no partners, no revenue. Our founder built it from scratch.',
    did: ['Launched the program from scratch in 2022', 'Multi-year deals with PSA, SGC, Beckett, Goldin and more', 'Activation across 750+ tables and 85,000+ sq ft', 'Influencer network and talent like Michael Irvin'],
    results: [['$300K+', 'Confirmed for 2024'], ['5x', 'Sponsor portfolio growth'], ['10', 'National brand partners']],
    gallery: [PH('dallas-2.webp', 'A packed Dallas Card Show floor with collectors browsing dealer tables', 'Sponsorship'), PH('dallas-1.webp', 'Our founder on the show floor in a Dallas Card Show hoodie', 'Sponsorship'), PH('dallas-4.webp', 'Holding a signed number 10 Texas jersey at a Dallas Card Show autograph signing', 'Sponsorship'), PH('dallas-3.webp', 'Vendors catching up at a Dallas Card Show event', 'Sponsorship')] },
  { id: 'sportswaxpromotions', world: 'hobby', slug: 'Exhibit 002', name: 'SportsWaxPromotions', initial: 'SW', logo: 'swp-logo.webp', pillars: ['Sponsorship'], icon: 'handshake', statLabel: 'Sponsor revenue', stat: '$85K',
    summary: 'Sponsorship strategy that matched the right brands to a breaking-focused audience.',
    challenge: 'A strong audience with inconsistent sponsor deals — packages were priced by gut and renewals were rare.',
    did: ['Sponsor fit mapping', 'Tier and rate card design', 'Activation concepts', 'Post-show reporting'],
    results: [['$85K', 'Sponsor revenue'], ['9', 'Brand partners'], ['78%', 'Renewal rate']],
    gallery: [PH('swp-1.webp', 'Collectors lining up outside the event center before a Sports Wax Promotions show', 'Sponsorship'), PH('swp-2.webp', 'A packed Sports Wax Promotions show floor seen from above', 'Sponsorship'), PH('swp-3.webp', 'Collectors crowding dealer cases at a Sports Wax Promotions show', 'Sponsorship'), PH('swp-4.webp', 'Dealers and buying stations on the Sports Wax Promotions floor', 'Sponsorship')] },
  { id: 'front-row-card-show', world: 'hobby', slug: 'Exhibit 003', name: 'Front Row Card Show', initial: 'FR', logo: 'frcs-logo.webp', pillars: ['Sponsorship'], icon: 'ticket', statLabel: 'New sponsorship in 3 months', stat: '$10K',
    summary: 'Four big-name hobby partners and $10K in new sponsorship, closed in three months.',
    challenge: 'Front Row Card Show wanted brand partners on the floor, with packages that fit its market and capacity and someone to run every deal end to end.',
    did: ["Sponsor packages sized to the show's market", 'Warm outreach to Graded Guard, PSA, Beckett and Pristine Auctions', 'Presentations and negotiation', 'Contracts and clean handoff'],
    results: [['$10K', 'New sponsorship revenue'], ['4', 'Hobby partners signed'], ['3 mo', 'Start to signed']],
    gallery: [PH('frcs-1.webp', 'A packed Front Row Card Show ballroom full of dealer tables', 'Sponsorship'), PH('frcs-2.webp', 'Collectors filling the aisles under the Front Row Card Show banner', 'Sponsorship'), PH('frcs-3.webp', 'Collectors lined up at buying stations at Front Row Card Show', 'Sponsorship')] },
  { id: 'metis', world: 'beyond', slug: 'Exhibit 004', name: 'Metis', initial: 'M', pillars: ['Design', 'Tech'], icon: 'layout-dashboard', statLabel: 'Online registrations', stat: '+312%',
    summary: 'A brand and member platform for a fast-growing collector community.',
    challenge: 'Metis had a loyal following and no home base — signups lived in DMs and spreadsheets, and the brand looked different on every channel.',
    did: ['Brand identity and logo system', 'Member accounts with secure login', 'Event registration and ticketing', 'Admin dashboard for the team'],
    results: [['+312%', 'Online registrations'], ['4.8★', 'Member rating'], ['−60%', 'Manual admin time']],
    gallery: [IL('tech-platform-sticker.webp', 'Metis member platform screens', 'Tech'), IL('design-brand-sticker.webp', 'Metis brand kit', 'Design'), PH('hero-show.webp', 'Metis at the show', 'Design')] },
  { id: 'stima', world: 'beyond', slug: 'Exhibit 005', name: 'Stima', initial: 'S', pillars: ['Design'], icon: 'pen-tool', statLabel: 'Concept to launch', stat: '6 wks',
    summary: 'A collector-first identity built to stand out on a crowded show floor.',
    challenge: 'Stima was launching into a market full of look-alike brands and needed an identity collectors would remember after one pass of the booth.',
    did: ['Logo and visual identity', 'Brand guidelines', 'Booth signage and standees', 'Social launch templates'],
    results: [['6 wks', 'Concept to launch'], ['2.1x', 'Booth foot traffic'], ['18K', 'Launch impressions']],
    gallery: [IL('design-social-sticker.webp', 'Stima social media templates', 'Design'), IL('design-events-sticker.webp', 'Stima event signage', 'Design')] },
];

const GALLERY = [
  { photo: 'hero-show.webp', alt: 'kllctbls team on the show floor', pillar: 'Sponsorship', project: 'sportswaxpromotions' },
  { photo: 'floor-2.webp', alt: 'kllctbls at a card show with a collector', pillar: 'Sponsorship', project: 'sportswaxpromotions' },
  { photo: 'show-photo-1.webp', alt: 'Collectors at a kllctbls show', pillar: 'Sponsorship', project: 'sportswaxpromotions' },
  { photo: 'floor-3.webp', alt: 'kllctbls at a collectible card display wall', pillar: 'Sponsorship', project: 'sportswaxpromotions' },
  { caseId: 'sportswaxpromotions' },
  { photo: 'img-1b88.webp', alt: 'Show floor crowd', pillar: 'Sponsorship', project: 'sportswaxpromotions' },
  { misprint: true },
  { slot: true },
];
const TILE_ROT = [-2, 1.5, -1, 2, 1.5, -1.5, 1, -2];

const FLOOR = [
  ['floor-1.webp', 'kllctbls crew and friends at a collectors meetup'],
  ['floor-2.webp', 'kllctbls at a card show with a collector'],
  ['floor-3.webp', 'kllctbls at a collectible card display wall'],
  ['floor-4.webp', 'kllctbls on the red carpet at a card industry event'],
  ['floor-5.webp', 'Group photo at a kllctbls hosted event'],
  ['floor-6.webp', 'Selfie with a guest at a kllctbls event'],
  ['floor-7.webp', 'kllctbls with partners in the VIP lounge'],
  ['hero-show.webp', 'kllctbls team at the booth'],
  ['show-photo-1.webp', 'Collectors at a kllctbls show'],
  ['img-1b88.webp', 'Sports card show floor'],
];

const OFFERS = [
  { id: 'sponsorship', no: 'No. 01', name: 'Sponsorship', base: '#FD8083', line: 'We connect the right brands with the right fandoms.', items: ['Sponsor fit mapping', 'Tier & rate cards', 'Activation concepts'] },
  { id: 'design', no: 'No. 02', name: 'Design', base: '#EE1F7B', line: 'Brands, experiences and identities collectors keep.', items: ['Brand identity', 'Booth & event design', 'Social templates'] },
  { id: 'tech', no: 'No. 03', name: 'Tech', base: '#2FBFB4', line: 'Platforms and systems that power communities.', items: ['Landing pages', 'Member platforms', 'Mobile apps'] },
];

const BRANDS = ['Topps', 'Panini', 'Fanatics', 'Beckett', 'PSA', 'Card Ladder', 'eBay Live', 'Whatnot'];

// ───────────────────────────── Helpers ─────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => SITE.url + p;
const img = (file, alt, { cls = '', lazy = true, style = '', priority = false, extra = '' } = {}) => {
  const [w, h] = DIM[file] || [];
  return `<img src="/assets/img/${file}" alt="${esc(alt)}"${w ? ` width="${w}" height="${h}"` : ''}${cls ? ` class="${cls}"` : ''}${lazy && !priority ? ' loading="lazy"' : ''} decoding="async"${priority ? ' fetchpriority="high"' : ''}${style ? ` style="${style}"` : ''}${extra ? ' ' + extra : ''}>`;
};
const icon = (name, cls = 'mask-icon', style = '') => `<span class="${cls}" aria-hidden="true" style="--icon:url('/assets/icons/${name}.svg');${style}"></span>`;
const decoProject = (p) => {
  const m = PIL[p.pillars[0]];
  return { ...p, tint: m.t, deep: m.d, base: m.b, bar: p.pillars.length > 1 ? `linear-gradient(90deg,${p.pillars.map((n) => PIL[n].b).join(',')})` : m.b, url: `/portfolio/${p.id}/` };
};
const projects = PROJECTS.map(decoProject);
const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

// ───────────────────────────── Layout ─────────────────────────────
const NAV = [
  ['Sponsorship', '/sponsorship/', 'sponsorship'],
  ['Design', '/design/', 'design'],
  ['Tech', '/tech/', 'tech'],
  ['Portfolio', '/portfolio/', 'portfolio'],
];

function header(current) {
  const cur = (href) => (current && current.startsWith(href) ? ' aria-current="page"' : '');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="site-header__bar">
    <a href="/" class="site-logo" aria-label="kllctbls home"${current === '/' ? ' aria-current="page"' : ''}><img src="/assets/img/logo-light.webp" alt="kllctbls" width="440" height="241"></a>
    <nav class="nav-desktop" aria-label="Main">
      ${NAV.map(([l, h, k]) => `<a href="${h}" class="nav-link nav-link--${k}"${cur(h)}>${l}</a>`).join('\n      ')}
      <a href="/contact/" class="nav-cta holo-cta"${cur('/contact/')}>Book a call</a>
    </nav>
    <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span><span></span></button>
  </div>
  <nav class="nav-mobile" id="mobile-nav" aria-label="Main mobile" hidden>
    ${NAV.map(([l, h]) => `<a href="${h}"${cur(h)}>${l}</a>`).join('\n    ')}
    <a href="/contact/" class="nav-cta holo-cta"${cur('/contact/')}>Book a call</a>
  </nav>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap site-footer__grid">
    <div>
      <a href="/" class="site-footer__logo" aria-label="kllctbls home"><img src="/assets/img/logo-light.webp" alt="kllctbls" width="117" height="64" loading="lazy"></a>
      <p class="site-footer__tag">${SITE.tagline}</p>
    </div>
    <nav aria-label="Services">
      <ul>
        <li><a href="/sponsorship/">Sponsorship</a></li>
        <li><a href="/design/">Design</a></li>
        <li><a href="/tech/">Tech</a></li>
      </ul>
    </nav>
    <nav aria-label="Company">
      <ul>
        <li><a href="/portfolio/">Portfolio</a></li>
        <li><a href="/contact/">Contact Us</a></li>
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
      </ul>
    </nav>
    <div>
      <p class="site-footer__legal">© 2026 kllctbls. All rights reserved.<br>Based in the U.S. · shows nationwide</p>
    </div>
  </div>
</footer>`;
}

function ctaBand(text, label = 'Book a call', href = '/contact/', holo = true) {
  return `<section class="cta-band">
  <div class="wrap cta-band__row">
    <h2>${text}</h2>
    <a href="${href}" class="btn btn--light${holo ? ' holo-cta' : ''}">${label}</a>
  </div>
</section>`;
}

const ORG_ID = SITE.url + '/#organization';
const orgLd = {
  '@type': 'Organization', '@id': ORG_ID, name: SITE.name, url: SITE.url + '/',
  logo: { '@type': 'ImageObject', url: abs('/assets/img/icon-512.png'), width: 512, height: 512 },
  image: abs(SITE.ogImage), email: SITE.email, slogan: SITE.tagline,
  description: 'kllctbls helps sports card shows and hobby businesses grow with sponsorship, design and technology.',
  areaServed: { '@type': 'Country', name: 'United States' },
  knowsAbout: ['Sports card shows', 'Event sponsorship', 'Event planning', 'Brand design', 'Web development', 'Mobile apps'],
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
};
const crumbs = (list) => ({
  '@type': 'BreadcrumbList',
  itemListElement: list.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

function page({ path, title, description, body, current, ld = [], head = '', noindex = false, ogType = 'website', script = true }) {
  const canonical = abs(path);
  const graph = { '@context': 'https://schema.org', '@graph': ld };
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">\n<link rel="canonical" href="' + canonical + '">'}
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="color-scheme" content="light">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(SITE.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A packed sports card show floor under kllctbls banners">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(SITE.ogImage)}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script>document.documentElement.className=document.documentElement.className.replace('no-js','js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/assets/fonts/gliker.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Inter:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
${head}<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
${script ? '<script src="/assets/js/site.js" defer></script>' : ''}
</body>
</html>
`;
}

// ───────────────────────────── Sections ─────────────────────────────
const statsBand = () => `<section class="stats-band" aria-label="kllctbls by the numbers">
  <div class="wrap stats-band__grid">
    <div class="stat" data-reveal><span class="stat__bar bg-coral"></span><p class="stat__num" data-count="20" data-suffix="+">20+</p><p class="stat__label">Shows developed · 98% client satisfaction</p></div>
    <div class="stat" data-reveal><span class="stat__bar bg-pink"></span><p class="stat__num" data-count="350" data-prefix="$" data-suffix="K+">$350K+</p><p class="stat__label">Sponsorship revenue generated</p></div>
    <div class="stat" data-reveal><span class="stat__bar bg-teal"></span><p class="stat__num" data-count="10000" data-suffix="+">10,000+</p><p class="stat__label">Hours dedicated to the hobby</p></div>
  </div>
</section>`;

const heroScrub = () => {
  return `<section class="hero-video" data-hero-video aria-labelledby="home-title">
  <picture>
    <source media="(max-aspect-ratio: 1/1)" srcset="/assets/video/hero-poster-m.webp" width="540" height="960">
    <img class="hero-video__poster" src="/assets/video/hero-poster.webp" width="1280" height="720" alt="The kllctbls team meeting collectors, dealers and brands on sports card show floors" fetchpriority="high" decoding="async">
  </picture>
  <video class="hero-video__media" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"
    data-src="/assets/video/hero.mp4" data-src-m="/assets/video/hero-m.mp4"></video>
  <div class="hero-video__tint" aria-hidden="true"></div>
  <div class="hero-video__fade" aria-hidden="true"></div>
  <div class="wrap hero-video__row">
    <h1 id="home-title" class="hero-video__title">Transforming the Sports Card Industry Through Innovative Consulting and Strategic Partnerships</h1>
  </div>
  <div class="hero-scrub__cue" aria-hidden="true"><span>Scroll</span><span></span></div>
</section>`;
};

const marquee = () => {
  const items = (hidden) => BRANDS.map((b) => `<li class="marquee__item"${hidden ? ' aria-hidden="true"' : ''}>${b} &nbsp;·</li>`).join('');
  return `<section class="marquee" aria-label="Brands across the hobby">
  <ul class="marquee__track" style="list-style:none;margin:0;padding:0">${items(false)}${items(true)}</ul>
</section>`;
};

const packTear = () => `<section class="pack" data-pack aria-labelledby="pack-title">
  <div class="pack__inner">
    <span class="eyebrow eyebrow--sm">✦ What we build ✦</span>
    <h2 id="pack-title" class="pack__title">Rip the pack.</h2>
    <p class="pack__lede">Three offerings sealed in one pack. Sponsorship, Design and Tech, built for the hobby.</p>
    <div class="pack__stage">
      <div class="pack__glow" aria-hidden="true"></div>
      <button type="button" class="pack__hit" aria-label="Tear open the offerings pack" aria-expanded="false"></button>
${OFFERS.map((o) => `      <article class="pack-card" data-id="${o.id}" aria-label="${o.name} card">
        <div class="pack-card__flip">
          <div class="pack-card__face">
            <div class="pack-card__art" style="background-image:url('/assets/img/card-face-${o.id}.webp')"></div>
            <div class="pack-card__ui">
              <span class="pack-card__no">${o.no}</span>
              <span class="pack-card__series">${o.name}</span>
              <div class="pack-card__body">
                <h3 class="pack-card__name">${o.name}</h3>
                <p class="pack-card__line">${o.line}</p>
                <ul class="pack-card__items" style="--dot:${o.base}">${o.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
              </div>
              <span class="pack-card__brand" aria-hidden="true">kllctbls</span>
              <a href="/${o.id}/" class="pack-card__explore">Explore<span class="sr-only"> ${o.name}</span> →</a>
            </div>
          </div>
          <div class="pack-card__back" aria-hidden="true"></div>
        </div>
      </article>`).join('\n')}
      <div class="pack-layer" data-layer="body" aria-hidden="true"><div class="pack-layer__clip"><div class="pack-layer__sheen"></div><div class="pack-layer__tear"></div><span class="pack-layer__label">✂ tear here</span></div></div>
      <div class="pack-layer" data-layer="top" aria-hidden="true"><div class="pack-layer__clip"><div class="pack-layer__sheen"></div><div class="pack-layer__tear"></div><span class="pack-layer__label">✂ tear here</span></div></div>
${[[0.08, 16, '#FEF9FF'], [0.22, 22, '#8B5CF6'], [0.36, 14, '#FD8083'], [0.5, 26, '#EE1F7B'], [0.64, 15, '#2FBFB4'], [0.78, 20, '#6D3BD6'], [0.92, 14, '#FD8083']].map(([f, s, c]) => `      <span class="pack-spark" data-f="${f}" aria-hidden="true" style="font-size:${s}px;color:${c}">✦</span>`).join('\n')}
    </div>
    <div class="pack__foot">
      <span class="pack__hint" aria-live="polite">Tap or scroll to tear it open</span>
      <button type="button" class="pack__reseal" hidden>↺ Reseal the pack</button>
    </div>
  </div>
</section>`;

function galleryTile(g, i) {
  const rot = `--rot:${TILE_ROT[i]}deg`;
  if (g.photo) {
    return `<a href="/portfolio/${g.project}/" class="holo-tile g-tile" data-holo data-pillars="${g.pillar}" style="${rot}" aria-label="${esc(g.alt)} — open case study">
  <div class="g-tile__in g-tile__in--photo">
    ${img(g.photo, g.alt, { cls: 'g-tile__img' })}
    <div class="g-tile__shade"></div>
    <span class="g-tile__cta">Case study →</span>
    <span class="holo-sheen" aria-hidden="true"></span><span class="g-tile__hatch" aria-hidden="true"></span>
  </div>
</a>`;
  }
  if (g.caseId) {
    const p = byId[g.caseId];
    return `<a href="${p.url}" class="holo-tile g-tile" data-holo data-pillars="${p.pillars.join(' ')}" style="${rot}" aria-label="${esc(p.name)} case file">
  <div class="g-tile__in">
    <div class="g-tile__bar" style="background:${p.bar}"></div>
    <div class="g-tile__top"><span class="label-xs">No. ${p.slug.replace('Exhibit ', '')}</span></div>
    <div class="g-tile__mid"><span class="g-tile__case-icon" style="background:${p.tint};color:${p.deep}">${icon(p.icon, 'mask-icon', 'width:44%;height:44%')}</span></div>
    <div class="g-tile__bottom">
      <span class="g-tile__name">${esc(p.name)}</span>
      <div class="g-tile__statwrap"><span class="g-tile__stat" style="color:${p.deep}">${p.stat}</span><span class="label-xs" style="overflow:hidden;text-overflow:ellipsis">${p.statLabel}</span></div>
    </div>
    <span class="holo-sheen" aria-hidden="true"></span><span class="g-tile__hatch" aria-hidden="true"></span>
  </div>
</a>`;
  }
  if (g.misprint) {
    return `<a href="/404.html" rel="nofollow" class="holo-tile g-tile" data-holo data-misprint style="${rot}" aria-label="Exhibit 404, a misprint">
  <div class="g-tile__in g-tile__in--mis">
    <div class="g-tile__top"><span class="label-xs">No. 404</span><span class="pill-dark">Misprint</span></div>
    <div class="misprint" aria-hidden="true"><span class="m1" data-mis="-1">404</span><span class="m2" data-mis="1">404</span><span class="m3">404</span></div>
    <span class="g-tile__more">Never printed →</span>
    <span class="holo-sheen" aria-hidden="true"></span><span class="g-tile__hatch" aria-hidden="true"></span>
  </div>
</a>`;
  }
  return `<a href="/contact/" class="holo-tile g-tile" data-holo style="${rot}" aria-label="Your show here — book a call">
  <div class="g-tile__in g-tile__in--slot">
    <div class="slot__dash" aria-hidden="true"></div>
    <div class="slot"><span class="slot__plus" aria-hidden="true"></span><span class="slot__title">Your show here</span><span style="font-size:14px;color:var(--violet-d)">Book a call →</span></div>
    <span class="slot__star" aria-hidden="true">✦</span>
    <span class="holo-sheen" aria-hidden="true"></span><span class="g-tile__hatch" aria-hidden="true"></span>
  </div>
</a>`;
}

const gallery = () => `<section class="section-pad" data-gallery aria-labelledby="gallery-title">
  <div class="wrap">
    <div class="gallery-head" data-reveal>
      <div style="display:flex;flex-direction:column;gap:10px">
        <span class="eyebrow eyebrow--sm">✦ From the show floor ✦</span>
        <h2 id="gallery-title">The gallery.</h2>
      </div>
    </div>
    <div class="gallery-scroll">
      <div class="gallery-grid">
${GALLERY.map(galleryTile).join('\n')}
      </div>
    </div>
  </div>
</section>`;

const STEPS = [
  { num: '01', title: 'Tell us about your show', desc: 'A 30-minute call about the event, the crowd and what you want out of it.', gets: 'discovery call' },
  { num: '02', title: 'Get a clear plan', desc: 'Sponsors, design and tech, with costs and dates, in writing.', gets: 'one-page plan' },
  { num: '03', title: 'Show day', desc: 'We deliver, show up on the floor, then send the numbers.', gets: 'post-show report' },
];
const passSteps = () => `<div class="pass-outer" data-pass>
<section class="pass" aria-labelledby="pass-title">
  <div class="pass__grid">
    <div class="pass__copy">
      <div class="pass__head">
        <span class="eyebrow eyebrow--sm">How it works</span>
        <h2 id="pass-title">Your pass to show day.</h2>
        <p>Three steps. No guesswork.</p>
      </div>
      <ol class="pass__steps">
${STEPS.map((s, i) => `        <li><button type="button" class="pass-step" data-step="${i}">
          <span class="pass-step__num" aria-hidden="true">${s.num}</span>
          <span class="pass-step__txt"><span class="pass-step__title">${s.title}</span><span class="pass-step__desc">${s.desc}</span><span class="pass-step__gets">You get: ${s.gets}</span></span>
          <span class="pass-step__check" aria-hidden="true">✓</span>
        </button></li>`).join('\n')}
      </ol>
      <div><a href="/contact/" class="pass__next" data-next>Next step</a></div>
    </div>
    <div class="pass__visual">
      <div class="pass__stage" data-lanyard>
        <div class="pass__chip">Set complete ✓</div>
        <span class="lanyard__hook" aria-hidden="true"></span>
        <svg class="lanyard__strap" aria-hidden="true"><path class="lanyard__s1"/><path class="lanyard__s2"/><path class="lanyard__s3"/></svg>
        <div class="lanyard__card" tabindex="0" role="button" aria-pressed="false" aria-label="Show pass: drag to swing, press to flip">
          <div class="lanyard__flip">
            <div class="lanyard__face lanyard__front">
${['Blank show pass', 'Show pass with your show name', 'Show pass with sponsors and details', 'All-access show pass for show day'].map((alt, k) => `              ${img(`pass-card-${k}.webp`, alt, { cls: 'pass__img' + (k === 0 ? ' is-on' : ''), extra: `data-stage="${k}" draggable="false"` })}`).join('\n')}
            </div>
            <div class="lanyard__face lanyard__back" aria-hidden="true">
              <div class="lanyard__panel">
                <img src="/assets/img/logo-light.webp" alt="" class="lanyard__logo" width="${(DIM['logo-light.webp'] || [])[0] || ''}" height="${(DIM['logo-light.webp'] || [])[1] || ''}" loading="lazy" decoding="async" draggable="false">
                <span class="lanyard__label">Show pass</span>
                <span class="lanyard__fine">Not valid without a booth.<br>kllctbls.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="pass__hint" aria-hidden="true">Drag to swing · Tap to flip</p>
    </div>
  </div>
</section>
</div>`;

const about = () => `<section id="about" style="padding:0 var(--gutter) clamp(50px,7vw,112px)" aria-label="About kllctbls">
  <div class="wrap cards-3">
    <article class="info-card" data-reveal>
      <div class="info-card__head bg-coral-t"><h2>Our Story</h2></div>
      <div class="info-card__body">
        <p>kllctbls was born from a deep love for the sports card industry and a vision to elevate its potential.</p>
        <p>Founded by industry veterans, we've seen firsthand the power of strategic partnerships and unforgettable events.</p>
        <p>We're here to bring that experience and network to you.</p>
      </div>
    </article>
    <article class="info-card" data-reveal>
      <div class="info-card__head bg-teal-t"><h2>Mission Statement</h2></div>
      <div class="info-card__body"><p>To bridge the gap between sports card shows and their greatest opportunities, fostering growth and creating unforgettable experiences.</p></div>
    </article>
    <article class="info-card" data-reveal>
      <div class="info-card__head bg-pink-t"><h2>Core Values</h2></div>
      <div class="info-card__body"><p>We believe in Integrity, where trust is our foundation; Innovation, where creativity drives results; and Collaboration, where partnerships fuel progress.</p></div>
    </article>
  </div>
</section>`;

// ───────────────────────────── Pages ─────────────────────────────
const pages = [];

// Home
pages.push({
  file: 'index.html',
  path: '/',
  current: '/',
  title: 'kllctbls — Sponsorship, Design & Tech for Sports Card Shows',
  description: 'Sponsorship, event planning, brand design and tech for sports card shows and hobby businesses. 20+ shows developed, $350K+ in sponsorship revenue generated.',
  head: '<link rel="preload" as="image" href="/assets/video/hero-poster.webp" media="(min-aspect-ratio: 1/1)" fetchpriority="high">\n<link rel="preload" as="image" href="/assets/video/hero-poster-m.webp" media="(max-aspect-ratio: 1/1)" fetchpriority="high">\n',
  ld: [
    orgLd,
    { '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url + '/', name: SITE.name, publisher: { '@id': ORG_ID }, inLanguage: 'en-US' },
    { '@type': 'WebPage', '@id': SITE.url + '/#webpage', url: SITE.url + '/', name: 'kllctbls — Sponsorship, Design & Tech for Sports Card Shows', isPartOf: { '@id': SITE.url + '/#website' }, about: { '@id': ORG_ID }, primaryImageOfPage: abs(SITE.ogImage) },
    { '@type': 'ItemList', name: 'kllctbls services', itemListElement: Object.values(PILLARS).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.key, url: abs(p.path) })) },
  ],
  body: [
    heroScrub(),
    marquee(),
    statsBand(),
    packTear(),
    gallery(),
    passSteps(),
    about(),
    `<section class="cta-band cta-band--home cta-band--video">
  <div class="cta-band__media" aria-hidden="true">
    <video muted loop playsinline preload="none" poster="/assets/video/forthehobby-poster.webp" data-bg-video data-src="/assets/video/forthehobby.mp4"></video>
  </div>
  <div class="cta-band__tint" aria-hidden="true"></div>
  <div class="wrap cta-band__content">
    <h2>#ForTheHobby</h2>
    <p>Sign up to get the show on the road!</p>
    <a href="/contact/" class="btn btn--light holo-cta">Book a call</a>
  </div>
</section>`,
  ].join('\n\n'),
});

// Pillar pages
for (const [id, P] of Object.entries(PILLARS)) {
  const pil = PIL[P.key];
  const pills = P.services.map((s, i) => `<a href="#${s.id}" class="holo-cta svc-pill" data-open="${s.id}" style="--px:${P.pills[i][0]};--py:${P.pills[i][1]};--d:${i * 55}ms">${s.name.replace('&', '&amp;')} <span aria-hidden="true">→</span></a>`).join('\n            ');
  const acc = P.services.map((s, i) => `<details class="acc-item" id="${s.id}"${i === 0 ? ' open' : ''}>
          <summary><h3>${s.name.replace('&', '&amp;')}</h3><span class="acc-sign" aria-hidden="true"></span></summary>
          <div class="acc-panel">
            <div class="acc-panel__copy">
              ${s.copy.map((c) => `<p>${esc(c)}</p>`).join('\n              ')}
              <ul class="ticks" style="--dot:${pil.b}">${s.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            </div>
            <div class="acc-panel__art">
              <div class="series-card">
                <div class="series-card__head" style="background:${pil.t}"><span>${s.name.replace('&', '&amp;')}</span><span>NO. 0${i + 1}</span></div>
                <div class="holo-ill-box">
                  <span class="holo-ill" aria-hidden="true" style="--m:url('/assets/img/${s.img}')"></span>
                  ${img(s.img, `${s.name} illustration by kllctbls`)}
                </div>
                <div class="series-card__foot"><span>kllctbls</span><span>${P.series}</span></div>
              </div>
            </div>
          </div>
        </details>`).join('\n        ');

  const statCards = P.stats ? `<section style="padding:clamp(10px,1.6vw,24px) var(--gutter) clamp(18px,2vw,30px)" aria-label="Results">
  <div class="wrap stat-cards">
    <div class="stat-card" data-reveal><div class="stat-card__bar bg-coral"></div><div class="stat-card__body"><p class="stat-card__num" data-count="20" data-suffix="+">20+</p><p>Successful Shows Developed with 98% Client Satisfaction</p></div></div>
    <div class="stat-card" data-reveal><div class="stat-card__bar bg-violet"></div><div class="stat-card__body"><p class="stat-card__num" data-count="350" data-prefix="$" data-suffix="K+">$350K+</p><p>Sponsorship Revenue Generated</p></div></div>
    <div class="stat-card" data-reveal><div class="stat-card__bar bg-teal"></div><div class="stat-card__body"><p class="stat-card__num" data-count="10000" data-suffix="+">10,000+</p><p>Hours Dedicated to the Hobby</p></div></div>
  </div>
</section>` : '';

  pages.push({
    file: `${id}/index.html`, path: P.path, current: P.path, title: P.title, description: P.description,
    ld: [
      orgLd,
      {
        '@type': 'Service', '@id': abs(P.path) + '#service', name: `${P.key} for sports card shows`, serviceType: P.key,
        description: P.description, provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: 'United States' }, url: abs(P.path),
        hasOfferCatalog: { '@type': 'OfferCatalog', name: `${P.key} services`, itemListElement: P.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.copy.join(' ') } })) },
      },
      crumbs([['Home', '/'], [P.key, P.path]]),
    ],
    body: `<section class="p-hero">
  <div class="p-hero__bg" aria-hidden="true"></div>
  <div class="wrap p-hero__row">
    <div class="p-hero__copy" data-reveal>
      <span class="eyebrow eyebrow--${P.tone}">${P.key}</span>
      <h1>${P.h1}</h1>
      <p class="lede"${P.ledeStrong ? ' style="color:var(--ink)"' : ''}>${P.lede}</p>
      <a href="${P.cta.href}" class="btn btn--primary${P.cta.holo ? ' holo-cta' : ''}">${P.cta.label}</a>
    </div>
    <div class="p-hero__art" data-reveal>
      <div class="hero-card-wrap">
        <nav class="svc-pills" aria-label="${P.key} services">
            ${pills}
        </nav>
        <div class="card3d" data-card3d style="--base:${P.rotate}deg">
          ${img(`card-face-${id}.webp`, `kllctbls ${P.key.toLowerCase()} trading card`, { priority: true })}
          <span class="card3d__no" aria-hidden="true">${P.no}</span>
          <span class="card3d__brand" aria-hidden="true">kllctbls</span>
          <span class="card3d__title" aria-hidden="true">${P.key}</span>
        </div>
      </div>
    </div>
  </div>
</section>

${statCards}

<section style="padding:clamp(30px,4vw,60px) var(--gutter) clamp(50px,7vw,104px)" aria-labelledby="acc-title">
  <div class="wrap--1100">
    <h2 id="acc-title" class="acc-title" data-reveal>${P.accTitle}</h2>
    <div class="acc acc--${P.tone}" data-acc data-reveal>
        ${acc}
    </div>
  </div>
</section>

${ctaBand(P.band, 'Contact Us')}`,
  });
}

// Exhibits
const exCard = (p) => `<a href="${p.url}" class="holo-tile" data-holo data-reveal aria-label="${esc(p.name)} case study">
  <article class="ex-card__in">
    <div style="height:6px;flex:none;background:${p.bar}"></div>
    <div class="ex-card__top"><span class="label-xs" style="font-size:12px;letter-spacing:.14em">${p.slug}</span>${p.world === 'beyond' ? '<span class="tag tag--beyond">Beyond the hobby</span>' : ''}</div>
    <div class="ex-card__id">${p.logo ? `<span class="icon-chip icon-chip--logo${DIM[p.logo][0] > DIM[p.logo][1] * 1.8 ? ' icon-chip--wide' : ''}">${img(p.logo, '', {})}</span>` : `<span class="icon-chip" style="background:${p.tint};color:${p.deep}">${icon(p.icon)}</span>`}<h3 class="ex-card__name">${esc(p.name).replace(/([a-z])([A-Z])/g, "$1<wbr>$2")}</h3></div>
    <p class="ex-card__sum">${esc(p.summary)}</p>
    <ul class="tags">${p.pillars.map((n) => `<li class="tag tag--${n}">${n}</li>`).join('')}</ul>
    <div class="ex-card__foot">
      <div style="display:flex;flex-direction:column;gap:2px"><span class="ex-card__stat" style="color:${p.deep}">${p.stat}</span><span class="label-xs">${p.statLabel}</span></div>
      <span class="ex-card__read">Read case →</span>
    </div>
    <span class="holo-sheen" aria-hidden="true"></span>
  </article>
</a>`;

pages.push({
  file: 'portfolio/index.html', path: '/portfolio/', current: '/portfolio/',
  title: 'Portfolio & Case Studies | kllctbls',
  description: 'kllctbls case studies: sponsorship programs, brand identities and member platforms for card shows and collector communities. Brands built, floors filled.',
  ld: [
    orgLd,
    { '@type': 'CollectionPage', name: 'kllctbls portfolio', url: abs('/portfolio/'), mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: abs(p.url) })) } },
    crumbs([['Home', '/'], ['Portfolio', '/portfolio/']]),
  ],
  body: `<section style="padding:clamp(44px,6vw,96px) var(--gutter) clamp(50px,7vw,104px)">
  <div class="wrap">
    <div class="page-head" data-reveal>
      <span class="eyebrow">Featured Portfolio</span>
      <h1>The shows, start to finish.</h1>
      <p class="lede" style="max-width:34em">Sponsorships activated, brands built, floors filled.</p>
    </div>
    <h2 class="h2-sm" style="margin-bottom:18px">For the hobby</h2>
    <div class="ex-grid" style="margin-bottom:clamp(40px,5vw,72px)">
${projects.filter((p) => p.world !== 'beyond').map(exCard).join('\n')}
    </div>
    <h2 class="h2-sm" style="margin-bottom:18px">From the show floor</h2>
    <div class="floor-grid">
${FLOOR.map(([f, a]) => `      ${img(f, a, { extra: 'data-reveal' })}`).join('\n')}
    </div>
    <div style="height:clamp(44px,5.5vw,80px)"></div>
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px">
      <h2 class="h2-sm">Beyond the hobby</h2>
      <span class="label-xs" style="font-size:13px;letter-spacing:.14em;color:var(--ink-62)">Exhibits 004–005</span>
    </div>
    <p style="font-size:clamp(16px,1.5vw,19px);color:var(--ink-80);margin-bottom:18px">The same team, outside the card room.</p>
    <div class="ex-grid">
${projects.filter((p) => p.world === 'beyond').map(exCard).join('\n')}
    </div>
  </div>
</section>

${ctaBand('Put your show on this page')}`,
});

// Case studies
projects.forEach((p, i) => {
  const nx = projects[(i + 1) % projects.length];
  pages.push({
    file: `portfolio/${p.id}/index.html`, path: p.url, current: '/portfolio/',
    title: `${p.name} Case Study — ${p.pillars.join(' & ')} | kllctbls`,
    description: `${p.summary} ${p.results.map((r) => `${r[0]} ${r[1].toLowerCase()}`).join(', ')}.`,
    ogType: 'article',
    ld: [
      orgLd,
      { '@type': 'Article', headline: `${p.name} case study`, description: p.summary, url: abs(p.url), image: abs(p.gallery[0] ? '/assets/img/' + p.gallery[0].src : SITE.ogImage), author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID }, about: p.pillars.map((n) => ({ '@type': 'Thing', name: n })), datePublished: SITE.lastmod, dateModified: SITE.lastmod },
      crumbs([['Home', '/'], ['Portfolio', '/portfolio/'], [p.name, p.url]]),
    ],
    body: `<section style="padding:clamp(30px,4vw,64px) var(--gutter) clamp(50px,7vw,104px)">
  <div class="wrap">
    <nav aria-label="Breadcrumb"><a href="/portfolio/" class="back-link">← All projects</a></nav>
    <div class="case-grid">
      <div>
        <aside class="case-card" data-reveal aria-label="Case file">
          <div style="height:6px;background:${p.bar}"></div>
          <div style="padding:16px 22px"><span class="label-xs" style="font-size:13px;letter-spacing:.16em">${p.slug}</span></div>
          ${p.logo ? `<div class="case-card__art case-card__art--logo">${img(p.logo, p.name + ' logo', {})}</div>` : `<div class="case-card__art" style="background:${p.tint};color:${p.deep}">${icon(p.icon)}<span class="case-card__initial" aria-hidden="true">${p.initial}</span></div>`}
          <div class="case-card__body">
            <span class="case-card__name">${esc(p.name).replace(/([a-z])([A-Z])/g, "$1<wbr>$2")}</span>
            <ul class="tags">${p.world === 'beyond' ? '<li class="tag tag--beyond">Beyond the hobby</li>' : ''}${p.pillars.map((n) => `<li class="tag tag--${n}">${n}</li>`).join('')}</ul>
            <div class="case-card__stat"><span class="label-xs" style="font-size:12px">${p.statLabel}</span><strong style="color:${p.deep}">${p.stat}</strong></div>
          </div>
        </aside>
      </div>
      <article class="case-main">
        <header class="case-block" style="gap:16px">
          <span class="eyebrow eyebrow--sm">Case study</span>
          <h1>${esc(p.name).replace(/([a-z])([A-Z])/g, '$1<wbr>$2')}</h1>
          <p class="case-sum">${esc(p.summary)}</p>
        </header>
        <section class="case-block"><h2>The challenge</h2><p>${esc(p.challenge)}</p></section>
        <section class="case-block"><h2>What we built</h2><ul class="did" style="--dot:${p.base}">${p.did.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></section>
        <section class="case-block" style="gap:18px"><h2>Results</h2><dl class="results">${p.results.map((r) => `<div><dt>${r[1]}</dt><dd style="color:${p.deep}">${r[0]}</dd></div>`).join('')}</dl></section>
        ${p.gallery.length ? `<section class="case-block" style="gap:18px"><h2>From the project</h2>
          <div class="case-gallery">${p.gallery.map((g) => `<figure style="background:${g.illus ? PIL[g.pillar].t : 'transparent'};padding:${g.illus ? '22px' : '0'}${!g.illus && DIM[g.src] && DIM[g.src][1] > DIM[g.src][0] * 1.1 ? ';aspect-ratio:3 / 4' : ''}">${img(g.src, g.alt, { style: `object-fit:${g.illus ? 'contain' : 'cover'}` })}</figure>`).join('')}</div>
        </section>` : ''}
        <a href="${nx.url}" class="next-exhibit"><span class="label-xs" style="font-size:13px;letter-spacing:.16em">Next exhibit</span><strong>${esc(nx.name)} →</strong></a>
      </article>
    </div>
  </div>
</section>

${ctaBand('Make your show the next exhibit.')}`,
  });
});

// Contact
pages.push({
  file: 'contact/index.html', path: '/contact/', current: '/contact/',
  title: 'Contact & Book a Call | kllctbls',
  description: "Tell kllctbls about your sports card show. We'll come back within two business days with a call time and a first read on the opportunity.",
  ld: [
    orgLd,
    { '@type': 'ContactPage', name: 'Contact kllctbls', url: abs('/contact/'), about: { '@id': ORG_ID } },
    crumbs([['Home', '/'], ['Contact', '/contact/']]),
  ],
  body: `<section style="padding:clamp(40px,5vw,84px) var(--gutter) clamp(50px,7vw,104px)">
  <div class="wrap">
    <div class="contact-top">
      <div class="contact-top__copy" data-reveal>
        <span class="eyebrow eyebrow--teal">Contact Us</span>
        <h1>Let's get your show on the road.</h1>
        <p class="lede">Tell us about the show and we'll come back within two business days with a call time and a first read on the opportunity.</p>
      </div>
      <div class="contact-top__art" data-reveal>
        ${img('pass-stage-3.webp', 'kllctbls all-access show pass', { cls: 'contact-pass', lazy: false, extra: 'data-card3d style="--base:4deg"' })}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(24px,3vw,54px);align-items:start">
      <div class="form-card" data-reveal>
        <div class="form-card__head"><h2>Book a call</h2></div>
        <div class="form-done" hidden tabindex="-1">
          <div class="form-done__tick" aria-hidden="true">✓</div>
          <h3>Thanks, <span data-sent="name">there</span> — we've got it.</h3>
          <p>Your note about <strong data-sent="need"></strong> is with the team. Expect a reply at <span data-sent="email"></span> within two business days.</p>
          <p class="ref">Reference #<span data-sent="ref"></span></p>
          <button type="button" class="btn btn--ghost" data-reset>Send another</button>
        </div>
        <form class="form" data-contact novalidate action="${SITE.formEndpoint || 'mailto:' + SITE.email}" method="post" data-endpoint="${esc(SITE.formEndpoint)}" data-mailto="${SITE.email}">
          <div class="form-grid">
            <label class="field"><span class="field__label">Name *</span><input name="name" type="text" autocomplete="name" placeholder="Jordan Alvarez" required aria-describedby="err-name"><span class="field__err" id="err-name" role="alert"></span></label>
            <label class="field"><span class="field__label">Email *</span><input name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@yourshow.com" required aria-describedby="err-email"><span class="field__err" id="err-email" role="alert"></span></label>
            <label class="field"><span class="field__label">Company / show name</span><input name="company" type="text" autocomplete="organization" placeholder="Collector Con"></label>
            <label class="field"><span class="field__label">Phone</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(555) 018-2245"></label>
          </div>
          <fieldset class="field" style="gap:10px">
            <legend class="field__label" style="margin-bottom:10px">What do you need? *</legend>
            <div class="need-chips">
              <label class="need-chip" style="--c:var(--coral)"><input type="radio" name="need" value="Sponsorship"><span>Sponsorship</span></label>
              <label class="need-chip" style="--c:var(--pink)"><input type="radio" name="need" value="Design"><span>Design</span></label>
              <label class="need-chip" style="--c:var(--teal)"><input type="radio" name="need" value="Tech"><span>Tech</span></label>
            </div>
            <span class="field__err" id="err-need" role="alert"></span>
          </fieldset>
          <div class="form-grid">
            <label class="field"><span class="field__label">Budget range</span><select name="budget"><option>Not sure yet</option><option>Under $5k</option><option>$5k – $15k</option><option>$15k – $50k</option><option>$50k+</option></select></label>
            <label class="field"><span class="field__label">How did you hear about us?</span><select name="hear"><option>At a show</option><option>Instagram</option><option>A promoter referred us</option><option>Search</option><option>Somewhere else</option></select></label>
          </div>
          <label class="field"><span class="field__label">Message *</span><textarea name="message" rows="5" placeholder="Show dates, expected attendance, what you're trying to solve…" required aria-describedby="err-message"></textarea><span class="field__err" id="err-message" role="alert"></span></label>
          <label class="hp" aria-hidden="true">Leave this empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>
          <div class="form__submit-row">
            <button type="submit" class="form__submit holo-cta">Send it over</button>
            <span class="form__note">No decks, no spam. Just a reply.</span>
          </div>
        </form>
      </div>
      <div class="contact-side" data-reveal>
        <div class="next-card">
          <h2>What happens next</h2>
          <ol class="next-list">
            <li><span class="n" style="background:var(--coral-t);color:var(--coral-d)">1</span><span>We read it properly — a person, not a form router.</span></li>
            <li><span class="n" style="background:var(--teal-t);color:var(--teal-d)">2</span><span>A 30-minute call to hear about the show and the room.</span></li>
            <li><span class="n" style="background:var(--pink-t);color:var(--pink-d)">3</span><span>A short plan: who we'd approach, what we'd build, what it costs.</span></li>
          </ol>
        </div>
        <div class="direct-card">
          <h2>Or reach us directly</h2>
          <p><a href="mailto:${SITE.email}">${SITE.email}</a><br>@kllctbls on Instagram<br>Based in the U.S. · shows nationwide</p>
        </div>
      </div>
    </div>
  </div>
</section>

${ctaBand('Keep the iconic brands coming back', 'See sponsorship', '/sponsorship/', false)}`,
});

// 404
pages.push({
  file: '404.html', path: '/404.html', current: '', noindex: true,
  title: 'Page Not Found | kllctbls',
  description: 'This exhibit was never printed. Head back to the kllctbls home page or browse our portfolio.',
  ld: [orgLd],
  body: `<section style="position:relative;overflow:hidden;padding:clamp(50px,7vw,120px) var(--gutter) clamp(60px,8vw,130px)">
  <div class="nf-grid">
    <div style="display:grid;place-items:center">
      <div class="nf-card" data-card3d data-misprint style="--base:-3deg" aria-hidden="true">
        <div class="nf-card__in">
          <div style="height:5px;background:linear-gradient(90deg,#EE1F7B,#8B5CF6,#2FBFB4)"></div>
          <div class="g-tile__top" style="padding:16px 18px 12px"><span class="label-xs" style="font-size:12px;letter-spacing:.14em">No. 404</span><span class="pill-dark" style="font-size:12px;letter-spacing:.08em;padding:5px 10px">Misprint · 1 of 1</span></div>
          <div class="nf-card__art">
            <div style="position:absolute;inset:14px 6px 2px 22px;border:2px dashed rgba(109,59,214,0.35);border-radius:8px"></div>
            <div class="misprint"><span class="m1" data-mis="-1" style="transform:translate(-6px,3px)">404</span><span class="m2" data-mis="1" style="transform:translate(6px,-3px)">404</span><span class="m3">404</span></div>
            <span style="position:absolute;left:12px;bottom:10px" class="label-xs">Off-centre · ink shift</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;padding:16px 18px 18px">
            <span style="font-family:var(--f-display);font-weight:800;font-size:22px;line-height:1.15">Page Not Found</span>
            <div style="padding-top:12px;border-top:1px solid var(--line-2);display:flex;align-items:baseline;justify-content:space-between;gap:10px"><span class="label-xs" style="font-size:12px">Print run</span><span style="font-family:var(--f-display);font-weight:900;font-size:22px;color:var(--violet-d)">0</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="nf-copy">
      <span class="eyebrow eyebrow--sm">✦ Error 404 ✦</span>
      <h1>This exhibit was never printed.</h1>
      <p>Misprints are the rarest pull in any set, and you just found ours. The page you were after isn't on the floor, though.</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <a href="/" class="btn btn--dark">Back to the floor</a>
        <a href="/portfolio/" class="btn btn--ghost">See the portfolio</a>
      </div>
      <span class="label-xs" style="font-size:13px;color:var(--ink-62)">Pulled <span data-pull-date></span> · Serial <span data-serial></span></span>
    </div>
  </div>
</section>`,
});

// ───────────────────────────── Write ─────────────────────────────
for (const p of pages) {
  const out = join(OUT, p.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(p));
}

const indexable = pages.filter((p) => !p.noindex);
const prio = (path) => (path === '/' ? '1.0' : Object.values(PILLARS).some((x) => x.path === path) ? '0.9' : path === '/contact/' ? '0.8' : '0.7');
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${indexable.map((p) => `  <url>
    <loc>${abs(p.path)}</loc>
    <lastmod>${SITE.lastmod}</lastmod>
    <priority>${prio(p.path)}</priority>${p.path === '/' ? `
    <image:image><image:loc>${abs(SITE.ogImage)}</image:loc></image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`);

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`);

writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
  name: 'kllctbls', short_name: 'kllctbls', description: 'Sponsorship, design and tech for sports card shows.',
  start_url: '/', display: 'standalone', background_color: '#FEF9FF', theme_color: SITE.themeColor,
  icons: [
    { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

console.log(`Built ${pages.length} pages → ${OUT}`);
