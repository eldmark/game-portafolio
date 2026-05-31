'use client';

import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  Gauge,
  Github,
  Home,
  Mail,
  Rocket,
  Terminal,
} from 'lucide-react';
import type { Experience, Project, Skill } from '@portfolio/shared';
import { aboutProfile } from '@/lib/portfolio-fallback';
import { usePortfolioData } from '@/lib/usePortfolioData';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.3,
    },
  },
};

function formatDate(value: string | null) {
  if (!value) return 'Present';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function clampSkillLevel(skill: Skill) {
  return Math.min(5, Math.max(1, skill.level));
}

function getProjectMedia(project: Project) {
  return project.gifDemo ?? project.thumbnail ?? project.media[0]?.url ?? null;
}

function FilterChips({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="filter-chip-row">
      <button
        className={`filter-chip ${activeCategory === 'All' ? 'active' : ''}`}
        onClick={() => onSelect('All')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function DataStatus({
  loading,
  error,
  usingFallback,
}: {
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
}) {
  if (loading) return <p className="data-notice">Loading live API data...</p>;

  if (error) {
    return (
      <p className="data-notice data-notice-error">
        API unavailable: {error}. Showing local fallback content.
      </p>
    );
  }

  if (usingFallback) return <p className="data-notice">Showing local portfolio seed data.</p>;

  return <p className="data-notice">Live API data ready.</p>;
}

function AnimatedSection({
  children,
  className = '',
  eyebrow,
  id,
  title,
}: {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  id?: string;
  title: string;
}) {
  return (
    <motion.section
      className={`recruiter-section ${className}`}
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
    >
      <header className="recruiter-section-header">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </header>
      {children}
    </motion.section>
  );
}

function RecruiterProjectCard({ project }: { project: Project }) {
  const mediaUrl = getProjectMedia(project);
  const reduceMotion = useReducedMotion();
  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <motion.article
      className={`recruiter-project-card ${project.featured ? 'is-featured' : ''}`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.2 } }}
    >
      <div className={`recruiter-project-media ${mediaUrl ? 'has-media' : ''}`}>
        {mediaUrl ? (
          isVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="recruiter-project-video"
              src={mediaUrl}
            />
          ) : (
            <div
              className="recruiter-project-bg"
              style={{
                backgroundImage: `linear-gradient(rgba(17, 19, 24, 0.1), rgba(17, 19, 24, 0.8)), url("${mediaUrl}")`,
              }}
            />
          )
        ) : null}
        <span>{project.featured ? 'Featured' : 'Project'}</span>
      </div>

      <div className="recruiter-project-body">
        <div className="card-heading">
          <h3>{project.title}</h3>
          <span>{project.stack[0] ?? 'Full stack'}</span>
        </div>
        <p>{project.description}</p>

        <div className="recruiter-project-proof">
          <h4>Architecture</h4>
          <p>{project.architecture}</p>
        </div>

        <div className="recruiter-chip-row" aria-label={`${project.title} challenges`}>
          {project.challenges.slice(0, 3).map((challenge) => (
            <span key={challenge}>{challenge}</span>
          ))}
        </div>

        <p className="tag-row">{project.stack.join(' / ')}</p>
        <div className="link-row">
          {project.githubUrl ? (
            <a href={project.githubUrl} rel="noreferrer" target="_blank">
              <Github size={16} /> Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} rel="noreferrer" target="_blank">
              <ExternalLink size={16} /> Live
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const level = clampSkillLevel(skill);

  return (
    <motion.article
      className="recruiter-skill-card"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div className="card-heading">
        <h3>{skill.name}</h3>
        <span>{skill.category}</span>
      </div>
      <div aria-label={`${level} out of 5`} className="meter recruiter-meter">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${level * 20}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
      <p>{skill.reasoning}</p>
      <p className="tag-row">{skill.appliedIn.join(' / ')}</p>
    </motion.article>
  );
}

function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <motion.div className="recruiter-timeline" variants={listVariants}>
      {experiences.map((experience) => (
        <motion.article
          className="recruiter-timeline-item"
          key={experience.id}
          variants={itemVariants}
        >
          <p className="recruiter-timeline-date">
            {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
          </p>
          <div>
            <h3>{experience.role}</h3>
            <p className="muted">{experience.company}</p>
            <p>{experience.description}</p>
            <p className="tag-row">{experience.technologies.join(' / ')}</p>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

export default function RecruiterPage() {
  const { projects, skills, experiences, loading, error, usingFallback } = usePortfolioData();
  const reduceMotion = useReducedMotion();
  const [activeProjectCategory, setActiveProjectCategory] = useState('All');
  const [activeSkillCategory, setActiveSkillCategory] = useState('All');
  const [activeSection, setActiveSection] = useState('');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const projectCategories = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.stack))),
    [projects],
  );

  const skillCategories = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category))),
    [skills],
  );

  const filteredProjects = useMemo(
    () =>
      activeProjectCategory === 'All'
        ? projects
        : projects.filter((p) => p.stack.includes(activeProjectCategory)),
    [projects, activeProjectCategory],
  );

  const filteredSkills = useMemo(
    () =>
      activeSkillCategory === 'All'
        ? skills
        : skills.filter((s) => s.category === activeSkillCategory),
    [skills, activeSkillCategory],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Briefcase,
      label: 'Projects',
      value: projects.length,
      detail: 'Featured full-stack works',
    },
    {
      icon: Code2,
      label: 'Technologies',
      value: skills.length,
      detail: 'across the entire stack',
    },
    {
      icon: Terminal,
      label: 'Experience',
      value: experiences.length,
      detail: 'Professional roles',
    },
    { icon: Gauge, label: 'Quality', value: '100%', detail: 'Performance & Best Practices' },
  ];

  return (
    <main className="recruiter-page">
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <nav className="recruiter-page-nav" aria-label="Recruiter page navigation">
        <Link to="/" className={activeSection === '' ? 'active' : ''}>
          <Home size={16} /> Room
        </Link>
        <a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>
          Projects
        </a>
        <a href="#skills" className={activeSection === 'skills' ? 'active' : ''}>
          Skills
        </a>
        <a href="#experience" className={activeSection === 'experience' ? 'active' : ''}>
          Experience
        </a>
        <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>
          Contact
        </a>
      </nav>

      <motion.section
        animate="visible"
        className="recruiter-hero recruiter-hero-redesign"
        initial="hidden"
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeOut' }}
        variants={sectionVariants}
      >
        <div className="recruiter-hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {aboutProfile.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {aboutProfile.summary}
          </motion.p>
          <motion.div
            className="recruiter-hero-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a className="primary-button" href="#projects">
              <Rocket size={18} />
              View projects
            </a>
            <a className="secondary-button" href="/resume.pdf" target="_blank" rel="noreferrer">
              <FileText size={18} />
              Resume
            </a>
            <a className="secondary-button" href="#contact">
              <Mail size={18} />
              Contact
            </a>
          </motion.div>
          <DataStatus error={error} loading={loading} usingFallback={usingFallback} />
        </div>

        <motion.div
          className="recruiter-hero-panel"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1000 }}
        >
          <div className="recruiter-availability">
            <CheckCircle2 size={18} />
            <span>Open for new opportunities</span>
          </div>
          <h2>Professional Summary</h2>
          <ul>
            <li>Experienced in full-stack development with modern technologies.</li>
            <li>Strong focus on performance, accessibility, and user experience.</li>
            <li>Proven track record of building scalable and maintainable applications.</li>
          </ul>
          <a className="text-link" href="#projects">
            Explore my work <ArrowRight size={16} />
          </a>
        </motion.div>
      </motion.section>

      <motion.section
        className="recruiter-stat-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={listVariants}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.article
              className="recruiter-stat-card"
              key={stat.label}
              variants={itemVariants}
            >
              <Icon size={20} />
              <motion.strong
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                {stat.value}
              </motion.strong>
              <span>{stat.label}</span>
              <p>{stat.detail}</p>
            </motion.article>
          );
        })}
      </motion.section>

      <AnimatedSection eyebrow="Proof Of Work" id="projects" title="Featured Projects">
        <FilterChips
          categories={projectCategories}
          activeCategory={activeProjectCategory}
          onSelect={setActiveProjectCategory}
        />
        <motion.div className="recruiter-project-grid" variants={listVariants} layout>
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <RecruiterProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection eyebrow="Technical Range" id="skills" title="Technologies">
        <FilterChips
          categories={skillCategories}
          activeCategory={activeSkillCategory}
          onSelect={setActiveSkillCategory}
        />
        <motion.div className="recruiter-skill-grid" variants={listVariants} layout>
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection eyebrow="Recent Work" id="experience" title="Experience">
        <ExperienceTimeline experiences={experiences} />
      </AnimatedSection>

      <AnimatedSection
        className="recruiter-contact-section"
        eyebrow="Next Step"
        id="contact"
        title="Contact"
      >
        <div className="recruiter-contact-panel">
          <div>
            <h3>Let&apos;s build something together</h3>
            <p>{aboutProfile.contact}</p>
            <p className="muted">
              Feel free to reach out for collaborations or just a friendly hello. I usually respond
              within 24 hours.
            </p>
          </div>
          <div className="recruiter-contact-actions">
            <a className="primary-button" href={`mailto:${aboutProfile.email}`}>
              <Mail size={18} />
              Email Me
            </a>
            <a
              className="secondary-button"
              href="https://github.com/eldmark"
              rel="noreferrer"
              target="_blank"
            >
              <Github size={18} />
              GitHub
            </a>
            <a className="secondary-button" href="/resume.pdf" rel="noreferrer">
              <FileText size={18} />
              Resume
            </a>
            <Link className="secondary-button" to="/">
              <Home size={18} />
              Back to room
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <footer className="recruiter-footer">
        <p>
          &copy; {new Date().getFullYear()} {aboutProfile.name}. Built with React, Vite, Express &
          Resend.
        </p>
      </footer>
    </main>
  );
}
