import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Check, Edit2, Trash2, ShieldCheck, Sparkles, Plus, AlertTriangle, Layers } from 'lucide-react';

export default function FeatureReviewModal() {
  const {
    isAiReviewOpen,
    setIsAiReviewOpen,
    pendingAiFeatures,
    setPendingAiFeatures,
    approveAndAddSelectedFeatures,
    moduleList
  } = useProject();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (!isAiReviewOpen) return null;

  const toggleApproval = (id) => {
    setPendingAiFeatures(prev => prev.map(f => f.id === id ? { ...f, approved: !f.approved } : f));
  };

  const startEdit = (feature) => {
    setEditingId(feature.id);
    setEditForm({ ...feature });
  };

  const saveEdit = () => {
    setPendingAiFeatures(prev => prev.map(f => f.id === editingId ? { ...editForm, edited: true } : f));
    setEditingId(null);
  };

  const removeItem = (id) => {
    setPendingAiFeatures(prev => prev.filter(f => f.id !== id));
  };

  const approvedCount = pendingAiFeatures.filter(f => f.approved).length;

  const handleCommitAll = () => {
    const selected = pendingAiFeatures.filter(f => f.approved);
    approveAndAddSelectedFeatures(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Rule Warning Banner */}
        <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-3.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-200">
                ⚠️ Strict AI Workflow Rule: Review & Approval Required
              </p>
              <p className="text-[11px] text-slate-300">
                AI does NOT directly modify project database. Review, edit, or reject AI-generated features below before adding to project.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
            {approvedCount} / {pendingAiFeatures.length} Approved
          </span>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Feature Preview & Review Screen
          </h2>
          <button
            onClick={() => setIsAiReviewOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table / List */}
        <div className="my-4 overflow-y-auto flex-1 pr-1">
          {pendingAiFeatures.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No extracted features remaining.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAiFeatures.map((feat) => {
                const isEditing = editingId === feat.id;

                if (isEditing) {
                  return (
                    <div key={feat.id} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/50 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Feature Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Module</label>
                          <select
                            value={editForm.module}
                            onChange={e => setEditForm({ ...editForm, module: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          >
                            {moduleList.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Priority</label>
                          <select
                            value={editForm.priority}
                            onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Complexity</label>
                          <input
                            type="text"
                            value={editForm.complexity}
                            onChange={e => setEditForm({ ...editForm, complexity: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-300">Cancel</button>
                        <button onClick={saveEdit} className="px-3 py-1 rounded bg-indigo-600 text-xs text-white font-semibold">Save Edits</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={feat.id}
                    className={`p-4 rounded-xl border transition-all ${
                      feat.approved
                        ? 'bg-slate-800/80 border-slate-700/80'
                        : 'bg-slate-900/40 border-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Left: Checkbox & Title */}
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => toggleApproval(feat.id)}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            feat.approved
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-900 border-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-100">{feat.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {feat.module}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              feat.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              feat.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {feat.priority} Priority
                            </span>
                            {feat.edited && (
                              <span className="text-[10px] text-purple-400 italic">✏️ Edited</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 line-clamp-2">{feat.description}</p>
                          
                          {/* Suggested Subtasks Pill list */}
                          {feat.suggestedSubtasks && feat.suggestedSubtasks.length > 0 && (
                            <div className="pt-1 flex flex-wrap gap-1.5">
                              {feat.suggestedSubtasks.map((st, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-800">
                                  ☐ {st}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => startEdit(feat)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => removeItem(feat.id)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-800 text-xs transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsAiReviewOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel Review
          </button>
          
          <button
            onClick={handleCommitAll}
            disabled={approvedCount === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 disabled:opacity-40 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Add Selected Features ({approvedCount}) to Project</span>
          </button>
        </div>

      </div>
    </div>
  );
}
