"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MOODS, type MoodValue } from "@/lib/moods";
import { deleteEntry, saveEntry } from "@/app/dashboard/actions";

export type EntryPreview = {
  id: string;
  mood: string;
  journal_text: string;
  created_at: string;
  ai_insight: string | null;
};

function moodMeta(mood: string) {
  return MOODS.find((m) => m.value === mood);
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type DailyCheckInProps = {
  initialEntries: EntryPreview[];
  /** Newest entry (used for “Insight of the day” hero). */
  latestEntry: EntryPreview | null;
};

export function DailyCheckIn({ initialEntries, latestEntry }: DailyCheckInProps) {
  const router = useRouter();
  const [mood, setMood] = useState<MoodValue>("neutral");
  const [journal, setJournal] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const charCount = journal.length;
  const maxChars = 20_000;

  const entries = initialEntries;
  const heroInsight = latestEntry?.ai_insight?.trim() || null;

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveEntry(mood, journal);
      if (result.ok) {
        setMessage({
          type: "success",
          text: result.insight
            ? "Saved. Your insight of the day is ready below."
            : "Your entry was saved.",
        });
        setJournal("");
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  async function handleDelete(entryId: string) {
    if (
      !confirm(
        "Delete this entry? The journal text and AI insight will be removed.",
      )
    ) {
      return;
    }
    setDeletingId(entryId);
    const result = await deleteEntry(entryId);
    setDeletingId(null);
    if (result.ok) {
      setMessage(null);
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <div className="space-y-10">
      <section
        className="rounded-3xl border border-violet-200/80 bg-gradient-to-br from-white via-indigo-50/40 to-violet-50/50 p-6 shadow-lg shadow-violet-100/30 backdrop-blur-sm md:p-8"
        aria-labelledby="insight-of-the-day-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">
              MoodMap AI
            </p>
            <h2
              id="insight-of-the-day-heading"
              className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl"
            >
              Insight of the day
            </h2>
            {latestEntry ? (
              <p className="mt-1 text-xs text-slate-500 md:text-sm">
                Based on your latest entry
                {latestEntry.created_at ? (
                  <>
                    {" "}
                    ·{" "}
                    <time
                      dateTime={latestEntry.created_at}
                      suppressHydrationWarning
                    >
                      {formatTime(latestEntry.created_at)}
                    </time>
                  </>
                ) : null}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 md:text-sm">
                Save an entry to generate a gentle reflection from your journal.
              </p>
            )}
          </div>
          <span className="text-2xl" aria-hidden>
            ✨
          </span>
        </div>

        {heroInsight ? (
          <p className="mt-5 text-pretty text-sm leading-relaxed text-slate-800 md:text-base">
            {heroInsight}
          </p>
        ) : (
          <p className="mt-5 text-sm leading-relaxed text-slate-600 md:text-base">
            {latestEntry
              ? "AI is thinking... please wait or refresh your browser."
              : "Your personalized insight will appear here after you save your first journal entry."}
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-indigo-100/90 bg-white/80 p-6 shadow-lg shadow-indigo-100/25 backdrop-blur-sm md:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
          How are you feeling today?
        </h2>
        <p className="mt-1 text-sm text-slate-600 md:text-base">
          Tap the mood that fits best right now—there’s no wrong answer.
        </p>

        <div
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4"
          role="radiogroup"
          aria-label="Today’s mood"
        >
          {MOODS.map((m) => {
            const selected = mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition-all duration-200 ease-out md:py-5 ${
                  selected
                    ? "border-indigo-400 bg-gradient-to-b from-indigo-50 to-violet-50/80 shadow-md shadow-indigo-200/40 ring-2 ring-indigo-400/70"
                    : "border-slate-200/90 bg-white/90 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-sm"
                }`}
              >
                <span className="text-3xl leading-none md:text-4xl" aria-hidden>
                  {m.emoji}
                </span>
                <span
                  className={`text-xs font-semibold md:text-sm ${
                    selected ? "text-indigo-900" : "text-slate-700"
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-100/90 bg-white/80 p-6 shadow-lg shadow-indigo-100/25 backdrop-blur-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
              Daily journal
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              A few lines about your day, worries, or wins—private to your
              account.
            </p>
          </div>
          <span
            className={`text-xs tabular-nums ${
              charCount > maxChars ? "font-medium text-red-600" : "text-slate-500"
            }`}
          >
            {charCount} / {maxChars}
          </span>
        </div>

        <label htmlFor="daily-journal" className="sr-only">
          Journal entry
        </label>
        <textarea
          id="daily-journal"
          name="journal"
          rows={8}
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          maxLength={maxChars}
          placeholder="What’s on your mind today? Events, energy, gratitude, tension—anything goes."
          className="mt-4 w-full resize-y rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm leading-relaxed text-slate-900 shadow-inner outline-none ring-indigo-200/60 transition-shadow placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 md:text-base"
        />

        {message ? (
          <p
            role="status"
            className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || charCount > maxChars}
            className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending ? "Saving & generating insight…" : "Save entry"}
          </button>
          <p className="text-xs text-slate-500 md:text-sm">
            Each save creates a new row; MoodMap AI drafts an insight from your
            mood and journal.
          </p>
        </div>
      </section>

      {entries.length > 0 ? (
        <section className="rounded-3xl border border-slate-200/80 bg-white/60 p-6 backdrop-blur-sm md:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Recent entries</h2>
          <p className="mt-1 text-sm text-slate-600">
            Newest first. Delete removes the row from Supabase permanently.
          </p>
          <ul className="mt-6 space-y-4">
            {entries.map((row) => {
              const meta = moodMeta(row.mood);
              const rowInsight = row.ai_insight?.trim();
              return (
                <li
                  key={row.id}
                  className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span className="text-lg" aria-hidden>
                          {meta?.emoji ?? "•"}
                        </span>
                        <span className="font-medium text-slate-800">
                          {meta?.label ?? row.mood}
                        </span>
                        <span className="text-slate-400">·</span>
                        <time dateTime={row.created_at} suppressHydrationWarning>
                          {formatTime(row.created_at)}
                        </time>
                      </div>
                      {row.journal_text ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 md:text-base">
                          {row.journal_text}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm italic text-slate-400">
                          No journal text for this entry.
                        </p>
                      )}
                      {rowInsight ? (
                        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2 text-sm leading-relaxed text-slate-700">
                          <span className="font-medium text-violet-800">
                            Insight:{" "}
                          </span>
                          {rowInsight}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      disabled={deletingId === row.id}
                      className="shrink-0 rounded-xl border border-red-200/90 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete this journal entry"
                    >
                      {deletingId === row.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}