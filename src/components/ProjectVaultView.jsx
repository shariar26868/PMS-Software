import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Key, GitBranch, ExternalLink, Copy, Eye, EyeOff, Plus, Trash2, Shield, Check, Globe, Terminal, FileCode, Layers, FolderPlus } from 'lucide-react';

export default function ProjectVaultView() {
  const {
    activeProject,
    addProjectRepo,
    deleteProjectRepo,
    addCustomEnvCategory,
    addProjectEnvVar,
    saveBulkCategoryEnv,
    deleteProjectEnvVar,
    addQuickLink,
    deleteQuickLink
  } = useProject();

  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  // Repositories Form State
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoType, setNewRepoType] = useState('Frontend');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoBranch, setNewRepoBranch] = useState('main');

  // Custom Tech Stack Category State
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Active inline adding variable state
  const [activeAddCategory, setActiveAddCategory] = useState(null);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(true);

  // Raw Bulk Edit State per section
  const [bulkEditCategory, setBulkEditCategory] = useState(null);
  const [bulkText, setBulkText] = useState('');

  // Quick Links Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const repos = activeProject?.repositories || [];
  const envVars = activeProject?.environmentVars || [];
  const customCategories = activeProject?.customEnvCategories || [];
  
  // Default Quick Links fallback so it's never empty
  const quickLinks = (activeProject?.quickLinks && activeProject.quickLinks.length > 0)
    ? activeProject.quickLinks
    : [
        { id: 'link-default-1', title: 'Figma UI/UX Mockups', url: 'https://figma.com/@kichukori-design' },
        { id: 'link-default-2', title: 'Swagger API Documentation', url: 'https://api.kichukori.com/docs' },
        { id: 'link-default-3', title: 'Staging Server Console', url: 'https://staging.kichukori.com' }
      ];

  // Default Categories + Custom Categories
  const defaultCategoryKeys = ['Frontend', 'Backend', 'AI Service', 'Database'];
  const allCategoryKeys = Array.from(new Set([...defaultCategoryKeys, ...customCategories]));

  const categoryTitles = {
    'Frontend': '🌐 Frontend Environment (.env.frontend)',
    'Backend': '⚙️ Backend Environment (.env.backend)',
    'AI Service': '🤖 AI & LLM Engine Environment (.env.ai)',
    'Database': '🗄️ Database & Cloud Cluster Secrets'
  };

  const toggleSecretReveal = (id) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, keyName) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyCategoryEnv = (categoryKey) => {
    const categoryVars = envVars.filter(e => e.category === categoryKey);
    const formatted = categoryVars.map(e => `${e.key}=${e.value}`).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopiedKey(`cat-${categoryKey}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddRepo = (e) => {
    e.preventDefault();
    if (!newRepoName.trim() || !newRepoUrl.trim()) return;

    addProjectRepo(activeProject.id, {
      id: `repo-${Date.now()}`,
      name: newRepoName.trim(),
      type: newRepoType,
      url: newRepoUrl.trim(),
      branch: newRepoBranch.trim() || 'main'
    });

    setNewRepoName('');
    setNewRepoUrl('');
    setIsAddingRepo(false);
  };

  const handleCreateCustomCategory = (e) => {
    e.preventDefault();
    if (!customCategoryInput.trim()) return;
    addCustomEnvCategory(activeProject.id, customCategoryInput.trim());
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
  };

  const handleAddCategoryVar = (categoryKey) => {
    if (!newKey.trim() || !newVal.trim()) {
      alert('Please enter both Variable Key and Value');
      return;
    }

    addProjectEnvVar(activeProject.id, {
      id: `env-${Date.now()}`,
      key: newKey.trim().toUpperCase(),
      value: newVal.trim(),
      category: categoryKey,
      isSecret: newIsSecret
    });

    setNewKey('');
    setNewVal('');
    setActiveAddCategory(null);
  };

  const startBulkEdit = (catKey) => {
    const categoryVars = envVars.filter(e => e.category === catKey);
    const formatted = categoryVars.map(e => `${e.key}=${e.value}`).join('\n');
    setBulkText(formatted);
    setBulkEditCategory(catKey);
  };

  const handleSaveBulkEdit = (catKey) => {
    saveBulkCategoryEnv(activeProject.id, catKey, bulkText);
    setBulkEditCategory(null);
    setCopiedKey(`saved-${catKey}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddQuickLinkSubmit = (e) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    addQuickLink(activeProject.id, {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim()
    });

    setNewLinkTitle('');
    setNewLinkUrl('');
    setIsAddingLink(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Project Vault: Repositories, Environment Blocks & Links
            </h2>
            <p className="text-xs text-slate-400">
              Store repositories, Frontend / Backend / AI / Custom tech stacks, and quick links for <strong className="text-indigo-400">{activeProject.name}</strong>
            </p>
          </div>
        </div>

        {/* Add Custom Tech Stack Section Button */}
        <button
          onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Add Custom Tech Stack / Env Section</span>
        </button>
      </div>

      {/* Custom Category Form */}
      {isAddingCustomCategory && (
        <form onSubmit={handleCreateCustomCategory} className="bg-slate-900 border border-purple-500/40 p-5 rounded-3xl space-y-3">
          <h4 className="text-sm font-bold text-purple-300">Create Custom Environment Section / Tech Stack</h4>
          <div className="flex gap-3">
            <input
              type="text"
              required
              placeholder="e.g. Payment Microservice, Docker Compose, Mobile App Env, Redis Vault"
              value={customCategoryInput}
              onChange={e => setCustomCategoryInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
              Create Section Block
            </button>
            <button type="button" onClick={() => setIsAddingCustomCategory(false)} className="px-4 py-2 text-xs text-slate-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* SECTION 1: ENVIRONMENT VAULT CARDS (FRONTEND, BACKEND, AI, DATABASE, CUSTOM) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            Environment Secrets Vault (.env)
          </h3>
          <p className="text-xs text-slate-400">Click '+ Add Variable' inside any section to store keys for that specific stack</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {allCategoryKeys.map((catKey) => {
            const catVars = envVars.filter(e => e.category === catKey);
            const isAdding = activeAddCategory === catKey;
            const isBulking = bulkEditCategory === catKey;
            const title = categoryTitles[catKey] || `🚀 ${catKey} Environment (.env.${catKey.toLowerCase().replace(/\s+/g, '')})`;

            return (
              <div key={catKey} className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4">
                
                {/* Block Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-slate-100">{title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {catVars.length} variables
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Copy All .env button */}
                    <button
                      onClick={() => copyCategoryEnv(catKey)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
                      title="Copy all variables in .env format"
                    >
                      {copiedKey === `cat-${catKey}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{copiedKey === `cat-${catKey}` ? 'Copied!' : 'Copy .env'}</span>
                    </button>

                    {/* Bulk Raw Edit toggle */}
                    <button
                      onClick={() => isBulking ? setBulkEditCategory(null) : startBulkEdit(catKey)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-slate-700 transition-all"
                      title="Paste multi-line .env content"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{isBulking ? 'Close Editor' : 'Paste Raw .env'}</span>
                    </button>

                    {/* + Add Variable button inside block */}
                    <button
                      onClick={() => setActiveAddCategory(isAdding ? null : catKey)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Variable</span>
                    </button>
                  </div>
                </div>

                {/* Bulk Raw Editor Mode */}
                {isBulking && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/40 space-y-3">
                    <label className="text-xs font-semibold text-purple-300 block">
                      Paste or Edit Multi-line Raw .env Content for {catKey}:
                    </label>
                    <textarea
                      rows={6}
                      value={bulkText}
                      onChange={e => setBulkText(e.target.value)}
                      placeholder={`KEY1=value1\nKEY2=value2\nKEY3=value3`}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setBulkEditCategory(null)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
                      <button onClick={() => handleSaveBulkEdit(catKey)} className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                        Save Bulk .env List
                      </button>
                    </div>
                  </div>
                )}

                {/* Add Inline Variable Form */}
                {isAdding && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 space-y-3">
                    <h5 className="text-xs font-bold text-indigo-300">Add Variable to {catKey}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Variable Key *</label>
                        <input
                          type="text"
                          placeholder="e.g. VITE_API_URL"
                          value={newKey}
                          onChange={e => setNewKey(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-indigo-300 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Variable Value *</label>
                        <input
                          type="text"
                          placeholder="e.g. https://api.domain.com"
                          value={newVal}
                          onChange={e => setNewVal(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-emerald-300 font-mono"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={newIsSecret}
                            onChange={e => setNewIsSecret(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                          />
                          <span>Mask Secret (👁️)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddCategoryVar(catKey)}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
                        >
                          Save Key
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Variables List inside Card Block */}
                <div className="space-y-2.5">
                  {catVars.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800/60">
                      No variables added for {catKey} yet. Click <strong className="text-indigo-400">+ Add Variable</strong> or <strong className="text-purple-400">Paste Raw .env</strong> above.
                    </div>
                  ) : (
                    catVars.map((env) => {
                      const isRevealed = !env.isSecret || revealedSecrets[env.id];
                      const displayValue = isRevealed ? env.value : '••••••••••••••••••••••••••••••••';

                      return (
                        <div key={env.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-all">
                          
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xs font-mono font-bold text-indigo-200 shrink-0">{env.key}</span>
                            <span className="text-slate-600 font-mono text-xs font-bold shrink-0">=</span>
                            <span className="text-xs font-mono text-emerald-300 truncate bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800/80 flex-1">
                              {displayValue}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {env.isSecret && (
                              <button
                                onClick={() => toggleSecretReveal(env.id)}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs"
                                title={isRevealed ? 'Mask secret' : 'Reveal secret'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            <button
                              onClick={() => copyToClipboard(`${env.key}=${env.value}`, env.id)}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1"
                              title="Copy Key=Value"
                            >
                              {copiedKey === env.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => deleteProjectEnvVar(activeProject.id, env.id)}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 text-xs"
                              title="Delete variable"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: GIT REPOSITORIES */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              Project Git Repositories ({repos.length})
            </h3>
            <p className="text-xs text-slate-400">GitHub / GitLab repositories for frontend, backend, and AI microservices</p>
          </div>

          <button
            onClick={() => setIsAddingRepo(!isAddingRepo)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Repository</span>
          </button>
        </div>

        {/* Add Repo Form */}
        {isAddingRepo && (
          <form onSubmit={handleAddRepo} className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300">Add New Repository Link</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Repo Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Microservice"
                  value={newRepoName}
                  onChange={e => setNewRepoName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Category</label>
                <select
                  value={newRepoType}
                  onChange={e => setNewRepoType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI Service">AI Service</option>
                  <option value="Mobile">Mobile</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">GitHub / GitLab URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo"
                  value={newRepoUrl}
                  onChange={e => setNewRepoUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-indigo-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Branch</label>
                <input
                  type="text"
                  placeholder="main"
                  value={newRepoBranch}
                  onChange={e => setNewRepoBranch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setIsAddingRepo(false)} className="px-3 py-1 text-xs text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs">Save Repo</button>
            </div>
          </form>
        )}

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <div key={repo.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 flex items-center justify-between gap-4 transition-all group">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-100">{repo.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {repo.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    🌿 {repo.branch}
                  </span>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-sm"
                >
                  {repo.url} <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyToClipboard(`git clone ${repo.url}`, repo.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-800"
                  title="Copy git clone command"
                >
                  {copiedKey === repo.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                
                <button
                  onClick={() => deleteProjectRepo(activeProject.id, repo.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 text-xs border border-slate-800"
                  title="Delete Repository"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: DEVELOPER QUICK LINKS & URLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Developer Quick Links & Environments ({quickLinks.length})
            </h3>
            <p className="text-xs text-slate-400">Figma specs, Swagger docs, Staging, and Production deployment URLs</p>
          </div>

          <button
            onClick={() => setIsAddingLink(!isAddingLink)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Quick Link</span>
          </button>
        </div>

        {/* Add Link Form */}
        {isAddingLink && (
          <form onSubmit={handleAddQuickLinkSubmit} className="bg-slate-950 p-4 rounded-2xl border border-purple-500/40 space-y-3">
            <h4 className="text-xs font-bold text-purple-300">Add Developer Quick Link</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Figma Design System, S3 Console, Postman Collection"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">URL / Address *</label>
                <input
                  type="url"
                  required
                  placeholder="https://figma.com/@project or https://staging.app.com"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-purple-300 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setIsAddingLink(false)} className="px-3 py-1 text-xs text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs">Save Quick Link</button>
            </div>
          </form>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <div
              key={link.id}
              className="bg-slate-950 hover:bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 flex items-center justify-between transition-all group shadow-md"
            >
              <div className="space-y-1 min-w-0 pr-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors block truncate">
                  {link.title}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-purple-400 hover:underline truncate block"
                >
                  {link.url}
                </a>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-purple-950 text-purple-400 border border-slate-800"
                  title="Open Link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => deleteQuickLink(activeProject.id, link.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 text-xs"
                  title="Delete Quick Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
