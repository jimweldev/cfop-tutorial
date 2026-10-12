import { getVersion } from "@tauri-apps/api/app";
import { openUrl } from "@tauri-apps/plugin-opener";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const LATEST_RELEASE_API =
  "https://api.github.com/repos/jimweldev/cfop-tutorial/releases/latest";

export async function checkForUpdates() {
  try {
    if (/Android/i.test(navigator.userAgent)) {
      await checkAndroid();
    } else {
      await checkDesktop();
    }
  } catch (err) {
    console.warn("Update check skipped:", err);
  }
}

// Desktop: the Tauri updater downloads, verifies and installs the signed bundle.
async function checkDesktop() {
  const update = await check();
  if (!update) return;

  const ok = window.confirm(
    `CFOP Tutorial ${update.version} is available (you have ${update.currentVersion}). Update now?`,
  );
  if (!ok) return;

  await update.downloadAndInstall();
  await relaunch();
}

// Android has no updater plugin: compare against the latest GitHub release and
// hand the APK link to the browser, which downloads it for the user to install.
async function checkAndroid() {
  const res = await fetch(LATEST_RELEASE_API);
  if (!res.ok) return;
  const release: { tag_name: string; assets: { name: string; browser_download_url: string }[] } =
    await res.json();

  const latest = release.tag_name.replace(/^v/, "");
  const current = await getVersion();
  if (!isNewer(latest, current)) return;

  const apk = release.assets.find((a) => a.name.endsWith(".apk"));
  if (!apk) return;

  const ok = window.confirm(
    `CFOP Tutorial ${latest} is available (you have ${current}). Download the update?`,
  );
  if (ok) await openUrl(apk.browser_download_url);
}

function isNewer(latest: string, current: string) {
  const a = latest.split(".").map(Number);
  const b = current.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return false;
}
