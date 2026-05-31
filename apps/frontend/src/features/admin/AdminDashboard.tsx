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
  deleteProject,
  deleteSkill,
  deleteExperience,
  createProject,
  updateProject,
  createSkill,
  updateSkill,
  createExperience,
  updateExperience,
} from '@/lib/api';
import type {
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
  return (
    <div className="overview-page">
      <header className="admin-header">
        <h1>Dashboard Overview</h1>
      </header>
      <div className="recruiter-stat-grid">
        <article className="recruiter-stat-card">
          <LayoutDashboard size={20} />
          <strong>Welcome back!</strong>
          <p>You can manage all your portfolio content from this panel.</p>
        </article>
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
