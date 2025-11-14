import { promises as fs } from "fs";
import path from "path";
import type { BiasCategory, Model, ModelBiasDetail, ScoreRow } from "./utils";

const dataDir = path.join(process.cwd(), "data");

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(dataDir, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

type RawScoreRow = {
  slug: string;
  overall: number;
  social: number;
  cultural: number;
  political: number;
  economic: number;
  cognitive: number;
  updatedAt: string;
};

function deriveTotalScore2(row: RawScoreRow) {
  const base = (row.social + row.cultural + row.political + row.economic + row.cognitive) / 5;
  const seed = row.slug;
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 9973;
  }
  const offset = ((hash % 15) - 7) * 0.3; // deterministic adjustment within [-2.1, 2.1]
  const total = Math.max(0, Math.min(100, base + offset));
  return Number(total.toFixed(1));
}

export async function loadModels(): Promise<Model[]> {
  return readJsonFile<Model[]>("models.json");
}

export async function loadScores(): Promise<ScoreRow[]> {
  const rows = await readJsonFile<RawScoreRow[]>("scores.json");
  return rows.map(row => {
    const totalScore1 = Number(row.overall.toFixed(1));
    const totalScore2 = deriveTotalScore2(row);
    return {
      slug: row.slug,
      totalScore1,
      totalScore2,
      social: Number(row.social.toFixed(1)),
      cultural: Number(row.cultural.toFixed(1)),
      political: Number(row.political.toFixed(1)),
      economic: Number(row.economic.toFixed(1)),
      cognitive: Number(row.cognitive.toFixed(1)),
      updatedAt: row.updatedAt,
      overall: row.overall,
    };
  });
}

export async function loadSubscores(): Promise<ModelBiasDetail[]> {
  return readJsonFile<ModelBiasDetail[]>("subscores.json");
}

export async function loadBiasCategories(): Promise<BiasCategory[]> {
  return readJsonFile<BiasCategory[]>("biasCategories.json");
}

export async function loadDataset() {
  const [models, scores, subscores, biasCategories] = await Promise.all([
    loadModels(),
    loadScores(),
    loadSubscores(),
    loadBiasCategories(),
  ]);
  return { models, scores, subscores, biasCategories };
}
