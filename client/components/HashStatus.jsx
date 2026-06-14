export default function HashStatus({ verified = null }) {
  if (verified === null) {
    return (
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-slate-600">Waiting for verification...</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        verified
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <p
        className={`font-semibold ${
          verified ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {verified
          ? '✓ File Verified'
          : '✗ Verification Failed'}
      </p>
    </div>
  );
}
