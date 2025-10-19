"use client";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import app from "./firebase.config";
import {
  addUser,
  fetchCurrentUser,
  loginUser,
} from "@/redux/features/userSlice/userSlice";

const auth = getAuth(app);

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const dispatch = useDispatch();

  // Function to create a user
  const createUser = async (name, email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // Update Firebase user profile
      await updateProfile(newUser, { displayName: name });

      // Prepare user data for backend (securely)
      const userData = {
        name,
        email,
        role,
        uid: newUser.uid,
      };

      await dispatch(addUser(userData)).unwrap();

      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await dispatch(loginUser(email)).unwrap();

      setUser(userCredential.user);

      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { user, isAuthLoading, createUser, signIn, logOut };
};

export default useAuth;
