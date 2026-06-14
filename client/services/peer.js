const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

let peerConnection = null;
let dataChannel = null;

export const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);
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
    new RTCSessionDescription(offer)
  );

  const answer = await peerConnection.createAnswer();

  await peerConnection.setLocalDescription(answer);

  return answer;
};

export const setRemoteAnswer = async (answer) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
};

export const addIceCandidate = async (candidate) => {
  if (!candidate) return;

  await peerConnection.addIceCandidate(
    new RTCIceCandidate(candidate)
  );
};

export const onIceCandidate = (callback) => {
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      callback(event.candidate);
    }
  };
};

export const onConnectionStateChange = (callback) => {
  peerConnection.onconnectionstatechange = () => {
    callback(peerConnection.connectionState);
  };
};

export const onDataChannel = (callback) => {
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    callback(event.channel);
  };
};

export const closePeerConnection = () => {
  if (dataChannel) {
    dataChannel.close();
    dataChannel = null;
  }

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
};
