import React from 'react';
import { useProject } from '../context/ProjectContext';
import { BarChart3, CheckCircle2, Clock, Layers, Users, Zap } from 'lucide-react';

export default function AnalyticsView() {
  const { moduleList, getModuleProgress, overallProgress, features } = useProject();

  const totalFeatures = features.length;
  const completedFeatures = features.filter(f => f.status === 'Done').length;
  const inProgressFeatures = features.filter(f => f.status === 'In Progress' || f.status === 'QA').length;
  const toDoFeatures = features.filter(f => f.status === 'To Do').length;

  let totalSubtasks = 0;
  let doneSubtasks = 0;
  features.forEach(f => {
    if (f.subtasks) {
      totalSubtasks += f.subtasks.length;
      doneSubtasks += f.subtasks.filter(s => s.completed).length;
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Overall Completion</span>
            <span className="text-2xl font-bold font-mono text-indigo-400">{overallProgress}%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Completed Features</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{completedFeatures} / {totalFeatures}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Subtask Checkpoints</span>
            <span className="text-2xl font-bold font-mono text-purple-400">{doneSubtasks} / {totalSubtasks}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">In Progress / QA</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{inProgressFeatures}</span>
          </div>
        </div>

      </div>

      {/* Section 7 Module Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Module Progress Breakdown — Automatic Calculation
            </h3>
            <p className="text-xs text-slate-400">Calculated automatically based on underlying feature subtasks completion</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
            Overall Project: {overallProgress}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Module / Category</th>
                <th className="py-3 px-4">Total Features</th>
                <th className="py-3 px-4">Progress Indicator</th>
                <th className="py-3 px-4 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-medium text-slate-200">
              {moduleList.map((moduleName) => {
                const prog = getModuleProgress(moduleName);
                const count = features.filter(f => f.module === moduleName).length;
                return (
                  <tr key={moduleName} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      {moduleName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{count} Features</td>
                    <td className="py-3.5 px-4">
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800 max-w-xs">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${prog}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-400">
                      {prog}%
                    </td>
                  </tr>
                );
              })}
              
              {/* Overall Total Row */}
              <tr className="bg-indigo-950/40 font-bold border-t-2 border-indigo-500/30">
                <td className="py-4 px-4 text-sm text-indigo-200">Overall Project Summary</td>
                <td className="py-4 px-4 text-indigo-300">{totalFeatures} Features Total</td>
                <td className="py-4 px-4">
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-indigo-500/40 max-w-xs">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-mono text-base text-emerald-400">
                  {overallProgress}%
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
