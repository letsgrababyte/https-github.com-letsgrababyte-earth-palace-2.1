
import React, { useState } from 'react';
import { X, MessageSquare, Hash, Globe, Check, ChevronRight } from 'lucide-react';
import { ChatRoom, User } from '../types';

interface CreateChatRoomModalProps {
  country: string;
  currentUser: User;
  onClose: () => void;
  onCreate: (room: Partial<ChatRoom>) => void;
}

const CATEGORIES = ['General', 'Tech', 'Food', 'Culture', 'Travel', 'Meetups', 'Music', 'Sports'];

export const CreateChatRoomModal: React.FC<CreateChatRoomModalProps> = ({ country, currentUser, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name,
      description,
      category,
      country,
      createdBy: currentUser.id,
      memberCount: 1,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Launch New Room</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Expanding the {country} Ecosystem</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Room Identity</label>
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Local Foodies, Tech Innovators..."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                    category === cat ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Vision / Description</label>
            <textarea 
              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-32"
              placeholder="What's this room about? Set the tone for your community..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
             <div className="p-2 bg-blue-600 text-white rounded-lg">
               <Globe className="h-4 w-4" />
             </div>
             <p className="text-[10px] font-bold text-blue-800 leading-tight">
               Your room will be pinned to the <strong>{country}</strong> Chat Hub and visible to all pioneers in this region.
             </p>
          </div>
        </form>

        <div className="px-8 py-6 bg-white border-t border-gray-100 flex gap-4">
          <button onClick={onClose} type="button" className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">Cancel</button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Deploy Room <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
