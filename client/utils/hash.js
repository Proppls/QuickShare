export const generateHash = async (fileOrBlob) => {
  const buffer = await fileOrBlob.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    buffer
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const verifyHash = async (
  fileOrBlob,
  expectedHash
) => {
  const computedHash = await generateHash(fileOrBlob);

  return computedHash === expectedHash;
};
