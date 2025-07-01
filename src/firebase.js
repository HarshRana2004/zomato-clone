import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbTIKE-QCKWkZf5HENKYrGJXzEVxL7Y8g",
  authDomain: "foodygaadi.firebaseapp.com",
  projectId: "foodygaadi",
  storageBucket: "foodygaadi.appspot.com",
  messagingSenderId: "415302290205",
  appId: "1:415302290205:web:592863402547354e566ff4",
  measurementId: "G-8GDX499S8P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to localStorage");
  })
  .catch((error) => {
    console.error("Failed to set persistence:", error);
  });

export { auth };
