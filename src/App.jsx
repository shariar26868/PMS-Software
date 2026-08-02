import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Navbar from './components/Navbar';
import ModuleProgressCard from './components/ModuleProgressCard';
import FeatureCard from './components/FeatureCard';
import RequirementImporterModal from './components/RequirementImporterModal';
import FeatureReviewModal from './components/FeatureReviewModal';
import ManualFeatureModal from './components/ManualFeatureModal';
import NewProjectModal from './components/NewProjectModal';
import UserManagementModal from './components/UserManagementModal';
import LoginModal from './components/LoginModal';
import FeatureDetailModal from './components/FeatureDetailModal';
import SubtaskGeneratorModal from './components/SubtaskGeneratorModal';
import SprintBoardView from './components/SprintBoardView';
import ProjectVaultView from './components/ProjectVaultView';
import GanttTimelineView from './components/GanttTimelineView';
import TeamChatView from './components/TeamChatView';
import TeamCallModal from './components/TeamCallModal';
import AnalyticsView from './components/AnalyticsView';
import DevProfilesView from './components/DevProfilesView';
import ProjectDeadlineModal from './components/ProjectDeadlineModal';
import Toast from './components/Toast';
import { Filter, Layers, ListFilter, Kanban, Sparkles, Plus } from 'lucide-react';

function DashboardContent() {
  const {
    currentUser,
    activeTab,
    moduleList,
    filteredFeatures,
    features,
    activeModuleFilter,
    setActiveModuleFilter,
    activePriorityFilter,
    setActivePriorityFilter,
    setSelectedFeatureDetail,
    setIsImporterOpen,
    setIsManualModalOpen,
    isNewProjectModalOpen,
    setIsNewProjectModalOpen,
    isUserManagementModalOpen,
    setIsUserManagementModalOpen
  } = useProject();

  if (!currentUser) {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pb-16">
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Filters Bar (visible on modules, features tabs) */}
        {activeTab !== 'analytics' && activeTab !== 'dev-profiles' && activeTab !== 'kanban' && activeTab !== 'vault' && activeTab !== 'gantt' && activeTab !== 'chat' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Filter By:</span>

              {/* Module Filter */}
              <select
                value={activeModuleFilter}
                onChange={(e) => setActiveModuleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              >
                <option value="All">All Modules ({moduleList.length})</option>
                {moduleList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={activePriorityFilter}
                onChange={(e) => setActivePriorityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-mono self-end sm:self-center">
              Showing <span className="text-indigo-400 font-bold">{filteredFeatures.length}</span> of {features.length} features
            </div>

          </div>
        )}

        {/* Tab 1: Module Overview */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {moduleList
              .filter(m => activeModuleFilter === 'All' || activeModuleFilter === m)
              .map((moduleName) => (
                <ModuleProgressCard
                  key={moduleName}
                  moduleName={moduleName}
                  onSelectFeature={setSelectedFeatureDetail}
                />
              ))}
          </div>
        )}

        {/* Tab 2: All Features Grid */}
        {activeTab === 'features' && (
          <div>
            {filteredFeatures.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <p className="text-slate-400 text-sm">No features found matching the active criteria.</p>
                <div className="flex justify-center gap-3 pt-2">
                  <button onClick={() => setIsImporterOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold">🤖 Import via AI</button>
                  <button onClick={() => setIsManualModalOpen(true)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold">Add Manually</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeatures.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onSelect={setSelectedFeatureDetail}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Sprint Board */}
        {activeTab === 'kanban' && <SprintBoardView />}

        {/* Tab 4: Interactive Gantt Timeline */}
        {activeTab === 'gantt' && <GanttTimelineView />}

        {/* Tab 5: Team Chat */}
        {activeTab === 'chat' && <TeamChatView />}

        {/* Tab 6: Vault & Config */}
        {activeTab === 'vault' && <ProjectVaultView />}

        {/* Tab 7: Analytics */}
        {activeTab === 'analytics' && <AnalyticsView />}

        {/* Tab 8: Developer Profiles & Workload % */}
        {activeTab === 'dev-profiles' && <DevProfilesView />}

      </main>

      {/* Modals */}
      <RequirementImporterModal />
      <FeatureReviewModal />
      <ManualFeatureModal />
      <NewProjectModal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
      <UserManagementModal isOpen={isUserManagementModalOpen} onClose={() => setIsUserManagementModalOpen(false)} />
      <FeatureDetailModal />
      <SubtaskGeneratorModal />
      <TeamCallModal />
      <ProjectDeadlineModal />
      <Toast />

    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  );
}
