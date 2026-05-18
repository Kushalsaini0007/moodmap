import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { MoodMapLogo } from "@/components/MoodMapLogo";
import {
  DailyCheckIn,
  type EntryPreview,
} from "@/components/dashboard/DailyCheckIn";
import { MoodTrendChart } from "@/components/dashboard/MoodTrendChart";
import {
  buildSevenDayMoodTrend,
  getSevenDayWindowStartIso,
} from "@/lib/mood-trends";

export const metadata: Metadata = {
  title: "Dashboard — MoodMap AI",
  description: "Your MoodMap AI home.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const displayName =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "there";

  const weekStartIso = getSevenDayWindowStartIso();

  const [{ data, error }, { count: totalEntryCount, error: countError }, trendQuery] =
    await Promise.all([
      supabase
        .from("entries")
        .select("id, mood, journal_text, created_at, ai_insight")
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("entries")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("entries")
        .select("mood, created_at")
        .gte("created_at", weekStartIso)
        .order("created_at", { ascending: true }),
    ]);

  let recentEntries: EntryPreview[] = [];
  if (!error && data) {
    recentEntries = data.map((row) => ({
      id: row.id,
      mood: row.mood,
      journal_text: row.journal_text,
      created_at: row.created_at,
      ai_insight:
        typeof row.ai_insight === "string" ? row.ai_insight : null,
    }));
  }

  const loadError = error ?? countError;
  const totalSaved =
    typeof totalEntryCount === "number" ? totalEntryCount : recentEntries.length;

  const trendRows =
    !trendQuery.error && trendQuery.data
      ? (trendQuery.data as { mood: string; created_at: string }[])
      : [];

  const moodTrendData = buildSevenDayMoodTrend(trendRows);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-50 via-indigo-50/35 to-violet-50/45 font-sans text-slate-900 antialiased">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-96 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl"
      />

      <header className="relative z-10 border-b border-white/60 bg-white/50 shadow-sm shadow-violet-100/30 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8 md:py-5">
          <MoodMapLogo href="/" />
          <SignOutButton />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-12 md:max-w-4xl md:px-8 md:py-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" aria-hidden />
          Your dashboard
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
            {displayName}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
          Your private space for daily reflections. Log your thoughts, track
          your emotional patterns, and unlock unlimited therapeutic AI insights
          instantly.
        </p>

        {!loadError ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-indigo-100/80 bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
              <p className="font-medium text-slate-500">Entries saved</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-indigo-900">
                {totalSaved}
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-100/80 bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
              <p className="font-medium text-slate-500">Recent list</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-indigo-900">
                {recentEntries.length}
                <span className="text-base font-semibold text-slate-500">
                  {" "}
                  / 15 shown
                </span>
              </p>
            </div>
          </div>
        ) : null}

        {loadError ? (
          <p
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            <span className="font-medium">Could not load journal data.</span>{" "}
            {loadError.message}. Check that the{" "}
            <code className="rounded bg-amber-100/80 px-1">entries</code> table
            exists and RLS policies allow{" "}
            <code className="rounded bg-amber-100/80 px-1">select</code> for
            authenticated users, then refresh.
          </p>
        ) : null}

        {!loadError ? (
          <div className="mt-10">
            <MoodTrendChart data={moodTrendData} />
          </div>
        ) : null}

        <section
          className="mt-10"
          aria-labelledby="mood-tracker-heading"
        >
          <div className="mb-6 border-b border-indigo-100/80 pb-6">
            <h2
              id="mood-tracker-heading"
              className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
            >
              Mood tracker
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Pick a mood, jot a note, and tap{" "}
              <span className="font-semibold text-slate-800">Save entry</span>{" "}
              — your choice is stored with your user ID, mood, journal text, and
              a server timestamp on each row.
            </p>
          </div>

          <DailyCheckIn
            initialEntries={recentEntries}
            latestEntry={recentEntries[0] ?? null}
          />
        </section>
      </main>
    </div>
  );
}
