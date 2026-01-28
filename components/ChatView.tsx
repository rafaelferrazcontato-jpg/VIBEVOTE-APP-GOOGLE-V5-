import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, X, Sparkles, MapPin, Search, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessage, ChatMode } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Force standard mode for images as per limitations of other tools
        if (chatMode !== 'standard') setChatMode('standard');
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = (): Promise<{lat: number, lng: number} | undefined> => {
      return new Promise((resolve) => {
          if (!navigator.geolocation) resolve(undefined);
          navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              (err) => {
                  console.warn("Geolocation denied", err);
                  resolve(undefined);
              }
          );
      });
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
      images: selectedImage ? [selectedImage] : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }] 
      }));

      let location = undefined;
      if (chatMode === 'maps') {
          location = await getLocation();
      }

      const response = await sendMessage(
        history, 
        userMsg.text, 
        userMsg.images,
        chatMode,
        location
      );

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error processing your request.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderGrounding = (metadata: any) => {
      if (!metadata?.groundingChunks) return null;
      
      const chunks = metadata.groundingChunks;
      const webSources = chunks.filter((c: any) => c.web).map((c: any) => c.web);
      const mapSources = chunks.filter((c: any) => c.maps).map((c: any) => c.maps);

      if (webSources.length === 0 && mapSources.length === 0) return null;

      return (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {webSources.map((s: any, i: number) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-black/20 hover:bg-black/40 px-2 py-1 rounded text-brand-cyan border border-brand-cyan/20 truncate max-w-[200px]">
                      <Search className="w-3 h-3" />
                      {s.title || s.uri}
                  </a>
              ))}
               {mapSources.map((s: any, i: number) => (
                  <a key={i} href={s.uri || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-black/20 hover:bg-black/40 px-2 py-1 rounded text-green-400 border border-green-500/20 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3" />
                      {s.title || "Map Location"}
                  </a>
              ))}
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* Header / Mode Selector */}
      <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-slate-900/50 backdrop-blur-md z-10">
          <button 
             onClick={() => setChatMode('standard')}
             className={clsx("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", chatMode === 'standard' ? "bg-white/10 text-white" : "text-slate-500 hover:text-white")}
          >
              <Sparkles className="w-3 h-3" /> Standard
          </button>
          <button 
             onClick={() => setChatMode('thinking')}
             className={clsx("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", chatMode === 'thinking' ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-white")}
          >
              <BrainCircuit className="w-3 h-3" /> Deep Think
          </button>
          <button 
             onClick={() => setChatMode('search')}
             className={clsx("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", chatMode === 'search' ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-slate-500 hover:text-white")}
          >
              <Search className="w-3 h-3" /> Web Search
          </button>
          <button 
             onClick={() => setChatMode('maps')}
             className={clsx("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", chatMode === 'maps' ? "bg-green-500/20 text-green-300 border border-green-500/30" : "text-slate-500 hover:text-white")}
          >
              <MapPin className="w-3 h-3" /> Maps
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium">Gemini AI Assistant</p>
            <p className="text-sm">Select a mode above to unlock specific capabilities</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={clsx(
              "flex gap-4 max-w-3xl mx-auto",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={clsx(
              "p-4 rounded-2xl max-w-[85%]",
              msg.role === 'user' 
                ? "bg-brand-600 text-white rounded-br-sm" 
                : "bg-slate-800 text-slate-200 rounded-bl-sm"
            )}>
              {msg.images && msg.images.length > 0 && (
                <div className="mb-3">
                  <img 
                    src={msg.images[0]} 
                    alt="User uploaded" 
                    className="rounded-lg max-h-60 object-cover border border-white/10"
                  />
                </div>
              )}
              <div className="prose prose-invert prose-sm">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              
              {/* Grounding Chips */}
              {msg.groundingMetadata && renderGrounding(msg.groundingMetadata)}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-4 max-w-3xl mx-auto justify-start">
             <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2 border border-white/5">
               <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
               <span className="text-sm text-slate-400">
                   {chatMode === 'thinking' ? 'Reasoning deeply...' : 
                    chatMode === 'search' ? 'Searching the web...' :
                    chatMode === 'maps' ? 'Locating...' : 'Gemini is thinking...'}
               </span>
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
           {selectedImage && (
             <div className="relative inline-block w-fit">
               <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-slate-700" />
               <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-slate-700 rounded-full p-1 text-white hover:bg-red-500"
               >
                 <X className="w-3 h-3" />
               </button>
             </div>
           )}
           
           <div className="flex gap-2">
            <label className={clsx(
                "p-3 text-slate-400 hover:text-brand-500 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors",
                chatMode !== 'standard' && "opacity-50 cursor-not-allowed"
            )}>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={chatMode !== 'standard'}
                onChange={handleImageUpload}
              />
              <ImageIcon className="w-5 h-5" />
            </label>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chatMode === 'thinking' ? "Ask a complex question..." : "Message Gemini..."}
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 outline-none"
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {chatMode !== 'standard' && selectedImage && (
              <p className="text-[10px] text-red-400 text-center">Images are only supported in Standard mode. They will be removed if you send.</p>
          )}
        </div>
      </div>
    </div>
  );
};