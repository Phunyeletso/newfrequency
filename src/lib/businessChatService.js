import { supabase } from "./supabaseClient";

export function createBusinessChatService(client) {
  async function request(name, args) {
    if (!client) return { ok: false, code: "not_configured" };
    try {
      const { data, error } = await client.rpc(name, args);
      return error ? { ok: false, code: error.code, message: error.message } : { ok: true, data };
    } catch {
      return { ok: false, code: "network_error" };
    }
  }
  return {
    list: (team = false) => request("list_business_conversations", { p_team: team }),
    messages: (id) => request("business_conversation_messages", { p_conversation_id: id }),
    save: (conversation) => request("save_business_conversation", {
      p_id: conversation.id, p_title: conversation.title, p_draft: conversation.draft || "",
    }),
    send: ({ conversationId, id, body }) => request("send_business_conversation_message", {
      p_conversation_id: conversationId, p_message_id: id, p_body: body,
    }),
  };
}

export const businessChatService = createBusinessChatService(supabase);

export const CAMPAIGN_PROMPTS = [
  { label: "Goal", text: "What would you like this campaign to achieve? Tell us about your brand and the result you have in mind." },
  { label: "Audience", text: "Who do you want to reach? Include locations, interests and any audience details that matter." },
  { label: "Budget", text: "What budget range are you considering, and in which currency? An estimate is fine." },
  { label: "Platforms", text: "Where should the campaign run, and what content formats would you like?" },
  { label: "Timing", text: "When would you like to launch? Include any deadlines or key dates." },
  { label: "Links & assets", text: "Share relevant website, product or asset links. Make sure the sales team can access them." },
];

export function chatError(result) {
  if (["PGRST202", "42883", "42P01", "not_configured"].includes(result?.code)) return "Sales chat is temporarily unavailable. Your drafts stay saved on this device. Retry later to send them.";
  if (/team_required|conversation_not_found/.test(result?.message || "")) return "This conversation is unavailable or you don’t have access to it.";
  return "Could not connect to sales chat. Your draft is saved on this device. Check your connection and retry.";
}

export function readChatDrafts(userId) {
  try {
    const drafts = JSON.parse(localStorage.getItem(`nf-business-chats:${userId}`) || "{}");
    if (!drafts || typeof drafts !== "object" || Array.isArray(drafts)) return {};
    return Object.fromEntries(Object.entries(drafts).filter(([id, draft]) => draft?.id === id && typeof draft.title === "string" && typeof draft.draft === "string"));
  }
  catch { return {}; }
}

export function writeChatDrafts(userId, drafts) {
  try { localStorage.setItem(`nf-business-chats:${userId}`, JSON.stringify(drafts)); return true; }
  catch { return false; }
}
