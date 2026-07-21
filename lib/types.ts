export interface NavLink {
  label: string;
  href: string;
}

export interface Nav {
  brand: string;
  links: NavLink[];
}

export interface Hero {
  title: string;
  role: string;
  tagline: string;
  subtitle: string;
  cta_primary: { label: string; href: string };
  cta_secondary: { label: string; href: string };
  headline_3d: string[];
}

export interface JourneyItem {
  year: string;
  title: string;
  detail: string;
}

export interface About {
  headline: string;
  bio: string[];
  philosophy: string;
  journey: JourneyItem[];
  expertise: string[];
  tools: string[];
  image: string;
}

export interface ServiceItem {
  title: string;
  desc: string;
  icon: string;
  price: string;
  deliverables: string[];
}

export interface Metric {
  label: string;
  value: string;
}

export interface PortfolioItem {
  slug: string;
  title: string;
  category: string;
  client: string;
  challenge: string;
  strategy: string;
  results: { metrics: Metric[] };
  images: string[];
  testimonial: string;
  testimonial_author: string;
  published_date: string;
  read_time: string;
}

export interface BlogItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  published_date: string;
  read_time: string;
  cover: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface Social {
  label: string;
  href: string;
}

export interface Contact {
  email: string;
  phone: string;
  location_primary: string;
  location_secondary: string;
  socials: Social[];
  availability: string;
}

export interface ProcessStep {
  n: string;
  t: string;
  d: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface Beat {
  label: string;
  title: string;
  copy: string;
}

export interface PageHeadings {
  home: {
    reelEyebrow: string;
    reelTitle: string;
    servicesEyebrow: string;
    servicesTitle: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaButton: string;
    scrollText: string;
    seeServicesText: string;
  };
  about: {
    eyebrow: string;
    timelineEyebrow: string;
    expertiseLabel: string;
    toolsLabel: string;
  };
  services: {
    eyebrow: string;
    title: string;
    processEyebrow: string;
    faqEyebrow: string;
    ctaButton: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    freeOfferEyebrow: string;
    freeOfferTitle: string;
    freeOfferDesc: string;
    emailLabel: string;
    phoneLabel: string;
    studiosLabel: string;
    availabilityLabel: string;
  };
}

export interface FooterContent {
  headline: string;
  copyright: string;
  adminLabel: string;
  tagline: string;
}

export interface NavbarContent {
  startProjectLabel: string;
}

export interface ContactFormContent {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  projectLabel: string;
  projectOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
}

export interface MetadataContent {
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface Content {
  metadata: MetadataContent;
  nav: Nav;
  navbar: NavbarContent;
  hero: Hero;
  about: About;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  blog: BlogItem[];
  testimonials: Testimonial[];
  contact: Contact;
  pages: PageHeadings;
  process: ProcessStep[];
  faq: FAQItem[];
  beats: Beat[];
  footer: FooterContent;
  contactForm: ContactFormContent;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  project_type: string;
  created_at: string;
}
