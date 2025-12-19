
import React, { useState, useEffect } from 'react';
import { generateAiVideo } from '../services/geminiService';
import { GeneratedVideo, AspectRatio } from '../types';

interface VideoGeneratorProps {
  onVideoGenerated: (item: GeneratedVideo) => void;
}

// Fix: Use the AIStudio interface name to match the expected global type definition
// and avoid conflicting property declarations on the Window object.
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const styles = [
  { id: 'hollywood', name: 'هوليوود (Teal & Orange)', prompt: 'Hollywood blockbuster Teal and Orange cinematic color grading, high contrast' },
  { id: 'cyberpunk', name: 'مستقبلي (Cyberpunk)', prompt: 'Neon cyberpunk aesthetic with deep purples, vibrant cyans and high glow' },
  { id: 'vintage', name: 'كلاسيكي (Vintage)', prompt: '70s vintage film stock with warm grain, faded colors and retro atmosphere' },
  { id: 'noir', name: 'أبيض وأسود (Noir)', prompt: 'High contrast dramatic black and white cinematic noir style with deep shadows' },
  { id: 'dreamy', name: 'خالي (Dreamy)', prompt: 'Dreamy pastel colors with soft glow, ethereal lighting and magical atmosphere' }
];

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onVideoGenerated }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [progress, setProgress] = useState(0);

  const steps = [
    "جاري سحب غلاف الفيديو المرجعي...",
    "تحليل الألوان الأصلية...",
    "تطبيق الفلتر السينمائي الجديد...",
    "معالجة الإضاءة والظلال باستخدام Veo 3.1...",
    "تجهيز رابط التحميل النهائي..."
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 10000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating, steps.length]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  useEffect(() => {
    setVideoId(extractVideoId(youtubeUrl));
  }, [youtubeUrl]);

  const urlToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(`https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg`);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Thumbnail conversion failed", e);
      return "";
    }
  };

  const startProcess = async (vId: string) => {
    setIsGenerating(true);
    try {
      const thumbUrl = `https://img.youtube.com/vi/${vId}/maxresdefault.jpg`;
      const imageBytes = await urlToBase64(thumbUrl);

      const videoUrl = await generateAiVideo(youtubeUrl, { 
        aspectRatio, 
        style: selectedStyle.prompt,
        imageBytes
      });

      onVideoGenerated({
        id: Math.random().toString(36).substr(2, 9),
        url: videoUrl,
        prompt: `تلوين سينمائي: ${selectedStyle.name}`,
        sourceUrl: youtubeUrl,
        timestamp: Date.now(),
        aspectRatio,
        status: 'completed'
      });

      setYoutubeUrl('');
      setVideoId(null);
    } catch (error: any) {
      // التعامل مع خطأ المفتاح المفقود أو غير الصالح لإعادة فتح نافذة الاختيار
      if (error.message === "API_KEY_ERROR" || (error.message && error.message.includes("Requested entity was not found"))) {
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
          // بعد فتح النافذة، نفترض النجاح ونحاول مرة أخرى (قاعدة Veo للتعامل مع Race Condition)
          startProcess(vId);
        }
      } else {
        alert("حدث خطأ أثناء المعالجة: " + error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) return;

    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // المتابعة فوراً بعد فتح النافذة
        startProcess(videoId);
        return;
      }
    }

    startProcess(videoId);
  };

  return (
    <div className={`relative overflow-hidden glass p-1 rounded-[2.5rem] transition-all duration-700 ${videoId ? 'ring-4 ring-red-600 shadow-[0_0_60px_rgba(220,38,38,0.2)]' : ''}`}>
      <div className="bg-gray-900/90 rounded-[calc(2.5rem-4px)] p-10 md:p-14">
        <form onSubmit={handleSubmit} className="space-y-10 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white">تحويل الألوان السينمائي</h2>
            <p className="text-gray-400">نفس الفيديو الأصلي.. بتبديل ألوان كامل ومذهل باستخدام تقنية Veo</p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="ضع رابط اليوتيوب لتغيير ألوانه..."
              className={`w-full bg-black/40 border-2 rounded-2xl p-6 pr-16 focus:ring-8 outline-none transition-all text-left font-mono text-xl ${videoId ? 'border-red-600 text-red-500' : 'border-white/10 text-gray-300'}`}
              dir="ltr"
              disabled={isGenerating}
            />
          </div>

          {videoId && !isGenerating && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-700 flex flex-col items-center gap-8">
              <div className="w-full">
                <p className="text-sm font-bold text-gray-500 uppercase mb-6 tracking-widest">اختر درجة الألوان المطلوبة:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold ${selectedStyle.id === style.id ? 'bg-red-600 border-red-600 text-white shadow-lg scale-105' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-3xl border-4 border-white/5 overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                  className="w-full max-w-sm aspect-video object-cover"
                  alt="Preview"
                />
              </div>
            </div>
          )}

          <div className="max-w-xl mx-auto">
            <button
              type="submit"
              disabled={isGenerating || !videoId}
              className={`w-full py-8 rounded-[2rem] font-black text-3xl transition-all relative overflow-hidden group/btn ${
                isGenerating || !videoId
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-[0_20px_50px_rgba(220,38,38,0.4)] transform hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                   <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xl">{steps[progress]}</span>
                  </div>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  ابدأ التحميل الآن
                </span>
              )}
            </button>
            
            {/* رابط الفوترة الإلزامي لـ Veo */}
            <div className="mt-8 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
               <p className="text-[10px] text-gray-400">لضمان عمل التقنية، يجب تفعيل الفوترة في مشروعك</p>
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-red-500 font-bold underline hover:text-red-400">إعدادات الفوترة وربط البطاقة</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoGenerator;
