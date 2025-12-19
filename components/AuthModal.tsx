
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message.includes('auth/invalid-credential') 
        ? 'بيانات الدخول غير صحيحة' 
        : 'حدث خطأ، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md glass rounded-[3rem] p-10 relative overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.2)]">
        <button 
          onClick={onClose}
          className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_30px_rgba(220,38,38,0.4)]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white">{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
          <p className="text-gray-400 mt-2">انضم لمجتمع المبدعين في Vision Studio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <input
                type="text"
                placeholder="الاسم الكامل"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-5 rounded-2xl auth-input text-lg"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl auth-input text-lg text-left"
              dir="ltr"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl auth-input text-lg text-left"
              dir="ltr"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : (isSignUp ? 'إنشاء الحساب' : 'دخول')}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400">
          <span>{isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}</span>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-red-500 font-bold mr-2 hover:underline"
          >
            {isSignUp ? 'سجل دخولك' : 'اشترك الآن'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
