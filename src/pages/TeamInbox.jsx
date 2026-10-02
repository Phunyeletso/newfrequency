import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountGate from "../components/AccountGate";
import { supabase } from "../lib/supabaseClient";
import useDocumentTitle from "../lib/useDocumentTitle";

function Inbox() {
  const [rows, setRows] = useState([]);
  const [kind, setKind] = useState("enquiries");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data, error: failure } = await supabase.rpc("website_team_inbox", { p_kind: kind });
      if (failure) throw failure;
      setRows(data || []);
    } catch (failure) { setError(failure.message.includes("reviewer_required") ? "This inbox is for authorized team members." : "Could not load the inbox. Check the connection and retry."); }
    finally { setLoading(false); }
  }, [kind]);
  useEffect(() => { load(); }, [load]);
  async function mark(row) {
    setBusy(true); setError("");
    try {
      const { error: failure } = await supabase.rpc("resolve_website_submission", { p_kind: kind, p_id: row.id, p_resolved: !row.resolved_at });
      if (failure) throw failure;
      await load();
    } catch { setError("Could not update the request. Retry."); }
    finally { setBusy(false); }
  }
  return <><div className="workspace-actions"><Link className="small-button" to="/business/sales">Campaign chats</Link><Link className="small-button" to="/business/review">Campaign review</Link><Link className="small-button" to="/invest/dashboard">Investment review</Link><button type="button" className="small-button" onClick={load} disabled={loading}>Refresh</button></div>
    <div className="auth-tabs" style={{ marginTop: 28 }} role="group" aria-label="Inbox category">{[["enquiries", "Messages"], ["feedback", "Feedback"], ["invite_requests", "Access requests"]].map(([value, title]) => <button type="button" key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{title}</button>)}</div>
    {error && <p className="workspace-message is-error" role="alert">{error}</p>}{loading && <p role="status">Loading requests…</p>}
    {!loading && !error && !rows.length && <p className="workspace-message">Your inbox is clear.</p>}
    <div className="team-inbox">{!loading && rows.map(row => <article key={row.id}><span className="section-kicker">{row.resolved_at ? "Resolved" : "Open"} · {new Date(row.submitted_at).toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg" })}</span><h2>{row.topic || (kind === "invite_requests" ? `${row.platform === "android" ? "Android" : "iOS"} access` : `Feedback · ${row.rating}/5`)}</h2>{row.message && <p>{row.message}</p>}{row.liked && <p>Worked: {row.liked}</p>}{row.disliked && <p>Improve: {row.disliked}</p>}{row.device && <p>Device: {row.device}</p>}<div className="workspace-actions">{row.email && <a className="text-link" href={`mailto:${row.email}`}>{row.email}</a>}<button type="button" className="small-button" disabled={busy} onClick={() => mark(row)}>{row.resolved_at ? "Reopen" : "Mark resolved"}</button></div></article>)}</div></>;
}
export default function TeamInbox() {
  useDocumentTitle("Team inbox", "Review website enquiries, feedback and app access requests.");
  return <AccountGate title="Keep the conversation moving." description="Messages, feedback and access requests." redirectPath="/team">{() => <Inbox />}</AccountGate>;
}
