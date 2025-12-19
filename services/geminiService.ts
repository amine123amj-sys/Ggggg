
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const generateAiVideo = async (
  sourceUrl: string,
  config: {
    aspectRatio: AspectRatio;
    style?: string;
    imageBytes?: string;
  }
) => {
  // CRITICAL: إنشاء مثيل جديد تماماً قبل الطلب لضمان الحصول على أحدث مفتاح من البيئة
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const styleDescription = config.style || "Cinematic Hollywood teal and orange";
    
    // الطلب يركز على تغيير الألوان والجو العام فقط مع الحفاظ على المحتوى
    const prompt = `Perform a professional cinematic color grading on this scene. 
    Maintain the exact composition, characters, and objects from the reference image. 
    Transform the entire color palette to a ${styleDescription} aesthetic. 
    Ensure high dynamic range, professional lighting, and cinematic atmosphere while preserving the original content structure.`;

    const videoConfig: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: config.aspectRatio
      }
    };

    // إذا توفرت صورة مرجعية (Thumbnail)، نرسلها للمحرك لضمان ثبات المحتوى
    if (config.imageBytes) {
      videoConfig.image = {
        imageBytes: config.imageBytes,
        mimeType: 'image/jpeg'
      };
    }

    let operation = await ai.models.generateVideos(videoConfig);

    // متابعة حالة العملية حتى الاكتمال (Polling)
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (downloadLink) {
      // إرفاق مفتاح API عند طلب رابط التحميل المباشر حسب متطلبات Veo
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }

    throw new Error("لم يتم العثور على رابط الفيديو في الاستجابة.");
  } catch (error: any) {
    console.error("Veo Error:", error);
    // التحقق من الخطأ المتعلق بالمفتاح لبرمجته في المكون الرسومي
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
};
