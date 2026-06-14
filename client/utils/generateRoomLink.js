export const generateRoomLink = (roomId) => {
  if (!roomId) return '';

  return `${window.location.origin}/room/${roomId}`;
};
