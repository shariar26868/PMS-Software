import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Users, UserPlus, Shield, Key, Folder, Check, Edit2, Trash2, Lock, Sparkles } from 'lucide-react';

export default function UserManagementModal({ isOpen, onClose }) {
  const { users, projects, createUserAccount, updateUserAccount, deleteUserAccount } = useProject();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [devRole, setDevRole] = useState('Developer');
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (!isOpen) return null;

  const toggleProjectSelect = (projId) => {
    setSelectedProjects(prev =>
      prev.includes(projId) ? prev.filter(id => id !== projId) : [...prev, projId]
    );
  };

  const toggleEditProjectSelect = (projId) => {
    const current = editForm.assignedProjectIds || [];
    const updated = current.includes(projId)
      ? current.filter(id => id !== projId)
      : [...current, projId];
    setEditForm({ ...editForm, assignedProjectIds: updated });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert('Please enter Name, User ID, and Password.');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
      alert(`User ID "${username}" is already taken. Please choose a different User ID.`);
      return;
    }

    createUserAccount({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      role: 'developer',
      devRole: devRole.trim() || 'Developer',
      assignedProjectIds: selectedProjects.length > 0 ? selectedProjects : [projects[0].id]
    });

    // Reset Form
    setName('');
    setUsername('');
    setPassword('');
    setDevRole('Developer');
    setSelectedProjects([]);
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      ...user,
      assignedProjectIds: user.assignedProjectIds || []
    });
  };

  const saveEdit = () => {
    updateUserAccount(editingUserId, editForm);
    setEditingUserId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                👑 Admin Developer Credentials & Project Access Manager
              </h2>
              <p className="text-xs text-slate-400">Create custom User IDs, passwords, and assign project access per developer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-4 overflow-y-auto flex-1 space-y-6 pr-1">
          
          {/* Create Developer Account Card */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wider">
                Create New Developer Credentials & Assign Project
              </h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Developer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Rahman"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">User ID / Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tanvir"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-indigo-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. pass123"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Developer Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Dev"
                    value={devRole}
                    onChange={e => setDevRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Select Accessible Projects */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Select Assigned Projects for this Developer (Developer can enter ONLY checked projects):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {projects.map(p => {
                    const isChecked = selectedProjects.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProjectSelect(p.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 ring-1 ring-indigo-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                          />
                          <span className="text-xs font-semibold truncate">{p.name}</span>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Save Developer Credentials</span>
                </button>
              </div>
            </form>
          </div>

          {/* Registered Accounts List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active User Credentials & Access List ({users.length})
            </h3>

            <div className="space-y-3">
              {users.map(u => {
                const isEditing = editingUserId === u.id;

                if (isEditing) {
                  return (
                    <div key={u.id} className="bg-slate-950 p-4 rounded-xl border border-purple-500/50 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Developer Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">User ID / Username</label>
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-indigo-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Password</label>
                          <input
                            type="text"
                            value={editForm.password}
                            onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-emerald-300 font-mono"
                          />
                        </div>
                      </div>

                      {/* Edit Project Selection */}
                      {u.role !== 'admin' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Assigned Projects</label>
                          <div className="flex flex-wrap gap-2">
                            {projects.map(p => {
                              const isChecked = (editForm.assignedProjectIds || []).includes(p.id);
                              return (
                                <button
                                  type="button"
                                  key={p.id}
                                  onClick={() => toggleEditProjectSelect(p.id)}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                    isChecked
                                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                      : 'bg-slate-900 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  {isChecked ? '✓ ' : '+ '}{p.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setEditingUserId(null)} className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-300">Cancel</button>
                        <button onClick={saveEdit} className="px-4 py-1 rounded bg-indigo-600 text-xs text-white font-bold">Save Changes</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={u.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full border border-indigo-500/40 object-cover" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-100">{u.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role === 'admin' ? '👑 Admin / PM' : `💻 ${u.devRole || 'Developer'}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-slate-400">User ID: <strong className="text-indigo-400">{u.username}</strong></span>
                          <span className="text-slate-400">Password: <strong className="text-emerald-400">{u.password}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Assigned Projects List & Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Accessible Projects</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-xs pt-0.5">
                          {u.role === 'admin' ? (
                            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                              All Projects (Full Admin)
                            </span>
                          ) : (
                            (u.assignedProjectIds || []).map(pId => {
                              const proj = projects.find(p => p.id === pId);
                              return (
                                <span key={pId} className="px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800 text-[10px] font-bold">
                                  {proj ? proj.name : pId}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(u)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs"
                          title="Edit Credentials or Projects"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUserAccount(u.id)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-800 text-xs"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200">
            Close Manager
          </button>
        </div>

      </div>
    </div>
  );
}
