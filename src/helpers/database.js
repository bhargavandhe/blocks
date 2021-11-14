import ipfs from "../ipfs";
import { db } from "../fire";
import { decrypt, encrypt } from "./cipher";
import { generate, verify } from "password-hash";
import { log, LOG_TYPES } from "./logger";
import axios from "axios";
import { firestore } from "firebase";

export async function register(uid, password, ekyc) {
  // create doc -> uid
  // hash uid and pwd -> privateKey
  // aes on ekyc using privateKey
  // store on ipfs
  // get hash from ipfs
  // add to firebase

  const privateKey = generate(uid + password, { algorithm: "sha256" });
  const buffer = Buffer.from(await encrypt(ekyc, privateKey));
  ipfs.files.add(buffer).then(async (res) => {
    console.log(res[0].hash);

    await db.collection("users").doc(uid).set({
      blockHash: res[0].hash,
      privateKey: privateKey,
      incomingRequests: {},
      requestResponses: {},
      logs: [],
    });
    log(uid, LOG_TYPES.activity, "Account registered successfully");
    localStorage.setItem("uid", uid);
    return true;
  });
  return false;
}

export async function login(uid, password) {
  const res = await axios.get("https://api.ipify.org?format=json");
  const ip = res.data.ip;

  const data = await getDataFromFirebase(uid);
  if (data) {
    if (verify(uid + password, data.privateKey)) {
      localStorage.setItem("uid", uid);
      log(uid, LOG_TYPES.activity, `New login detected from Public IP = ${ip}`);
      return true;
    }
    return false;
  }
  return false;
}

export async function updateKYC(ekyc, privateKey, referenceUID) {
  const buffer = Buffer.from(await encrypt(ekyc, privateKey));
  ipfs.files.add(buffer).then(async (res) => {
    console.log(res[0].hash);
    await db
      .collection("users")
      .doc(ekyc.uid)
      .update({
        blockHash: res[0].hash,
        logs: firestore.FieldValue.arrayUnion({
          type: LOG_TYPES.notification,
          time: firestore.Timestamp.now(),
          message: `Successfully updated Aadhar, refUID = ${referenceUID}`,
        }),
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
  if (uid) {
    const res = await db.collection("users").doc(uid).get();
    return res.data();
  }
}

export async function getUserData(uid) {
  const firebaseData = await getDataFromFirebase(uid);

  if (firebaseData) {
    const blockHash = firebaseData.blockHash;
    const privateKey = firebaseData.privateKey;

    const ekyc = getBlockData(blockHash, privateKey);

    return ekyc;
  }
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
  log(
    ownerUID,
    LOG_TYPES.notification,
    `${requesterUID} has requested your Aadhar Address`
  );
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

  log(
    ownerUID,
    LOG_TYPES.shared,
    `${requesterUID} has now access to your Aadhar address`
  );

  log(
    requesterUID,
    LOG_TYPES.shared,
    `You now have access to ${ownerUID}'s Aadhar address`
  );

  log(
    requesterUID,
    LOG_TYPES.notification,
    `You now have access to ${requesterUID}'s Aadhar address`
  );
}

export async function getLogs(uid) {
  const res = await db.collection("users").doc(uid).get();
  return res.data().logs;
}
