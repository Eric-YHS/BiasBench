import nextDynamic from "next/dynamic";
import BattleHeatmap from "@/components/BattleHeatmap";
import { loadDataset } from "@/lib/data-source";
import { selectTopModels } from "@/lib/topModels";

const EloConfidenceChart = nextDynamic(() => import("@/components/EloConfidenceChart"), { ssr: false });

export const dynamic = "force-dynamic";

export default async function ArenaPage() {
  const { models, scores } = await loadDataset();
  const topEntries = selectTopModels(models, scores, 16);

  return (
    <div className="container-narrow space-y-8">
      <header className="space-y-2">
        <h1 className="h1">Arena preview (demo)</h1>
        <p className="text-sm text-slate-600">
          Synthetic visualisations that hint at the future arena experience with pairwise win rates
          and rating confidence bands.
        </p>
      </header>

      <div className="space-y-6">
        <div className="card p-6">
          <BattleHeatmap entries={topEntries} />
        </div>
        <div className="card p-6">
          <EloConfidenceChart entries={topEntries} />
        </div>
      </div>

      <section className="card p-6 text-sm text-slate-600 space-y-2">
        <h2 className="text-base font-semibold text-slate-800">Roadmap notes</h2>
        <p>
          The production version will ingest real battle data, allow custom opponent selection and
          surface trend analytics to help researchers compare models with confidence.
        </p>
      </section>
    </div>
  );
}
