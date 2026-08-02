import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { generateSubtasksForFeature } from '../services/openaiService';
import { X, Sparkles, Check, Loader2, CheckSquare } from 'lucide-react';

export default function SubtaskGeneratorModal() {
  const {
    subtaskGenTargetFeature,
    setSubtaskGenTargetFeature,
    addSubtasksToFeature
  } = useProject();

  const [loading, setLoading] = useState(false);
  const [proposedSubtasks, setProposedSubtasks] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState({});

  useEffect(() => {
    if (subtaskGenTargetFeature) {
      loadSubtasks();
    }
  }, [subtaskGenTargetFeature]);

  const loadSubtasks = async () => {
    setLoading(true);
    try {
      const generated = await generateSubtasksForFeature(
        subtaskGenTargetFeature.name,
        subtaskGenTargetFeature.description
      );
      setProposedSubtasks(generated);
      const initSelected = {};
      generated.forEach((_, i) => { initSelected[i] = true; });
      setSelectedIndices(initSelected);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!subtaskGenTargetFeature) return null;

  const toggleSelect = (index) => {
    setSelectedIndices(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddApprovedSubtasks = () => {
    const approvedList = proposedSubtasks.filter((_, idx) => selectedIndices[idx]);
    if (approvedList.length === 0) {
      alert('Please select at least one subtask to add.');
      return;
    }
    addSubtasksToFeature(subtaskGenTargetFeature.id, approvedList);
    setSubtaskGenTargetFeature(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">AI Subtask Generator</h2>
              <p className="text-xs text-slate-400">Feature: <span className="text-indigo-400 font-semibold">{subtaskGenTargetFeature.name}</span></p>
            </div>
          </div>
          <button
            onClick={() => setSubtaskGenTargetFeature(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtask list */}
        <div className="my-4 overflow-y-auto flex-1 space-y-2 pr-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
              <p className="text-xs font-semibold">AI is analyzing feature requirements and generating subtasks...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Select Subtasks to Approve & Add:</span>
                <button
                  onClick={loadSubtasks}
                  className="text-indigo-400 hover:underline text-[11px] font-medium"
                >
                  🔄 Regenerate
                </button>
              </div>

              {proposedSubtasks.map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedIndices[idx]
                      ? 'bg-purple-950/40 border-purple-500/40 text-slate-100'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!selectedIndices[idx]}
                      onChange={() => {}}
                      className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0"
                    />
                    <span className="text-xs font-medium">{st}</span>
                  </div>
                  {selectedIndices[idx] && <Check className="w-4 h-4 text-purple-400" />}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSubtaskGenTargetFeature(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          
          <button
            onClick={handleAddApprovedSubtasks}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Approve & Add to Feature</span>
          </button>
        </div>

      </div>
    </div>
  );
}
