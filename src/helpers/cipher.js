import CryptoJS, { AES } from 'crypto-js';

export async function encrypt(data, key) {
  return AES.encrypt(JSON.stringify(data), key).toString();
}

export async function decrypt(encryptedText, key) {
  return JSON.parse(AES.decrypt(encryptedText.toString(), key).toString(CryptoJS.enc.Utf8));
}
