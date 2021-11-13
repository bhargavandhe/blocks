import ipfs from "../ipfs";
import { db } from "../fire";
import { decrypt, encrypt } from "./cipher";
import { generate, verify } from "password-hash";

export async function register(uid, password, ekyc) {
  // create doc -> uid
  // hash uid and pwd -> privateKey
  // aes on ekyc using privateKey
  // store on ipfs
  // get hash from ipfs
  // add to firebase

  const privateKey = generate(uid + password);

  const buffer = Buffer.from(await encrypt(ekyc, privateKey));
  ipfs.files.add(buffer).then(async (res) => {
    console.log(res[0].hash);

    await db.collection("users").doc(uid).set({
      blockHash: res[0].hash,
      privateKey: privateKey,
      incomingRequests: {},
      requestResponses: {},
    });
    return true;
  });
  return false;
}

export async function login(uid, password) {
  const data = await getDataFromFirebase(uid);
  if (data) {
    if (verify(uid + password, data.privateKey)) {
      localStorage.setItem("uid", uid);
      return true;
    }
    return false;
  }
  return false;
}

export async function updateKYC(ekyc, privateKey) {
  console.log(ekyc);

  const buffer = Buffer.from(await encrypt(ekyc, privateKey));
  ipfs.files.add(buffer).then(async (res) => {
    console.log(res[0].hash);
    await db.collection("users").doc(ekyc.uid).update({
      blockHash: res[0].hash,
    });
  });
}

export async function getBlockData(blockHash, privateKey) {
  if (blockHash && privateKey) {
    const res = await ipfs.files.cat(blockHash);
    const ekyc = await decrypt(res, privateKey);
    return ekyc;
  } else return {};
}

export async function getDataFromFirebase(uid) {
  console.log(uid);
  const res = await db.collection("users").doc(uid).get();
  return res.data();
}

export async function getUserData(uid) {
  const firebaseData = await getDataFromFirebase(uid);

  const blockHash = firebaseData.blockHash;
  const privateKey = firebaseData.privateKey;

  const ekyc = getBlockData(blockHash, privateKey);

  return ekyc;
}

export async function getResponses(uid) {
  const res = await db.collection("users").doc(uid).get();
  console.log(res.data().requestResponses);
  return res.data().requestResponses;
}

export async function pushRequest(ownerUID, requesterUID) {
  await db
    .collection("users")
    .doc(ownerUID)
    .set({ incomingRequests: { [requesterUID]: false } }, { merge: true });
}

export async function popRequest(uid) {
  await db.collection("users").doc(uid).update({ incomingRequests: {} });
}

export async function sendKYC(ownerUID, requesterUID) {
  const ownerData = await db.collection("users").doc(ownerUID).get();
  const blockHash = ownerData.data().blockHash;
  const privateKey = ownerData.data().privateKey;

  db.collection("users")
    .doc(requesterUID)
    .set(
      {
        requestResponses: {
          blockHash: blockHash,
          privateKey: privateKey,
        },
      },
      { merge: true }
    );
}
