'use client';

import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Mail, X } from 'lucide-react';
import type { Experience, Project, Skill } from '@portfolio/shared';
import { sendMessage } from '@/lib/api';
import { aboutProfile, futureIdeas, knowledgeNotes } from '@/lib/portfolio-fallback';
import { usePortfolioStore, type OverlayType } from '@/lib/store';
import PokemonOverlay from '@/features/pokemon/PokemonOverlay';
import '@/features/pokemon/styles/pokemon.css';

type PortfolioOverlayProps = {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
};

function OverlayShell({
  title,
  children,
  wide = false,
  className = '',
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  const closeOverlay = usePortfolioStore((state) => state.closeOverlay);

  return (
    <motion.section
      aria-label={title}
      aria-modal="true"
      className={`overlay-panel ${wide ? 'overlay-panel-wide' : ''} ${className}`.trim()}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      role="dialog"
    >
      <header className="overlay-header">
        <div>
          <p className="eyebrow">Portfolio Room</p>
          <h2>{title}</h2>
        </div>
        <button
          aria-label="Close overlay"
          className="icon-button"
          onClick={closeOverlay}
          type="button"
        >
          <X size={24} />
        </button>
      </header>
      {children}
    </motion.section>
  );
}

function DataNotice({
  loading,
  error,
  usingFallback,
}: Pick<PortfolioOverlayProps, 'loading' | 'error' | 'usingFallback'>) {
  if (loading) {
    return <p className="data-notice">Loading live API data...</p>;
  }

  if (error) {
    return (
      <p className="data-notice data-notice-error">
        API unavailable: {error}. Showing seeded fallback content.
      </p>
    );
  }

  if (usingFallback) {
    return <p className="data-notice">Showing local portfolio seed data.</p>;
  }

  return null;
}

function ChipList({ items, label }: { items: string[]; label: string }) {
  return (
    <div aria-label={label} className="chip-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function formatTimelineDate(value: string | null) {
  if (!value) return 'Present';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function shortenText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function ProjectPreview({ project, label }: { project: Project; label?: string }) {
  const mediaUrl = project.gifDemo ?? project.thumbnail ?? project.media[0]?.url;
  const mediaLabel =
    label ??
    (project.gifDemo ? 'GIF demo' : project.featured ? 'Featured project' : 'Project media');

  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className={`project-thumb ${mediaUrl ? 'project-thumb-media' : ''}`}>
      {mediaUrl ? (
        isVideo ? (
          <video autoPlay loop muted playsInline className="project-thumb-video" src={mediaUrl} />
        ) : (
          <div
            className="project-thumb-bg"
            style={{
              backgroundImage: `linear-gradient(rgba(17, 19, 24, 0.08), rgba(17, 19, 24, 0.78)), url("${mediaUrl}")`,
            }}
          />
        )
      ) : null}
      <span className="project-thumb-label">{mediaLabel}</span>
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const [expanded, setExpanded] = useState(false);
  const level = Math.min(5, Math.max(1, skill.level));
  const previewReasoning = shortenText(skill.reasoning, 120);

  return (
    <article className={`detail-card skill-card ${expanded ? 'is-expanded' : ''}`}>
      <div className="card-heading">
        <h3>{skill.name}</h3>
        <span>{skill.category}</span>
      </div>
      <div aria-label={`${level} out of 5`} className="meter">
        <span style={{ width: `${level * 20}%` }} />
      </div>
      <p>{expanded ? skill.reasoning : previewReasoning}</p>
      {!expanded ? (
        <p className="card-more-hint">Click to know more about where this shows up.</p>
      ) : null}
      {expanded ? <ChipList items={skill.appliedIn} label={`${skill.name} applied in`} /> : null}
      <button
        aria-expanded={expanded}
        className="card-toggle"
        onClick={() => setExpanded((current) => !current)}
        type="button"
      >
        {expanded ? 'Show less' : 'Know more'}
      </button>
    </article>
  );
}

function TerminalPane({ projects, skills }: { projects: Project[]; skills: Skill[] }) {
  const [lines, setLines] = useState<string[]>([
    'portfolio@room:~$ help',
    'Commands: help, about, projects, skills, contact, resume, github, clear',
  ]);
  const [command, setCommand] = useState('');

  function runCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = command.trim().toLowerCase();
    const nextLines = [`portfolio@room:~$ ${command}`];

    if (!normalized) return;

    if (normalized === 'clear') {
      setLines([]);
      setCommand('');
      return;
    }

    if (normalized === 'help') {
      nextLines.push('Commands: help, about, projects, skills, contact, resume, github, clear');
    } else if (normalized === 'about') {
      nextLines.push(aboutProfile.summary);
    } else if (normalized === 'projects') {
      nextLines.push(projects.map((project) => `- ${project.title}`).join('\n'));
    } else if (normalized === 'skills') {
      nextLines.push(skills.map((skill) => `- ${skill.name}: ${skill.reasoning}`).join('\n'));
    } else if (normalized === 'contact') {
      nextLines.push(aboutProfile.contact);
    } else if (normalized === 'resume') {
      nextLines.push('Resume path: /resume.pdf');
    } else if (normalized === 'github') {
      nextLines.push('GitHub: https://github.com/eldmark');
    } else {
      nextLines.push(`Unknown command: ${normalized}`);
    }

    setLines((current) => [...current, ...nextLines]);
    setCommand('');
  }

  return (
    <div className="terminal-window">
      <div className="terminal-lines">
        {lines.map((line, index) => (
          <pre key={`${line}-${index}`}>{line}</pre>
        ))}
      </div>
      <form className="terminal-form" onSubmit={runCommand}>
        <span>$</span>
        <input
          aria-label="Terminal command"
          autoComplete="off"
          onChange={(event) => setCommand(event.target.value)}
          value={command}
        />
      </form>
    </div>
  );
}

function TimelinePane({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="timeline-list">
      {experiences.map((experience) => (
        <article className="timeline-item" key={experience.id}>
          <p className="timeline-date">
            {formatTimelineDate(experience.startDate)} - {formatTimelineDate(experience.endDate)}
          </p>
          <div className="detail-card">
            <h3>{experience.role}</h3>
            <p className="muted">{experience.company}</p>
            <p>{experience.description}</p>
            <ChipList items={experience.technologies} label={`${experience.role} technologies`} />
          </div>
        </article>
      ))}
    </div>
  );
}

function ContactPane() {
  const setOverlay = usePortfolioStore((state) => state.setOverlay);

  return (
    <div className="grid-list">
      <article className="detail-card">
        <h3>Direct Contact</h3>
        <p>{aboutProfile.contact}</p>
        <div className="link-row">
          <button className="secondary-button" onClick={() => setOverlay('mailbox')} type="button">
            <Mail size={16} /> Open mailbox
          </button>
          <a
            className="text-link"
            href="https://github.com/eldmark"
            rel="noreferrer"
            target="_blank"
          >
            <Github size={16} /> GitHub profile
          </a>
        </div>
      </article>
      <article className="detail-card">
        <h3>Availability</h3>
        <p>
          I am currently open to new opportunities and collaborations. Feel free to reach out via
          the mailbox or GitHub.
        </p>
      </article>
    </div>
  );
}

function ComputerOverlay(props: PortfolioOverlayProps) {
  const [tab, setTab] = useState<
    'experience' | 'timeline' | 'skills' | 'resume' | 'contact' | 'terminal'
  >('experience');

  return (
    <OverlayShell title="Main Computer" wide>
      <DataNotice {...props} />
      <div className="tab-row" role="tablist">
        {(['experience', 'timeline', 'skills', 'resume', 'contact', 'terminal'] as const).map(
          (item) => (
            <button
              aria-selected={tab === item}
              className={tab === item ? 'active' : ''}
              key={item}
              onClick={() => setTab(item)}
              role="tab"
              type="button"
            >
              {item}
            </button>
          ),
        )}
      </div>
      {tab === 'experience' ? (
        <div className="stack-list">
          {props.experiences.map((experience) => (
            <article className="detail-card" key={experience.id}>
              <h3>{experience.role}</h3>
              <p className="muted">{experience.company}</p>
              <p>{experience.description}</p>
              <ChipList items={experience.technologies} label={`${experience.role} technologies`} />
            </article>
          ))}
        </div>
      ) : null}
      {tab === 'timeline' ? <TimelinePane experiences={props.experiences} /> : null}
      {tab === 'skills' ? <SkillsGrid skills={props.skills} /> : null}
      {tab === 'resume' ? (
        <div className="detail-card">
          <h3>Resume</h3>
          <p>
            Download my latest resume to see a detailed breakdown of my experience, education, and
            technical skills.
          </p>
          <a className="text-link" href="/resume.pdf" target="_blank" rel="noreferrer">
            Open resume file <ArrowRight size={16} />
          </a>
        </div>
      ) : null}
      {tab === 'contact' ? <ContactPane /> : null}
      {tab === 'terminal' ? <TerminalPane projects={props.projects} skills={props.skills} /> : null}
    </OverlayShell>
  );
}

function SkillsGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid-list">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const visibleStack = expanded ? project.stack : project.stack.slice(0, 4);
  const hiddenStackCount = project.stack.length - visibleStack.length;
  const contentId = `project-card-${project.id}`;

  return (
    <article
      className={`project-card poster-card ${project.featured ? 'is-featured' : ''} ${expanded ? 'is-expanded' : ''}`}
    >
      <ProjectPreview label="Featured highlight" project={project} />
      <div className="project-card-body" id={contentId}>
        <div className="card-heading">
          <div>
            <p className="card-kicker">Featured Case</p>
            <h3>{project.title}</h3>
          </div>
          <span>{project.stack[0] ?? 'Full stack'}</span>
        </div>
        <p className="project-card-summary">{shortenText(project.description, 140)}</p>
        {!expanded ? (
          <p className="card-more-hint">Click to know more about the architecture and stack.</p>
        ) : null}
        {expanded ? (
          <>
            <section className="project-card-section">
              <h4>Architecture</h4>
              <p>{project.architecture}</p>
            </section>
            <section className="project-card-section">
              <h4>Technical Challenges</h4>
              <ChipList items={project.challenges} label={`${project.title} challenges`} />
            </section>
            <section className="project-card-section">
              <h4>Stack Reasoning</h4>
              <p>{project.stackReasoning}</p>
            </section>
          </>
        ) : null}
        <ChipList items={visibleStack} label={`${project.title} stack`} />
        {!expanded && hiddenStackCount > 0 ? (
          <p className="card-more-hint">+{hiddenStackCount} more technologies available.</p>
        ) : null}
        <div className="project-card-cta-row">
          <button
            aria-controls={contentId}
            aria-expanded={expanded}
            className="card-toggle"
            onClick={() => setExpanded((current) => !current)}
            type="button"
          >
            {expanded ? 'Show less' : 'Know more'}
          </button>
          {project.githubUrl ? (
            <a
              className="card-toggle card-toggle-link"
              href={project.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Github size={16} /> GitHub
            </a>
          ) : null}
        </div>
        {expanded && project.liveUrl ? (
          <div className="link-row project-card-actions">
            <a href={project.liveUrl} rel="noreferrer" target="_blank">
              <ExternalLink size={16} /> Live
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ProjectBoardCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const contentId = `project-board-card-${project.id}`;

  return (
    <article
      className={`project-card board-project-card ${project.featured ? 'is-featured' : ''} ${expanded ? 'is-expanded' : ''}`}
    >
      {expanded ? <ProjectPreview project={project} /> : null}
      <div className="project-card-body" id={contentId}>
        <div className="card-heading">
          <div>
            <p className="card-kicker">{project.featured ? 'Featured Case' : 'Project'}</p>
            <h3>{project.title}</h3>
          </div>
          {expanded ? <span>{project.stack[0] ?? 'Full stack'}</span> : null}
        </div>
        <p className="project-card-summary">{project.description}</p>
        {expanded ? (
          <>
            <section className="project-card-section">
              <h4>Architecture</h4>
              <p>{project.architecture}</p>
            </section>
            <section className="project-card-section">
              <h4>Features</h4>
              <ChipList items={project.challenges} label={`${project.title} features`} />
            </section>
            <section className="project-card-section">
              <h4>Stack Reasoning</h4>
              <p>{project.stackReasoning}</p>
            </section>
            <ChipList items={project.stack} label={`${project.title} stack`} />
            {project.liveUrl ? (
              <div className="link-row project-card-actions">
                <a href={project.liveUrl} rel="noreferrer" target="_blank">
                  <ExternalLink size={16} /> Live
                </a>
              </div>
            ) : null}
          </>
        ) : null}
        <div className="project-card-cta-row">
          <button
            aria-controls={contentId}
            aria-expanded={expanded}
            className="card-toggle"
            onClick={() => setExpanded((current) => !current)}
            type="button"
          >
            {expanded ? 'Mostrar menos' : 'Mostrar mas'}
          </button>
          {project.githubUrl ? (
            <a
              className="card-toggle card-toggle-link"
              href={project.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Github size={16} /> GitHub
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectsOverlay(props: PortfolioOverlayProps) {
  return (
    <OverlayShell className="project-board-panel" title="Project Board" wide>
      <DataNotice {...props} />
      <div className="project-grid project-board-grid">
        {props.projects.map((project) => (
          <ProjectBoardCard key={project.id} project={project} />
        ))}
      </div>
    </OverlayShell>
  );
}

function MailboxOverlay() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [fallbackEmail, setFallbackEmail] = useState(aboutProfile.email);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();
    setStatus('loading');
    setMessage(null);

    const formData = new FormData(form);

    try {
      const result = await sendMessage({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        message: String(formData.get('message') ?? ''),
      });
      setFallbackEmail(result.contactEmail || aboutProfile.email);

      if (result.emailDelivery === 'fallback') {
        setStatus('error');
        setMessage(
          `Resend is not available right now. You can email me directly at ${result.contactEmail}.`,
        );
      } else {
        setStatus('success');
        setMessage('Message sent successfully. I will get back to you soon!');
      }
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? `${error.message} You can email me directly at ${fallbackEmail}.`
          : `Message failed. You can email me directly at ${fallbackEmail}.`,
      );
    }
  }

  return (
    <OverlayShell title="Mailbox">
      <form className="contact-form" onSubmit={submitMessage}>
        <label>
          Name
          <input name="name" required minLength={2} />
        </label>
        <label>
          Email
          <input name="email" required type="email" />
        </label>
        <label>
          Message
          <textarea name="message" required minLength={10} rows={5} />
        </label>
        <button className="primary-button" disabled={status === 'loading'} type="submit">
          <Mail size={16} />
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>
        {message ? <p className={`form-status form-status-${status}`}>{message}</p> : null}
        {status === 'error' ? (
          <a className="text-link" href={`mailto:${fallbackEmail}`}>
            Write me directly at {fallbackEmail}
          </a>
        ) : null}
      </form>
    </OverlayShell>
  );
}

function AboutOverlay() {
  return (
    <OverlayShell title="Wall Portrait">
      <div className="dialogue-box">
        <p className="speaker">{aboutProfile.name}</p>
        <p>{aboutProfile.summary}</p>
        <p>{aboutProfile.direction}</p>
        <p className="muted">{aboutProfile.contact}</p>
      </div>
    </OverlayShell>
  );
}

function BookshelfOverlay({ skills }: { skills: Skill[] }) {
  return (
    <OverlayShell title="Bookshelf">
      <SkillsGrid skills={skills} />
      <div className="stack-list">
        {knowledgeNotes.map((note) => (
          <article className="detail-card" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </article>
        ))}
      </div>
    </OverlayShell>
  );
}

function PostersOverlay({ projects }: { projects: Project[] }) {
  const featured = useMemo(() => projects.filter((project) => project.featured), [projects]);

  return (
    <OverlayShell title="Posters" wide>
      <div className="project-grid">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </OverlayShell>
  );
}

function FutureOverlay() {
  return (
    <OverlayShell title="Dream Projects">
      <div className="stack-list">
        {futureIdeas.map((idea) => (
          <article className="detail-card" key={idea}>
            <p>{idea}</p>
          </article>
        ))}
      </div>
    </OverlayShell>
  );
}

function RecruiterOverlay(props: PortfolioOverlayProps) {
  return (
    <OverlayShell title="Recruiter Mode" wide>
      <DataNotice {...props} />
      <div className="recruiter-summary">
        <section>
          <h3>About</h3>
          <p>{aboutProfile.summary}</p>
        </section>
        <section>
          <h3>Proof Of Work</h3>
          <div className="project-grid compact">
            {props.projects.map((project) => (
              <article className="detail-card" key={project.id}>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <ChipList items={project.stack} label={`${project.title} stack`} />
              </article>
            ))}
          </div>
        </section>
        <section>
          <h3>Technical Direction</h3>
          <p>
            The portfolio is built as a real full-stack product: typed contracts, REST API, database
            persistence, Dockerized services, and a UI that demonstrates async behavior.
          </p>
        </section>
      </div>
    </OverlayShell>
  );
}

function SettingsOverlay() {
  const muted = usePortfolioStore((state) => state.muted);
  const setMuted = usePortfolioStore((state) => state.setMuted);

  return (
    <OverlayShell title="Settings">
      <label className="setting-row">
        <span>Audio muted</span>
        <input
          checked={muted}
          onChange={(event) => setMuted(event.target.checked)}
          type="checkbox"
        />
      </label>
      <p className="muted">
        Playlist loaded from local audio assets: Glownes, The Flow, and The Waves.
      </p>
    </OverlayShell>
  );
}

export function PortfolioOverlay(props: PortfolioOverlayProps) {
  const activeOverlay = usePortfolioStore((state) => state.activeOverlay);

  const overlayMap: Record<Exclude<OverlayType, null>, ReactNode> = {
    computer: <ComputerOverlay {...props} />,
    projects: <ProjectsOverlay {...props} />,
    mailbox: <MailboxOverlay />,
    about: <AboutOverlay />,
    bookshelf: <BookshelfOverlay skills={props.skills} />,
    posters: <PostersOverlay projects={props.projects} />,
    future: <FutureOverlay />,
    settings: <SettingsOverlay />,
    recruiter: <RecruiterOverlay {...props} />,
    switch: <PokemonOverlay />,
  };

  return (
    <AnimatePresence>
      {activeOverlay ? <div className="overlay-backdrop">{overlayMap[activeOverlay]}</div> : null}
    </AnimatePresence>
  );
}
