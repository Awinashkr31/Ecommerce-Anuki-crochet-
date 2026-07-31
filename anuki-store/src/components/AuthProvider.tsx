"use client";

import { useEffect, useRef } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../store/authStore";
import { apiGet, apiPost } from "../lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading, firebaseUser, hydrate } = useAuthStore();
  const hasHydrated = useRef(false);

  // Hydrate cached profile immediately on mount (before any network calls)
  useEffect(() => {
    if (!hasHydrated.current) {
      hydrate();
      hasHydrated.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // First, check if backend already has a valid session cookie
          try {
            const { user: profile } = await apiGet("/auth/me");
            setAuth(user, profile);
          } catch (err: any) {
            // If backend session is invalid or missing, create a new one
            if (err.message === "Unauthorized" || err.message === "User not found") {
              const idToken = await user.getIdToken();
              const { user: profile } = await apiPost("/auth/session", { idToken });
              setAuth(user, profile);
            } else {
              throw err;
            }
          }
        } catch (err) {
          console.error("Failed to sync auth with backend", err);
          setAuth(null, null);
        }
      } else {
        // User is signed out of Firebase, ensure backend session is cleared
        if (firebaseUser) {
           await apiPost("/auth/logout", {});
        }
        setAuth(null, null);
      }
    });

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // No loading spinner here anymore — pages render instantly with cached profile
  // Individual pages/layouts handle their own loading states if needed
  return <>{children}</>;
}
