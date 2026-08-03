import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  X, Sparkles, CheckSquare, Plus, Trash2, Calendar, User, Clock,
  ShieldCheck, Pencil, Check, Tag, Layers, AlertTriangle
} from 'lucide-react';

export default function FeatureDetailModal() {
  const {
    selectedFeatureDetail,
    setSelectedFeatureDetail,
    toggleSubtask,
    updateFeature,
    getFeatureProgress,
    setSubtaskGenTargetFeature,
    developers,
    users,
    moduleList,
    currentUser
  } = useProject();

  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [editFields, setEditFields] = useState({});
  const [newAcInput, setNewAcInput] = useState('');

  const canEdit = currentUser && (currentUser.role === 'admin' || currentUser.role === 'developer');

  // Sync editFields whenever the selected feature changes
  useEffect(() => {
    if (selectedFeatureDetail) {
      setEditFields({
        status: selectedFeatureDetail.status,
        description: selectedFeatureDetail.description,
        assignedDev: selectedFeatureDetail.assignedDev,
        deadline: selectedFeatureDetail.deadline,
        priority: selectedFeatureDetail.priority,
        module: selectedFeatureDetail.module,
        complexity: selectedFeatureDetail.complexity,
        acceptanceCriteria: selectedFeatureDetail.acceptanceCriteria || []
      });
    }
  }, [selectedFeatureDetail?.id]);

  if (!selectedFeatureDetail) return null;

  const feature = selectedFeatureDetail;
  const progress = getFeatureProgress(feature);

  const handleFieldChange = (field, value) => {
    setEditFields(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveField = (field) => {
    updateFeature(feature.id, { [field]: editFields[field] });
  };

  const handleSaveAll = () => {
    updateFeature(feature.id, editFields);
  };

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

  const handleAddAc = (e) => {
    e.preventDefault();
    if (!newAcInput.trim()) return;
    const updated = [...(editFields.acceptanceCriteria || []), newAcInput.trim()];
    handleFieldChange('acceptanceCriteria', updated);
    updateFeature(feature.id, { acceptanceCriteria: updated });
    setNewAcInput('');
  };

  const handleRemoveAc = (idx) => {
    const updated = editFields.acceptanceCriteria.filter((_, i) => i !== idx);
    handleFieldChange('acceptanceCriteria', updated);
    updateFeature(feature.id, { acceptanceCriteria: updated });
  };

  const priorityOptions = ['Critical', 'High', 'Medium', 'Low'];
  const statusOptions = ['To Do', 'In Progress', 'Review', 'QA', 'Done'];

  const priorityColors = {
    Critical: 'text-red-400 border-red-500/30 bg-red-500/10',
    High: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    Medium: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    Low: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  };

  // All devs: pull from users list (role=developer) + fallback to developers sample list
  const devOptions = users
    ? users.filter(u => u.role === 'developer' || u.role === 'admin').map(u => u.name)
    : developers.map(d => d.name);

  const inputClass = "w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
  const labelClass = "text-[10px] uppercase font-bold text-slate-400 block mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="space-y-2 flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Module badge — editable */}
              {canEdit ? (
                <select
                  value={editFields.module || feature.module}
                  onChange={e => { handleFieldChange('module', e.target.value); updateFeature(feature.id, { module: e.target.value }); }}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {moduleList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {feature.module}
                </span>
              )}

              {/* Priority badge — editable */}
              {canEdit ? (
                <select
                  value={editFields.priority || feature.priority}
                  onChange={e => { handleFieldChange('priority', e.target.value); updateFeature(feature.id, { priority: e.target.value }); }}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${priorityColors[editFields.priority || feature.priority] || priorityColors.Medium}`}
                >
                  {priorityOptions.map(p => <option key={p} value={p}>{p} Priority</option>)}
                </select>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {feature.priority} Priority
                </span>
              )}

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {feature.complexity || 'Medium (12h)'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{feature.name}</h2>
          </div>

          <button
            onClick={() => setSelectedFeatureDetail(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 my-4 overflow-y-auto flex-1 pr-1">
          
          {/* Status, Dev, Deadline row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            
            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              {canEdit ? (
                <select
                  value={editFields.status || feature.status}
                  onChange={e => { handleFieldChange('status', e.target.value); updateFeature(feature.id, { status: e.target.value }); }}
                  className={inputClass}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 font-semibold">
                  {feature.status}
                </div>
              )}
            </div>

            {/* Assigned Developer */}
            <div>
              <label className={labelClass}>Assigned Developer</label>
              {canEdit ? (
                <select
                  value={editFields.assignedDev || feature.assignedDev}
                  onChange={e => { handleFieldChange('assignedDev', e.target.value); updateFeature(feature.id, { assignedDev: e.target.value }); }}
                  className={inputClass}
                >
                  {devOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  {/* also keep current value even if not in list */}
                  {!devOptions.includes(feature.assignedDev) && (
                    <option value={feature.assignedDev}>{feature.assignedDev}</option>
                  )}
                </select>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                  {feature.devAvatar && <img src={feature.devAvatar} alt={feature.assignedDev} className="w-5 h-5 rounded-full" />}
                  <span className="text-xs font-semibold text-slate-200 truncate">{feature.assignedDev}</span>
                </div>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className={labelClass}>Target Deadline</label>
              {canEdit ? (
                <input
                  type="date"
                  value={editFields.deadline || feature.deadline || ''}
                  onChange={e => { handleFieldChange('deadline', e.target.value); updateFeature(feature.id, { deadline: e.target.value }); }}
                  className={inputClass + ' font-mono'}
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{feature.deadline || '2026-08-30'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description — editable textarea */}
          <div>
            <label className={labelClass + ' flex items-center gap-1.5'}>
              <Pencil className="w-3 h-3" /> Description & Purpose
            </label>
            {canEdit ? (
              <textarea
                rows={3}
                value={editFields.description ?? feature.description}
                onChange={e => handleFieldChange('description', e.target.value)}
                onBlur={() => handleSaveField('description')}
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
                placeholder="Feature description..."
              />
            ) : (
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {feature.description}
              </p>
            )}
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-400" /> Subtask Checklist ({feature.subtasks ? feature.subtasks.filter(s => s.completed).length : 0}/{feature.subtasks ? feature.subtasks.length : 0})
                </h4>
                <p className="text-[11px] text-slate-400">Completing subtasks automatically recalculates feature & project percentage</p>
              </div>

              {canEdit && (
                <button
                  onClick={() => setSubtaskGenTargetFeature(feature)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>🤖 AI Suggest Subtasks</span>
                </button>
              )}
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

                    {canEdit && (
                      <button
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-3">No subtasks added yet. Use AI generator above or add manually below.</p>
              )}

              {/* Add custom subtask form */}
              {canEdit && (
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
              )}
            </div>
          </div>

          {/* Acceptance Criteria — fully editable */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Acceptance Criteria
            </h4>
            <ul className="space-y-1.5 mb-2">
              {(editFields.acceptanceCriteria || feature.acceptanceCriteria || []).map((ac, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 group/ac">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="flex-1">{ac}</span>
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveAc(idx)}
                      className="opacity-0 group-hover/ac:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {canEdit && (
              <form onSubmit={handleAddAc} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add acceptance criterion..."
                  value={newAcInput}
                  onChange={e => setNewAcInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Dependencies */}
          {feature.dependencies && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Prerequisite Dependencies</h4>
              <div className="flex gap-2 flex-wrap">
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
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
