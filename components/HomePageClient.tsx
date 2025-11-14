"use client";

import { useEffect, useMemo, useState } from "react";
import LeaderboardTable from "@/components/LeaderboardTable";
import BiasCategoryTable from "@/components/BiasCategoryTable";
import type { BiasCategory, Model, ScoreRow } from "@/lib/utils";

type Dataset = {
  models: Model[];
  scores: ScoreRow[];
  biasCategories: BiasCategory[];
};

type HomePageClientProps = {
  initialData: Dataset;
};

function normalise(text: string) {
  return text.trim().toLowerCase();
}

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const [data, setData] = useState<Dataset>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const { models, scores, biasCategories } = data;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dataset", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as Dataset;
        if (!cancelled) {
          setData(payload);
        }
      } catch (error) {
        console.error("Failed to refresh dataset", error);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const query = useMemo(() => normalise(searchTerm), [searchTerm]);

  const filteredModels = useMemo(() => {
    if (!query) return models;
    return models.filter(model => {
      const haystack = [
        model.name,
        model.org,
        model.family,
        model.context,
        model.slug,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [models, query]);

  const filteredSlugs = useMemo(() => {
    if (!query) return null;
    return new Set(filteredModels.map(model => model.slug));
  }, [filteredModels, query]);

  const filteredScores = useMemo(() => {
    if (!query || !filteredSlugs) return scores;
    return scores.filter(row => filteredSlugs.has(row.slug));
  }, [scores, filteredSlugs, query]);

  const modelCount = models.length;
  const lastUpdatedTimestamp = scores.reduce((latest: number, item) => {
    const current = item?.updatedAt ? new Date(item.updatedAt).getTime() : NaN;
    return Number.isFinite(current) && current > latest ? current : latest;
  }, 0);

  const lastUpdatedDisplay = lastUpdatedTimestamp
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(lastUpdatedTimestamp))
    : null;

  return (
    <div className="container-narrow space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h1">LLM Bias Leaderboard</h1>
          <p className="text-sm text-slate-500">
            Covering {modelCount} models
            {lastUpdatedDisplay && <> - Data updated on {lastUpdatedDisplay}</>}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="whitespace-nowrap">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Model or provider"
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white min-w-[220px]"
              aria-label="Search models or providers"
            />
          </label>
        </div>
      </div>

      <LeaderboardTable models={filteredModels} scores={filteredScores} sortBy="totalScore1" />

      <section className="space-y-3">
        <h2 className="h2">Bias dimension leaderboards</h2>
        <p className="text-sm text-slate-500">
          Explore synthetic scores for each bias dimension alongside the main totals and model
          metadata.
        </p>
        <BiasCategoryTable categories={biasCategories} models={filteredModels} scores={filteredScores} />
      </section>
    </div>
  );
}
