/**
 * Emails you every message the website receives.
 *
 * WHY THIS EXISTS
 * The three forms on the site write a row and stop. A row in a table nobody
 * opens is the same as no form at all: somebody types out what they think of
 * the test build, presses send, is told it went through, and it sits there for
 * a month. This function is the other half. The row is still the record; this
 * is the doorbell.
 *
 * HOW IT IS CALLED
 * A database trigger on INSERT, one per table (supabase/setup.sql). Supabase
 * calls it with the standard webhook shape:
 *
 *   { type: "INSERT", table: "feedback", schema: "public", record: {...} }
 *
 * DEPLOY WITH --no-verify-jwt. The caller is Postgres, not a signed in user,
 * so there is no JWT to check. The door is held instead by a shared secret in
 * the `x-webhook-secret` header, compared below. Without that secret this
 * function is an open endpoint that will email you anything anyone posts to it.
 *
 * FAILING IS NOT ALLOWED TO COST THE MESSAGE
 * The row is already committed by the time this runs. If Resend is down or the
 * key is wrong, this returns 200 with the failure in the body and logs it: a
 * non-2xx would make the trigger look broken in the dashboard's webhook log
 * without saving anything, and the message is still safely in the table for
 * `select * from feedback order by submitted_at desc`.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * No retries, no queue, no templating library. This is one POST to one API.
 */

// ── Configuration, all from secrets ────────────────────────────────────────
// supabase secrets set RESEND_API_KEY=... NOTIFY_TO=... WEBHOOK_SECRET=...
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "";

// Resend will only send from a domain you have verified with them. Until the
// newFrequency domain is verified, their sandbox sender works and delivers to
// the address that owns the Resend account, which is enough to get going.
const NOTIFY_FROM =
  Deno.env.get("NOTIFY_FROM") ?? "newFrequency <onboarding@resend.dev>";

// ── What each table's email looks like ─────────────────────────────────────
// Field order is reading order, not column order: the thing you want to know
// first goes first.
type Shape = { subject: (r: Row) => string; fields: [string, string][] };
type Row = Record<string, unknown>;

const SHAPES: Record<string, Shape> = {
  feedback: {
    subject: (r) => `Feedback: ${r.rating}/5, keep using: ${r.would_keep_using}`,
    fields: [
      ["rating", "Rating"],
      ["would_keep_using", "Would keep using"],
      ["liked", "What they liked"],
      ["disliked", "What they did not like"],
      ["device", "Device"],
      ["email", "Their email"],
      ["referring_page", "Came from"],
      ["submitted_at", "Sent at"],
    ],
  },
  enquiries: {
    subject: (r) => `Enquiry (${r.topic}) from ${r.email}`,
    fields: [
      ["topic", "Topic"],
      ["email", "Their email"],
      ["message", "Message"],
      ["referring_page", "Came from"],
      ["submitted_at", "Sent at"],
    ],
  },
  invite_requests: {
    subject: (r) => `iOS invite request from ${r.email}`,
    fields: [
      ["email", "Their email"],
      ["platform", "Platform"],
      ["referring_page", "Came from"],
      ["submitted_at", "Sent at"],
    ],
  },
};

const escapeHtml = (v: unknown) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * The email body.
 *
 * Everything a visitor typed is escaped. This is the one place in either
 * project where text from a stranger is put into a document, and an unescaped
 * message field is a link, an image beacon or a bit of markup rendered inside
 * your own inbox. It is also why the whole row is dumped as plain labelled
 * text rather than being interpreted in any way.
 */
function buildHtml(table: string, record: Row): string {
  const shape = SHAPES[table];
  const rows = (shape?.fields ?? Object.keys(record).map((k) => [k, k] as [string, string]))
    .filter(([key]) => record[key] !== null && record[key] !== undefined && record[key] !== "")
    .map(([key, label]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font:600 13px/18px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#6b7280;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font:14px/21px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;white-space:pre-wrap;">${escapeHtml(record[key])}</td>
      </tr>`)
    .join("");

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;">
    <tr><td style="padding:20px 22px 14px 22px;border-bottom:1px solid #e5e7eb;">
      <div style="font:600 16px/22px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">new<span style="color:#16a34a;">Frequency</span> website</div>
      <div style="font:13px/19px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#6b7280;margin-top:2px;">New ${escapeHtml(table)} submission</div>
    </td></tr>
    <tr><td style="padding:6px 8px 8px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
    <tr><td style="padding:14px 22px 20px 22px;font:12px/18px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#9ca3af;">
      Saved in the website database. Reply to this email to answer them directly, where they left an address.
    </td></tr>
  </table>
  </body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  // Refuse before reading the body. An unauthenticated caller should not get
  // to find out what shapes this accepts.
  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  let payload: { type?: string; table?: string; record?: Row };
  try {
    payload = await req.json();
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const table = payload.table ?? "";
  const record = payload.record;
  if (payload.type !== "INSERT" || !record || !SHAPES[table]) {
    // Not something worth emailing. 200 so the trigger log stays clean.
    return Response.json({ skipped: true, table, type: payload.type });
  }

  if (!RESEND_API_KEY || !NOTIFY_TO) {
    console.error("notify-submission: RESEND_API_KEY or NOTIFY_TO is not set");
    return Response.json({ sent: false, reason: "not_configured" });
  }

  // Where a visitor left an address, make the notification replyable straight
  // to them. Answering an enquiry should not mean copying an address out of a
  // table by hand.
  const replyTo = typeof record.email === "string" && record.email.includes("@")
    ? record.email
    : undefined;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject: SHAPES[table].subject(record),
        html: buildHtml(table, record),
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`notify-submission: resend refused ${res.status}: ${detail}`);
      return Response.json({ sent: false, status: res.status, detail });
    }

    return Response.json({ sent: true, table });
  } catch (err) {
    // The row is already saved, so this is a missed doorbell and not a lost
    // message. Logged loudly, reported as 200. See the header.
    console.error("notify-submission: send failed", err);
    return Response.json({ sent: false, reason: String(err) });
  }
});
