import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Users, Volume2, MonitorUp, Camera } from 'lucide-react';

export default function TeamCallModal() {
  const { activeCall, leaveChannelCall, currentUser, activeProject } = useProject();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isSimulatedStream, setIsSimulatedStream] = useState(false);

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  // Helper to create synthetic video stream if physical camera is blocked/unavailable
  const createSyntheticAvatarStream = (name) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const animate = () => {
      frame++;
      // Background gradient pulse
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const shift = Math.sin(frame * 0.05) * 40;
      grad.addColorStop(0, `hsl(${260 + shift}, 70%, 15%)`);
      grad.addColorStop(1, `hsl(${300 + shift}, 80%, 25%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer glowing circle
      const radius = 60 + Math.sin(frame * 0.08) * 5;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.fill();

      // Inner avatar circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.fillStyle = '#9333ea';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Avatar text initials
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials = (name || 'Dev').split(' ').map(n => n[0]).join('').toUpperCase();
      ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

      // Overlay watermark badge
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('📷 Virtual Camera Active', canvas.width / 2, canvas.height - 24);

      requestAnimationFrame(animate);
    };
    animate();

    return canvas.captureStream(30);
  };

  // Camera stream handler
  useEffect(() => {
    let activeStream = null;
    let isCancelled = false;

    async function initCamera() {
      if (activeCall && activeCall.type === 'video' && !isCameraOff) {
        try {
          // Try full video + audio
          activeStream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true });
          setIsSimulatedStream(false);
        } catch (err1) {
          try {
            // Try video only if audio permission failed
            activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setIsSimulatedStream(false);
          } catch (err2) {
            console.warn('Physical camera unavailable or permission denied. Using Virtual Camera fallback:', err2);
            activeStream = createSyntheticAvatarStream(currentUser?.name || 'You');
            setIsSimulatedStream(true);
          }
        }

        if (!isCancelled) {
          setCameraStream(activeStream);
        } else if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
      } else {
        setCameraStream(null);
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeCall, isCameraOff, currentUser?.name]);

  // Bind local camera stream to local video element
  useEffect(() => {
    if (localVideoRef.current && cameraStream && !isCameraOff) {
      localVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isCameraOff, isScreenSharing]);

  // Bind screen share stream to screen video element
  useEffect(() => {
    if (screenVideoRef.current && screenShareStream) {
      screenVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream, isScreenSharing]);

  if (!activeCall) return null;

  // Toggle Live Browser Screen Share
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices?.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: 'always' },
            audio: false
          });

          setScreenShareStream(stream);
          setIsScreenSharing(true);

          stream.getVideoTracks()[0].onended = () => {
            setScreenShareStream(null);
            setIsScreenSharing(false);
          };
        } else {
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.warn('User cancelled screen share or permission denied:', err);
        setIsScreenSharing(false);
      }
    }
  };

  // Participant list generation
  const participants = activeCall.isDirect
    ? [
        { name: currentUser?.name || 'You', role: currentUser?.role === 'admin' ? 'Admin' : 'Dev', avatar: currentUser?.avatar, isLocal: true },
        { name: activeCall.targetUser.name, role: activeCall.targetUser.devRole || 'Developer', avatar: activeCall.targetUser.avatar, isSpeaking: true }
      ]
    : [
        { name: currentUser?.name || 'You', role: currentUser?.role === 'admin' ? 'Admin' : 'Dev', avatar: currentUser?.avatar, isLocal: true },
        { name: 'Sarah Jenkins', role: 'Full Stack Dev', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isSpeaking: true },
        { name: 'Alex Rivera', role: 'Backend Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
        { name: 'Michael Chang', role: 'DevOps', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[94vh] space-y-4">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Room Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {activeCall.isDirect ? `🔒 Direct 1-on-1 ${activeCall.type === 'video' ? 'Video Call' : 'Voice Call'}` : `Live Channel ${activeCall.type === 'video' ? 'Video Conference' : 'Voice Huddle'}`}
              </h2>
              <p className="text-xs text-slate-400">
                {activeCall.isDirect ? (
                  <>Talking with <strong className="text-purple-300 font-bold">{activeCall.targetUser.name}</strong></>
                ) : (
                  <>Channel: <span className="text-indigo-400 font-mono font-bold">#{activeCall.channel}</span> | Project: <strong className="text-slate-200">{activeProject?.name || 'PMS System'}</strong></>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSimulatedStream && activeCall.type === 'video' && !isCameraOff && (
              <span className="px-3 py-1 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                <span>Virtual Camera Stream</span>
              </span>
            )}
            {isScreenSharing && (
              <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <MonitorUp className="w-4 h-4 text-indigo-400" />
                <span>Screen Sharing Active</span>
              </span>
            )}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              <Users className="w-4 h-4 text-purple-400" />
              <span>{participants.length} Connected</span>
            </div>
          </div>
        </div>

        {/* Main Stage: Screen Share Active vs Participant Grid */}
        {isScreenSharing ? (
          <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden min-h-[360px]">
            
            {/* Main Shared Screen Canvas */}
            <div className="flex-1 bg-slate-950 rounded-2xl border border-indigo-500/50 relative overflow-hidden flex items-center justify-center p-2 shadow-2xl">
              {screenShareStream ? (
                <video
                  ref={(node) => {
                    screenVideoRef.current = node;
                    if (node && screenShareStream) node.srcObject = screenShareStream;
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center space-y-2 p-8">
                  <MonitorUp className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
                  <p className="text-sm font-bold text-slate-200">Screen Share Active</p>
                  <p className="text-xs text-slate-400">Sharing display window with team members</p>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-xs font-bold text-slate-100">Screen Presenter: {currentUser?.name || 'You'}</span>
              </div>
            </div>

            {/* Sidebar Participants List while Screen Sharing */}
            <div className="w-full md:w-56 space-y-2 overflow-y-auto shrink-0 flex flex-col">
              
              {/* Floating Camera Picture-In-Picture for Local User during Screen Share */}
              {activeCall.type === 'video' && !isCameraOff && (
                <div className="relative rounded-2xl border border-purple-500/50 overflow-hidden aspect-video bg-slate-950 shadow-lg mb-2">
                  <video
                    ref={(node) => {
                      localVideoRef.current = node;
                      if (node && cameraStream) node.srcObject = cameraStream;
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-purple-300 border border-purple-500/30">
                    You (Camera)
                  </div>
                </div>
              )}

              {participants.map((p, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-200 block truncate">{p.name}</span>
                    <span className="text-[9px] text-slate-400 block">{p.role}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Participant Grid (2 cards for 1-on-1, 4 for channels) */
          <div className={`grid gap-4 flex-1 overflow-y-auto pr-1 ${activeCall.isDirect ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {participants.map((p, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl border overflow-hidden aspect-video bg-slate-950 flex flex-col items-center justify-center p-4 transition-all shadow-xl ${
                  p.isSpeaking ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800'
                }`}
              >
                {/* If Local User & Video On */}
                {p.isLocal && activeCall.type === 'video' && !isCameraOff ? (
                  <video
                    ref={(node) => {
                      localVideoRef.current = node;
                      if (node && cameraStream) node.srcObject = cameraStream;
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  /* Avatar display for voice / turned off video */
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className="relative">
                      <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-full border-2 border-purple-500/40 object-cover shadow-xl" />
                      {p.isSpeaking && (
                        <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-slate-950 shadow-md">
                          <Volume2 className="w-4 h-4 animate-pulse" />
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Name Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-2 z-20">
                  <span className="text-xs font-bold text-slate-100">{p.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">
                    {p.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-4 shrink-0">
          
          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl border transition-all ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera Toggle */}
          {activeCall.type === 'video' && (
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCameraOff
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
              title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Screen Share Toggle */}
          <button
            onClick={handleToggleScreenShare}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs transition-all ${
              isScreenSharing
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
          >
            <Monitor className="w-5 h-5 text-indigo-300" />
            <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              if (screenShareStream) {
                screenShareStream.getTracks().forEach(t => t.stop());
              }
              if (cameraStream) {
                cameraStream.getTracks().forEach(t => t.stop());
              }
              leaveChannelCall();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all ml-4"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>

        </div>

      </div>
    </div>
  );
}
