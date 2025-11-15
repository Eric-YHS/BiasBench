import type { Model, ScoreRow } from "./utils";

export type TopModelEntry = {
  slug: string;
  name: string;
  overall: number;
};

export function selectTopModels(models: Model[], scores: ScoreRow[], limit = 16): TopModelEntry[] {
  const modelMap = new Map(models.map(item => [item.slug, item]));
  return [...scores]
    .sort((a, b) => b.overall - a.overall)
    .slice(0, Math.max(1, limit))
    .map(row => {
      const model = modelMap.get(row.slug);
      return model ? { slug: row.slug, name: model.name, overall: row.overall } : null;
    })
    .filter((item): item is TopModelEntry => item !== null);
}
