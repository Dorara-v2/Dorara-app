import { AuthState, GUEST_USER } from "store/userStore";
import { setUserUsagePref } from "./extra";
import { ensureBaseNotesFolder } from "./offlineDirectory/createDoraraFolder";

export const offlineFlow = (setAuthState: (autState: AuthState) => void, setUser: (user: any) => void) => {
  setUserUsagePref('offline');
  ensureBaseNotesFolder();
  setUser(GUEST_USER);
  setAuthState('guest');
};
