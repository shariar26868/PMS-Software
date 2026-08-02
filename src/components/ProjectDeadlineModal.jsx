import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Calendar, Clock, Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProjectDeadlineModal() {
  const {
    activeProject,
    isDeadlineModalOpen,
    setIsDeadlineModalOpen,
    setProjectTargetDate,
    getProjectTimelineInfo
  } = useProject();

  const [startDate, setStartDate] = useState('');
  const [targetCompletionDate, setTargetCompletionDate] = useState('');

  useEffect(() => {
    if (activeProject) {
      setStartDate(activeProject.startDate || '2026-07-01');
      setTargetCompletionDate(activeProject.targetCompletionDate || '2026-08-31');
    }
  }, [activeProject, isDeadlineModalOpen]);

  if (!isDeadlineModalOpen || !activeProject) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetCompletionDate) return;
    setProjectTargetDate(activeProject.id, { startDate, targetCompletionDate });
    setIsDeadlineModalOpen(false);
  };

  const setPresetDays = (daysToAdd) => {
    const base = startDate ? new Date(startDate) : new Date();
    base.setDate(base.getDate() + daysToAdd);
    const dateStr = base.toISOString().split('T')[0];
    setTargetCompletionDate(dateStr);
  };

  // Preview live countdown
  const previewInfo = getProjectTimelineInfo({
    ...activeProject,
    startDate,
    targetCompletionDate
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-6">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Set Project Target Deadline</h2>
              <p className="text-xs text-slate-400">Manage completion schedule for <strong className="text-indigo-400">{activeProject.name}</strong></p>
            </div>
          </div>

          <button
            onClick={() => setIsDeadlineModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Live Target Status</span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                previewInfo.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                previewInfo.status === 'Overdue' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                previewInfo.status === 'At Risk' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {previewInfo.status}
              </span>
              <span className="text-xs font-mono text-slate-200">
                {previewInfo.daysRemaining >= 0 ? `${previewInfo.daysRemaining} Days Remaining` : `${Math.abs(previewInfo.daysRemaining)} Days Overdue`}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Schedule</span>
            <span className="text-sm font-bold text-slate-100 font-mono">{previewInfo.totalDays} Days</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Project Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Completion Date</label>
              <input
                type="date"
                required
                value={targetCompletionDate}
                onChange={(e) => setTargetCompletionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quick Presets (+From Start)</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPresetDays(7)}
                className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              >
                + 1 Week
              </button>
              <button
                type="button"
                onClick={() => setPresetDays(14)}
                className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              >
                + 2 Weeks
              </button>
              <button
                type="button"
                onClick={() => setPresetDays(30)}
                className="py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-all"
              >
                + 1 Month
              </button>
              <button
                type="button"
                onClick={() => setPresetDays(90)}
                className="py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30 transition-all"
              >
                + 3 Months
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeadlineModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <span>Save Project Target Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
