
import React from 'react';
import { LifeFeedItem } from '../types';
import { 
  ArrowLeft, 
  Share2, 
  Maximize2, 
  MoreHorizontal, 
  FileText, 
  Mail, 
  Github, 
  Calendar, 
  CheckCircle2, 
  BrainCircuit,
  Save
} from 'lucide-react';

interface LifeItemViewerProps {
  item: LifeFeedItem;
  onBack: () => void;
}

const SOURCE_ICONS = {
    drive: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Google Drive' },
    gmail: { icon: Mail, color: 'text-red-500', bg: 'bg-red-50', label: 'Gmail' },
    github: { icon: Github, color: 'text-gray-900', bg: 'bg-gray-100', label: 'GitHub' },
    calendar: { icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', label: 'Google Calendar' },
    keep: { icon: CheckCircle2, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Google Keep' },
    chatgpt: { icon: BrainCircuit, color: 'text-teal-600', bg: 'bg-teal-50', label: 'ChatGPT' },
    claude: { icon: BrainCircuit, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Claude AI' }
};

export const LifeItemViewer: React.FC<LifeItemViewerProps> = ({ item, onBack }) => {
    const config = SOURCE_ICONS[item.source];
    const Icon = config.icon;

    return (
        <div className="flex flex-col h-[calc(100vh-14rem)] bg-white sm:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 fade-in duration-300">
            {/* Header Toolbar */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none">{config.label}</span>
                            <h3 className="font-bold text-gray-900 text-sm truncate max-w-[150px] leading-tight mt-0.5">{item.title}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <Maximize2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Embedded Work Area Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 no-scrollbar">
                {item.source === 'drive' && (
                    <div className="bg-white min-h-full p-10 shadow-sm border border-gray-100 rounded-xl prose prose-sm max-w-none">
                        <h1 className="text-2xl font-bold mb-6">{item.title}</h1>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            This is an embedded workspace view. You can edit this document directly within EarthPost.
                        </p>
                        <textarea 
                            className="w-full min-h-[400px] border-none focus:ring-0 p-0 text-gray-800 leading-relaxed resize-none"
                            placeholder="Start writing..."
                            defaultValue={item.mockContent || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                        />
                    </div>
                )}

                {item.source === 'github' && (
                    <div className="space-y-4">
                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-xl">
                            <div className="px-4 py-2 bg-gray-800 flex items-center gap-2 border-b border-gray-700">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono ml-2">App.tsx — earth-post-app</span>
                            </div>
                            <pre className="p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                                <code>{`import React from 'react';\n\nexport const App = () => {\n  return (\n    <div className="app">\n      <h1>Welcome to EarthPost</h1>\n      <p>Building the future of social...</p>\n    </div>\n  );\n};`}</code>
                            </pre>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 text-sm mb-2">Review Status</h4>
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>2 Approvals • All checks passed</span>
                            </div>
                        </div>
                    </div>
                )}

                {item.source === 'gmail' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Inbox</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">U</div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">United Airlines</span>
                                    <span className="text-[10px] text-gray-400">to: me &lt;explorer@earthpost.app&gt;</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-700 space-y-4">
                            <p>Hi Explorer,</p>
                            <p>Your flight confirmation for San Francisco (SFO) is attached below. Your AI assistant has automatically added this to your calendar.</p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-red-500" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">confirmation_SFO.pdf</p>
                                        <p className="text-[10px] text-gray-400">1.2 MB</p>
                                    </div>
                                </div>
                                <button className="text-blue-600 text-[10px] font-bold hover:underline">Download</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Default/Other Sources */}
                {['calendar', 'keep', 'chatgpt', 'claude'].includes(item.source) && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-50">
                        <Icon className={`h-16 w-16 ${config.color} mb-4`} />
                        <h3 className="font-bold text-gray-900">Embedded View Coming Soon</h3>
                        <p className="text-sm text-gray-500 max-w-xs mt-2">The full interactive workspace for {config.label} is currently being synchronized with your profile.</p>
                    </div>
                )}
            </div>

            {/* Footer Workspace Actions */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <img key={i} src={`https://picsum.photos/32/32?random=${i + 100}`} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" alt="Collaborator" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">+2</div>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Sync Changes
                </button>
            </div>
        </div>
    );
};
