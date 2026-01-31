import React, { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { auth, isFirebaseConfigured } from '../../services/firebase';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { User } from '../../types';
import { Eye, EyeOff } from 'lucide-react';

interface SignInProps {
  onSwitchToSignUp: () => void;
  onLoginSuccess: (user: User) => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp, onLoginSuccess }) => {
  // Auto-fill information by default
  const [email, setEmail] = useState('explorer@earthpost.app');
  const [password, setPassword] = useState('password123');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extracted login logic to be reusable by manual submit and auto-signin
  const executeLogin = async () => {
    setLoading(true);
    setError('');

    // Fallback for development/demo without Firebase keys
    if (!auth || !isFirebaseConfigured) {
        setTimeout(() => {
            const mockUser: User = {
                id: 'mock-user-1',
                username: email.split('@')[0] || 'Demo User',
                handle: '@demo',
                avatarUrl: `https://picsum.photos/100/100?random=${email.length}`
            };
            onLoginSuccess(mockUser);
        }, 1500); // 1.5s delay to show the "Signing in..." state so user knows what happened
        return;
    }

    try {
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      
      await signInWithEmailAndPassword(auth, email, password);
      // App.tsx listener handles the success
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin();
  };

  // Auto-sign in effect
  useEffect(() => {
    // Only auto-sign in if we are in demo mode (no firebase config) to avoid infinite loops with bad real credentials
    if (!isFirebaseConfigured) {
        executeLogin();
    }
  }, []);

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue"
      onLogoClick={() => { /* Already at home/signin root */ }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
            </div>
        )}
        
        {(!isFirebaseConfigured) && (
             <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded mb-2 animate-pulse">
                 Demo Mode: Auto-signing you in...
             </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
           <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 select-none">Remember me</span>
           </label>
           <button type="button" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md active:transform active:scale-95 flex justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
              <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
              </div>
          ) : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignUp} className="font-semibold text-blue-600 hover:text-blue-800">
          Sign Up
        </button>
      </div>
    </AuthLayout>
  );
};