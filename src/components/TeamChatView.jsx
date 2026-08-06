import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { Send, Hash, Plus, X, Bell, Phone, Video, MessageCircle } from 'lucide-react';

export default function TeamChatView() {
  const {
    currentUser,
    users,
    chatMessages,
    directMessages,
    chatChannels,
    createChatChannel,
    sendChatMessage,
    sendDirectMessage,
    startChannelCall,
    startDirectCall
  } = useProject();

  const [activeTabMode, setActiveTabMode] = useState('channels');
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeDmUser, setActiveDmUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChanName, setNewChanName] = useState('');
  const [newChanDesc, setNewChanDesc] = useState('');
  const messagesEndRef = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getUserAvatar = (senderId, msgAvatar) => {
    if (msgAvatar && msgAvatar.trim()) return msgAvatar;
    return users.find(u => u.id === senderId)?.avatar || null;
  };

  const getUserName = (senderId, msgName) => {
    if (msgName && msgName !== 'U') return msgName;
    return users.find(u => u.id === senderId)?.name || 'User';
  };

  const getRoleBadge = (senderId, senderRole) => {
    const found = users.find(u => u.id === senderId);
    if (!found) return senderRole || 'Member';
    return found.role === 'admin' ? '👑 Project Manager' : `💻 ${found.devRole || 'Developer'}`;
  };

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, directMessages, activeChannel, activeDmUser]);

  // ── Filtered messages ─────────────────────────────────────────────────────
  const otherUsers = users.filter(u => u.id !== currentUser?.id);
  const channelMessages = chatMessages.filter(m => m.channel === activeChannel);
  const dmMessages = activeDmUser
    ? directMessages.filter(m =>
        (m.senderId === currentUser?.id && m.recipientId === activeDmUser.id) ||
        (m.senderId === activeDmUser.id && m.recipientId === currentUser?.id)
      )
    : [];

  // ── Send handler ──────────────────────────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (activeTabMode === 'channels') sendChatMessage(activeChannel, inputText.trim());
    else if (activeTabMode === 'dms' && activeDmUser) sendDirectMessage(activeDmUser.id, inputText.trim());
    setInputText('');
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChanName.trim()) return;
    const slug = createChatChannel({ name: newChanName.trim(), description: newChanDesc.trim() || `${newChanName} channel` });
    setActiveChannel(slug);
    setNewChanName(''); setNewChanDesc(''); setIsAddingChannel(false);
  };

  // ── Avatar component ──────────────────────────────────────────────────────
  const Avatar = ({ senderId, avatar, name, cls = 'w-8 h-8' }) => {
    const src = getUserAvatar(senderId, avatar);
    const label = getUserName(senderId, name);
    const initial = (label || 'U')[0].toUpperCase();
    const palettes = ['bg-purple-600','bg-indigo-600','bg-pink-600','bg-emerald-600','bg-orange-500','bg-teal-600'];
    const bg = palettes[(senderId ? senderId.charCodeAt(senderId.length - 1) : 0) % palettes.length];

    if (src) {
      return (
        <img
          src={src} alt={label}
          className={`${cls} rounded-full object-cover border border-slate-700 shrink-0`}
          onError={e => { e.target.style.display='none'; e.target.insertAdjacentHTML('afterend', `<div class="${cls} rounded-full ${bg} border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">${initial}</div>`); }}
        />
      );
    }
    return <div className={`${cls} rounded-full ${bg} border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>{initial}</div>;
  };

  // ── Message bubble ────────────────────────────────────────────────────────
  const MessageBubble = ({ msg, isMe }) => (
    <div className={`flex items-end gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="shrink-0 mb-0.5">
        <Avatar senderId={msg.senderId} avatar={msg.senderAvatar} name={msg.senderName} />
      </div>
      <div className={`flex flex-col max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-1.5 mb-1 text-[10px] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-bold text-slate-200">{getUserName(msg.senderId, msg.senderName)}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-950 text-purple-300 border border-slate-800/80">
            {getRoleBadge(msg.senderId, msg.senderRole)}
          </span>
          <span className="text-slate-500 font-mono">{msg.timestamp}</span>
        </div>
        <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
          isMe
            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none shadow-lg shadow-purple-900/40'
            : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none'
        }`}>
          {msg.text}
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[78vh] animate-fade-in">

      {/* ── Sidebar ── */}
      <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800/80 p-4 flex flex-col gap-4 shrink-0">

        {/* Mode switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          {[
            { mode: 'channels', label: 'Channels', icon: <Hash className="w-3.5 h-3.5" /> },
            { mode: 'dms',      label: 'Direct DMs', icon: <MessageCircle className="w-3.5 h-3.5" /> }
          ].map(({ mode, label, icon }) => (
            <button key={mode}
              onClick={() => { setActiveTabMode(mode); if (mode === 'dms' && !activeDmUser && otherUsers[0]) setActiveDmUser(otherUsers[0]); }}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTabMode === mode ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >{icon}{label}</button>
          ))}
        </div>

        {/* Channels list */}
        {activeTabMode === 'channels' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Channels</span>
              <button onClick={() => setIsAddingChannel(v => !v)}
                className="p-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {isAddingChannel && (
              <form onSubmit={handleCreateChannel} className="space-y-2 pb-3 border-b border-slate-800/60">
                <input value={newChanName} onChange={e => setNewChanName(e.target.value.toLowerCase().replace(/\s+/g,'-'))} placeholder="channel-name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                <input value={newChanDesc} onChange={e => setNewChanDesc(e.target.value)} placeholder="Description (optional)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl">Create</button>
                  <button type="button" onClick={() => setIsAddingChannel(false)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl"><X className="w-3.5 h-3.5" /></button>
                </div>
              </form>
            )}
            <div className="overflow-y-auto space-y-1 flex-1">
              {chatChannels.map(ch => (
                <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-left transition-all ${activeChannel === ch.id && activeTabMode === 'channels' ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
                  <Hash className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{ch.name}</div>
                    {ch.description && <div className="text-[10px] text-slate-500 truncate">{ch.description}</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DM list */}
        {activeTabMode === 'dms' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div className="pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Team Members</span>
            </div>
            <div className="overflow-y-auto space-y-1 flex-1">
              {otherUsers.map(user => (
                <button key={user.id} onClick={() => setActiveDmUser(user)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${activeDmUser?.id === user.id ? 'bg-purple-600/20 border border-purple-500/30' : 'hover:bg-slate-800/60'}`}>
                  <div className="relative shrink-0">
                    <Avatar senderId={user.id} avatar={user.avatar} name={user.name} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-1 ring-slate-950" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-bold text-slate-200 truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {user.role === 'admin' ? '👑 Project Manager' : `💻 ${user.devRole || 'Developer'}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {/* Current user at bottom */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-3 shrink-0">
              <Avatar senderId={currentUser?.id} avatar={currentUser?.avatar} name={currentUser?.name} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">{currentUser?.name}</div>
                <div className="text-[10px] text-purple-400 font-mono">{currentUser?.role === 'admin' ? '👑 ADMIN' : '💻 DEV'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 shrink-0">
          {activeTabMode === 'channels' ? (
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">{chatChannels.find(c => c.id === activeChannel)?.name || activeChannel}</h3>
                <span className="text-[11px] text-slate-400">{chatChannels.find(c => c.id === activeChannel)?.description || 'Team discussion'}</span>
              </div>
            </div>
          ) : activeDmUser ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar senderId={activeDmUser.id} avatar={activeDmUser.avatar} name={activeDmUser.name} cls="w-9 h-9" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-slate-950" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  {activeDmUser.name}
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-purple-300 border border-slate-700">
                    {activeDmUser.role === 'admin' ? '👑 Admin' : '💻 Dev'}
                  </span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">Direct Chat • Online</span>
              </div>
            </div>
          ) : <div />}

          {/* Call buttons */}
          <div className="flex items-center gap-2">
            {activeTabMode === 'channels' ? (
              <>
                <button onClick={() => startChannelCall(activeChannel, 'voice')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:scale-105">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /><span className="hidden sm:inline">Voice</span>
                </button>
                <button onClick={() => startChannelCall(activeChannel, 'video')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold transition-all hover:scale-105">
                  <Video className="w-3.5 h-3.5" /><span>Video</span>
                </button>
              </>
            ) : activeDmUser && (
              <>
                <button onClick={() => startDirectCall(activeDmUser, 'voice')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:scale-105">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /><span>Voice</span>
                </button>
                <button onClick={() => startDirectCall(activeDmUser, 'video')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold transition-all hover:scale-105">
                  <Video className="w-3.5 h-3.5" /><span>Video</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {activeTabMode === 'channels' ? (
            channelMessages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">No messages yet — start the conversation! 💬</div>
            ) : (
              <>
                {channelMessages.map(msg => {
                  if (msg.senderRole === 'System') return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <Bell className="w-3 h-3 text-indigo-400" />
                        <span>{msg.text}</span><span className="text-slate-600">({msg.timestamp})</span>
                      </div>
                    </div>
                  );
                  return <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === currentUser?.id} />;
                })}
                <div ref={messagesEndRef} />
              </>
            )
          ) : (
            dmMessages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                No messages with {activeDmUser?.name} yet. Say hi! 👋
              </div>
            ) : (
              <>
                {dmMessages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === currentUser?.id} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/60 shrink-0">
          <div className="shrink-0">
            <Avatar senderId={currentUser?.id} avatar={currentUser?.avatar} name={currentUser?.name} />
          </div>
          <input
            type="text"
            placeholder={activeTabMode === 'channels'
              ? `Message #${chatChannels.find(c => c.id === activeChannel)?.name || activeChannel}...`
              : `Message ${activeDmUser?.name || 'developer'}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
            autoFocus
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-slate-600"
          />
          <button type="submit" disabled={!inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 disabled:opacity-40 transition-all shrink-0">
            <span>Send</span><Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
