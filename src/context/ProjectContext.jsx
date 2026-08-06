import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECT, INITIAL_FEATURES, DEVELOPERS_LIST } from '../services/sampleData';
import { INITIAL_USERS } from '../services/sampleUsers';
import { INITIAL_CHAT_CHANNELS, INITIAL_CHAT_MESSAGES, INITIAL_DIRECT_MESSAGES } from '../services/sampleChat';
import { analyzeRequirementDocument, generateSubtasksForFeature } from '../services/openaiService';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  // Database Connection Status State
  const [dbStatus, setDbStatus] = useState('connecting'); // 'connected' | 'disconnected' | 'syncing'

  // Dynamic API Base URL resolution with candidate fallbacks
  const getApiCandidateUrls = () => {
    const urls = [];
    if (import.meta.env.VITE_API_URL) urls.push(import.meta.env.VITE_API_URL);
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol || 'http:';
      urls.push(`${window.location.origin}/api`);
      if (hostname) {
        urls.push(`${protocol}//${hostname}:5000/api`);
      }
    }
    urls.push('/api');
    urls.push('http://127.0.0.1:5000/api');
    urls.push('http://localhost:5000/api');
    return [...new Set(urls)];
  };

  const getApiUrl = () => {
    return getApiCandidateUrls()[0];
  };

  const API_BASE = getApiUrl();

  const apiFetch = async (endpointPath, options = {}) => {
    const candidateUrls = getApiCandidateUrls();
    for (const baseUrl of candidateUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      try {
        const cleanBase = baseUrl.replace(/\/+$/, '');
        const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
        const res = await fetch(`${cleanBase}${cleanPath}`, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res && res.ok) {
          return res;
        }
      } catch (e) {
        clearTimeout(timeoutId);
      }
    }
    return null;
  };

  // Users List State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('pm_system_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS;
  });

  // Current Logged In User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pm_system_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  // Projects List State
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('pm_system_projects_list');
    if (savedProjects) {
      try { return JSON.parse(savedProjects); } catch (e) { console.error(e); }
    }
    return [INITIAL_PROJECT];
  });

  // Chat & Direct Messages State
  const [chatMessages, setChatMessages] = useState(() => {
    const savedChat = localStorage.getItem('pm_system_chat_messages');
    if (savedChat) {
      try { return JSON.parse(savedChat); } catch (e) { console.error(e); }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [directMessages, setDirectMessages] = useState(() => {
    const savedDMs = localStorage.getItem('pm_system_direct_messages');
    if (savedDMs) {
      try { return JSON.parse(savedDMs); } catch (e) { console.error(e); }
    }
    return INITIAL_DIRECT_MESSAGES;
  });

  const [chatChannels, setChatChannels] = useState(() => {
    const savedChannels = localStorage.getItem('pm_system_chat_channels');
    if (savedChannels) {
      try { return JSON.parse(savedChannels); } catch (e) { console.error(e); }
    }
    return INITIAL_CHAT_CHANNELS;
  });

  // Active Voice / Video Call State
  const [activeCall, setActiveCall] = useState(null);

  // Filter accessible projects based on user role
  const accessibleProjects = projects.filter(p => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    if (currentUser.assignedProjectIds && currentUser.assignedProjectIds.includes('all')) return true;
    return currentUser.assignedProjectIds && currentUser.assignedProjectIds.includes(p.id);
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem('pm_system_active_project_id') || INITIAL_PROJECT.id;
  });

  // Ensure activeProjectId is valid for current user
  useEffect(() => {
    if (accessibleProjects.length > 0) {
      const exists = accessibleProjects.some(p => p.id === activeProjectId);
      if (!exists) {
        setActiveProjectId(accessibleProjects[0].id);
      }
    }
  }, [currentUser, projects]);

  // Active Project object
  const activeProject = accessibleProjects.find(p => p.id === activeProjectId) || accessibleProjects[0] || INITIAL_PROJECT;

  // Features list
  const [features, setFeatures] = useState(() => {
    const saved = localStorage.getItem('pm_system_features');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FEATURES.map(f => ({ ...f, projectId: INITIAL_PROJECT.id }));
  });

  const [developers] = useState(DEVELOPERS_LIST);

  // Modals & UI States
  const [pendingAiFeatures, setPendingAiFeatures] = useState([]);
  const [isAiReviewOpen, setIsAiReviewOpen] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);

  const [selectedFeatureDetail, setSelectedFeatureDetail] = useState(null);
  const [subtaskGenTargetFeature, setSubtaskGenTargetFeature] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModuleFilter, setActiveModuleFilter] = useState('All');
  const [activePriorityFilter, setActivePriorityFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('modules');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch live state from MongoDB backend API
  const loadFromMongoDB = async () => {
    try {
      const usersRes = await apiFetch('/users');
      if (usersRes && usersRes.ok) {
        const dbUsers = await usersRes.json();
        const [pRes, fRes, cRes] = await Promise.all([
          apiFetch('/projects'),
          apiFetch('/features'),
          apiFetch('/chat')
        ]);

        const dbProjects = (pRes && pRes.ok) ? await pRes.json() : [];
        const dbFeatures = (fRes && fRes.ok) ? await fRes.json() : [];
        const dbChat = (cRes && cRes.ok) ? await cRes.json() : [];

        if (Array.isArray(dbUsers) && dbUsers.length > 0) {
          setUsers(dbUsers);
          localStorage.setItem('pm_system_users', JSON.stringify(dbUsers));
        }
        if (Array.isArray(dbProjects) && dbProjects.length > 0) {
          setProjects(dbProjects);
          localStorage.setItem('pm_system_projects_list', JSON.stringify(dbProjects));
        }
        if (Array.isArray(dbFeatures)) {
          setFeatures(dbFeatures);
          localStorage.setItem('pm_system_features', JSON.stringify(dbFeatures));
        }
        if (Array.isArray(dbChat)) {
          const channelMsgs = dbChat.filter(m => m && !m.isDirect && (m.channel || !m.recipientId));
          const dmMssgs = dbChat.filter(m => m && (m.isDirect || m.recipientId));

          setChatMessages(channelMsgs);
          setDirectMessages(dmMssgs);
        }

        setDbStatus('connected');
      } else {
        setDbStatus('disconnected');
      }
    } catch (err) {
      console.log('MongoDB server offline, using local storage fallback.');
      setDbStatus('disconnected');
    }
  };

  // Real-time Live Polling Interval (fetches new messages & data every 3s without page reload)
  useEffect(() => {
    loadFromMongoDB();
    const pollInterval = setInterval(() => {
      loadFromMongoDB();
    }, 3000);
    return () => clearInterval(pollInterval);
  }, []);

  // Sync locally stored projects/users/features to MongoDB
  const syncLocalStorageToDatabase = async () => {
    setDbStatus('syncing');
    showToast('Syncing local storage data to MongoDB database...', 'info');
    try {
      const uRes = await apiFetch('/users');
      if (!uRes || !uRes.ok) {
        setDbStatus('disconnected');
        showToast('Sync Failed: Could not connect to backend server on Port 5000.', 'error');
        return;
      }

      const dbUsers = await uRes.json();
      const pRes = await apiFetch('/projects');
      const fRes = await apiFetch('/features');

      const dbProjects = (pRes && pRes.ok) ? await pRes.json() : [];
      const dbFeatures = (fRes && fRes.ok) ? await fRes.json() : [];

      const dbUserIds = new Set(dbUsers.map(u => String(u.id || u.username)));
      const dbProjectIds = new Set(dbProjects.map(p => String(p.id)));
      const dbFeatureIds = new Set(dbFeatures.map(f => String(f.id)));

      let syncedCount = 0;

      for (const p of projects) {
        if (!dbProjectIds.has(String(p.id))) {
          await apiFetch('/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p)
          });
          syncedCount++;
        }
      }

      for (const u of users) {
        const uKey = String(u.id || u.username);
        if (!dbUserIds.has(uKey)) {
          await apiFetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(u)
          });
          syncedCount++;
        }
      }

      for (const f of features) {
        if (!dbFeatureIds.has(String(f.id))) {
          await apiFetch('/features', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(f)
          });
          syncedCount++;
        }
      }

      await loadFromMongoDB();
      setDbStatus('connected');
      showToast(`Database Sync Complete! ${syncedCount} item(s) pushed to MongoDB.`, 'success');
    } catch (err) {
      console.error('Sync error:', err);
      setDbStatus('disconnected');
      showToast('Database Sync failed. Check server connection.', 'error');
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pm_system_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pm_system_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pm_system_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pm_system_projects_list', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pm_system_active_project_id', activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem('pm_system_features', JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem('pm_system_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('pm_system_direct_messages', JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    localStorage.setItem('pm_system_chat_channels', JSON.stringify(chatChannels));
  }, [chatChannels]);

  // Auth Functions
  const loginUser = async (username, password) => {
    const cleanUsername = username.trim().toLowerCase();

    // 1. Check local users state first
    let found = users.find(
      u => u.username.toLowerCase() === cleanUsername && u.password === password
    );

    // 2. If not found locally, fetch latest users from backend MongoDB API
    if (!found) {
      try {
        const res = await apiFetch('/users');
        if (res && res.ok) {
          const uData = await res.json();
          if (Array.isArray(uData) && uData.length > 0) {
            setUsers(uData);
            found = uData.find(
              u => u.username.toLowerCase() === cleanUsername && u.password === password
            );
          }
        }
      } catch (err) {
        console.error('Error checking users from API during login:', err);
      }
    }

    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const createUserAccount = async (userObj) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      password: userObj.password || 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      ...userObj
    };
    setUsers(prev => [...prev, newUser]);

    try {
      const res = await apiFetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res && res.ok) {
        showToast(`Created developer account: User ID "${newUser.username}" (Synced to MongoDB)!`, 'success');
        setDbStatus('connected');
      } else {
        showToast(`Created developer account: User ID "${newUser.username}" (Saved locally)`, 'warning');
      }
    } catch (err) {
      console.log('MongoDB server offline, saved locally.');
      showToast(`Created developer account: User ID "${newUser.username}" (Saved locally)`, 'warning');
    }
  };

  const updateUserAccount = async (userId, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }

    try {
      const res = await apiFetch(`/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res && res.ok) {
        showToast('User credentials updated & synced to MongoDB!', 'success');
        setDbStatus('connected');
      } else {
        showToast('User credentials updated locally.', 'info');
      }
    } catch (err) {
      showToast('User credentials updated locally.', 'info');
    }
  };

  const updateUserProfile = async (userId, profileData) => {
    await updateUserAccount(userId, profileData);
  };

  const getDeveloperWorkloadStats = (userOrName) => {
    let targetName = '';
    let userObj = null;

    if (typeof userOrName === 'string') {
      userObj = users.find(u => u.id === userOrName || u.username === userOrName || u.name.toLowerCase() === userOrName.toLowerCase());
      targetName = userObj ? userObj.name : userOrName;
    } else if (userOrName && typeof userOrName === 'object') {
      userObj = userOrName;
      targetName = userObj.name;
    }

    const allAssignedFeatures = features.filter(f => {
      if (!f.assignedDev) return false;
      return f.assignedDev.toLowerCase() === targetName.toLowerCase() ||
             (userObj && f.developerId === userObj.id);
    });

    const totalFeaturesCount = allAssignedFeatures.length;
    const projectBreakdownMap = {};

    projects.forEach(p => {
      projectBreakdownMap[p.id] = {
        projectId: p.id,
        projectName: p.name,
        assignedFeatures: [],
        completedFeaturesCount: 0,
        totalSubtasks: 0,
        completedSubtasks: 0,
        totalEstimatedHours: 0,
        completedHours: 0,
        workloadSharePercent: 0,
        projectCompletionRate: 0
      };
    });

    allAssignedFeatures.forEach(f => {
      const pId = f.projectId || (projects[0] ? projects[0].id : 'proj-kichu-kori');
      if (!projectBreakdownMap[pId]) {
        projectBreakdownMap[pId] = {
          projectId: pId,
          projectName: 'Project (' + pId + ')',
          assignedFeatures: [],
          completedFeaturesCount: 0,
          totalSubtasks: 0,
          completedSubtasks: 0,
          totalEstimatedHours: 0,
          completedHours: 0,
          workloadSharePercent: 0,
          projectCompletionRate: 0
        };
      }

      const pEntry = projectBreakdownMap[pId];
      pEntry.assignedFeatures.push(f);

      let hrs = 12;
      if (f.complexity) {
        const match = f.complexity.match(/\d+/);
        if (match) hrs = parseInt(match[0], 10);
      }
      pEntry.totalEstimatedHours += hrs;

      if (f.status === 'Done') {
        pEntry.completedFeaturesCount += 1;
        pEntry.completedHours += hrs;
      }

      if (f.subtasks && f.subtasks.length > 0) {
        pEntry.totalSubtasks += f.subtasks.length;
        const doneSt = f.subtasks.filter(s => s.completed).length;
        pEntry.completedSubtasks += doneSt;
      }
    });

    const projectBreakdownList = Object.values(projectBreakdownMap).map(pEntry => {
      const assignedCount = pEntry.assignedFeatures.length;
      const workloadSharePercent = totalFeaturesCount > 0 
        ? Math.round((assignedCount / totalFeaturesCount) * 100) 
        : 0;

      let projectCompletionRate = 0;
      if (assignedCount > 0) {
        if (pEntry.totalSubtasks > 0) {
          projectCompletionRate = Math.round((pEntry.completedSubtasks / pEntry.totalSubtasks) * 100);
        } else {
          projectCompletionRate = Math.round((pEntry.completedFeaturesCount / assignedCount) * 100);
        }
      }

      return {
        ...pEntry,
        workloadSharePercent,
        projectCompletionRate
      };
    });

    const totalCompletedFeatures = allAssignedFeatures.filter(f => f.status === 'Done').length;
    const overallCompletionRate = totalFeaturesCount > 0 
      ? Math.round((totalCompletedFeatures / totalFeaturesCount) * 100) 
      : 0;

    return {
      user: userObj,
      developerName: targetName,
      totalFeaturesCount,
      totalCompletedFeatures,
      overallCompletionRate,
      projectBreakdownList
    };
  };

  const deleteUserAccount = async (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('User account removed.', 'info');

    try {
      await apiFetch(`/users/${userId}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  };

  // Chat & Calls Functions
  const startChannelCall = (channel, callType = 'video') => {
    setActiveCall({ isDirect: false, channel, type: callType, startedAt: Date.now() });
    injectSystemChatNotification(`📞 ${currentUser?.name || 'User'} started a ${callType === 'video' ? 'Video Conference' : 'Voice Huddle'} in #${channel}`);
    showToast(`Started ${callType} call in #${channel}!`, 'info');
  };

  const startDirectCall = (targetUser, callType = 'video') => {
    setActiveCall({ isDirect: true, targetUser, type: callType, startedAt: Date.now() });
    showToast(`Calling ${targetUser.name}...`, 'info');
  };

  const leaveChannelCall = () => {
    if (activeCall && !activeCall.isDirect) {
      injectSystemChatNotification(`📞 Call ended in #${activeCall.channel}`);
    }
    setActiveCall(null);
    showToast('Left the call.', 'info');
  };

  const sendDirectMessage = async (recipientId, text) => {
    if (!currentUser) return;
    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newDM = {
      id: `dm-${Date.now()}`,
      projectId: activeProjectId,
      senderId: currentUser.id,
      recipientId,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'admin' ? '👑 Admin / PM' : `💻 ${currentUser.devRole || 'Developer'}`,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: timestampStr,
      isDirect: true
    };

    setDirectMessages(prev => [...prev, newDM]);

    try {
      await apiFetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDM)
      });
    } catch (e) {}
  };

  const createChatChannel = ({ name, description }) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newChan = {
      id: slug,
      name: slug,
      description: description || `${name} channel discussion`
    };
    setChatChannels(prev => [...prev, newChan]);
    showToast(`Created chat channel #${slug}!`, 'success');
    injectSystemChatNotification(`📢 ${currentUser?.name || 'Admin'} created new channel: #${slug}`);
    return slug;
  };

  const sendChatMessage = async (channel, text) => {
    if (!currentUser) return;
    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `msg-${Date.now()}`,
      projectId: activeProjectId,
      channel,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'admin' ? '👑 Admin / PM' : `💻 ${currentUser.devRole || 'Developer'}`,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: timestampStr,
      isDirect: false
    };

    setChatMessages(prev => [...prev, newMsg]);

    try {
      await apiFetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
    } catch (e) {}
  };

  const injectSystemChatNotification = (text) => {
    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const systemMsg = {
      id: `msg-sys-${Date.now()}`,
      projectId: activeProjectId,
      channel: 'general',
      senderName: 'System Bot',
      senderRole: 'System',
      senderAvatar: '',
      text,
      timestamp: timestampStr
    };

    setChatMessages(prev => [...prev, systemMsg]);
  };

  // Vault Actions
  const addProjectRepo = (projectId, repoObj) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const repos = p.repositories || [];
        return { ...p, repositories: [repoObj, ...repos] };
      }
      return p;
    }));
    showToast('Added Git Repository to project vault!', 'success');
    injectSystemChatNotification(`📦 Added Git Repository: "${repoObj.name}" (${repoObj.url})`);
  };

  const deleteProjectRepo = (projectId, repoId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const repos = (p.repositories || []).filter(r => r.id !== repoId);
        return { ...p, repositories: repos };
      }
      return p;
    }));
    showToast('Repository removed from vault.', 'info');
  };

  const addCustomEnvCategory = (projectId, categoryName) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const customCats = p.customEnvCategories || [];
        if (!customCats.includes(categoryName)) {
          return { ...p, customEnvCategories: [...customCats, categoryName] };
        }
      }
      return p;
    }));
    showToast(`Created Custom Env Tech Stack: "${categoryName}"!`, 'success');
  };

  const addProjectEnvVar = (projectId, envObj) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const envs = p.environmentVars || [];
        return { ...p, environmentVars: [envObj, ...envs] };
      }
      return p;
    }));
    showToast(`Added Environment Variable ${envObj.key}`, 'success');
    injectSystemChatNotification(`🔑 Updated .env Vault: Added "${envObj.key}" under ${envObj.category}`);
  };

  const saveBulkCategoryEnv = (projectId, categoryKey, bulkText) => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existingEnvs = p.environmentVars || [];
        const otherCategoryEnvs = existingEnvs.filter(e => e.category !== categoryKey);
        
        const newCategoryEnvs = lines.map((line, idx) => {
          const parts = line.split('=');
          const k = parts[0] ? parts[0].trim().toUpperCase() : `KEY_${idx}`;
          const v = parts.slice(1).join('=').trim();
          const isSec = k.includes('KEY') || k.includes('SECRET') || k.includes('PASS') || k.includes('TOKEN') || k.includes('URL');
          return {
            id: `env-bulk-${Date.now()}-${idx}`,
            key: k,
            value: v,
            category: categoryKey,
            isSecret: isSec
          };
        });

        return { ...p, environmentVars: [...otherCategoryEnvs, ...newCategoryEnvs] };
      }
      return p;
    }));
    showToast(`Saved raw .env variables for ${categoryKey}!`, 'success');
  };

  const deleteProjectEnvVar = (projectId, envId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const envs = (p.environmentVars || []).filter(e => e.id !== envId);
        return { ...p, environmentVars: envs };
      }
      return p;
    }));
    showToast('Environment variable removed.', 'info');
  };

  const addQuickLink = (projectId, linkObj) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const links = p.quickLinks || [];
        return { ...p, quickLinks: [linkObj, ...links] };
      }
      return p;
    }));
    showToast(`Added Quick Link "${linkObj.title}"!`, 'success');
  };

  const deleteQuickLink = (projectId, linkId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const links = (p.quickLinks || []).filter(l => l.id !== linkId);
        return { ...p, quickLinks: links };
      }
      return p;
    }));
    showToast('Quick link deleted.', 'info');
  };

  // Target Deadline & Timeline Info Helpers
  const getProjectTimelineInfo = (proj = activeProject) => {
    if (!proj) return { daysRemaining: 0, status: 'On Track', label: 'No Target Date Set', color: 'indigo' };

    const startDateStr = proj.startDate || '2026-07-01';
    const targetDateStr = proj.targetCompletionDate || '2026-08-31';

    const now = new Date();
    const target = new Date(targetDateStr);
    const start = new Date(startDateStr);

    const totalDays = Math.max(1, Math.ceil((target - start) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.max(0, totalDays - daysRemaining);
    const timeElapsedPercent = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));

    let status = 'On Track';
    let color = 'indigo';

    if (overallProgress >= 100) {
      status = 'Completed';
      color = 'emerald';
    } else if (daysRemaining < 0) {
      status = 'Overdue';
      color = 'rose';
    } else if (daysRemaining <= 7 && overallProgress < 80) {
      status = 'At Risk';
      color = 'amber';
    } else {
      status = 'On Track';
      color = 'emerald';
    }

    return {
      startDate: startDateStr,
      targetCompletionDate: targetDateStr,
      daysRemaining,
      totalDays,
      daysElapsed,
      timeElapsedPercent,
      status,
      color
    };
  };

  const setProjectTargetDate = (projectId, { startDate, targetCompletionDate }) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          startDate: startDate || p.startDate || '2026-07-01',
          targetCompletionDate: targetCompletionDate || p.targetCompletionDate || '2026-08-31'
        };
      }
      return p;
    }));

    // Sync to MongoDB backend API
    fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, targetCompletionDate })
    }).catch(err => console.error('Failed updating project target date in MongoDB:', err));

    showToast(`Target completion date updated to ${targetCompletionDate}!`, 'success');
    injectSystemChatNotification(`📅 Updated Project Target Completion Date to ${targetCompletionDate}`);
  };

  // Project features scoping
  const projectFeatures = features.filter(f => (f.projectId || INITIAL_PROJECT.id) === activeProjectId);

  // Dynamic modules list for active project
  const moduleList = activeProject.modules 
    ? activeProject.modules.map(m => typeof m === 'string' ? m : m.name)
    : ['Authentication', 'User Management', 'Dashboard', 'Payment', 'Admin Panel'];

  // Module & Feature Progress Calculation
  const getModuleProgress = (moduleName) => {
    const moduleFeatures = projectFeatures.filter(f => f.module === moduleName);
    if (moduleFeatures.length === 0) return 0;

    let totalSubtasks = 0;
    let completedSubtasks = 0;

    moduleFeatures.forEach(f => {
      if (f.subtasks && f.subtasks.length > 0) {
        totalSubtasks += f.subtasks.length;
        completedSubtasks += f.subtasks.filter(st => st.completed).length;
      } else {
        totalSubtasks += 1;
        if (f.status === 'Done') completedSubtasks += 1;
        else if (f.status === 'In Progress' || f.status === 'QA') completedSubtasks += 0.5;
      }
    });

    return Math.round((completedSubtasks / totalSubtasks) * 100);
  };

  const getFeatureProgress = (feature) => {
    if (!feature.subtasks || feature.subtasks.length === 0) {
      if (feature.status === 'Done') return 100;
      if (feature.status === 'In Progress' || feature.status === 'QA') return 50;
      return 0;
    }
    const completed = feature.subtasks.filter(st => st.completed).length;
    return Math.round((completed / feature.subtasks.length) * 100);
  };

  // Overall Project Progress calculation
  const overallProgress = moduleList.length > 0
    ? Math.round(moduleList.reduce((acc, mod) => acc + getModuleProgress(mod), 0) / moduleList.length)
    : 0;

  // Action: Create New Project
  const createNewProject = ({ name, description, modules }) => {
    const newProjId = `proj-${Date.now()}`;
    const moduleObjects = modules.map((mName, idx) => ({
      id: `mod-${Date.now()}-${idx}`,
      name: mName,
      description: `${mName} module requirements & scope`,
      progress: 0,
      color: ['#10B981', '#6366F1', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][idx % 6]
    }));

    const newProj = {
      id: newProjId,
      name,
      description: description || 'New software management project',
      overallProgress: 0,
      modules: moduleObjects,
      repositories: [
        { id: `repo-${Date.now()}-1`, name: `${name} Web Repo`, type: 'Frontend', url: `https://github.com/company/${name.toLowerCase().replace(/\s+/g, '-')}-web`, branch: 'main' },
        { id: `repo-${Date.now()}-2`, name: `${name} Backend API`, type: 'Backend', url: `https://github.com/company/${name.toLowerCase().replace(/\s+/g, '-')}-api`, branch: 'main' }
      ],
      environmentVars: [
        { id: `env-${Date.now()}-1`, key: 'VITE_API_URL', value: 'https://api.domain.com', category: 'Frontend', isSecret: false },
        { id: `env-${Date.now()}-2`, key: 'DATABASE_URL', value: 'postgresql://admin:secret@localhost:5432/app_db', category: 'Backend', isSecret: true }
      ],
      customEnvCategories: [],
      quickLinks: [
        { id: `link-${Date.now()}-1`, title: 'Figma UI/UX Mockups', url: 'https://figma.com/@mockups' },
        { id: `link-${Date.now()}-2`, title: 'API Swagger Docs', url: 'https://api.domain.com/docs' }
      ]
    };

    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProjId);
    showToast(`Created and switched to project "${name}"!`, 'success');

    fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj)
    }).catch(() => null);
  };

  // Action: AI Document Analysis
  const processDocumentWithAI = async (docText) => {
    setIsAiAnalyzing(true);
    setAnalysisError(null);
    try {
      const extractedFeatures = await analyzeRequirementDocument(docText);
      setPendingAiFeatures(extractedFeatures);
      setIsImporterOpen(false);
      setIsAiReviewOpen(true);
      showToast(`AI extracted ${extractedFeatures.length} features! Review before adding.`, 'info');
    } catch (err) {
      console.error(err);
      setAnalysisError('Failed to analyze document. Please try again.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Action: Approve & Add Features
  const approveAndAddSelectedFeatures = (approvedFeaturesList) => {
    if (approvedFeaturesList.length === 0) return;

    const formattedFeatures = approvedFeaturesList.map((f, idx) => ({
      id: `feat-approved-${Date.now()}-${idx}`,
      projectId: activeProjectId,
      name: f.name,
      description: f.description,
      module: f.module || (moduleList[0] || 'General'),
      priority: f.priority || 'Medium',
      complexity: f.complexity || 'Medium (12h)',
      devOrder: projectFeatures.length + idx + 1,
      assignedDev: developers[idx % developers.length].name,
      devAvatar: developers[idx % developers.length].avatar,
      deadline: new Date(Date.now() + (idx + 7) * 86400000).toISOString().split('T')[0],
      status: 'To Do',
      requirements: f.requirements || 'Extracted via AI document import.',
      acceptanceCriteria: f.acceptanceCriteria || ['Functionality verification pass'],
      dependencies: f.dependencies || ['None'],
      subtasks: (f.suggestedSubtasks || ['UI implementation', 'API integration', 'QA testing']).map((stTitle, stIdx) => ({
        id: `st-${Date.now()}-${idx}-${stIdx}`,
        title: stTitle,
        completed: false
      }))
    }));

    setFeatures(prev => [...formattedFeatures, ...prev]);
    setIsAiReviewOpen(false);
    setPendingAiFeatures([]);
    showToast(`Added ${formattedFeatures.length} AI-approved features!`, 'success');
    injectSystemChatNotification(`🤖 AI Imported ${formattedFeatures.length} new features into ${activeProject.name}`);

    formattedFeatures.forEach(feat => {
      fetch(`${API_BASE}/features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feat)
      }).catch(() => null);
    });
  };

  // Action: Add Manual Feature
  const addManualFeature = (featureData) => {
    const dev = developers.find(d => d.name === featureData.assignedDev) || developers[0];
    
    let acList = Array.isArray(featureData.acceptanceCriteria) 
      ? featureData.acceptanceCriteria 
      : (featureData.acceptanceCriteria || '').split('\n').filter(Boolean);
    if (acList.length === 0) acList = ['Feature requirement verification'];

    const newFeature = {
      id: `feat-manual-${Date.now()}`,
      projectId: activeProjectId,
      name: featureData.name,
      description: featureData.description,
      module: featureData.module || (moduleList[0] || 'General'),
      priority: featureData.priority || 'Medium',
      complexity: `${featureData.estimatedHours || 12} Hours`,
      devOrder: projectFeatures.length + 1,
      assignedDev: dev.name,
      devAvatar: dev.avatar,
      deadline: featureData.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: featureData.status || 'To Do',
      requirements: featureData.requirements || featureData.description,
      acceptanceCriteria: acList,
      dependencies: featureData.dependencies ? [featureData.dependencies] : ['None'],
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Form Validation & UI Component', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Backend API Integration', completed: false },
        { id: `st-${Date.now()}-3`, title: 'QA & Edge Case Testing', completed: false }
      ]
    };

    setFeatures(prev => [newFeature, ...prev]);
    setIsManualModalOpen(false);
    showToast(`Feature "${newFeature.name}" created manually!`, 'success');
    injectSystemChatNotification(`➕ ${currentUser?.name || 'Admin'} created new feature: "${newFeature.name}" assigned to ${dev.name}`);

    fetch(`${API_BASE}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeature)
    }).catch(() => null);
  };

  // Action: Move Feature Status
  const moveFeatureStatus = (featureId, newStatus) => {
    let updatedFeatObj = null;
    setFeatures(prev => prev.map(f => {
      if (f.id === featureId) {
        let updatedSubtasks = f.subtasks || [];
        if (newStatus === 'Done' && updatedSubtasks.length > 0) {
          updatedSubtasks = updatedSubtasks.map(s => ({ ...s, completed: true }));
        }
        updatedFeatObj = { ...f, status: newStatus, subtasks: updatedSubtasks };
        return updatedFeatObj;
      }
      return f;
    }));
    showToast(`Moved feature to "${newStatus}" status`, 'info');

    if (updatedFeatObj) {
      fetch(`${API_BASE}/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFeatObj)
      }).catch(() => null);
    }
  };

  // Action: Update Feature
  const updateFeature = (featureId, updatedFields) => {
    setFeatures(prev => prev.map(f => f.id === featureId ? { ...f, ...updatedFields } : f));
    if (selectedFeatureDetail && selectedFeatureDetail.id === featureId) {
      setSelectedFeatureDetail(prev => ({ ...prev, ...updatedFields }));
    }
    showToast('Feature updated.');

    fetch(`${API_BASE}/features/${featureId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    }).catch(() => null);
  };

  // Action: Delete Feature
  const deleteFeature = (featureId) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId));
    if (selectedFeatureDetail && selectedFeatureDetail.id === featureId) {
      setSelectedFeatureDetail(null);
    }
    showToast('Feature deleted.', 'info');

    fetch(`${API_BASE}/features/${featureId}`, {
      method: 'DELETE'
    }).catch(() => null);
  };

  // Action: Update Module Description
  const updateModuleDescription = (projectId, moduleName, newDescription) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedModules = (p.modules || []).map(m => {
        if (typeof m === 'string') {
          return m === moduleName ? { id: `mod-${Date.now()}`, name: m, description: newDescription, color: '#6366F1' } : m;
        }
        return m.name === moduleName ? { ...m, description: newDescription } : m;
      });
      return { ...p, modules: updatedModules };
    }));
    showToast(`Module "${moduleName}" description updated!`, 'success');
  };

  // Action: Add New Module
  const addModule = (projectId, moduleName) => {
    const trimmed = moduleName.trim();
    if (!trimmed) return;
    const moduleColors = ['#10B981', '#6366F1', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#14B8A6'];
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const existing = (p.modules || []).map(m => typeof m === 'string' ? m : m.name);
      if (existing.includes(trimmed)) {
        showToast(`Module "${trimmed}" already exists.`, 'info');
        return p;
      }
      const newMod = {
        id: `mod-${Date.now()}`,
        name: trimmed,
        description: `${trimmed} module requirements & scope`,
        progress: 0,
        color: moduleColors[(p.modules || []).length % moduleColors.length]
      };
      return { ...p, modules: [...(p.modules || []), newMod] };
    }));
    showToast(`Module "${trimmed}" added!`, 'success');
  };

  // Action: Rename Module (also updates features)
  const updateModuleName = (projectId, oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    // Update project module object
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedModules = (p.modules || []).map(m => {
        if (typeof m === 'string') return m === oldName ? trimmed : m;
        return m.name === oldName ? { ...m, name: trimmed } : m;
      });
      return { ...p, modules: updatedModules };
    }));
    // Also rename module in all features of this project
    setFeatures(prev => prev.map(f =>
      f.projectId === projectId && f.module === oldName ? { ...f, module: trimmed } : f
    ));
    showToast(`Module renamed to "${trimmed}"!`, 'success');
  };

  // Action: Delete Module
  const deleteModule = (projectId, moduleName) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedModules = (p.modules || []).filter(m =>
        typeof m === 'string' ? m !== moduleName : m.name !== moduleName
      );
      return { ...p, modules: updatedModules };
    }));
    // Features in deleted module get reassigned to 'General'
    setFeatures(prev => prev.map(f =>
      f.projectId === projectId && f.module === moduleName ? { ...f, module: 'General' } : f
    ));
    showToast(`Module "${moduleName}" deleted. Features moved to General.`, 'info');
  };

  // Action: Toggle Subtask
  const toggleSubtask = (featureId, subtaskId) => {
    let updatedFeatObj = null;
    setFeatures(prev => prev.map(f => {
      if (f.id === featureId) {
        const updatedSubtasks = (f.subtasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const total = updatedSubtasks.length;
        const done = updatedSubtasks.filter(st => st.completed).length;
        let newStatus = f.status;
        if (done === total && total > 0) newStatus = 'Done';
        else if (done > 0 && f.status === 'To Do') newStatus = 'In Progress';

        const updatedFeat = { ...f, subtasks: updatedSubtasks, status: newStatus };
        updatedFeatObj = updatedFeat;
        if (selectedFeatureDetail && selectedFeatureDetail.id === featureId) {
          setSelectedFeatureDetail(updatedFeat);
        }
        return updatedFeat;
      }
      return f;
    }));

    if (updatedFeatObj) {
      fetch(`${API_BASE}/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFeatObj)
      }).catch(() => null);
    }
  };

  // Action: Add Subtasks to Feature
  const addSubtasksToFeature = (featureId, newTitlesArray) => {
    let updatedFeatObj = null;
    setFeatures(prev => prev.map(f => {
      if (f.id === featureId) {
        const existingTitles = new Set((f.subtasks || []).map(s => s.title.toLowerCase()));
        const additions = newTitlesArray
          .filter(t => !existingTitles.has(t.toLowerCase()))
          .map((t, idx) => ({
            id: `st-gen-${Date.now()}-${idx}`,
            title: t,
            completed: false
          }));

        const updatedSubtasks = [...(f.subtasks || []), ...additions];
        const updatedFeat = { ...f, subtasks: updatedSubtasks };
        updatedFeatObj = updatedFeat;
        if (selectedFeatureDetail && selectedFeatureDetail.id === featureId) {
          setSelectedFeatureDetail(updatedFeat);
        }
        return updatedFeat;
      }
      return f;
    }));
    showToast(`Added subtasks to feature!`, 'success');

    if (updatedFeatObj) {
      fetch(`${API_BASE}/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFeatObj)
      }).catch(() => null);
    }
  };

  // Filtered features list
  const filteredFeatures = projectFeatures.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = activeModuleFilter === 'All' || f.module === activeModuleFilter;
    const matchesPriority = activePriorityFilter === 'All' || f.priority === activePriorityFilter;
    return matchesSearch && matchesModule && matchesPriority;
  });

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setProjects([INITIAL_PROJECT]);
    setActiveProjectId(INITIAL_PROJECT.id);
    setFeatures(INITIAL_FEATURES.map(f => ({ ...f, projectId: INITIAL_PROJECT.id })));
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setDirectMessages(INITIAL_DIRECT_MESSAGES);
    setChatChannels(INITIAL_CHAT_CHANNELS);
    setActiveCall(null);
    localStorage.clear();
    showToast('Reset system to default state.', 'info');
  };

  return (
    <ProjectContext.Provider value={{
      users,
      currentUser,
      loginUser,
      logoutUser,
      createUserAccount,
      updateUserAccount,
      updateUserProfile,
      getDeveloperWorkloadStats,
      deleteUserAccount,
      isUserManagementModalOpen,
      setIsUserManagementModalOpen,

      // Chat, DMs & Calls
      chatMessages,
      directMessages,
      sendDirectMessage,
      chatChannels,
      createChatChannel,
      sendChatMessage,
      activeCall,
      startChannelCall,
      startDirectCall,
      leaveChannelCall,

      projects: accessibleProjects,
      allProjects: projects,
      activeProject,
      activeProjectId,
      setActiveProjectId,
      createNewProject,
      isNewProjectModalOpen,
      setIsNewProjectModalOpen,

      // Vault Actions
      addProjectRepo,
      deleteProjectRepo,
      addCustomEnvCategory,
      addProjectEnvVar,
      saveBulkCategoryEnv,
      deleteProjectEnvVar,
      addQuickLink,
      deleteQuickLink,

      features: projectFeatures,
      filteredFeatures,
      developers,
      moduleList,
      overallProgress,
      getModuleProgress,
      getFeatureProgress,
      
      // AI & Importer states
      pendingAiFeatures,
      setPendingAiFeatures,
      isAiReviewOpen,
      setIsAiReviewOpen,
      isAiAnalyzing,
      analysisError,
      processDocumentWithAI,
      approveAndAddSelectedFeatures,

      // Modals
      isImporterOpen,
      setIsImporterOpen,
      isManualModalOpen,
      setIsManualModalOpen,
      isDeadlineModalOpen,
      setIsDeadlineModalOpen,
      getProjectTimelineInfo,
      setProjectTargetDate,
      selectedFeatureDetail,
      setSelectedFeatureDetail,
      subtaskGenTargetFeature,
      setSubtaskGenTargetFeature,

      // Actions
      addManualFeature,
      moveFeatureStatus,
      updateFeature,
      deleteFeature,
      toggleSubtask,
      addSubtasksToFeature,
      updateModuleDescription,
      updateModuleName,
      addModule,
      deleteModule,
      resetToDefaultData,

      // Filters & Views
      searchQuery,
      setSearchQuery,
      activeModuleFilter,
      setActiveModuleFilter,
      activePriorityFilter,
      setActivePriorityFilter,
      activeTab,
      setActiveTab,
      toastMessage,

      // DB Status & Sync
      dbStatus,
      syncLocalStorageToDatabase,
      loadFromMongoDB,
      API_BASE
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}
