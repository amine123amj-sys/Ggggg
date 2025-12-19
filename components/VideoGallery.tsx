
import React, { useState } from 'react';
import { GeneratedVideo } from '../types';

interface VideoGalleryProps {
  videos: GeneratedVideo[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (url: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `VisionStudio-Graded-Video-${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      {videos.map((item) => (
        <div key={item.id} className="group relative glass rounded-[3rem] overflow-hidden border border-white/5 hover:border-red-600/40 transition-all duration-700 shadow-2xl bg-gray-900/40">
          <div className={`relative ${item.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
            {/* شارة جودة الإنتاج */}
            <div className="absolute top-8 left-8 z-30 pointer-events-none">
              <div className="px-5 py-2.5 bg-emerald-600 text-white text-[11px] font-black rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                AI COLOR GRADED
              </div>
            </div>

            <video 
              src={item.url} 
              className="w-full h-full object-cover" 
              controls
              playsInline
              poster={`https://img.youtube.com/vi/${getYoutubeId(item.sourceUrl)}/maxresdefault.jpg`}
            />
            
            <div className="absolute inset-x-8 bottom-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0 z-40">
               <button 
                onClick={() => handleDownload(item.url, item.id)}
                disabled={downloadingId === item.id}
                className={`flex-1 py-5 font-black text-lg rounded-[1.5rem] flex items-center justify-center gap-3 shadow-2xl transition-all ${
                  downloadingId === item.id ? 'bg-gray-700 text-gray-400 cursor-wait' : 'bg-white text-black hover:bg-red-600 hover:text-white'
                }`}
              >
                {downloadingId === item.id ? (
                  <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                <span>تحميل الفيديو المعدل</span>
              </button>
            </div>
          </div>

          <div className="p-10 text-right" dir="rtl">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <span className="text-white font-mono text-sm">{new Date(item.timestamp).toLocaleTimeString('ar-SA')}</span>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                <span className="text-[11px] text-emerald-500 font-black">{item.prompt}</span>
                <img 
                  src={`https://img.youtube.com/vi/${getYoutubeId(item.sourceUrl)}/default.jpg`} 
                  className="w-10 h-10 rounded-xl border border-white/10 object-cover"
                  alt="Source"
                />
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed font-medium">
              تم الحفاظ على المشهد الأصلي مع تطبيق معالجة لونية ذكية بالكامل باستخدام محرك <span className="text-red-500 font-black">VEO 3.1</span>.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGallery;
