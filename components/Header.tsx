
import React from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/5 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">VISION STUDIO</h1>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
          <a href="#create" className="hover:text-white transition-colors">إبداع جديد</a>
          <a href="#gallery" className="hover:text-white transition-colors">المعرض</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white text-sm font-bold">{user.displayName || 'مبدع فيجن'}</span>
                <button 
                  onClick={() => signOut(auth)}
                  className="text-[10px] text-gray-500 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
                >
                  تسجيل خروج
                </button>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-red-600/30 p-0.5 overflow-hidden">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=dc2626&color=fff`} 
                  className="w-full h-full rounded-full object-cover"
                  alt="Avatar"
                />
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
