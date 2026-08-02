import React from 'react';
import { useProject } from '../context/ProjectContext';
import { downloadCSVReport, downloadMarkdownReport, printExecutivePDFReport } from '../services/reportExporter';
import { FileText, Download, Printer, X, CheckCircle2, Layers, Calendar, User, Shield } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose }) {
  const { activeProject, features, overallProgress, moduleList } = useProject();

  if (!isOpen) return null;

  const handlePrintPDF = () => {
    printExecutivePDFReport(activeProject, features, overallProgress, moduleList);
  };

  const handleDownloadCSV = () => {
    downloadCSVReport(activeProject, features);
  };

  const handleDownloadMD = () => {
    downloadMarkdownReport(activeProject, features, overallProgress, moduleList);
  };

  const completedCount = features.filter(f => f.status === 'Done').length;
  const inProgressCount = features.filter(f => f.status === 'In Progress' || f.status === 'QA').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden space-y-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Executive Report & Export Center
              </h2>
              <p className="text-xs text-slate-400">
                Generate and download executive reports for <strong className="text-indigo-400">{activeProject.name}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Export Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
          
          {/* Option 1: PDF */}
          <button
            onClick={handlePrintPDF}
            className="bg-slate-950 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 text-left space-y-2 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300">Executive PDF</h4>
            <p className="text-[11px] text-slate-400 leading-tight">Print or Save formatted PDF executive document</p>
          </button>

          {/* Option 2: Excel / CSV */}
          <button
            onClick={handleDownloadCSV}
            className="bg-slate-950 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 text-left space-y-2 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300">Excel / CSV File</h4>
            <p className="text-[11px] text-slate-400 leading-tight">Structured spreadsheet ready for Excel / Sheets</p>
          </button>

          {/* Option 3: Markdown */}
          <button
            onClick={handleDownloadMD}
            className="bg-slate-950 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 text-left space-y-2 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-purple-300">Markdown Document</h4>
            <p className="text-[11px] text-slate-400 leading-tight">Formatted GitHub Markdown release report</p>
          </button>

        </div>

        {/* Live Executive Summary Preview Card */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Live Report Summary Preview</h3>
            <span className="text-[10px] font-mono text-slate-400">Date: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Completion Rate</span>
              <span className="text-xl font-bold text-indigo-400">{overallProgress}%</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Total Features</span>
              <span className="text-xl font-bold text-slate-200">{features.length}</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Done / Passed</span>
              <span className="text-xl font-bold text-emerald-400">{completedCount}</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">In Progress</span>
              <span className="text-xl font-bold text-purple-400">{inProgressCount}</span>
            </div>
          </div>

          {/* Module Breakdown List Preview */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300">Module Completion Overview:</h4>
            <div className="space-y-1.5">
              {moduleList.map((mName) => {
                const modFeats = features.filter(f => f.module === mName);
                const doneFeats = modFeats.filter(f => f.status === 'Done').length;
                const pct = modFeats.length > 0 ? Math.round((doneFeats / modFeats.length) * 100) : 0;

                return (
                  <div key={mName} className="flex items-center justify-between text-xs bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-200 font-medium">{mName}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-mono">{doneFeats}/{modFeats.length} Done</span>
                      <span className="font-bold text-indigo-400 font-mono">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
