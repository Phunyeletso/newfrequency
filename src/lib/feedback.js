import { FEEDBACK_API_BASE, FEEDBACK_KEY } from "./config";

/**
 * Feedback + invite submission.
 *
 * HARD RULE: this must point at a database that is SEPARATE from the app's
 * Supabase project. The endpoint is supplied by env var and is write-only —
 * the browser may INSERT a row and must never be able to read one back.
 * See HANDOVER.md for the table definition and row-level security policy.
 *
 * VITE_FEEDBACK_API_BASE is a base REST url, e.g.
 *   https://<project>.supabase.co/rest/v1
 * and the table name is appended to it. Any REST backend that accepts a JSON
 * POST to <base>/<table> works — this is not tied to Supabase.
 */

const COOLDOWN_KEY = "nf_last_submit";
const COOLDOWN_MS = 30_000;

export class SubmitError extends Error {
  constructor(message, { retryable = true } = {}) {
    super(message);
    this.name = "SubmitError";
    this.retryable = retryable;
  }
}

export function isConfigured() {
  return Boolean(FEEDBACK_API_BASE);
}

/** Client-side cooldown. Real rate limiting must also exist server-side. */
function checkCooldown() {
  try {
    const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    const waited = Date.now() - last;
    if (last && waited < COOLDOWN_MS) {
      const secs = Math.ceil((COOLDOWN_MS - waited) / 1000);
      throw new SubmitError(
        `You just sent one. Give it ${secs} second${secs === 1 ? "" : "s"} and try again.`,
      );
    }
  } catch (err) {
    if (err instanceof SubmitError) throw err;
    // localStorage unavailable (private mode) — not a reason to block a tester.
  }
}

function markSubmitted() {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

async function post(table, row) {
  if (!FEEDBACK_API_BASE) {
    throw new SubmitError(
      "The form isn't connected to a database yet, so this wasn't sent.",
      { retryable: false },
    );
  }

  const url = `${FEEDBACK_API_BASE.replace(/\/$/, "")}/${table}`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
        ...(FEEDBACK_KEY ? { apikey: FEEDBACK_KEY, Authorization: `Bearer ${FEEDBACK_KEY}` } : {}),
      },
      body: JSON.stringify(row),
    });
  } catch {
    throw new SubmitError(
      "Couldn't reach the server — check your connection and try again. Nothing you typed has been lost.",
    );
  }

  if (!res.ok) {
    throw new SubmitError(
      `The server rejected that (error ${res.status}). Your answers are still here — try again in a moment.`,
    );
  }

  markSubmitted();
}

/**
 * @param {object} values  Form values.
 * @param {string} honeypot  Must be empty; a bot filling it is silently dropped.
 */
export async function submitFeedback(values, honeypot) {
  if (honeypot) return; // Pretend success. Don't tell the bot.
  checkCooldown();

  await post("feedback", {
    liked: values.liked.trim(),
    disliked: values.disliked.trim(),
    rating: Number(values.rating),
    would_keep_using: values.keepUsing,
    device: values.device.trim() || null,
    email: values.email.trim() || null,
    // Automatic fields — submission time and referring page only. Nothing else.
    submitted_at: new Date().toISOString(),
    referring_page: document.referrer || null,
  });
}

export async function submitInviteRequest(email, honeypot) {
  if (honeypot) return;
  checkCooldown();

  await post("invite_requests", {
    email: email.trim(),
    platform: "ios",
    submitted_at: new Date().toISOString(),
    referring_page: document.referrer || null,
  });
}

export async function submitEnquiry(values, honeypot) {
  if (honeypot) return;
  checkCooldown();

  await post("enquiries", {
    email: values.email.trim(),
    topic: values.topic,
    message: values.message.trim(),
    submitted_at: new Date().toISOString(),
    referring_page: document.referrer || null,
  });
}
