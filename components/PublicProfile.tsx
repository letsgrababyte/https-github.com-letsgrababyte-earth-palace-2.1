
import React, { useState, useRef } from 'react';
import { User, Post, Project } from '../types';
import { 
  Camera, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Edit3, 
  ArrowLeft, 
  MoreHorizontal, 
  Video, 
  Grid, 
  Info,
  Check,
  X,
  Plus,
  Play,
  Rocket,
  Github,
  Users,
  ExternalLink
} from 'lucide-react';
import { FeedPost } from './FeedPost';
import { CreateProjectModal } from './CreateProjectModal';

interface PublicProfileProps {
  user: User;
  posts: Post[];
  projects: Project[];
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onAddProject: (project: Partial<Project>) => void;
  onViewProject: (project: Project) => void;
}

export const PublicProfile: React.FC<PublicProfileProps> = ({ 
  user, 
  posts, 
  projects,
  onBack, 
  onUpdateUser, 
  onAddProject,
  onViewProject
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'videos' | 'about'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editData, setEditData] = useState<User>({ ...user });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateUser(editData);
    setIsEditing(false);
  };

  const handlePhotoUpload = (type: 'avatar' | 'cover') => {
    const randomId = Math.floor(Math.random() * 1000);
    const newUrl = `https://picsum.photos/800/600?random=${randomId}`;
    
    if (type === 'avatar') {
      const updated = { ...editData, avatarUrl: `https://picsum.photos/200/200?random=${randomId}` };
      setEditData(updated);
      onUpdateUser(updated);
    } else {
      const updated = { ...editData, coverUrl: newUrl };
      setEditData(updated);
      onUpdateUser(updated);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center py-4 border-b-2 transition-all ${
        activeTab === id ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button className="pointer-events-auto p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-48 sm:h-64 bg-gray-200 relative group overflow-hidden">
          <img 
            src={user.coverUrl || 'https://picsum.photos/1200/400?grayscale'} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
          <button 
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold"
          >
            <Camera className="h-4 w-4" />
            Update Cover
          </button>
          <input type="file" ref={coverInputRef} className="hidden" onChange={() => handlePhotoUpload('cover')} />
        </div>

        <div className="px-6 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.username} />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white"
              >
                <Camera className="h-8 w-8" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={() => handlePhotoUpload('avatar')} />
            </div>

            <div className="flex-1 sm:mb-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.username}</h1>
              <p className="text-gray-500 font-bold">{user.handle}</p>
            </div>

            <div className="flex gap-2 sm:mb-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white rounded-full font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Check className="h-4 w-4" /> Save
                  </button>
                  <button onClick={() => { setIsEditing(false); setEditData({...user}); }} className="p-2.5 bg-gray-200 text-gray-600 rounded-full active:scale-95 transition-all">
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </button>
                  <button onClick={() => setShowCreateProject(true)} className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-gray-200">
                    <Plus className="h-4 w-4" /> Add Project
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {isEditing ? (
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                placeholder="Write something about yourself..."
                rows={3}
                value={editData.bio}
                onChange={e => setEditData({...editData, bio: e.target.value})}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed text-sm">
                {user.bio || "No bio yet. Build the future with projects!"}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 border-t border-gray-50 pt-6">
              <div className="flex items-center text-gray-500 text-xs font-semibold">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {isEditing ? <input className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} placeholder="Location" /> : user.location || 'Global'}
              </div>
              <div className="flex items-center text-gray-500 text-xs font-semibold">
                <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
                {isEditing ? <input className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none" value={editData.website} onChange={e => setEditData({...editData, website: e.target.value})} placeholder="Website" /> : <a href={user.website || '#'} className="text-blue-600 hover:underline">{user.website || 'earthpost.app'}</a>}
              </div>
              <div className="flex items-center text-gray-500 text-xs font-semibold">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                Joined {user.joinedDate || 'March 2025'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 mt-6 shadow-sm">
        <div className="max-w-2xl mx-auto flex">
          <TabButton id="posts" label="Posts" icon={Grid} />
          <TabButton id="projects" label="Projects" icon={Rocket} />
          <TabButton id="videos" label="Videos" icon={Video} />
          <TabButton id="about" label="About" icon={Info} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto p-4 sm:p-0 sm:mt-4">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map(post => <FeedPost key={post.id} post={post} />)}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <button 
              onClick={() => setShowCreateProject(true)}
              className="w-full p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all bg-white/50 group"
            >
              <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:bg-blue-50 transition-colors">
                <Plus className="h-8 w-8" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Start New Initiative</span>
              <p className="text-[10px] font-bold mt-1 opacity-60">Tech, Art, Business, or Open Source</p>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => onViewProject(project)}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                      {project.type === 'open-source' ? <Github className="h-6 w-6" /> : <Rocket className="h-6 w-6" />}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{project.type}</span>
                      {project.helpRequested && (
                        <div className="flex items-center text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Collab Open
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{project.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{project.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((m, i) => (
                        <img key={i} src={m.user.avatarUrl} className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm" alt="" />
                      ))}
                      {project.members.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-gray-400">+{project.members.length - 3}</div>
                      )}
                    </div>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">
                      Hub <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[9/16] bg-gray-200 rounded-2xl relative group overflow-hidden cursor-pointer">
                <img src={`https://picsum.photos/400/711?random=${i + 50}`} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Play className="h-10 w-10 text-white drop-shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 space-y-8 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</span>
                  <span className="text-sm font-bold text-gray-700">{user.username}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-4">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</span>
                   <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">Pioneer Explorer</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreateProject && (
        <CreateProjectModal 
          currentUser={user} 
          onClose={() => setShowCreateProject(false)} 
          onCreate={(p) => {
            onAddProject(p);
            setShowCreateProject(false);
          }}
        />
      )}
    </div>
  );
};
