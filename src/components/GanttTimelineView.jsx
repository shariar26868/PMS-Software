import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Calendar, Layers, Clock, ShieldCheck, ArrowRight, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GanttTimelineView() {
  const { filteredFeatures, moduleList, getFeatureProgress, activeProject, getProjectTimelineInfo, setIsDeadlineModalOpen, overallProgress } = useProject();
  const timelineInfo = getProjectTimelineInfo(activeProject);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Target Deadline & Roadmap Schedule Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">
                  Project Timeline & Target Deadline Schedule
                </h2>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  timelineInfo.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  timelineInfo.status === 'Overdue' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  timelineInfo.status === 'At Risk' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {timelineInfo.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target completion date and feature roadmap schedule for <strong className="text-indigo-400">{activeProject.name}</strong>
              </p>
            </div>
          </div>

          {/* Target Date Quick Action Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right space-y-0.5 flex-1 md:flex-none">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Target Date</span>
              <span className="text-sm font-bold text-slate-100 font-mono">{timelineInfo.targetCompletionDate}</span>
            </div>

            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-2 transition-all shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Edit Target Date</span>
            </button>
          </div>
        </div>

        {/* Schedule Progress Dual Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Days Remaining Countdown
              </span>
              <span className="font-bold font-mono text-indigo-300">
                {timelineInfo.daysRemaining >= 0 ? `${timelineInfo.daysRemaining} Days Left` : `${Math.abs(timelineInfo.daysRemaining)} Days Overdue`}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, timelineInfo.timeElapsedPercent)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block text-right font-mono">
              Started: {timelineInfo.startDate} ({timelineInfo.timeElapsedPercent}% time elapsed)
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Actual Completed Progress
              </span>
              <span className="font-bold font-mono text-emerald-400">{overallProgress}% Done</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block text-right font-mono">
              {filteredFeatures.filter(f => getFeatureProgress(f) === 100).length} of {filteredFeatures.length} features completed
            </span>
          </div>
        </div>
      </div>

      {/* Gantt Table Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 overflow-x-auto">
        
        {moduleList.map((moduleName) => {
          const modFeatures = filteredFeatures.filter(f => f.module === moduleName);
          if (modFeatures.length === 0) return null;

          return (
            <div key={moduleName} className="space-y-3 pb-4 border-b border-slate-800/80 last:border-0 last:pb-0">
              
              {/* Module Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{moduleName} Module</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">{modFeatures.length} scheduled features</span>
              </div>

              {/* Timeline Header Days */}
              <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <div className="col-span-4 font-bold text-slate-300">Feature Name & Prerequisites</div>
                <div className="col-span-2 text-center">Assigned Dev</div>
                <div className="col-span-6 text-center">Sprint Timeline Schedule</div>
              </div>

              {/* Feature Timeline Rows */}
              <div className="space-y-3">
                {modFeatures.map((feature, idx) => {
                  const progress = getFeatureProgress(feature);
                  const deadlineDay = parseInt((feature.deadline || '15').split('-').pop()) || (idx + 1) * 4;

                  return (
                    <div key={feature.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all">
                      
                      {/* Left: Feature info & Dependencies */}
                      <div className="col-span-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100 truncate">{feature.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            feature.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {feature.priority}
                          </span>
                        </div>

                        {/* Dependency Connector Tag */}
                        {feature.dependencies && feature.dependencies.length > 0 && feature.dependencies[0] !== 'None' && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                            <ArrowRight className="w-3 h-3 text-indigo-400" />
                            <span>Requires: <strong>{feature.dependencies[0]}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Dev Avatar */}
                      <div className="col-span-2 flex items-center justify-center gap-1.5">
                        <img src={feature.devAvatar} alt={feature.assignedDev} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs text-slate-300 font-medium truncate">{feature.assignedDev.split(' ')[0]}</span>
                      </div>

                      {/* Right: Timeline Bar */}
                      <div className="col-span-6 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Target: {feature.deadline}</span>
                          <span className="text-indigo-400 font-bold">{progress}%</span>
                        </div>

                        <div className="w-full bg-slate-900 h-4 rounded-xl overflow-hidden p-0.5 border border-slate-800 relative">
                          <div
                            className={`h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-1 text-[9px] font-bold text-white shadow ${
                              feature.status === 'Done' ? 'bg-gradient-to-r from-emerald-600 to-teal-500' :
                              feature.status === 'In Progress' ? 'bg-gradient-to-r from-indigo-600 to-purple-500' :
                              'bg-gradient-to-r from-slate-700 to-slate-600'
                            }`}
                            style={{ width: `${Math.max(progress, 15)}%` }}
                          >
                            {progress > 20 && `${progress}%`}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
