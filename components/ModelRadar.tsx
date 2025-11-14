"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function ModelRadar({
  scores,
}: {
  scores: { name: string; value: number }[];
}) {
  return (
    <div className="card p-4 h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="70%" data={scores}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={45} domain={[0, 100]} />
          <Tooltip />
          <Radar name="Bias score" dataKey="value" stroke="#0f766e" fill="#2dd4bf" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
