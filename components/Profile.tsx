
import React from 'react';
import { User, Post, ViewState } from '../types';
import { EPLogo } from './EPLogo';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { 
  Calendar, 
  ShoppingBag, 
  Globe, 
  Bot, 
  LogOut, 
  ChevronRight,
  Zap,
  Sparkles,
  Sliders
} from 'lucide-react';

interface ProfileProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onNavigateToMyFeed: () => void;
  onViewPublicProfile: () => void;
  onViewAIStudio: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onBack, onNavigateToMyFeed, onViewPublicProfile, onViewAIStudio }) => {
  
  const handleLogout = async () => {
    try {
        if (auth) {
            await signOut(auth);
        } else {
            // Demo mode logout
            localStorage.removeItem('ep_user');
            window.location.reload();
        }
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  const MenuBlock = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    colorClass, 
    onClick,
    isNew = false
  }: { 
    icon: any, 
    title: string, 
    subtitle?: string, 
    colorClass: string, 
    onClick?: () => void,
    isNew?: boolean
  }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-start p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all hover:shadow-md text-left h-full relative overflow-hidden group"
    >
        {isNew && (
            <div className="absolute top-3 right-3 bg-blue-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">New</div>
        )}
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 mb-3 group-hover:scale-110 transition-transform`}>
            <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        
        {/* Decorative circle */}
        <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full ${colorClass} opacity-5`}></div>
    </button>
  );

  const LegalItem = ({ label }: { label: string }) => (
    <button className="flex items-center justify-between w-full p-3 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      
      {/* Top Section */}
      <div className="p-6 bg-white border-b border-gray-100 rounded-b-[2rem] shadow-sm mb-6">
          {/* Logo */}
          <div className="mb-6">
              <EPLogo onClick={onBack} />
          </div>

          {/* User Header */}
          <div className="flex items-center space-x-4">
              <div className="relative">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-green-500">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.username} 
                        className="w-full h-full rounded-full object-cover border-2 border-white" 
                      />
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                  <p className="text-gray-500 text-sm mb-1">{user.handle}</p>
                  <button 
                    onClick={onViewPublicProfile}
                    className="text-xs text-blue-600 font-semibold flex items-center hover:underline"
                  >
                      View Public Profile <ChevronRight className="h-3 w-3 ml-0.5" />
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 space-y-6">
          
          {/* Main Grid */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Apps & Features</h3>
            <div className="grid grid-cols-2 gap-3">
                <MenuBlock 
                    title="Events" 
                    subtitle="Local happenings"
                    icon={Calendar} 
                    colorClass="bg-orange-500" 
                />
                <MenuBlock 
                    title="Marketplace" 
                    subtitle="Shop & Trade"
                    icon={ShoppingBag} 
                    colorClass="bg-purple-500" 
                />
                <MenuBlock 
                    title="Globe Feed" 
                    subtitle="Public stream"
                    icon={Sliders} 
                    colorClass="bg-blue-600" 
                />
                <MenuBlock 
                    title="My Feed" 
                    subtitle="Your life, AI curated"
                    icon={Sparkles} 
                    colorClass="bg-blue-400" 
                    isNew={true}
                    onClick={onNavigateToMyFeed}
                />
                <MenuBlock 
                    title="Globe View" 
                    subtitle="Map layers"
                    icon={Globe} 
                    colorClass="bg-green-600" 
                />
                <MenuBlock 
                    title="AI Models" 
                    subtitle="Neural Settings"
                    icon={Bot} 
                    colorClass="bg-indigo-500" 
                    onClick={onViewAIStudio}
                />
            </div>
          </div>

          {/* Legal & Standards */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Community & Legal</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <LegalItem label="Community Standards" />
                <LegalItem label="Terms of Service" />
                <LegalItem label="Privacy Policy" />
                <LegalItem label="Conditions of Sale" />
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors mb-8"
          >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
          </button>

          {/* Version Info */}
          <div className="text-center pb-8">
              <p className="text-xs text-gray-300">EarthPost v1.0.5 (AI-Life Update)</p>
          </div>

      </div>
    </div>
  );
};
