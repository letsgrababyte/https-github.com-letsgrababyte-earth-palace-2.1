
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  handle: string;
  bio?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  target?: PostTarget;
  visibility?: PostVisibility;
}

export type ProjectType = 'startup' | 'open-source' | 'content-creation' | 'research' | 'artistic' | 'other';
export type ProjectVisibility = 'public' | 'private';
export type PostVisibility = 'public' | 'private' | 'groups' | 'selected';
export type PostTarget = 'globe' | 'my-feed' | string; // string for country name

export interface AIModel {
  id: string;
  name: string;
  icon: string; // URL or name
  color: string;
  description?: string;
  capabilities?: string[];
}

export interface ChatRoom {
  id: string;
  country: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  createdBy: string;
}

export interface ProjectMember {
  user: User;
  role: 'owner' | 'contributor' | 'advisor';
  status: 'active' | 'pending';
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: ProjectType;
  visibility: ProjectVisibility;
  githubUrl?: string;
  websiteUrl?: string;
  tags: string[];
  helpRequested: boolean;
  members: ProjectMember[];
  createdAt: string;
  imageUrl?: string;
}

export interface LifeFeedItem {
  id: string;
  source: 'gmail' | 'drive' | 'github' | 'keep' | 'calendar' | 'chatgpt' | 'claude';
  title: string;
  description: string;
  timestamp: string;
  link: string;
  status?: 'urgent' | 'updated' | 'unread';
  mockContent?: string;
}

export enum ViewState {
  LOADING = 'LOADING',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  FEED = 'FEED',
  PROFILE = 'PROFILE',
  PLUGIN_VIEW = 'PLUGIN_VIEW',
  EARTH_EXPLORER = 'EARTH_EXPLORER',
  MY_FEED = 'MY_FEED',
  LIFE_ITEM_WORKSPACE = 'LIFE_ITEM_WORKSPACE',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE',
  PROJECT_HUB = 'PROJECT_HUB',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  AI_STUDIO = 'AI_STUDIO'
}

export enum NavItem {
  HOME = 'HOME',
  SLOT_LEFT = 'SLOT_LEFT',
  CREATE = 'CREATE',
  SLOT_RIGHT = 'SLOT_RIGHT',
  MENU = 'MENU'
}

export type FeedSubMode = 'posts' | 'chat-hub' | 'chat-room';

export type PluginId = 'search' | 'notifications' | 'wallet' | 'weather' | 'marketplace' | 'music' | 'chat' | 'events';

export interface PluginDefinition {
  id: PluginId;
  name: string;
  iconName: string;
  description: string;
  color: string;
}
