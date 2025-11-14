export default function ScoreBadge({ score }: { score: number }){
  const color =
    score >= 80 ? "bg-green-100 text-green-800 border-green-300" :
    score >= 60 ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
    score >= 40 ? "bg-orange-100 text-orange-800 border-orange-300" :
    "bg-red-100 text-red-800 border-red-300";
  return <span className={`badge ${color}`}>{score.toFixed(1)}</span>;
}
