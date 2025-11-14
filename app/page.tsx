import HomePageClient from "@/components/HomePageClient";
import { loadDataset } from "@/lib/data-source";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dataset = await loadDataset();
  return <HomePageClient initialData={dataset} />;
}
