import { isMoodValue, type MoodValue } from "@/lib/moods";

/** Ordinal scale for charting (1 = lowest energy / mood, 5 = highest). */
export const MOOD_SCORE: Record<MoodValue, number> = {
  sad: 1,
  anxious: 2,
  neutral: 3,
  productive: 4,
  happy: 5,
};

export type MoodTrendPoint = {
  dayKey: string;
  dayLabel: string;
  avgScore: number | null;
  entryCount: number;
};

function scoreForMood(mood: string): number | null {
  return isMoodValue(mood) ? MOOD_SCORE[mood] : null;
}

function utcYmd(d: Date): { y: number; m: number; day: number } {
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth(),
    day: d.getUTCDate(),
  };
}

/** Start of UTC calendar day for (today − 6 days), inclusive of 7-day window. */
export function getSevenDayWindowStartIso(now: Date = new Date()): string {
  const { y, m, day } = utcYmd(now);
  return new Date(Date.UTC(y, m, day - 6, 0, 0, 0, 0)).toISOString();
}

/**
 * One point per UTC calendar day for the last 7 days (oldest → newest).
 * `avgScore` is null when there are no entries that day.
 */
export function buildSevenDayMoodTrend(
  rows: { mood: string; created_at: string }[],
): MoodTrendPoint[] {
  const now = new Date();
  const { y, m, day } = utcYmd(now);
  const points: MoodTrendPoint[] = [];

  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(Date.UTC(y, m, day - offset, 12, 0, 0, 0));
    const dayKey = d.toISOString().slice(0, 10);
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      d.getUTCDay()
    ];
    const dayLabel = `${weekday} ${d.getUTCDate()}`;

    const scores: number[] = [];
    for (const r of rows) {
      if (!r.created_at || !r.created_at.startsWith(dayKey)) continue;
      const s = scoreForMood(r.mood);
      if (s != null) scores.push(s);
    }

    const entryCount = scores.length;
    const avgScore =
      entryCount === 0
        ? null
        : Math.round(
            (scores.reduce((acc, n) => acc + n, 0) / entryCount) * 10,
          ) / 10;

    points.push({ dayKey, dayLabel, avgScore, entryCount });
  }

  return points;
}
