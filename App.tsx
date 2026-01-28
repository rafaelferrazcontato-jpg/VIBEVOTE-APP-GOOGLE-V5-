import React, { useState } from 'react';
import { UserState, ViewMode } from './types';
import { Login } from './components/Login';
import { VotingDeck } from './components/VotingDeck';
import { Dashboard } from './components/Dashboard';
import { Toast } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { LiveView } from './components/LiveView';
import { VeoView } from './components/VeoView';
import { ImageView } from './components/ImageView';
import { ARTISTS } from './services/data';

const App: React.FC = () => {
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    xp: 0,
    votedArtistIds: [],
    language: 'PT',
    showProfile: false
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('VOTE');
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const handleLogin = () => {
    setUser(prev => ({ ...prev, isLoggedIn: true }));
  };

  const handleReset = () => {
    setUser({
      isLoggedIn: false,
      xp: 0,
      votedArtistIds: [],
      language: 'PT',
      showProfile: false
    });
    setViewMode('VOTE');
  };

  const handleVote = (liked: boolean) => {
    const currentIdx = user.votedArtistIds.length;
    const artist = ARTISTS[currentIdx];
    
    let newXp = user.xp;
    if (liked) {
        newXp += 50;
        setToast({ show: true, msg: '+50 XP' });
    }

    const newVotedIds = [...user.votedArtistIds, artist.id];
    
    if (newVotedIds.length >= ARTISTS.length) {
        setUser(prev => ({
            ...prev,
            xp: newXp,
            votedArtistIds: newVotedIds
        }));
        // Auto switch to dashboard if in voting mode
        if (viewMode === 'VOTE') setViewMode('DASHBOARD');
    } else {
        setUser(prev => ({
            ...prev,
            xp: newXp,
            votedArtistIds: newVotedIds
        }));
    }
  };

  const toggleProfile = () => {
      setUser(prev => ({ ...prev, showProfile: !prev.showProfile }));
  };

  if (!user.isLoggedIn) {
      return (
        <div className="min-h-screen text-slate-100 font-sans">
             <Login onLogin={handleLogin} />
        </div>
      );
  }

  const renderContent = () => {
      switch (viewMode) {
          case 'VOTE':
              return <VotingDeck user={user} onVote={handleVote} />;
          case 'DASHBOARD':
              return <Dashboard user={user} onToggleProfile={toggleProfile} onReset={handleReset} />;
          case 'CHAT':
              return <ChatView />;
          case 'LIVE':
              return <LiveView />;
          case 'VEO':
              return <VeoView />;
          case 'IMAGE':
              return <ImageView />;
          default:
              return <VotingDeck user={user} onVote={handleVote} />;
      }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-purple selection:text-white overflow-hidden">
      <Toast 
        message={toast.msg} 
        isVisible={toast.show} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />
      
      <Sidebar 
        currentMode={viewMode} 
        onModeChange={setViewMode} 
        onLogout={handleReset} 
      />

      <main className="flex-1 h-full overflow-hidden relative">
          {renderContent()}
      </main>
    </div>
  );
};

export default App;