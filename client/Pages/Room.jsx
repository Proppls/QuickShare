import { useState } from 'react';
import { useParams } from 'react-router-dom';

import ConnectionStatus from '../components/ConnectionStatus';
import ProgressBar from '../components/ProgressBar';
import TransferStats from '../components/TransferStats';
import HashStatus from '../components/HashStatus';

export default function Room() {
  const { roomId } = useParams();

  const [status] = useState('waiting');
  const [progress] = useState(0);
  const [transferred] = useState(0);
  const [total] = useState(0);
  const [speed] = useState(0);
  const [eta] = useState(0);
  const [verified] = useState(null);
  const [downloadUrl] = useState(null);
  const [fileName] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 text-4xl font-bold text-slate-900">
          QuickShare
        </h1>

        <p className="mb-8 text-slate-600">
          Room ID: <span className="font-semibold">{roomId}</span>
        </p>

        <div className="space-y-6">
          <ConnectionStatus status={status} />

          <ProgressBar progress={progress} />

          <TransferStats
            transferred={transferred}
            total={total}
            speed={speed}
            eta={eta}
          />

          <HashStatus verified={verified} />

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={fileName}
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Download File
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
