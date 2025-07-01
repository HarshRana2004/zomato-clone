import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase"; // Your Firebase config file

// ✅ 1. Create Context
const UserContext = createContext();

// ✅ 2. Export Hook
export const useUser = () => useContext(UserContext);

// ✅ 3. Export Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("foodyUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🔁 Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        localStorage.setItem("foodyUser", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("foodyUser");
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔐 Login
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const loggedUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    };
    setUser(loggedUser);
    localStorage.setItem("foodyUser", JSON.stringify(loggedUser));
  };

  // 🆕 Signup
  const signup = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    const newUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: name,
      photoURL: result.user.photoURL || "",
    };
    setUser(newUser);
    localStorage.setItem("foodyUser", JSON.stringify(newUser));
  };

  // 🔓 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("foodyUser");

    // ✅ Per-user cart clearing logic
    Object.keys(localStorage)
      .filter((key) => key.startsWith("foodyCart_"))
      .forEach((key) => localStorage.removeItem(key));

    localStorage.removeItem("foodyOrders");
  };

  // 🖼 Update Profile Picture
  const updatePhoto = async (url) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: url });
      const updatedUser = {
        ...user,
        photoURL: url,
      };
      setUser(updatedUser);
      localStorage.setItem("foodyUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup, updatePhoto }}>
      {children}
    </UserContext.Provider>
  );
};
