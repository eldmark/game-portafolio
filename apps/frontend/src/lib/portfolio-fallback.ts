import type { DevlogEntry, Experience, Goal, Post, Project, Skill, Trophy } from '@portfolio/shared';

export const fallbackProjects: Project[] = [
  {
    id: 'bodegas-ecommerce-platform',
    title: 'Bodegas E-Commerce Platform',
    slug: 'bodegas-ecommerce-platform',
    description:
      'Full-stack enterprise e-commerce platform with inventory management, order processing, and promotions engine.',
    architecture: 'Vue SPA + Express REST API + PostgreSQL + Prisma + Cloudflare R2 image storage.',
    challenges: [
      'Enterprise inventory management',
      'Background jobs for reservation expiration',
      'Inventory consistency',
      'CI/CD workflows with GitHub Actions',
    ],
    stack: [
      'Vue 3',
      'TypeScript',
      'Express',
      'PostgreSQL',
      'Prisma',
      'Clerk',
      'Cloudflare R2',
      'Docker',
    ],
    stackReasoning:
      'Chosen for enterprise scalability: Clerk for auth, Cloudflare R2 for media, and Prisma for relational consistency.',
    githubUrl: null,
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/bodegasdelicores.webm',
    featured: true,
    media: [],
  },
  {
    id: 'barber-shop-management-system',
    title: 'Barber Shop Management System',
    slug: 'barber-shop-management-system',
    description:
      'Advanced full-stack management system for barber shops, featuring reservations, billing, and analytics.',
    architecture: 'React SPA + Bun ElysiaJS API + PostgreSQL + Prisma.',
    challenges: [
      'Reservation workflow optimization',
      'Advanced SQL reporting with CTEs',
      'Database triggers and stored procedures',
      'Analytics dashboard implementation',
    ],
    stack: ['React', 'TypeScript', 'Bun', 'ElysiaJS', 'PostgreSQL', 'Prisma', 'Docker'],
    stackReasoning:
      'Leverages Bun and ElysiaJS for high-performance API, and PostgreSQL features for complex business logic.',
    githubUrl: 'https://github.com/eldmark/db_barbershop.git',
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/barbershop.webm',
    featured: true,
    media: [],
  },
  {
    id: 'enterprise-backend-nda',
    title: 'Enterprise Backend (Private NDA Project)',
    slug: 'enterprise-backend-nda',
    description:
      'Secure enterprise-grade backend service focused on authentication and authorization.',
    architecture: 'Node.js + TypeScript + PostgreSQL with multi-layer middleware architecture.',
    challenges: [
      'OAuth2 and JWT integration',
      'Refresh token implementation',
      'RBAC authorization middleware',
      'Secure API design patterns',
    ],
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'JWT', 'OAuth2'],
    stackReasoning:
      'Focused on industry-standard security protocols and production-ready backend patterns.',
    githubUrl: null,
    liveUrl: null,
    thumbnail: null,
    gifDemo: null,
    featured: true,
    media: [],
  },
  {
    id: 'equa-notepad',
    title: 'Equa Notepad',
    slug: 'equa-notepad',
    description:
      'Android application for organizing mathematical formulas and notes with cloud synchronization and AI-assisted exercises.',
    architecture:
      'Modern Android architecture using Jetpack Compose, ViewModels, Room, Supabase backend services, and Google Authentication.',
    challenges: [
      'Offline synchronization',
      'Realtime updates',
      'Authentication integration',
      'AI API integration',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'Supabase', 'Room', 'Google Identity'],
    stackReasoning:
      'Compose and Supabase were selected for modern mobile architecture and simplified cloud integration.',
    githubUrl: 'https://github.com/angcoder-c/equa-notepad-plats',
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/equa-notepad-plats.mp4',
    featured: false,
    media: [],
  },
  {
    id: 'food-recommendation-platform',
    title: 'Food Recommendation Platform',
    slug: 'food-recommendation-platform',
    description: 'Graph-based recommendation system for food and recipes.',
    architecture: 'Next.js + TypeScript + Neo4j + Cypher.',
    challenges: [
      'Collaborative filtering implementation',
      'Recommendation engine optimization',
      'Graph database modeling',
    ],
    stack: ['Next.js', 'TypeScript', 'Neo4j', 'Cypher'],
    stackReasoning: 'Neo4j is ideal for modeling complex relationships in recommendation systems.',
    githubUrl: 'https://github.com/angcoder-c/food-recommendations-p2.git',
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/food-recomendation.webm',
    featured: false,
    media: [],
  },
  {
    id: 'trash-detection-api',
    title: 'Trash Detection API',
    slug: 'trash-detection-api',
    description: 'AI-powered waste analysis and heatmap generation platform.',
    architecture: 'Express + TypeScript + Prisma + Turso + Claude Sonnet + Cloudinary.',
    challenges: [
      'Image analysis with Claude Sonnet',
      'Heatmap generation',
      'GeoJSON support',
      'Route optimization',
    ],
    stack: ['Express', 'TypeScript', 'Prisma', 'Turso', 'Claude Sonnet', 'Cloudinary'],
    stackReasoning:
      'Combines edge database (Turso) with AI analysis (Claude) for efficient waste management.',
    githubUrl: 'https://github.com/eldmark/backend-ecoscan.git',
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/trashclient.webm',
    featured: false,
    media: [],
  },
  {
    id: 'scholarship-hours-platform',
    title: 'Scholarship Hours Platform',
    slug: 'scholarship-hours-platform',
    description:
      'A full-stack platform designed to manage scholarship working hours through a modular client-server architecture.',
    architecture:
      'Frontend built with React Native Expo, backend implemented using Spring Boot REST APIs, MariaDB relational database, and Dockerized infrastructure separated into independent services.',
    challenges: [
      'Managing distributed services',
      'Frontend-backend synchronization',
      'Docker orchestration',
      'Authentication flows',
    ],
    stack: ['React Native', 'Spring Boot', 'MariaDB', 'Docker', 'Docker Compose'],
    stackReasoning:
      'Spring Boot was selected for structured backend architecture and React Native for cross-platform mobile support.',
    githubUrl: 'https://github.com/eldmark/Scholarship-Hours.git',
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/scholarshiphours.webm',
    featured: false,
    media: [],
  },
  {
    id: 'lisp-interpreter',
    title: 'Lisp Interpreter',
    slug: 'lisp-interpreter',
    description:
      'A custom Lisp interpreter implemented in Java supporting parsing, recursion, evaluation, and symbolic computation.',
    architecture:
      'Modular interpreter architecture including lexer, parser, evaluator, execution context, and recursive evaluation engine.',
    challenges: [
      'Recursive evaluation',
      'AST parsing',
      'Execution context handling',
      'Language design',
    ],
    stack: ['Java', 'Recursion', 'Tree Structures', 'Interpreter Design'],
    stackReasoning:
      'Java was selected for its object-oriented structure and strong handling of modular parser/interpreter design.',
    githubUrl: 'https://github.com/eldmark/Proyect-Lisp-interpeter.git',
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/lisp-interpeter.webm',
    featured: false,
    media: [],
  },
  {
    id: 'movie-blog-spa',
    title: 'Movie Blog SPA',
    slug: 'movie-blog-spa',
    description:
      'A modern movie platform built with React and Vite featuring routing, persistence, favorites, search history, and dark mode.',
    architecture:
      'Frontend SPA using React Router and Context API connected to a lightweight backend with SQLite persistence and Dockerized services.',
    challenges: [
      'Global state management',
      'Persistence synchronization',
      'Routing structure',
      'Docker integration',
    ],
    stack: ['React', 'Vite', 'React Router', 'SQLite', 'Docker Compose'],
    stackReasoning:
      'React Router and Context API were used to demonstrate SPA architecture and client-side state management.',
    githubUrl: null,
    liveUrl: null,
    thumbnail: null,
    gifDemo: '/assets/demos/movies-catalog.webm',
    featured: false,
    media: [],
  },
  {
    id: 'http-server-go',
    title: 'HTTP Server in Go',
    slug: 'http-server-go',
    description:
      'A lightweight HTTP server implemented in Go without frameworks to understand request flow and backend fundamentals.',
    architecture:
      'Minimal backend architecture focused on routing, request processing, and low-level HTTP handling.',
    challenges: ['Manual routing', 'HTTP handling', 'Low-level backend concepts'],
    stack: ['Go', 'HTTP', 'Backend Systems'],
    stackReasoning:
      'Go was selected to better understand concurrency, networking, and low-level backend behavior.',
    githubUrl: 'https://github.com/eldmark/go-http',
    liveUrl: null,
    thumbnail: null,
    gifDemo: null,
    featured: false,
    media: [],
  },
];

export const fallbackSkills: Skill[] = [
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: 'Programming Language',
    icon: 'Code',
    level: 5,
    reasoning:
      'Selected for large-scale frontend and backend projects due to type safety, maintainability, and scalability.',
    appliedIn: ['Backend APIs', 'Interactive Portfolio', 'React Applications'],
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript',
    category: 'Programming Language',
    icon: 'Code',
    level: 5,
    reasoning:
      'Core language for frontend and full-stack development with strong ecosystem support.',
    appliedIn: ['Movie Blog', 'Zoo Management System', 'Frontend Development'],
  },
  {
    id: 'skill-node',
    name: 'Node.js',
    category: 'Backend',
    icon: 'Server',
    level: 4,
    reasoning:
      'Used to build scalable backend services and REST APIs with asynchronous architecture.',
    appliedIn: ['Authentication Systems', 'REST APIs', 'Portfolio Backend'],
  },
  {
    id: 'skill-react',
    name: 'React',
    category: 'Frontend',
    icon: 'Layout',
    level: 5,
    reasoning: 'Chosen for component-based architecture, ecosystem maturity, and SPA capabilities.',
    appliedIn: ['Interactive Portfolio', 'Movie Blog', 'Scholarship Hours Platform'],
  },
  {
    id: 'skill-r3f',
    name: 'React Three Fiber',
    category: '3D Frontend',
    icon: 'Box',
    level: 4,
    reasoning: 'Selected to build interactive 3D experiences integrated with React architecture.',
    appliedIn: ['Interactive Portfolio Room', '3D UI Experiments'],
  },
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    icon: 'Database',
    level: 4,
    reasoning: 'Reliable relational database with strong consistency and scalability.',
    appliedIn: ['Backend APIs', 'Authentication Systems', 'Portfolio Analytics'],
  },
  {
    id: 'skill-prisma',
    name: 'Prisma ORM',
    category: 'Database Tooling',
    icon: 'Database',
    level: 4,
    reasoning: 'Improves schema management, query safety, and developer productivity.',
    appliedIn: ['PostgreSQL APIs', 'Authentication Systems', 'Portfolio Backend'],
  },
  {
    id: 'skill-docker',
    name: 'Docker',
    category: 'DevOps',
    icon: 'Container',
    level: 4,
    reasoning: 'Used to create reproducible environments and containerized full-stack systems.',
    appliedIn: ['Scholarship Hours Platform', 'Movie Blog', 'Portfolio Infrastructure'],
  },
  {
    id: 'skill-spring',
    name: 'Spring Boot',
    category: 'Backend Framework',
    icon: 'Server',
    level: 4,
    reasoning: 'Used for structured enterprise-style backend systems and REST APIs.',
    appliedIn: ['Scholarship Hours Platform', 'REST API Systems'],
  },
  {
    id: 'skill-go',
    name: 'Go',
    category: 'Programming Language',
    icon: 'Code',
    level: 3,
    reasoning: 'Explored for lightweight backend services and low-level HTTP understanding.',
    appliedIn: ['HTTP Server in Go', 'Concurrency Experiments'],
  },
  {
    id: 'skill-java',
    name: 'Java',
    category: 'Programming Language',
    icon: 'Code',
    level: 4,
    reasoning:
      'Used for backend systems, interpreters, and academic software engineering projects.',
    appliedIn: ['Lisp Interpreter', 'Scholarship Hours Platform'],
  },
  {
    id: 'skill-rest',
    name: 'REST APIs',
    category: 'Architecture',
    icon: 'Network',
    level: 5,
    reasoning: 'Main communication architecture used across backend and full-stack projects.',
    appliedIn: ['Movie Blog', 'Scholarship Hours Platform', 'Authentication Systems'],
  },
];

export const fallbackExperiences: Experience[] = [
  {
    id: 'experience-freelance-jr',
    company: 'Freelance / Contract',
    role: 'Software Developer Jr',
    description:
      'Developed backend services using Node.js and TypeScript, implemented REST APIs, integrated PostgreSQL with Prisma ORM, and deployed applications using Docker.',
    startDate: '2024-12-01T00:00:00.000Z',
    endDate: '2025-05-01T00:00:00.000Z',
    technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'React'],
  },
  {
    id: 'experience-freelance-backend',
    company: 'Freelance / Contract',
    role: 'Backend Developer',
    description:
      'Built secure backend systems using JWT, OAuth2, RBAC authorization, refresh tokens, and modular architecture practices.',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: null,
    technologies: ['Node.js', 'JWT', 'OAuth2', 'RBAC', 'REST APIs'],
  },
  {
    id: 'experience-uvg-algorithms',
    company: 'Universidad del Valle de Guatemala',
    role: 'Teaching Assistant - Algorithms & Data Structures',
    description:
      'Guided students in algorithms, data structures, computational thinking, and scalable software design principles.',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: null,
    technologies: ['Java', 'Python', 'Algorithms', 'Data Structures'],
  },
  {
    id: 'experience-uvg-microprocessors',
    company: 'Universidad del Valle de Guatemala',
    role: 'Teaching Assistant - Microprocessor Programming',
    description:
      'Assisted students with hardware/software automation systems, concurrency concepts, and parallel processing foundations.',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: null,
    technologies: ['C', 'Parallelism', 'Concurrency', 'Embedded Systems'],
  },
];

export const aboutProfile = {
  name: 'Marco Alejandro Díaz Castañeda',
  email: 'marcoalejandro.diazcastaneda@gmail.com',
  summary:
    'A junior full-stack developer focused on backend systems, practical frontend architecture, Dockerized delivery, and production-oriented habits.',
  direction:
    'The goal is to join a team where full-stack execution, backend reliability, UI polish, and clear technical reasoning matter.',
  contact:
    'GitHub: https://github.com/eldmark | LinkedIn: https://www.linkedin.com/in/marco-diaz21/ | Email: marcoalejandro.diazcastaneda@gmail.com',
};

export const knowledgeNotes = [
  {
    title: 'Full-Stack Development',
    body: 'I enjoy building end-to-end applications, from designing relational schemas and REST APIs to creating responsive and interactive user interfaces.',
  },
  {
    title: 'Clean Code & Architecture',
    body: 'I prioritize maintainability and scalability by following SOLID principles, using typed contracts, and implementing modular software designs.',
  },
  {
    title: 'Continuous Learning',
    body: 'I am always exploring new technologies and methodologies to stay current with industry trends and improve my software engineering skills.',
  },
];

export const futureIdeas = [
  'Exploring Microservices with Go and Kubernetes.',
  'Diving deeper into WebGL and advanced 3D shaders.',
  'Implementing CI/CD pipelines for automated deployments.',
  'Contributing to open-source projects in the Node.js ecosystem.',
];

export const fallbackTrophies: Trophy[] = [
  {
    id: 'trophy-first-deploy',
    title: 'First Production Deployment',
    description:
      'Shipped the interactive portfolio room to a live server with Docker and GitHub Actions.',
    icon: 'Rocket',
    category: 'Infrastructure',
    dateEarned: '2026-06-01T00:00:00.000Z',
    proofUrl: 'http://34.71.234.176.sslip.io/#/',
  },
  {
    id: 'trophy-teaching-assistant',
    title: 'Teaching Assistant Appointment',
    description:
      'Selected as Teaching Assistant for Algorithms & Data Structures at Universidad del Valle de Guatemala.',
    icon: 'GraduationCap',
    category: 'Academic',
    dateEarned: '2026-01-15T00:00:00.000Z',
    proofUrl: null,
  },
  {
    id: 'trophy-first-freelance',
    title: 'First Freelance Contract Delivered',
    description:
      'Delivered a production backend with REST APIs, PostgreSQL, and Dockerized deployment for a freelance client.',
    icon: 'Briefcase',
    category: 'Career',
    dateEarned: '2025-05-01T00:00:00.000Z',
    proofUrl: null,
  },
  {
    id: 'trophy-lisp-interpreter',
    title: 'Built a Working Lisp Interpreter',
    description:
      'Implemented a custom Lisp interpreter in Java with lexer, parser, and recursive evaluation engine.',
    icon: 'Code',
    category: 'Technical',
    dateEarned: '2025-11-20T00:00:00.000Z',
    proofUrl: 'https://github.com/eldmark/Proyect-Lisp-interpeter',
  },
];

export const fallbackGoals: Goal[] = [
  {
    id: 'goal-ship-portfolio',
    title: 'Ship the interactive portfolio',
    description:
      'Deploy the 3D portfolio room to a production server with typed contracts, CI/CD, and analytics.',
    category: 'Technical',
    status: 'done',
    targetDate: '2026-06-01T00:00:00.000Z',
    orderIndex: 0,
    trophyId: 'trophy-first-deploy',
  },
  {
    id: 'goal-open-source',
    title: 'Contribute to an open-source project',
    description: 'Land a merged pull request in a project with 1k+ stars in the Node.js ecosystem.',
    category: 'Open Source',
    status: 'in_progress',
    targetDate: '2026-12-31T00:00:00.000Z',
    orderIndex: 0,
    trophyId: null,
  },
  {
    id: 'goal-go-microservices',
    title: 'Build a microservices side project in Go',
    description:
      'Design and ship a small distributed system with Go services, message queues, and Kubernetes.',
    category: 'Technical',
    status: 'planned',
    targetDate: null,
    orderIndex: 0,
    trophyId: null,
  },
  {
    id: 'goal-cloud-cert',
    title: 'Earn a cloud certification',
    description:
      'Pass the AWS Solutions Architect Associate exam to back up infrastructure experience.',
    category: 'Career',
    status: 'planned',
    targetDate: '2027-06-30T00:00:00.000Z',
    orderIndex: 1,
    trophyId: null,
  },
];

export const fallbackPosts: Post[] = [
  {
    id: 'post-building-this-room',
    title: 'Building a Portfolio You Can Walk Around In',
    slug: 'building-a-portfolio-you-can-walk-around-in',
    body: [
      '# Building a Portfolio You Can Walk Around In',
      '',
      'Most portfolios are a scrolling page. I wanted mine to feel like a **place**: a cozy developer room where every object tells part of the story.',
      '',
      '## The stack',
      '',
      '- React Three Fiber for the 3D scene',
      '- Zustand for game state (player position, overlays, rooms)',
      '- Express + Prisma + PostgreSQL behind a typed REST API',
      '',
      'The whole thing is a monorepo with a shared `zod` schema package, so the frontend and backend never disagree about shapes.',
      '',
      '## What I learned',
      '',
      'Keeping the scene cheap matters more than making it pretty. Simple box geometry with *good lighting* beats heavy models every time.',
    ].join('\n'),
    projectId: null,
    publishedAt: '2026-05-20T00:00:00.000Z',
  },
  {
    id: 'post-multi-room-refactor',
    title: 'From One Room to Five: A Registry-Driven Refactor',
    slug: 'from-one-room-to-five',
    body: [
      '# From One Room to Five',
      '',
      'The original scene hardcoded every interactable. Adding a second room meant a refactor into a **central room registry**.',
      '',
      '## The registry pattern',
      '',
      'Each room is plain data: spawn point, bounds, colliders, objects, and doors.',
      '',
      '```ts',
      'export const rooms: Record<RoomId, RoomDefinition> = {',
      '  main: { id: "main", doors: [...], objects: [...] },',
      '  goals: { ... },',
      '};',
      '```',
      '',
      'The scene component renders whatever room the store points at. Doors are just interactables that call `setRoom(targetRoom)`.',
      '',
      'New rooms now cost a data entry, not a rewrite.',
    ].join('\n'),
    projectId: null,
    publishedAt: '2026-06-05T00:00:00.000Z',
  },
  {
    id: 'post-production-lessons',
    title: 'Lessons From Deploying on a Tiny Server',
    slug: 'lessons-from-deploying-on-a-tiny-server',
    body: [
      '# Lessons From Deploying on a Tiny Server',
      '',
      'This portfolio runs on a resource-constrained VM. Some things that helped:',
      '',
      '1. Lazy-load the heavy 3D scene and overlays with `React.lazy`',
      '2. Cap Docker memory limits per service',
      '3. Serve fallback seed data when the API is down, so the site *never looks broken*',
      '',
      'The fallback pattern is simple: render seeded local data immediately, then swap in live API data when the fetch resolves.',
      '',
      'See the deployment at [the live site](http://34.71.234.176.sslip.io/#/).',
    ].join('\n'),
    projectId: null,
    publishedAt: '2026-06-08T00:00:00.000Z',
  },
];

export const fallbackDevlog: DevlogEntry[] = [
  {
    id: 'devlog-portfolio-rooms',
    repo: 'eldmark/game-portafolio',
    branch: 'main',
    commitSha: '6db2b12',
    commitUrl: 'https://github.com/eldmark/game-portafolio/commit/6db2b12',
    message: 'Landed a batch of 3 changes in game-portafolio.',
    commitCount: 3,
    createdAt: '2026-06-09T16:20:00.000Z',
  },
  {
    id: 'devlog-portfolio-email',
    repo: 'eldmark/game-portafolio',
    branch: 'main',
    commitSha: '8441771',
    commitUrl: 'https://github.com/eldmark/game-portafolio/commit/8441771',
    message: 'Shipped a small update to game-portafolio.',
    commitCount: 1,
    createdAt: '2026-06-06T11:05:00.000Z',
  },
  {
    id: 'devlog-barbershop',
    repo: 'eldmark/db_barbershop',
    branch: 'main',
    commitSha: 'a1b2c3d',
    commitUrl: 'https://github.com/eldmark/db_barbershop/commits/main',
    message: 'Made progress on db_barbershop.',
    commitCount: 1,
    createdAt: '2026-06-02T09:40:00.000Z',
  },
  {
    id: 'devlog-ecoscan',
    repo: 'eldmark/backend-ecoscan',
    branch: 'main',
    commitSha: 'e4f5a6b',
    commitUrl: 'https://github.com/eldmark/backend-ecoscan/commits/main',
    message: 'Cranked out 5 commits for backend-ecoscan.',
    commitCount: 5,
    createdAt: '2026-05-28T19:55:00.000Z',
  },
];
