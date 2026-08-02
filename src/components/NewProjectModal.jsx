import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, FolderPlus, Sparkles, Layers } from 'lucide-react';

export default function NewProjectModal({ isOpen, onClose }) {
  const { createNewProject } = useProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modulesInput, setModulesInput] = useState('Authentication, User Management, Dashboard, Payment, Admin Panel');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a project name.');
      return;
    }

    const modulesList = modulesInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    createNewProject({
      name: name.trim(),
      description: description.trim() || 'Software development requirement workspace',
      modules: modulesList.length > 0 ? modulesList : ['Authentication', 'Core System', 'Dashboard']
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Create New Project</h2>
              <p className="text-xs text-slate-400">Add a new workspace to manage AI & manual feature requirements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile E-Commerce App, CRM Portal"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Project Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of project goals and scope..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Initial Modules (Comma Separated)
            </label>
            <input
              type="text"
              value={modulesInput}
              onChange={e => setModulesInput(e.target.value)}
              placeholder="Authentication, Payment, User Management, Dashboard"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
