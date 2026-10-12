export const profile = {
  name: 'Alwyn Victor Tablatin',
  shortName: 'Alwyn Tablatin',
  initials: 'AT',
  title: 'Senior Full-Stack AI Engineer',
  tagline: 'LLM applications · TypeScript, React/Next.js, Node.js, Python',
  email: 'alwyn.tablatin@gmail.com',
  github: 'https://github.com/VictorAlwyn',
  githubHandle: 'VictorAlwyn',
  location: 'Philippines',
  // Set to a path under /public (for example '/portrait.webp') and the cover crest and structured data pick it up.
  portrait: undefined as string | undefined,
  description:
    'Alwyn Victor Tablatin is a Senior Full-Stack AI Engineer with 8+ years of experience building LLM workflows, AI agents, voice agents and production web and mobile apps with TypeScript, React/Next.js, Node.js and Python.',
  // Written as self-contained facts so search engines and AI assistants can quote it accurately.
  bio: [
    'Alwyn Victor Tablatin is a Senior Full-Stack AI Engineer based in the Philippines with 8+ years of experience building and shipping production web and mobile applications for companies in the United States, Canada and the United Kingdom.',
    'Since 2024, Alwyn has focused on AI-powered products: LLM workflows, AI agents, voice agents and serverless AI processing for healthcare and SaaS platforms.',
    'Alwyn works across the stack with TypeScript, React/Next.js, React Native, Node.js, Python and AWS, with hands-on experience in real-time systems, SOC 2 security work, CI/CD and automated testing, and owns features end to end, from design to deployment.',
  ],
};

export type SkillGroup = { name: string; icon: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    name: 'AI & LLM',
    icon: '✦',
    items: ['LLM Integration', 'Generative AI', 'Prompt Engineering', 'AI Agents', 'Agentic Workflows', 'LangChain', 'LangGraph', 'Voice AI Agents (LiveKit)', 'Human-in-the-Loop Review', 'Stable Diffusion', 'RunPod Serverless GPU'],
  },
  { name: 'Languages', icon: '⌘', items: ['TypeScript', 'JavaScript', 'Python', 'PHP', 'SQL', 'HTML5', 'CSS/Sass'] },
  {
    name: 'Frontend & Mobile',
    icon: '◈',
    items: ['React.js', 'Next.js', 'React Native', 'Expo', 'Three.js', 'React Three Fiber', 'MobX', 'Responsive Design'],
  },
  {
    name: 'Backend & APIs',
    icon: '⬢',
    items: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'GraphQL (Apollo)', 'Laravel', 'CodeIgniter', 'Event-Driven Architecture', 'Real-Time Systems', 'Queues & Background Jobs'],
  },
  { name: 'Cloud & DevOps', icon: '☁', items: ['AWS', 'Serverless (AWS SST)', 'Cloudflare Workers', 'Fly.io', 'CI/CD', 'GitHub Actions'] },
  { name: 'Databases', icon: '▤', items: ['PostgreSQL', 'MySQL', 'DynamoDB'] },
  {
    name: 'Security & Auth',
    icon: '⛨',
    items: ['OAuth 2.0', 'Single Sign-On (SSO)', 'Passkeys (WebAuthn)', 'Session Management', 'SOC 2 Compliance', 'Multi-Tenant Architecture'],
  },
  { name: 'Testing & Quality', icon: '✓', items: ['Playwright', 'Jest', 'React Testing Library', 'End-to-End Testing', 'Code Reviews'] },
  { name: 'Other', icon: '✚', items: ['Shopify', 'Contentful', 'Retool', 'Agora', 'Git', 'Agile/Scrum'] },
];

export type Role = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  quest?: string;
};

export const experience: Role[] = [
  {
    role: 'Full-Stack AI Product Engineer',
    company: 'DocAssistant.ai',
    location: 'Remote (United States)',
    start: 'Aug 2025',
    end: 'Present',
    quest: 'docassistant-ai',
    bullets: [
      'Build and ship features across the web app, React Native mobile app, backend API and serverless AI processing pipeline for a clinical documentation platform used by healthcare providers.',
      'Migrated the platform to a real-time, event-driven architecture across web and mobile, so AI-generated clinical content appears as soon as it is ready.',
      'Extended the LLM documentation pipeline with new content types and dependency-aware regeneration, so content is generated only when needed and updates automatically when source data changes, reducing unnecessary LLM calls.',
      'Built an LLM automation workflow that converts engineering changes into user-facing release notes, with configurable prompts and a human-in-the-loop review step.',
      'Delivered SOC 2 security work: abuse protection, hardened session management, single sign-on (SSO) and passwordless passkey (WebAuthn) authentication.',
      'Built multi-tenant collaboration features: organization management, secure content sharing, real-time messaging and shared templates.',
      'Built clinical decision-support tools using a reusable, extensible component architecture with automated test coverage.',
      'Built cross-platform product analytics and internal admin dashboards to support data-driven product decisions.',
      'Improved mobile reliability and App Store/Google Play compliance: fixed iOS and Android crashes, made audio uploads more resilient, and built media capture, export and sharing.',
    ],
  },
  {
    role: 'Full-Stack AI Product Engineer',
    company: 'Olivia AI',
    location: 'Remote (Vancouver, Canada)',
    start: 'Jun 2024',
    end: 'Jul 2025',
    quest: 'olivia-ai',
    bullets: [
      'Built an AI-powered SaaS application from scratch, including the dashboard, LLM features and backend services.',
      'Developed a real-time voice AI agent and real-time collaboration for canvas workflows using LiveKit.',
      'Built queue-based background job processing to run and optimize AI agent workloads.',
      'Implemented OAuth authentication and file integrations with Google, Dropbox and Microsoft OneDrive, plus real-time notifications.',
      'Created CI/CD pipelines with GitHub Actions deploying to Fly.io and RunPod serverless GPU infrastructure.',
      'Deployed edge services on Cloudflare Workers to improve global performance.',
      'Set up the end-to-end testing framework with Playwright.',
    ],
  },
  {
    role: 'Senior Software Engineer (Part-Time Contract)',
    company: 'Powered By Propeller',
    location: 'Remote (United Kingdom)',
    start: 'Nov 2024',
    end: 'Jun 2025',
    bullets: [
      'Led code reviews for maintainability and scalability across three client platforms: Visible Voice (disability-inclusive fashion and media), Scouty (film and photo location rentals in London) and Togather (events marketplace with thousands of suppliers and venues).',
      'Worked directly with the project manager and clients to align technical scope with business goals.',
    ],
  },
  {
    role: 'Senior Frontend Engineer (Part-Time Contract)',
    company: 'Contact',
    location: 'Remote (United Kingdom)',
    start: 'Oct 2023',
    end: 'Nov 2024',
    bullets: [
      'Led code reviews and mentored junior engineers building features for the Contact platform.',
      'Planned sprint scope and deliverables with the project manager.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Kroma Entertainment',
    location: 'Mandaluyong City, Philippines',
    start: 'Apr 2023',
    end: 'Jun 2024',
    quest: 'pie-channel',
    bullets: [
      'Developed and deployed serverless applications on AWS using SST (Serverless Stack), building scalable, cost-effective and highly available services.',
      "Built platforms for Nyma Talent Management and Pie Channel, the Philippines' first interactive entertainment channel, where viewers participate and win prizes.",
      'Maintained code quality with unit and integration tests and code reviews, and mentored junior engineers.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Moment (via Offshorly)',
    location: 'Remote (Los Angeles, United States)',
    start: 'May 2021',
    end: 'May 2023',
    quest: 'moment-world',
    bullets: [
      'Built live streaming with Agora for real-time broadcasts and video-on-demand (VOD) recording on the Moment House ticketed live-event platform.',
      'Built "World", a 3D gamified live streaming experience, using Three.js.',
      'Developed direct-message and group chat, plus moderation tools for chat and forums.',
      'Ran stress tests and resolved performance bottlenecks ahead of high-traffic live events.',
      'Converted Figma designs into production React.js components and built a Retool app to streamline internal operations.',
    ],
  },
  {
    role: 'Full-Stack Engineer',
    company: 'Activ Ltd.',
    location: 'Remote (United Kingdom)',
    start: 'Feb 2019',
    end: 'Dec 2020',
    quest: 'activ-v3',
    bullets: [
      'Built Activ v3, a drag-and-drop website builder for clients.',
      'Delivered brochure and e-commerce websites with custom features, payment gateway and third-party API integrations.',
      'Built internal tools for employee and franchisee management and a Telegram chatbot.',
    ],
  },
  {
    role: 'Full-Stack Engineer (Contract)',
    company: 'SKYCRU',
    location: 'Remote (United States)',
    start: 'Jul 2020',
    end: 'Oct 2020',
    quest: 'skycru-portal',
    bullets: [
      'Built a web portal from scratch with React.js, TypeScript, Apollo GraphQL, Node.js, Express.js, Knex.js and MySQL, including role-based access control and MobX state management.',
    ],
  },
  {
    role: 'Full-Stack Engineer (Contract)',
    company: 'Fitslanguage',
    location: 'Camarines Norte, Philippines',
    start: 'Nov 2019',
    end: 'Apr 2021',
    bullets: ['Maintained and modernized a legacy web application, improving layout usability, performance and scalability.'],
  },
  {
    role: 'Back-End Engineer',
    company: '24Task',
    location: 'Daet, Camarines Norte, Philippines',
    start: 'Aug 2018',
    end: 'Feb 2019',
    bullets: ['Built backend systems with PHP (CakePHP) and MySQL, frontends with Angular and TypeScript, and mobile apps with Flutter and Dart.'],
  },
  {
    role: 'Laboratory Head and IT/CS Instructor',
    company: 'Our Lady of Lourdes College Foundation',
    location: 'Philippines',
    start: 'Jun 2017',
    end: 'Apr 2018',
    bullets: ['Taught web, mobile and Arduino programming to BSIT/BSCS students and helped develop the IT/CS curriculum.'],
  },
];

export const education = {
  degree: 'Bachelor of Science in Information Technology',
  school: 'Our Lady of Lourdes College Foundation',
  location: 'Daet, Camarines Norte, Philippines',
  years: '2013 – 2017',
};

export type Project = {
  slug: string;
  title: string;
  company: string;
  role: string;
  period: string;
  type: 'Main quest' | 'Side quest';
  glyph: string;
  hue: number;
  summary: string;
  brief: string;
  built: string[];
  stack: string[];
  image?: string;
  url?: string;
};

// Add `image` (path under /public) or `url` to any project and the cards and quest pages pick it up.
export const projects: Project[] = [
  {
    slug: 'docassistant-ai',
    title: 'DocAssistant.ai: AI clinical documentation',
    company: 'DocAssistant.ai',
    role: 'Full-Stack AI Product Engineer',
    period: 'Aug 2025 – Present',
    type: 'Main quest',
    glyph: 'DA',
    hue: 190,
    summary: 'Real-time, event-driven LLM pipeline that writes clinical documentation for healthcare providers across web and mobile.',
    brief:
      'DocAssistant.ai is a clinical documentation platform used by healthcare providers. Alwyn works across the web app, the React Native mobile app, the backend API and the serverless AI processing pipeline, with a focus on getting AI-generated content to clinicians quickly and securely.',
    built: [
      'Migrated the platform to a real-time, event-driven architecture across web and mobile, so AI-generated clinical content appears as soon as it is ready.',
      'Extended the LLM documentation pipeline with new content types and dependency-aware regeneration: content is generated only when needed and updates automatically when source data changes, reducing unnecessary LLM calls.',
      'Built an LLM automation workflow that turns engineering changes into user-facing release notes, with configurable prompts and a human-in-the-loop review step.',
      'Delivered SOC 2 security work: abuse protection, hardened session management, single sign-on (SSO) and passwordless passkey (WebAuthn) authentication.',
      'Built multi-tenant collaboration: organization management, secure content sharing, real-time messaging and shared templates.',
      'Built clinical decision-support tools on a reusable, extensible component architecture with automated test coverage.',
      'Improved mobile reliability and App Store/Google Play compliance, made audio uploads more resilient, and built media capture, export and sharing.',
    ],
    stack: ['LLMs', 'React Native', 'Serverless AI Pipeline', 'Event-Driven Architecture', 'Real-Time', 'SSO', 'Passkeys (WebAuthn)', 'SOC 2', 'Multi-Tenant'],
  },
  {
    slug: 'olivia-ai',
    title: 'Olivia AI: voice agents and AI SaaS',
    company: 'Olivia AI',
    role: 'Full-Stack AI Product Engineer',
    period: 'Jun 2024 – Jul 2025',
    type: 'Main quest',
    glyph: 'OA',
    hue: 280,
    summary: 'AI SaaS built from scratch with a real-time LiveKit voice agent, collaborative canvas and queue-based agent workloads.',
    brief:
      'Olivia AI is an AI-powered SaaS application that Alwyn built from scratch: the dashboard, the LLM features and the backend services, plus the infrastructure that runs AI agent workloads in production.',
    built: [
      'Built the AI SaaS application from scratch, including the dashboard, LLM features and backend services.',
      'Developed a real-time voice AI agent and real-time collaboration for canvas workflows using LiveKit.',
      'Built queue-based background job processing to run and optimize AI agent workloads.',
      'Implemented OAuth authentication and file integrations with Google, Dropbox and Microsoft OneDrive, plus real-time notifications.',
      'Created CI/CD pipelines with GitHub Actions deploying to Fly.io and RunPod serverless GPU infrastructure.',
      'Deployed edge services on Cloudflare Workers and set up end-to-end testing with Playwright.',
    ],
    stack: ['LLMs', 'AI Agents', 'LiveKit', 'Voice AI', 'Queues', 'OAuth 2.0', 'GitHub Actions', 'Fly.io', 'RunPod', 'Cloudflare Workers', 'Playwright'],
  },
  {
    slug: 'moment-world',
    title: 'Moment "World": 3D gamified live streaming',
    company: 'Moment (via Offshorly)',
    role: 'Software Engineer',
    period: 'May 2021 – May 2023',
    type: 'Main quest',
    glyph: 'MW',
    hue: 330,
    summary: 'A Three.js 3D world for live events on the Moment House ticketed streaming platform, plus Agora live and VOD.',
    brief:
      'Moment House is a ticketed live-event platform (Los Angeles, United States). Alwyn built its live streaming features and "World", a 3D gamified live streaming experience, and kept the platform fast for high-traffic events.',
    built: [
      'Built "World", a 3D gamified live streaming experience, using Three.js.',
      'Built live streaming with Agora for real-time broadcasts and video-on-demand (VOD) recording.',
      'Developed direct-message and group chat, plus moderation tools for chat and forums.',
      'Ran stress tests and resolved performance bottlenecks ahead of high-traffic live events.',
      'Converted Figma designs into production React.js components and built a Retool app to streamline internal operations.',
    ],
    stack: ['Three.js', 'React.js', 'Agora', 'Live Streaming', 'Real-Time Chat', 'Retool', 'Figma'],
  },
  {
    slug: 'pie-channel',
    title: 'Pie Channel: interactive entertainment channel',
    company: 'Kroma Entertainment',
    role: 'Senior Software Engineer',
    period: 'Apr 2023 – Jun 2024',
    type: 'Side quest',
    glyph: 'PC',
    hue: 40,
    summary: "Serverless AWS platforms for the Philippines' first interactive entertainment channel, where viewers participate and win prizes.",
    brief:
      "At Kroma Entertainment, Alwyn built platforms for Pie Channel, the Philippines' first interactive entertainment channel where viewers participate and win prizes, and for Nyma Talent Management, all on serverless AWS.",
    built: [
      'Developed and deployed serverless applications on AWS using SST (Serverless Stack), building scalable, cost-effective and highly available services.',
      'Built the Pie Channel and Nyma Talent Management platforms.',
      'Maintained code quality with unit and integration tests and code reviews, and mentored junior engineers.',
    ],
    stack: ['AWS', 'SST (Serverless Stack)', 'Serverless', 'Unit & Integration Tests', 'Code Reviews'],
  },
  {
    slug: 'activ-v3',
    title: 'Activ v3: drag-and-drop website builder',
    company: 'Activ Ltd.',
    role: 'Full-Stack Engineer',
    period: 'Feb 2019 – Dec 2020',
    type: 'Side quest',
    glyph: 'A3',
    hue: 140,
    summary: 'A drag-and-drop website builder for clients, plus e-commerce sites, payment integrations and internal tools.',
    brief:
      'At Activ Ltd. (United Kingdom), Alwyn built the third version of its drag-and-drop website builder for clients, and delivered client websites and internal tooling.',
    built: [
      'Built Activ v3, a drag-and-drop website builder for clients.',
      'Delivered brochure and e-commerce websites with custom features, payment gateway and third-party API integrations.',
      'Built internal tools for employee and franchisee management and a Telegram chatbot.',
    ],
    stack: ['Drag-and-Drop Builder', 'E-commerce', 'Payment Gateways', 'Third-Party APIs', 'Telegram Chatbot'],
  },
  {
    slug: 'skycru-portal',
    title: 'SKYCRU: role-based web portal',
    company: 'SKYCRU',
    role: 'Full-Stack Engineer (Contract)',
    period: 'Jul 2020 – Oct 2020',
    type: 'Side quest',
    glyph: 'SK',
    hue: 220,
    summary: 'A web portal built from scratch with React, TypeScript and Apollo GraphQL, with role-based access control.',
    brief: 'For SKYCRU (United States), Alwyn built a web portal from scratch as a contract full-stack engineer.',
    built: [
      'Built the web portal from scratch with React.js, TypeScript, Apollo GraphQL, Node.js, Express.js, Knex.js and MySQL.',
      'Implemented role-based access control (RBAC) and MobX state management.',
    ],
    stack: ['React.js', 'TypeScript', 'Apollo GraphQL', 'Node.js', 'Express.js', 'Knex.js', 'MySQL', 'MobX'],
  },
];

export const stats = [
  { value: '8+', label: 'Years of XP' },
  { value: String(experience.length), label: 'Roles cleared' },
  { value: '3', label: 'Realms served', detail: 'US · Canada · UK' },
  { value: '2', label: 'Years in AI' },
];

export const personLd = (site: URL) => ({
  '@type': 'Person',
  '@id': new URL('/#person', site).href,
  name: profile.name,
  alternateName: profile.shortName,
  jobTitle: profile.title,
  description: profile.description,
  url: site.href,
  image: new URL(profile.portrait ?? '/og.png', site).href,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github],
  address: { '@type': 'PostalAddress', addressCountry: 'PH' },
  worksFor: { '@type': 'Organization', name: experience[0].company },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
  knowsAbout: skills.flatMap((g) => g.items),
});
