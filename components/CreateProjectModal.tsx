
import React, { useState } from 'react';
import { X, Rocket, Github, Globe, Lock, Unlock, Users, Plus, Tag, FileText } from 'lucide-react';
import { Project, ProjectType, ProjectVisibility, User } from '../types';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (project: Partial<Project>) => void;
  currentUser: User;
}

const PROJECT_TYPES: { id: ProjectType; label: string; icon: any }[] = [
  { id: 'startup', label: 'Tech Startup', icon: Rocket },
  { id: 'open-source', label: 'Open Source', icon: Github },
  { id: 'content-creation', label: 'Content Creation', icon: Globe },
  { id: 'research', label: 'Research', icon: FileText },
  { id: 'artistic', label: 'Artistic', icon: Plus },
  { id: 'other', label: 'Other', icon: Tag },
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreate, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    type: 'startup',
    visibility: 'public',
    helpRequested: true,
    tags: [],
    githubUrl: '',
    websiteUrl: '',
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag && !formData.tags?.includes(currentTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), currentTag] });
      setCurrentTag('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Launch New Project</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Share your vision with the globe</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {/* Project Title */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Project Name</label>
            <input 
              required
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900"
              placeholder="e.g. EarthPost Protocol"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Project Type Grid */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Project Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROJECT_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    formData.type === type.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <type.icon className="h-6 w-6 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Vision & Roadmap</label>
            <textarea 
              required
              rows={4}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 leading-relaxed"
              placeholder="Describe what you're building, the goals, and how others can help..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Keywords / Stack</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="e.g. React, AI, Sustainability"
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button 
                type="button"
                onClick={handleAddTag}
                className="px-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase flex items-center">
                  {tag}
                  <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) })} className="ml-1.5 text-blue-300 hover:text-blue-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">GitHub Repository</label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="github.com/user/repo"
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Website / Demo</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="https://..."
                  value={formData.websiteUrl}
                  onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl ${formData.visibility === 'public' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                      {formData.visibility === 'public' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                   </div>
                   <div>
                      <span className="block text-sm font-bold text-gray-900">Visibility</span>
                      <span className="text-[10px] text-gray-400 uppercase font-black">{formData.visibility === 'public' ? 'Open to World' : 'Private to you'}</span>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: formData.visibility === 'public' ? 'private' : 'public' })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.visibility === 'public' ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.visibility === 'public' ? 'right-1' : 'left-1'}`}></div>
                </button>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl ${formData.helpRequested ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                      <Users className="h-4 w-4" />
                   </div>
                   <div>
                      <span className="block text-sm font-bold text-gray-900">Requesting Help</span>
                      <span className="text-[10px] text-gray-400 uppercase font-black">Let others apply to join</span>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, helpRequested: !formData.helpRequested })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.helpRequested ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.helpRequested ? 'right-1' : 'left-1'}`}></div>
                </button>
             </div>
          </div>
        </form>

        <div className="px-8 py-6 bg-white border-t border-gray-100 flex gap-4">
          <button onClick={onClose} type="button" className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Deploy Project
          </button>
        </div>
      </div>
    </div>
  );
};
