import React, { useState } from 'react';
import { Image as ImageIcon, Wand2, Loader2, Download, Eraser } from 'lucide-react';
import { generateImage, editImage } from '../services/geminiService';
import clsx from 'clsx';

export const ImageView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Generation Configs
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Edit Configs
  const [uploadImage, setUploadImage] = useState<string | null>(null);

  const aspectRatios = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

  const handleGenerate = async () => {
      if (!prompt) return;
      setIsLoading(true);
      setResultImage(null);
      try {
          const img = await generateImage(prompt, size, aspectRatio);
          setResultImage(img);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleEdit = async () => {
      if (!prompt || !uploadImage) return;
      setIsLoading(true);
      setResultImage(null);
      try {
          const img = await editImage(uploadImage, prompt);
          setResultImage(img);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setUploadImage(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setActiveTab('generate')}
                  className={clsx("px-6 py-2 rounded-full font-bold transition-all border", activeTab === 'generate' ? "bg-brand-purple text-white border-brand-purple" : "text-slate-500 border-white/10 hover:border-white/30")}
                >
                    Generate (Nano Banana Pro)
                </button>
                <button 
                  onClick={() => setActiveTab('edit')}
                  className={clsx("px-6 py-2 rounded-full font-bold transition-all border", activeTab === 'edit' ? "bg-brand-purple text-white border-brand-purple" : "text-slate-500 border-white/10 hover:border-white/30")}
                >
                    Edit (Nano Banana)
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 h-fit">
                    {activeTab === 'generate' ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-brand-purple" />
                                    Prompt
                                </h3>
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="A futuristic city with neon lights..."
                                    className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Size</label>
                                    <select 
                                        value={size} 
                                        onChange={(e) => setSize(e.target.value as any)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                    >
                                        <option value="1K">1K</option>
                                        <option value="2K">2K</option>
                                        <option value="4K">4K</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Aspect Ratio</label>
                                    <select 
                                        value={aspectRatio} 
                                        onChange={(e) => setAspectRatio(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                    >
                                        {aspectRatios.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt}
                                className="w-full py-4 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                Generate Image
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                             <div>
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-brand-purple" />
                                    Source Image
                                </h3>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-all relative">
                                    <input type="file" onChange={onFileUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {uploadImage ? (
                                        <img src={uploadImage} alt="Upload" className="max-h-48 mx-auto rounded-lg" />
                                    ) : (
                                        <div className="text-slate-500">
                                            <p>Click to upload image</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Eraser className="w-5 h-5 text-brand-purple" />
                                    Editing Instruction
                                </h3>
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Add a retro filter, remove the background..."
                                    className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple"
                                />
                            </div>
                            <button 
                                onClick={handleEdit}
                                disabled={isLoading || !prompt || !uploadImage}
                                className="w-full py-4 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                Edit Image
                            </button>
                        </div>
                    )}
                </div>

                {/* Result */}
                <div className="bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center min-h-[500px] relative">
                    {resultImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4 group">
                             <img src={resultImage} alt="Result" className="max-w-full max-h-full rounded-lg shadow-2xl" />
                             <a 
                                href={resultImage} 
                                download={`gemini-gen-${Date.now()}.png`}
                                className="absolute bottom-6 right-6 p-3 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                             >
                                 <Download className="w-6 h-6" />
                             </a>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600">
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-4 animate-pulse">
                                    <Wand2 className="w-12 h-12 text-brand-purple" />
                                    <p>Working magic...</p>
                                </div>
                            ) : (
                                <p>Result will appear here</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};