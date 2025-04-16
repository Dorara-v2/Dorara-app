import { setupOnlineDrive } from "./driveDirectory/findOrCreateDoraraFolder";
import { setUserUsagePref } from "./extra";
import { signInWithGoogle } from "./googleOauth";
import { ensureBaseNotesFolder } from "./offlineDirectory/createDoraraFolder";

export const onlineFlow = async () => {
  await signInWithGoogle();
  await setUserUsagePref('online');
  await ensureBaseNotesFolder();
  await setupOnlineDrive()
};
