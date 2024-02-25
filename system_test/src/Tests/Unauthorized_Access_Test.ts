import CryptoJS from "crypto-js";

const deriveEncryptionKey = (secret: any) => {
  const salt = CryptoJS.lib.WordArray.random(16).toString("hex");
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

const performUnauthorizedTest = (secret, unauthorizedsecret, rawData) => {
  var testResult;
  var result;
  const encryptedData = EncryptData(rawData, secret);
  try {
    result = DecryptData(encryptedData, unauthorizedsecret);
    if (result === "") {
      testResult =
        "Failed to decrypt: Unauthorized access detected or incorrect key.";
    } else {
      testResult =
        "Warning: Data decrypted with unauthorized key. Review encryption and key management practices.";
    }
  } catch (error) {
    testResult =
      "Error during decryption attempt. Possibly unauthorized access or incorrect key usage.";
  }

  return {
    result,
    testResult,
  };
};

export { performUnauthorizedTest };
