/**
 * Global application constants shared by client and server.
 */

export const APP_CONFIG = {
  // Room configuration
  ROOM_ID_LENGTH: 6,

  // File transfer configuration
  DEFAULT_CHUNK_SIZE: 64 * 1024, // 64 KB
  MAX_FILE_SIZE: 10 * 1024 * 1024 * 1024, // 10 GB

  // Progress update interval (ms)
  PROGRESS_UPDATE_INTERVAL: 500,

  // WebRTC configuration
  ICE_SERVERS: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
  ],

  // Data channel configuration
  DATA_CHANNEL_LABEL: 'quickshare-data',
  DATA_CHANNEL_OPTIONS: {
    ordered: true,
  },
};

export const TRANSFER_STATUS = {
  IDLE: 'idle',
  WAITING: 'waiting',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  TRANSFERRING: 'transferring',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
  FAILED: 'failed',
};

export const PEER_ROLE = {
  SENDER: 'sender',
  RECEIVER: 'receiver',
};

export const HASH_ALGORITHM = 'SHA-256';

export const FILE_MESSAGE_TYPES = {
  FILE_METADATA: 'file-metadata',
  FILE_CHUNK: 'file-chunk',
  TRANSFER_COMPLETE: 'transfer-complete',
  HASH: 'hash',
};

export const CONNECTION_STATE = {
  NEW: 'new',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  FAILED: 'failed',
  CLOSED: 'closed',
};

export const ERROR_MESSAGES = {
  ROOM_NOT_FOUND: 'Room not found.',
  ROOM_FULL: 'Room is already full.',
  CONNECTION_FAILED: 'Peer connection failed.',
  TRANSFER_FAILED: 'File transfer failed.',
  HASH_MISMATCH: 'File verification failed.',
  INVALID_FILE: 'Invalid file selected.',
};
