import React, { useRef, useState, useEffect } from 'react';
import { UserState } from '../types';
import { ARTISTS } from '../services/data';

interface VotingDeckProps {
  user: UserState;
  onVote: (liked: boolean) => void;
}

export const VotingDeck: React.FC<VotingDeckProps> = ({ user, onVote }) => {
  const currentArtistIndex = user.votedArtistIds.length;
  const currentArtist = ARTISTS[currentArtistIndex];
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.load();
    }
  }, [currentArtistIndex]);

  if (!currentArtist) return null;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-5 justify-center">
       
       {/* Progress & Header */}
       <div className="mb-4">
           <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-[12px] tracking-widest text-slate-400 uppercase">VIBER #001</span>
               <span className="font-display font-bold text-lg text-right text-[#facc15]">💎 {user.xp} XP</span>
           </div>
           <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
             <div 
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300" 
                style={{ width: `${((currentArtistIndex + 1) / ARTISTS.length) * 100}%` }}
             ></div>
           </div>
       </div>

       {/* MAIN VOTE CONTAINER */}
       <div className="relative w-full h-[65vh] rounded-[30px] overflow-hidden bg-[#090014] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 mb-5 bg-cover bg-top"
            style={{ backgroundImage: `url('${currentArtist.img}')` }}>
           
           {/* GRADIENT OVERLAY */}
           <div className="absolute inset-0 flex flex-col justify-end p-8"
                style={{ background: 'linear-gradient(to top, #090014 10%, transparent 60%)' }}>
               
               {/* Genre Pill */}
               <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase mb-2 border border-white/20 w-fit text-white">
                   {currentArtist.genre}
               </div>

               {/* Title */}
               <h1 className="font-display font-black text-[42px] leading-[0.95] text-white uppercase drop-shadow-xl mb-2">
                   {currentArtist.name}
               </h1>
               <p className="text-[#d8b4fe] text-[13px] font-semibold tracking-wide uppercase">
                   {currentArtist.status === 'CONFIRMADO' ? 'CONFIRMADO NO LINEUP' : 'EM ANÁLISE'}
               </p>
           </div>
       </div>

       {/* Player */}
       <div className="mb-4 px-2">
           <audio 
              ref={audioRef} 
              className="w-full h-8 opacity-60 hover:opacity-100 transition-opacity"
              src={currentArtist.audio}
              controls
            />
       </div>

       {/* Action Buttons */}
       <div className="flex gap-4 items-center">
          <button 
            onClick={() => onVote(false)}
            className="flex-1 h-[55px] rounded-[50px] font-display font-black text-slate-300 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-sm flex items-center justify-center tracking-wider uppercase border border-white/5"
          >
              PULAR
          </button>
          
          <button 
            onClick={() => onVote(true)}
            className="flex-1 h-[55px] rounded-[50px] font-display font-black text-white bg-gradient-to-r from-[#7c3aed] to-[#db2777] shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center tracking-wider uppercase"
          >
              CURTIR 💜
          </button>
       </div>
    </div>
  );
};