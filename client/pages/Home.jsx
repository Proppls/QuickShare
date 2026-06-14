import { useState, useRef } from 'react';

import FileDropzone from '../components/FileDropZone';
import RoomLink from '../components/RoomLink';
import ConnectionStatus from '../components/ConnectionStatus';
import ProgressBar from '../components/Progressbar';
import TransferStats from '../components/TransferStats';

import { createRoom, onPeerJoined, onIceCandidate, onAnswer, sendOffer, sendIceCandidate } from '../services/socket';
import { createPeerConnection, createDataChannel, onIceCandidate as setPeerIceHandler, onConnectionStateChange } from '../services/peer';
import { sendFile } from '../services/FileTransfer';
import { generateRoomLink } from '../utils/generateRoomLink';

import { fetchIceServers, createPeerConnection, createDataChannel, onIceCandidate as setPeerIceHandler, onConnectionStateChange } from '../services/peer';
await fetchIceServers();

export default function Home() {
  const [file, setFile] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [transferStats, setTransferStats] = useState({ transferred: 0, total: 0, speed: 0, eta: 0 });
  const [transferDone, setTransferDone] = useState(false);
  const [error, setError] = useState('');

  const roomIdRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleCreateRoom = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    try {
      setStatus('waiting');
      const data = await createRoom();
      const id = data.roomId;

      setRoomId(id);
      roomIdRef.current = id;
      setInviteLink(generateRoomLink(id));

      onPeerJoined(async () => {
        setStatus('connecting');

        const pc = createPeerConnection();
        const dc = createDataChannel('file-transfer');

        setPeerIceHandler((candidate) => {
          sendIceCandidate(roomIdRef.current, candidate);
        });

        onConnectionStateChange((state) => {
          setStatus(state);

          if (state === 'connected') {
            dc.onopen = async () => {
              await sendFile(file, dc, (stats) => {
                setProgress(stats.progress);
                setTransferStats({
                  transferred: stats.transferred,
                  total: stats.total,
                  speed: stats.speed,
                  eta: stats.eta,
                });
              });
              setTransferDone(true);
              setStatus('completed');
            };
          }
        });

        onAnswer(async (answer) => {
          const { setRemoteAnswer } = await import('../services/peer');
          await setRemoteAnswer(answer);
        });

        onIceCandidate(async (candidate) => {
          const { addIceCandidate } = await import('../services/peer');
          await addIceCandidate(candidate);
        });

        const { createOffer } = await import('../services/peer');
        const offer = await createOffer();
        sendOffer(roomIdRef.current, offer);
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create room. Please try again.');
      setStatus('idle');
    }
  };

  const isTransferring = status === 'transferring' || (status === 'connected' && progress > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">⚡ QuickShare</h1>
          <p className="mt-2 text-slate-500">Send files directly to another browser — no uploads, no servers.</p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">1. Select a file</h2>
            <FileDropzone file={file} onFileSelect={handleFileSelect} />
          </section>

          {file && !roomId && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">2. Create a room</h2>
              {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
              <button onClick={handleCreateRoom} className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95">
                Create Room &amp; Get Link
              </button>
            </section>
          )}

          {roomId && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">2. Share this link with the receiver</h2>
              <RoomLink roomId={roomId} inviteLink={inviteLink} />
            </section>
          )}

          {roomId && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">3. Status</h2>
              <ConnectionStatus status={status} />
            </section>
          )}

          {isTransferring && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">4. Transfer</h2>
              <ProgressBar progress={progress} />
              <TransferStats transferred={transferStats.transferred} total={transferStats.total} speed={transferStats.speed} eta={transferStats.eta} />
            </section>
          )}

          {transferDone && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-lg font-semibold text-green-700">✓ Transfer Complete</p>
              <p className="mt-1 text-sm text-slate-500">The receiver has received <span className="font-medium">{file?.name}</span>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
