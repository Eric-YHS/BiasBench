export const CATEGORIES = [
  { key: "totalScore1", name: "Total Score 1" },
  { key: "social", name: "Social" },
  { key: "cultural", name: "Cultural" },
  { key: "political", name: "Political" },
  { key: "economic", name: "Economic" },
  { key: "cognitive", name: "Cognitive" },
] as const;

export type CategoryKey = typeof CATEGORIES[number]["key"];

export function getCategoryName(key: string) {
  const match = CATEGORIES.find(category => category.key === key);
  return match?.name ?? key;
}
