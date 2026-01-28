import React, { useState } from 'react';
import { VALID_CODES } from '../services/data';
import { Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (VALID_CODES.includes(code.toUpperCase().trim()) || code.length > 3) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/5 rounded-[24px] p-10 text-center shadow-2xl">
          
          {/* Logo */}
          <div className="w-[70px] h-[70px] rounded-[18px] bg-gradient-to-br from-[#7c3aed] to-[#db2777] flex items-center justify-center text-[32px] text-white font-display shadow-[0_8px_20px_rgba(124,58,237,0.4)] mx-auto mb-6 animate-float-minimal">
            ♫
          </div>

          <h1 className="font-display font-black text-[38px] leading-none mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
            VIBEVOTE
          </h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-[2px] mb-10 uppercase">
            House Mag Festival • Official App
          </p>

          <div className="space-y-6">
             <div className="text-left">
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                    CÓDIGO DE ACESSO
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="VIBE2026"
                    className={`w-full h-[52px] bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl text-center text-white font-display text-lg tracking-[3px] uppercase focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all placeholder:text-slate-700`}
                />
             </div>
             
             <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-[56px] bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white font-display font-black uppercase rounded-full shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wide text-sm"
             >
                {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      VALIDANDO...
                    </>
                ) : (
                    "DESBLOQUEAR EXPERIÊNCIA"
                )}
             </button>
          </div>
      </div>
    </div>
  );
};