export type BiasCategoryKey = "social" | "cultural" | "political" | "economic" | "cognitive";

export function formatNumber(n: number, digits = 0) {
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

export type Model = {
  slug: string;
  name: string;
  org: string;
  family?: string;
  params_b?: number;
  context?: string;
  homepage?: string;
  api?: string;
  logo?: string;
};

export type ScoreRow = {
  slug: string;
  totalScore1: number;
  totalScore2: number;
  social: number;
  cultural: number;
  political: number;
  economic: number;
  cognitive: number;
  updatedAt: string;
  overall?: number;
};

export type BiasCategory = {
  key: BiasCategoryKey;
  category: string;
  biases: { key: string; name: string; en: string }[];
};

export type ModelBiasDetail = {
  slug: string;
  categories: Record<BiasCategoryKey, Record<string, number>>;
};

export type ModelScores = ScoreRow & { name: string; org: string };
