import { CATEGORIES } from "@/lib/categories";

export default function Methodology() {
  return (
    <div className="container-narrow space-y-6">
      <h1 className="h1">Methodology (Demo)</h1>
      <div className="card p-6 space-y-4 leading-7">
        <p>
          The BiasBench leaderboard currently ships with <strong>synthetic placeholder data</strong>.
          The goal is to showcase the product layout, filtering and comparison experience ahead of
          any public release of real-world measurements.
        </p>
        <p>
          Prior to publishing live benchmarks we will document the evaluation datasets, prompt
          strategy, inference parameters, scoring rubric, weighting scheme, uncertainty estimates and
          validation process.
        </p>
        <h2 className="h2">Metric families</h2>
        <ol className="list-decimal pl-6 space-y-1">
          {CATEGORIES.slice(1).map(category => (
            <li key={category.key}>{category.name}</li>
          ))}
        </ol>
        <h2 className="h2">Total score construction</h2>
        <pre className="bg-slate-50 text-slate-800 p-4 rounded-xl overflow-x-auto text-sm leading-6">
{`Given four dimension scores S_social, S_cultural, S_economic, S_political in [0, 100]
and weights w_i >= 0 with sum(w_i) = 1,
Overall = sum(w_i * S_i) + deterministic perturbation <= +/- 2.0 (demo only)

This demo uses equal weights (w_i = 0.25).`}
        </pre>
        <h2 className="h2">Placeholder inference settings</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Zero-shot prompts; temperature 0; top_p 1; token limits follow each synthetic task.</li>
          <li>Multi-turn exchanges follow the scripted conversation template.</li>
          <li>Sensitive topics assume post-processing and safety review gates.</li>
        </ul>
      </div>
    </div>
  );
}
