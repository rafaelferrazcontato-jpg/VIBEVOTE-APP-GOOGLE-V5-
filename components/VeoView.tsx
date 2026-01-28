import React, { useState } from 'react';
import { Video, Key, Loader2, PlayCircle, Download } from 'lucide-react';
import { generateVideo, pollVideoOperation } from '../services/geminiService';
import clsx from 'clsx';

export const VeoView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [apiKeyError, setApiKeyError] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check for API key selection
    try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
             const hasKey = await window.aistudio.hasSelectedApiKey();
             if (!hasKey) {
                 await window.aistudio.openSelectKey();
                 // Assume success after dialog interaction or rely on retry
             }
        }
    } catch (e) {
        console.warn("AI Studio key check failed", e);
    }

    setIsGenerating(true);
    setVideoUri(null);
    setApiKeyError(false);
    setStatusMsg('Initializing Veo model...');

    try {
        let operation = await generateVideo(prompt);
        
        // Polling loop
        while (!operation.done) {
            setStatusMsg('Dreaming up your video... (this may take a minute)');
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await pollVideoOperation(operation);
        }

        if (operation.error) {
            throw new Error(operation.error.message || "Video generation failed");
        }

        const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (uri) {
            // Append API key for download if needed, though for preview often handled by browser session in some envs
            // In this specific SDK instruction: "You must append an API key when fetching from the download link."
            setVideoUri(`${uri}&key=${process.env.API_KEY}`);
            setStatusMsg('Complete!');
        } else {
            throw new Error("No video URI returned");
        }

    } catch (error: any) {
        console.error("Veo Error:", error);
        if (error.message?.includes("Requested entity was not found") || error.message?.includes("403") || error.message?.includes("401")) {
             setApiKeyError(true);
             setStatusMsg("Authorization failed. Please select a valid paid API key.");
        } else {
             setStatusMsg(`Error: ${error.message}`);
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const openKeySelector = async () => {
      if (window.aistudio) {
          await window.aistudio.openSelectKey();
      }
  };

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/5 rounded-2xl p-8 mb-8">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Video className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Veo Video Generator</h2>
                        <p className="text-slate-300">
                            Create 720p videos from text prompts using Google's <code>veo-3.1-fast-generate-preview</code> model.
                            <br/>
                            <span className="text-sm text-purple-300 mt-1 inline-block">
                                * Requires a paid billing project API key.
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Video Prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A neon hologram of a cat driving at top speed..."
                            className="w-full h-32 bg-slate-800 border-none rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                        />
                        
                        <div className="mt-4 flex gap-3">
                             <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                                {isGenerating ? 'Generating...' : 'Generate Video'}
                            </button>
                            
                            {apiKeyError && (
                                <button 
                                    onClick={openKeySelector}
                                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors"
                                    title="Select API Key"
                                >
                                    <Key className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        {statusMsg && (
                            <p className={clsx("mt-4 text-sm text-center", apiKeyError ? "text-red-400" : "text-slate-400")}>
                                {statusMsg}
                            </p>
                        )}
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Tips</h3>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>• Be descriptive about lighting and style.</li>
                            <li>• Mention camera angles (e.g., "Drone shot", "Close up").</li>
                            <li>• Generation typically takes 60-90 seconds.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-black/40 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[300px] relative overflow-hidden group">
                    {videoUri ? (
                        <div className="w-full h-full flex flex-col items-center">
                            <video 
                                src={videoUri} 
                                controls 
                                className="w-full h-full object-contain max-h-[500px]"
                                autoPlay
                                loop
                            />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a 
                                    href={videoUri} 
                                    download="veo-generation.mp4"
                                    className="p-2 bg-slate-900/80 rounded-lg text-white hover:bg-purple-600 block backdrop-blur-sm"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600">
                            {isGenerating ? (
                                <div className="flex flex-col items-center animate-pulse">
                                    <Video className="w-12 h-12 mb-4 opacity-50" />
                                    <p>Generating video...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Video preview will appear here</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};