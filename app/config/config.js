import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig={
    apiKey: "AIzaSyCwU2VMFVLEo5ELqwvHN5g0N4reWa8lhJA",
    authDomain: "phish-93754.firebaseapp.com",
    projectId: "phish-93754",
    storageBucket: "phish-93754.appspot.com",
    messagingSenderId: "278972716339",
    appId: "1:278972716339:web:f0a9ad17d964784bed1a46",
    measurementId: "G-R34JFZ888T"
  };

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app);
  const storage = getStorage(app);

  export {app,db,storage};