import { useState, useEffect, FormEvent } from 'react';
import { NavLink, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Briefcase,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Check,
  X,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import {
  getProjects,
  getSkills,
  getExperiences,
  getAnalyticsSummary,
  getUsers,
  createUser,
  deleteProject,
  deleteSkill,
  deleteExperience,
  deleteUser,
  createProject,
  updateProject,
  createSkill,
  updateSkill,
  createExperience,
  updateExperience,
  type AdminUser,
  type AdminUserCreate,
} from '@/lib/api';
import type {
  AnalyticsSummary,
  Project,
  Skill,
  Experience,
  ProjectCreate,
  SkillCreate,
  ExperienceCreate,
} from '@portfolio/shared';

/* -------------------------------------------------------------------------- */
/*                                   LAYOUT                                   */
/* -------------------------------------------------------------------------- */

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <header className="sidebar-header">
          <div className="user-info">
            <div className="icon-badge">
              <User size={20} />
            </div>
            <div>
              <p className="user-name">{user?.name || 'Admin'}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
        </header>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            Overview
          </NavLink>
          <NavLink
            to="/admin/dashboard/projects"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <FolderKanban size={18} />
            Projects
          </NavLink>
          <NavLink
            to="/admin/dashboard/skills"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Wrench size={18} />
            Skills
          </NavLink>
          <NavLink
            to="/admin/dashboard/experience"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={18} />
            Experience
          </NavLink>
          <NavLink
            to="/admin/dashboard/users"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={18} />
            Users
          </NavLink>
        </nav>

        <footer className="sidebar-footer">
          <button className="admin-nav-item full-width" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </footer>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/projects" element={<ProjectManager />} />
          <Route path="/skills" element={<SkillManager />} />
          <Route path="/experience" element={<ExperienceManager />} />
          <Route path="/users" element={<UserManager />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  OVERVIEW                                  */
/* -------------------------------------------------------------------------- */

function Overview() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const data = await getAnalyticsSummary();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatDuration(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (value < 60) {
      return `${value}s`;
    }

    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m ${seconds}s`;
  }

  const averageDuration = formatDuration(analytics?.averageDuration);

  return (
    <div className="overview-page">
      <header className="admin-header">
        <h1>Dashboard Overview</h1>
      </header>
      <div className="recruiter-stat-grid">
        <article className="recruiter-stat-card">
          <LayoutDashboard size={20} />
          <strong>Complete control</strong>
          <p>Manage projects, skills, experience, and user accounts from one panel.</p>
        </article>
        <article className="recruiter-stat-card">
          <User size={20} />
          <strong>Seeded admin</strong>
          <p>You can delete the initial admin account after you create your own login.</p>
        </article>
        <article className="recruiter-stat-card">
          <LayoutDashboard size={20} />
          <strong>Usage analytics</strong>
          <p>
            {loading
              ? 'Loading usage summary...'
              : `${analytics?.totalVisits ?? 0} visits, ${analytics?.recruiterVisits ?? 0} recruiter sessions, ${analytics?.totalDialogueLogs ?? 0} dialogue events.`}
          </p>
        </article>
        <article className="recruiter-stat-card">
          <User size={20} />
          <strong>Average session</strong>
          <p>
            {loading
              ? 'Loading session duration...'
              : `${averageDuration} average engagement time.`}
          </p>
        </article>
      </div>

      <section className="admin-disclaimer-card">
        <h2>Terms &amp; Conditions</h2>
        <p>
          By using this portfolio, I may gather usage data such as visits, recruiter-mode usage,
          dialogue interactions, and session duration to understand how the portfolio is used and
          improve the experience.
        </p>
      </section>

      {!loading && analytics?.popularDialogues?.length ? (
        <section className="admin-analytics-panel">
          <header className="admin-analytics-panel-header">
            <h2>Top interactions</h2>
            <p>Most used dialogue keys from portfolio visits.</p>
          </header>
          <div className="admin-analytics-list">
            {analytics.popularDialogues.map((dialogue) => (
              <div key={dialogue.dialogueKey} className="admin-analytics-row">
                <span>{dialogue.dialogueKey}</span>
                <strong>{dialogue.count}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 USER MANAGER                               */
/* -------------------------------------------------------------------------- */

function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  function openCreate() {
    setModalOpen(true);
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Users</h1>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={18} />
          Add Admin
        </button>
      </header>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.email}</strong>
                </td>
                <td>{user.name || 'Unnamed user'}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(user.id, user.email)}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <UserModal
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}

function UserModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState<AdminUserCreate>({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createUser({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name?.trim() || null,
      });
      onSave();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>Add Admin</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Name</label>
              <input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Admin name"
              />
            </div>
            <div className="input-group admin-form-full">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PROJECT MANAGER                              */
/* -------------------------------------------------------------------------- */

function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  }

  function openCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Projects</h1>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={18} />
          New Project
        </button>
      </header>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Featured</th>
              <th>Stack</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong>{project.title}</strong>
                </td>
                <td>
                  <code className="text-xs">{project.slug}</code>
                </td>
                <td>
                  {project.featured ? (
                    <Check className="text-success" size={18} />
                  ) : (
                    <X className="text-muted" size={18} />
                  )}
                </td>
                <td>
                  {project.stack.slice(0, 3).join(', ')}
                  {project.stack.length > 3 ? '...' : ''}
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-icon" onClick={() => openEdit(project)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(project.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    {project.liveUrl && (
                      <a
                        className="btn-icon"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        className="btn-icon"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadProjects();
          }}
        />
      )}
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<ProjectCreate>({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    architecture: project?.architecture || '',
    challenges: project?.challenges || [],
    stack: project?.stack || [],
    stackReasoning: project?.stackReasoning || '',
    featured: project?.featured || false,
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    thumbnail: project?.thumbnail || '',
    gifDemo: project?.gifDemo || '',
    media: project?.media || [],
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        await updateProject(project.id, formData);
      } else {
        await createProject(formData);
      }
      onSave();
    } catch (err) {
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>{project ? 'Edit Project' : 'New Project'}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Slug</label>
              <input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <div className="input-group admin-form-full">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Architecture</label>
              <input
                value={formData.architecture}
                onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Featured</label>
              <div className="setting-row">
                <span>Show as featured project</span>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
              </div>
            </div>
            <div className="input-group">
              <label>GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Live URL</label>
              <input
                type="url"
                value={formData.liveUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                SKILL MANAGER                               */
/* -------------------------------------------------------------------------- */

function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete skill');
    }
  }

  function openCreate() {
    setEditingSkill(null);
    setModalOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditingSkill(skill);
    setModalOpen(true);
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Skills</h1>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={18} />
          New Skill
        </button>
      </header>

      {loading ? (
        <p>Loading skills...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>
                  <strong>{skill.name}</strong>
                </td>
                <td>{skill.category}</td>
                <td>{skill.level} / 5</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-icon" onClick={() => openEdit(skill)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(skill.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <SkillModal
          skill={editingSkill}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadSkills();
          }}
        />
      )}
    </div>
  );
}

function SkillModal({
  skill,
  onClose,
  onSave,
}: {
  skill: Skill | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<SkillCreate>({
    name: skill?.name || '',
    category: skill?.category || '',
    level: skill?.level || 1,
    reasoning: skill?.reasoning || '',
    appliedIn: skill?.appliedIn || [],
    icon: skill?.icon || '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (skill) {
        await updateSkill(skill.id, formData);
      } else {
        await createSkill(formData);
      }
      onSave();
    } catch (err) {
      alert('Failed to save skill');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>{skill ? 'Edit Skill' : 'New Skill'}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Level (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="input-group admin-form-full">
              <label>Reasoning</label>
              <textarea
                value={formData.reasoning}
                onChange={(e) => setFormData({ ...formData, reasoning: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             EXPERIENCE MANAGER                             */
/* -------------------------------------------------------------------------- */

function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((e) => e.id !== id));
    } catch (err) {
      alert('Failed to delete experience');
    }
  }

  function openCreate() {
    setEditingExp(null);
    setModalOpen(true);
  }

  function openEdit(exp: Experience) {
    setEditingExp(exp);
    setModalOpen(true);
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Experience</h1>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={18} />
          New Experience
        </button>
      </header>

      {loading ? (
        <p>Loading experiences...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <strong>{exp.role}</strong>
                </td>
                <td>{exp.company}</td>
                <td className="text-xs">
                  {new Date(exp.startDate).toLocaleDateString()} -{' '}
                  {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-icon" onClick={() => openEdit(exp)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(exp.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <ExperienceModal
          experience={editingExp}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadExperiences();
          }}
        />
      )}
    </div>
  );
}

function ExperienceModal({
  experience,
  onClose,
  onSave,
}: {
  experience: Experience | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState<ExperienceCreate>({
    company: experience?.company ?? '',
    role: experience?.role ?? '',
    description: experience?.description ?? '',
    startDate: experience?.startDate ?? today,
    endDate: experience?.endDate ?? null,
    technologies: experience?.technologies ?? [],
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (experience) {
        await updateExperience(experience.id, { ...formData, endDate: formData.endDate || null });
      } else {
        await createExperience({ ...formData, endDate: formData.endDate || null });
      }
      onSave();
    } catch (err) {
      alert('Failed to save experience');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>{experience ? 'Edit Experience' : 'New Experience'}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="input-group">
              <label>Company</label>
              <input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Role</label>
              <input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
              />
            </div>
            <div className="input-group admin-form-full">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
