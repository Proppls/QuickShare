const CHUNK_SIZE = 64 * 1024;

export const generateHash = async (file) => {
  const buffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    buffer
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const sendFile = async (
  file,
  dataChannel,
  onProgress = () => {}
) => {
  const hash = await generateHash(file);

  dataChannel.send(
    JSON.stringify({
      type: 'metadata',
      payload: {
        name: file.name,
        size: file.size,
        mimeType: file.type,
        hash,
      },
    })
  );

  let offset = 0;
  const startTime = Date.now();

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);

    const buffer = await chunk.arrayBuffer();

    dataChannel.send(buffer);

    offset += buffer.byteLength;

    const elapsedSeconds =
      (Date.now() - startTime) / 1000;

    const speed =
      elapsedSeconds > 0
        ? offset / elapsedSeconds
        : 0;

    const remainingBytes = file.size - offset;

    const eta =
      speed > 0
        ? remainingBytes / speed
        : 0;

    onProgress({
      progress: (offset / file.size) * 100,
      transferred: offset,
      total: file.size,
      speed,
      eta,
    });

    while (
      dataChannel.bufferedAmount >
      CHUNK_SIZE * 16
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, 50)
      );
    }
  }

  dataChannel.send(
    JSON.stringify({
      type: 'transfer-complete',
    })
  );
};

export const createReceiver = (
  onMetadata,
  onProgress,
  onComplete
) => {
  const chunks = [];

  let metadata = null;
  let receivedBytes = 0;
  let startTime = null;

  return async (event) => {
    if (typeof event.data === 'string') {
      const message = JSON.parse(event.data);

      if (message.type === 'metadata') {
        metadata = message.payload;
        receivedBytes = 0;
        chunks.length = 0;
        startTime = Date.now();

        onMetadata?.(metadata);
      }

      if (message.type === 'transfer-complete') {
        const blob = new Blob(chunks, {
          type: metadata.mimeType,
        });

        const computedHash =
          await generateHash(blob);

        const verified =
          computedHash === metadata.hash;

        const downloadUrl =
          URL.createObjectURL(blob);

        onComplete?.({
          blob,
          downloadUrl,
          verified,
          metadata,
        });
      }

      return;
    }

    chunks.push(event.data);

    receivedBytes += event.data.byteLength;

    const elapsedSeconds =
      (Date.now() - startTime) / 1000;

    const speed =
      elapsedSeconds > 0
        ? receivedBytes / elapsedSeconds
        : 0;

    const remainingBytes =
      metadata.size - receivedBytes;

    const eta =
      speed > 0
        ? remainingBytes / speed
        : 0;

    onProgress?.({
      progress:
        (receivedBytes / metadata.size) * 100,
      transferred: receivedBytes,
      total: metadata.size,
      speed,
      eta,
    });
  };
};
