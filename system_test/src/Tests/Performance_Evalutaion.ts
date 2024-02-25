import CryptoJS from "crypto-js";

// Utility functions
const deriveEncryptionKey = (secret: any) => {
  const salt = CryptoJS.SHA256(secret).toString();
  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: 256 / 32,
  }).toString();
  return key;
};

const EncryptData = (rawdata: any, secret: any) => {
  const key = deriveEncryptionKey(secret);
  const dataString = JSON.stringify(rawdata);
  const cipherText = CryptoJS.AES.encrypt(dataString, key).toString();
  return cipherText;
};

const DecryptData = (ciphertext: any, secret: any) => {
  const key = deriveEncryptionKey(secret);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
};

const performPerformanceTest = (secret, rawData, iterations = 10) => {
  let totalEncryptionLatency = 0;
  let totalDEncryptionLatency = 0;
  let totalEncryptionThroughput = 0;
  let totalDEncryptionThroughput = 0;

  const dataSizeKBytes =
    new TextEncoder().encode(JSON.stringify(rawData)).length / 1024;

  for (let i = 0; i < iterations; i++) {
    let cipherText;

    // Encryption
    const encryptionStart = performance.now();
    cipherText = EncryptData(rawData, secret);
    const encryptionEnd = performance.now();
    const encryptionLatency = encryptionEnd - encryptionStart;
    totalEncryptionLatency += encryptionLatency;
    totalEncryptionThroughput += (dataSizeKBytes / encryptionLatency) * 1000; // Convert to kbps

    // Decryption
    const dencryptionStart = performance.now();
    DecryptData(cipherText, secret);
    const dencryptionEnd = performance.now();
    const dencryptionLatency = dencryptionEnd - dencryptionStart;
    totalDEncryptionLatency += dencryptionLatency;
    totalDEncryptionThroughput += (dataSizeKBytes / dencryptionLatency) * 1000; // Convert to bps
  }

  // Averaging
  const avgEncryptionLatency = totalEncryptionLatency / iterations;
  const avgDEncryptionLatency = totalDEncryptionLatency / iterations;
  const avgEncryptionThroughput = totalEncryptionThroughput / iterations;
  const avgDEncryptionThroughput = totalDEncryptionThroughput / iterations;

  return {
    avgEncryptionLatency,
    avgEncryptionThroughput,
    avgDEncryptionLatency,
    avgDEncryptionThroughput,
  };
};

export { performPerformanceTest };
