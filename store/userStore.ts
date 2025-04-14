
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { googleSignOut } from "utils/googleOauth";
import { create } from "zustand";

interface UserStore {
    isOffline: boolean | null;
    setIsOffline: (isOffline: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    signOut: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    isOffline: null,
    setIsOffline: (isOffline) => set({ isOffline }),
    user: null,
    setUser: (user) => set({ user }),
    signOut: async () => {
        googleSignOut()
        set({ user: null });
    }
}));