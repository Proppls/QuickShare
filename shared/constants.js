/** Default chunk size for file transfer (64 KB). */
export const DEFAULT_CHUNK_SIZE = 64 * 1024;

/** Maximum chunk size allowed (256 KB). */
export const MAX_CHUNK_SIZE = 256 * 1024;

/** Minimum chunk size allowed (16 KB). */
export const MIN_CHUNK_SIZE = 16 * 1024;

/** WebRTC connection timeout in milliseconds. */
export const CONNECTION_TIMEOUT_MS = 30_000;

/** Room ID length (characters). */
export const ROOM_ID_LENGTH = 6;

/** Maximum time a room stays alive without activity (1 hour). */
export const ROOM_TTL_MS = 60 * 60 * 1000;

/** Data channel label used for file transfer. */
export const DATA_CHANNEL_LABEL = 'quickshare-file';

/** Prefix for metadata messages sent over the data channel. */
export const METADATA_PREFIX = 'QS_META:';

/** Message types for data channel protocol. */
export const DC_MESSAGE = {
  METADATA: 'metadata',
  CHUNK: 'chunk',
  COMPLETE: 'complete',
  ERROR: 'error',
  CANCEL: 'cancel',
};
