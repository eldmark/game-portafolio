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
        name: 'TypeScript',
        category: 'Programming Language',
        level: 90,
        reasoning:
          'Selected for large-scale frontend and backend projects due to type safety, maintainability, and scalability.',
        appliedIn: ['Backend APIs', 'Interactive Portfolio', 'React Applications'],
      },
      {
        name: 'JavaScript',
        category: 'Programming Language',
        level: 92,
        reasoning:
          'Core language for frontend and full-stack development with strong ecosystem support.',
        appliedIn: ['Movie Blog', 'Zoo Management System', 'Frontend Development'],
      },
      {
        name: 'Node.js',
        category: 'Backend',
        level: 88,
        reasoning:
          'Used to build scalable backend services and REST APIs with asynchronous architecture.',
        appliedIn: ['Authentication Systems', 'REST APIs', 'Portfolio Backend'],
      },
      {
        name: 'React',
        category: 'Frontend',
        level: 90,
        reasoning:
          'Chosen for component-based architecture, ecosystem maturity, and SPA capabilities.',
        appliedIn: ['Interactive Portfolio', 'Movie Blog', 'Scholarship Hours Platform'],
      },
      {
        name: 'Next.js',
        category: 'Frontend Framework',
        level: 82,
        reasoning:
          'Provides excellent routing, optimization, and compatibility with React Three Fiber.',
        appliedIn: ['Interactive Portfolio', 'SSR Applications'],
      },
      {
        name: 'React Three Fiber',
        category: '3D Frontend',
        level: 75,
        reasoning:
          'Selected to build interactive 3D experiences integrated with React architecture.',
        appliedIn: ['Interactive Portfolio Room', '3D UI Experiments'],
      },
      {
        name: 'PostgreSQL',
        category: 'Database',
        level: 85,
        reasoning: 'Reliable relational database with strong consistency and scalability.',
        appliedIn: ['Backend APIs', 'Authentication Systems', 'Portfolio Analytics'],
      },
      {
        name: 'Prisma ORM',
        category: 'Database Tooling',
        level: 84,
        reasoning: 'Improves schema management, query safety, and developer productivity.',
        appliedIn: ['PostgreSQL APIs', 'Authentication Systems', 'Portfolio Backend'],
      },
      {
        name: 'Docker',
        category: 'DevOps',
        level: 86,
        reasoning: 'Used to create reproducible environments and containerized full-stack systems.',
        appliedIn: ['Scholarship Hours Platform', 'Movie Blog', 'Portfolio Infrastructure'],
      },
      {
        name: 'Spring Boot',
        category: 'Backend Framework',
        level: 78,
        reasoning: 'Used for structured enterprise-style backend systems and REST APIs.',
        appliedIn: ['Scholarship Hours Platform', 'REST API Systems'],
      },
      {
        name: 'Go',
        category: 'Programming Language',
        level: 70,
        reasoning: 'Explored for lightweight backend services and low-level HTTP understanding.',
        appliedIn: ['HTTP Server in Go', 'Concurrency Experiments'],
      },
      {
        name: 'Java',
        category: 'Programming Language',
        level: 82,
        reasoning:
          'Used for backend systems, interpreters, and academic software engineering projects.',
        appliedIn: ['Lisp Interpreter', 'Scholarship Hours Platform'],
      },
      {
        name: 'Git & GitHub',
        category: 'Tooling',
        level: 90,
        reasoning: 'Essential for collaboration, version control, and project organization.',
        appliedIn: ['All Projects', 'Collaborative Development'],
      },
      {
        name: 'REST APIs',
        category: 'Architecture',
        level: 92,
        reasoning: 'Main communication architecture used across backend and full-stack projects.',
        appliedIn: ['Movie Blog', 'Scholarship Hours Platform', 'Authentication Systems'],
      },
      {
        name: 'JWT & OAuth2',
        category: 'Security',
        level: 80,
        reasoning: 'Implemented for secure authentication, authorization, and route protection.',
        appliedIn: ['Enterprise Backend System', 'Protected APIs'],
      },
    ],
  });

  /* -------------------------------------------------------------------------- */
  /*                                 EXPERIENCE                                 */
  /* -------------------------------------------------------------------------- */

  await prisma.experience.createMany({
    data: [
      {
        company: 'Freelance / Contract',
        role: 'Software Developer Jr',
        description:
          'Developed backend services using Node.js and TypeScript, implemented REST APIs, integrated PostgreSQL with Prisma ORM, and deployed applications using Docker.',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-05-01'),
        technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'React'],
      },
      {
        company: 'Freelance / Contract',
        role: 'Backend Developer',
        description:
          'Built secure backend systems using JWT, OAuth2, RBAC authorization, refresh tokens, and modular architecture practices.',
        startDate: new Date('2026-01-01'),
        endDate: null,
        technologies: ['Node.js', 'JWT', 'OAuth2', 'RBAC', 'REST APIs'],
      },
      {
        company: 'Universidad del Valle de Guatemala',
        role: 'Teaching Assistant - Algorithms & Data Structures',
        description:
          'Guided students in algorithms, data structures, computational thinking, and scalable software design principles.',
        startDate: new Date('2026-01-01'),
        endDate: null,
        technologies: ['Java', 'Python', 'Algorithms', 'Data Structures'],
      },
      {
        company: 'Universidad del Valle de Guatemala',
        role: 'Teaching Assistant - Microprocessor Programming',
        description:
          'Assisted students with hardware/software automation systems, concurrency concepts, and parallel processing foundations.',
        startDate: new Date('2026-01-01'),
        endDate: null,
        technologies: ['C', 'Parallelism', 'Concurrency', 'Embedded Systems'],
      },
    ],
  });

  /* -------------------------------------------------------------------------- */
  /*                                  PROJECTS                                  */
  /* -------------------------------------------------------------------------- */

  const scholarshipHours = await prisma.project.create({
    data: {
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
      featured: true,
      thumbnail: '/projects/scholarship-hours/thumbnail.png',
      gifDemo: '/projects/scholarship-hours/demo.gif',
    },
  });

  const lispInterpreter = await prisma.project.create({
    data: {
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
      featured: true,
      thumbnail: '/projects/lisp-interpreter/thumbnail.png',
      gifDemo: '/projects/lisp-interpreter/demo.gif',
    },
  });

  const movieBlog = await prisma.project.create({
    data: {
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
      featured: true,
      thumbnail: '/projects/movie-blog/thumbnail.png',
      gifDemo: '/projects/movie-blog/demo.gif',
    },
  });

  const equaNotepad = await prisma.project.create({
    data: {
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
      featured: true,
      thumbnail: '/projects/equa-notepad/thumbnail.png',
      gifDemo: '/projects/equa-notepad/demo.gif',
    },
  });

  const goHttp = await prisma.project.create({
    data: {
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
      featured: false,
      thumbnail: '/projects/go-http/thumbnail.png',
      gifDemo: '/projects/go-http/demo.gif',
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                               PROJECT MEDIA                                */
  /* -------------------------------------------------------------------------- */

  await prisma.projectMedia.createMany({
    data: [
      {
        projectId: scholarshipHours.id,
        type: 'image',
        url: '/projects/scholarship-hours/screen-1.png',
        alt: 'Scholarship Hours dashboard',
        orderIndex: 1,
      },
      {
        projectId: lispInterpreter.id,
        type: 'image',
        url: '/projects/lisp-interpreter/screen-1.png',
        alt: 'Lisp interpreter execution example',
        orderIndex: 1,
      },
      {
        projectId: movieBlog.id,
        type: 'image',
        url: '/projects/movie-blog/screen-1.png',
        alt: 'Movie Blog homepage',
        orderIndex: 1,
      },
      {
        projectId: equaNotepad.id,
        type: 'image',
        url: '/projects/equa-notepad/screen-1.png',
        alt: 'Equa Notepad mobile application',
        orderIndex: 1,
      },
      {
        projectId: goHttp.id,
        type: 'image',
        url: '/projects/go-http/screen-1.png',
        alt: 'Go HTTP server project',
        orderIndex: 1,
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
