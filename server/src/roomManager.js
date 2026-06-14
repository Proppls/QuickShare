const rooms = new Map();

const generateRoomId = () => {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
};

export const createRoom = (hostSocketId) => {
  let roomId = generateRoomId();

  while (rooms.has(roomId)) {
    roomId = generateRoomId();
  }

  rooms.set(roomId, {
    host: hostSocketId,
    peer: null,
  });

  return roomId;
};

export const joinRoom = (roomId, peerSocketId) => {
  const room = rooms.get(roomId);

  if (!room) {
    return false;
  }

  if (room.peer) {
    return false;
  }

  room.peer = peerSocketId;

  return true;
};

export const getRoom = (roomId) => {
  return rooms.get(roomId);
};

export const roomExists = (roomId) => {
  return rooms.has(roomId);
};

export const removePeer = (socketId) => {
  for (const [roomId, room] of rooms.entries()) {
    if (room.host === socketId) {
      rooms.delete(roomId);
      return roomId;
    }

    if (room.peer === socketId) {
      room.peer = null;
      return roomId;
    }
  }

  return null;
};

export const getRooms = () => {
  return rooms;
};
