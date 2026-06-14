export default function RoomLink({ roomId, inviteLink }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  if (!roomId || !inviteLink) return null;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm text-slate-500">Room ID</p>
        <p className="font-semibold text-slate-800">{roomId}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-500">Invite Link</p>
        <p className="break-all text-sm text-slate-700">
          {inviteLink}
        </p>
      </div>

      <button
        onClick={copyToClipboard}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        Copy Link
      </button>
    </div>
  );
}
