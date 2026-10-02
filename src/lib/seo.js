export const SITE_ORIGIN = "https://www.newfrequency.co.za";
export const SOCIAL_IMAGE = `${SITE_ORIGIN}/og-newfrequency.svg`;

export const SEO_BY_ROUTE = {
  "/": { title: "Social media that pays attention.", description: "Get the newFrequency app for Android or request an iOS invite." },
  "/creators": { title: "For creators", description: "Earn from eligible coin-funded paid scrolls and gifts on newFrequency. No follower or view threshold." },
  "/for-artists": { title: "For artists", description: "Post a Tune on newFrequency. Creators can choose a Tune as audio for a new post." },
  "/business": { title: "Business enquiries", description: "Contact the newFrequency team about creator campaign availability." },
  "/sos": { title: "SOS", description: "Say “Help me” to trigger SOS AI. It will alert nearby users and automatically send them your location so they can send help." },
  "/business/create": { title: "Mission workspace", description: "Private business campaign workspace.", noindex: true },
  "/business/missions": { title: "Campaign chats", description: "Private campaign conversations with the newFrequency sales team.", noindex: true },
  "/business/campaigns": { title: "Mission workspace", description: "Manage your Mission drafts and submissions.", noindex: true },
  "/business/sales": { title: "Sales inbox", description: "Authorized team campaign conversations.", noindex: true },
  "/account/settings": { title: "Account settings", description: "Manage your account settings.", noindex: true },
  "/business/review": { title: "Mission review", description: "Authorized team review for newFrequency business and campaign verification.", noindex: true },
  "/invest": { title: "Fund what’s next", description: "Support newFrequency projects with direct contributions through Paystack." },
  "/invest/dashboard": { title: "Your contributions", description: "Fund projects and manage your newFrequency contribution receipts and refund requests.", noindex: true },
  "/invest/conversation": { title: "Investment conversation", description: "Discuss supporting newFrequency with the team.", noindex: true },
  "/account": { title: "Your account", description: "Your newFrequency account, Mission campaigns and project contributions.", noindex: true },
  "/team": { title: "Team inbox", description: "Authorized website message and access request review.", noindex: true },
  "/company": { title: "About newFrequency", description: "Social media that pays attention." },
  "/get-the-app": { title: "Get the app", description: "Download newFrequency for Android or request an iOS invite." },
  "/feedback": { title: "Send feedback", description: "Tell the newFrequency team what worked, what broke and what to improve." },
  "/contact": { title: "Contact newFrequency", description: "Contact the newFrequency team about the app, privacy or general enquiries." },
  "/privacy": { title: "Privacy policy", description: "How newFrequency handles personal information in the app and on this website." },
  "/terms": { title: "Terms of use", description: "Terms for the newFrequency website, app, Mission submissions and project contributions." },
  "/delete-account": { title: "Delete your account", description: "How to request deletion of a newFrequency account and what records may be retained." },
  "/child-safety": { title: "Child safety standards", description: "newFrequency child safety standards and reporting information." },
  "/auth/confirmed": { title: "Email confirmed", description: "Continue to the newFrequency Business workspace.", noindex: true },
};

export function getSeo(pathname = "/") {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return SEO_BY_ROUTE[normalized] || { title: "Page not found", description: "This newFrequency page could not be found.", noindex: true };
}
