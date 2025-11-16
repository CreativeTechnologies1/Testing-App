
import { GoogleGenAI, Type } from "@google/genai";
import type { StartupIdea, BusinessPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateStartupIdeas = async (): Promise<StartupIdea[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Проанализируй актуальные и перспективные идеи для стартапов на 2024-2025 год. Сгенерируй 6 идей. Для каждой идеи укажи 'title' (название) и 'description' (краткое описание в 1-2 предложениях).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Название стартап-идеи.'
              },
              description: {
                type: Type.STRING,
                description: 'Краткое описание стартап-идеи.'
              },
            },
            required: ["title", "description"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const ideas = JSON.parse(jsonText);
    return ideas as StartupIdea[];
  } catch (error) {
    console.error("Error generating startup ideas:", error);
    throw new Error("Не удалось сгенерировать идеи. Пожалуйста, проверьте API-ключ и попробуйте снова.");
  }
};

export const generateBusinessPlan = async (ideaTitle: string): Promise<BusinessPlan> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Создай краткий бизнес-план для стартап-идеи: "${ideaTitle}". План должен включать следующие разделы в формате JSON: "targetAudience", "problem", "solution", "keyFeatures", "monetization", "marketingPlan". Каждый раздел должен быть строкой текста.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetAudience: { type: Type.STRING, description: 'Целевая аудитория' },
            problem: { type: Type.STRING, description: 'Проблема, которую решает стартап' },
            solution: { type: Type.STRING, description: 'Предлагаемое решение' },
            keyFeatures: { type: Type.STRING, description: 'Ключевые функции продукта/услуги (перечислить через точку с запятой)' },
            monetization: { type: Type.STRING, description: 'Стратегия монетизации' },
            marketingPlan: { type: Type.STRING, description: 'Маркетинговый план для привлечения первых пользователей' },
          },
          required: ["targetAudience", "problem", "solution", "keyFeatures", "monetization", "marketingPlan"],
        },
      },
    });

    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);
    return plan as BusinessPlan;
  } catch (error) {
    console.error("Error generating business plan:", error);
    throw new Error("Не удалось сгенерировать бизнес-план. Пожалуйста, попробуйте снова.");
  }
};
