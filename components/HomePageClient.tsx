"use client";

import { useEffect, useMemo, useState } from "react";
import LeaderboardTable from "@/components/LeaderboardTable";
import MajorTypeTable from "@/components/MajorTypeTable";
import type { BiasCategory, BiasCategoryKey, Model, ModelBiasDetail, ScoreRow } from "@/lib/utils";

/** 首页四个主维度的展示顺序（模块级常量，避免每次渲染产生新引用）。 */
const MAJOR_ORDER: BiasCategoryKey[] = ["social", "cultural", "economic", "political"];

type Dataset = {
  models: Model[];
  scores: ScoreRow[];
  subscores: ModelBiasDetail[];
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
  const { models, scores, subscores, biasCategories } = data;

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

  const filteredSubscores = useMemo(() => {
    if (!query || !filteredSlugs) return subscores;
    return subscores.filter(row => filteredSlugs.has(row.slug));
  }, [subscores, filteredSlugs, query]);

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

  const orderedCategories = useMemo(() => {
    const lookup = new Map(biasCategories.map(category => [category.key, category]));
    return MAJOR_ORDER.map(key => lookup.get(key)).filter(
      (category): category is BiasCategory => Boolean(category)
    );
  }, [biasCategories]);

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

      <LeaderboardTable models={filteredModels} scores={filteredScores} sortBy="overall" />

      <section className="space-y-4">
        <div>
          <h2 className="h2">Primary bias leaderboards</h2>
          <p className="text-sm text-slate-500">
            Each table highlights all secondary bias types under its primary dimension, keeping the
            official BiasBench ordering and showing total scores on the right.
          </p>
        </div>
        <div className="space-y-10">
          {orderedCategories.map(category => (
            <MajorTypeTable
              key={category.key}
              category={category}
              models={filteredModels}
              scores={filteredScores}
              subscores={filteredSubscores}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
