export const CATEGORIES = [
  { key: "overall", name: "Overall" },
  { key: "social", name: "Social" },
  { key: "cultural", name: "Cultural" },
  { key: "economic", name: "Economic" },
  { key: "political", name: "Political" },
] as const;

export type CategoryKey = typeof CATEGORIES[number]["key"];

export function getCategoryName(key: string) {
  const match = CATEGORIES.find(category => category.key === key);
  return match?.name ?? key;
}
