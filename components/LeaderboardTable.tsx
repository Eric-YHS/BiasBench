"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import ScoreBadge from "./ScoreBadge";
import type { Model, ScoreRow } from "@/lib/utils";

type SortKey = "overall" | "social" | "cultural" | "economic" | "political";

const NUMERIC_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "social", label: "Social" },
  { key: "cultural", label: "Cultural" },
  { key: "economic", label: "Economic" },
  { key: "political", label: "Political" },
  { key: "overall", label: "Overall" },
];

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

function resolveSortKey(sortBy?: SortKey): SortKey {
  return NUMERIC_COLUMNS.some(column => column.key === sortBy)
    ? (sortBy as SortKey)
    : "overall";
}

export default function LeaderboardTable({
  models,
  scores,
  sortBy = "overall",
  limit = DEFAULT_LIMIT,
}: {
  models: Model[];
  scores: ScoreRow[];
  sortBy?: SortKey;
  limit?: number;
}) {
  const [sortState, setSortState] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: resolveSortKey(sortBy),
    direction: "desc",
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setSortState({ key: resolveSortKey(sortBy), direction: "desc" });
  }, [sortBy]);

  useEffect(() => {
    setExpanded(false);
  }, [models, scores]);

  const rows = useMemo(() => {
    const map = new Map(models.map(model => [model.slug, model]));
    const mapped = scores
      .map(score => {
        const model = map.get(score.slug);
        return model ? { ...score, model } : null;
      })
      .filter((entry): entry is ScoreRow & { model: Model } => entry !== null);

    const { key, direction } = sortState;
    const multiplier = direction === "desc" ? -1 : 1;

    return mapped.sort((a, b) => {
      const diff = (a[key] as number) - (b[key] as number);
      if (diff === 0) {
        return a.model.name.localeCompare(b.model.name);
      }
      return diff * multiplier;
    });
  }, [models, scores, sortState]);

  const visibleRows = expanded ? rows : rows.slice(0, limit);
  const showToggle = rows.length > limit;

  const handleSort = (key: SortKey) => {
    setSortState(current =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
  };

  const renderHeaderCell = (column: { key: SortKey; label: string }) => {
    const isActive = sortState.key === column.key;
    const indicator = isActive ? ` (${sortState.direction})` : "";
    return (
      <th
        key={column.key}
        className="cursor-pointer select-none"
        onClick={() => handleSort(column.key)}
        title={`Sort by ${column.label}`}
      >
        {column.label}
        {indicator}
      </th>
    );
  };

  return (
    <div className="card overflow-hidden">
      <table className="leaderboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Model</th>
            <th>Provider</th>
            {NUMERIC_COLUMNS.map(renderHeaderCell)}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, index) => (
            <tr key={row.slug}>
              <td className="w-12">{index + 1}</td>
              <td className="min-w-[220px]">
                <ModelNameCell model={row.model} href={`/models/${row.slug}`} />
              </td>
              <td className="min-w-[160px] text-sm text-slate-600">{row.model.org ?? "Unknown"}</td>
              <td>{row.social.toFixed(1)}</td>
              <td>{row.cultural.toFixed(1)}</td>
              <td>{row.economic.toFixed(1)}</td>
              <td>{row.political.toFixed(1)}</td>
              <td>
                <ScoreBadge score={row.overall} />
              </td>
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={NUMERIC_COLUMNS.length + 3} className="py-6 text-center text-sm text-slate-500">
                No models match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
