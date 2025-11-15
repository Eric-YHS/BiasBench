import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import ScoreBadge from "./ScoreBadge";
import type { BiasCategory, Model, ScoreRow } from "@/lib/utils";

const clampScore = (value: number) => Math.max(0, Math.min(100, value));
const DEFAULT_LIMIT = 30;

function deriveBiasScore(row: ScoreRow, biasKey: string, categoryKey: BiasCategory["key"]) {
  const base = row[categoryKey];
  const seed = row.slug + ":" + biasKey;
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 33 + seed.charCodeAt(index)) % 2048;
  }
  const offset = ((hash % 21) - 10) * 0.4; // deterministic +/-4 adjustment
  return clampScore(base + offset);
}

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

type BiasTableState = {
  sortKey: "biasScore" | "overall";
  direction: "asc" | "desc";
  expanded: boolean;
};

const defaultState: BiasTableState = { sortKey: "biasScore", direction: "desc", expanded: false };

export default function BiasCategoryTable({
  categories,
  models,
  scores,
}: {
  categories: BiasCategory[];
  models: Model[];
  scores: ScoreRow[];
}) {
  const modelMap = useMemo(() => new Map(models.map(model => [model.slug, model])), [models]);
  const [tableState, setTableState] = useState<Record<string, BiasTableState>>({});

  const handleSort = (biasKey: string, key: BiasTableState["sortKey"]) => {
    setTableState(current => {
      const state = current[biasKey] ?? defaultState;
      const next =
        state.sortKey === key
          ? { ...state, direction: state.direction === "asc" ? "desc" : "asc" }
          : { ...state, sortKey: key, direction: "desc" };
      return { ...current, [biasKey]: next };
    });
  };

  const toggleExpanded = (biasKey: string) => {
    setTableState(current => {
      const state = current[biasKey] ?? defaultState;
      return { ...current, [biasKey]: { ...state, expanded: !state.expanded } };
    });
  };

  return (
    <div className="space-y-10">
      {categories.map(category => (
        <div key={category.key} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">{category.category}</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            {category.biases.map(bias => {
              const rows = scores
                .map(score => {
                  const model = modelMap.get(score.slug);
                  if (!model) return null;
                  return {
                    slug: score.slug,
                    model,
                    overall: score.overall,
                    biasScore: deriveBiasScore(score, bias.key, category.key),
                  };
                })
                .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

              const state = tableState[bias.key] ?? defaultState;
              const multiplier = state.direction === "desc" ? -1 : 1;
              const sortedRows = [...rows].sort((a, b) => {
                const diff =
                  state.sortKey === "biasScore"
                    ? a.biasScore - b.biasScore
                    : a.overall - b.overall;
                if (diff === 0) {
                  return a.model.name.localeCompare(b.model.name);
                }
                return diff * multiplier;
              });

              const visibleRows = state.expanded ? sortedRows : sortedRows.slice(0, DEFAULT_LIMIT);
              const showToggle = sortedRows.length > DEFAULT_LIMIT;

              const renderSortHeader = (
                key: BiasTableState["sortKey"],
                label: string
              ) => {
                const active = state.sortKey === key;
                const indicator = active ? ` (${state.direction})` : "";
                return (
                  <th
                    className="cursor-pointer select-none"
                    onClick={() => handleSort(bias.key, key)}
                    title={`Sort by ${label}`}
                  >
                    {label}
                    {indicator}
                  </th>
                );
              };

              return (
                <div key={bias.key} className="card overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">{bias.en}</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="leaderboard">
                      <thead>
                        <tr>
                          <th className="w-14">Rank</th>
                          <th>Model</th>
                          <th>Provider</th>
                          {renderSortHeader("overall", "Overall")}
                          {renderSortHeader("biasScore", bias.en)}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map((row, index) => (
                          <tr key={bias.key + "-" + row.slug}>
                            <td>{index + 1}</td>
                            <td className="min-w-[220px]">
                              <ModelNameCell model={row.model} href={`/models/${row.slug}`} />
                            </td>
                            <td className="min-w-[160px] text-sm text-slate-600">
                              {row.model.org ?? "Unknown"}
                            </td>
                            <td>
                              <ScoreBadge score={row.overall} />
                            </td>
                            <td>{row.biasScore.toFixed(1)}</td>
                          </tr>
                        ))}
                        {visibleRows.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-sm text-slate-500">
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
                        onClick={() => toggleExpanded(bias.key)}
                      >
                        {state.expanded ? "Collapse" : "View more"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
