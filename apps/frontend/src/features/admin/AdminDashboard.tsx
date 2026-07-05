import { useState, useEffect, FormEvent, Suspense, lazy } from 'react';
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
  Target,
  Trophy as TrophyIcon,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import {
  getProjects,
  getSkills,
  getExperiences,
  getAnalyticsSummary,
  getAnalyticsTimeseries,
  getGoals,
  getTrophies,
  getPosts,
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
  createGoal,
  updateGoal,
  deleteGoal,
  createTrophy,
  updateTrophy,
  deleteTrophy,
  createPost,
  updatePost,
  deletePost,
  type AdminUser,
  type AdminUserCreate,
} from '@/lib/api';
import type {
  AnalyticsSummary,
  AnalyticsTimeseries,
  Project,
  Skill,
  Experience,
  Goal,
  Trophy,
  Post,
  ProjectCreate,
  SkillCreate,
  ExperienceCreate,
  GoalCreate,
  TrophyCreate,
  ProjectMedia,
} from '@portfolio/shared';

const OverviewCharts = lazy(() => import('./OverviewCharts'));

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function toDateInputValue(value: string | null | undefined) {
  if (!value) return '';
  return value.slice(0, 10);
}

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
            to="/admin/dashboard/goals"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Target size={18} />
            Goals
          </NavLink>
          <NavLink
            to="/admin/dashboard/trophies"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <TrophyIcon size={18} />
            Trophies
          </NavLink>
          <NavLink
            to="/admin/dashboard/posts"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <FileText size={18} />
            Posts
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
          <button className="admin-nav-item full-width" onClick={handleLogout} type="button">
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
          <Route path="/goals" element={<GoalManager />} />
          <Route path="/trophies" element={<TrophyManager />} />
          <Route path="/posts" element={<PostManager />} />
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
  const [timeseries, setTimeseries] = useState<AnalyticsTimeseries | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeseriesLoading, setTimeseriesLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setTimeseriesLoading(true);
      try {
        const [summaryData, timeseriesData] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsTimeseries(days),
        ]);
        if (cancelled) return;
        setAnalytics(summaryData);
        setTimeseries(timeseriesData);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setTimeseriesLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [days]);

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
              ? 'Loading usage summary…'
              : `${analytics?.totalVisits ?? 0} visits, ${analytics?.recruiterVisits ?? 0} recruiter sessions, ${analytics?.totalDialogueLogs ?? 0} dialogue events.`}
          </p>
        </article>
        <article className="recruiter-stat-card">
          <User size={20} />
          <strong>Average session</strong>
          <p>
            {loading
              ? 'Loading session duration…'
              : `${averageDuration} average engagement time.`}
          </p>
        </article>
      </div>

      {loading ? (
        <section className="admin-analytics-panel">
          <header className="admin-analytics-panel-header">
            <h2>Analytics</h2>
            <p>Loading analytics charts…</p>
          </header>
        </section>
      ) : (
        <Suspense
          fallback={
            <section className="admin-analytics-panel">
              <header className="admin-analytics-panel-header">
                <h2>Analytics</h2>
                <p>Loading analytics charts…</p>
              </header>
            </section>
          }
        >
          <OverviewCharts
            analytics={analytics}
            timeseries={timeseries}
            timeseriesLoading={timeseriesLoading}
            days={days}
            onDaysChange={setDays}
          />
        </Suspense>
      )}

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
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          Add Admin
        </button>
      </header>

      {loading ? (
        <p>Loading users…</p>
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
                      type="button"
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
          <button className="icon-button" onClick={onClose} type="button">
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
              {loading ? 'Creating…' : 'Create Admin'}
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
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          New Project
        </button>
      </header>

      {loading ? (
        <p>Loading projects…</p>
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
                  {project.stack.length > 3 ? '…' : ''}
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(project)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(project.id)}
                      title="Delete"
                      type="button"
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

  function addMediaItem() {
    setFormData({
      ...formData,
      media: [
        ...(formData.media || []),
        { type: 'image', url: '', alt: '', orderIndex: formData.media?.length || 0 },
      ],
    });
  }

  function updateMediaItem(index: number, updates: Partial<ProjectMedia>) {
    const newMedia = [...(formData.media || [])];
    newMedia[index] = { ...newMedia[index], ...updates } as ProjectMedia;
    setFormData({ ...formData, media: newMedia });
  }

  function removeMediaItem(index: number) {
    setFormData({
      ...formData,
      media: formData.media?.filter((_, i) => i !== index),
    });
  }

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
          <button className="icon-button" onClick={onClose} type="button">
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
                onChange={(event) => setFormData({ ...formData, slug: event.target.value })}
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

            <div className="input-group admin-form-full">
              <label>Media</label>
              <div className="admin-media-list">
                {formData.media?.map((item, index) => (
                  <div key={index} className="admin-media-row">
                    <select
                      value={item.type}
                      onChange={(e) =>
                        updateMediaItem(index, { type: e.target.value as 'image' | 'gif' | 'video' })
                      }
                    >
                      <option value="image">Image</option>
                      <option value="gif">GIF</option>
                      <option value="video">Video</option>
                    </select>
                    <input
                      value={item.url}
                      onChange={(e) => updateMediaItem(index, { url: e.target.value })}
                      placeholder="URL"
                      required
                    />
                    <input
                      value={item.alt}
                      onChange={(e) => updateMediaItem(index, { alt: e.target.value })}
                      placeholder="Alt text"
                      required
                    />
                    <button
                      className="btn-icon delete"
                      type="button"
                      onClick={() => removeMediaItem(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button className="secondary-button" type="button" onClick={addMediaItem}>
                  <Plus size={16} /> Add Media
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Project'}
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
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          New Skill
        </button>
      </header>

      {loading ? (
        <p>Loading skills…</p>
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
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(skill)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(skill.id)}
                      title="Delete"
                      type="button"
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
          <button className="icon-button" onClick={onClose} type="button">
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
              {loading ? 'Saving…' : 'Save Skill'}
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
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          New Experience
        </button>
      </header>

      {loading ? (
        <p>Loading experiences…</p>
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
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(exp)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(exp.id)}
                      title="Delete"
                      type="button"
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
    startDate: toDateInputValue(experience?.startDate) || today,
    endDate: toDateInputValue(experience?.endDate) || null,
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
          <button className="icon-button" onClick={onClose} type="button">
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
              {loading ? 'Saving…' : 'Save Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                GOAL MANAGER                                */
/* -------------------------------------------------------------------------- */

const GOAL_STATUS_LABELS: Record<Goal['status'], string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
};

function GoalManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const [goalsData, trophiesData] = await Promise.all([getGoals(), getTrophies()]);
      setGoals(goalsData);
      setTrophies(trophiesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await deleteGoal(id);
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      alert('Failed to delete goal');
    }
  }

  function openCreate() {
    setEditingGoal(null);
    setModalOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal);
    setModalOpen(true);
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Goals</h1>
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          New Goal
        </button>
      </header>

      {loading ? (
        <p>Loading goals…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Target Date</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td>
                  <strong>{goal.title}</strong>
                </td>
                <td>{goal.category}</td>
                <td>{GOAL_STATUS_LABELS[goal.status]}</td>
                <td className="text-xs">
                  {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No date'}
                </td>
                <td>{goal.orderIndex}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(goal)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(goal.id)}
                      title="Delete"
                      type="button"
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
        <GoalModal
          goal={editingGoal}
          trophies={trophies}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadGoals();
          }}
        />
      )}
    </div>
  );
}

function GoalModal({
  goal,
  trophies,
  onClose,
  onSave,
}: {
  goal: Goal | null;
  trophies: Trophy[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<GoalCreate>({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || '',
    status: goal?.status || 'planned',
    targetDate: toDateInputValue(goal?.targetDate) || null,
    orderIndex: goal?.orderIndex ?? 0,
    trophyId: goal?.trophyId || null,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: GoalCreate = {
        ...formData,
        targetDate: formData.targetDate || null,
        trophyId: formData.trophyId || null,
      };
      if (goal) {
        await updateGoal(goal.id, payload);
      } else {
        await createGoal(payload);
      }
      onSave();
    } catch (err) {
      alert('Failed to save goal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>{goal ? 'Edit Goal' : 'New Goal'}</h2>
          <button className="icon-button" onClick={onClose} type="button">
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
              <label>Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Goal['status'] })
                }
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="input-group">
              <label>Target Date (Optional)</label>
              <input
                type="date"
                value={formData.targetDate || ''}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value || null })}
              />
            </div>
            <div className="input-group">
              <label>Order Index</label>
              <input
                type="number"
                min="0"
                value={formData.orderIndex}
                onChange={(e) =>
                  setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>
            <div className="input-group">
              <label>Linked Trophy (Optional)</label>
              <select
                value={formData.trophyId || ''}
                onChange={(e) => setFormData({ ...formData, trophyId: e.target.value || null })}
              >
                <option value="">No trophy</option>
                {trophies.map((trophy) => (
                  <option key={trophy.id} value={trophy.id}>
                    {trophy.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               TROPHY MANAGER                               */
/* -------------------------------------------------------------------------- */

function TrophyManager() {
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrophy, setEditingTrophy] = useState<Trophy | null>(null);

  useEffect(() => {
    loadTrophies();
  }, []);

  async function loadTrophies() {
    try {
      const data = await getTrophies();
      setTrophies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this trophy?')) return;
    try {
      await deleteTrophy(id);
      setTrophies(trophies.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete trophy');
    }
  }

  function openCreate() {
    setEditingTrophy(null);
    setModalOpen(true);
  }

  function openEdit(trophy: Trophy) {
    setEditingTrophy(trophy);
    setModalOpen(true);
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Trophies</h1>
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          New Trophy
        </button>
      </header>

      {loading ? (
        <p>Loading trophies…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Earned</th>
              <th>Icon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trophies.map((trophy) => (
              <tr key={trophy.id}>
                <td>
                  <strong>{trophy.title}</strong>
                </td>
                <td>{trophy.category}</td>
                <td className="text-xs">{new Date(trophy.dateEarned).toLocaleDateString()}</td>
                <td>
                  <code className="text-xs">{trophy.icon || '—'}</code>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(trophy)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(trophy.id)}
                      title="Delete"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                    {trophy.proofUrl && (
                      <a
                        className="btn-icon"
                        href={trophy.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View proof"
                      >
                        <ExternalLink size={16} />
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
        <TrophyModal
          trophy={editingTrophy}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadTrophies();
          }}
        />
      )}
    </div>
  );
}

function TrophyModal({
  trophy,
  onClose,
  onSave,
}: {
  trophy: Trophy | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState<TrophyCreate>({
    title: trophy?.title || '',
    description: trophy?.description || '',
    category: trophy?.category || '',
    icon: trophy?.icon || '',
    dateEarned: toDateInputValue(trophy?.dateEarned) || today,
    proofUrl: trophy?.proofUrl || '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: TrophyCreate = {
        ...formData,
        icon: formData.icon || null,
        proofUrl: formData.proofUrl || null,
      };
      if (trophy) {
        await updateTrophy(trophy.id, payload);
      } else {
        await createTrophy(payload);
      }
      onSave();
    } catch (err) {
      alert('Failed to save trophy');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>{trophy ? 'Edit Trophy' : 'New Trophy'}</h2>
          <button className="icon-button" onClick={onClose} type="button">
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
              <label>Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              <label>Icon (lucide name)</label>
              <input
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g. Trophy, Medal, Award"
              />
            </div>
            <div className="input-group">
              <label>Date Earned</label>
              <input
                type="date"
                value={formData.dateEarned}
                onChange={(e) => setFormData({ ...formData, dateEarned: e.target.value })}
                required
              />
            </div>
            <div className="input-group admin-form-full">
              <label>Proof URL (Optional)</label>
              <input
                type="url"
                value={formData.proofUrl || ''}
                onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Trophy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                POST MANAGER                                */
/* -------------------------------------------------------------------------- */

function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const [postsData, projectsData] = await Promise.all([getPosts(), getProjects()]);
      setPosts(postsData);
      setProjects(projectsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete post');
    }
  }

  function openCreate() {
    setEditingPost(null);
    setModalOpen(true);
  }

  function openEdit(post: Post) {
    setEditingPost(post);
    setModalOpen(true);
  }

  function projectTitle(projectId: string | null | undefined) {
    if (!projectId) return '—';
    return projects.find((project) => project.id === projectId)?.title ?? 'Unknown project';
  }

  return (
    <div className="manager-page">
      <header className="admin-header">
        <h1>Posts</h1>
        <button className="primary-button" onClick={openCreate} type="button">
          <Plus size={18} />
          New Post
        </button>
      </header>

      {loading ? (
        <p>Loading posts…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Published</th>
              <th>Project</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <strong>{post.title}</strong>
                </td>
                <td>
                  <code className="text-xs">{post.slug}</code>
                </td>
                <td className="text-xs">{new Date(post.publishedAt).toLocaleDateString()}</td>
                <td>{projectTitle(post.projectId)}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(post)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(post.id)}
                      title="Delete"
                      type="button"
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
        <PostModal
          post={editingPost}
          projects={projects}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            loadPosts();
          }}
        />
      )}
    </div>
  );
}

function PostModal({
  post,
  projects,
  onClose,
  onSave,
}: {
  post: Post | null;
  projects: Project[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    body: post?.body || '',
    projectId: post?.projectId || '',
    publishedAt: toDateInputValue(post?.publishedAt),
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        body: formData.body,
        projectId: formData.projectId || null,
        publishedAt: formData.publishedAt || undefined,
      };
      if (post) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }
      onSave();
    } catch (err) {
      alert('Failed to save post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <header className="overlay-header">
          <h2>{post ? 'Edit Post' : 'New Post'}</h2>
          <button className="icon-button" onClick={onClose} type="button">
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
              <label>Body (Markdown)</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={10}
                required
              />
            </div>
            <div className="input-group">
              <label>Linked Project (Optional)</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Publish Date (Optional)</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
