// App identity — confirmed in the brief.
export const APP = {
  name: "newFrequency",
  // Shown on /get-the-app under the download button. Keep in step with the
  // app's app.json version, or the site advertises a build nobody can get.
  version: "1.0.4",
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
  // Current production APK. Keep this alongside APP.version because the
  // hosting environment may retain an older Vercel variable.
  androidApkUrl: "https://expo.dev/artifacts/eas/czK-1ai_YzUwwoiNwbhu8kD2pFdN1KM3vudZQUd5750.apk",
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
  { name: "Reels", color: "reels", desc: "Short video, shot in the app or uploaded. Any track can play over it, and the creator can earn through gifts, optional pay-per-scroll support and ad revenue share." },
  { name: "Tunes", color: "tunes", desc: "A song posted by the artist. Anyone can use it freely, while the artist can earn through gifts, optional pay-per-scroll support and ad revenue share." },
  { name: "Snaps", color: "snaps", desc: "A photo, shot in the app or uploaded. Any track can play over it, with the same creator monetisation." },
  { name: "Chat", color: "chats", desc: "A text post. Any track can play over it, with the same creator monetisation." },
  { name: "Live", color: "reels", desc: "A live stream where viewers can support the creator with gifts in real time." },
];
