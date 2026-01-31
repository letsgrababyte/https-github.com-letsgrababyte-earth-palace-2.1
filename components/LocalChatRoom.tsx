
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatRoom } from '../types';
import { 
  Send, 
  Sparkles, 
  MoreHorizontal, 
  ArrowLeft, 
  Users, 
  Hash, 
  ShieldCheck, 
  Languages, 
  Smile,
  Plus,
  Video,
  FileText,
  Download,
  X,
  PlayCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  user: User;
  text: string;
  time: string;
  isAI?: boolean;
  translatedText?: string;
  attachment?: string;
  attachmentType?: 'image' | 'video' | 'file';
  attachmentName?: string;
  reactions?: Record<string, number>;
}

interface LocalChatRoomProps {
  room: ChatRoom;
  currentUser: User;
  onBack: () => void;
  isVisible?: boolean; // Prop to sync with menu visibility
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export const LocalChatRoom: React.FC<LocalChatRoomProps> = ({ room, currentUser, onBack, isVisible = true }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: { id: 'a', username: 'Sarah', handle: '@sarah_k', avatarUrl: 'https://picsum.photos/100/100?random=10' },
      text: `Welcome to the ${room.name}! Let's build a great community here in ${room.country}.`,
      time: '12:05',
      reactions: { '❤️': 2, '🔥': 1 }
    },
    {
      id: '2',
      user: { id: 'b', username: 'Mike', handle: '@mike_travels', avatarUrl: 'https://picsum.photos/100/100?random=11' },
      text: 'The local cuisine here is absolutely unmatched. Anyone want to meet for lunch?',
      time: '12:08',
      reactions: { '👍': 1 }
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<{ url: string, type: 'image' | 'video' | 'file', name: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !attachmentPreview) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      user: currentUser,
      text: textToSend,
      attachment: attachmentPreview?.url,
      attachmentType: attachmentPreview?.type,
      attachmentName: attachmentPreview?.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };
    
    setMessages(prev => [...prev, newMessage]);
    if (!textOverride) setInput('');
    setAttachmentPreview(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      let type: 'image' | 'video' | 'file' = 'file';
      
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      
      setAttachmentPreview({ url, type, name: file.name });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTranslate = async (msgId: string, text: string) => {
    setIsTranslating(msgId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following text into English. If it is already in English, provide a more poetic version: "${text}"`
      });
      const translation = response.text || "Translation unavailable.";
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translatedText: translation } : m));
    } catch (e) {
      console.error("Translation error", e);
    } finally {
      setIsTranslating(null);
    }
  };

  const handleAIRephrase = async () => {
    if (!input.trim()) return;
    setIsProcessingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this chat message to be more engaging and charismatic for a social community: "${input}"`
      });
      const rephrased = response.text || input;
      setInput(rephrased);
    } catch (e) {
      console.error("AI Rephrase error", e);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const reactions = { ...(m.reactions || {}) };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...m, reactions };
    }));
  };

  const renderAttachment = (msg: Message) => {
    if (!msg.attachment) return null;
    switch (msg.attachmentType) {
      case 'image':
        return (
          <img 
            src={msg.attachment} 
            className="rounded-xl mb-2 w-full max-w-[280px] shadow-sm border border-gray-100 object-cover cursor-pointer hover:opacity-95 transition-opacity" 
            alt="Shared photo" 
            onClick={() => window.open(msg.attachment, '_blank')}
          />
        );
      case 'video':
        return (
          <div className="relative group/video rounded-xl overflow-hidden mb-2 max-w-[280px] border border-gray-100 shadow-sm bg-black">
            <video src={msg.attachment} className="w-full" controls />
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2 max-w-[280px] group/file">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FileText className="h-5 w-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{msg.attachmentName || 'Document'}</p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Shared File</p>
            </div>
            <a href={msg.attachment} download={msg.attachmentName} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Download className="h-4 w-4" /></a>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent animate-in fade-in slide-in-from-right-4">
      {/* Room Header - Sticky below TopBar */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-16 z-20 sm:rounded-t-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 active:scale-90 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                <Hash className="h-5 w-5" />
             </div>
             <div>
                <h3 className="text-sm font-black text-gray-900 leading-tight flex items-center gap-1.5">
                  {room.name}
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                      <Users className="h-3 w-3" /> {room.memberCount} members
                   </div>
                   <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                   <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      Live
                   </div>
                </div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><Languages className="h-5 w-5" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><MoreHorizontal className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Messages Area - Natural flow in main window */}
      <div className="p-6 space-y-8 bg-white pb-60">
        <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="px-4 py-1.5 bg-white/50 backdrop-blur-sm rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 shadow-sm">
                Node {room.country} Ecosystem Secure
            </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[85%] ${msg.user.id === currentUser.id ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
              <div className="flex-shrink-0 mb-1">
                 <img src={msg.user.avatarUrl} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md" alt="" />
              </div>
              <div className={`flex flex-col ${msg.user.id === currentUser.id ? 'items-end' : 'items-start'}`}>
                {msg.user.id !== currentUser.id && (
                  <span className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter ml-1">{msg.user.username}</span>
                )}
                
                <div className={`relative group/bubble px-4 py-3 rounded-[1.5rem] text-sm leading-relaxed shadow-sm transition-all ${
                  msg.user.id === currentUser.id 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {renderAttachment(msg)}
                  {msg.text && <p>{msg.text}</p>}
                  {msg.translatedText && (
                    <div className="mt-3 pt-3 border-t border-white/20 text-xs italic opacity-90 animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Languages className="h-3 w-3" /><span className="font-black uppercase tracking-widest text-[8px]">Translated</span>
                      </div>
                      "{msg.translatedText}"
                    </div>
                  )}
                  {/* Bubble Actions */}
                  <div className={`absolute top-0 ${msg.user.id === currentUser.id ? '-left-12' : '-right-12'} opacity-0 group-hover/bubble:opacity-100 transition-opacity flex flex-col gap-1`}>
                    <button onClick={() => handleTranslate(msg.id, msg.text)} disabled={isTranslating === msg.id} className="p-1.5 bg-white shadow-md border border-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                      <Languages className={`h-3.5 w-3.5 ${isTranslating === msg.id ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                {/* Reactions */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className={`flex gap-1 mt-1.5 ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)} className="bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm text-[10px] font-bold flex items-center gap-1 hover:bg-indigo-50 transition-colors">
                        {emoji} <span className="text-gray-400">{count}</span>
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[9px] font-black text-gray-300 mt-2 uppercase tracking-tighter px-1">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Sticky Bottom Interface: Input Area & Quick Picker */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
      } bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-4px_15px_rgba(0,0,0,0.05)]`}>
        
        {/* Emoji Quick Picker */}
        <div className="px-4 py-2 bg-gray-50/50 flex items-center justify-center gap-4 overflow-x-auto no-scrollbar">
          {QUICK_REACTIONS.map(emoji => (
            <button key={emoji} onClick={() => { const lastMsg = messages[messages.length - 1]; if (lastMsg) toggleReaction(lastMsg.id, emoji); }} className="text-lg hover:scale-125 transition-transform active:scale-90">{emoji}</button>
          ))}
        </div>

        <div className="p-4 max-w-2xl mx-auto">
            {/* Attachment Preview */}
            {attachmentPreview && (
              <div className="mb-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                  {attachmentPreview.type === 'image' ? ( <img src={attachmentPreview.url} className="w-full h-full object-cover" alt="" /> ) : attachmentPreview.type === 'video' ? ( <PlayCircle className="h-6 w-6 text-indigo-600" /> ) : ( <FileText className="h-6 w-6 text-indigo-600" /> )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-indigo-900 truncate">{attachmentPreview.name}</p>
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{attachmentPreview.type} Ready</p>
                </div>
                <button onClick={() => setAttachmentPreview(null)} className="p-2 bg-white text-indigo-400 hover:text-red-500 rounded-full shadow-sm transition-colors"><X className="h-4 w-4" /></button>
              </div>
            )}

            <div className="flex items-center gap-3 mb-16 sm:mb-2"> {/* Bottom margin to avoid overlap with menu buttons if visible */}
                <button onClick={() => fileInputRef.current?.click()} className="p-3.5 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all active:scale-90" title="Attach Files"><Plus className="h-5 w-5" /></button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip" />
                
                <div className="relative flex-1">
                    <input 
                      type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={attachmentPreview ? "Add a caption..." : "Share your thoughts..."}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-4 pr-12 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                    />
                    <button onClick={handleAIRephrase} disabled={!input.trim() || isProcessingAI} className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${input.trim() ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 opacity-30'}`}>
                        <Sparkles className={`h-5 w-5 ${isProcessingAI ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                <button onClick={() => handleSend()} disabled={!input.trim() && !attachmentPreview} className={`p-4 rounded-2xl shadow-xl transition-all active:scale-90 flex items-center justify-center ${input.trim() || attachmentPreview ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gray-100 text-gray-300 shadow-none cursor-default'}`}>
                  <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
