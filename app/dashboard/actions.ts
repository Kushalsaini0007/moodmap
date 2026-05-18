"use server";

import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isMoodValue, MOODS } from "@/lib/moods";
import type { MoodValue } from "@/lib/moods";

const MAX_JOURNAL_LENGTH = 20_000;
const GROQ_MODEL = "llama-3.1-8b-instant";

/** Used only if Groq returns nothing or errors, so the row still has a reflection (no paywall copy). */
const INSIGHT_FALLBACK =
  "Your entry is saved. Take a quiet moment with what you wrote—it matters, even when a fresh AI reflection could not be generated this time.";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type SaveEntryResult =
  | { ok: true; insight: string | null }
  | { ok: false; error: string };

export type DeleteEntryResult =
  | { ok: true }
  | { ok: false; error: string };

async function generateGroqInsight(
  mood: MoodValue,
  journalText: string,
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const moodLabel = MOODS.find((m) => m.value === mood)?.label ?? mood;
  const groq = new Groq({ apiKey });

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: `You are a gentle, empathetic journaling coach for MoodMap AI.
Write a supportive reflection in 2–4 short sentences. Plain text only—no markdown or bullets.
Do not diagnose or give medical advice. Never tell the user what they should feel.`,
        },
        {
          role: "user",
          content: `Mood: ${moodLabel}

Journal:
${journalText || "(No journal text provided.)"}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text ? text.slice(0, 1200) : null;
  } catch (err) {
    console.log("ACTUAL_GROQ_ERROR:", err);
    return null;
  }
}

export async function saveEntry(
  mood: string,
  rawJournalText: string,
): Promise<SaveEntryResult> {
  if (!isMoodValue(mood)) {
    return { ok: false, error: "Please choose a valid mood." };
  }

  const journalText = rawJournalText.trim();
  if (journalText.length > MAX_JOURNAL_LENGTH) {
    return {
      ok: false,
      error: `Journal is too long (max ${MAX_JOURNAL_LENGTH} characters).`,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You are not signed in." };
  }

  let aiInsight: string | null = null;

  try {
    aiInsight = await generateGroqInsight(mood as MoodValue, journalText);
  } catch (err) {
    console.log("ACTUAL_GROQ_ERROR:", err);
    aiInsight = null;
  }

  if (!aiInsight) {
    aiInsight = INSIGHT_FALLBACK;
  }

  const { error } = await supabase.from("entries").insert({
    user_id: user.id,
    mood,
    journal_text: journalText,
    ai_insight: aiInsight,
  });

  if (error) {
    return {
      ok: false,
      error: error.message || "Could not save your entry.",
    };
  }

  revalidatePath("/dashboard");
  return { ok: true, insight: aiInsight };
}

export async function deleteEntry(entryId: string): Promise<DeleteEntryResult> {
  if (!UUID_RE.test(entryId)) {
    return { ok: false, error: "Invalid entry id." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You are not signed in." };
  }

  const { data: deletedRows, error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .select("id");

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!deletedRows?.length) {
    return {
      ok: false,
      error: "Entry not found or you do not have permission to delete it.",
    };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
