import React, { useState } from 'react';
import { UserState } from '../types';
import { ARTISTS, REWARDS, HERO_IMAGE } from '../services/data';
import clsx from 'clsx';

type OverlayMode = 'PROFILE' | 'DASHBOARD' | null;

interface DashboardProps {
  user: UserState;
  onReset?: () => void;
  onToggleProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onReset }) => {
  const [overlay, setOverlay] = useState<OverlayMode>(null);

  return (
    <div className="min-h-screen pb-20 relative overflow-y-auto bg-[#090014]">
       
       {/* HERO BACKGROUND - MASKED GRADIENT */}
       <div className="w-full h-[35vh] relative bg-cover bg-center mb-0 z-0"
            style={{ 
                backgroundImage: `url('${HERO_IMAGE}')`,
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
            }}>
       </div>

       {/* HEADER & MENU */}
       <div className="relative z-10 -mt-[300px] px-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                     <div className="bg-[#7c3aed] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block mb-3 shadow-[0_0_15px_rgba(124,58,237,0.6)]">
                         LINEUP FECHADO
                     </div>
                     <h1 className="font-display font-black text-[48px] leading-[0.9] text-[#e9d5ff] drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                         HOUSE MAG
                     </h1>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setOverlay(overlay === 'PROFILE' ? null : 'PROFILE')}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition-all"
                    >
                        👤
                    </button>
                    <button 
                        onClick={() => setOverlay(overlay === 'DASHBOARD' ? null : 'DASHBOARD')}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition-all"
                    >
                        📊
                    </button>
                    <button 
                        onClick={onReset}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition-all"
                    >
                        🔄
                    </button>
                </div>
            </div>

           {/* OVERLAYS */}
           {overlay === 'PROFILE' && (
               <div className="animate-in fade-in slide-in-from-top-4 duration-300 mb-6 bg-[rgba(255,255,255,0.05)] rounded-[16px] overflow-hidden border border-white/5 backdrop-blur-md">
                   <div className="p-6">
                       <h3 className="font-display font-black text-xl mb-2">💎 XP TOTAL: {user.xp}</h3>
                       <div className="text-sm text-slate-300 mb-4">Suas recompensas aparecerão aqui.</div>
                       
                       <div className="space-y-2">
                           {REWARDS.map((r, i) => (
                               <div key={i} className={clsx("flex items-center gap-3 p-3 rounded-lg bg-white/5", user.xp >= r.cost ? "opacity-100" : "opacity-50")}>
                                   <span>{r.icon}</span>
                                   <div className="flex-1 text-sm font-bold">{r.title}</div>
                                   <div className="text-xs">{r.cost} XP</div>
                               </div>
                           ))}
                       </div>
                       
                       <button onClick={() => setOverlay(null)} className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                           FECHAR
                       </button>
                   </div>
               </div>
           )}

           {overlay === 'DASHBOARD' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 mb-6 bg-[rgba(255,255,255,0.05)] rounded-[16px] overflow-hidden border border-white/5 backdrop-blur-md">
                    <div className="p-6 text-center">
                        <h3 className="font-bold mb-4">ESTATÍSTICAS</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-black/20 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">12K</div>
                                <div className="text-[10px]">VOTOS</div>
                            </div>
                            <div className="bg-black/20 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">#1</div>
                                <div className="text-[10px]">ALOK</div>
                            </div>
                            <div className="bg-black/20 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">98%</div>
                                <div className="text-[10px]">VIBE</div>
                            </div>
                        </div>
                        <button onClick={() => setOverlay(null)} className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                           FECHAR
                       </button>
                    </div>
                </div>
           )}

           {/* RANKING LIST */}
           <div className="space-y-3 pb-10">
               <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
                   RANKING OFICIAL DA VOTAÇÃO
               </div>
               
               {ARTISTS.map((artist, i) => {
                   const isConfirmed = artist.status === "CONFIRMADO";
                   
                   return (
                       <div key={artist.id} className={clsx(
                           "flex items-center p-3 rounded-2xl transition-transform duration-200",
                           isConfirmed 
                             ? "bg-gradient-to-r from-[#4c1d95]/40 to-white/[0.02] border border-[#8b5cf6]/30 border-l-[6px] border-l-[#a78bfa] shadow-lg" 
                             : "bg-transparent border border-white/5 opacity-40 grayscale"
                       )}>
                           <div className={clsx(
                               "font-display font-black text-[24px] w-12 text-center",
                               i === 0 ? "text-[#fbbf24]" : (isConfirmed ? "text-white" : "text-slate-500")
                           )}>
                               #{i+1}
                           </div>
                           
                           <img src={artist.img} className="w-[50px] h-[50px] rounded-xl object-cover mx-3 bg-slate-800" alt={artist.name} />
                           
                           <div className="flex-grow">
                               <div className="font-display font-extrabold text-[15px] tracking-wide text-white">
                                   {artist.name}
                               </div>
                               <div className="text-[11px] font-semibold text-[#a78bfa] mt-0.5 uppercase">
                                   {artist.votes}% APROVAÇÃO
                               </div>
                           </div>
                       </div>
                   );
               })}
           </div>
       </div>
    </div>
  );
};