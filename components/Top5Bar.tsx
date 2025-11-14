"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Top5Bar({ data }: { data: { name: string; totalScore1: number }[] }) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="totalScore1" fill="#0f766e" name="Total Score 1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
