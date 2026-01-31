
import React, { useState, useEffect } from 'react';
import { ViewState, NavItem, Post, User, PluginId, FeedSubMode, LifeFeedItem, Project, ChatRoom, PostVisibility, PostTarget } from './types';
import { fetchFeedPosts } from './services/geminiService';
import { useScrollDirection } from './hooks/useScrollDirection';
import { TopBar } from './components/TopBar';
import { BottomMenu } from './components/BottomMenu';
import { FeedPost } from './components/FeedPost';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { Profile } from './components/Profile';
import { EarthExplorer } from './components/EarthExplorer';
import { LocalChatRoom } from './components/LocalChatRoom';
import { ChatHub } from './components/ChatHub';
import { CreateChatRoomModal } from './components/CreateChatRoomModal';
import { MyFeed } from './components/MyFeed';
import { LifeItemViewer } from './components/LifeItemViewer';
import { PublicProfile } from './components/PublicProfile';
import { ProjectDetail } from './components/ProjectDetail';
import { CreatePostModal } from './components/CreatePostModal';
import { AIStudio } from './components/AIStudio';
import { auth, db, isFirebaseConfigured } from './services/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Wallet, CloudSun, ShoppingBag, Music, MessageCircle, Calendar, Rss, Globe, Sparkles } from 'lucide-react';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    ownerId: 'u1',
    title: 'SolarGrid Protocol',
    description: 'A decentralized energy trading platform for residential solar owners.',
    type: 'startup',
    visibility: 'public',
    tags: ['Sustainability', 'Blockchain', 'IoT'],
    helpRequested: true,
    createdAt: new Date().toISOString(),
    members: [
      { user: { id: 'u1', username: 'Explorer', avatarUrl: 'https://picsum.photos/100/100?random=1' } as User, role: 'owner', status: 'active' }
    ]
  }
];

const MOCK_ROOMS: ChatRoom[] = [
  { id: 'gen-jp', country: 'Japan', name: 'Japan General Chat', category: 'General', memberCount: 520, description: 'The main hub for Japan community.', lastMessage: 'Welcome to the Japanese node!', createdBy: 'system' },
  { id: 'gen-us', country: 'United States', name: 'USA General Chat', category: 'General', memberCount: 840, description: 'The main hub for USA community.', lastMessage: 'Connecting from New York.', createdBy: 'system' },
  { id: 'gen-uk', country: 'United Kingdom', name: 'UK General Chat', category: 'General', memberCount: 310, description: 'The main hub for UK community.', lastMessage: 'London calling!', createdBy: 'system' },
  { id: 'r1', country: 'Japan', name: 'Tokyo Techies', category: 'Tech', memberCount: 154, description: 'Future tech and startups in Tokyo.', lastMessage: 'Anyone going to the AI summit?', createdBy: 'system' },
  { id: 'r2', country: 'Japan', name: 'Kyoto History', category: 'Culture', memberCount: 89, description: 'Exploring the roots of Kyoto.', lastMessage: 'The temple walk was amazing.', createdBy: 'system' },
  { id: 'r3', country: 'United States', name: 'Silicon Valley Founders', category: 'Tech', memberCount: 230, description: 'Buidling in SF.', lastMessage: 'Seed round secured!', createdBy: 'system' },
  { id: 'r4', country: 'United Kingdom', name: 'London Foodies', category: 'Food', memberCount: 112, description: 'Best curry in the city?', lastMessage: 'Brick Lane is always the answer.', createdBy: 'system' },
];

export default function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOADING); 
  const [activeNavItem, setActiveNavItem] = useState<NavItem>(NavItem.HOME);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(MOCK_ROOMS);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [showCreateChatRoom, setShowCreateChatRoom] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // AI Global Configuration
  const [activeAIModel, setActiveAIModel] = useState('gemini-3-flash-preview');
  const [systemInstruction, setSystemInstruction] = useState('You are a helpful and creative social media assistant. Your goal is to help pioneers build the future.');
  const [aiTemperature, setAiTemperature] = useState(0.7);

  const [mainFeedMode, setMainFeedMode] = useState<'global' | 'personal'>('global');
  const [feedLocationFilter, setFeedLocationFilter] = useState<string | null>(null);
  const [feedSubMode, setFeedSubMode] = useState<FeedSubMode>('posts');
  const [activeLifeItem, setActiveLifeItem] = useState<LifeFeedItem | null>(null);
  const [leftSlotPlugin, setLeftSlotPlugin] = useState<PluginId>('search');
  const [rightSlotPlugin, setRightSlotPlugin] = useState<PluginId>('notifications');
  const [activePlugin, setActivePlugin] = useState<PluginId | null>(null);

  const scrollDirection = useScrollDirection();
  const isInterfaceVisible = scrollDirection !== 'down';

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
        const storedUser = localStorage.getItem('ep_user');
        if (storedUser) {
             const u = JSON.parse(storedUser);
             setCurrentUser(u);
             setViewState(ViewState.FEED);
             setProjects(prev => prev.map(p => p.ownerId === 'u1' ? { ...p, ownerId: u.id, members: [{ user: u, role: 'owner', status: 'active' }] } : p));
        } else {
             setViewState(ViewState.SIGN_IN);
        }
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
            if (db) {
                const docRef = doc(db, "users", firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCurrentUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
                } else {
                    setCurrentUser({
                        id: firebaseUser.uid,
                        username: firebaseUser.displayName || 'Explorer',
                        handle: '@explorer',
                        avatarUrl: firebaseUser.photoURL || `https://picsum.photos/100/100?random=${firebaseUser.uid.charCodeAt(0)}`
                    });
                }
            }
            setViewState(ViewState.FEED);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setViewState(ViewState.FEED); 
        }
      } else {
        setCurrentUser(null);
        setViewState(ViewState.SIGN_IN);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (viewState === ViewState.FEED && posts.length === 0) {
      loadPosts();
    }
  }, [viewState]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await fetchFeedPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChatRoom = (roomData: Partial<ChatRoom>) => {
    const newRoom: ChatRoom = {
      id: 'room-' + Date.now(),
      country: roomData.country || '',
      name: roomData.name || 'New Room',
      description: roomData.description || '',
      category: roomData.category || 'General',
      memberCount: 1,
      createdBy: currentUser?.id || 'unknown',
    };
    setChatRooms([newRoom, ...chatRooms]);
    setShowCreateChatRoom(false);
    setActiveChatRoom(newRoom);
    setFeedSubMode('chat-room');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (db && updatedUser.id && isFirebaseConfigured) {
      try {
        const userRef = doc(db, "users", updatedUser.id);
        await updateDoc(userRef, { ...updatedUser });
      } catch (error) {
        console.error("Error updating user Firestore:", error);
      }
    } else {
      localStorage.setItem('ep_user', JSON.stringify(updatedUser));
    }
  };

  const handleUpdateAISettings = (modelId: string, instruction: string, temp: number) => {
    setActiveAIModel(modelId);
    setSystemInstruction(instruction);
    setAiTemperature(temp);
    // Future enhancement: persist these to Firestore as well
  };

  const handleCreatePost = (postData: Partial<Post>) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: 'post-' + Date.now(),
      user: currentUser,
      content: postData.content || '',
      imageUrl: postData.imageUrl,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      target: postData.target,
      visibility: postData.visibility as PostVisibility
    };
    
    setPosts([newPost, ...posts]);
    
    if (newPost.target === 'my-feed') {
      setMainFeedMode('personal');
      setViewState(ViewState.MY_FEED);
      setFeedLocationFilter(null);
    } else if (newPost.target === 'globe') {
      setMainFeedMode('global');
      setViewState(ViewState.FEED);
      setFeedLocationFilter(null);
    } else if (typeof newPost.target === 'string') {
      setFeedLocationFilter(newPost.target);
      setViewState(ViewState.FEED);
      setFeedSubMode('posts');
      setMainFeedMode('global');
    }

    setActiveNavItem(NavItem.HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProject = (partialProject: Partial<Project>) => {
    if (!currentUser) return;
    const newProject: Project = {
      id: 'p-' + Date.now(),
      ownerId: currentUser.id,
      title: partialProject.title || 'Untitled Project',
      description: partialProject.description || '',
      type: partialProject.type || 'other',
      visibility: partialProject.visibility || 'public',
      tags: partialProject.tags || [],
      helpRequested: partialProject.helpRequested || false,
      githubUrl: partialProject.githubUrl,
      websiteUrl: partialProject.websiteUrl,
      createdAt: new Date().toISOString(),
      members: [{ user: currentUser, role: 'owner', status: 'active' }]
    };
    setProjects([newProject, ...projects]);
  };

  const handleNavigation = (item: NavItem) => {
    setActiveNavItem(item);
    
    if (item === NavItem.MENU) {
        setViewState(ViewState.PROFILE);
        setActivePlugin(null);
        setActiveLifeItem(null);
    } else if (item === NavItem.HOME) {
        if (mainFeedMode === 'personal') {
            setViewState(ViewState.MY_FEED);
        } else {
            setViewState(ViewState.FEED);
        }
        setFeedLocationFilter(null);
        setActivePlugin(null);
        setActiveLifeItem(null);
    } else if (item === NavItem.SLOT_LEFT) {
        if (leftSlotPlugin === 'search') {
            console.log("Search active");
        } else {
            setActivePlugin(leftSlotPlugin);
            setViewState(ViewState.PLUGIN_VIEW);
            setActiveLifeItem(null);
        }
    } else if (item === NavItem.SLOT_RIGHT) {
         if (rightSlotPlugin === 'notifications') {
             console.log("Notifications active");
         } else {
             setActivePlugin(rightSlotPlugin);
             setViewState(ViewState.PLUGIN_VIEW);
             setActiveLifeItem(null);
         }
    } else if (item === NavItem.CREATE) {
         setIsCreateModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: User) => {
      setCurrentUser(user);
      setViewState(ViewState.FEED);
      if (!isFirebaseConfigured || !auth) {
          localStorage.setItem('ep_user', JSON.stringify(user));
      }
  };

  const handleViewLocationFeed = (location: string, mode: FeedSubMode = 'posts') => {
      setFeedLocationFilter(location);
      
      const hasGeneral = chatRooms.some(r => r.country === location && r.category === 'General');
      if (!hasGeneral) {
        const autoGeneral: ChatRoom = {
          id: `gen-${location.toLowerCase()}`,
          country: location,
          name: `${location} General`,
          category: 'General',
          memberCount: Math.floor(Math.random() * 200) + 50,
          description: `The default community hub for ${location}.`,
          createdBy: 'system'
        };
        setChatRooms(prev => [autoGeneral, ...prev]);
      }

      if (mode === 'chat-room') {
        setFeedSubMode('chat-hub');
      } else {
        setFeedSubMode(mode);
      }
      setViewState(ViewState.FEED);
      setActiveNavItem(NavItem.HOME);
  };

  const handleSelectLifeItem = (item: LifeFeedItem) => {
      setActiveLifeItem(item);
      setViewState(ViewState.LIFE_ITEM_WORKSPACE);
  };

  const renderPluginView = () => {
      if (!activePlugin) return null;
      const getPluginIcon = () => {
          switch(activePlugin) {
              case 'wallet': return <Wallet className="h-16 w-16 text-emerald-500 mb-4" />;
              case 'weather': return <CloudSun className="h-16 w-16 text-blue-500 mb-4" />;
              case 'marketplace': return <ShoppingBag className="h-16 w-16 text-purple-500 mb-4" />;
              case 'music': return <Music className="h-16 w-16 text-pink-500 mb-4" />;
              case 'chat': return <MessageCircle className="h-16 w-16 text-indigo-500 mb-4" />;
              case 'events': return <Calendar className="h-16 w-16 text-orange-500 mb-4" />;
              default: return null;
          }
      };

      return (
          <div className="min-h-screen pt-20 px-6 flex flex-col items-center justify-center text-center bg-gray-50">
              {getPluginIcon()}
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activePlugin}</h2>
              <p className="text-gray-500 mt-2 max-w-xs">
                  Integrating {activePlugin} services with your Globe Feed account...
              </p>
              <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 animate-[width_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                  </div>
              </div>
              <button onClick={() => { setViewState(ViewState.FEED); setActiveNavItem(NavItem.HOME); }} className="mt-8 text-blue-600 font-medium hover:underline">
                  Return to Feed
              </button>
          </div>
      );
  };

  if (viewState === ViewState.LOADING) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-400 text-sm font-medium animate-pulse">Initializing EarthPost...</div>
          </div>
      );
  }

  if (viewState === ViewState.SIGN_IN) {
    return <SignIn onSwitchToSignUp={() => setViewState(ViewState.SIGN_UP)} onLoginSuccess={handleLoginSuccess} />;
  }

  if (viewState === ViewState.SIGN_UP) {
    return <SignUp onSwitchToSignIn={() => setViewState(ViewState.SIGN_IN)} onLoginSuccess={handleLoginSuccess} />;
  }

  if (viewState === ViewState.PROFILE && currentUser) {
      return (
        <Profile 
            user={currentUser} 
            posts={posts.slice(0, 2)} 
            onBack={() => { setViewState(ViewState.FEED); setActiveNavItem(NavItem.HOME); }} 
            onNavigateToMyFeed={() => {
                setViewState(ViewState.MY_FEED);
                setActiveNavItem(NavItem.HOME);
                setMainFeedMode('personal');
            }}
            onViewPublicProfile={() => setViewState(ViewState.PUBLIC_PROFILE)}
            onViewAIStudio={() => setViewState(ViewState.AI_STUDIO)}
        />
      );
  }

  if (viewState === ViewState.AI_STUDIO) {
    return (
      <AIStudio 
        onBack={() => setViewState(ViewState.PROFILE)}
        activeModelId={activeAIModel}
        systemInstruction={systemInstruction}
        onUpdateSettings={handleUpdateAISettings}
      />
    );
  }

  if (viewState === ViewState.PUBLIC_PROFILE && currentUser) {
    return (
      <PublicProfile 
        user={currentUser} 
        posts={posts.slice(0, 5)} 
        projects={projects.filter(p => p.ownerId === currentUser.id)}
        onBack={() => setViewState(ViewState.PROFILE)}
        onUpdateUser={handleUpdateUser}
        onAddProject={handleAddProject}
        onViewProject={(p) => {
          setActiveProject(p);
          setViewState(ViewState.PROJECT_DETAIL);
        }}
      />
    );
  }

  if (viewState === ViewState.PROJECT_DETAIL && currentUser && activeProject) {
    return (
      <ProjectDetail 
        project={activeProject} 
        currentUser={currentUser} 
        onBack={() => setViewState(ViewState.PUBLIC_PROFILE)}
        onInvite={(id) => console.log('Invite', id)}
        onRequestToJoin={() => console.log('Join request')}
      />
    );
  }

  if (viewState === ViewState.EARTH_EXPLORER) {
      return (
          <EarthExplorer onClose={() => setViewState(ViewState.FEED)} onViewFeed={handleViewLocationFeed} />
      );
  }

  const hasSubHeader = (!feedLocationFilter && viewState !== ViewState.PLUGIN_VIEW && viewState !== ViewState.LIFE_ITEM_WORKSPACE && viewState !== ViewState.PUBLIC_PROFILE && viewState !== ViewState.PROJECT_DETAIL && viewState !== ViewState.AI_STUDIO) || !!feedLocationFilter;

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-900 w-full overflow-x-hidden relative">
      
      {viewState !== ViewState.PUBLIC_PROFILE && viewState !== ViewState.PROJECT_DETAIL && viewState !== ViewState.AI_STUDIO && (
        <TopBar 
          isVisible={isInterfaceVisible} 
          onHomeClick={() => {
              setViewState(ViewState.FEED);
              setActiveNavItem(NavItem.HOME);
              setFeedLocationFilter(null);
              setMainFeedMode('global');
              setActiveLifeItem(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              loadPosts(); 
          }}
          onSearch={(q) => console.log(q)}
          onEarthClick={() => setViewState(ViewState.EARTH_EXPLORER)}
        />
      )}

      {isCreateModalOpen && currentUser && (
        <CreatePostModal 
          currentUser={currentUser} 
          onClose={() => setIsCreateModalOpen(false)}
          onPost={handleCreatePost}
        />
      )}

      {showCreateChatRoom && currentUser && feedLocationFilter && (
        <CreateChatRoomModal 
          country={feedLocationFilter} 
          currentUser={currentUser} 
          onClose={() => setShowCreateChatRoom(false)}
          onCreate={handleCreateChatRoom}
        />
      )}

      {!feedLocationFilter && viewState !== ViewState.PLUGIN_VIEW && viewState !== ViewState.LIFE_ITEM_WORKSPACE && viewState !== ViewState.PUBLIC_PROFILE && viewState !== ViewState.PROJECT_DETAIL && viewState !== ViewState.AI_STUDIO && (
          <div className={`fixed top-16 left-0 right-0 z-30 transition-transform duration-300 ease-in-out bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-center shadow-sm ${
              isInterfaceVisible ? 'translate-y-0' : '-translate-y-[calc(100%+4rem)]'
          }`}>
              <div className="bg-gray-100 p-1 rounded-full flex items-center w-full max-w-[280px]">
                  <button 
                    onClick={() => { setViewState(ViewState.FEED); setMainFeedMode('global'); }}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      mainFeedMode === 'global' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                      <Globe className="h-3.5 w-3.5 mr-2" />
                      Globe Feed
                  </button>
                  <button 
                    onClick={() => { setViewState(ViewState.MY_FEED); setMainFeedMode('personal'); }}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      mainFeedMode === 'personal' ? 'bg-white text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                      <Sparkles className="h-3.5 w-3.5 mr-2" />
                      My Feed
                  </button>
              </div>
          </div>
      )}

      {feedLocationFilter && (
          <div className={`fixed top-16 left-0 right-0 z-30 transition-transform duration-300 ease-in-out bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center space-x-2 shadow-sm ${
              isInterfaceVisible ? 'translate-y-0' : '-translate-y-[calc(100%+4rem)]'
          }`}>
              <button 
                onClick={() => setFeedSubMode('posts')}
                className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  feedSubMode === 'posts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                  <Rss className="h-3.5 w-3.5 mr-1.5" />
                  FEED
              </button>
              <button 
                onClick={() => {
                  setFeedSubMode('chat-hub');
                  setActiveChatRoom(null);
                }}
                className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  (feedSubMode === 'chat-hub' || feedSubMode === 'chat-room') ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                  <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                  CHAT
              </button>
          </div>
      )}

      <main className={`pb-24 min-h-screen w-full max-w-2xl mx-auto px-0 sm:px-4 ${hasSubHeader ? 'pt-32' : (viewState === ViewState.PUBLIC_PROFILE || viewState === ViewState.PROJECT_DETAIL || viewState === ViewState.AI_STUDIO ? 'pt-0' : 'pt-20')}`}>
        {loading ? (
            <div className="flex flex-col items-center justify-center pt-20 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        ) : viewState === ViewState.PLUGIN_VIEW ? (
            renderPluginView()
        ) : viewState === ViewState.MY_FEED ? (
            <MyFeed onSelectItem={handleSelectLifeItem} />
        ) : viewState === ViewState.LIFE_ITEM_WORKSPACE && activeLifeItem ? (
            <LifeItemViewer item={activeLifeItem} onBack={() => setViewState(ViewState.MY_FEED)} />
        ) : viewState === ViewState.PUBLIC_PROFILE && currentUser ? (
            <PublicProfile 
              user={currentUser} 
              posts={posts} 
              projects={projects.filter(p => p.ownerId === currentUser.id)}
              onBack={() => setViewState(ViewState.PROFILE)}
              onUpdateUser={handleUpdateUser}
              onAddProject={handleAddProject}
              onViewProject={(p) => {
                setActiveProject(p);
                setViewState(ViewState.PROJECT_DETAIL);
              }}
            />
        ) : viewState === ViewState.PROJECT_DETAIL && currentUser && activeProject ? (
          <ProjectDetail 
            project={activeProject} 
            currentUser={currentUser} 
            onBack={() => setViewState(ViewState.PUBLIC_PROFILE)}
            onInvite={(id) => console.log('Invite', id)}
            onRequestToJoin={() => console.log('Join request')}
          />
        ) : viewState === ViewState.AI_STUDIO ? (
          <AIStudio 
            onBack={() => setViewState(ViewState.PROFILE)}
            activeModelId={activeAIModel}
            systemInstruction={systemInstruction}
            onUpdateSettings={handleUpdateAISettings}
          />
        ) : (
            <>
                {feedLocationFilter && feedSubMode === 'chat-hub' && (
                    <ChatHub 
                      country={feedLocationFilter} 
                      rooms={chatRooms.filter(r => r.country === feedLocationFilter)}
                      onSelectRoom={(room) => {
                        setActiveChatRoom(room);
                        setFeedSubMode('chat-room');
                      }}
                      onCreateRoom={() => setShowCreateChatRoom(true)}
                    />
                )}
                {feedLocationFilter && feedSubMode === 'chat-room' && activeChatRoom && currentUser && (
                   <LocalChatRoom 
                    room={activeChatRoom} 
                    currentUser={currentUser} 
                    onBack={() => setFeedSubMode('chat-hub')} 
                    isVisible={isInterfaceVisible}
                   />
                )}
                {feedLocationFilter && feedSubMode === 'posts' && (
                  <>
                      <div className="px-4 py-3 mb-4 flex items-center justify-between border-b border-gray-100 bg-white sm:rounded-xl">
                          <div>
                              <h2 className="font-extrabold text-xl text-gray-900">{feedLocationFilter}</h2>
                          </div>
                          <div className="flex items-center bg-green-50 px-2 py-1 rounded text-[10px] font-bold text-green-700 animate-pulse">
                              LIVE SYNC
                          </div>
                      </div>
                      {posts.map((post) => (
                          <FeedPost key={post.id} post={post} />
                      ))}
                  </>
                )}
                {!feedLocationFilter && posts.map((post) => (
                    <FeedPost key={post.id} post={post} />
                ))}
            </>
        )}
      </main>

      <BottomMenu 
        isVisible={isInterfaceVisible} 
        activeItem={activeNavItem}
        onNavigate={handleNavigation}
        leftSlotPlugin={leftSlotPlugin}
        rightSlotPlugin={rightSlotPlugin}
        onUpdateLeftSlot={setLeftSlotPlugin}
        onUpdateRightSlot={setRightSlotPlugin}
      />
    </div>
  );
}
