import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, Loader } from 'lucide-react';

const AIHelp: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    
    // In a real scenario, check if key exists, but per rules we assume it's there
    if (!process.env.API_KEY) {
        setResponse("عذراً، لم يتم العثور على مفتاح API.");
        return;
    }

    setLoading(true);
    setResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using Flash model for quick responses
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنت مساعد خبير في صيانة الهواتف الذكية. الرجاء الإجابة باللغة العربية باختصار وفائدة. السؤال: ${prompt}`,
      });
      
      setResponse(result.text || "لم أتمكن من الحصول على إجابة.");
    } catch (error) {
      console.error(error);
      setResponse("حدث خطأ أثناء الاتصال بالمساعد الذكي.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Bot className="text-indigo-600" />
          المساعد الذكي للفنيين
        </h2>
        <p className="text-gray-500 mt-2">اسأل عن طرق إصلاح أعطال، بدائل قطع غيار، أو نصائح عامة.</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col">
        {response ? (
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border overflow-y-auto mb-4 whitespace-pre-wrap leading-relaxed">
                {response}
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 mb-4">
                الإجابة ستظهر هنا...
            </div>
        )}

        <div className="flex gap-2">
            <input 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder="مثال: كيف أصلح مشكلة الشحن في آيفون 11؟"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
                onClick={handleAsk}
                disabled={loading}
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? <Loader className="animate-spin" /> : <Send />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;
