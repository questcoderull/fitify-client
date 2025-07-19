import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebase.init";
import useAxios from "../Hooks/useAxios";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const provider = new GoogleAuthProvider();
  const axiosInstance = useAxios();

  //   creating new user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  //   logOut user
  const logOutUser = () => {
    return signOut(auth);
  };

  //   sighUp/signIn with google.
  const continueWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  //   ovserber
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // console.log("user in the auth state change", currentUser);

      if (currentUser?.email) {
        const res = await axiosInstance.get(`/users/${currentUser.email}`);
        setRole(res.data?.role);
      } else {
        setRole(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    loading,
    user,
    role,
    setLoading,
    createUser,
    logInUser,
    updateUserProfile,
    logOutUser,
    continueWithGoogle,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
