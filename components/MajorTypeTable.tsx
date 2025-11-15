"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import ScoreBadge from "./ScoreBadge";
import type { BiasCategory, BiasCategoryKey, Model, ModelBiasDetail, ScoreRow } from "@/lib/utils";

type DimensionKey = Extract<keyof ScoreRow, BiasCategoryKey>;

type SortKey = "overall" | "major" | string;

const DEFAULT_LIMIT = 30;

function ModelNameCell({ model, href }: { model: Model; href: string }) {
  const initials = model.name?.[0] ?? "?";
  const avatar = model.logo ? (
    <Image
      src={model.logo}
      alt={`${model.name} logo`}
      width={28}
      height={28}
      className="h-7 w-7 rounded-md object-contain bg-white"
    />
  ) : (
    <div className="h-7 w-7 rounded-md bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
      {initials}
    </div>
  );
  const linkHref = href as Route;

  return (
    <Link href={linkHref} className="flex items-center gap-2">
      {avatar}
      <span className="link font-medium">{model.name}</span>
    </Link>
  );
}

export default function MajorTypeTable({
  category,
  models,
  scores,
  subscores,
}: {
  category: BiasCategory;
  models: Model[];
  scores: ScoreRow[];
  subscores: ModelBiasDetail[];
}) {
  const [sortState, setSortState] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "major",
    direction: "desc",
  });
  const [expanded, setExpanded] = useState(false);

  const scoreMap = useMemo(() => new Map(scores.map(row => [row.slug, row])), [scores]);
  const subscoresMap = useMemo(() => new Map(subscores.map(row => [row.slug, row.categories])), [subscores]);

  type TableRow = {
    slug: string;
    model: Model;
    provider: string;
    majorScore: number;
    overall: number;
    biasScores: Record<string, number>;
  };

  const rows = useMemo(() => {
    return models
      .map(model => {
        const score = scoreMap.get(model.slug);
        if (!score) return null;
        const detail = subscoresMap.get(model.slug)?.[category.key] ?? {};
        const biasScores: Record<string, number> = {};
        category.biases.forEach(bias => {
          biasScores[bias.key] = detail?.[bias.key] ?? 0;
        });
        const dimensionKey = category.key as DimensionKey;
        return {
          slug: model.slug,
          model,
          provider: model.org ?? "Unknown",
          majorScore: score[dimensionKey],
          overall: score.overall,
          biasScores,
        };
      })
      .filter((entry): entry is TableRow => Boolean(entry));
  }, [models, category, scoreMap, subscoresMap]);

  const sortedRows = useMemo(() => {
    const multiplier = sortState.direction === "desc" ? -1 : 1;
    const key = sortState.key;
    return [...rows].sort((a, b) => {
      const value = (row: TableRow) => {
        if (key === "overall") return row.overall;
        if (key === "major") return row.majorScore;
        return row.biasScores[key] ?? 0;
      };
      const diff = value(a) - value(b);
      if (diff === 0) {
        return a.model.name.localeCompare(b.model.name);
      }
      return diff * multiplier;
    });
  }, [rows, sortState]);

  const visibleRows = expanded ? sortedRows : sortedRows.slice(0, DEFAULT_LIMIT);
  const showToggle = sortedRows.length > DEFAULT_LIMIT;

  const handleSort = (key: SortKey) => {
    setSortState(current =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
  };

  const renderHeaderCell = (key: SortKey, label: string) => {
    const isActive = sortState.key === key;
    const indicator = isActive ? ` (${sortState.direction})` : "";
    return (
      <th
        key={key}
        className="cursor-pointer select-none"
        onClick={() => handleSort(key)}
        title={`Sort by ${label}`}
      >
        {label}
        {indicator}
      </th>
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">{category.category}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="leaderboard">
          <thead>
            <tr>
              <th className="w-14">Rank</th>
              <th>Model</th>
              <th>Provider</th>
              {category.biases.map(bias => renderHeaderCell(bias.key, bias.name))}
              {renderHeaderCell("major", `${category.category} Score`)}
              {renderHeaderCell("overall", "Overall")}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={`${category.key}-${row.slug}`}>
                <td>{index + 1}</td>
                <td className="min-w-[220px]">
                  <ModelNameCell model={row.model} href={`/models/${row.slug}`} />
                </td>
                <td className="min-w-[160px] text-sm text-slate-600">{row.provider}</td>
                {category.biases.map(bias => (
                  <td key={`${row.slug}-${bias.key}`}>{row.biasScores[bias.key]?.toFixed(1) ?? "0.0"}</td>
                ))}
                <td>
                  <ScoreBadge score={row.majorScore} />
                </td>
                <td>
                  <ScoreBadge score={row.overall} />
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={category.biases.length + 5} className="py-6 text-center text-sm text-slate-500">
                  No models match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showToggle && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <button
            type="button"
            className="link text-sm"
            onClick={() => setExpanded(current => !current)}
          >
            {expanded ? "Collapse" : "View more"}
          </button>
        </div>
      )}
    </div>
  );
}
