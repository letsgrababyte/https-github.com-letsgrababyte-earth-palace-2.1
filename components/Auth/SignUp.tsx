import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { auth, db, isFirebaseConfigured } from '../../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../../types';

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onLoginSuccess: (user: User) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSwitchToSignIn, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Fallback for development/demo without Firebase keys
    if (!auth || !isFirebaseConfigured) {
        setTimeout(() => {
            const mockUser: User = {
                id: 'mock-user-' + Date.now(),
                username: username || 'Explorer',
                handle: '@' + (username.toLowerCase() || 'explorer'),
                avatarUrl: `https://picsum.photos/100/100?random=${Date.now()}`
            };
            onLoginSuccess(mockUser);
        }, 800);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
          displayName: username,
          photoURL: `https://picsum.photos/100/100?random=${user.uid.charCodeAt(0)}`
      });

      if (db) {
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username,
            email: email,
            handle: `@${username.toLowerCase().replace(/\s+/g, '')}`,
            avatarUrl: user.photoURL,
            createdAt: new Date().toISOString()
        });
      }

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the community today"
      onLogoClick={onSwitchToSignIn}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
            </div>
        )}
        
        {(!isFirebaseConfigured) && (
             <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded mb-2">
                 Demo Mode: No email verification required.
             </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="EarthExplorer"
          />
        </div>
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
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition-colors shadow-md active:transform active:scale-95 flex justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
           {loading ? (
              <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
          ) : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={onSwitchToSignIn} className="font-semibold text-blue-600 hover:text-blue-800">
          Sign In
        </button>
      </div>
    </AuthLayout>
  );
};