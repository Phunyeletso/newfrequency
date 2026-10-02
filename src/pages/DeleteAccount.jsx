import useDocumentTitle from "../lib/useDocumentTitle";
import { useEffect, useState } from "react";
import AccountGate from "../components/AccountGate";
import { supabase } from "../lib/supabaseClient";

const CONTACT_URL = "https://www.newfrequency.co.za/contact";

function DeletionControls() {
  const [requestedAt, setRequestedAt] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    supabase.rpc("get_own_account").then(({ data, error: failure }) => {
      if (!active) return;
      if (failure) setError("Could not check your deletion request. Refresh to retry.");
      else setRequestedAt(data?.deletion_requested_at || null);
      setLoading(false);
    }).catch(() => { if (active) { setError("Could not reach your account. Refresh to retry."); setLoading(false); } });
    return () => { active = false; };
  }, []);
  async function change(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const { error: failure } = await supabase.rpc(requestedAt ? "cancel_account_deletion" : "request_account_deletion");
      if (failure) throw failure;
      const { data, error: readFailure } = await supabase.rpc("get_own_account");
      if (readFailure) throw readFailure;
      setRequestedAt(data?.deletion_requested_at || null); setConfirmation("");
      setMessage(requestedAt ? "Deletion cancelled. Your account remains active." : "Your deletion request is saved. You can cancel during the 14-day grace period.");
    } catch (failure) { setError(failure.message || "Could not save your request. Try again."); }
    finally { setBusy(false); }
  }
  if (loading) return <p role="status">Checking your account…</p>;
  const deadline = requestedAt ? new Date(new Date(requestedAt).getTime() + 14 * 86400000) : null;
  return <form className="auth-card form-grid" onSubmit={change}>
    <h2>{requestedAt ? "Deletion scheduled" : "Request deletion"}</h2>
    {deadline ? <p>Grace period ends {deadline.toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg", day: "numeric", month: "long", year: "numeric" })}. Cancel to keep your account.</p> : <><p>This applies to your account in the app and on the website. Type DELETE to start the 14-day grace period.</p><div className="form-field"><label htmlFor="deletion-confirmation">Type DELETE</label><input id="deletion-confirmation" autoComplete="off" required pattern="DELETE" value={confirmation} onChange={event => setConfirmation(event.target.value)} /></div></>}
    {error && <p className="workspace-message is-error" role="alert">{error}</p>}{message && <p className="workspace-message" role="status">{message}</p>}
    <button className="button-secondary" type="submit" disabled={busy || (!requestedAt && confirmation !== "DELETE")}>{busy ? "Saving…" : requestedAt ? "Cancel deletion" : "Request account deletion"}</button>
  </form>;
}

export default function DeleteAccount() {
  useDocumentTitle(
    "Delete your account",
    "How to request deletion of your New Frequency account and associated data.",
  );

  return (
    <>
    <AccountGate title="Your account. Your choice." description="Manage deletion from here." redirectPath="/delete-account">{() => <DeletionControls />}</AccountGate>
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">Delete your New Frequency account</h1>
        <p className="mt-3 text-sm text-faint">Account deletion instructions</p>

        <div className="mt-8 space-y-8 text-muted text-pretty">
          <section>
            <h2 className="mb-3 text-xl text-ink">How to request deletion</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Open the New Frequency app and sign in.</li>
              <li>Open your account settings.</li>
              <li>Select <strong className="font-medium text-ink">Delete account</strong>.</li>
              <li>Confirm the deletion request.</li>
            </ol>
            <p className="mt-4">
              You can also request help with account deletion through the{" "}
              <a
                href={CONTACT_URL}
                className="link-underline text-ink"
                rel="noopener noreferrer"
                target="_blank"
              >
                New Frequency contact form
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">What happens next</h2>
            <p>
              A deletion request starts a 14-day grace period. During that period,
              you can sign in again and cancel the request. After the grace period,
              the deletion process begins and cannot be undone.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Data deleted or anonymised</h2>
            <p>
              After the grace period, New Frequency deletes your account content,
              including posts, messages, comments, reports, notifications, push
              identifiers and ordinary media where the system can identify it. Your
              profile is anonymised and the authentication account is deleted.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Data that may be retained</h2>
            <p>
              Transaction and coin ledger rows may be retained and de-identified
              because they reconcile another person’s wallet and may be needed for
              accounting or disputes. Store purchase records, coin-credit and refund
              records may also be retained for fraud prevention, refunds, accounting
              and reconciliation. Private KYC documents and their audit record may
              be retained where required for seller, payment, fraud or legal
              obligations. These records may be kept for the period required for
              those purposes.
            </p>
          </section>

          <p>
            For more information, read the{" "}
            <a
              href="https://www.newfrequency.co.za/privacy"
              className="link-underline text-ink"
              rel="noopener noreferrer"
              target="_blank"
            >
              New Frequency Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
