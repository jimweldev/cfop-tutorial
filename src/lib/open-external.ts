import { openUrl } from "@tauri-apps/plugin-opener";

// Opens a link in the system browser (or the YouTube app on Android).
// Falls back to window.open when running in a plain browser via `npm run dev`.
export async function openExternal(url: string) {
  try {
    await openUrl(url);
  } catch {
    window.open(url, "_blank");
  }
}
