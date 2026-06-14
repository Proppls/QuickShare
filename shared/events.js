const EVENTS = {
  // ── Room lifecycle ──────────────────────────────────────────────────────────
  /** Sender → Server: create a new room */
  CREATE_ROOM: 'create-room',
 
  /** Receiver → Server: join an existing room by ID */
  JOIN_ROOM: 'join-room',
 
  /** Server → Sender: a peer successfully joined the room */
  PEER_JOINED: 'peer-joined',
 
  /** Server → remaining peer: the other peer disconnected */
  PEER_DISCONNECTED: 'peer-disconnected',
 
  // ── WebRTC signaling ────────────────────────────────────────────────────────
  /** Sender → Server → Receiver: SDP offer */
  OFFER: 'offer',
 
  /** Receiver → Server → Sender: SDP answer */
  ANSWER: 'answer',
 
  /** Both directions: ICE candidate trickle */
  ICE_CANDIDATE: 'ice-candidate',
};
 
module.exports = { EVENTS };
