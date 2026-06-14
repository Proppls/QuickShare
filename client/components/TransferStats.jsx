import { formatBytes } from '../utils/formatBytes';

export default function TransferStats({
  transferred = 0,
  total = 0,
  speed = 0,
  eta = 0,
}) {
  const formatETA = (seconds) => {
    if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) {
      return '--';
    }

    if (seconds < 60) {
      return `${Math.ceil(seconds)} sec`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);

    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm text-slate-500">Transferred</p>
        <p className="font-semibold text-slate-800">
          {formatBytes(transferred)} / {formatBytes(total)}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Speed</p>
        <p className="font-semibold text-slate-800">
          {formatBytes(speed)}/s
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Remaining</p>
        <p className="font-semibold text-slate-800">
          {formatETA(eta)}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Progress</p>
        <p className="font-semibold text-slate-800">
          {total > 0
            ? `${((transferred / total) * 100).toFixed(1)}%`
            : '0%'}
        </p>
      </div>
    </div>
  );
}
