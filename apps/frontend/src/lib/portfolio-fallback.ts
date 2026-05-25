import type { Experience, Project, Skill } from '@portfolio/shared';

export const fallbackProjects: Project[] = [
  {
    id: 'fallback-room',
    title: 'Interactive Portfolio Room',
    slug: 'interactive-portfolio-room',
    description:
      'A cozy explorable portfolio where visitors discover projects, skills, and contact options through room interactions.',
    architecture:
      'The app separates the 3D scene, interaction registry, overlay UI, API client, and backend data model so creative features do not collapse into one large component.',
    challenges: [
      'Keeping the 3D scene lightweight enough for mobile.',
      'Providing a traditional recruiter path without losing the playful concept.',
      'Showing technical reasoning inside the product instead of only in documentation.',
    ],
    stack: ['Next.js', 'React Three Fiber', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
    stackReasoning:
      'This stack demonstrates frontend architecture, 3D rendering, REST API usage, relational persistence, and containerized deployment in one cohesive project.',
    githubUrl: 'https://github.com/your-user/interactive-portfolio-room',
    liveUrl: 'https://your-portfolio.example.com',
    thumbnail: '/assets/gifs/project-room-placeholder.gif',
    gifDemo: '/assets/gifs/project-room-placeholder.gif',
    featured: true,
    media: [],
  },
  {
    id: 'fallback-recruiter',
    title: 'Recruiter Mode Dashboard',
    slug: 'recruiter-mode-dashboard',
    description:
      'A fast, scannable route for reviewers who need evidence, links, resume access, and contact details immediately.',
    architecture:
      'Recruiter mode reuses the same typed API data as the room but renders it as a direct professional summary.',
    challenges: [
      'Avoiding duplicated content between the room and the recruiter route.',
      'Preserving fast navigation while keeping the interface cohesive.',
    ],
    stack: ['Next.js App Router', 'TypeScript', 'Zustand', 'Framer Motion'],
    stackReasoning:
      'Routing proves traditional app structure, while shared state and motion keep the transition between playful and professional modes smooth.',
    githubUrl: 'https://github.com/your-user/interactive-portfolio-room',
    liveUrl: 'https://your-portfolio.example.com/recruiter',
    thumbnail: '/assets/gifs/recruiter-mode-placeholder.gif',
    gifDemo: '/assets/gifs/recruiter-mode-placeholder.gif',
    featured: true,
    media: [],
  },
];

export const fallbackSkills: Skill[] = [
  {
    id: 'skill-next',
    name: 'React + Next.js',
    category: 'Frontend',
    icon: 'Layout',
    level: 4,
    reasoning:
      'Selected for component modularity, routing, SSR/build support, and compatibility with React Three Fiber.',
    appliedIn: ['Room overlays', 'Recruiter route', 'Project views'],
  },
  {
    id: 'skill-r3f',
    name: 'React Three Fiber',
    category: '3D',
    icon: 'Box',
    level: 3,
    reasoning:
      'Used so the 3D room can share React state, Suspense boundaries, and component composition with the rest of the app.',
    appliedIn: ['Room scene', 'Object prompts', 'Camera framing'],
  },
  {
    id: 'skill-prisma',
    name: 'Prisma + PostgreSQL',
    category: 'Backend',
    icon: 'Database',
    level: 3,
    reasoning:
      'Chosen to demonstrate relational design, migrations, typed data access, and meaningful persistence.',
    appliedIn: ['Projects API', 'Contact messages', 'Visit analytics'],
  },
  {
    id: 'skill-docker',
    name: 'Docker Compose',
    category: 'DevOps',
    icon: 'Container',
    level: 3,
    reasoning:
      'Containerizes frontend, backend, and database so reviewers can run the full stack consistently.',
    appliedIn: ['Local infrastructure', 'Backend deployment', 'Database setup'],
  },
];

export const fallbackExperiences: Experience[] = [
  {
    id: 'experience-portfolio',
    company: 'Portfolio Lab',
    role: 'Full-Stack Developer',
    description:
      'Designed a portfolio as a real product: interactive frontend, REST API, relational schema, Docker setup, and architecture documentation.',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: null,
    technologies: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
  },
];

export const aboutProfile = {
  name: 'Developer Portfolio',
  summary:
    'A junior full-stack developer focused on practical architecture, thoughtful UI, and production-oriented habits.',
  direction:
    'The goal is to join a team where frontend craft, backend reliability, and clear technical reasoning matter.',
  contact: 'Replace this with your email, LinkedIn, GitHub, Discord, and Calendly before publishing.',
};

export const knowledgeNotes = [
  {
    title: 'State Architecture',
    body: 'Small global state is used for room position, overlays, settings, and recruiter mode. API data remains local to screens so loading and error states stay visible.',
  },
  {
    title: 'REST API Usage',
    body: 'Projects, skills, experience, contact messages, visits, and dialogue logs are modeled as REST resources to demonstrate async handling and validation.',
  },
  {
    title: 'Performance Thinking',
    body: 'The room uses simple geometry, lazy UI, controlled shadows, and explicit loading screens so the creative concept does not overpower usability.',
  },
];

export const futureIdeas = [
  'Pokemon-style recruiter battle with technical questions.',
  'Admin dashboard for editing projects and screenshots.',
  'Analytics dashboard for recruiter behavior.',
  'Compressed custom 3D assets, audio loops, and polished animations.',
];
