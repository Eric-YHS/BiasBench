import type { Model, ScoreRow } from "./utils";

export type TopModelEntry = {
  slug: string;
  name: string;
  totalScore1: number;
};

export function selectTopModels(models: Model[], scores: ScoreRow[], limit = 16): TopModelEntry[] {
  const modelMap = new Map(models.map(item => [item.slug, item]));
  return [...scores]
    .sort((a, b) => b.totalScore1 - a.totalScore1)
    .slice(0, Math.max(1, limit))
    .map(row => {
      const model = modelMap.get(row.slug);
      return model ? { slug: row.slug, name: model.name, totalScore1: row.totalScore1 } : null;
    })
    .filter((item): item is TopModelEntry => item !== null);
}
