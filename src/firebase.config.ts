import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyChMmaj2Gug7gNjZ6agv1jBlZYFyGl_hzE",
  authDomain: "bgchat-59022.firebaseapp.com",
  projectId: "bgchat-59022",
  storageBucket: "bgchat-59022.appspot.com",
  messagingSenderId: "757845382584",
  appId: "1:757845382584:web:f0bd240614123baa02eb4d",
  measurementId: "G-3NWJ7PFW08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app);

export const storage = getStorage()

