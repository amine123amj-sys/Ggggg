
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold mb-6">
          تلوين الفيديو الاحترافي بالذكاء الاصطناعي
        </span>
        <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tight">
          غير ألوان فيديوهاتك <br />
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            بلمسة سينمائية مذهلة
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed px-4">
          أدخل رابط اليوتيوب وسيقوم الذكاء الاصطناعي بتغيير ألوان الفيديو بالكامل (Color Grading) مع الحفاظ على نفس المشاهد والأحداث الأصلية.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#create" className="px-10 py-5 bg-red-600 text-white font-black text-xl rounded-2xl hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(220,38,38,0.3)] border-b-4 border-red-800">
            ابدأ التلوين السينمائي الآن
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
