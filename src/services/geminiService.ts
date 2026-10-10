import { OutfitConfig, CulturalEvaluationResult } from '../types';
import { evaluateOutfitRuleBased } from './rulesEngine';

/**
 * Service to request cultural evaluation from the server-side Gemini AI model,
 * with automatic fallback to rulesEngine if the API is offline or unavailable.
 */
export async function evaluateOutfitWithAI(outfit: OutfitConfig): Promise<CulturalEvaluationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch('/api/cultural-stylist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ outfit }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Gemini server API returned status ${response.status}, triggering rule-based fallback.`);
      return evaluateOutfitRuleBased(outfit);
    }

    const data = await response.json();

    if (data.fallback || !data.culturalSafetyScore) {
      console.warn('Server signaled fallback or incomplete response, using rule-based evaluation.');
      return evaluateOutfitRuleBased(outfit);
    }

    return {
      culturalSafetyScore: Number(data.culturalSafetyScore) || 90,
      evaluation: String(data.evaluation || ''),
      socialCaption: String(data.socialCaption || ''),
      historicalInsight: String(data.historicalInsight || ''),
      academicNotes: String(data.academicNotes || 'Căn cứ nghiên cứu "Trang Phục Việt Nam" (Đoàn Thị Tình) & "Ngàn Năm Áo Mũ" (Trần Quang Đức).'),
      styleTips: Array.isArray(data.styleTips) ? data.styleTips : ['Tự tin diện cổ phục với phong thái trang nhã!'],
      evaluatedAt: data.evaluatedAt || new Date().toISOString(),
      engineUsed: 'gemini',
    };
  } catch (err) {
    console.warn('Network or Gemini API error, applying rule engine fallback:', err);
    return evaluateOutfitRuleBased(outfit);
  }
}
