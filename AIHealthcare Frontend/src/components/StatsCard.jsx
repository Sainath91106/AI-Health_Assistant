function StatsCard({ title, value, subtitle }) {
  return (
    <article className="rounded border border-slate-300 bg-white p-6 shadow-sm">
      <p className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</p>
      <p className="text-4xl font-serif text-slate-900">{value}</p>
      <p className="mt-3 font-serif italic text-sm text-slate-500 border-t border-slate-100 pt-3">{subtitle}</p>
    </article>
  );
}

export default StatsCard;
