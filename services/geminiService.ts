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

  const prompt = `
    Act as a World-Class Quantitative Crypto Analyst specializing in Bitcoin Perpetual Contracts (BTC.D).
    
    Your task is to calculate the probability (0-100%) of Bitcoin price hitting the Target Price of $${data.targetPrice} (Direction: ${direction}) from the Current Price of $${data.currentPrice} within the next 24 hours.

    Market Context Provided:
    - Current Price: $${data.currentPrice}
    - Target Price: $${data.targetPrice} (Distance: ${distance}%)
    - Current Funding Rate: ${data.fundingRate}% (Positive = Longs paying Shorts, Negative = Shorts paying Longs)
    - Weekly Market Structure: ${data.weeklyStructure}
    - Liquidation Heatmap (1 Day View): ${data.heatmap1DayContext}
    - Liquidation Heatmap (7 Day View): ${data.heatmap7DayContext}
    - Additional Notes: ${data.additionalNotes || 'None'}

    Analysis Logic Rules:
    1. Liquidation Heatmaps act as magnets. Price often moves toward high liquidation clusters (bright yellow/red zones).
    2. Funding Rate: High positive funding often implies over-leveraged longs (contrarian bearish signal), negative funding implies over-leveraged shorts (contrarian bullish signal), unless the trend is extremely strong (momentum).
    3. Market Structure: Respect the weekly trend but acknowledge intraday mean reversions.
    4. Provide a strict probability percentage based on the confluence of these factors.

    Return the response in pure JSON format matching this schema:
    {
      "probability": number, // integer 0-100
      "sentiment": "Bullish" | "Bearish" | "Neutral",
      "rationale": "string", // A concise paragraph explaining the quant logic used.
      "keyLevels": ["string"], // List of 3 critical support/resistance levels derived from the context.
      "riskFactors": ["string"] // List of 3 main risks to this trade setup.
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better reasoning on complex financial logic
      contents: prompt,
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