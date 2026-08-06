import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught rendering error in tab component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 my-6 text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-lg">
            <AlertTriangle className="w-6 h-6" />
            <span>Component Rendering Error</span>
          </div>
          <p className="text-slate-300 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left overflow-x-auto leading-relaxed">
            {this.state.error?.toString() || 'An unexpected error occurred while displaying this view.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <RefreshCw className="w-4 h-4" />
              Reload View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
