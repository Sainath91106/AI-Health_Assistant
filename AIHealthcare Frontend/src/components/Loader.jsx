function Loader({ text = 'Loading...' }) {
  return (
    <div className="inline-flex items-center gap-3 text-sm text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-medicalBlue" />
      <span>{text}</span>
    </div>
  );
}

export default Loader;
