export const SITE_ORIGIN = "https://www.newfrequency.co.za";
export const SOCIAL_IMAGE = `${SITE_ORIGIN}/og-newfrequency.svg`;

export const SEO_BY_ROUTE = {
  "/": { title: "Social media that pays attention.", description: "Post videos, pictures, music and quotes your way on newFrequency. Discover creators, go live, explore creator Missions and earn from eligible paid views and gifts." },
  "/creators": { title: "For creators", description: "Post videos, pictures and quotes your way on newFrequency. Reels, Tunes, Snaps and Chats." },
  "/for-artists": { title: "For artists", description: "Post a Tune on newFrequency. Creators can choose a Tune as audio for a new post." },
  "/business": { title: "For business", description: "Create a newFrequency Mission, submit campaign details for review and use Paystack checkout after business verification." },
  "/business/create": { title: "Create a Mission", description: "Sign in to newFrequency, submit a creator campaign for verification and continue to Paystack checkout when enabled.", noindex: true },
  "/business/missions": { title: "Business workspace", description: "Manage your newFrequency Mission drafts and submissions.", noindex: true },
  "/invest": { title: "Company updates", description: "Learn what newFrequency is building and opt in to future company updates. No investment offering is open." },
  "/invest/dashboard": { title: "Company updates", description: "Use your newFrequency account to opt in to company progress updates. No investment offering or payment flow is open.", noindex: true },
  "/company": { title: "About newFrequency", description: "A South African creator-social app in testing, built around video, photos, conversation and music." },
  "/get-the-app": { title: "Get the app", description: "Check current newFrequency test-build availability for Android and iPhone." },
  "/feedback": { title: "Send feedback", description: "Tell the newFrequency team what worked, what broke and what to improve." },
  "/contact": { title: "Contact newFrequency", description: "Contact the newFrequency team about the app, privacy or general enquiries." },
  "/privacy": { title: "Privacy policy", description: "How newFrequency handles personal information in the app and on this website." },
  "/terms": { title: "Terms of use", description: "Terms that apply to the newFrequency website, test build, Mission submissions and checkout when enabled." },
  "/delete-account": { title: "Delete your account", description: "How to request deletion of a newFrequency account and what records may be retained." },
  "/child-safety": { title: "Child safety standards", description: "newFrequency child safety standards and reporting information." },
  "/auth/confirmed": { title: "Email confirmed", description: "Continue to the newFrequency Business workspace.", noindex: true },
};

export function getSeo(pathname = "/") {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return SEO_BY_ROUTE[normalized] || { title: "Page not found", description: "This newFrequency page could not be found.", noindex: true };
}
