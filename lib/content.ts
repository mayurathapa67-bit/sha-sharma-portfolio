import type { Content } from './types';

export const FALLBACK_CONTENT: Content = {
  metadata: {
    titleTemplate: '%s · Esha Sharma',
    defaultTitle: 'Esha Sharma — Master Wordsmith & Brand Voice Architect',
    description: 'Esha Sharma is a content writer and copywriter in Melbourne & Kathmandu. Brand voice, conversion copy and long-form narrative that sounds like a person, not a template.',
    keywords: ['copywriter', 'content writer', 'brand voice', 'Melbourne copywriter', 'Kathmandu writer', 'conversion copy'],
    ogTitle: 'Esha Sharma — Master Wordsmith & Brand Voice Architect',
    ogDescription: 'Brand voice, conversion copy and long-form narrative that sounds like a person, not a template.',
    ogImage: '/og.svg',
  },
  nav: {
    brand: 'Esha Sharma',
    links: [
      { label: 'Work', href: '/portfolio' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Words', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  navbar: {
    startProjectLabel: 'Start a project',
  },
  hero: {
    title: 'Esha Sharma',
    role: 'Master Wordsmith & Brand Voice Architect',
    tagline: 'I turn quiet brands into ones people quote out loud.',
    subtitle:
      'A Melbourne & Kathmandu copywriter writing brand voice, long-form narrative and conversion copy that sounds like a person — not a template.',
    cta_primary: { label: 'See the work', href: '/portfolio' },
    cta_secondary: { label: 'Book an audit', href: '/contact' },
    headline_3d: ['WORDS', 'THAT', 'STAY'],
  },
  about: {
    headline: 'A writer who treats language like architecture.',
    bio: [
      'I am Esha Sharma, a content writer and copywriter working between Melbourne and Kathmandu. For nine years I have helped founders, editors and brand teams find the sentence that does the heavy lifting.',
      'My work lives at the seam of strategy and story: voice guidelines that survive contact with a real marketing calendar, landing pages that convert without shouting, and long-form pieces people actually finish.',
    ],
    philosophy:
      'Good copy is not decoration. It is the difference between a brand people scroll past and a brand people remember. I write the second kind.',
    journey: [
      { year: '2016', title: 'First byline', detail: 'Staff writer at a Kathmandu lifestyle magazine, learned to file on deadline.' },
      { year: '2019', title: 'Agency years', detail: 'Senior copywriter in Melbourne, shipped voice for fintech and hospitality clients.' },
      { year: '2022', title: 'Independent', detail: 'Founded a studio of one, partnering with brands who care about the words.' },
      { year: '2025', title: 'Voice architect', detail: 'Now embedded as brand voice lead for scale-ups across ANZ and South Asia.' },
    ],
    expertise: ['Brand Voice', 'Conversion Copy', 'Long-form Narrative', 'Editorial Strategy', 'Naming', 'UX Writing'],
    tools: ['Notion', 'Figma', 'Google Docs', 'Grammarly', 'Hemingway', 'Readability'],
    image: '/about.jpg',
  },
  services: [
    { title: 'Brand Voice', desc: 'A voice system your whole team can actually use — tone, rules, and real examples.', icon: 'quill', price: 'From $2,400', deliverables: ['Voice principles', 'Do / Don\'t library', 'Sample rewrites'] },
    { title: 'Conversion Copy', desc: 'Landing pages and funnels written to move people, not just impress them.', icon: 'spark', price: 'From $1,800', deliverables: ['Page strategy', 'Wireframe copy', 'A/B variants'] },
    { title: 'Long-form', desc: 'Essays, articles and brand stories that earn attention and hold it.', icon: 'book', price: 'From $900', deliverables: ['Outline', 'Draft', 'Edit pass'] },
  ],
  portfolio: [
    {
      slug: 'lumen-fintech-voice',
      title: 'Giving a fintech a human pulse',
      category: 'Brand Voice',
      client: 'Lumen Money',
      challenge: 'Lumen\'s app was clever but cold. Support tickets showed users trusted the maths, not the brand.',
      strategy: 'We built a warm, plain-spoken voice and rewrote every onboarding moment around one promise: money without the mystery.',
      results: { metrics: [{ label: 'Support tickets down', value: '31%' }, { label: 'Activation up', value: '18%' }, { label: 'NPS', value: '+22' }] },
      images: ['/work/lumen-1.jpg', '/work/lumen-2.jpg'],
      testimonial: 'Esha gave us a voice we could finally stand behind.',
      testimonial_author: 'Priya Nair, Founder, Lumen Money',
      published_date: '2025-03-12',
      read_time: '6 min',
    },
    {
      slug: 'marigold-hospitality',
      title: 'A menu that makes you hungry',
      category: 'Conversion Copy',
      client: 'Marigold & Co.',
      challenge: 'A beautiful restaurant with a website that read like a spreadsheet.',
      strategy: 'Rewrote the menu and booking flow as a small story — sensory, specific, a little cheeky.',
      results: { metrics: [{ label: 'Online bookings', value: '+47%' }, { label: 'Avg. order', value: '+$14' }] },
      images: ['/work/marigold-1.jpg', '/work/marigold-2.jpg'],
      testimonial: 'Our tables filled up before we changed a single recipe.',
      testimonial_author: 'Tom Reilly, Owner, Marigold & Co.',
      published_date: '2025-01-20',
      read_time: '4 min',
    },
    {
      slug: 'kathmandu-trail-journal',
      title: 'A journal worth the climb',
      category: 'Long-form',
      client: 'Himalaya Trails',
      challenge: 'A travel brand with stunning photos and forgettable words.',
      strategy: 'A six-part editorial series written like letters home, not brochures.',
      results: { metrics: [{ label: 'Read-through', value: '72%' }, { label: 'Shares', value: '3.1x' }] },
      images: ['/work/trail-1.jpg', '/work/trail-2.jpg'],
      testimonial: 'People emailed us to say they cried. That is the point.',
      testimonial_author: 'Anjali Sherpa, Marketing Lead, Himalaya Trails',
      published_date: '2024-11-02',
      read_time: '9 min',
    },
  ],
  blog: [
    {
      slug: 'why-brand-voice-dies',
      title: 'Why your brand voice dies in the second sprint',
      category: 'Strategy',
      excerpt: 'A voice document is not a spell. It is a habit. Here is how to make it stick.',
      body: [
        'Every brand starts with a voice doc. Most of them are dead within two months.',
        'The reason is simple: the document is treated as a deliverable, not a discipline. The wordsmith leaves, the new hire guesses, and the tone drifts back to safe and forgettable.',
        'Make the voice a checklist in the pull request, not a PDF on a shelf.',
      ],
      published_date: '2025-04-10',
      read_time: '5 min',
      cover: '/blog/voice.jpg',
    },
    {
      slug: 'the-sentence-that-sells',
      title: 'The one sentence that does the selling',
      category: 'Conversion',
      excerpt: 'You do not need more copy. You need one sentence that earns the rest.',
      body: [
        'Most landing pages fail in the first line. Not the headline — the promise underneath it.',
        'Find the sentence a reader would say to a friend. Then build the page around it.',
      ],
      published_date: '2025-02-28',
      read_time: '3 min',
      cover: '/blog/sentence.jpg',
    },
  ],
  testimonials: [
    { quote: 'Esha writes the sentence the whole team wishes they had said.', author: 'Priya Nair', role: 'Founder, Lumen Money' },
    { quote: 'Our bookings doubled and the words finally felt like us.', author: 'Tom Reilly', role: 'Owner, Marigold & Co.' },
    { quote: 'She made a trail journal people actually finished reading.', author: 'Anjali Sherpa', role: 'Marketing Lead, Himalaya Trails' },
  ],
  contact: {
    email: 'esha.australia01@gmail.com',
    phone: '+61 482 075 788',
    location_primary: 'Melbourne, Australia',
    location_secondary: 'Kathmandu, Nepal',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/eshasharma' },
      { label: 'Instagram', href: 'https://instagram.com/esha.writes' },
      { label: 'Email', href: 'mailto:esha.australia01@gmail.com' },
    ],
    availability: 'Booking projects for Q3 2026',
  },
  pages: {
    home: {
      reelEyebrow: '01 — Selected studio reel',
      reelTitle: 'Words, revealed the way they should be read — slowly, and then all at once.',
      servicesEyebrow: '02 — What I make',
      servicesTitle: 'Three ways I help brands sound like themselves.',
      ctaEyebrow: 'The next sentence is yours',
      ctaTitle: 'Tell me about the brand you\'re building. I\'ll tell you what it should say.',
      ctaButton: 'Start a project →',
      scrollText: 'SCROLL',
      seeServicesText: 'See full services & pricing →',
    },
    about: {
      eyebrow: 'About — the person behind the words',
      timelineEyebrow: 'Timeline — how the words found me',
      expertiseLabel: 'Expertise',
      toolsLabel: 'Tools I trust',
    },
    services: {
      eyebrow: '03 — Services & pricing',
      title: 'Considered words, priced like the investment they are.',
      processEyebrow: 'The process — four beats',
      faqEyebrow: 'Questions, answered',
      ctaButton: 'Book a voice audit →',
    },
    contact: {
      eyebrow: '05 — Let\'s talk',
      title: 'Tell me what you\'re building. I\'ll tell you what it should say.',
      freeOfferEyebrow: 'Free offer',
      freeOfferTitle: 'Brand Voice Audit',
      freeOfferDesc: 'Send a note and I\'ll review three pages of your current copy — free, no strings — and tell you the one sentence worth changing first.',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      studiosLabel: 'Studios',
      availabilityLabel: 'Availability',
    },
  },
  process: [
    { n: '01', t: 'Listen', d: 'We map the brand, the audience and the gap between them.' },
    { n: '02', t: 'Shape', d: 'I draft voice principles and the first real sentences.' },
    { n: '03', t: 'Refine', d: 'Tight edits until every word earns its place.' },
    { n: '04', t: 'Ship', d: 'You get copy your whole team can use with confidence.' },
  ],
  faq: [
    { q: 'How do we start?', a: 'Book a free Brand Voice Audit. I\'ll read your current words and tell you what\'s working and what\'s quietly costing you trust.' },
    { q: 'Do you work with agencies?', a: 'Yes — often as the embedded wordsmith behind an agency\'s brand work, under NDA.' },
    { q: 'What\'s your turnaround?', a: 'Most projects land in 1–3 weeks. Voice systems take longer; single landing pages, faster.' },
  ],
  beats: [
    { label: '01', title: 'The Idea', copy: 'Every project begins as a single, stubborn thought. We find the one worth keeping.' },
    { label: '02', title: 'The Words', copy: 'Then we shape it — voice, rhythm, restraint. Sentences that carry weight without raising their voice.' },
    { label: '03', title: 'The Impact', copy: 'And it lands. Readers lean in, remember, and repeat it to someone they trust.' },
  ],
  footer: {
    headline: 'Let\'s write something worth reading',
    copyright: '© {year} Esha Sharma. Words with intent.',
    adminLabel: 'Admin',
    tagline: 'Made between two cities, with care.',
  },
  contactForm: {
    nameLabel: 'Your name',
    namePlaceholder: 'Jane Appleseed',
    emailLabel: 'Email',
    emailPlaceholder: 'jane@brand.com',
    projectLabel: 'What do you need?',
    projectOptions: ['Brand Voice', 'Conversion Copy', 'Long-form', 'Not sure yet'],
    messageLabel: 'Tell me about it',
    messagePlaceholder: 'The brand, the audience, the sentence you wish you had…',
    sendButton: 'Send it →',
    sendingButton: 'Sending…',
    successMessage: 'Thank you — I\'ll reply within two days.',
  },
};

async function loadFromGitHub(): Promise<Content | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? 'main';
  if (!token || !repo) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Cache-Control': 'no-store',
        },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(decoded) as Content;
  } catch {
    return null;
  }
}

export async function getContent(): Promise<Content> {
  const remote = await loadFromGitHub();
  if (remote) return remote;
  try {
    const local = await import('../content.json');
    return local.default as Content;
  } catch {
    return FALLBACK_CONTENT;
  }
}

export async function saveContent(content: Content): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? 'main';
  if (!token || !repo) return false;
  try {
    const getRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/content.json?ref=${branch}`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
        cache: 'no-store',
      }
    );
    const getJson = (await getRes.json()) as { sha?: string };
    const body = {
      message: 'Update content.json from admin',
      content: Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64'),
      branch,
      ...(getJson.sha ? { sha: getJson.sha } : {}),
    };
    const putRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/content.json`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );
    return putRes.ok;
  } catch {
    return false;
  }
}
