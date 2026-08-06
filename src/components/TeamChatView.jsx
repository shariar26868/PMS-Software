import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { MessageSquare, Send, Hash, Users, Sparkles, Plus, X, Bell, Phone, Video, UserCheck, MessageCircle } from 'lucide-react';

export default function TeamChatView() {
  const {
    currentUser,
    users,
    activeProject,
    chatMessages,
    directMessages,
    chatChannels,
    createChatChannel,
    sendChatMessage,
    sendDirectMessage,
    startChannelCall,
    startDirectCall
  } = useProject();

  const [activeTabMode, setActiveTabMode] = useState('channels'); // 'channels' | 'dms'
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeDmUser, setActiveDmUser] = useState(null);

  const [inputText, setInputText] = useState('');

  // Channel Creation Form State
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChanName, setNewChanName] = useState('');
  const [newChanDesc, setNewChanDesc] = useState('');

  // Other users list for DMs
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  // Filter messages based on active mode
  const channelMessages = chatMessages.filter(m => m.channel === activeChannel);

  const dmMessages = activeDmUser
    ? directMessages.filter(
        m => (m.senderId === currentUser.id && m.recipientId === activeDmUser.id) ||
             (m.senderId === activeDmUser.id && m.recipientId === currentUser.id)
      )
    : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (activeTabMode === 'channels') {
      sendChatMessage(activeChannel, inputText.trim());
    } else if (activeTabMode === 'dms' && activeDmUser) {
      sendDirectMessage(activeDmUser.id, inputText.trim());
    }

    setInputText('');
  };

  const handleCreateChannelSubmit = (e) => {
    e.preventDefault();
    if (!newChanName.trim()) return;

    const createdSlug = createChatChannel({
      name: newChanName.trim(),
      description: newChanDesc.trim() || `Channel discussion for ${newChanName}`
    });

    setActiveChannel(createdSlug);
    setNewChanName('');
    setNewChanDesc('');
    setIsAddingChannel(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[78vh] animate-fade-in">
      
      {/* Left Sidebar: Channels & 1-on-1 DMs */}
      <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800/80 p-4 space-y-4 flex flex-col shrink-0">
        
        {/* Top Mode Switcher (Channels / 1-on-1 DMs) */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTabMode('channels')}
            className={`py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTabMode === 'channels'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Channels</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMode('dms');
              if (!activeDmUser && otherUsers.length > 0) {
                setActiveDmUser(otherUsers[0]);
              }
            }}
            className={`py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTabMode === 'dms'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Direct DMs</span>
          </button>
        </div>

        {/* CHANNELS LIST */}
        {activeTabMode === 'channels' && (
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Channels</span>
              <button
                onClick={() => setIsAddingChannel(!isAddingChannel)}
                className="p-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold"
                title="Create New Channel"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Create Channel Inline Form */}
            {isAddingChannel && (
              <form onSubmit={handleCreateChannelSubmit} className="bg-slate-900 p-3 rounded-2xl border border-purple-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-purple-300">Create New Channel</h4>
                  <button type="button" onClick={() => setIsAddingChannel(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="channel-name (e.g. mobile-team)"
                  value={newChanName}
                  onChange={e => setNewChanName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                />

                <button type="submit" className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
                  + Create Channel
                </button>
              </form>
            )}

            <div className="space-y-1 flex-1 overflow-y-auto pr-1">
              {chatChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    activeChannel === ch.id
                      ? 'bg-purple-600/20 border-purple-500/40 text-slate-100 font-bold'
                      : 'bg-slate-900/40 border-slate-800/40 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Hash className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs truncate">{ch.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1-ON-1 DIRECT MESSAGES LIST */}
        {activeTabMode === 'dms' && (
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <div className="pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Team Developers (1-on-1)</span>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {otherUsers.map((user) => {
                const isSelected = activeDmUser && activeDmUser.id === user.id;

                return (
                  <button
                    key={user.id}
                    onClick={() => setActiveDmUser(user)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500/40 text-slate-100 font-bold'
                        : 'bg-slate-900/40 border-slate-800/40 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-slate-950" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-200 block truncate">{user.name}</span>
                      <span className="text-[10px] text-purple-400 font-mono block uppercase">
                        {user.role === 'admin' ? '👑 Admin' : `💻 ${user.devRole || 'Developer'}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Logged User Info */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3 shrink-0">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full ring-1 ring-purple-500/40 object-cover" />
          <div className="truncate">
            <span className="text-xs font-bold text-slate-200 block truncate">{currentUser.name}</span>
            <span className="text-[10px] text-purple-400 font-mono block uppercase">{currentUser.role === 'admin' ? '👑 Admin' : '💻 Dev'}</span>
          </div>
        </div>

      </div>

      {/* Right Main Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-900/90">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          {activeTabMode === 'channels' ? (
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100 leading-tight">
                  {chatChannels.find(c => c.id === activeChannel)?.name || activeChannel}
                </h3>
                <span className="text-[11px] text-slate-400 block leading-tight">
                  {chatChannels.find(c => c.id === activeChannel)?.description || 'Team discussion'}
                </span>
              </div>
            </div>
          ) : (
            /* 1-on-1 DM Header */
            <div className="flex items-center gap-3">
              {activeDmUser && (
                <>
                  <div className="relative">
                    <img src={activeDmUser.avatar} alt={activeDmUser.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {activeDmUser.name}
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-purple-300 border border-slate-700">
                        {activeDmUser.role === 'admin' ? '👑 Admin' : '💻 Developer'}
                      </span>
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-mono block">Direct Private Chat • Online</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Voice & Video Call Action Buttons */}
          <div className="flex items-center gap-2">
            {activeTabMode === 'channels' ? (
              <>
                <button
                  onClick={() => startChannelCall(activeChannel, 'voice')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:scale-105"
                  title="Start Channel Voice Call"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Voice Call</span>
                </button>

                <button
                  onClick={() => startChannelCall(activeChannel, 'video')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
                  title="Start Channel Video Call"
                >
                  <Video className="w-3.5 h-3.5 text-white" />
                  <span>Video Call</span>
                </button>
              </>
            ) : (
              /* 1-on-1 Direct Voice / Video Call Buttons */
              activeDmUser && (
                <>
                  <button
                    onClick={() => startDirectCall(activeDmUser, 'voice')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:scale-105"
                    title={`Call ${activeDmUser.name} (Audio)`}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Voice</span>
                  </button>

                  <button
                    onClick={() => startDirectCall(activeDmUser, 'video')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
                    title={`Video Call ${activeDmUser.name}`}
                  >
                    <Video className="w-3.5 h-3.5 text-white" />
                    <span>Direct Video</span>
                  </button>
                </>
              )
            )}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeTabMode === 'channels' ? (
            /* Channel Messages Stream */
            channelMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No messages in #{activeChannel} yet. Be the first to start the discussion!
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isSystem = msg.senderRole === 'System';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex items-center justify-center my-2">
                      <div className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <Bell className="w-3 h-3 text-indigo-400" />
                        <span>{msg.text}</span>
                        <span className="text-slate-600">({msg.timestamp})</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex items-start gap-3 group">
                    {msg.senderAvatar ? (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="w-8 h-8 rounded-full border border-slate-700 shrink-0 mt-0.5 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold text-purple-200 shrink-0 mt-0.5">
                        {(msg.senderName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{msg.senderName}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-950 text-purple-300 border border-slate-800">
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed max-w-2xl inline-block">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* 1-on-1 DM Messages Stream */
            dmMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No private messages with {activeDmUser?.name} yet. Send a direct message below!
              </div>
            ) : (
              dmMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {msg.senderAvatar ? (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="w-8 h-8 rounded-full border border-slate-700 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold text-purple-200 shrink-0">
                        {(msg.senderName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                        <span className="text-xs font-bold text-slate-200">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <div className={`p-3 rounded-2xl border text-xs leading-relaxed max-w-xl inline-block ${
                        isMe
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/40 rounded-tr-none'
                          : 'bg-slate-950/80 text-slate-200 border-slate-800/80 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>

        {/* Send Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <input
            type="text"
            placeholder={
              activeTabMode === 'channels'
                ? `Message #${chatChannels.find(c => c.id === activeChannel)?.name || activeChannel}...`
                : `Private message to ${activeDmUser?.name || 'developer'}...`
            }
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 disabled:opacity-40 transition-all shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
