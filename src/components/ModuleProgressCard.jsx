import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import FeatureCard from './FeatureCard';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function ModuleProgressCard({ moduleName, onSelectFeature }) {
  const { getModuleProgress, filteredFeatures, activeProject } = useProject();
  const [isExpanded, setIsExpanded] = useState(true);

  const progress = getModuleProgress(moduleName);
  const moduleFeatures = filteredFeatures.filter(f => f.module === moduleName);

  const modulesList = activeProject?.modules || [];
  const foundModule = modulesList.find(m => typeof m === 'object' && m.name === moduleName);

  const moduleMeta = foundModule || {
    description: `${moduleName} core features & implementation scope`,
    color: '#6366F1'
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
      
      {/* Module Header & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0"
            style={{ backgroundColor: `${moduleMeta.color || '#6366F1'}25`, border: `1px solid ${moduleMeta.color || '#6366F1'}50` }}
          >
            <Layers className="w-5 h-5" style={{ color: moduleMeta.color || '#6366F1' }} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{moduleName}</h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {moduleFeatures.length} features
              </span>
            </div>
            <p className="text-xs text-slate-400">{moduleMeta.description}</p>
          </div>
        </div>

        {/* Progress percent & toggle */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Module Completion</span>
            <span className="text-xl font-bold font-mono" style={{ color: moduleMeta.color || '#6366F1' }}>
              {progress}%
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, backgroundColor: moduleMeta.color || '#6366F1' }}
        />
      </div>

      {/* Features List */}
      {isExpanded && (
        <div className="pt-2">
          {moduleFeatures.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/40">
              No features in {moduleName} match current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleFeatures.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onSelect={onSelectFeature}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
