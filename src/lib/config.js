// App identity — confirmed in the brief.
export const APP = {
  name: "newFrequency",
  // Shown on /get-the-app under the download button. Keep in step with the
  // app's app.json version, or the site advertises a build nobody can get.
  version: "1.0.2",
  androidPackage: "com.breakthrough_sa.newFrequency",
  // The app's deep link scheme, from the app repo's app.json. Used by the
  // email confirmation page to offer "Open newFrequency". Must match, or the
  // link silently does nothing on a phone that has the app.
  scheme: "newfrequency",
};

// ---------------------------------------------------------------------------
// PLACEHOLDERS — must be confirmed before launch (see HANDOVER.md).
// Anything null renders as an honest "not available yet" state rather than a
// broken link. Do not invent values here.
// ---------------------------------------------------------------------------
export const DOWNLOAD = {
  // Direct .apk link from Expo Application Services internal distribution.
  androidApkUrl: import.meta.env.VITE_ANDROID_APK_URL || null,
  // TestFlight is invite-per-tester. Leave false until confirmed live.
  iosTestFlightLive: import.meta.env.VITE_IOS_TESTFLIGHT_LIVE === "true",
  iosTestFlightUrl: import.meta.env.VITE_IOS_TESTFLIGHT_URL || null,
};

export const COMPANY = {
  legalName: import.meta.env.VITE_COMPANY_LEGAL_NAME || "New Frequency",
  // No trading address yet — the policy simply omits it rather than showing a
  // placeholder. Set this and the pages pick it up.
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || null,
};

// Feedback storage — a SEPARATE database from the app's. Never the app's.
// Base REST url, e.g. https://<project>.supabase.co/rest/v1 (no trailing slash).
export const FEEDBACK_API_BASE = import.meta.env.VITE_FEEDBACK_API_BASE || null;
export const FEEDBACK_KEY = import.meta.env.VITE_FEEDBACK_ANON_KEY || null;

export const CONTENT_TYPES = [
  { name: "Reels", color: "reels", desc: "Short video, shot in the app or uploaded. Can play over a licensed track." },
  { name: "Tunes", color: "tunes", desc: "A song put up for sale by the artist, with a set number of licences." },
  { name: "Snaps", color: "snaps", desc: "A photo, shot in the app or uploaded. Can view over a licensed track." },
  { name: "Chat", color: "chats", desc: "A text post. Can view over a licensed track." },
];
