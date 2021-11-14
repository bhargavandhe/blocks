import { firestore } from "firebase";
import { db } from "src/fire";

export const LOG_TYPES = {
  activity: "ACTIVITY",
  notification: "NOTIFICATION",
  shared: "SHARED",
  request: "REQUEST",
};

export async function log(uid, type, message) {
  await db
    .collection("users")
    .doc(uid)
    .update({
      logs: firestore.FieldValue.arrayUnion({
        type: type,
        time: firestore.Timestamp.now().toMillis(),
        message: message,
      }),
    });
}
