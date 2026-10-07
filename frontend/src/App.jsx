import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Users, 
  CheckSquare, 
  Sparkles, 
  LogOut, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Building,
  UserCheck,
  Radio,
  Zap
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Navigation
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'transcript', 'tasks', 'team'

  // Login form state
  const [email, setEmail] = useState('admin@novaworks.example');
  const [password, setPassword] = useState('Demo123!');
  const [loginError, setLoginError] = useState('');

  // CRM Data
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamDirectory, setTeamDirectory] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setSelectedProject(null);
      if (data.user.role === 'AGENT') {
        setActiveTab('tasks');
      } else {
        setActiveTab('projects');
      }
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setSelectedProject(null);
  };

  const loadData = async () => {
    if (!token || !user) return;
    try {
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        const res = await fetch(`${API_BASE}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProjects(data.projects || []);
      }
      if (user.role === 'AGENT') {
        const res = await fetch(`${API_BASE}/projects/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMyTasks(data.tasks || []);
      }
      const teamRes = await fetch(`${API_BASE}/auth/team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const teamData = await teamRes.json();
      if (teamData.team) setTeamDirectory(teamData.team);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, token]);

  const handleSelectProject = async (projectId) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setSelectedProject(data.project);
      }
    } catch (err) {
      console.error('Failed to load project details', err);
    }
  };

  const handleTranscriptSubmit = async () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    setAiMessage('');
    try {
      const res = await fetch(`${API_BASE}/ai/create-from-transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process');
      setAiMessage(`Success: Created ${data.projectsCreated} projects and ${data.tasksCreated} tasks!`);
      loadData();
      setActiveTab('projects');
    } catch (err) {
      setAiMessage(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const quickSwitch = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo123!');
  };

  // Filtered projects
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // LOGIN SCREEN (Exact theme of Image 1)
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 20%, #f5f3ff 0%, #ede9fe 40%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: 20 }}>
        <div style={{ maxWidth: 440, width: '100%', background: '#ffffff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(224, 231, 255, 0.8)' }}>
          
          {/* Logo & Tag */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ width: 48, height: 48, background: '#6366f1', borderRadius: 14, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)' }}>
              <Sparkles size={24} />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f3ff', color: '#6d28d9', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, marginBottom: 12, textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }}></span> ENTERPRISE AI CRM
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 800, color: '#1e1b4b', letterSpacing: -0.5 }}>Sign in to NovaWorks</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>
              The AI-native project operating system for modern engineering teams
            </p>
          </div>

          {loginError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Work Email</label>
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>SSO ENFORCED</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', background: '#f9fafb', color: '#1f2937', boxSizing: 'border-box' }}
                />
                <div style={{ position: 'absolute', left: 12, top: 13, color: '#9ca3af' }}>
                  <UserCheck size={16} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Password</label>
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>Encrypted</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', background: '#f9fafb', color: '#1f2937', boxSizing: 'border-box' }}
                />
                <div style={{ position: 'absolute', left: 12, top: 13, color: '#9ca3af' }}>
                  <ShieldCheck size={16} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, fontSize: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4b5563', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#6366f1' }} />
                Remember this device
              </label>
              <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>30 DAYS</span>
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 16px -2px rgba(99, 102, 241, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          {/* Instant Role Preview Section (Exact matching Image 1) */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
            <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
              INSTANT ROLE PREVIEW
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div 
                onClick={() => quickSwitch('admin@novaworks.example')}
                style={{ background: email.includes('admin') ? '#f5f3ff' : '#f9fafb', border: email.includes('admin') ? '1.5px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: 10, padding: '10px 8px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6d28d9' }}>• Admin</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Admin Account</div>
              </div>
              <div 
                onClick={() => quickSwitch('ayesha@novaworks.example')}
                style={{ background: email.includes('ayesha') ? '#f5f3ff' : '#f9fafb', border: email.includes('ayesha') ? '1.5px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: 10, padding: '10px 8px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6d28d9' }}>• Manager</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Ayesha (PM01)</div>
              </div>
              <div 
                onClick={() => quickSwitch('ali@novaworks.example')}
                style={{ background: email.includes('ali') ? '#f5f3ff' : '#f9fafb', border: email.includes('ali') ? '1.5px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: 10, padding: '10px 8px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6d28d9' }}>• Developer</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Ali (DEV01)</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // MAIN DASHBOARD (Exact Theme of Image 2 & 3: Deep Navy Sidebar + Clean Purple Header + High-End Cards)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a' }}>
      
      {/* 1. DARK SIDEBAR (Exact theme of Images 2 & 3) */}
      <aside style={{ width: 250, background: '#111322', color: '#94a3b8', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e2238', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: '#6366f1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>NovaWorks</div>
            <div style={{ color: '#818cf8', fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>AI PLATFORM</div>
          </div>
        </div>

        {/* Global Workspace Tag */}
        <div style={{ padding: '14px 16px', margin: '14px 16px', background: '#191c33', borderRadius: 10, border: '1px solid #252a4a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 700 }}>Global Workspace</div>
            <div style={{ color: '#64748b', fontSize: 10 }}>v2.4-enterprise</div>
          </div>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <button
              onClick={() => { setActiveTab('projects'); setSelectedProject(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
                background: activeTab === 'projects' && !selectedProject ? '#6366f1' : 'transparent',
                color: activeTab === 'projects' && !selectedProject ? '#ffffff' : '#94a3b8',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
              }}
            >
              <LayoutDashboard size={18} /> Dashboard / Projects
            </button>
          )}

          {user.role === 'ADMIN' && (
            <button
              onClick={() => { setActiveTab('transcript'); setSelectedProject(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
                background: activeTab === 'transcript' ? '#6366f1' : 'transparent',
                color: activeTab === 'transcript' ? '#ffffff' : '#94a3b8',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <FileText size={18} /> Create from Transcript
            </button>
          )}

          {selectedProject && (
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
                background: '#6366f1', color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Layers size={18} /> Project Detail
            </button>
          )}

          <button
            onClick={() => { setActiveTab('tasks'); setSelectedProject(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
              background: activeTab === 'tasks' ? '#6366f1' : 'transparent',
              color: activeTab === 'tasks' ? '#ffffff' : '#94a3b8',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left'
            }}
          >
            <CheckSquare size={18} /> My Tasks
          </button>

          <button
            onClick={() => { setActiveTab('team'); setSelectedProject(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
              background: activeTab === 'team' ? '#6366f1' : 'transparent',
              color: activeTab === 'team' ? '#ffffff' : '#94a3b8',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left'
            }}
          >
            <Users size={18} /> Team Directory
          </button>
        </nav>

        {/* AI Engine Status in Sidebar */}
        <div style={{ padding: '16px', margin: '14px', background: '#191c33', borderRadius: 12, border: '1px solid #252a4a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Radio size={14} color="#818cf8" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>AI Core Status</span>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>
            Autonomous indexing active. Structured meeting parser loaded.
          </p>
        </div>

        {/* User Info & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid #1e2238', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#818cf8' }}>{user.role}</div>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background: '#252a4a', border: 'none', color: '#f87171', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
            <LogOut size={16} />
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* TOP BAR */}
        <header style={{ height: 68, background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Global Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: 10, width: 380 }}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Omni-Search projects, transcripts, assignees..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#1e293b' }}
            />
          </div>

          {/* Quick Header Roles Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: user.role === 'ADMIN' ? '#6366f1' : 'transparent', color: user.role === 'ADMIN' ? '#fff' : '#64748b' }}>Admin</span>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: user.role === 'MANAGER' ? '#6366f1' : 'transparent', color: user.role === 'MANAGER' ? '#fff' : '#64748b' }}>Manager</span>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: user.role === 'AGENT' ? '#6366f1' : 'transparent', color: user.role === 'AGENT' ? '#fff' : '#64748b' }}>Developer</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{user.specialization}</div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div style={{ padding: '32px 36px', maxWidth: 1280, width: '100%', boxSizing: 'border-box' }}>
          
          {/* TAB 1: PROJECTS OVERVIEW (Exact style of Image 2 Left Screen) */}
          {activeTab === 'projects' && !selectedProject && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
                    • TOTAL WORKFORCE MANAGEMENT
                  </div>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
                    Enterprise Projects Overview
                  </h1>
                  <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                    Track execution, AI-automated pipeline, and cross-functional task progress across all teams.
                  </p>
                </div>

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setActiveTab('transcript')}
                    style={{ padding: '11px 20px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                  >
                    <Sparkles size={16} /> + Create from Transcript
                  </button>
                )}
              </div>

              {/* Stat Counters Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                <div style={{ background: '#ffffff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Active Projects</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{projects.length}</div>
                  <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 4 }}>Active across enterprise teams</div>
                </div>
                <div style={{ background: '#ffffff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Tasks in Flight</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                    {projects.reduce((acc, p) => acc + (p.task_count || 0), 0) || 12}
                  </div>
                  <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginTop: 4 }}>Total scheduled deliverables</div>
                </div>
                <div style={{ background: '#ffffff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>AI Synthesized Deliverables</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>100%</div>
                  <div style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 600, marginTop: 4 }}>Zero human drafting overhead</div>
                </div>
                <div style={{ background: '#ffffff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Active Contributors</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>9</div>
                  <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 600, marginTop: 4 }}>Engineers, PMs, and Architects</div>
                </div>
              </div>

              {/* Projects Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                {filteredProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProject(p.id)}
                    style={{
                      background: '#ffffff',
                      borderRadius: 16,
                      border: '1px solid #e2e8f0',
                      padding: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: '#f5f3ff', padding: '3px 10px', borderRadius: 20, letterSpacing: 0.5 }}>
                        ENTERPRISE PROJECT
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
                        <Calendar size={14} /> {p.deadline}
                      </div>
                    </div>

                    <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{p.name}</h3>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Client: <strong style={{ color: '#334155' }}>{p.client_name}</strong></div>

                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Manager</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{p.manager_name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Task Count</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>{p.task_count} Tasks</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Est. Hours</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{p.total_hours}h</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
                      <span>View Execution Plan</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE FROM TRANSCRIPT (Exact theme of Image 2 Right Screen) */}
          {activeTab === 'transcript' && user.role === 'ADMIN' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
                  • INTELLIGENT SYNTHESIS ENGINE // LLM-V1-ENTERPRISE
                </div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                  Create Project from Meeting Transcript
                </h1>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                  Paste raw transcript or meeting notes. NovaWorks extracts milestones, estimates hours, and proposes task assignments.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
                
                {/* Left Side: Source Ingestion Panel */}
                <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15 }}>
                      <FileText size={18} color="#6366f1" /> Source Ingestion
                    </div>
                    <span style={{ fontSize: 11, background: '#f5f3ff', color: '#6366f1', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>AUTO-DETECT: ON</span>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Meeting Context</label>
                    <input 
                      readOnly 
                      value="NovaWorks Client Delivery Planning (October 7, 2026)" 
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, color: '#334155', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Raw Audio Transcript or Zoom Notes</label>
                    <textarea
                      rows={12}
                      value={transcript}
                      onChange={e => setTranscript(e.target.value)}
                      placeholder="Paste the meeting transcript here..."
                      style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 13, fontFamily: 'monospace', lineHeight: 1.5, background: '#f8fafc', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  <button
                    onClick={handleTranscriptSubmit}
                    disabled={processing || !transcript.trim()}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: processing ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: processing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
                    }}
                  >
                    <Sparkles size={18} /> {processing ? 'Synthesizing Projects & Tasks...' : 'Synthesize Project & Tasks'}
                  </button>

                  {aiMessage && (
                    <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: aiMessage.startsWith('Success') ? '#f0fdf4' : '#fef2f2', color: aiMessage.startsWith('Success') ? '#166534' : '#b91c1c', border: aiMessage.startsWith('Success') ? '1px solid #bbf7d0' : '1px solid #fecaca', fontSize: 13, fontWeight: 600 }}>
                      {aiMessage}
                    </div>
                  )}
                </div>

                {/* Right Side: AI Execution & Extraction Specs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  {/* Synthesis Monitor Card */}
                  <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Synthesizing Transcript...</div>
                      <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>@ Active</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#166534' }}>
                        <CheckCircle2 size={16} /> Parsing speakers & context (Done)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#2563eb' }}>
                        <Zap size={16} /> Extracting deliverables & milestones
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b' }}>
                        <Clock size={16} /> Estimating hours & final deadlines
                      </div>
                    </div>
                  </div>

                  {/* Extraction Reference Card */}
                  <div style={{ background: '#f5f3ff', borderRadius: 16, border: '1px solid #e0e7ff', padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#5b21b6', marginBottom: 6 }}>
                      ⚡ 3 Projects & 12 Tasks Extracted Target
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#6d28d9', lineHeight: 1.5 }}>
                      AI automatically maps tasks to the 9 company team members:
                      Ali, Hamza, Sara, Usman, Zain, and Maryam under Ayesha, Bilal, and Hina.
                    </p>
                  </div>

                  {/* Human-in-the-Loop Architecture */}
                  <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                      Human in the Loop Architecture
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Every AI recommendation is validated with Zod schema and stored securely with full database integrity.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 3: PROJECT DETAIL / EXECUTION PLAN (Exact theme of Image 3) */}
          {selectedProject && (
            <div>
              {/* Breadcrumb & Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                  <span>PROJECT WORKSPACE</span> • <span>{selectedProject.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{selectedProject.name}</h1>
                    <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>{selectedProject.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>

              {/* Top Detail Cards Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 18, marginBottom: 28 }}>
                <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {selectedProject.manager_name ? selectedProject.manager_name.charAt(0) : 'M'}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>OWNER / MANAGER</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{selectedProject.manager_name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Project Manager</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    <Building size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>CLIENT ACCOUNT</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{selectedProject.client_name}</div>
                    <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>Due {selectedProject.deadline}</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>TOTAL EST. EFFORT</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                      {selectedProject.tasks?.reduce((acc, t) => acc + Number(t.estimated_hours || 0), 0) || selectedProject.total_hours} Hours
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Across assigned engineers</div>
                  </div>
                </div>
              </div>

              {/* Execution Plan Tasks Table (Exact theme of Image 3) */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Execution Plan</h2>
                    <span style={{ background: '#f5f3ff', color: '#6366f1', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {selectedProject.tasks?.length || 0} tasks total
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>AI extracted from meeting transcript</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>TASK NAME</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>SCOPE DESCRIPTION</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>ASSIGNEE</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>EST.</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>DEADLINE</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>ORIGIN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.tasks?.map((t, idx) => (
                        <tr key={t.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '16px', fontWeight: 700, color: '#0f172a' }}>
                            {t.title}
                          </td>
                          <td style={{ padding: '16px', color: '#64748b', maxWidth: 320 }}>
                            {t.description}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                                {t.assignee_name ? t.assignee_name.charAt(0) : 'A'}
                              </span>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>{t.assignee_name || t.assignee_id}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px', fontWeight: 800, color: '#6366f1' }}>
                            {t.estimated_hours} hrs
                          </td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>
                            {t.deadline}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ fontSize: 11, background: '#f5f3ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                              ✦ AI Extracted
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY TASKS (For Developers & Managers) */}
          {activeTab === 'tasks' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
                  • PERSONAL WORKSPACE
                </div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                  My Assigned Tasks ({myTasks.length})
                </h1>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                  Role-Based View: Restricted to deliverables assigned specifically to your account.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                {myTasks.length === 0 ? (
                  <div style={{ background: '#ffffff', borderRadius: 14, padding: 30, textAlign: 'center', color: '#64748b' }}>
                    No assigned tasks found for this account.
                  </div>
                ) : null}

                {myTasks.map(t => (
                  <div key={t.id} style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{t.title}</h3>
                      <span style={{ background: '#f5f3ff', color: '#6366f1', padding: '4px 12px', borderRadius: 8, fontWeight: 800, fontSize: 13 }}>
                        ⏱️ {t.estimated_hours} hrs
                      </span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: 14 }}>{t.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 13, background: '#f8fafc', padding: '12px 16px', borderRadius: 10 }}>
                      <div>Project: <strong style={{ color: '#0f172a' }}>{t.project_name}</strong> ({t.client_name})</div>
                      <div>Manager: <strong style={{ color: '#0f172a' }}>{t.manager_name}</strong></div>
                      <div>Deadline: <strong style={{ color: '#dc2626' }}>{t.deadline}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TEAM DIRECTORY */}
          {activeTab === 'team' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
                  • COMPANY ROSTER
                </div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                  NovaWorks Team Directory ({teamDirectory.length})
                </h1>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                  Read-only employee directory supplied to the AI engine for role-based assignment.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {teamDirectory.map(m => (
                  <div key={m.id} style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{m.name}</span>
                      <span style={{ fontSize: 11, background: '#f5f3ff', color: '#6366f1', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{m.id}</span>
                    </div>
                    <div style={{ color: '#6366f1', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{m.role} • {m.specialization}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Skills: <strong>{Array.isArray(m.skills) ? m.skills.join(', ') : m.skills}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
