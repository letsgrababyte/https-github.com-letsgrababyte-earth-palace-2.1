
import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Settings2, 
  BrainCircuit, 
  ChevronLeft, 
  Save, 
  Terminal, 
  Send, 
  Activity, 
  Cpu,
  Layers,
  MessageSquare,
  ShieldCheck,
  Check,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { AIModel } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AIStudioProps {
  onBack: () => void;
  activeModelId: string;
  systemInstruction: string;
  onUpdateSettings: (modelId: string, instruction: string, temperature: number) => void;
}

const MODELS: AIModel[] = [
  { 
    id: 'gemini-3-flash-preview', 
    name: 'Gemini 3 Flash', 
    icon: '✨', 
    color: 'bg-blue-600', 
    description: 'Ultra-fast, efficient model optimized for real-time social interactions.',
    capabilities: ['Vision', 'Audio', 'Speed']
  },
  { 
    id: 'gemini-3-pro-preview', 
    name: 'Gemini 3 Pro', 
    icon: '🧠', 
    color: 'bg-indigo-600', 
    description: 'Maximum intelligence for complex reasoning and creative generation.',
    capabilities: ['Reasoning', 'Coding', 'Creativity']
  },
  { 
    id: 'gpt-4o-mock', 
    name: 'ChatGPT 4o', 
    icon: '🤖', 
    color: 'bg-emerald-600', 
    description: 'High-performance multimodal model for diverse workflows.',
    capabilities: ['Logic', 'Versatile']
  },
  { 
    id: 'claude-3-mock', 
    name: 'Claude 3.5', 
    icon: '🎭', 
    color: 'bg-orange-600', 
    description: 'Nuanced, human-like responses with exceptional safety tuning.',
    capabilities: ['Nuance', 'Long Context']
  }
];

export const AIStudio: React.FC<AIStudioProps> = ({ 
  onBack, 
  activeModelId, 
  systemInstruction: initialInstruction,
  onUpdateSettings 
}) => {
  const [selectedModel, setSelectedModel] = useState(activeModelId);
  const [instruction, setInstruction] = useState(initialInstruction);
  const [temperature, setTemperature] = useState(0.7);
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateSettings(selectedModel, instruction, temperature);
      setIsSaving(false);
    }, 1000);
  };

  const handleSandboxTest = async () => {
    if (!sandboxInput.trim()) return;
    setIsProcessing(true);
    setSandboxOutput('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: selectedModel.includes('gemini') ? selectedModel : 'gemini-3-flash-preview',
        contents: sandboxInput,
        config: {
          systemInstruction: instruction,
          temperature: temperature
        }
      });
      
      setSandboxOutput(response.text || "No response received.");
    } catch (e) {
      setSandboxOutput(`Error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 active:scale-90 transition-all">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">AI Studio</h2>
            <div className="flex items-center gap-2 mt-0.5">
               <Activity className="h-3 w-3 text-indigo-500 animate-pulse" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Neural Ecosystem Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isSaving ? 'Syncing...' : 'Save Configuration'}
        </button>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8 pb-32">
        
        {/* Model Marketplace */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Foundational Models</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODELS.map(model => (
              <button 
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-6 rounded-[2.2rem] border-2 text-left transition-all relative overflow-hidden group ${
                  selectedModel === model.id 
                    ? 'bg-white border-indigo-600 shadow-2xl scale-[1.02]' 
                    : 'bg-white border-transparent shadow-sm hover:border-indigo-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${model.color} text-white flex items-center justify-center text-3xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                    {model.icon}
                  </div>
                  {selectedModel === model.id && (
                    <div className="bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <h4 className="font-black text-gray-900 text-lg mb-1">{model.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{model.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {model.capabilities?.map(cap => (
                    <span key={cap} className="px-2 py-0.5 bg-gray-50 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-tighter border border-gray-100">
                      {cap}
                    </span>
                  ))}
                </div>
                {/* Visual Accent */}
                {selectedModel === model.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-40 blur-3xl pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Neural Logic Settings */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Global AI Persona</h3>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">System Instruction (Build on Logic)</label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] p-6 text-sm text-gray-700 leading-relaxed min-h-[160px] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all resize-none shadow-inner"
                  placeholder="Define how the AI should perceive the world and interact with your content..."
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-4 px-2 leading-relaxed">
                  <strong>Pioneer Tip:</strong> This prompt will be injected into every creative session across EarthPost. Defining a unique persona helps differentiate your content ecosystem.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Neural Temperature</span>
                    <p className="text-[9px] text-gray-300 font-bold uppercase mt-0.5">Creativity vs Precision</p>
                  </div>
                  <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{(temperature * 10).toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-3 px-1">
                  <span className="text-[8px] font-black text-gray-300 uppercase">Deterministic</span>
                  <span className="text-[8px] font-black text-gray-300 uppercase">Chaotic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Sandbox */}
          <div className="lg:col-span-5">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Terminal className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Sandbox</h3>
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">Live Inference Test</p>
                  </div>
                </div>
                {isProcessing && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-indigo-400 uppercase">Thinking</span>
                  </div>
                )}
              </div>

              <div className="relative z-10 flex-1 flex flex-col space-y-6">
                <div className="flex-1 bg-black/40 rounded-[1.8rem] p-6 overflow-y-auto no-scrollbar border border-white/5 font-mono text-sm leading-relaxed text-indigo-100/90 shadow-inner">
                  {sandboxOutput ? (
                    <div className="animate-in fade-in duration-500">
                      <span className="text-indigo-400 mr-2">system@earthpost:~$</span>
                      {sandboxOutput}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 opacity-40">
                      <Cpu className="h-10 w-10 mb-4" />
                      <p className="text-xs uppercase font-black tracking-widest">Ready for deployment</p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter command or prompt..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all font-mono"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSandboxTest()}
                  />
                  <button 
                    onClick={handleSandboxTest}
                    disabled={isProcessing || !sandboxInput.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl shadow-lg active:scale-90 transition-all disabled:opacity-30 disabled:scale-100"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Verification */}
        <section className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex items-center justify-between gap-10 shadow-2xl shadow-indigo-200">
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                 <ShieldCheck className="h-6 w-6 text-indigo-200" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Neural Safety Verified</h3>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed font-medium opacity-90 max-w-lg">
                 All inference sessions within the Studio are governed by the EarthPost Ecosystem Standards. 
                 Configurations are encrypted and stored locally in your node.
              </p>
           </div>
           <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full bg-indigo-500 border-4 border-indigo-600 flex items-center justify-center text-indigo-200 shadow-xl">
                  <Bot className="h-5 w-5" />
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};
