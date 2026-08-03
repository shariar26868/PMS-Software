import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProject } from '../context/ProjectContext';
import {
  ChevronDown, Check, Pencil, Trash2, Plus, X, Layers, FolderPlus
} from 'lucide-react';

export default function ModuleFilterDropdown() {
  const {
    moduleList,
    activeModuleFilter,
    setActiveModuleFilter,
    currentUser,
    activeProjectId,
    addModule,
    updateModuleName,
    deleteModule,
    features
  } = useProject();

  const canEdit = currentUser && (currentUser.role === 'admin' || currentUser.role === 'developer');

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [editingModule, setEditingModule] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [confirmDeleteModule, setConfirmDeleteModule] = useState(null);
  const [newModuleInput, setNewModuleInput] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // Calculate & toggle
  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 6, left: rect.left });
    }
    setIsOpen(v => !v);
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setEditingModule(null);
        setConfirmDeleteModule(null);
        setShowAddInput(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => setIsOpen(false);
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [isOpen]);

  // Count features per module
  const featureCountMap = {};
  (features || []).forEach(f => {
    featureCountMap[f.module] = (featureCountMap[f.module] || 0) + 1;
  });

  const handleSelectModule = (val) => {
    if (!editingModule && !confirmDeleteModule) {
      setActiveModuleFilter(val);
      setIsOpen(false);
    }
  };

  const handleStartRename = (e, mod) => {
    e.stopPropagation();
    setEditingModule(mod);
    setEditDraft(mod);
    setConfirmDeleteModule(null);
  };

  const handleSaveRename = (e) => {
    e?.stopPropagation();
    if (editDraft.trim() && editDraft.trim() !== editingModule) {
      // if currently filtered by this module, update filter
      if (activeModuleFilter === editingModule) setActiveModuleFilter(editDraft.trim());
      updateModuleName(activeProjectId, editingModule, editDraft.trim());
    }
    setEditingModule(null);
    setEditDraft('');
  };

  const handleRenameKey = (e) => {
    if (e.key === 'Enter') handleSaveRename();
    if (e.key === 'Escape') { setEditingModule(null); setEditDraft(''); }
  };

  const handleDeleteModule = (e, mod) => {
    e.stopPropagation();
    deleteModule(activeProjectId, mod);
    if (activeModuleFilter === mod) setActiveModuleFilter('All');
    setConfirmDeleteModule(null);
  };

  const handleAddModule = (e) => {
    e?.preventDefault();
    if (newModuleInput.trim()) {
      addModule(activeProjectId, newModuleInput.trim());
      setNewModuleInput('');
      setShowAddInput(false);
    }
  };

  const displayLabel = activeModuleFilter === 'All'
    ? `All Modules (${moduleList.length})`
    : activeModuleFilter;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium transition-colors min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[120px]">{displayLabel}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel — rendered via portal to escape stacking context */}
      {isOpen && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: 256, zIndex: 99999 }}
          className="bg-[#0D1117] border border-slate-700/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          
          {/* "All Modules" option */}
          <button
            onClick={() => handleSelectModule('All')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-slate-800/80 ${activeModuleFilter === 'All' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
          >
            <span>All Modules</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500 text-[10px]">{moduleList.length} modules</span>
              {activeModuleFilter === 'All' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
            </div>
          </button>

          <div className="border-t border-slate-800/60" />

          {/* Module list */}
          <div className="max-h-64 overflow-y-auto">
            {moduleList.map((mod) => (
              <div
                key={mod}
                className={`group flex items-center gap-2 px-3 py-2 transition-colors hover:bg-slate-800/60 ${activeModuleFilter === mod ? 'bg-indigo-500/8' : ''}`}
              >
                {editingModule === mod ? (
                  /* Rename input */
                  <div className="flex items-center gap-1.5 flex-1" onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      type="text"
                      value={editDraft}
                      onChange={e => setEditDraft(e.target.value)}
                      onKeyDown={handleRenameKey}
                      className="flex-1 bg-slate-950 border border-indigo-500/60 rounded-lg px-2 py-0.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSaveRename}
                      className="p-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 shrink-0"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingModule(null); }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : confirmDeleteModule === mod ? (
                  /* Confirm delete */
                  <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                    <span className="text-[10px] text-red-400 font-semibold flex-1">Delete "{mod}"?</span>
                    <button
                      onClick={(e) => handleDeleteModule(e, mod)}
                      className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-semibold border border-red-500/30"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteModule(null); }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  /* Normal row */
                  <>
                    <button
                      onClick={() => handleSelectModule(mod)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <span className={`text-xs font-medium truncate ${activeModuleFilter === mod ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {mod}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 shrink-0">
                        {featureCountMap[mod] || 0}
                      </span>
                      {activeModuleFilter === mod && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                    </button>

                    {/* Edit / Delete actions — only for canEdit */}
                    {canEdit && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => handleStartRename(e, mod)}
                          className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-indigo-400 transition-colors"
                          title="Rename"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteModule(mod); setEditingModule(null); }}
                          className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete module"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Module */}
          {canEdit && (
            <>
              <div className="border-t border-slate-800/60" />
              {showAddInput ? (
                <form
                  onSubmit={handleAddModule}
                  className="flex items-center gap-2 px-3 py-2"
                  onClick={e => e.stopPropagation()}
                >
                  <FolderPlus className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Module name..."
                    value={newModuleInput}
                    onChange={e => setNewModuleInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Escape') { setShowAddInput(false); setNewModuleInput(''); } }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newModuleInput.trim()}
                    className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 disabled:opacity-40 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddInput(false); setNewModuleInput(''); }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowAddInput(true); setEditingModule(null); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add new module
                </button>
              )}
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
