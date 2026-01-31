
import React, { useState } from 'react';
import { Project, User, ProjectMember } from '../types';
import { 
  ArrowLeft, 
  Github, 
  Globe, 
  Users, 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Share2, 
  Rocket, 
  CheckCircle2, 
  Clock,
  Zap,
  ChevronRight,
  ShieldCheck,
  Search,
  // Added missing 'X' icon for modal close button
  X
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  currentUser: User;
  onBack: () => void;
  onInvite: (userId: string) => void;
  onRequestToJoin: () => void;
}

const MOCK_FRIENDS = [
  { id: 'f1', username: 'Alex', avatarUrl: 'https://picsum.photos/100/100?random=200' },
  { id: 'f2', username: 'Jordan', avatarUrl: 'https://picsum.photos/100/100?random=201' },
  { id: 'f3', username: 'Sam', avatarUrl: 'https://picsum.photos/100/100?random=202' },
];

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  currentUser, 
  onBack, 
  onInvite, 
  onRequestToJoin 
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const isOwner = project.ownerId === currentUser.id;
  const isMember = project.members.some(m => m.user.id === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      {/* Header Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-gray-900 border border-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-gray-900 border border-gray-100"><Share2 className="h-5 w-5" /></button>
          <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-gray-900 border border-gray-100"><MoreHorizontal className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="h-64 bg-gradient-to-br from-blue-600 to-indigo-900 relative overflow-hidden flex items-end p-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-transparent scale-150"></div>
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-6 transform -rotate-6">
            {project.type === 'open-source' ? <Github className="h-full w-full text-gray-900" /> : <Rocket className="h-full w-full text-blue-600" />}
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-blue-100 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{project.type}</span>
              <span className="text-[10px] font-black text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{project.visibility}</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">{project.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">About Project</h2>
                {isOwner && (
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center">
                    Settings <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-8">
                {project.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">#{tag}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" className="flex items-center gap-4 p-5 rounded-3xl bg-gray-900 text-white hover:scale-[1.02] transition-transform">
                    <Github className="h-6 w-6" />
                    <div className="text-left">
                      <span className="block text-[8px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Source Code</span>
                      <span className="text-xs font-bold leading-none">View Repo</span>
                    </div>
                  </a>
                )}
                {project.websiteUrl && (
                  <a href={project.websiteUrl} target="_blank" className="flex items-center gap-4 p-5 rounded-3xl bg-blue-600 text-white hover:scale-[1.02] transition-transform">
                    <Globe className="h-6 w-6" />
                    <div className="text-left">
                      <span className="block text-[8px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Live Preview</span>
                      <span className="text-xs font-bold leading-none">Demo Link</span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Project Feed / Updates Placeholder */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Project Log</h3>
                  <button className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"><Plus className="h-5 w-5" /></button>
               </div>
               <div className="space-y-6">
                  <div className="flex gap-4 group">
                     <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                           <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="w-0.5 flex-1 bg-gray-100 my-2"></div>
                     </div>
                     <div className="flex-1 pb-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today</span>
                        <p className="text-sm font-bold text-gray-900 mt-1">Alpha milestone reached!</p>
                        <p className="text-xs text-gray-500 mt-1">The initial framework is now deployed to the test environment.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                           <Clock className="h-5 w-5" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 days ago</span>
                        <p className="text-sm font-bold text-gray-900 mt-1">Project Launched on EarthPost</p>
                        <p className="text-xs text-gray-500 mt-1">The project is now open for collaboration.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
               {isOwner ? (
                 <div className="space-y-4">
                    <button 
                      onClick={() => setShowInviteModal(true)}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                       <Users className="h-4 w-4" /> Invite Talent
                    </button>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                       <div className="flex items-center gap-3 mb-2">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Requests</span>
                       </div>
                       <p className="text-[11px] text-blue-800 font-bold leading-tight">3 people have requested to join your initiative.</p>
                       <button className="text-[10px] font-black text-blue-600 underline mt-3 uppercase tracking-tighter">Review Applications</button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <button 
                     onClick={onRequestToJoin}
                     disabled={isMember}
                     className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl ${
                       isMember 
                       ? 'bg-green-50 text-green-600 shadow-green-50 cursor-default' 
                       : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
                     }`}
                   >
                     {isMember ? <ShieldCheck className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                     {isMember ? 'Member of Project' : 'Apply to Join'}
                   </button>
                   <p className="text-[10px] text-gray-400 text-center font-bold px-4 leading-tight">
                     Project owners review all applications to maintain high initiative standards.
                   </p>
                 </div>
               )}
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Initiative Team</h3>
               <div className="space-y-4">
                  {project.members.map((member, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={member.user.avatarUrl} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
                            {member.status === 'pending' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full"></div>}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-gray-900 leading-none">{member.user.username}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{member.role}</span>
                          </div>
                       </div>
                       <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-900"><MessageSquare className="h-4 w-4" /></button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Invite Friends</h2>
                 <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
              </div>

              <div className="relative mb-6">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                 <input className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search friends..." />
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar mb-8">
                 {MOCK_FRIENDS.map(friend => (
                   <div key={friend.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <img src={friend.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                         <span className="text-sm font-bold text-gray-900">{friend.username}</span>
                      </div>
                      <button 
                        onClick={() => { onInvite(friend.id); setShowInviteModal(false); }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                      >
                         Invite
                      </button>
                   </div>
                 ))}
              </div>

              <button onClick={() => setShowInviteModal(false)} className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">Close</button>
           </div>
        </div>
      )}
    </div>
  );
};
