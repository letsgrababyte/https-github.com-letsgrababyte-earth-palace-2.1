import React from 'react';
import { EPLogo } from '../EPLogo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onLogoClick?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, onLogoClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 relative">
      {/* Logo in top left */}
      <div className="absolute top-6 left-6 z-10">
        <EPLogo onClick={onLogoClick} />
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6 mt-12">
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-center text-gray-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};