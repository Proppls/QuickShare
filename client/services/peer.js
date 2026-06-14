const METERED_API_KEY = '71b0f0927625d50cd5dcc2addab7b97d908a';

let iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

export const fetchIceServers = async () => {
  try {
    const response = await fetch(
      `https://lukieee.metered.live/api/v1/turn/credentials?apiKey=${METERED_API_KEY}`
    );
    iceServers = await response.json();
  } catch (err) {
    console.warn('Failed to fetch TURN credentials, using STUN only:', err);
  }
};

let peerConnection = null;
let dataChannel = null;

export const createPeerConnection = () => {
  console.log('Creating peer connection with ICE servers:', JSON.stringify(iceServers));
  peerConnection = new RTCPeerConnection({ iceServers });
  
  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE connection state:', peerConnection.iceConnectionState);
  };
  
  peerConnection.onicegatheringstatechange = () => {
    console.log('ICE gathering state:', peerConnection.iceGatheringState);
  };

  return peerConnection;
};

export const getPeerConnection = () => {
  return peerConnection;
};

export const createDataChannel = (label = 'file-transfer') => {
  if (!peerConnection) {
    throw new Error('Peer connection not initialized');
  }

  dataChannel = peerConnection.createDataChannel(label, {
    ordered: true,
  });

  return dataChannel;
};

export const getDataChannel = () => {
  return dataChannel;
};

export const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async (offer) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(off
