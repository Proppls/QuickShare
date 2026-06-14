/** Default WebRTC data-channel chunk size in bytes (64 KB) */
const CHUNK_SIZE = 65536;
 
/** Maximum file size the UI accepts without warning (50 MB) */
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
 
// ── Room ──────────────────────────────────────────────────────────────────────
/** How long (ms) an empty room survives before cleanup (1 hour) */
const ROOM_TTL_MS = 60 * 60 * 1000;
 
/** Maximum simultaneous receivers per room (MVP = 1) */
const MAX_RECEIVERS_PER_ROOM = 1;
 
// ── WebRTC ────────────────────────────────────────────────────────────────────
/** Public STUN servers used for ICE negotiation */
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];
 
// ── Message types sent through the data channel ───────────────────────────────
/** Sent as the very first message; carries file metadata */
const DC_MSG_META = 'meta';
 
/** Sent as the final message; carries the SHA-256 hash for verification */
const DC_MSG_DONE = 'done';
 
module.exports = {
  CHUNK_SIZE,
  MAX_FILE_SIZE_BYTES,
  ROOM_TTL_MS,
  MAX_RECEIVERS_PER_ROOM,
  ICE_SERVERS,
  DC_MSG_META,
  DC_MSG_DONE,
};
