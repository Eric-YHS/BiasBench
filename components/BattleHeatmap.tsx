"use client";

import { useMemo } from "react";
import type { TopModelEntry } from "@/lib/topModels";

const cold = [185, 28, 28];
const neutral = [254, 243, 199];
const warm = [15, 118, 110];

function interpolateChannel(start: number, end: number, ratio: number) {
  return Math.round(start + (end - start) * ratio);
}

function interpolateColor(a: number[], b: number[], ratio: number) {
  return `rgb(${interpolateChannel(a[0], b[0], ratio)}, ${interpolateChannel(a[1], b[1], ratio)}, ${interpolateChannel(a[2], b[2], ratio)})`;
}

function valueToColor(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  if (clamped <= 0.5) {
    const ratio = clamped / 0.5;
    return interpolateColor(cold, neutral, ratio);
  }
  const ratio = (clamped - 0.5) / 0.5;
  return interpolateColor(neutral, warm, ratio);
}

function buildMatrix(entries: TopModelEntry[]) {
  return entries.map((_, rowIndex) =>
    entries.map((__, colIndex) => {
      if (rowIndex === colIndex) return 0.5;
      const rankingGap = Math.abs(rowIndex - colIndex);
      const base = 0.72 - rankingGap * 0.015;
      const seed = `${entries[rowIndex].slug}|${entries[colIndex].slug}`;
      let hash = 0;
      for (let index = 0; index < seed.length; index++) {
        hash = (hash * 31 + seed.charCodeAt(index)) % 997;
      }
      const noise = (hash % 100) / 500 - 0.1;
      return Math.max(0.15, Math.min(0.9, base + noise));
    })
  );
}

export default function BattleHeatmap({ entries }: { entries: TopModelEntry[] }) {
  const matrix = useMemo(() => buildMatrix(entries), [entries]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-800">Match-up win rate heatmap</h3>
        <p className="text-sm text-slate-500">
          Synthetic data showing the probability that model A wins a head-to-head match against model
          B (draws removed).
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>0</span>
        <div className="flex-1 h-3 rounded-full overflow-hidden bg-slate-200">
          <div className="heatmap-gradient" />
        </div>
        <span>1</span>
      </div>
      <div className="overflow-x-auto">
        <table className="heatmap-table min-w-[800px]">
          <thead>
            <tr>
              <th>Model A / Model B</th>
              {entries.map(model => (
                <th key={`col-${model.slug}`} className="whitespace-nowrap">
                  {model.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((rowModel, rowIndex) => (
              <tr key={`row-${rowModel.slug}`}>
                <th className="whitespace-nowrap">{rowModel.name}</th>
                {entries.map((colModel, colIndex) => {
                  if (rowIndex === colIndex) {
                    return (
                      <td key={`${rowModel.slug}-${colModel.slug}`} className="bg-slate-100 text-slate-400">
                        -
                      </td>
                    );
                  }
                  const value = matrix[rowIndex][colIndex];
                  return (
                    <td key={`${rowModel.slug}-${colModel.slug}`} style={{ backgroundColor: valueToColor(value) }}>
                      {value.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
