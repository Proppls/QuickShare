export default function ConnectionStatus({ status = 'waiting' }) {
  const statusConfig = {
    waiting: {
      color: 'bg-yellow-500',
      text: 'Waiting for peer',
    },
    connecting: {
      color: 'bg-blue-500',
      text: 'Connecting...',
    },
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
    },
    disconnected: {
      color: 'bg-red-500',
      text: 'Disconnected',
    },
    failed: {
      color: 'bg-red-500',
      text: 'Connection Failed',
    },
  };

  const current = statusConfig[status] || statusConfig.waiting;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-sm">
      <span
        className={`h-3 w-3 rounded-full ${current.color}`}
      />
      <span className="font-medium text-slate-700">
        {current.text}
      </span>
    </div>
  );
}
