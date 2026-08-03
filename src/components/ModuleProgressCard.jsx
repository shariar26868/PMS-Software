import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import FeatureCard from './FeatureCard';
import { Layers, ChevronDown, ChevronUp, Pencil, Check, X, Trash2 } from 'lucide-react';

export default function ModuleProgressCard({ moduleName, onSelectFeature }) {
  const {
    getModuleProgress,
    filteredFeatures,
    activeProject,
    activeProjectId,
    currentUser,
    updateModuleDescription,
    updateModuleName,
    deleteModule
  } = useProject();

  const [isExpanded, setIsExpanded] = useState(true);

  // Name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  // Description editing
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState('');

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(false);

  const progress = getModuleProgress(moduleName);
  const moduleFeatures = filteredFeatures.filter(f => f.module === moduleName);

  const modulesList = activeProject?.modules || [];
  const foundModule = modulesList.find(m => typeof m === 'object' && m.name === moduleName);
  const moduleMeta = foundModule || {
    description: `${moduleName} core features & implementation scope`,
    color: '#6366F1'
  };

  const canEdit = currentUser && (currentUser.role === 'admin' || currentUser.role === 'developer');

  // ── Name edit handlers ──
  const handleStartEditName = () => {
    setNameDraft(moduleName);
    setIsEditingName(true);
  };
  const handleSaveName = () => {
    if (nameDraft.trim() && nameDraft.trim() !== moduleName) {
      updateModuleName(activeProjectId, moduleName, nameDraft.trim());
    }
    setIsEditingName(false);
  };
  const handleNameKey = (e) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') setIsEditingName(false);
  };

  // ── Description edit handlers ──
  const handleStartEditDesc = () => {
    setDescDraft(moduleMeta.description || '');
    setIsEditingDesc(true);
  };
  const handleSaveDesc = () => {
    if (descDraft.trim()) {
      updateModuleDescription(activeProjectId, moduleName, descDraft.trim());
    }
    setIsEditingDesc(false);
  };

  // ── Delete handlers ──
  const handleDeleteModule = () => {
    deleteModule(activeProjectId, moduleName);
    setConfirmDelete(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4 group/card">
      
      {/* Module Header & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Color dot / icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: `${moduleMeta.color || '#6366F1'}25`, border: `1px solid ${moduleMeta.color || '#6366F1'}50` }}
          >
            <Layers className="w-5 h-5" style={{ color: moduleMeta.color || '#6366F1' }} />
          </div>

          <div className="flex-1 min-w-0">
            
            {/* Module Name — editable */}
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  autoFocus
                  type="text"
                  value={nameDraft}
                  onChange={e => setNameDraft(e.target.value)}
                  onKeyDown={handleNameKey}
                  className="flex-1 bg-slate-950 border border-indigo-500/70 rounded-lg px-2.5 py-1 text-base font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                  title="Save name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/name mb-1">
                <h2 className="text-lg font-bold text-slate-100">{moduleName}</h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                  {moduleFeatures.length} features
                </span>
                {canEdit && (
                  <button
                    onClick={handleStartEditName}
                    className="opacity-0 group-hover/name:opacity-100 p-1 rounded text-slate-500 hover:text-indigo-400 transition-all"
                    title="Rename module"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Description — inline editable */}
            {isEditingDesc ? (
              <div className="flex items-start gap-2 mt-1">
                <textarea
                  autoFocus
                  value={descDraft}
                  onChange={e => setDescDraft(e.target.value)}
                  rows={2}
                  className="flex-1 bg-slate-950 border border-indigo-500/60 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={handleSaveDesc} className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors" title="Save">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsEditingDesc(false)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors" title="Cancel">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group/desc">
                <p className="text-xs text-slate-400">{moduleMeta.description}</p>
                {canEdit && (
                  <button
                    onClick={handleStartEditDesc}
                    className="opacity-0 group-hover/desc:opacity-100 p-0.5 rounded text-slate-500 hover:text-indigo-400 transition-all"
                    title="Edit description"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Progress + controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Module Completion</span>
            <span className="text-xl font-bold font-mono" style={{ color: moduleMeta.color || '#6366F1' }}>
              {progress}%
            </span>
          </div>

          {/* Delete button */}
          {canEdit && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all opacity-0 group-hover/card:opacity-100"
              title="Delete module"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Confirm delete */}
          {confirmDelete && (
            <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 rounded-xl px-2 py-1">
              <span className="text-[10px] font-semibold text-red-400">Delete?</span>
              <button onClick={handleDeleteModule} className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={() => setConfirmDelete(false)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, backgroundColor: moduleMeta.color || '#6366F1' }}
        />
      </div>

      {/* Features List */}
      {isExpanded && (
        <div className="pt-2">
          {moduleFeatures.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/40">
              No features in {moduleName} match current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleFeatures.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onSelect={onSelectFeature}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
