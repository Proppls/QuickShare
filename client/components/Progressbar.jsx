export default function ProgressBar({ progress = 0 }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
        <span>Progress</span>
        <span>{safeProgress.toFixed(0)}%</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
