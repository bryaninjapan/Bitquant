import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const calculateProbability = async (data: MarketData): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const direction = data.targetPrice > data.currentPrice ? "Long/Up" : "Short/Down";
  const distance = Math.abs((data.targetPrice - data.currentPrice) / data.currentPrice * 100).toFixed(2);

  // Construct parts for multimodal model
  const parts: any[] = [];

  const prompt = `
    扮演一位專精於比特幣永續合約 (BTC.D) 的世界級量化加密貨幣分析師。
    
    你的任務是計算比特幣價格在接下來 24 小時內，從當前價格 $${data.currentPrice} 到達目標價格 $${data.targetPrice} (方向: ${direction}) 的概率 (0-100%)。

    提供的市場背景數據:
    - 當前價格: $${data.currentPrice}
    - 目標價格: $${data.targetPrice} (距離: ${distance}%)
    - 當前資金費率: ${data.fundingRate}% (正值 = 多頭付給空頭, 負值 = 空頭付給多頭)
    - 本週市場結構趨勢: ${data.weeklyStructure}
    - 額外筆記: ${data.additionalNotes || '無'}

    清算熱力圖分析 (Liquidation Heatmap):
    - 如果提供了圖片，請視覺化分析圖片中的亮黃色/紅色區域，這些是高槓桿清算聚集區。
    - 1天圖描述/補充: ${data.heatmap1DayContext || '未提供文字描述，請依賴圖片'}
    - 7天圖描述/補充: ${data.heatmap7DayContext || '未提供文字描述，請依賴圖片'}

    分析邏輯規則:
    1. 清算熱力圖 (Coinglass) 具有磁鐵效應。價格通常會移動到高清算強度區域 (亮色帶)。
    2. 資金費率: 高額正費率通常意味著多頭過度槓桿 (反向看跌信號)，負費率意味著空頭過度槓桿 (反向看漲信號)，除非趨勢極強 (動能)。
    3. 市場結構: 尊重每週趨勢，但承認日內均值回歸。
    4. 請根據這些因素的綜合情況，給出一個嚴格的概率百分比。

    請以純 JSON 格式返回響應，符合此架構，並使用繁體中文 (Traditional Chinese) 填寫內容:
    {
      "probability": number, // integer 0-100
      "sentiment": "Bullish" | "Bearish" | "Neutral",
      "rationale": "string", // 一段簡潔的分析，解釋使用的量化邏輯。
      "keyLevels": ["string"], // 3個關鍵支撐/阻力位的列表。
      "riskFactors": ["string"] // 此交易設置的3個主要風險因素。
    }
  `;

  parts.push({ text: prompt });

  // Add images if they exist
  if (data.heatmapImage1Day) {
    // Extract base64 data and mime type
    const match = data.heatmapImage1Day.match(/^data:(.+);base64,(.+)$/);
    if (match) {
        parts.push({
            inlineData: {
                mimeType: match[1],
                data: match[2]
            }
        });
        parts.push({ text: "附圖 1: Coinglass 1天清算熱力圖" });
    }
  }

  if (data.heatmapImage7Day) {
    const match = data.heatmapImage7Day.match(/^data:(.+);base64,(.+)$/);
    if (match) {
        parts.push({
            inlineData: {
                mimeType: match[1],
                data: match[2]
            }
        });
        parts.push({ text: "附圖 2: Coinglass 7天清算熱力圖" });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is excellent for multimodal/vision tasks and faster
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: { type: Type.INTEGER },
            sentiment: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
            rationale: { type: Type.STRING },
            keyLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["probability", "sentiment", "rationale", "keyLevels", "riskFactors"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to calculate probability. Please try again.");
  }
};