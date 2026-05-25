import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.dialogueLog.deleteMany();
  await prisma.userVisit.deleteMany();
  await prisma.message.deleteMany();
  await prisma.projectMedia.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();

  const roomPortfolio = await prisma.project.create({
    data: {
      title: 'Interactive Portfolio Room',
      slug: 'interactive-portfolio-room',
      description:
        'A cozy explorable portfolio where the room itself becomes navigation, project discovery, and technical storytelling.',
      architecture:
        'The project separates the 3D room, overlay system, API contracts, and backend data services so each part can evolve independently.',
      challenges: [
        'Keeping the 3D scene responsive on modest devices.',
        'Balancing creative interactions with recruiter-friendly navigation.',
        'Making architecture decisions visible without turning the app into documentation.',
      ],
      stack: ['Next.js', 'React Three Fiber', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
      stackReasoning:
        'Next.js and React Three Fiber make the interactive room fit naturally into a production React app, while Prisma and PostgreSQL provide real relational data modeling for projects, skills, messages, and analytics.',
      githubUrl: 'https://github.com/your-user/interactive-portfolio-room',
      liveUrl: 'https://your-portfolio.example.com',
      thumbnail: '/assets/gifs/project-room-placeholder.gif',
      gifDemo: '/assets/gifs/project-room-placeholder.gif',
      featured: true,
      media: {
        create: [
          {
            type: 'gif',
            url: '/assets/gifs/project-room-placeholder.gif',
            alt: 'Placeholder GIF showing the interactive room concept',
            orderIndex: 0,
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: 'Recruiter Mode Dashboard',
      slug: 'recruiter-mode-dashboard',
      description:
        'A fast navigation layer for recruiters who need project evidence, contact details, and resume access without exploration friction.',
      architecture:
        'Recruiter mode consumes the same API data as the room overlays but presents it in a linear, scannable route.',
      challenges: [
        'Providing a shortcut path without weakening the game concept.',
        'Reusing data and UI states across playful and professional flows.',
      ],
      stack: ['Next.js App Router', 'TypeScript', 'Zustand', 'Framer Motion'],
      stackReasoning:
        'The App Router demonstrates routing and layout control, while Zustand keeps the room and recruiter flow state explicit and testable.',
      githubUrl: roomPortfolio.githubUrl,
      liveUrl: roomPortfolio.liveUrl,
      thumbnail: '/assets/gifs/recruiter-mode-placeholder.gif',
      gifDemo: '/assets/gifs/recruiter-mode-placeholder.gif',
      featured: true,
    },
  });

  await prisma.skill.createMany({
    data: [
      {
        name: 'React + Next.js',
        category: 'Frontend',
        icon: 'Layout',
        level: 4,
        reasoning:
          'Chosen for component modularity, routing, production build support, and compatibility with interactive rendering.',
        appliedIn: ['Room overlays', 'Recruiter route', 'Project dashboard'],
      },
      {
        name: 'React Three Fiber',
        category: '3D',
        icon: 'Box',
        level: 3,
        reasoning:
          'Allows the 3D scene to use React composition, Suspense, and familiar state boundaries instead of an isolated imperative canvas.',
        appliedIn: ['Room scene', 'Interactable objects', 'Camera behavior'],
      },
      {
        name: 'Prisma + PostgreSQL',
        category: 'Backend',
        icon: 'Database',
        level: 3,
        reasoning:
          'Demonstrates relational modeling, migrations, typed queries, and intentional persistence for portfolio content and messages.',
        appliedIn: ['Projects API', 'Contact messages', 'Visit tracking'],
      },
      {
        name: 'Docker Compose',
        category: 'DevOps',
        icon: 'Container',
        level: 3,
        reasoning:
          'Shows that the portfolio can run as a real multi-service application with repeatable local infrastructure.',
        appliedIn: ['Frontend container', 'Backend container', 'PostgreSQL service'],
      },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        company: 'Portfolio Lab',
        role: 'Full-Stack Developer',
        description:
          'Built a production-oriented interactive portfolio focused on architecture, UX, API integration, and deployment readiness.',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: null,
        technologies: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
