import type { Experience, Project, Skill } from '@portfolio/shared';

export const fallbackProjects: Project[] = [
  {
    id: 'bodegas-ecommerce-platform',
    title: 'Bodegas E-Commerce Platform',
    slug: 'bodegas-ecommerce-platform',
    description:
      'Full-stack enterprise e-commerce platform with inventory management, order processing, and promotions engine.',
    architecture:
      'Vue SPA + Express REST API + PostgreSQL + Prisma + Cloudflare R2 image storage.',
    challenges: [
      'Enterprise inventory management',
      'Background jobs for reservation expiration',
      'Inventory consistency',
      'CI/CD workflows with GitHub Actions',
    ],
    stack: ['Vue 3', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'Clerk', 'Cloudflare R2', 'Docker'],
    stackReasoning:
      'Chosen for enterprise scalability: Clerk for auth, Cloudflare R2 for media, and Prisma for relational consistency.',
    githubUrl: null,
    liveUrl: null,
    thumbnail: '/projects/bodegas/thumbnail.png',
    gifDemo: '/projects/bodegas/demo.gif',
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
    githubUrl: null,
    liveUrl: null,
    thumbnail: '/projects/barber-shop/thumbnail.png',
    gifDemo: '/projects/barber-shop/demo.gif',
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
    thumbnail: '/projects/nda-backend/thumbnail.png',
    gifDemo: '/projects/nda-backend/demo.gif',
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
    thumbnail: '/projects/equa-notepad/thumbnail.png',
    gifDemo: '/projects/equa-notepad/demo.gif',
    featured: true,
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
    stackReasoning:
      'Neo4j is ideal for modeling complex relationships in recommendation systems.',
    githubUrl: null,
    liveUrl: null,
    thumbnail: '/projects/food-rec/thumbnail.png',
    gifDemo: '/projects/food-rec/demo.gif',
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
    githubUrl: null,
    liveUrl: null,
    thumbnail: '/projects/trash-detection/thumbnail.png',
    gifDemo: '/projects/trash-detection/demo.gif',
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
    thumbnail: '/projects/scholarship-hours/thumbnail.png',
    gifDemo: '/projects/scholarship-hours/demo.gif',
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
    thumbnail: '/projects/lisp-interpreter/thumbnail.png',
    gifDemo: '/projects/lisp-interpreter/demo.gif',
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
    githubUrl: 'https://github.com/eldmark/react-router.git',
    liveUrl: null,
    thumbnail: '/projects/movie-blog/thumbnail.png',
    gifDemo: '/projects/movie-blog/demo.gif',
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
    thumbnail: '/projects/go-http/thumbnail.png',
    gifDemo: '/projects/go-http/demo.gif',
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
  summary:
    'A junior full-stack developer focused on backend systems, practical frontend architecture, Dockerized delivery, and production-oriented habits.',
  direction:
    'The goal is to join a team where full-stack execution, backend reliability, UI polish, and clear technical reasoning matter.',
  contact: 'Contact me via GitHub or LinkedIn to discuss projects or opportunities.',
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
