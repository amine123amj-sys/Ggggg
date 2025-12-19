
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoGenerator from './components/VideoGenerator';
import VideoGallery from './components/VideoGallery';
import AuthModal from './components/AuthModal';
import { GeneratedVideo } from './types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';

const App: React.FC = () => {
  const [items, setItems] = useState<GeneratedVideo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const addItem = (item: GeneratedVideo) => {
    setItems(prev => [item, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-red-500/30">
      <Header user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
      
      <main className="container mx-auto px-4 pb-20 text-right" dir="rtl">
        <Hero />
        
        <div id="create" className="max-w-4xl mx-auto mb-16 relative">
          {!user && (
            <div className="absolute inset-0 z-10 glass rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 border-2 border-red-600/20">
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mb-6 border border-red-600/30">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black mb-4">يجب تسجيل الدخول للإبداع</h3>
              <p className="text-gray-400 max-w-sm mb-8">سجل دخولك الآن لتتمكن من استخدام تقنيات Veo 3.1 وتلوين فيديوهاتك سينمائياً.</p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 active:scale-95"
              >
                دخول / اشتراك
              </button>
            </div>
          )}
          <VideoGenerator onVideoGenerated={addItem} />
        </div>

        {items.length > 0 && (
          <section id="gallery" className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              معرض الإبداعات الفنية
            </h2>
            <VideoGallery videos={items} />
          </section>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <footer className="py-12 border-t border-white/10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} فيجن ستوديو - منصة الإبداع السينمائي المباشر</p>
      </footer>
    </div>
  );
};

export default App;
