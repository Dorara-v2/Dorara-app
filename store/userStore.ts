
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Image } from "react-native";
import { deleteUserUsagePref, setUserUsagePref } from "utils/extra";
import { googleSignOut } from "utils/googleOauth";
import { create } from "zustand";


export const GUEST_USER = {
    uid: "guest",
    displayName: "Guest",
    email: null,
    photoURL: Image.resolveAssetSource(require('../assets/adaptive-icon.png')).uri,
    isGuest: true
}

export type AuthState = 'unauthenticated' | 'authenticated' | 'guest';

interface UserStore {
    authState: AuthState
    setAuthState: (authState: AuthState) => void;
    user: any;
    setUser: (user: any) => void;
    signOut: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    authState: 'unauthenticated',
    setAuthState: (authState) => set({ authState }),
    user: null,
    setUser: (user) => set({ user }),
    signOut: async () => {
        googleSignOut()
        deleteUserUsagePref()
        set({ authState: 'unauthenticated' });
        set({ user: null });
    }
}));