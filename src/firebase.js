import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── Gifts ──────────────────────────────────────────────────────────────────
export const giftsCollection = collection(db, "gifts");

export const subscribeGifts = (callback) => {
  return onSnapshot(giftsCollection, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
};

export const addGift = async (giftData) => {
  return await addDoc(giftsCollection, giftData);
};

export const updateGift = async (id, data) => {
  return await updateDoc(doc(db, "gifts", id), data);
};

export const deleteGift = async (id) => {
  return await deleteDoc(doc(db, "gifts", id));
};

// ── Settings (QR Code) ────────────────────────────────────────────────────
export const saveQrCode = async (url) => {
  return await setDoc(doc(db, "settings", "qrcode"), { url });
};

export const getQrCode = async () => {
  const snap = await getDoc(doc(db, "settings", "qrcode"));
  return snap.exists() ? snap.data().url : null;
};