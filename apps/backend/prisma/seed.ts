import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

declare const process: {
  exit(code?: number): never;
};

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting portfolio seed...');

  await prisma.user.deleteMany();
  await prisma.projectMedia.deleteMany();
  await prisma.dialogueLog.deleteMany();
  await prisma.userVisit.deleteMany();
  await prisma.message.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();

  /* -------------------------------------------------------------------------- */
  /*                                    USERS                                   */
  /* -------------------------------------------------------------------------- */

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@portfolio.com',
      password: adminPassword,
      name: 'Admin User',
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                   SKILLS                                   */
  /* -------------------------------------------------------------------------- */

  await prisma.skill.createMany({
    data: [
      {
        name: 'Programming Languages',
        category: 'Languages',
        level: 5,
        reasoning:
          'Python, JavaScript, TypeScript, Java, Go, Kotlin, Scala, C, and C++ for full-stack, mobile, systems, and academic work.',
        appliedIn: [
          'Python',
          'JavaScript',
          'TypeScript',
          'Java',
          'Go',
          'Kotlin',
          'Scala',
          'C',
          'C++',
        ],
      },
      {
        name: 'Backend Development',
        category: 'Backend',
        level: 4,
        reasoning:
          'Experience includes REST APIs, secure enterprise backends, token middleware, RBAC, and relational data access.',
        appliedIn: [
          'Node.js',
          'Spring Boot',
          'Elysia',
          'Express',
          'FastAPI',
          'REST APIs',
          'Prisma ORM',
        ],
      },
      {
        name: 'Frontend Development',
        category: 'Frontend',
        level: 4,
        reasoning:
          'Built and adapted React components and mobile interfaces, with CV-listed experience across React, Vue, HTML5, CSS3, JavaScript, and React Native.',
        appliedIn: ['React', 'Vue', 'HTML5', 'CSS3', 'JavaScript', 'React Native'],
      },
      {
        name: 'Databases',
        category: 'Data',
        level: 4,
        reasoning:
          'Relational and non-relational databases used for backend services, mobile sync, and data modeling.',
        appliedIn: ['PostgreSQL', 'MariaDB', 'MySQL', 'Neo4J', 'Redis', 'Room', 'Supabase'],
      },
      {
        name: 'Tooling & Delivery',
        category: 'Tooling',
        level: 4,
        reasoning:
          'Uses version control, GitHub Actions, Docker, and Docker Compose for reproducible development and deployment workflows.',
        appliedIn: ['Git', 'GitHub', 'GitHub Actions', 'Docker', 'Docker Compose'],
      },
      {
        name: 'Testing',
        category: 'Quality',
        level: 3,
        reasoning:
          'Implemented Jest tests to validate key features, including basic unit and integration coverage.',
        appliedIn: ['Jest', 'Unit Testing', 'Integration Testing'],
      },
      {
        name: 'Security & Authentication',
        category: 'Security',
        level: 4,
        reasoning:
          'Backend experience includes JWT, OAuth2, token validation middleware, route protection, RBAC, access tokens, and refresh tokens.',
        appliedIn: ['JWT', 'OAuth2', 'RBAC', 'Protected Routes', 'Access Tokens', 'Refresh Tokens'],
      },
      {
        name: 'Architecture & Methods',
        category: 'Architecture',
        level: 4,
        reasoning:
          'CV highlights client-server architecture, microservices, MVC, MVVC, multi-layer design, scalable patterns, and Agile/Scrum practices.',
        appliedIn: [
          'Client-server',
          'Microservices',
          'MVC',
          'MVVC',
          'Multi-layer',
          'Design Patterns',
          'Scrum',
        ],
      },
    ],
  });

  /* -------------------------------------------------------------------------- */
  /*                                 EXPERIENCE                                 */
  /* -------------------------------------------------------------------------- */

  await prisma.experience.createMany({
    data: [
      {
        company: 'Softlogic S.A.',
        role: 'Jr Full Stack Developer',
        description:
          'Devloped endpoint and maintaine secure and  scalable proyects using Php, Laravel, MySQL, JavaScript, and Vue.js. Focusing on stripe integration.',
        startDate: new Date('2026-06-01'),
        endDate: null,
        technologies: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Vue.js', 'Stripe'],
      },
      {
        company: 'Universidad del Valle de Guatemala',
        role: 'Teaching Assistant - Algorithms & Data Structures',
        description:
          'Answered questions on known algorithms, data structures, Java, Python, programming fundamentals, logical thinking, scalable software design, and design patterns.',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-01'),
        technologies: ['Java', 'Python', 'Algorithms', 'Data Structures', 'Design Patterns'],
      },
      {
        company: 'Universidad del Valle de Guatemala',
        role: 'Teaching Assistant - Microprocessor Programming',
        description:
          'Supported students with hardware/software automation systems, parallel processing planning, concurrency methods, wiring support, and electronic system diagramming.',
        startDate: new Date('2026-06-01'),
        endDate: null,
        technologies: ['C', 'Concurrency', 'Parallel Processing', 'Automation', 'Embedded Systems'],
      },
      {
        company: 'Freelance / Contract',
        role: 'Backend Developer',
        description:
          'Developed secure and scalable enterprise backend services with JWT, OAuth2, token validation middleware, RBAC authorization, access tokens, and refresh tokens.',
        startDate: new Date('2026-01-01'),
        endDate: null,
        technologies: [
          'Node.js',
          'REST APIs',
          'JWT',
          'OAuth2',
          'RBAC',
          'Access Tokens',
          'Refresh Tokens',
        ],
      },
      {
        company: 'Freelance / Contract',
        role: 'Software Developer Jr',
        description:
          'Developed Node.js and TypeScript backend services, modeled relational database queries, wrote Jest tests for key features, deployed applications with Docker, and built adaptable React components.',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-05-01'),
        technologies: ['Node.js', 'TypeScript', 'Relational Databases', 'Jest', 'Docker', 'React'],
      },
    ],
  });

  /* -------------------------------------------------------------------------- */
  /*                                  PROJECTS                                  */
  /* -------------------------------------------------------------------------- */

  await prisma.project.createMany({
    data: [
      {
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
        featured: true,
        thumbnail: null,
        gifDemo: '/assets/demos/bodegasdelicores.webm',
      },
      {
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
          'OAuth2 and JWT integration',
          'RBAC authorization middleware',
          'Secure API design patterns',
        ],
        stack: ['React', 'TypeScript', 'Bun', 'ElysiaJS', 'PostgreSQL', 'Prisma', 'Docker'],
        stackReasoning:
          'Leverages Bun and ElysiaJS for high-performance API, and PostgreSQL features for complex business logic.',
        githubUrl: 'https://github.com/eldmark/db_barbershop.git',
        featured: true,
        thumbnail: null,
        gifDemo: '/assets/demos/barbershop.webm',
      },
      {
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
        featured: true,
        thumbnail: null,
        gifDemo: null,
      },
      {
        title: 'Equa Notepad',
        slug: 'equa-notepad',
        description:
          'Android application for mathematical note organization with AI-generated exercises and cloud sync.',
        architecture:
          'Kotlin + Jetpack Compose + Room + DataStore + Supabase + Google Identity + OpenRouter.',
        challenges: [
          'Local and remote data synchronization',
          'Offline-first architecture',
          'AI-generated exercise integration',
          'Google Identity authentication',
        ],
        stack: [
          'Kotlin',
          'Jetpack Compose',
          'Room',
          'DataStore',
          'Supabase',
          'Google Identity',
          'OpenRouter',
        ],
        stackReasoning:
          'Modern Android stack combined with Supabase for cloud features and AI integration via OpenRouter.',
        githubUrl: 'https://github.com/angcoder-c/equa-notepad-plats',
        featured: false,
        thumbnail: null,
        gifDemo: '/assets/demos/equa-notepad-plats.mp4',
      },
      {
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
        githubUrl: 'https://github.com/angcoder-c/food-recommendations-p2.git',
        featured: false,
        thumbnail: null,
        gifDemo: '/assets/demos/food-recomendation.webm',
      },
      {
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
        featured: false,
        thumbnail: null,
        gifDemo: '/assets/demos/trashclient.webm',
      },
      {
        title: 'Scholarship Hours Platform',
        slug: 'scholarship-hours-platform',
        description: 'Full stack management system for tracking scholarship hours.',
        architecture: 'Spring Boot + MariaDB + React Native + Docker.',
        challenges: [
          'Hour tracking logic',
          'Cross-platform mobile client',
          'Authentication and authorization',
        ],
        stack: ['Spring Boot', 'MariaDB', 'React Native', 'Docker'],
        stackReasoning:
          'Robust backend with Spring Boot and flexible mobile client with React Native.',
        githubUrl: 'https://github.com/eldmark/Scholarship-Hours.git',
        featured: false,
        thumbnail: null,
        gifDemo: '/assets/demos/scholarshiphours.webm',
      },
      {
        title: 'Lisp Interpreter',
        slug: 'lisp-interpreter',
        description: 'Custom Lisp interpreter built from scratch in Java.',
        architecture: 'Lexer + Parser + AST evaluation + Execution context.',
        challenges: [
          'Recursive evaluation logic',
          'Lexical scoping and execution context',
          'Custom AST construction',
        ],
        stack: ['Java', 'Maven', 'JUnit'],
        stackReasoning:
          'Built to demonstrate deep understanding of programming language fundamentals.',
        githubUrl: 'https://github.com/eldmark/Proyect-Lisp-interpeter.git',
        featured: false,
        thumbnail: null,
        gifDemo: '/assets/demos/lisp-interpeter.webm',
      },
      {
        title: 'Movie Blog',
        slug: 'movie-blog',
        description: 'Movie management platform with persistent favorites and global state.',
        architecture: 'React + React Router + SQLite + Docker.',
        challenges: [
          'Global state management',
          'Persistent search history',
          'SQLite integration in Docker',
        ],
        stack: ['React', 'React Router', 'SQLite', 'Docker'],
        stackReasoning: 'Lightweight state-driven application with local persistence.',
        githubUrl: null,
        featured: false,
        thumbnail: null,
        gifDemo: '/assets/demos/movies-catalog.webm',
      },
      {
        title: 'HTTP Server in Go',
        slug: 'http-server-go',
        description: 'Lightweight HTTP server implementation from scratch.',
        architecture: 'Custom routing and request handling without frameworks.',
        challenges: [
          'Internal HTTP protocol implementation',
          'Concurrent request handling',
          'Minimalist routing logic',
        ],
        stack: ['Go'],
        stackReasoning: 'Demonstrates proficiency in low-level web protocols and Go concurrency.',
        githubUrl: 'https://github.com/eldmark/go-http',
        featured: false,
        thumbnail: null,
        gifDemo: null,
      },
    ],
  });

  console.log(' Portfolio seed completed successfully');
}
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
