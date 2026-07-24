import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  authProvider?: string | null;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setAuth: (firebaseUser: FirebaseUser | null, profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

const PROFILE_CACHE_KEY = 'auth_profile_cache';

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  profile: null,
  isLoading: true,

  setAuth: (firebaseUser, profile) => {
    // Cache profile to sessionStorage for instant loads
    if (profile) {
      try {
        sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
      } catch {}
    } else {
      try {
        sessionStorage.removeItem(PROFILE_CACHE_KEY);
      } catch {}
    }
    set({ firebaseUser, profile, isLoading: false });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  logout: () => {
    try {
      sessionStorage.removeItem(PROFILE_CACHE_KEY);
    } catch {}
    set({ firebaseUser: null, profile: null, isLoading: false });
  },

  // Hydrate from sessionStorage on first load for instant rendering
  hydrate: () => {
    try {
      const cached = sessionStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        const profile = JSON.parse(cached) as UserProfile;
        // Set profile immediately but keep isLoading true so AuthProvider
        // still revalidates in the background
        set({ profile, isLoading: true });
      }
    } catch {}
  },
}));
