import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Kanban, Sparkles, CheckCircle2, ChevronRight, User, CheckSquare, HelpCircle, ArrowRight } from 'lucide-react';

export default function SprintBoardView() {
  const {
    filteredFeatures = [],
    moveFeatureStatus,
    setSelectedFeatureDetail,
    setSubtaskGenTargetFeature,
    getFeatureProgress
  } = useProject();

  const columns = [
    { id: 'To Do', label: 'To Do', color: 'border-slate-700 bg-slate-900/40 text-slate-400', badge: 'bg-slate-800 text-slate-300' },
    { id: 'In Progress', label: 'In Progress', color: 'border-blue-500/30 bg-blue-950/20 text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
    { id: 'Review', label: 'Review', color: 'border-purple-500/30 bg-purple-950/20 text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
    { id: 'QA', label: 'QA Testing', color: 'border-pink-500/30 bg-pink-950/20 text-pink-400', badge: 'bg-pink-500/20 text-pink-300' },
    { id: 'Done', label: 'Done', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' }
  ];

  const safeFeatures = Array.isArray(filteredFeatures) ? filteredFeatures : [];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Help Banner: How Sprint Board Works */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-200">📌 Sprint Board কীভাবে কাজ করে?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sprint Board-এ ফিচারসমূহ ৫টি ধাপে (To Do → In Progress → Review → QA → Done) ভাগ করা থাকে। 
              একটি ফিচারের কার্ড থেকে <span className="text-indigo-400 font-semibold font-mono">Move Status</span> ব্যবহার করে খুব সহজেই ডেভেলপমেন্ট ধাপ পরিবর্তন করা যায়। 
              ফিচারটি <span className="text-emerald-400 font-semibold font-mono">Done</span> মার্ক করলে তার সাবটাস্কগুলো স্বয়ংক্রিয়ভাবে কমপ্লিট হবে এবং মডিউল ও প্রজেক্ট প্রোগ্রেস পার্সেন্টেজ আপডেট হয়ে যাবে।
            </p>
          </div>
        </div>
      </div>

      {/* Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colFeatures = safeFeatures.filter(f => f && f.status === col.id);

          return (
            <div key={col.id} className={`border rounded-2xl p-4 flex flex-col min-w-[260px] ${col.color}`}>
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{col.label}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badge}`}>
                    {colFeatures.length}
                  </span>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                {colFeatures.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No features in {col.label}
                  </div>
                ) : (
                  colFeatures.map((feature) => {
                    if (!feature) return null;
                    const progress = getFeatureProgress ? getFeatureProgress(feature) : 0;
                    const completedSubtasks = feature.subtasks ? feature.subtasks.filter(s => s && s.completed).length : 0;
                    const totalSubtasks = feature.subtasks ? feature.subtasks.length : 0;
                    const devName = feature.assignedDev || 'Unassigned';
                    const devFirstName = devName.split(' ')[0];

                    return (
                      <div
                        key={feature.id}
                        className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 space-y-3 shadow-md group transition-all"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                            {feature.module || 'General'}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            feature.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            feature.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {feature.priority || 'Medium'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setSelectedFeatureDetail && setSelectedFeatureDetail(feature)}
                          className="text-xs font-bold text-slate-100 hover:text-indigo-400 cursor-pointer transition-colors"
                        >
                          {feature.name || 'Unnamed Feature'}
                        </h4>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
                            <span className="text-indigo-400 font-bold">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Dev & Quick Move */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-1.5">
                            {feature.devAvatar ? (
                              <img src={feature.devAvatar} alt={devName} className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300">
                                {devName[0]?.toUpperCase() || 'U'}
                              </div>
                            )}
                            <span className="text-[11px] text-slate-300 truncate max-w-[80px]">{devFirstName}</span>
                          </div>

                          {/* Quick Stage Move Dropdown */}
                          <select
                            value={feature.status || col.id}
                            onChange={(e) => moveFeatureStatus && moveFeatureStatus(feature.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:text-white focus:outline-none cursor-pointer"
                          >
                            <option value="To Do">Move: To Do</option>
                            <option value="In Progress">Move: In Progress</option>
                            <option value="Review">Move: Review</option>
                            <option value="QA">Move: QA</option>
                            <option value="Done">Move: Done ✓</option>
                          </select>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

