export default function TeamPage() {
  return (
    <div className="container-narrow space-y-6">
      <header className="space-y-2">
        <h1 className="h1">Our team</h1>
        <p className="text-sm text-slate-500">
          A cross-disciplinary group advancing AI-assisted social-science research.
        </p>
      </header>
      <div className="card p-6 space-y-4 leading-7 text-slate-700">
        <p>
          AI is rapidly reshaping how scientists discover, prototype and validate new ideas. BiasBench
          lives within that shift, combining methodological rigour with fast iteration.
        </p>
        <p>
          Our core team includes researchers and engineers trained at institutions such as Harvard,
          MIT, Columbia University, Peking University, Tsinghua University, Sun Yat-sen University and
          Wuhan University. We cover machine learning, social science, statistics and human-computer
          interaction.
        </p>
        <p>
          Together we are building AITurk to give academics and practitioners a faster, more
          affordable way to run social-science studies while keeping transparency and data integrity
          centre.
        </p>
      </div>
    </div>
  );
}
