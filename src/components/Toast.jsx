import React from 'react';
import { useProject } from '../context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useProject();

  if (!toastMessage) return null;

  const { msg, type } = toastMessage;

  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 icon-emerald',
    info: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 icon-indigo',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300 icon-amber'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${colors[type] || colors.info}`}>
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
        {type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        <p className="text-sm font-medium pr-2 text-white">{msg}</p>
      </div>
    </div>
  );
}
