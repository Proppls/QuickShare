/**
 * Socket.io event names shared between client and server.
 * The server only relays signaling messages — never file data.
 */

export const SOCKET_EVENTS = {
  // Room management
  CREATE_ROOM: 'create-room',
  ROOM_CREATED: 'room-created',

  JOIN_ROOM: 'join-room',
  ROOM_JOINED: 'room-joined',

  ROOM_ERROR: 'room-error',

  // Peer lifecycle
  PEER_JOINED: 'peer-joined',
  PEER_DISCONNECTED: 'peer-disconnected',

  // WebRTC signaling
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
};
