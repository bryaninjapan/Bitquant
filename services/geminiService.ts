import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, AnalysisResult, Language, AssetType } from "../types";
import { getApiKey } from "../components/ApiKeyConfig";

// 动态获取 API Key（优先从 localStorage，然后是环境变量）
const getApiKeyValue = (): string => {
  // 在浏览器环境中，优先从 localStorage 读取
  if (typeof window !== 'undefined') {
    const storedKey = getApiKey();
    if (storedKey) return storedKey;
  }
  
  // 回退到环境变量（构建时注入）
  return process.env.API_KEY || process.env.GEMINI_API_KEY || '';
};

const apiKey = getApiKeyValue();

// 延迟初始化 AI 实例，以便在运行时获取 API Key
const getAI = () => {
  const currentKey = getApiKeyValue();
  if (!currentKey) {
    throw new Error("API Key is missing. Please configure it in the settings.");
  }
  return new GoogleGenAI({ apiKey: currentKey });
};

const getAssetName = (asset: AssetType, lang: Language) => {
    const names = {
        'BTC': { en: 'Bitcoin (BTC.D)', zh: '比特幣 (BTC)' },
        'ETH': { en: 'Ethereum (ETH)', zh: '以太坊 (ETH)' },
        'ADA': { en: 'Cardano (ADA)', zh: '卡達諾 (ADA)' }
    };
    return lang === 'zh-TW' ? names[asset].zh : names[asset].en;
};

export const calculateProbability = async (data: MarketData, language: Language, asset: AssetType): Promise<AnalysisResult> => {
  const currentApiKey = getApiKeyValue();
  if (!currentApiKey) {
    throw new Error("API Key is missing. Please configure it in the settings.");
  }
  
  // 每次调用时获取最新的 AI 实例（以支持动态更新 API Key）
  const ai = getAI();

  const assetName = getAssetName(asset, language);
  const direction = data.targetPrice > data.currentPrice ? "Long/Up" : "Short/Down";
  const distance = Math.abs((data.targetPrice - data.currentPrice) / data.currentPrice * 100).toFixed(2);

  // Construct parts for multimodal model
  const parts: any[] = [];

  const systemInstructionZh = `
    扮演一位專精於 ${assetName} 永續合約的世界級量化加密貨幣分析師。
    
    你的任務是計算 ${assetName} 價格在接下來 24 小時內，從當前價格 $${data.currentPrice} 到達目標價格 $${data.targetPrice} (方向: ${direction}) 的概率 (0-100%)。

    提供的市場背景數據:
    - 資產: ${assetName}
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

    請以純 JSON 格式返回響應，符合此架構，並使用繁體中文 (Traditional Chinese) 填寫內容。
  `;

  const systemInstructionEn = `
    Act as a world-class quantitative crypto analyst specializing in ${assetName} Perpetual Contracts.

    Your task is to calculate the probability (0-100%) of ${assetName} price reaching the target price $${data.targetPrice} from current price $${data.currentPrice} (Direction: ${direction}) within the next 24 hours.

    Market Context Data:
    - Asset: ${assetName}
    - Current Price: $${data.currentPrice}
    - Target Price: $${data.targetPrice} (Distance: ${distance}%)
    - Funding Rate: ${data.fundingRate}% (Positive = Longs pay Shorts, Negative = Shorts pay Longs)
    - Weekly Market Structure: ${data.weeklyStructure}
    - Additional Notes: ${data.additionalNotes || 'None'}

    Liquidation Heatmap Analysis:
    - If images are provided, visually analyze the bright yellow/red zones which indicate high leverage liquidation clusters.
    - 1-Day Context: ${data.heatmap1DayContext || 'No text provided, rely on image'}
    - 7-Day Context: ${data.heatmap7DayContext || 'No text provided, rely on image'}

    Analysis Logic:
    1. Liquidation Heatmaps (Coinglass) act as magnets. Price often moves to high liquidation intensity areas (bright bands).
    2. Funding Rate: High positive rates often mean longs are over-leveraged (contrarian bearish), negative rates mean shorts are over-leveraged (contrarian bullish), unless momentum is extremely strong.
    3. Market Structure: Respect weekly trend but acknowledge intraday mean reversion.
    4. Provide a strict probability percentage based on the synthesis of these factors.

    Return response in pure JSON format matching the schema, and write the content in English. DO NOT output any Chinese if the prompt is in English.
  `;

  const prompt = language === 'zh-TW' ? systemInstructionZh : systemInstructionEn;
  const imageLabel1 = language === 'zh-TW' ? "附圖 1: Coinglass 1天清算熱力圖" : "Attachment 1: Coinglass 1-Day Heatmap";
  const imageLabel7 = language === 'zh-TW' ? "附圖 2: Coinglass 7天清算熱力圖" : "Attachment 2: Coinglass 7-Day Heatmap";

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
        parts.push({ text: imageLabel1 });
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
        parts.push({ text: imageLabel7 });
    }
  }

  // Schema definition prompt appendage
  parts.push({ text: `
    JSON Structure:
    {
      "probability": number, // integer 0-100
      "sentiment": "Bullish" | "Bearish" | "Neutral",
      "rationale": "string", // Concise analysis explaining the quantitative logic.
      "keyLevels": ["string"], // List of 3 key support/resistance levels.
      "riskFactors": ["string"] // List of 3 main risk factors for this setup.
    }
  `});

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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