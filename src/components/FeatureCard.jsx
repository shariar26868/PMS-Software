import React from 'react';
import { useProject } from '../context/ProjectContext';
import { CheckCircle2, Clock, Sparkles, Edit, Trash2, User, ChevronRight, CheckSquare } from 'lucide-react';

export default function FeatureCard({ feature, onSelect }) {
  const { getFeatureProgress, toggleSubtask, setSubtaskGenTargetFeature, deleteFeature } = useProject();

  const progress = getFeatureProgress(feature);
  const totalSubtasks = feature.subtasks ? feature.subtasks.length : 0;
  const completedSubtasks = feature.subtasks ? feature.subtasks.filter(st => st.completed).length : 0;

  const priorityColors = {
    Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Medium: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const statusColors = {
    'Done': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Review': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'QA': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'To Do': 'bg-slate-700/50 text-slate-400 border-slate-700'
  };

  return (
    <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:shadow-indigo-500/5">
      
      {/* Header: Title & Badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {feature.module}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityColors[feature.priority] || priorityColors.Medium}`}>
              {feature.priority}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusColors[feature.status] || statusColors['To Do']}`}>
              {feature.status}
            </span>
          </div>

          <h3
            onClick={() => onSelect(feature)}
            className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer pt-1"
          >
            {feature.name}
          </h3>
        </div>

        <button
          onClick={() => deleteFeature(feature.id)}
          className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete feature"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {feature.description}
      </p>

      {/* Subtasks Checkbox List (Sample 3) */}
      {feature.subtasks && feature.subtasks.length > 0 && (
        <div className="bg-slate-950/60 rounded-xl p-3 mb-4 space-y-2 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> Subtasks ({completedSubtasks}/{totalSubtasks})
            </span>
            <span className="text-indigo-400 font-mono font-bold">{progress}%</span>
          </div>

          <div className="space-y-1.5">
            {feature.subtasks.slice(0, 3).map((st) => (
              <div
                key={st.id}
                onClick={() => toggleSubtask(feature.id, st.id)}
                className="flex items-center gap-2 cursor-pointer group/st py-0.5"
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => {}} // handled by parent onClick
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs transition-all ${st.completed ? 'line-through text-slate-500' : 'text-slate-300 group-hover/st:text-white'}`}>
                  {st.title}
                </span>
              </div>
            ))}
            {totalSubtasks > 3 && (
              <button
                onClick={() => onSelect(feature)}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 block pt-1"
              >
                + {totalSubtasks - 3} more subtasks...
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer: Dev Avatar & Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        
        {/* Developer Info */}
        <div className="flex items-center gap-2">
          {feature.devAvatar ? (
            <img src={feature.devAvatar} alt={feature.assignedDev} className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/40" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-medium text-slate-300">{feature.assignedDev || 'Unassigned'}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubtaskGenTargetFeature(feature)}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center gap-1 transition-all"
            title="Generate AI subtasks"
          >
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>AI Subtasks</span>
          </button>

          <button
            onClick={() => onSelect(feature)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-all"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
