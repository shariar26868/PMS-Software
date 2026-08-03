import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Plus, UserCheck, Calendar, Clock, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function ManualFeatureModal() {
  const {
    isManualModalOpen,
    setIsManualModalOpen,
    addManualFeature,
    moduleList,
    developers,
    users,
    activeProjectId,
    addModule
  } = useProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: moduleList[0] || '',
    priority: 'Medium',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    assignedDev: '',
    dependencies: 'None',
    acceptanceCriteria: '',
    estimatedHours: 12,
    status: 'To Do'
  });

  const [newModuleMode, setNewModuleMode] = useState(false);
  const [newModuleDraft, setNewModuleDraft] = useState('');

  // Sync formData defaults whenever modal opens
  useEffect(() => {
    if (isManualModalOpen) {
      // Build dev list from real users
      const devUsers = users
        ? users.filter(u => u.role === 'developer' || u.role === 'admin')
        : [];
      const defaultDev = devUsers.length > 0 ? devUsers[0].name : (developers[0]?.name || '');

      setFormData({
        name: '',
        description: '',
        module: moduleList[0] || '',
        priority: 'Medium',
        deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        assignedDev: defaultDev,
        dependencies: 'None',
        acceptanceCriteria: '',
        estimatedHours: 12,
        status: 'To Do'
      });
      setNewModuleMode(false);
      setNewModuleDraft('');
    }
  }, [isManualModalOpen]);

  // Build developer options from real users list
  const devOptions = users
    ? users.filter(u => u.role === 'developer' || u.role === 'admin')
    : developers;

  if (!isManualModalOpen) return null;

  const handleAddNewModule = () => {
    if (newModuleDraft.trim()) {
      addModule(activeProjectId, newModuleDraft.trim());
      setFormData(prev => ({ ...prev, module: newModuleDraft.trim() }));
      setNewModuleDraft('');
      setNewModuleMode(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in Feature Name and Description');
      return;
    }
    addManualFeature(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Create Feature Manually</h2>
              <p className="text-xs text-slate-400">Add custom requirements, assign developer & set acceptance criteria</p>
            </div>
          </div>
          <button
            onClick={() => setIsManualModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 my-4 overflow-y-auto flex-1 pr-1">
          
          {/* Feature Name & Module */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Feature Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Multi-factor Authentication (2FA)"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Module / Category</span>
                <button
                  type="button"
                  onClick={() => { setNewModuleMode(v => !v); setNewModuleDraft(''); }}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors font-normal"
                  title="Add new module"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </label>

              <select
                value={formData.module}
                onChange={e => setFormData({ ...formData, module: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {moduleList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Inline new module input — only shown when + clicked */}
              {newModuleMode && (
                <div className="flex gap-1.5 mt-1.5">
                  <input
                    autoFocus
                    type="text"
                    placeholder="New module name..."
                    value={newModuleDraft}
                    onChange={e => setNewModuleDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); handleAddNewModule(); }
                      if (e.key === 'Escape') { setNewModuleMode(false); setNewModuleDraft(''); }
                    }}
                    className="flex-1 bg-slate-950 border border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button type="button" onClick={handleAddNewModule} className="px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition-colors">Add</button>
                  <button type="button" onClick={() => { setNewModuleMode(false); setNewModuleDraft(''); }} className="px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors">✕</button>
                </div>
              )}
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Feature Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe user story and technical scope..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
            />
          </div>

          {/* Priority, Estimated Hours, Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Hours</label>
              <input
                type="number"
                min={1}
                value={formData.estimatedHours}
                onChange={e => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 8 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="QA">QA</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Assigned Developer & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Developer</label>
              <select
                value={formData.assignedDev}
                onChange={e => setFormData({ ...formData, assignedDev: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {devOptions.map(d => (
                  <option key={d.id || d.name} value={d.name}>
                    {d.name}{d.devRole || d.role ? ` (${d.devRole || d.role})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Deadline Date</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Dependencies & Acceptance Criteria */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Dependencies</label>
            <input
              type="text"
              placeholder="e.g. User Login API, Database Migration"
              value={formData.dependencies}
              onChange={e => setFormData({ ...formData, dependencies: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Acceptance Criteria (One per line)</label>
            <textarea
              rows={3}
              placeholder="Criterion 1&#10;Criterion 2&#10;Criterion 3"
              value={formData.acceptanceCriteria}
              onChange={e => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono resize-y"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all"
            >
              Create Feature
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
