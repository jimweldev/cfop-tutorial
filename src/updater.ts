import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

// Desktop only: the updater plugin isn't registered on Android, so check() throws there.
export async function checkForUpdates() {
  try {
    const update = await check();
    if (!update) return;

    const ok = window.confirm(
      `CFOP Tutorial ${update.version} is available (you have ${update.currentVersion}). Update now?`,
    );
    if (!ok) return;

    await update.downloadAndInstall();
    await relaunch();
  } catch (err) {
    console.warn("Update check skipped:", err);
  }
}
