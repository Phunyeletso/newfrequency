import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAccountSession } from "../lib/useAccountSession";

function authError(error) {
  if (/invalid.*credentials/i.test(error?.message)) return "Check your email and password, then try again.";
  if (/email.*not.*confirmed/i.test(error?.message)) return "Confirm your email using the code in your inbox.";
  if (/rate|too many|after.*second/i.test(error?.message)) return "Give it a moment before requesting another code.";
  if (/expired|invalid.*(otp|token)/i.test(error?.message)) return "That code is invalid or expired. Request a new one.";
  return error?.message || "Could not connect. Your details are still here; try again.";
}

export function AuthForm({ redirectPath = "/account" }) {
  const id = useId();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    if (clock >= resendAt) return undefined;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [clock, resendAt]);

  function choose(next) { setMode(next); setError(""); setMessage(""); setCode(""); setPassword(""); }
  async function perform(operation, success) {
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await operation();
      if (result.error) throw result.error;
      success?.(result.data);
    } catch (failure) { setError(authError(failure)); }
    finally { setBusy(false); }
  }
  const redirect = () => `${window.location.origin}${redirectPath}`;
  async function submit(event) {
    event.preventDefault();
    const address = email.trim();
    if (mode === "signin") return perform(() => supabase.auth.signInWithPassword({ email: address, password }), () => setPassword(""));
    if (mode === "signup") return perform(() => supabase.auth.signUp({ email: address, password, options: { data: { name: name.trim() }, emailRedirectTo: redirect() } }), (data) => {
      setPassword("");
      if (!data.session) { setMode("confirm"); setResendAt(Date.now() + 60000); setClock(Date.now()); setMessage("Enter the confirmation code we emailed you. A confirmation link also works if your email includes one."); }
    });
    if (mode === "confirm") return perform(() => supabase.auth.verifyOtp({ email: address, token: code.trim(), type: "signup" }));
    if (mode === "reset") return perform(() => supabase.auth.resetPasswordForEmail(address, { redirectTo: `${window.location.origin}/account?recovery=1` }), () => {
      setMode("recovery"); setResendAt(Date.now() + 60000); setClock(Date.now()); setMessage("Enter the reset code from your inbox.");
    });
    if (mode === "recovery") return perform(() => supabase.auth.verifyOtp({ email: address, token: code.trim(), type: "recovery" }), () => {
      window.location.assign(`${window.location.origin}/account?recovery=1`);
    });
  }
  async function resend() {
    if (Date.now() < resendAt) return;
    await perform(() => mode === "confirm"
      ? supabase.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: redirect() } })
      : supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/account?recovery=1` }), () => {
      setMessage("A new code is on its way."); setResendAt(Date.now() + 60000); setClock(Date.now());
    });
  }
  const codeMode = mode === "confirm" || mode === "recovery";
  return <div className="auth-card account-auth">
    <h2>{mode === "signup" ? "Make it yours." : codeMode ? "Check your inbox." : mode === "reset" ? "Back in your hands." : "Pick up where you left off."}</h2>
    {(mode === "signin" || mode === "signup") && <div className="auth-tabs" role="group" aria-label="Account action">
      <button type="button" disabled={busy} aria-pressed={mode === "signin"} onClick={() => choose("signin")}>Sign in</button>
      <button type="button" disabled={busy} aria-pressed={mode === "signup"} onClick={() => choose("signup")}>Create account</button>
    </div>}
    <form className="form-grid" onSubmit={submit} aria-busy={busy}>
      {mode === "signup" && <div className="form-field"><label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} autoComplete="name" required maxLength={100} value={name} onChange={event => setName(event.target.value)} /></div>}
      <div className="form-field"><label htmlFor={`${id}-email`}>Email</label><input id={`${id}-email`} type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></div>
      {(mode === "signin" || mode === "signup") && <div className="form-field"><label htmlFor={`${id}-password`}>Password</label><input id={`${id}-password`} type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 6 : undefined} required value={password} onChange={event => setPassword(event.target.value)} /><label className="consent-check"><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)} /><span>Show password</span></label></div>}
      {codeMode && <div className="form-field"><label htmlFor={`${id}-code`}>Email code</label><input id={`${id}-code`} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,10}" minLength={6} maxLength={10} required value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ""))} /></div>}
      {error && <p role="alert" className="workspace-message is-error">{error}</p>}
      {message && <p role="status" className="workspace-message">{message}</p>}
      <button className="button-primary" type="submit" disabled={busy}>{busy ? "One moment…" : mode === "signup" ? "Create account" : mode === "signin" ? "Sign in →" : mode === "reset" ? "Send reset code" : "Confirm code"}</button>
    </form>
    {mode === "signin" && <div className="workspace-actions"><button type="button" className="text-link" onClick={() => choose("reset")}>Forgot password?</button></div>}
    {codeMode && <button type="button" className="small-button" disabled={busy || clock < resendAt || !email} onClick={resend}>{clock < resendAt ? `Resend in ${Math.ceil((resendAt - clock) / 1000)}s` : "Resend code"}</button>}
    {!['signin', 'signup'].includes(mode) && <button type="button" className="text-link" onClick={() => choose("signin")}>Back to sign in</button>}
    {mode === "signup" && <p className="fine-print">By joining, you agree to the <Link to="/terms">terms</Link> and <Link to="/privacy">privacy policy</Link>.</p>}
  </div>;
}

export default function AccountGate({ children, title = "Your workspace", description, showHeading = true, showIdentity = true, showAccountActions = true, fullScreen = false, wide = false, compact = false, redirectPath = "/account" }) {
  const { session, loading, error } = useAccountSession();
  const [signOutError, setSignOutError] = useState("");
  async function signOut() {
    try {
      const { error: failure } = await supabase.auth.signOut();
      setSignOutError(failure ? authError(failure) : "");
    } catch { setSignOutError("Could not sign out. Check your connection and retry."); }
  }
  return <section className={`account-section${compact ? " campaign-account-section" : " section"}${fullScreen && session ? " sales-account-section" : ""}`}><div className={wide ? "page-container-wide" : "page-container"}>
    {(showHeading || (session && showAccountActions)) && <div className="workspace-heading">{showHeading && <div><p className="section-kicker">newFrequency</p><h1 className="section-title">{title}</h1>{description && <p className="section-lead">{description}</p>}</div>}{session && showAccountActions && <div className="workspace-actions"><Link className="small-button" to="/account/settings">Account settings</Link><button className="small-button" type="button" onClick={signOut}>Sign out</button></div>}</div>}
    {!supabase ? <p role="alert" className="workspace-message is-error">Account service configuration is missing. Contact the team to restore access.</p> : loading ? <p className="workspace-message" role="status">Opening your workspace…</p> : session ? <>{showIdentity && <div className="account-identity"><span className="signal-dot" />{session.user.email}</div>}{typeof children === "function" ? children(session, { signOut }) : children}</> : <AuthForm redirectPath={redirectPath} />}
    {(error || signOutError) && <p className="workspace-message is-error" role="alert">{error || signOutError}</p>}
  </div></section>;
}
