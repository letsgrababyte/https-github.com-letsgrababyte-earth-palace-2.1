import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { Post } from '../types';

interface FeedPostProps {
  post: Post;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <article className="bg-white mb-4 shadow-sm border-b border-gray-100 last:border-0 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-gray-50">
             {/* Using User initials as fallback if img fails, but mock has url */}
             <img src={post.user.avatarUrl} alt={post.user.username} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{post.user.username}</h3>
            <p className="text-xs text-gray-500">{post.user.handle} • {post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image (Conditional) */}
      {post.imageUrl && (
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleLike}
            className={`flex items-center space-x-1.5 transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          
          <button className="flex items-center space-x-1.5 text-gray-600 hover:text-gray-900">
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          <button className="text-gray-600 hover:text-gray-900">
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        <button className="text-gray-600 hover:text-gray-900">
          <Bookmark className="h-6 w-6" />
        </button>
      </div>
    </article>
  );
};