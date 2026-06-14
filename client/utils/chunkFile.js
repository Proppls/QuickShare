export const CHUNK_SIZE = 64 * 1024; // 64 KB

export const chunkFile = async (
  file,
  chunkSize = CHUNK_SIZE
) => {
  const chunks = [];

  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(
      offset,
      offset + chunkSize
    );

    chunks.push(chunk);

    offset += chunkSize;
  }

  return chunks;
};
