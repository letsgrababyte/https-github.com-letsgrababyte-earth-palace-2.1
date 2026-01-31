
import React, { useState } from 'react';
import { InteractiveGlobe } from './InteractiveGlobe';
import { X, MessageCircle, Rss, Calendar, ShoppingBag, Globe, Lock, ArrowLeft, XCircle, MapPin, Menu, Settings2, Languages, Sun, Palette } from 'lucide-react';
import { FeedSubMode } from '../types';

interface EarthExplorerProps {
  onClose: () => void;
  onViewFeed: (location: string, mode?: FeedSubMode) => void;
}

const BORDER_COLORS = [
    { name: 'Emerald', value: '#22c55e' },
    { name: 'Royal', value: '#3b82f6' },
    { name: 'Gold', value: '#eab308' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Arctic', value: '#ffffff' },
];

export const EarthExplorer: React.FC<EarthExplorerProps> = ({ onClose, onViewFeed }) => {
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [showCountryNames, setShowCountryNames] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [borderOpacity, setBorderOpacity] = useState(0.6);
  const [borderColor, setBorderColor] = useState('#22c55e');

  const handleLocationSelect = (data: any) => {
    let rawName = data.name || "";
    let countryCode = data.countryCode || "";
    
    const isUSA = 
        rawName.toLowerCase().includes("united states") || 
        rawName === "USA" || 
        rawName === "US" || 
        countryCode === "USA" || 
        countryCode === "US";

    if (isUSA) {
        setSelectedLocation({ ...data, name: "United States" });
        return;
    }

    const normalizationMap: Record<string, string> = {
      "United States of America": "United States",
      "Viet Nam": "Vietnam",
      "Russian Federation": "Russia",
      "Lao People's Democratic Republic": "Laos",
      "Korea, Republic of": "South Korea",
      "Korea, Democratic People's Republic of": "North Korea",
      "Brunei Darussalam": "Brunei",
      "Syrian Arab Republic": "Syria",
      "Iran, Islamic Republic of": "Iran",
      "Macedonia, the former Yugoslav Republic of": "North Macedonia",
      "Moldova, Republic of": "Moldova",
      "United Republic of Tanzania": "Tanzania",
      "Congo, the Democratic Republic of the": "Congo",
      "Czechia": "Czech Republic",
      "Taiwan, Province of China": "Taiwan",
      "Palestine, State of": "Palestine"
    };

    let finalName = normalizationMap[rawName] || rawName || "Global Feed";
    if (finalName === "Global Feed" && countryCode) {
        finalName = countryCode;
    }

    setSelectedLocation({ ...data, name: finalName });
  };

  const clearSelection = () => {
      setSelectedLocation(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300 overflow-hidden">
      {/* Backdrop dismissal for details */}
      {selectedLocation && (
          <div 
            className="absolute inset-0 z-[15] cursor-default bg-black/40 backdrop-blur-[2px] transition-all duration-500" 
            onClick={clearSelection}
            aria-hidden="true"
          />
      )}

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
         <div className="pointer-events-auto">
             {selectedLocation ? (
                 <button onClick={clearSelection} className="flex items-center text-white/90 hover:text-white transition-all bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg group">
                     <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                     <span className="font-semibold text-sm">Return to Global View</span>
                 </button>
             ) : (
                 <div className="flex items-center text-green-400 font-bold tracking-widest uppercase text-[10px] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/30">
                     <Globe className="h-4 w-4 mr-2 animate-pulse" />
                     Earth Explorer
                 </div>
             )}
         </div>
         <button 
            onClick={onClose}
            className="pointer-events-auto p-2 bg-white/10 hover:bg-red-500/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10 hover:border-red-500/40"
         >
             <X className="h-6 w-6" />
         </button>
      </div>

      {/* Globe Interaction Layer */}
      <div className="flex-1 w-full relative z-10">
          <InteractiveGlobe 
             size="100%" 
             isInteractive={true} 
             onLocationSelect={handleLocationSelect}
             showLabels={showCountryNames}
             borderOpacity={borderOpacity}
             borderColor={borderColor}
          />
          
          {!selectedLocation && (
              <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none px-6 z-20">
                  <span className="bg-black/60 backdrop-blur-md text-white/80 px-6 py-3 rounded-full text-xs font-bold tracking-wide border border-white/10 shadow-2xl animate-bounce">
                      Tap a country to explore local feeds
                  </span>
              </div>
          )}

          {/* Lower Right Hamburger Menu */}
          {!selectedLocation && (
            <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-3">
                {/* Menu Popover */}
                {isMenuOpen && (
                    <div className="bg-white/95 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-2xl border border-white/20 w-72 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="flex items-center gap-2 mb-6">
                            <Settings2 className="h-4 w-4 text-green-600" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Interactive Earth Options</span>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Toggle names */}
                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowCountryNames(!showCountryNames)}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${showCountryNames ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Languages className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">Display Names</span>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showCountryNames ? 'bg-green-600' : 'bg-gray-200'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showCountryNames ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </div>

                            {/* Border Brightness Slider */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                            <Sun className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Border Visibility</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{Math.round(borderOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    value={borderOpacity} 
                                    onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                />
                            </div>

                            {/* Border Color Bar */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <Palette className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">Border Color</span>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    {BORDER_COLORS.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setBorderColor(color.value)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all transform active:scale-90 ${borderColor === color.value ? 'border-gray-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Toggle Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-4 rounded-full shadow-2xl transition-all border ${isMenuOpen ? 'bg-green-600 border-green-500 text-white rotate-90 scale-110' : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20'}`}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
          )}
      </div>

      {/* Location Detail Panel */}
      {selectedLocation && (
          <div 
            className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} 
          >
              <div className="w-full flex justify-center pt-4 pb-2">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
              </div>
              
              <div className="p-8 pt-2">
                  <header className="flex items-start justify-between mb-8">
                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="bg-green-600 p-2 rounded-xl">
                                  <MapPin className="h-5 w-5 text-white" />
                              </div>
                              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                                  {selectedLocation.name}
                              </h2>
                          </div>
                          <div className="flex items-center mt-3">
                              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping mr-3"></span>
                              <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.15em]">
                                  {selectedLocation.name} Feed Live • Real-time Sync
                              </p>
                          </div>
                      </div>
                      <button 
                          onClick={clearSelection}
                          className="p-2 hover:bg-gray-100 rounded-full text-gray-300 hover:text-gray-900 transition-colors"
                          aria-label="Close details"
                      >
                          <XCircle className="h-8 w-8" />
                      </button>
                  </header>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                      <button 
                        onClick={() => onViewFeed(selectedLocation.name, 'posts')}
                        className="flex flex-col items-center justify-center p-6 bg-green-600 hover:bg-green-700 rounded-[2rem] shadow-xl shadow-green-100 transition-all active:scale-95 group text-white"
                      >
                          <Rss className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="font-black text-xs uppercase tracking-widest">{selectedLocation.name} Feed</span>
                      </button>

                      <button 
                        onClick={() => onViewFeed(selectedLocation.name, 'chat-room')}
                        className="flex flex-col items-center justify-center p-6 bg-emerald-600 hover:bg-emerald-700 rounded-[2rem] shadow-xl shadow-emerald-100 transition-all active:scale-95 group text-white"
                      >
                          <MessageCircle className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="font-black text-xs uppercase tracking-widest">{selectedLocation.name} Chat</span>
                      </button>
                  </div>

                  <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-1">
                          Explore {selectedLocation.name} Hub
                      </h3>
                      
                      <div className="grid gap-3">
                          <button className="flex items-center justify-between p-5 rounded-3xl hover:bg-gray-50 border border-gray-100 transition-all group">
                              <div className="flex items-center">
                                  <div className="bg-orange-100 p-3 rounded-2xl mr-5 group-hover:scale-110 transition-transform">
                                      <Calendar className="h-6 w-6 text-orange-600" />
                                  </div>
                                  <div>
                                      <span className="block font-black text-gray-800 text-sm">{selectedLocation.name} Events</span>
                                      <span className="text-xs text-gray-400 font-medium">Local gatherings & meetups</span>
                                  </div>
                              </div>
                              <ChevronRightIcon />
                          </button>

                          <button className="flex items-center justify-between p-5 rounded-3xl hover:bg-gray-50 border border-gray-100 transition-all group">
                              <div className="flex items-center">
                                  <div className="bg-emerald-100 p-3 rounded-2xl mr-5 group-hover:scale-110 transition-transform">
                                      <ShoppingBag className="h-6 w-6 text-emerald-600" />
                                  </div>
                                  <div>
                                      <span className="block font-black text-gray-800 text-sm">{selectedLocation.name} Marketplace</span>
                                      <span className="text-xs text-gray-400 font-medium">Regional commerce & trading</span>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md tracking-tighter uppercase">PRO</span>
                                  <Lock className="h-4 w-4 text-gray-300" />
                              </div>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const ChevronRightIcon = () => (
    <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
);
