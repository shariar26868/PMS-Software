import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { SAMPLE_REQUIREMENT_DOCUMENTS } from '../services/sampleData';
import { parseUploadedDocument } from '../services/documentParser';
import { X, Upload, Sparkles, FileText, CheckCircle2, FileCode, AlertCircle, Loader2 } from 'lucide-react';

export default function RequirementImporterModal() {
  const { isImporterOpen, setIsImporterOpen, processDocumentWithAI, isAiAnalyzing, analysisError } = useProject();
  const [docContent, setDocContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [activeSampleId, setActiveSampleId] = useState(null);

  if (!isImporterOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFileName(file.name);
    setActiveSampleId(null);
    try {
      const extractedText = await parseUploadedDocument(file);
      setDocContent(extractedText);
    } catch (err) {
      alert('Error parsing uploaded file: ' + err.message);
    }
  };

  const selectSample = (sample) => {
    setActiveSampleId(sample.id);
    setSelectedFileName(`${sample.title} (${sample.type})`);
    setDocContent(sample.content.trim());
  };

  const handleSubmit = () => {
    if (!docContent.trim()) {
      alert('Please upload a document or paste requirement text first.');
      return;
    }
    processDocumentWithAI(docContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                🤖 AI-Powered Requirement Import
              </h2>
              <p className="text-xs text-slate-400">Upload PDF, DOCX, TXT or Markdown specs to auto-generate structured features</p>
            </div>
          </div>
          <button
            onClick={() => setIsImporterOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="space-y-5 my-5 overflow-y-auto pr-1">
          
          {/* Sample Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block uppercase tracking-wider">
              ⚡ Quick Test Drive (Preset Requirement Specs)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_REQUIREMENT_DOCUMENTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => selectSample(sample)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    activeSampleId === sample.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 ring-2 ring-indigo-500/30'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-xs font-semibold truncate">{sample.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">{sample.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Supported Formats Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Supported Formats:</span>
            <div className="flex gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">PDF</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">DOCX</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">TXT</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Markdown</span>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">
              Upload Document File
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/50 hover:bg-indigo-950/20 rounded-2xl p-6 text-center transition-all group">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 rounded-full bg-slate-800 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {selectedFileName ? (
                    <span className="text-indigo-400 font-semibold">{selectedFileName}</span>
                  ) : (
                    'Click to upload or drag & drop requirement document'
                  )}
                </p>
                <p className="text-xs text-slate-500">Max file size 25MB (.pdf, .docx, .txt, .md)</p>
              </div>
            </div>
          </div>

          {/* Raw Text Editor / Paste */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex justify-between items-center">
              <span>Requirement Document Text Content</span>
              <span className="text-[11px] text-slate-400 font-mono">{docContent.length} chars</span>
            </label>
            <textarea
              rows={6}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Paste feature requirement document text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
            />
          </div>

          {/* Error Banner if any */}
          {analysisError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Strict Control: AI output goes to Preview Review first</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImporterOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isAiAnalyzing || !docContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all"
            >
              {isAiAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-300" />
                  <span>AI Extracting Features...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Extract Features & Review</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
