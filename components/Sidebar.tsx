import React from 'react';
import { ViewMode } from '../types';
import { Disc, LayoutDashboard, LogOut, MessageSquare, Mic2, Image as ImageIcon, Video } from 'lucide-react';

interface SidebarProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, onLogout }) => {
  const navItemClass = (mode: ViewMode) => 
    `w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group ${currentMode === mode ? 'bg-white/10 text-white border border-white/10 shadow-inner' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`;

  return (
    <aside className="hidden md:flex w-20 lg:w-64 bg-black/40 border-r border-white/5 flex-col h-full shrink-0 backdrop-blur-md">
      <div className="p-6 flex items-center gap-3 justify-center lg:justify-start">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-pink flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <span className="text-white font-display font-black text-xl">V</span>
        </div>
        <div className="hidden lg:flex flex-col">
            <span className="text-lg font-display font-black text-white tracking-wide leading-none">
                VIBE
            </span>
            <span className="text-lg font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-pink tracking-wide leading-none">
                VOTE
            </span>
        </div>
      </div>

      <nav className="flex-1 py-8 space-y-2 px-3 overflow-y-auto">
         <div className="text-[10px] font-bold text-slate-600 uppercase px-4 mb-2 tracking-widest hidden lg:block">Main</div>
         
         <button onClick={() => onModeChange('VOTE')} className={navItemClass('VOTE')}>
            <Disc className={`w-5 h-5 ${currentMode === 'VOTE' && 'animate-spin-slow text-brand-cyan'}`} />
            <span className="hidden lg:block font-bold text-xs tracking-wider">VOTING</span>
         </button>

         <button onClick={() => onModeChange('DASHBOARD')} className={navItemClass('DASHBOARD')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-xs tracking-wider">DASHBOARD</span>
         </button>

         <div className="text-[10px] font-bold text-slate-600 uppercase px-4 mt-6 mb-2 tracking-widest hidden lg:block">AI Tools</div>

         <button onClick={() => onModeChange('CHAT')} className={navItemClass('CHAT')}>
            <MessageSquare className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-xs tracking-wider">GEMINI CHAT</span>
         </button>

         <button onClick={() => onModeChange('LIVE')} className={navItemClass('LIVE')}>
            <Mic2 className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-xs tracking-wider">LIVE VOICE</span>
         </button>

         <button onClick={() => onModeChange('IMAGE')} className={navItemClass('IMAGE')}>
            <ImageIcon className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-xs tracking-wider">IMAGE STUDIO</span>
         </button>

         <button onClick={() => onModeChange('VEO')} className={navItemClass('VEO')}>
            <Video className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-xs tracking-wider">VEO VIDEO</span>
         </button>
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-3 text-slate-600 hover:text-red-400 transition-colors p-2"
        >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
};