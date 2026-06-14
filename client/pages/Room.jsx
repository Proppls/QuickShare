import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ConnectionStatus from '../components/ConnectionStatus';
import ProgressBar from '../components/Progressbar';
import TransferStats from '../components/TransferStats';
import HashStatus from '../components/HashStatus';

import { joinRoom, onOffer, onIceCandidate as onSocketIceCandidate, onPeerDisconnected, sendAnswer, sendIceCandidate } from '../services/socket';
import { fetchIceServers, createPeerConnection, createAnswer, addIceCandidate, onIceCandidate as setPeerIceHandler, onConnectionStateChange, onDataChannel } from '../services/peer';
import { createReceiver } from '../services/FileTransfer';

export default function Room() {
  const { roomId } = useParams();

  const [status, setStatus] = useState('waiting');
  const [progress, setProgress] = useState(0);
  const [transferred, setTransferred] = useState(0);
  const [total, setTotal] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState(0);
  const [verified, setVerified] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState('');

  const roomIdRef = useRef(roomId);
  
  useEffect(() => {
    await fetchIceServers();
    joinRoom(roomId);

    onOffer(async (offer) => {
      setStatus('connecting');
      try {
        createPeerConnection();

        setPeerIceHandler((candidate) => {
          sendIceCandidate(roomIdRef.current, candidate);
        });

        onConnectionStateChange((state) => {
          setStatus(state);
          if (state === 'failed' || state === 'disconnected') {
            setError('Connection lost. Please refresh and try again.');
          }
        });

        onDataChannel((channel) => {
          const handleMessage = createReceiver(
            (metadata) => {
              setFileName(metadata.name);
              setFileSize(metadata.size);
              setTotal(metadata.size);
              setStatus('transferring');
            },
            (stats) => {
              setProgress(stats.progress);
              setTransferred(stats.transferred);
              setTotal(stats.total);
              setSpeed(stats.speed);
              setEta(stats.eta);
            },
            ({ downloadUrl, verified, metadata }) => {
              setDownloadUrl(downloadUrl);
              setVerified(verified);
              setProgress(100);
              setTransferred(metadata.size);
              setStatus('completed');
            }
          );
          channel.onmessage = handleMessage;
        });

        onSocketIceCandidate(async (candidate) => {
          await addIceCandidate(candidate);
        });

        const answer = await createAnswer(offer);
        sendAnswer(roomIdRef.current, answer);
      } catch (err) {
        console.error(err);
        setError('Failed to establish connection.');
        setStatus('failed');
      }
    });

    onPeerDisconnected(() => {
      if (status !== 'completed') {
        setError('Sender disconnected.');
        setStatus('disconnected');
      }
    });
  }, []);

  const isReceiving = status === 'transferring' || (status === 'connected' && progress > 0);
  const isDone = status === 'completed';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">⚡ QuickShare</h1>
          <p className="mt-2 text-slate-500">Room <span className="font-semibold text-slate-700">{roomId}</span>{' — '}receiving a file</p>
        </div>

        <div className="space-y-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Connection</h2>
            <ConnectionStatus status={status} />
          </section>

          {fileName && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Incoming File</h2>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <p className="font-medium text-slate-800 truncate">{fileName}</p>
                {fileSize > 0 && <p className="mt-1 text-sm text-slate-500">{(fileSize / (1024 * 1024)).toFixed(2)} MB</p>}
              </div>
            </section>
          )}

          {isReceiving && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Transfer</h2>
              <ProgressBar progress={progress} />
              <TransferStats transferred={transferred} total={total} speed={speed} eta={eta} />
            </section>
          )}

          {isDone && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Integrity Check</h2>
              <HashStatus verified={verified} />
            </section>
          )}

          {downloadUrl && (
            <section>
              <a href={downloadUrl} download={fileName} className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95">
                ⬇ Download {fileName}
              </a>
              <p className="mt-2 text-center text-xs text-slate-400">This link is temporary and will expire when you close the tab.</p>
            </section>
          )}

          {status === 'waiting' && <p className="text-center text-sm text-slate-400">Waiting for the sender to initiate the connection…</p>}
        </div>
      </div>
    </div>
  );
}
