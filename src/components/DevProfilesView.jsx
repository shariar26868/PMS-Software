import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Users,
  Briefcase,
  Edit3,
  Save,
  X,
  Code2,
  Database,
  Sparkles,
  PieChart,
  FileText
} from 'lucide-react';

export default function DevProfilesView() {
  const {
    users,
    getDeveloperWorkloadStats,
    updateUserProfile
  } = useProject();

  const [selectedUserId, setSelectedUserId] = useState(
    users && users.length > 0 ? users[0].id : ''
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Form states for profile edit modal
  const [editForm, setEditForm] = useState({
    name: '',
    devRole: '',
    bio: '',
    skillsStr: '',
    notes: ''
  });

  const activeDevUser = users.find(u => u.id === selectedUserId) || users[0];

  if (!activeDevUser) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        No developer profiles found.
      </div>
    );
  }

  const workloadStats = getDeveloperWorkloadStats(activeDevUser);

  const startEditProfile = () => {
    setEditForm({
      name: activeDevUser.name || '',
      devRole: activeDevUser.devRole || 'Developer',
      bio: activeDevUser.bio || '',
      skillsStr: (activeDevUser.skills || []).join(', '),
      notes: activeDevUser.notes || ''
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const skillsArray = editForm.skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateUserProfile(activeDevUser.id, {
      name: editForm.name,
      devRole: editForm.devRole,
      bio: editForm.bio,
      skills: skillsArray,
      notes: editForm.notes
    });

    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header & Developer Selection Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-indigo-400" />
              Developer Workload & Profile Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              View work percentage per project, completion metrics, tech stack, and profile notes. Synced directly with MongoDB database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> MongoDB Synced
            </span>
          </div>
        </div>

        {/* Developer Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {users.map(u => {
            const isSelected = u.id === selectedUserId;
            const stats = getDeveloperWorkloadStats(u);

            return (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all shrink-0 text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500/80 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className={`w-9 h-9 rounded-full object-cover border-2 ${
                    isSelected ? 'border-indigo-400' : 'border-slate-700'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate max-w-[120px]">{u.name}</span>
                    {u.role === 'admin' && (
                      <span className="text-[10px] text-amber-400 font-bold">👑</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {stats.totalFeaturesCount} Features ({stats.overallCompletionRate}% Done)
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Profile & Workload Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Developer Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-5">
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Profile Avatar & Header */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <img
                  src={activeDevUser.avatar}
                  alt={activeDevUser.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/30 border-2 border-slate-800 shadow-2xl"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-950 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 font-mono">
                  {activeDevUser.role === 'admin' ? '👑 Admin' : '💻 Dev'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100">{activeDevUser.name}</h3>
                <span className="text-xs font-semibold text-indigo-400 block font-mono mt-0.5">
                  @{activeDevUser.username} • {activeDevUser.devRole || 'Software Engineer'}
                </span>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={startEditProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile Bio & Skills
              </button>
            </div>

            {/* Metrics Overview Bar */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Features</span>
                <span className="text-xl font-bold font-mono text-indigo-400">{workloadStats.totalFeaturesCount}</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{workloadStats.totalCompletedFeatures}</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall Progress</span>
                <span className="text-xl font-bold font-mono text-purple-400">{workloadStats.overallCompletionRate}%</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned Projects</span>
                <span className="text-xl font-bold font-mono text-amber-400">
                  {workloadStats.projectBreakdownList.filter(p => p.assignedFeatures.length > 0).length}
                </span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Bio & Summary
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 italic">
                {activeDevUser.bio || 'No bio provided yet. Click Edit Profile to add a summary.'}
              </p>
            </div>

            {/* Skills & Tech Stack Section */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-400" /> Tech Stack & Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(activeDevUser.skills && activeDevUser.skills.length > 0) ? (
                  activeDevUser.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-600/15 text-purple-300 border border-purple-500/30 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Notes & Comments Section */}
            {activeDevUser.notes && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Admin / Lead Notes
                </h4>
                <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  {activeDevUser.notes}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Project Work Breakdown & Percentage Distribution */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Workload Share Summary Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  Workload Percentage Distribution Across Projects
                </h3>
                <p className="text-xs text-slate-400">
                  Proportion of total task load allocated to {activeDevUser.name} per project
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-400 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                100% Total Workload
              </span>
            </div>

            {/* Stacked Workload Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-950 h-5 rounded-2xl overflow-hidden p-1 border border-slate-800 flex gap-0.5">
                {workloadStats.projectBreakdownList.map((p, idx) => {
                  if (p.workloadSharePercent <= 0) return null;
                  const colors = [
                    'bg-indigo-500',
                    'bg-purple-500',
                    'bg-emerald-500',
                    'bg-amber-500',
                    'bg-pink-500',
                    'bg-blue-500'
                  ];
                  return (
                    <div
                      key={p.projectId}
                      className={`${colors[idx % colors.length]} h-full transition-all duration-500 rounded-sm relative group cursor-pointer`}
                      style={{ width: `${p.workloadSharePercent}%` }}
                      title={`${p.projectName}: ${p.workloadSharePercent}% of work`}
                    />
                  );
                })}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {workloadStats.projectBreakdownList.map((p, idx) => {
                  const colorBags = [
                    'bg-indigo-500 text-indigo-300 border-indigo-500/30',
                    'bg-purple-500 text-purple-300 border-purple-500/30',
                    'bg-emerald-500 text-emerald-300 border-emerald-500/30',
                    'bg-amber-500 text-amber-300 border-amber-500/30',
                    'bg-pink-500 text-pink-300 border-pink-500/30',
                    'bg-blue-500 text-blue-300 border-blue-500/30'
                  ];
                  return (
                    <div
                      key={p.projectId}
                      className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${colorBags[idx % colorBags.length].split(' ')[0]}`} />
                        <span className="text-xs font-bold text-slate-200 truncate">{p.projectName}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-indigo-400">{p.workloadSharePercent}% Workload</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project-by-Project Deep Dive Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Per-Project Details & Task Breakdown ({workloadStats.projectBreakdownList.length})
            </h3>

            {workloadStats.projectBreakdownList.map((p) => {
              const hasFeatures = p.assignedFeatures.length > 0;

              return (
                <div
                  key={p.projectId}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-750 transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-100">{p.projectName}</h4>
                        <span className="text-xs text-slate-400">Project ID: {p.projectId}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-xs font-bold">
                        {p.workloadSharePercent}% Workload Share
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">
                        {p.projectCompletionRate}% Progress
                      </span>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">Assigned Features</span>
                      <span className="text-lg font-bold font-mono text-slate-200">
                        {p.completedFeaturesCount} / {p.assignedFeatures.length} Completed
                      </span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">Subtasks Checkpoints</span>
                      <span className="text-lg font-bold font-mono text-purple-400">
                        {p.completedSubtasks} / {p.totalSubtasks} Subtasks
                      </span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">Estimated Hours</span>
                      <span className="text-lg font-bold font-mono text-indigo-400">
                        {p.completedHours} / {p.totalEstimatedHours} Hours
                      </span>
                    </div>
                  </div>

                  {/* Features List Table for this Project */}
                  {hasFeatures ? (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Assigned Features List:
                      </span>
                      <div className="space-y-2">
                        {p.assignedFeatures.map((f) => (
                          <div
                            key={f.id}
                            className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-850 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-100">{f.name}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                  {f.module}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1">{f.description}</p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase ${
                                f.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                f.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {f.status}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                {f.subtasks ? `${f.subtasks.filter(s => s.completed).length}/${f.subtasks.length} Subtasks` : f.complexity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
                      No features currently assigned to {activeDevUser.name} in this project.
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                Edit Developer Profile (Save to MongoDB)
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Developer Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Developer Role / Title</label>
                <input
                  type="text"
                  value={editForm.devRole}
                  onChange={(e) => setEditForm({ ...editForm, devRole: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of experience, tech focus, and responsibilities..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Tech Stack & Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.skillsStr}
                  onChange={(e) => setEditForm({ ...editForm, skillsStr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-purple-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="React, Node.js, Express, MongoDB, Docker"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Admin Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Internal notes or project allocations..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95"
                >
                  <Save className="w-4 h-4" /> Save to Database
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
