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
  updatedAt: string;
};

export async function loadModels(): Promise<Model[]> {
  return readJsonFile<Model[]>("models.json");
}

export async function loadScores(): Promise<ScoreRow[]> {
  const rows = await readJsonFile<RawScoreRow[]>("scores.json");
  return rows.map(row => ({
    slug: row.slug,
    overall: Number(row.overall.toFixed(1)),
    social: Number(row.social.toFixed(1)),
    cultural: Number(row.cultural.toFixed(1)),
    political: Number(row.political.toFixed(1)),
    economic: Number(row.economic.toFixed(1)),
    updatedAt: row.updatedAt,
  }));
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
