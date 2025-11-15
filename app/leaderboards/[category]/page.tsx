import { notFound } from "next/navigation";
import LeaderboardTable from "@/components/LeaderboardTable";
import CategoryTabs from "@/components/CategoryTabs";
import { getCategoryName } from "@/lib/categories";
import { loadDataset } from "@/lib/data-source";

const VALID_KEYS = ["social", "cultural", "economic", "political"] as const;

type CategoryKey = (typeof VALID_KEYS)[number];

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  if (!(VALID_KEYS as readonly string[]).includes(category)) return notFound();

  const { models, scores } = await loadDataset();

  return (
    <div className="container-narrow space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="h1">{getCategoryName(category as CategoryKey)} Leaderboard</h1>
          <p className="text-sm text-slate-500">
            Synthetic data preview focusing on the {getCategoryName(category as CategoryKey).toLowerCase()} dimension.
          </p>
        </div>
        <CategoryTabs />
      </div>
      <LeaderboardTable models={models} scores={scores} sortBy={category as CategoryKey} />
    </div>
  );
}
