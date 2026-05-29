import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting portfolio seed...');

  await prisma.projectMedia.deleteMany();
  await prisma.dialogueLog.deleteMany();
  await prisma.userVisit.deleteMany();
  await prisma.message.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();

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
          'CV lists Python, JavaScript, TypeScript, Java, Go, Kotlin, Scala, C, and C++ for full-stack, mobile, systems, and academic work.',
        appliedIn: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Kotlin', 'Scala', 'C', 'C++'],
      },
      {
        name: 'Backend Development',
        category: 'Backend',
        level: 4,
        reasoning:
          'Experience includes REST APIs, secure enterprise backends, token middleware, RBAC, and relational data access.',
        appliedIn: ['Node.js', 'Spring Boot', 'Elysia', 'Express', 'FastAPI', 'REST APIs', 'Prisma ORM'],
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
          'CV covers relational and non-relational databases used for backend services, mobile sync, and data modeling.',
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
        appliedIn: ['Client-server', 'Microservices', 'MVC', 'MVVC', 'Multi-layer', 'Design Patterns', 'Scrum'],
      },
    ],
  });

  /* -------------------------------------------------------------------------- */
  /*                                 EXPERIENCE                                 */
  /* -------------------------------------------------------------------------- */

  await prisma.experience.createMany({
    data: [
      {
        company: 'Universidad del Valle de Guatemala',
        role: 'Teaching Assistant - Algorithms & Data Structures',
        description:
          'Answered questions on known algorithms, data structures, Java, Python, programming fundamentals, logical thinking, scalable software design, and design patterns.',
        startDate: new Date('2026-01-01'),
        endDate: null,
        technologies: ['Java', 'Python', 'Algorithms', 'Data Structures', 'Design Patterns'],
      },
      {
        company: 'Universidad del Valle de Guatemala',
        role: 'Teaching Assistant - Microprocessor Programming',
        description:
          'Supported students with hardware/software automation systems, parallel processing planning, concurrency methods, wiring support, and electronic system diagramming.',
        startDate: new Date('2026-01-01'),
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
        technologies: ['Node.js', 'REST APIs', 'JWT', 'OAuth2', 'RBAC', 'Access Tokens', 'Refresh Tokens'],
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
        title: 'Scholarship Hours Control Platform',
        slug: 'scholarship-hours-control-platform',
        description:
          'Full-stack client-server platform for managing scholarship hours and university users.',
        architecture:
          'Designed around administrator and student workflows, with services adapted to user needs and UI/UX decisions informed by Gestalt principles.',
        challenges: [
          'Scholarship hour tracking',
          'Administrator and student flows',
          'Client-server coordination',
          'UI/UX structure',
        ],
        stack: ['Full Stack', 'Client-server Architecture', 'UI/UX', 'Gestalt'],
        stackReasoning:
          'The CV frames this project as a full-stack system focused on client-server design, user management, and practical UI/UX decisions.',
        githubUrl: 'https://github.com/eldmark/Scholarship-Hours.git',
        featured: true,
        thumbnail: null,
        gifDemo: null,
      },
      {
        title: 'HTTP Server in Go',
        slug: 'http-server-go',
        description:
          'HTTP server implemented from scratch in Go, including route handling, requests, and responses without frameworks.',
        architecture:
          'Minimal no-framework backend architecture focused on direct HTTP handling and production deployment on a Google Cloud VPS.',
        challenges: [
          'Manual routing',
          'Request and response handling',
          'No-framework implementation',
          'VPS deployment',
        ],
        stack: ['Go', 'HTTP', 'Google Cloud VPS', 'No-framework Backend'],
        stackReasoning:
          'Go was used to demonstrate low-level backend fundamentals, explicit request handling, and deployable server behavior.',
        githubUrl: 'https://github.com/eldmark/go-http',
        featured: true,
        thumbnail: null,
        gifDemo: null,
      },
      {
        title: 'Mathematical Notes App',
        slug: 'mathematical-notes-app',
        description:
          'Android and cloud application for managing mathematical notes, formulas, synchronization, authentication, and AI-generated exercises.',
        architecture:
          'Modern Android architecture with Jetpack Compose, ViewModel, Room, Supabase auth/database/realtime services, Google Identity, local storage, and remote synchronization.',
        challenges: [
          'Local and remote data synchronization',
          'Google authentication',
          'Realtime cloud integration',
          'Generative AI exercise creation',
        ],
        stack: [
          'Kotlin',
          'Jetpack Compose',
          'ViewModel',
          'Room',
          'Supabase',
          'Google Identity',
          'Generative AI',
        ],
        stackReasoning:
          'The stack matches the CV project: modern Android UI/state patterns, local persistence, Supabase cloud services, Google Identity, and generative AI features.',
        githubUrl: 'https://github.com/angcoder-c/equa-notepad-plats',
        featured: true,
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
