"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import type { BiasCategory, BiasCategoryKey, ModelBiasDetail } from "@/lib/utils";

export default function ModelBiasBars({
  categories,
  detail,
}: {
  categories: BiasCategory[];
  detail: ModelBiasDetail["categories"];
}) {
  const [selected, setSelected] = useState<BiasCategoryKey>(categories[0]?.key ?? "social");

  const data = useMemo(() => {
    const target = categories.find(item => item.key === selected);
    if (!target) return [] as { name: string; score: number }[];
    return target.biases.map(bias => ({
      name: bias.name,
      score: detail[selected]?.[bias.key] ?? 0,
    }));
  }, [categories, detail, selected]);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.key}
            type="button"
            className={`px-3 py-1.5 rounded-full border text-sm ${
              category.key === selected
                ? "bg-brand-700 text-white border-brand-700"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
            }`}
            onClick={() => setSelected(category.key as BiasCategoryKey)}
          >
            {category.category}
          </button>
        ))}
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number, _name, payload) => {
                const entry = payload?.payload as { name: string; score: number } | undefined;
                if (!entry) return value;
                return [`${value.toFixed(1)}`, entry.name];
              }}
            />
            <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
