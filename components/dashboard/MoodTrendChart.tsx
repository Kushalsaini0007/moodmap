"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MoodTrendPoint } from "@/lib/mood-trends";

type ChartRow = {
  dayLabel: string;
  avgScore: number | null;
  entryCount: number;
  /** Recharts skips gaps when this is nullish */
  score: number | null;
};

function describeBand(score: number): string {
  if (score <= 1.5) return "Lower (sad)";
  if (score <= 2.5) return "Stressed (anxious)";
  if (score <= 3.5) return "Steady (neutral)";
  if (score <= 4.5) return "On a roll (productive)";
  return "Bright (happy)";
}

type MoodTrendChartProps = {
  data: MoodTrendPoint[];
};

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  const chartData: ChartRow[] = data.map((d) => ({
    dayLabel: d.dayLabel,
    avgScore: d.avgScore,
    entryCount: d.entryCount,
    score: d.avgScore,
  }));

  const hasAny = chartData.some((d) => d.entryCount > 0);

  return (
    <section
      className="rounded-3xl border border-indigo-100/90 bg-white/80 p-6 shadow-lg shadow-indigo-100/25 backdrop-blur-sm md:p-8"
      aria-labelledby="mood-trend-heading"
    >
      <h2
        id="mood-trend-heading"
        className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl"
      >
        Mood trend · last 7 days
      </h2>
      <p className="mt-1 text-sm text-slate-600 md:text-base">
        Average mood score per UTC day (1 = sad … 5 = happy). Multiple entries
        on the same day are averaged.
      </p>

      {!hasAny ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm text-slate-600">
          Save a few entries this week to see your line chart here.
        </p>
      ) : (
        <div className="mt-6 h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 12, left: -8, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-200"
                vertical={false}
              />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                width={28}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip
                cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as ChartRow;
                  if (row.avgScore == null) {
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-medium text-slate-800">{row.dayLabel}</p>
                        <p className="text-slate-500">No entries</p>
                      </div>
                    );
                  }
                  return (
                    <div className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-slate-800">{row.dayLabel}</p>
                      <p className="mt-1 text-indigo-700">
                        Avg score:{" "}
                        <span className="font-mono font-bold">{row.avgScore}</span>
                      </p>
                      <p className="text-slate-500">{describeBand(row.avgScore)}</p>
                      <p className="mt-1 text-slate-500">
                        {row.entryCount}{" "}
                        {row.entryCount === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Avg mood"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
