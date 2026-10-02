// App identity — confirmed in the brief.
export const APP = {
  name: "newFrequency",
  androidPackage: "za.co.newfrequency.app",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=za.co.newfrequency.app",
  // The app's deep link scheme, from the app repo's app.json. Used by the
  // email confirmation page to offer "Open newFrequency". Must match, or the
  // link silently does nothing on a phone that has the app.
  scheme: "newfrequency",
};

// External release links are operator configuration; account and form data
// use the same Supabase project as the app.
function configuredTestFlightUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "testflight.apple.com" || url.username || url.password || !/^\/join\/[A-Za-z0-9]+\/?$/.test(url.pathname) || url.search || url.hash) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const DOWNLOAD = {
  // The server checks the configured release artifact before redirecting.
  // The artifact URL stays in server environment, outside the browser bundle.
  androidDownloadPath: "/api/android-download",
  androidVersion: import.meta.env.VITE_ANDROID_APP_VERSION || null,
  // TestFlight is invite-per-tester. Leave false until confirmed live.
  iosTestFlightLive: import.meta.env.VITE_IOS_TESTFLIGHT_LIVE === "true",
  iosTestFlightUrl: configuredTestFlightUrl(import.meta.env.VITE_IOS_TESTFLIGHT_URL),
};

export const COMPANY = {
  legalName: import.meta.env.VITE_COMPANY_LEGAL_NAME || "New Frequency",
  // No trading address yet — the policy simply omits it rather than showing a
  // placeholder. Set this and the pages pick it up.
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || null,
};

// Feedback REST endpoint configured by the operator. supabase/setup.sql
// currently places these write-only tables in the existing app project.
// Base REST URL, e.g. https://<project>.supabase.co/rest/v1 (no trailing slash).
export const FEEDBACK_API_BASE = import.meta.env.VITE_FEEDBACK_API_BASE || (import.meta.env.VITE_APP_SUPABASE_URL ? `${import.meta.env.VITE_APP_SUPABASE_URL.replace(/\/$/, "")}/rest/v1` : null);
export const FEEDBACK_KEY = import.meta.env.VITE_FEEDBACK_ANON_KEY || import.meta.env.VITE_APP_SUPABASE_ANON_KEY || null;

export const CONTENT_TYPES = [
  { name: "Reels", color: "reels", desc: "Short videos, recorded in the app or selected from your camera roll." },
  { name: "Tunes", color: "tunes", desc: "Music posts that creators can select as audio for their own posts." },
  { name: "Snaps", color: "snaps", desc: "Photos made in the app or selected from your camera roll." },
  { name: "Chat", color: "chats", desc: "Text posts for thoughts, updates and conversation." },
];
