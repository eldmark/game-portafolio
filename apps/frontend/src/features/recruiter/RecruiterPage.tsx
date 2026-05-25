'use client';

import Link from 'next/link';
import { Github, Home, Mail } from 'lucide-react';
import { aboutProfile } from '@/lib/portfolio-fallback';
import { usePortfolioData } from '@/lib/usePortfolioData';

export default function RecruiterPage() {
  const { projects, skills, experiences, loading, error, usingFallback } = usePortfolioData();

  return (
    <main className="recruiter-page">
      <nav className="recruiter-page-nav" aria-label="Recruiter page navigation">
        <Link href="/">
          <Home size={16} /> Room
        </Link>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </nav>

      <section className="recruiter-hero">
        <p className="eyebrow">Fast Review Mode</p>
        <h1>Full-Stack Developer Portfolio</h1>
        <p>{aboutProfile.summary}</p>
        <div className="link-row">
          <a href="https://github.com/your-user" rel="noreferrer" target="_blank">
            <Github size={16} /> GitHub
          </a>
          <a href="mailto:replace-me@example.com">
            <Mail size={16} /> Email
          </a>
        </div>
      </section>

      <section className="recruiter-section">
        <h2>Technical Direction</h2>
        <p>
          This portfolio is intentionally built as a real product: a responsive Next.js frontend,
          REST API, Prisma/PostgreSQL persistence, Dockerized infrastructure, and clear runtime
          loading/error states.
        </p>
        {loading ? <p className="data-notice">Loading live API data...</p> : null}
        {error ? (
          <p className="data-notice data-notice-error">
            API unavailable: {error}. Showing local fallback content.
          </p>
        ) : null}
        {!loading && !error && !usingFallback ? (
          <p className="data-notice">Live backend data loaded.</p>
        ) : null}
      </section>

      <section className="recruiter-section" id="projects">
        <h2>Projects</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <h4>Architecture</h4>
              <p>{project.architecture}</p>
              <h4>Challenges</h4>
              <ul>
                {project.challenges.map((challenge) => (
                  <li key={challenge}>{challenge}</li>
                ))}
              </ul>
              <p className="tag-row">{project.stack.join(' / ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recruiter-section" id="skills">
        <h2>Technologies</h2>
        <div className="grid-list">
          {skills.map((skill) => (
            <article className="detail-card" key={skill.id}>
              <h3>{skill.name}</h3>
              <p className="muted">{skill.category}</p>
              <p>{skill.reasoning}</p>
              <p className="tag-row">{skill.appliedIn.join(' / ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recruiter-section">
        <h2>Experience</h2>
        <div className="stack-list">
          {experiences.map((experience) => (
            <article className="detail-card" key={experience.id}>
              <h3>{experience.role}</h3>
              <p className="muted">{experience.company}</p>
              <p>{experience.description}</p>
              <p className="tag-row">{experience.technologies.join(' / ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recruiter-section" id="contact">
        <h2>Contact</h2>
        <p>{aboutProfile.contact}</p>
      </section>
    </main>
  );
}
