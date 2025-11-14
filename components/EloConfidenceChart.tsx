"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  ErrorBar,
} from "recharts";
import type { TopModelEntry } from "@/lib/topModels";

function buildChartData(entries: TopModelEntry[]) {
  return entries.map((entry, index) => {
    const base = 1560 - index * 12;
    let hash = 0;
    for (let i = 0; i < entry.slug.length; i++) {
      hash = (hash * 31 + entry.slug.charCodeAt(i)) % 997;
    }
    const noise = (hash % 30) - 15;
    const rating = base + noise;
    const spread = 20 + (hash % 10);
    const lower = Math.round(rating - spread);
    const upper = Math.round(rating + spread);
    return {
      name: entry.name,
      rating: Math.round(rating),
      lower,
      upper,
      error: [rating - lower, upper - rating] as [number, number],
    };
  });
}

export default function EloConfidenceChart({ entries }: { entries: TopModelEntry[] }) {
  const data = useMemo(() => buildChartData(entries), [entries]);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Elo rating and bootstrap interval</h3>
        <p className="text-sm text-slate-500">
          Synthetic data preview of Elo ratings and their 95% bootstrap confidence intervals for the
          highlighted models.
        </p>
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 24, left: 12, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: "Elo", angle: -90, position: "insideLeft", offset: 10 }} />
            <Tooltip
              formatter={(value: number, _name, payload) => {
                const entry = payload?.payload;
                if (!entry) return value;
                return `${value} (interval: ${entry.lower}-${entry.upper})`;
              }}
              labelFormatter={label => `Model: ${label}`}
            />
            <Scatter dataKey="rating" fill="#2563eb" shape="circle">
              <ErrorBar dataKey="error" width={8} strokeWidth={2} stroke="#2563eb" direction="y" />
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
