import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOODS, type MoodValue } from "@/lib/moods";

const PRIMARY_MODEL = "gemini-1.5-flash";
const FALLBACK_MODEL = "gemini-2.0-flash";
const MAX_INSIGHT_LENGTH = 1200;

/**
 * Generates a supportive reflection via Gemini (@google/generative-ai).
 * Tries gemini-1.5-flash first, then gemini-2.0-flash if the API returns 404.
 */
export async function generateEntryInsight(
  mood: MoodValue,
  journalText: string,
): Promise<string | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const moodLabel = MOODS.find((m) => m.value === mood)?.label ?? mood;
  const journal = journalText.trim();

  const prompt = `You are a gentle, empathetic journaling coach for MoodMap AI.

The user logged mood: ${moodLabel}
Journal (may be empty):
${journal || "(No journal text provided.)"}

Write a supportive, empathetic reflection in 2–4 short sentences. Plain text only—no markdown, bullets, or labels.
- Validate their experience; do not diagnose or give medical advice.
- If the journal mentions specific themes, reflect them gently; otherwise respond to the mood.
- Never tell them what they should feel.`;

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim();

      if (text) {
        return text.replace(/^["']|["']$/g, "").slice(0, MAX_INSIGHT_LENGTH);
      }
    } catch (err) {
      console.log("ACTUAL_GEMINI_ERROR:", { model: modelName, err });
    }
  }

  return null;
}
