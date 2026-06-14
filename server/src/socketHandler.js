import {
  createRoom,
  joinRoom,
  removePeer,
  getRoom,
} from './roomManager.js';

import { SOCKET_EVENTS } from '../../shared/events.js';

export default function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on(SOCKET_EVENTS.CREATE_ROOM, () => {
      const roomId = createRoom(socket.id);

      socket.join(roomId);

      socket.emit(SOCKET_EVENTS.ROOM_CREATED, {
        roomId,
      });
    });

    socket.on(
      SOCKET_EVENTS.JOIN_ROOM,
      ({ roomId }) => {
        const success = joinRoom(roomId, socket.id);

        if (!success) {
          socket.emit('room-error', {
            message: 'Room not found or full',
          });
          return;
        }

        socket.join(roomId);

        socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
          roomId,
        });

        socket
          .to(roomId)
          .emit(SOCKET_EVENTS.PEER_JOINED);
      }
    );

    socket.on(
      SOCKET_EVENTS.OFFER,
      ({ roomId, offer }) => {
        socket.to(roomId).emit(
          SOCKET_EVENTS.OFFER,
          offer
        );
      }
    );

    socket.on(
      SOCKET_EVENTS.ANSWER,
      ({ roomId, answer }) => {
        socket.to(roomId).emit(
          SOCKET_EVENTS.ANSWER,
          answer
        );
      }
    );

    socket.on(
      SOCKET_EVENTS.ICE_CANDIDATE,
      ({ roomId, candidate }) => {
        socket.to(roomId).emit(
          SOCKET_EVENTS.ICE_CANDIDATE,
          candidate
        );
      }
    );

    socket.on('disconnect', () => {
      const roomId = removePeer(socket.id);

      if (roomId) {
        socket
          .to(roomId)
          .emit(SOCKET_EVENTS.PEER_DISCONNECTED);
      }
    });
  });
}
