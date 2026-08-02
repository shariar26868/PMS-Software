import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Sparkles, CheckSquare, Plus, Trash2, Calendar, User, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function FeatureDetailModal() {
  const {
    selectedFeatureDetail,
    setSelectedFeatureDetail,
    toggleSubtask,
    updateFeature,
    getFeatureProgress,
    setSubtaskGenTargetFeature,
    developers
  } = useProject();

  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  if (!selectedFeatureDetail) return null;

  const feature = selectedFeatureDetail;
  const progress = getFeatureProgress(feature);

  const handleAddManualSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    const newSt = {
      id: `st-manual-${Date.now()}`,
      title: newSubtaskInput.trim(),
      completed: false
    };
    const updatedSubtasks = [...(feature.subtasks || []), newSt];
    updateFeature(feature.id, { subtasks: updatedSubtasks });
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (stId) => {
    const updatedSubtasks = (feature.subtasks || []).filter(st => st.id !== stId);
    updateFeature(feature.id, { subtasks: updatedSubtasks });
  };

  const handleStatusChange = (newStatus) => {
    updateFeature(feature.id, { status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {feature.module}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {feature.priority} Priority
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {feature.complexity || 'Medium (12h)'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{feature.name}</h2>
          </div>

          <button
            onClick={() => setSelectedFeatureDetail(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 my-4 overflow-y-auto flex-1 pr-1">
          
          {/* Status & Dev Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status</label>
              <select
                value={feature.status}
                onChange={e => handleStatusChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="QA">QA</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Developer</label>
              <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                <img src={feature.devAvatar} alt={feature.assignedDev} className="w-5 h-5 rounded-full" />
                <span className="text-xs font-semibold text-slate-200 truncate">{feature.assignedDev}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Deadline</label>
              <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{feature.deadline || '2026-08-30'}</span>
              </div>
            </div>
          </div>

          {/* Feature Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Description & Purpose</h4>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Subtasks Section (Section 6 & 7) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-400" /> Subtask Checklist ({feature.subtasks ? feature.subtasks.filter(s=>s.completed).length : 0}/{feature.subtasks ? feature.subtasks.length : 0})
                </h4>
                <p className="text-[11px] text-slate-400">Completing subtasks automatically recalculates feature & project percentage</p>
              </div>

              <button
                onClick={() => setSubtaskGenTargetFeature(feature)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>🤖 AI Suggest Subtasks</span>
              </button>
            </div>

            {/* Progress indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Completion Status</span>
                <span className="text-indigo-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
              {feature.subtasks && feature.subtasks.length > 0 ? (
                feature.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(feature.id, st.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {st.title}
                      </span>
                    </label>

                    <button
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-3">No subtasks added yet. Use AI generator above or add manually below.</p>
              )}

              {/* Add custom subtask form */}
              <form onSubmit={handleAddManualSubtask} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add custom subtask..."
                  value={newSubtaskInput}
                  onChange={e => setNewSubtaskInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Acceptance Criteria */}
          {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Acceptance Criteria</h4>
              <ul className="space-y-1.5">
                {feature.acceptanceCriteria.map((ac, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ac}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dependencies */}
          {feature.dependencies && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Prerequisite Dependencies</h4>
              <div className="flex gap-2">
                {feature.dependencies.map((dep, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
                    🔗 {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => setSelectedFeatureDetail(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
