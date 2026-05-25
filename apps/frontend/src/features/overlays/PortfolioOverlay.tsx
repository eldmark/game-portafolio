'use client';

import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, Mail, X } from 'lucide-react';
import type { Experience, Project, Skill } from '@portfolio/shared';
import { sendMessage } from '@/lib/api';
import { aboutProfile, futureIdeas, knowledgeNotes } from '@/lib/portfolio-fallback';
import { usePortfolioStore, type OverlayType } from '@/lib/store';

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
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const closeOverlay = usePortfolioStore((state) => state.closeOverlay);

  return (
    <motion.section
      aria-label={title}
      aria-modal="true"
      className={`overlay-panel ${wide ? 'overlay-panel-wide' : ''}`}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      role="dialog"
    >
      <header className="overlay-header">
        <div>
          <p className="eyebrow">Portfolio Room</p>
          <h2>{title}</h2>
        </div>
        <button aria-label="Close overlay" className="icon-button" onClick={closeOverlay} type="button">
          <X size={20} />
        </button>
      </header>
      {children}
    </motion.section>
  );
}

function DataNotice({ loading, error, usingFallback }: Pick<PortfolioOverlayProps, 'loading' | 'error' | 'usingFallback'>) {
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
    return <p className="data-notice">Showing local placeholder content.</p>;
  }

  return <p className="data-notice">Live backend data loaded.</p>;
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
      nextLines.push('Resume link placeholder: replace with /resume.pdf before publishing.');
    } else if (normalized === 'github') {
      nextLines.push('GitHub placeholder: https://github.com/your-user');
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

function ComputerOverlay(props: PortfolioOverlayProps) {
  const [tab, setTab] = useState<'experience' | 'skills' | 'resume' | 'terminal'>('experience');

  return (
    <OverlayShell title="Main Computer" wide>
      <DataNotice {...props} />
      <div className="tab-row" role="tablist">
        {(['experience', 'skills', 'resume', 'terminal'] as const).map((item) => (
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
        ))}
      </div>
      {tab === 'experience' ? (
        <div className="stack-list">
          {props.experiences.map((experience) => (
            <article className="detail-card" key={experience.id}>
              <h3>{experience.role}</h3>
              <p className="muted">{experience.company}</p>
              <p>{experience.description}</p>
              <p className="tag-row">{experience.technologies.join(' / ')}</p>
            </article>
          ))}
        </div>
      ) : null}
      {tab === 'skills' ? <SkillsGrid skills={props.skills} /> : null}
      {tab === 'resume' ? (
        <div className="detail-card">
          <h3>Resume</h3>
          <p>
            Add a final PDF at <code>public/resume.pdf</code> and link it here before publishing.
          </p>
          <a className="text-link" href="/resume.pdf">
            Open resume placeholder
          </a>
        </div>
      ) : null}
      {tab === 'terminal' ? <TerminalPane projects={props.projects} skills={props.skills} /> : null}
    </OverlayShell>
  );
}

function SkillsGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid-list">
      {skills.map((skill) => (
        <article className="detail-card" key={skill.id}>
          <div className="card-heading">
            <h3>{skill.name}</h3>
            <span>{skill.category}</span>
          </div>
          <div aria-label={`${skill.level} out of 5`} className="meter">
            <span style={{ width: `${skill.level * 20}%` }} />
          </div>
          <p>{skill.reasoning}</p>
          <p className="tag-row">{skill.appliedIn.join(' / ')}</p>
        </article>
      ))}
    </div>
  );
}

function ProjectsOverlay(props: PortfolioOverlayProps) {
  return (
    <OverlayShell title="Project Board" wide>
      <DataNotice {...props} />
      <div className="project-grid">
        {props.projects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-thumb">
              <span>{project.featured ? 'Featured' : 'Project'}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <h4>Architecture</h4>
            <p>{project.architecture}</p>
            <h4>Technical Challenges</h4>
            <ul>
              {project.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
            <h4>Stack Reasoning</h4>
            <p>{project.stackReasoning}</p>
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
          </article>
        ))}
      </div>
    </OverlayShell>
  );
}

function MailboxOverlay() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      await sendMessage({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        message: String(formData.get('message') ?? ''),
      });
      setStatus('success');
      setMessage('Message sent. Replace backend delivery integration with email/webhook next.');
      event.currentTarget.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Message failed');
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
          <article className="project-card poster-card" key={project.id}>
            <div className="project-thumb">
              <span>GIF demo placeholder</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p className="tag-row">{project.stack.join(' / ')}</p>
          </article>
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
                <p className="tag-row">{project.stack.join(' / ')}</p>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h3>Technical Direction</h3>
          <p>
            The portfolio is built as a real full-stack product: typed contracts, REST API,
            database persistence, Dockerized services, and a UI that demonstrates async behavior.
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
        <input checked={muted} onChange={(event) => setMuted(event.target.checked)} type="checkbox" />
      </label>
      <p className="muted">Audio is wired with Howler hooks and starts muted until final assets exist.</p>
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
  };

  return (
    <AnimatePresence>
      {activeOverlay ? <div className="overlay-backdrop">{overlayMap[activeOverlay]}</div> : null}
    </AnimatePresence>
  );
}
