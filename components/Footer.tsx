export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container-narrow py-8 text-sm text-slate-600 space-y-2">
        <div>{`Copyright ${new Date().getFullYear()} BiasBench (Demo)`}</div>
        <p className="max-w-3xl">
          Disclaimer: all rankings and scores shown here are synthetic and exist solely to
          illustrate the product layout. They should not be interpreted as real bias measurements or
          endorsements.
        </p>
      </div>
    </footer>
  );
}
