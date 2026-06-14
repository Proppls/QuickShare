import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../../shared/events';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const socket = io(SERVER_URL, {
  transports: ['websocket'],
  autoConnect: true,
});

export const createRoom = () =>
  new Promise((resolve) => {
    socket.emit(SOCKET_EVENTS.CREATE_ROOM);

    socket.once(SOCKET_EVENTS.ROOM_CREATED, (data) => {
      resolve(data);
    });
  });

export const joinRoom = (roomId) => {
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId });
};

export const sendOffer = (roomId, offer) => {
  socket.emit(SOCKET_EVENTS.OFFER, {
    roomId,
    offer,
  });
};

export const sendAnswer = (roomId, answer) => {
  socket.emit(SOCKET_EVENTS.ANSWER, {
    roomId,
    answer,
  });
};

export const sendIceCandidate = (roomId, candidate) => {
  socket.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
    roomId,
    candidate,
  });
};

export const onRoomJoined = (callback) => {
  socket.on(SOCKET_EVENTS.ROOM_JOINED, callback);
};

export const onPeerJoined = (callback) => {
  socket.on(SOCKET_EVENTS.PEER_JOINED, callback);
};

export const onOffer = (callback) => {
  socket.on(SOCKET_EVENTS.OFFER, callback);
};

export const onAnswer = (callback) => {
  socket.on(SOCKET_EVENTS.ANSWER, callback);
};

export const onIceCandidate = (callback) => {
  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, callback);
};

export const onPeerDisconnected = (callback) => {
  socket.on(SOCKET_EVENTS.PEER_DISCONNECTED, callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
