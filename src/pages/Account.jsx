import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AccountGate from "../components/AccountGate";
import { supabase } from "../lib/supabaseClient";
import useDocumentTitle from "../lib/useDocumentTitle";

function AccountWorkspace({ session, recovery }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(session.user.user_metadata?.name || "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    supabase.rpc("get_own_account").then(({ data, error: failure }) => {
      if (!active) return;
      if (failure) setError("Could not load your account details. Refresh to retry.");
      else { setProfile(data); setName(data?.name || session.user.user_metadata?.name || ""); }
    });
    return () => { active = false; };
  }, [session.user.id, session.user.user_metadata?.name]);
  async function updatePassword(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const { error: failure } = await supabase.auth.updateUser({ password });
      if (failure) throw failure;
      setPassword(""); setMessage("Password updated. Use it in the app and here.");
    } catch (failure) { setError(failure.message || "Could not update your password. Try again."); }
    finally { setBusy(false); }
  }
  async function updateName(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      // The account profile is the app's public.users record; auth metadata is
      // only the signup seed and must not replace the profile update.
      const { error: failure } = await supabase.from("users").update({ name: name.trim() }).eq("id", session.user.id);
      if (failure) throw failure;
      setMessage("Your display name has been updated.");
    } catch (failure) { setError(failure.message || "Could not save your display name."); }
    finally { setBusy(false); }
  }
  return <div className="account-workspace">
    <div className="account-destinations">
      <Link to="/business/missions"><span>01 · MISSIONS</span><h2>Your next campaign.</h2><p>Create. Fund. Launch.</p><b aria-hidden="true">↗</b></Link>
      <Link to="/invest/dashboard"><span>02 · BACK A PROJECT</span><h2>Build what’s next.</h2><p>Your contributions and receipts.</p><b aria-hidden="true">↗</b></Link>
    </div>
    {profile?.deletion_requested_at && <p role="alert" className="workspace-message">Your account is scheduled for deletion. <Link to="/delete-account">Manage the request</Link>.</p>}
    <div className="account-settings">
      <form className="auth-card form-grid" onSubmit={updateName}><h2>Your name</h2><div className="form-field"><label htmlFor="account-name">Display name</label><input id="account-name" required maxLength={100} autoComplete="name" value={name} onChange={event => setName(event.target.value)} /></div><button className="small-button" disabled={busy || !profile} type="submit">Save name</button></form>
      <form className="auth-card form-grid" onSubmit={updatePassword}><h2>{recovery ? "Choose a new password" : "Password"}</h2><div className="form-field"><label htmlFor="account-new-password">New password</label><input id="account-new-password" required type="password" autoComplete="new-password" minLength={6} value={password} onChange={event => setPassword(event.target.value)} /></div><button className="small-button" disabled={busy} type="submit">Update password</button></form>
    </div>
    {error && <p className="workspace-message is-error" role="alert">{error}</p>}{message && <p className="workspace-message" role="status">{message}</p>}
    <Link className="text-link" to="/delete-account">Manage account deletion →</Link>
    {profile?.is_moderator && <div className="button-row"><Link className="small-button" to="/team">Team inbox</Link><Link className="small-button" to="/business/review">Mission review</Link></div>}
  </div>;
}

function AccountLanding({ recovery }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(recovery ? "/account/settings?recovery=1" : "/business/missions", { replace: true });
  }, [navigate, recovery]);
  return <p className="workspace-message" role="status">Opening your workspace…</p>;
}

export default function Account() {
  useDocumentTitle("Sign in", "Sign in to newFrequency.");
  const [params] = useSearchParams();
  return <AccountGate showHeading={false} redirectPath="/business/missions"><AccountLanding recovery={params.get("recovery") === "1"} /></AccountGate>;
}

export function AccountSettings() {
  useDocumentTitle("Account settings", "Manage your newFrequency account settings.");
  const [params] = useSearchParams();
  return <AccountGate title="Account settings" redirectPath="/account/settings" showHeading>{session => <AccountWorkspace session={session} recovery={params.get("recovery") === "1"} />}</AccountGate>;
}
