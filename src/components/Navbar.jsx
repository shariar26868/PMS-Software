import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import ExportReportModal from './ExportReportModal';
import MaxValidLogo from './MaxValidLogo';
import { Sparkles, Plus, Search, RotateCcw, LayoutGrid, ListFilter, Kanban, BarChart3, FolderPlus, ChevronDown, LogOut, Users, Key, Calendar, MessageSquare, Download } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    logoutUser,
    setIsUserManagementModalOpen,
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    setIsNewProjectModalOpen,
    overallProgress,
    getProjectTimelineInfo,
    setIsDeadlineModalOpen,
    setIsImporterOpen,
    setIsManualModalOpen,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab
  } = useProject();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0F172A]/85 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Project Switcher Dropdown */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <MaxValidLogo className="h-10 shrink-0" variant="on-dark" />

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                
                {/* Project Switcher Select */}
                <div className="relative group">
                  <select
                    value={activeProjectId}
                    onChange={(e) => setActiveProjectId(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 hover:border-indigo-500 rounded-xl px-3 py-1 pr-8 text-sm font-bold text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none shadow-sm transition-all"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* + New Project Button */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="px-2 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Create a new project workspace"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">+ New Project</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 truncate max-w-xs">{activeProject.description}</p>
            </div>
          </div>

          {/* Overall Project Meter & Target Deadline */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2 text-slate-200">
              <div className="text-right">
                <span className="text-xs font-medium text-slate-400 block">Overall Progress</span>
                <span className="text-lg font-bold text-indigo-400">{overallProgress}%</span>
              </div>
              <div className="w-20 bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Target Completion Date Badge */}
            {(() => {
              const info = getProjectTimelineInfo(activeProject);
              return (
                <button
                  onClick={() => setIsDeadlineModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl px-3 py-1.5 text-left transition-all group"
                  title="Click to set or edit target completion date"
                >
                  <Calendar className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Target: {info.targetCompletionDate}</span>
                      <span className={`text-[9px] font-bold px-1 rounded ${
                        info.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        info.status === 'Overdue' ? 'bg-rose-500/20 text-rose-400' :
                        info.status === 'At Risk' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {info.status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-200 font-mono block leading-none mt-0.5">
                      {info.daysRemaining >= 0 ? `⏳ ${info.daysRemaining} Days Remaining` : `⚠️ ${Math.abs(info.daysRemaining)} Days Overdue`}
                    </span>
                  </div>
                </button>
              );
            })()}
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            
            {/* User Badge */}
            <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 px-3.5 py-2 rounded-xl shrink-0 shadow-sm">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full ring-2 ring-indigo-400/40 object-cover shrink-0" />
              <div className="text-left whitespace-nowrap">
                <span className="text-xs font-bold text-slate-100 block leading-tight">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] text-indigo-400 font-mono block leading-tight uppercase font-semibold">
                  {currentUser.role === 'admin' ? '👑 ADMIN' : '💻 DEV'}
                </span>
              </div>
            </div>

            {/* Export Report Button */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
              title="Export Executive Report & PDF/Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            {/* Admin Manage Users Button */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setIsUserManagementModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
                title="Manage Users & Credentials"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </button>
            )}

            {/* AI Import Button */}
            <button
              onClick={() => setIsImporterOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-medium text-xs hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] ring-1 ring-indigo-400/30 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">AI Import</span>
            </button>

            {/* Manual Add Button */}
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Manual</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              title="Log Out"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700/60 hover:border-red-800 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'modules'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Module Overview
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'features'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> All Features
            </button>

            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kanban'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Sprint Board
            </button>

            {/* Interactive Gantt Timeline */}
            <button
              onClick={() => setActiveTab('gantt')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gantt'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Timeline & Dependencies
            </button>

            {/* Internal Team Chat */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> Team Chat
            </button>

            {/* Vault & Config */}
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'vault'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" /> Vault & Config
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>

            {/* Developer Work Profiles */}
            <button
              onClick={() => setActiveTab('dev-profiles')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dev-profiles'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Dev Profiles
            </button>
          </div>
        </div>
      </header>

      {/* Executive Report Export Center Modal */}
      <ExportReportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </>
  );
}
