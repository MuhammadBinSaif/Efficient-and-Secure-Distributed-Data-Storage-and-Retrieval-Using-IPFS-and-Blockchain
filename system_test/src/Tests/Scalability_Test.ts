import CryptoJS from "crypto-js";
import { create, CID } from "ipfs-http-client";
import { Buffer } from "buffer";

const IPFS_PROJECT_ID = "your_infura_project_id";
const IPFS_PROJECT_SECRET = "your_infura_project_secret";
// Configure IPFS client
const auth =
  "Basic " +
  Buffer.from(IPFS_PROJECT_ID + ":" + IPFS_PROJECT_SECRET).toString("base64");
const ipfs = create({
  protocol: "https",
  host: "ipfs.infura.io",
  port: 5001,
  headers: {
    authorization: auth,
  },
});

// Encryption function using CryptoJS
const deriveEncryptionKey = (secret: string) => {
  const salt = CryptoJS.lib.WordArray.random(16).toString("hex");
  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: 256 / 32,
  }).toString();
  return key;
};

const encryptData = (rawdata: any, secret: string) => {
  const key = deriveEncryptionKey(secret);
  const dataString = JSON.stringify(rawdata);
  const cipherText = CryptoJS.AES.encrypt(dataString, key).toString();
  return cipherText;
};

// Hashing function using CryptoJS
const hashData = (rawdata: any[]) => {
  return rawdata.map((obj) => {
    const objectString = JSON.stringify(obj);
    const hashValue = CryptoJS.SHA256(objectString).toString();
    return { hashValue };
  });
};

// Function to add data to IPFS
const addToIPFS = async (jsonData: any): Promise<string> => {
  try {
    const resolvedData = await jsonData;
    const data = JSON.stringify(resolvedData);

    const { path } = await ipfs.add(data);
    return path;
  } catch (error) {
    console.error("Error adding to IPFS:", error);
    throw error;
  }
};

// Main performance test function modified to include data retrieval
const performScalabilityTest = async (secret: string, rawData: any[]) => {
  // Encrypt data and measure time
  const startEncryption = performance.now();
  const encryptedData = encryptData(rawData, secret);
  const endEncryption = performance.now();
  const encryptionTime = endEncryption - startEncryption;
  console.log(`Encryption Time: ${encryptionTime}ms`);
  // Hash data and measure time
  const startHashing = performance.now();
  const hashedData = hashData(rawData);
  const endHashing = performance.now();
  const hashingTime = endHashing - startHashing;
  console.log(`Hashing Time: ${hashingTime}ms`);

  // Prepare combined data for IPFS
  const combinedData = {
    encryptedData: encryptedData,
    hashedData,
  };
  const combinedDataString = JSON.stringify(combinedData);
  // Measure IPFS add time
  const startIPFS = performance.now();
  const ipfsPath = await addToIPFS(combinedDataString);
  const endIPFS = performance.now();
  const ipfsTime = endIPFS - startIPFS;
  console.log(`IPFS Add Time: ${ipfsTime}ms`);
  const totalTime = encryptionTime + hashingTime + ipfsTime;
  // Return performance data and paths
  return {
    encryptionTime,
    hashingTime,
    ipfsTime,
    totalTime,
    ipfsPath,
  };
};

export { performScalabilityTest };
