import React, { useState, useRef } from 'react';
import { Home, Bell, PlusCircle, Search, Menu, Wallet, CloudSun, ShoppingBag, Music, MessageCircle, Calendar, X, Download } from 'lucide-react';
import { NavItem, PluginId, PluginDefinition } from '../types';

interface BottomMenuProps {
  isVisible: boolean;
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  leftSlotPlugin?: PluginId;
  rightSlotPlugin?: PluginId;
  onUpdateLeftSlot?: (id: PluginId) => void;
  onUpdateRightSlot?: (id: PluginId) => void;
}

const PLUGINS: PluginDefinition[] = [
    { id: 'search', name: 'Search', iconName: 'Search', description: 'Find people and posts', color: 'text-gray-600' },
    { id: 'notifications', name: 'Alerts', iconName: 'Bell', description: 'See your activity', color: 'text-red-500' },
    { id: 'wallet', name: 'Wallet', iconName: 'Wallet', description: 'Manage digital assets', color: 'text-emerald-500' },
    { id: 'weather', name: 'Weather', iconName: 'CloudSun', description: 'Local forecast', color: 'text-blue-500' },
    { id: 'marketplace', name: 'Shop', iconName: 'ShoppingBag', description: 'Earth Palace Store', color: 'text-purple-500' },
    { id: 'music', name: 'Music', iconName: 'Music', description: 'Stream tunes', color: 'text-pink-500' },
    { id: 'chat', name: 'Chat AI', iconName: 'MessageCircle', description: 'Talk to Gemini', color: 'text-indigo-500' },
    { id: 'events', name: 'Events', iconName: 'Calendar', description: 'Local happenings', color: 'text-orange-500' },
];

export const BottomMenu: React.FC<BottomMenuProps> = ({ 
    isVisible, 
    activeItem, 
    onNavigate, 
    leftSlotPlugin = 'search' as PluginId, 
    rightSlotPlugin = 'notifications' as PluginId,
    onUpdateLeftSlot,
    onUpdateRightSlot
}) => {
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<'left' | 'right' | null>(null);

  const getItemClass = (isActive: boolean) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
    }`;

  // Helper to render dynamic icon
  const renderIcon = (pluginId: PluginId, isActive: boolean) => {
      const className = `h-6 w-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`;
      switch (pluginId) {
          case 'search': return <Search className={className} />;
          case 'notifications': 
            return (
                <div className="relative">
                    <Bell className={className} />
                    {!isActive && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                </div>
            );
          case 'wallet': return <Wallet className={className} />;
          case 'weather': return <CloudSun className={className} />;
          case 'marketplace': return <ShoppingBag className={className} />;
          case 'music': return <Music className={className} />;
          case 'chat': return <MessageCircle className={className} />;
          case 'events': return <Calendar className={className} />;
          default: return <Search className={className} />;
      }
  };

  // Long Press Hook Logic
  const useLongPress = (callback: () => void, onClick: () => void) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const targetRef = useRef<EventTarget>();

    const start = (event: React.BaseSyntheticEvent) => {
        targetRef.current = event.target;
        timeout.current = setTimeout(() => {
            callback();
        }, 600); // 600ms hold time
    };

    const clear = (event: React.BaseSyntheticEvent, shouldTriggerClick: boolean) => {
        if (timeout.current) {
             clearTimeout(timeout.current);
             timeout.current = undefined;
             // Only click if we didn't long press and it's the same target
             if (shouldTriggerClick) {
                 onClick();
             }
        }
    };

    return {
        onMouseDown: (e: any) => start(e),
        onTouchStart: (e: any) => start(e),
        onMouseUp: (e: any) => clear(e, true),
        onMouseLeave: (e: any) => clear(e, false),
        onTouchEnd: (e: any) => clear(e, true),
    };
  };

  const handleLeftPress = () => {
      setEditingSlot('left');
      setMarketplaceOpen(true);
  };

  const handleRightPress = () => {
      setEditingSlot('right');
      setMarketplaceOpen(true);
  };

  const leftHandlers = useLongPress(handleLeftPress, () => onNavigate(NavItem.SLOT_LEFT));
  const rightHandlers = useLongPress(handleRightPress, () => onNavigate(NavItem.SLOT_RIGHT));

  const installPlugin = (plugin: PluginDefinition) => {
      if (editingSlot === 'left' && onUpdateLeftSlot) {
          onUpdateLeftSlot(plugin.id);
      } else if (editingSlot === 'right' && onUpdateRightSlot) {
          onUpdateRightSlot(plugin.id);
      }
      setMarketplaceOpen(false);
      setEditingSlot(null);
  };

  return (
    <>
        <nav 
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-y-0' : 'translate-y-full'
        } bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe pt-2 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] select-none`}
        >
        <div className="grid grid-cols-5 h-full max-w-md mx-auto px-2">
            
            {/* Spot 1: Home (Fixed) */}
            <button onClick={() => onNavigate(NavItem.HOME)} className={getItemClass(activeItem === NavItem.HOME)}>
                 <Home className="h-6 w-6" strokeWidth={activeItem === NavItem.HOME ? 2.5 : 2} />
            </button>

            {/* Spot 2: Dynamic Left Slot */}
            <button 
                {...leftHandlers}
                className={`${getItemClass(activeItem === NavItem.SLOT_LEFT)} active:scale-90 transition-transform`}
            >
                {renderIcon(leftSlotPlugin, activeItem === NavItem.SLOT_LEFT)}
            </button>

            {/* Spot 3: Middle - CREATE */}
            <button 
                onClick={() => onNavigate(NavItem.CREATE)} 
                className={getItemClass(activeItem === NavItem.CREATE)}
            >
                <PlusCircle className="h-6 w-6" strokeWidth={activeItem === NavItem.CREATE ? 2.5 : 2} />
            </button>

            {/* Spot 4: Dynamic Right Slot */}
            <button 
                {...rightHandlers}
                className={`${getItemClass(activeItem === NavItem.SLOT_RIGHT)} active:scale-90 transition-transform`}
            >
                {renderIcon(rightSlotPlugin, activeItem === NavItem.SLOT_RIGHT)}
            </button>

            {/* Spot 5: Menu (Fixed) */}
            <button onClick={() => onNavigate(NavItem.MENU)} className={getItemClass(activeItem === NavItem.MENU)}>
                <Menu className="h-6 w-6" strokeWidth={activeItem === NavItem.MENU ? 2.5 : 2} />
            </button>

        </div>
        </nav>

        {/* EARTH PALACE MARKETPLACE MODAL */}
        {marketplaceOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 rounded-t-2xl">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-blue-600" />
                                Earth Palace Marketplace
                            </h3>
                            <p className="text-xs text-gray-500">Customize your Globe Feed interface</p>
                        </div>
                        <button onClick={() => setMarketplaceOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto p-4 space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100 mb-2">
                            Select a plugin to install to the <strong>{editingSlot === 'left' ? 'Left' : 'Right'}</strong> slot.
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {PLUGINS.map((plugin) => (
                                <button 
                                    key={plugin.id}
                                    onClick={() => installPlugin(plugin)}
                                    className="flex items-center p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group bg-white text-left relative overflow-hidden"
                                >
                                    <div className={`p-3 rounded-full bg-gray-50 group-hover:bg-white transition-colors mr-4 ${plugin.color}`}>
                                        {renderIcon(plugin.id, false)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{plugin.name}</h4>
                                        <p className="text-xs text-gray-500">{plugin.description}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Download className="h-3 w-3" /> Install
                                    </div>
                                </button>
                            ))}
                            
                            {/* Placeholder for Third Party */}
                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Third Party Integrations</h5>
                                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                                    More plugins coming soon from global developers...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};