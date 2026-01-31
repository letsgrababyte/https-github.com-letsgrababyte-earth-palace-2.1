
import React, { useState } from 'react';
import { 
  FileText, 
  Mail, 
  Github, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  MoreVertical,
  BrainCircuit,
  Settings,
  MessageSquare
} from 'lucide-react';
import { LifeFeedItem } from '../types';

const MOCK_LIFE_FEED: LifeFeedItem[] = [
    {
        id: '1',
        source: 'drive',
        title: 'Project Proposal 2025',
        description: 'You were editing this 2 hours ago. 3 unread comments from team.',
        timestamp: '2h ago',
        link: '#',
        status: 'updated',
        mockContent: "## EarthPost Project Proposal 2025\n\nTarget Goal: 10M active users by end of Q4.\n\nStrategy: AI-Curated life feeds and deep ecosystem integration.\n\nStatus: Initial Draft in progress."
    },
    {
        id: '2',
        source: 'gmail',
        title: 'Flight Confirmation: San Francisco',
        description: 'AI detected travel plans. Added to your calendar automatically.',
        timestamp: '4h ago',
        link: '#',
        status: 'unread'
    },
    {
        id: '3',
        source: 'github',
        title: 'earth-post-app PR #412',
        description: 'Pull request approved and merged by @lead_dev.',
        timestamp: '6h ago',
        link: '#'
    },
    {
        id: '4',
        source: 'calendar',
        title: 'Product Sync Meeting',
        description: 'Starts in 15 minutes. Join via Google Meet.',
        timestamp: '15m from now',
        link: '#',
        status: 'urgent'
    },
    {
        id: '5',
        source: 'chatgpt',
        title: 'AI Analysis Complete',
        description: 'Your weekly productivity summary is ready for review.',
        timestamp: '1d ago',
        link: '#'
    }
];

const SOURCE_ICONS = {
    drive: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    gmail: { icon: Mail, color: 'text-red-500', bg: 'bg-red-50' },
    github: { icon: Github, color: 'text-gray-900', bg: 'bg-gray-100' },
    calendar: { icon: CalendarIcon, color: 'text-green-600', bg: 'bg-green-50' },
    keep: { icon: CheckCircle2, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    chatgpt: { icon: BrainCircuit, color: 'text-teal-600', bg: 'bg-teal-50' },
    claude: { icon: BrainCircuit, color: 'text-orange-600', bg: 'bg-orange-50' }
};

interface MyFeedProps {
    onSelectItem: (item: LifeFeedItem) => void;
}

export const MyFeed: React.FC<MyFeedProps> = ({ onSelectItem }) => {
    const [connectedApps] = useState(['gmail', 'drive', 'github', 'calendar', 'chatgpt']);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Stats/Overview */}
            <div className="bg-white p-6 pb-8 border-b border-gray-100 rounded-b-[2.5rem] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">My Life Feed</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">AI-Curated Intelligence</p>
                    </div>
                    <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                        <Settings className="h-5 w-5" />
                    </button>
                </div>

                {/* Ecosystem Carousel */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                    {connectedApps.map((app) => {
                        const config = SOURCE_ICONS[app as keyof typeof SOURCE_ICONS];
                        return (
                            <div key={app} className="flex-shrink-0 flex flex-col items-center">
                                <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center border border-white shadow-sm ring-4 ring-gray-50/50 mb-2`}>
                                    <config.icon className={`h-6 w-6 ${config.color}`} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 capitalize">{app}</span>
                            </div>
                        );
                    })}
                    <button className="flex-shrink-0 flex flex-col items-center group">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-blue-500 transition-colors mb-2">
                            <Plus className="h-6 w-6 text-gray-300 group-hover:text-blue-500" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-300">Add App</span>
                    </button>
                </div>
            </div>

            {/* The Feed */}
            <div className="flex-1 p-4 space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Active Intelligence</h3>
                    <div className="flex items-center text-blue-600 text-[10px] font-black uppercase">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping mr-2"></span>
                        Real-time Sync
                    </div>
                </div>

                {MOCK_LIFE_FEED.map((item) => {
                    const config = SOURCE_ICONS[item.source];
                    return (
                        <div 
                            key={item.id} 
                            onClick={() => onSelectItem(item)}
                            className="bg-white rounded-[1.8rem] p-5 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer group"
                        >
                            <div className="flex-shrink-0 pt-1">
                                <div className={`p-3 rounded-2xl ${config.bg} ${config.color}`}>
                                    <config.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${config.color}`}>{item.source}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">{item.timestamp}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">{item.description}</p>
                                
                                <div className="mt-4 flex items-center justify-between">
                                    {item.status && (
                                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                            item.status === 'urgent' ? 'bg-red-100 text-red-600' : 
                                            item.status === 'updated' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {item.status}
                                        </div>
                                    )}
                                    <div className="flex-1"></div>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-[10px] font-black text-gray-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                        Open <ExternalLink className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                            <button className="flex-shrink-0 text-gray-300 hover:text-gray-900 h-fit">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    );
                })}

                {/* Empty Space for scrolling */}
                <div className="h-10"></div>
                
                <div className="text-center p-8">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                        <BrainCircuit className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Your AI personal assistant is scanning for more updates across your ecosystem.</p>
                </div>
            </div>
        </div>
    );
};
