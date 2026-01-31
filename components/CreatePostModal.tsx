
import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Globe, 
  User as UserIcon, 
  Users, 
  MapPin, 
  Send,
  Zap,
  Check,
  ChevronRight,
  Eraser,
  Type as TypeIcon,
  Smile,
  MoreHorizontal,
  Plus,
  ChevronLeft,
  Search,
  Lock,
  Loader2
} from 'lucide-react';
import { User, Post, AIModel, PostVisibility, PostTarget } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CreatePostModalProps {
  onClose: () => void;
  onPost: (post: Partial<Post>) => void;
  currentUser: User;
}

const AI_MODELS: AIModel[] = [
  { id: 'gemini', name: 'Gemini', icon: '✨', color: 'bg-blue-600' },
  { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', color: 'bg-emerald-600' },
  { id: 'claude', name: 'Claude', icon: '🎭', color: 'bg-orange-600' },
  { id: 'llama', name: 'Llama', icon: '🦙', color: 'bg-purple-600' },
];

const COUNTRY_OPTIONS = ['United States', 'Japan', 'United Kingdom', 'Germany', 'France', 'Brazil', 'India', 'Canada', 'Australia'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPost, currentUser }) => {
  const [step, setStep] = useState<'compose' | 'compare' | 'distribute'>('compose');
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['gemini', 'chatgpt', 'claude', 'llama']);
  const [results, setResults] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeContent, setActiveContent] = useState('');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [target, setTarget] = useState<PostTarget>('globe');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;
    setIsGenerating(true);
    setStep('compare');

    const newResults: Record<string, string> = {};
    
    // Simulate parallel generation
    const generationPromises = selectedModels.map(async (modelId) => {
      if (modelId === 'gemini') {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a high-quality social media post based on this prompt: "${prompt}". Make it engaging, include a few relevant hashtags, and keep it under 280 characters.`
          });
          newResults[modelId] = response.text || "Failed to generate.";
        } catch (e) {
          newResults[modelId] = "Error: " + (e as Error).message;
        }
      } else {
        // Mocking other models for the simulation
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        newResults[modelId] = `[${modelId.toUpperCase()} GENERATION]\n\nExploring the depths of "${prompt}" reveals a fascinating intersection of culture and technology. This is precisely why we build at EarthPost.\n\n#Future #Ecosystem #Innovation`;
      }
    });

    await Promise.all(generationPromises);
    setResults(newResults);
    setIsGenerating(false);
  };

  const handleSelectResult = (content: string) => {
    setActiveContent(content);
    setStep('compose'); 
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    // Add a slight delay for aesthetic feedback
    setTimeout(() => {
      onPost({
        content: activeContent || prompt,
        imageUrl: attachedImage || undefined,
        visibility,
        target,
      });
      setIsDeploying(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-90">
              <X className="h-6 w-6 text-gray-400" />
            </button>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Create Post</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex -space-x-1">
                  {selectedModels.map(id => (
                    <div key={id} className={`w-3 h-3 rounded-full border border-white ${AI_MODELS.find(m => m.id === id)?.color}`}></div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {isGenerating ? 'Engines Running...' : 'Multi-Model Engine Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step === 'compare' && (
               <button 
               onClick={() => setStep('compose')}
               className="text-xs font-black text-gray-400 uppercase tracking-widest px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-all"
             >
               Skip to Edit
             </button>
            )}
            {step === 'compose' && (
              <button 
                onClick={() => setStep('distribute')}
                disabled={!prompt && !activeContent}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-30"
              >
                Targeting <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {step === 'distribute' && (
              <button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95 transition-all disabled:bg-blue-400"
              >
                {isDeploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isDeploying ? 'Deploying...' : 'Deploy to Feed'}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {step === 'compose' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
              {/* Left Column: Editor */}
              <div className="lg:col-span-8 p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <img src={currentUser.avatarUrl} className="w-12 h-12 rounded-full border-2 border-gray-100 shadow-sm" alt="" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 leading-none">{currentUser.username}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <button onClick={() => setStep('distribute')} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-colors">
                          <Globe className="h-3 w-3" /> {target === 'globe' ? 'Global Feed' : target === 'my-feed' ? 'My Feed' : target}
                       </button>
                       <button onClick={() => setStep('distribute')} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-tighter hover:bg-gray-200 transition-colors">
                          <Users className="h-3 w-3" /> {visibility}
                       </button>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    className="w-full bg-transparent border-none outline-none text-xl text-gray-900 placeholder-gray-300 leading-relaxed min-h-[300px] resize-none"
                    placeholder="Type your post here or use the AI tools on the right to draft a masterpiece..."
                    value={activeContent || prompt}
                    onChange={(e) => {
                      if (activeContent) setActiveContent(e.target.value);
                      else setPrompt(e.target.value);
                    }}
                  />
                  
                  {attachedImage && (
                    <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg group mt-4 animate-in slide-in-from-bottom-2">
                      <img src={attachedImage} className="w-full aspect-video object-cover" alt="" />
                      <button onClick={() => setAttachedImage(null)} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                      >
                        <ImageIcon className="h-6 w-6" />
                      </button>
                      <button className="p-4 bg-gray-50 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-2xl transition-all active:scale-90">
                        <Smile className="h-6 w-6" />
                      </button>
                      <button className="p-4 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all active:scale-90">
                        <MapPin className="h-6 w-6" />
                      </button>
                      <button className="p-4 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all active:scale-90">
                        <MoreHorizontal className="h-6 w-6" />
                      </button>
                   </div>
                   <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setAttachedImage(URL.createObjectURL(file));
                   }} />
                </div>
              </div>

              {/* Right Column: AI Engine */}
              <div className="lg:col-span-4 bg-gray-50/50 p-8 border-l border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">AI Studio</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Multi-Model Content Engine</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {AI_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => toggleModel(model.id)}
                      className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all active:scale-95 ${
                        selectedModels.includes(model.id)
                        ? `border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105`
                        : 'bg-white text-gray-400 border-white hover:border-gray-200'
                      }`}
                    >
                      <span className="text-2xl mb-2">{model.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{model.name}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Generation Logic</label>
                    <textarea 
                      className="w-full bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed min-h-[120px] outline-none placeholder-gray-300 resize-none font-medium focus:ring-2 focus:ring-blue-500 transition-all border border-gray-50"
                      placeholder="What should the AI write for you?"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating || selectedModels.length === 0}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-30"
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-current" />}
                    Compare {selectedModels.length} Models
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="p-2 bg-emerald-500 text-white rounded-xl">
                        <TypeIcon className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-800 leading-tight">
                        You can also type manually in the main editor. AI is here to assist or inspire.
                    </p>
                </div>
              </div>
            </div>
          )}

          {step === 'compare' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <header className="flex items-center justify-between mb-10">
                <button onClick={() => setStep('compose')} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-black text-xs uppercase tracking-widest transition-colors">
                  <ChevronLeft className="h-5 w-5" /> Back to Editor
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {isGenerating ? 'Engines Synthesizing...' : 'Comparison Complete'}
                  </span>
                  <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-blue-600 transition-all duration-1000 ${isGenerating ? 'w-2/3 animate-pulse' : 'w-full'}`}></div>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {selectedModels.map(modelId => {
                  const model = AI_MODELS.find(m => m.id === modelId);
                  const content = results[modelId];
                  return (
                    <div 
                      key={modelId}
                      className="bg-white rounded-[2.5rem] border border-gray-100 flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden"
                    >
                      <div className={`p-5 ${model?.color} flex items-center justify-between text-white`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{model?.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{model?.name}</span>
                        </div>
                        {content && <Check className="h-4 w-4 text-white/50" />}
                      </div>
                      
                      <div className="p-7 flex-1 flex flex-col">
                        {!content ? (
                          <div className="space-y-4">
                            <div className="h-3 bg-gray-50 rounded-full w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-50 rounded-full w-5/6 animate-pulse"></div>
                            <div className="h-3 bg-gray-50 rounded-full w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-50 rounded-full w-4/6 animate-pulse"></div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 leading-relaxed mb-8 line-clamp-[14] italic font-medium">
                              "{content}"
                            </p>
                            <button 
                              onClick={() => handleSelectResult(content)}
                              className="mt-auto w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                            >
                              Finalize this draft
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'distribute' && (
            <div className="p-10 max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Visibility */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-[2rem]">
                      <Users className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Privacy Circle</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Control who sees your update</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'public', label: 'Public Space', icon: Globe, desc: 'Broadcast to the global ecosystem' },
                      { id: 'private', label: 'Private Note', icon: Lock, desc: 'Visible only in your private lab' },
                      { id: 'groups', label: 'Ecosystem Circles', icon: Users, desc: 'Share with specific pioneer groups' },
                    ].map(v => (
                      <button
                        key={v.id}
                        onClick={() => setVisibility(v.id as PostVisibility)}
                        className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] ${
                          visibility === v.id ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-50' : 'bg-white border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${visibility === v.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <v.icon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <span className={`block text-sm font-black ${visibility === v.id ? 'text-blue-900' : 'text-gray-900'}`}>{v.label}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{v.desc}</span>
                          </div>
                        </div>
                        {visibility === v.id && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-[2rem]">
                      <Globe className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Post Destination</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Target specific feed layers</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setTarget('globe')}
                      className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] ${
                        target === 'globe' ? 'border-emerald-600 bg-emerald-50/50 shadow-xl shadow-emerald-50' : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${target === 'globe' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Globe className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <span className={`block text-sm font-black ${target === 'globe' ? 'text-emerald-900' : 'text-gray-900'}`}>Globe Feed</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Main global stream</span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setTarget('my-feed')}
                      className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] ${
                        target === 'my-feed' ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-50' : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${target === 'my-feed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <span className={`block text-sm font-black ${target === 'my-feed' ? 'text-blue-900' : 'text-gray-900'}`}>My Life Feed</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Personal AI intelligence feed</span>
                        </div>
                      </div>
                    </button>

                    <div className="pt-6 space-y-4">
                        <div className="relative group">
                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input 
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            placeholder="Search country nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 px-2">
                           {COUNTRY_OPTIONS.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map(country => (
                             <button 
                                key={country}
                                onClick={() => setTarget(country)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all ${target === country ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-600'}`}
                             >
                               {country}
                             </button>
                           ))}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-900 rounded-[3rem] p-10 flex items-center justify-between gap-10 shadow-2xl">
                <div className="flex-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Finalized Content Package</span>
                  <p className="text-white text-lg font-medium line-clamp-2 leading-relaxed italic opacity-90">"{activeContent || prompt}"</p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="flex -space-x-2 mb-3">
                    {selectedModels.map(id => (
                      <div key={id} className={`w-10 h-10 rounded-full border-4 border-gray-900 ${AI_MODELS.find(m => m.id === id)?.color} flex items-center justify-center text-white text-xs`}>
                        {AI_MODELS.find(m => m.id === id)?.icon}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cross-Model Verified</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
