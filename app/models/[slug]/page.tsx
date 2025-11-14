import Image from "next/image";
import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";
import ModelRadar from "@/components/ModelRadar";
import { loadDataset } from "@/lib/data-source";
import type { BiasCategory, ModelBiasDetail, ScoreRow } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

const ModelBiasBars = nextDynamic(() => import("@/components/ModelBiasBars"), { ssr: false });

const METRICS: { key: keyof ScoreRow; label: string }[] = [
  { key: "totalScore1", label: "Total Score 1" },
  { key: "totalScore2", label: "Total Score 2" },
  { key: "social", label: "Social" },
  { key: "cultural", label: "Cultural" },
  { key: "political", label: "Political" },
  { key: "economic", label: "Economic" },
  { key: "cognitive", label: "Cognitive" },
];

export const dynamic = "force-dynamic";

export default async function ModelPage({ params }: { params: { slug: string } }) {
  const { models, scores, subscores, biasCategories } = await loadDataset();
  const model = models.find(item => item.slug === params.slug);
  const row = scores.find(item => item.slug === params.slug);
  const detail = subscores.find(item => item.slug === params.slug) as ModelBiasDetail | undefined;

  if (!model || !row) {
    return notFound();
  }

  const radar = [
    { name: "Social", value: row.social },
    { name: "Cultural", value: row.cultural },
    { name: "Political", value: row.political },
    { name: "Economic", value: row.economic },
    { name: "Cognitive", value: row.cognitive },
  ];

  const metricCards = METRICS.map(metric => {
    const raw = row[metric.key];
    const value = typeof raw === "number" ? raw : 0;
    return { ...metric, value };
  });

  const featureList = [
    { label: "Family", value: model.family ?? "Not specified" },
    { label: "Parameters", value: typeof model.params_b === "number" ? `${model.params_b}B` : "Not specified" },
    { label: "Context length", value: model.context ?? "Not specified" },
  ];

  const lastUpdated = row.updatedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(row.updatedAt))
    : "Unknown";

  return (
    <div className="container-narrow space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          {model.logo ? (
            <Image
              src={model.logo}
              alt={`${model.name} logo`}
              width={64}
              height={64}
              className="h-14 w-14 rounded-xl object-contain bg-white"
            />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600">
              {model.name?.[0] ?? "?"}
            </div>
          )}
          <div>
            <h1 className="h1">{model.name}</h1>
            <p className="text-slate-600 text-sm md:text-base">
              {model.org} - Data updated on {lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {model.homepage && (
            <a href={model.homepage} target="_blank" rel="noopener noreferrer" className="link">
              Official site
            </a>
          )}
          {model.api && (
            <a href={model.api} target="_blank" rel="noopener noreferrer" className="link">
              API docs
            </a>
          )}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {metricCards.map(metric => (
          <div key={metric.key} className="card p-4 space-y-2">
            <div className="text-sm text-slate-500">{metric.label}</div>
            <div className="text-2xl font-semibold text-slate-900">{formatNumber(metric.value, 1)}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <ModelRadar scores={radar} />
        <div className="card p-6 space-y-3 text-sm">
          {featureList.map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium text-slate-900">{item.value}</span>
            </div>
          ))}
          <div className="pt-2 text-xs text-slate-500 leading-relaxed">
            All values are placeholders for design purposes only. Real deployments will include the
            associated experimental provenance and uncertainty estimates.
          </div>
        </div>
      </section>

      {detail ? (
        <section className="space-y-4">
          <h2 className="h2">Bias breakdown</h2>
          <p className="text-sm text-slate-500">
            Synthetic sub-dimension scores illustrate how the model performs across each bias block.
          </p>
          <ModelBiasBars categories={biasCategories as BiasCategory[]} detail={detail.categories} />
        </section>
      ) : (
        <section className="card p-6 text-sm text-slate-500">
          No sub-dimension data is available for this model.
        </section>
      )}
    </div>
  );
}
