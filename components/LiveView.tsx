import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Volume2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodeAudioData, decode, createPcmBlob } from '../services/audioUtils';
import clsx from 'clsx';

export const LiveView: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  
  // Refs for audio handling to avoid re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null);

  const startSession = async () => {
    setError(null);
    setStatus('connecting');

    try {
      if (!process.env.API_KEY) throw new Error("API Key missing");
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Session opened');
            setStatus('active');
            setIsConnected(true);

            // Setup input streaming
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle audio output
             const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             if (base64Audio) {
               const ctx = audioContextRef.current;
               if (!ctx) return;

               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               
               const audioBuffer = await decodeAudioData(
                 decode(base64Audio),
                 ctx,
                 24000,
                 1
               );

               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputNode);
               source.addEventListener('ended', () => {
                 sourcesRef.current.delete(source);
               });

               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               sourcesRef.current.add(source);
             }

             // Handle interruption
             if (message.serverContent?.interrupted) {
               sourcesRef.current.forEach(s => s.stop());
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
             }
          },
          onclose: () => {
            console.log('Session closed');
            handleDisconnect();
          },
          onerror: (err) => {
            console.error('Session error', err);
            setError("Connection error. Check console.");
            handleDisconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are a helpful and energetic AI assistant.',
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start session");
      setStatus('idle');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setStatus('idle');
    
    // Stop tracks
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    // Stop audio context
    audioContextRef.current?.close();
    audioContextRef.current = null;
    
    // Close session if possible (wrapper logic)
    sessionRef.current?.then(session => {
        try { session.close(); } catch(e) {}
    });
    sessionRef.current = null;
    
    sourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      handleDisconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
        
        <div className={clsx(
          "w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500",
          status === 'active' ? "bg-brand-500/20 shadow-[0_0_40px_rgba(14,165,233,0.3)]" : "bg-slate-800"
        )}>
           <div className={clsx(
             "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
             status === 'active' ? "bg-brand-500 animate-pulse-slow" : "bg-slate-700",
             status === 'connecting' && "animate-pulse bg-amber-500"
           )}>
             {status === 'active' ? (
                <Volume2 className="w-10 h-10 text-white animate-bounce" />
             ) : (
                <Mic className="w-10 h-10 text-slate-400" />
             )}
           </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {status === 'active' ? 'Listening...' : status === 'connecting' ? 'Connecting...' : 'Gemini Live'}
        </h2>
        <p className="text-slate-400 mb-8 h-10">
          {status === 'active' 
            ? 'Start talking naturally. Gemini will respond with voice.' 
            : 'Experience real-time voice conversation with low latency.'}
        </p>

        {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
            </div>
        )}

        {!isConnected ? (
          <button
            onClick={startSession}
            disabled={status === 'connecting'}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Conversation
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5 fill-current" />
            End Session
          </button>
        )}
      </div>
      
      <p className="mt-8 text-slate-500 text-sm max-w-lg text-center">
        Powered by <code>gemini-2.5-flash-native-audio-preview</code>. <br/>
        Requires microphone access. Audio is processed locally and streamed to Google's servers.
      </p>
    </div>
  );
};