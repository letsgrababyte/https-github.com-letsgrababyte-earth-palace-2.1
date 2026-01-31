import React from 'react';
import { Search } from 'lucide-react';
import { EPLogo } from './EPLogo';
import { InteractiveGlobe } from './InteractiveGlobe';

interface TopBarProps {
  isVisible: boolean;
  onHomeClick: () => void;
  onSearch: (query: string) => void;
  onEarthClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isVisible, onHomeClick, onSearch, onEarthClick }) => {
  return (
    <header 
    className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
    } bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 h-16 flex items-center justify-between shadow-sm`}
    >
    {/* Left: EP Logo */}
    <div className="flex-shrink-0 min-w-[3rem]">
        <EPLogo onClick={onHomeClick} />
    </div>

    {/* Center: Search Bar */}
    <div className="flex-1 max-w-xs mx-4">
        <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-inner"
            onChange={(e) => onSearch(e.target.value)}
        />
        </div>
    </div>

    {/* Right: Interactive Earth Icon */}
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
        <div className="hover:scale-110 transition-transform duration-300 relative group">
            <InteractiveGlobe 
                size={48} 
                onClick={onEarthClick}
                autoRotate={true}
                isInteractive={false} // Small icon mode
            />
            <div className="absolute inset-0 rounded-full border border-blue-200/50 pointer-events-none group-hover:border-blue-400 transition-colors"></div>
        </div>
    </div>
    </header>
  );
};