function UploadProgressBar({ progress = 0 }) {
  return (
    <div className="rounded-card border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium text-slate-700">Uploading prescription...</p>
        <p className="font-semibold text-medicalBlue">{progress}%</p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-medicalBlue transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default UploadProgressBar;
