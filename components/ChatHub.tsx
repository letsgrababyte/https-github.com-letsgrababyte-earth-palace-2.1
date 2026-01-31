
import React, { useState } from 'react';
import { Search, Plus, MessageSquare, Users, ChevronRight, Hash, TrendingUp, Sparkles, Globe } from 'lucide-react';
import { ChatRoom } from '../types';

interface ChatHubProps {
  country: string;
  rooms: ChatRoom[];
  onSelectRoom: (room: ChatRoom) => void;
  onCreateRoom: () => void;
}

const CATEGORIES = ['General', 'Tech', 'Food', 'Culture', 'Travel', 'Meetups'];

export const ChatHub: React.FC<ChatHubProps> = ({ country, rooms, onSelectRoom, onCreateRoom }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || room.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const generalRoom = rooms.find(r => r.name.toLowerCase().includes('general'));

  return (
    <div className="flex flex-col min-h-screen bg-transparent animate-in fade-in slide-in-from-bottom-4">
      {/* Header Area - Sticky relative to the viewport/main scroll */}
      <div className="p-8 border-b border-gray-50 bg-white sticky top-16 z-10 sm:rounded-t-[2rem]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 text-white rounded-[1.8rem] shadow-xl shadow-indigo-100">
               <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{country} Hub</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Ecosystem Node Active</p>
            </div>
          </div>
          <button 
            onClick={onCreateRoom}
            className="group flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black active:scale-95 transition-all shadow-lg shadow-gray-200"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Launch Room</span>
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Featured: General Chat */}
        {generalRoom && activeCategory === 'All' && !searchQuery && (
          <button 
            onClick={() => onSelectRoom(generalRoom)}
            className="w-full mb-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-indigo-100 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Primary Node</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg font-black tracking-tight">{generalRoom.name}</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">Enter the main conversation stream</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-indigo-400 bg-indigo-500 overflow-hidden">
                    <img src={`https://picsum.photos/32/32?random=${i + 10}`} alt="" />
                  </div>
                ))}
              </div>
              <ChevronRight className="h-6 w-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        )}

        {/* Search & Filter */}
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search local channels..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.8rem] text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === 'All' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
            >
              All Regions
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="p-6 space-y-4 bg-white/50 min-h-screen pb-32">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 px-2">Discovered Communities</h4>
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <button 
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="w-full bg-white p-6 rounded-[2.2rem] border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-0.5 hover:border-indigo-100 transition-all text-left group active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors ring-1 ring-gray-100 group-hover:ring-indigo-100">
                <Hash className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{room.category}</span>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black">{room.memberCount}</span>
                  </div>
                </div>
                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors truncate text-base tracking-tight">{room.name}</h3>
                <p className="text-xs text-gray-400 truncate mt-1 font-medium">{room.lastMessage || room.description}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-100 group-hover:text-indigo-200 transition-colors" />
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-10">
            <div className="p-6 bg-gray-50 rounded-[2rem] mb-6">
              <Sparkles className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Expansion Required</h3>
            <p className="text-xs text-gray-400 mt-3 font-medium leading-relaxed">No custom channels detected in this sector. Launch a new community to begin.</p>
            <button 
              onClick={onCreateRoom}
              className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Initialize Node
            </button>
          </div>
        )}
      </div>

      {/* Insight Bar */}
      <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-between sm:rounded-b-[2rem]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Real-time Sync Active</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
               <TrendingUp className="h-3 w-3 text-indigo-600" />
               <span className="text-[9px] font-black text-indigo-600 uppercase">Growth +12%</span>
            </div>
          </div>
      </div>
    </div>
  );
};
