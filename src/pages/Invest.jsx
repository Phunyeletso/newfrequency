import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import useDocumentTitle from "../lib/useDocumentTitle";
import { isAppBackendConfigured, supabase } from "../lib/supabaseClient";
import { capitalUpdateService } from "../lib/capitalUpdateService";

const RISKS = [
  ["Early product", "newFrequency is in testing. The product, business model and release plan may change."],
  ["Adoption", "There is no promise that creators, viewers or brands will adopt the platform at a sustainable rate."],
  ["Execution", "Building safe media, reliable payments and useful creator tools takes time and may cost more than planned."],
  ["Rules and providers", "App-store, privacy, payment and financial rules can change. Provider access can also be restricted."],
];

export default function Invest() {
  useDocumentTitle("Company updates", "Learn what newFrequency is building. No investment offering is currently open.");

  return (
    <>
      <section className="story-hero invest-hero">
        <div className="page-container">
          <p className="eyebrow"><span className="signal-dot" /> The company we are building</p>
          <h1 className="display-title">A new home<br />for creator<br /><em>culture.</em></h1>
          <p className="lead-copy">newFrequency brings short video, photos, conversation and music into one creator-social app. We are building it from South Africa, with creators at the centre.</p>
          <div className="button-row"><Link className="button-primary" to="/company">About the company <span className="button-arrow" aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <div className="invest-statement">
              <p className="section-kicker">Where we are</p>
              <h2>Product in testing. Offering not open.</h2>
              <p>This page introduces the product and the company’s direction. It is not an invitation to invest or contribute. No investment account, instrument, price, valuation or return has been approved for this website.</p>
              <p>We will publish the issuer details, legal documents, fees, risks and any offering terms before any future offering can be considered.</p>
              <Link className="button-secondary" to="/invest/dashboard">Get company updates</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section music-section">
        <div className="page-container story-grid">
          <div>
            <p className="section-kicker">The starting point</p>
            <h2 className="section-title">Creators should not have to split every idea across a dozen places.</h2>
          </div>
          <p className="section-lead">Our product brings four post formats—Reels, Snaps, Chat and Tunes—into a shared social feed. The opportunity is an idea we are testing, not a measured market claim or a promise of growth.</p>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <ScrollReveal>
            <p className="section-kicker">What exists today</p>
            <h2 className="section-title">Build status, stated plainly.</h2>
          </ScrollReveal>
          <div className="story-rail" style={{ marginTop: 40 }}>
            <article><span>CORE</span><h3>Post and discover</h3><p>The app has creator profiles, a feed, and Reels, Snaps, Chat and Tune formats.</p></article>
            <article><span>TESTING</span><h3>Creator support</h3><p>Coin gifts and eligible paid-scroll flows are under release testing. Earnings and payouts are not guaranteed.</p></article>
            <article><span>IN PROGRESS</span><h3>Business campaigns</h3><p>Missions move through business verification, server-verified Paystack funding and campaign review before launch.</p></article>
          </div>
          <p className="fine-print" style={{ marginTop: 18 }}>There are no published user, revenue, retention, partnership or growth figures on this page.</p>
        </div>
      </section>

      <section className="section warm-section">
        <div className="page-container story-grid">
          <div><p className="section-kicker">A future capital plan</p><h2 className="section-title">No budget has been approved.</h2></div>
          <div>
            <p className="section-lead">If the company opens an offering, its documents will state exactly what capital is intended to fund. Product reliability and safety, creator tools, and Business/Mission infrastructure are current areas of work—not approved allocations.</p>
            <p className="section-lead">No dates, amounts or valuation are being offered here.</p>
          </div>
        </div>
      </section>

      <section className="section roadmap-section">
        <div className="page-container">
          <p className="section-kicker">What comes next</p>
          <h2 className="section-title">A roadmap of checkpoints, not promises.</h2>
          <p className="section-lead">These are areas that need to be resolved before broader access or any offering. There are no target dates attached.</p>
          <div className="story-rail" style={{ marginTop: 34 }}>
            <article><span>01 · RELEASE</span><h3>Prove the install path</h3><p>Validate current builds, account setup and core use on supported devices before widening access.</p></article>
            <article><span>02 · CREATOR SUPPORT</span><h3>Complete the money flows</h3><p>Finish provider, eligibility, transaction and payout checks before describing creator earnings as available.</p></article>
            <article><span>03 · MISSIONS</span><h3>Close the campaign gaps</h3><p>Complete business verification, funding, campaign terms and operational review before a Mission can launch.</p></article>
            <article><span>04 · COMPANY</span><h3>Establish offering readiness</h3><p>Approve the legal structure, risk disclosures, verification and audited payment records before publishing investment documents.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <p className="section-kicker">Risks to understand</p>
          <h2 className="section-title">Early-stage work carries real risk.</h2>
          <div className="risk-grid" style={{ marginTop: 35 }}>
            {RISKS.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
          </div>
          <div className="closed-state" style={{ marginBottom: 0 }}>
            <p className="section-kicker">No offering is open</p>
            <h2>There is nothing to buy or contribute here.</h2>
            <p>No payment will create shares or investor rights. Any future offering would need an approved legal structure, a verified payment and ledger system, and complete documents first.</p>
            <Link className="button-secondary" to="/invest/dashboard">Get company updates</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function InvestDashboard() {
  useDocumentTitle("Company updates", "Opt in to future newFrequency company updates. No investment offering is open.");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signup, setSignup] = useState(null);
  const [updatesAvailable, setUpdatesAvailable] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAppBackendConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError("We could not check your newFrequency account. Refresh the page to try again.");
      setSession(data?.session ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setSignup(null);
      setUpdatesAvailable(null);
      setSignupLoading(false);
      return undefined;
    }
    let active = true;
    setSignupLoading(true);
    setUpdatesAvailable(null);
    setConsent(false);
    capitalUpdateService.status(session.user.id).then((result) => {
      if (!active) return;
      if (result.ok) {
        setSignup(result.data);
        setUpdatesAvailable(true);
      }
      else {
        setSignup(null);
        setUpdatesAvailable(false);
      }
      setSignupLoading(false);
    });
    return () => { active = false; };
  }, [session?.user?.id]);

  async function authenticate(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: `${window.location.origin}/invest/dashboard` },
          });
      if (result.error) throw result.error;
      if (mode === "signup" && !result.data.session) setMessage("Check your inbox for a confirmation link, then return here to sign in.");
      else if (mode === "signup") setMessage("Your newFrequency account is ready. Choose whether to receive company updates below.");
    } catch {
      setError("We could not complete sign-in. Check your email and password, or try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  async function joinUpdates() {
    if (!session || !consent) return;
    setBusy(true);
    setError("");
    setMessage("");
    const result = await capitalUpdateService.join();
    setBusy(false);
    if (!result.ok) {
      setUpdatesAvailable(false);
      return;
    }
    setSignup(result.data);
    setConsent(false);
    setMessage("Your opt-in for future company updates has been recorded.");
  }

  async function withdrawUpdates() {
    if (!session) return;
    setBusy(true);
    setError("");
    const result = await capitalUpdateService.withdraw(session.user.id);
    setBusy(false);
    if (!result.ok) {
      setError("We could not remove your update preference. Try again.");
      return;
    }
    setSignup(null);
    setMessage("You have been removed from the company updates list.");
  }

  async function signOut() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError("Sign-out did not complete. Try again.");
    setMessage("");
  }

  return (
    <section className="section">
      <div className="page-container">
        <div className="closed-state">
          <p className="section-kicker">Company updates</p>
          <h1>No investment offering is open.</h1>
          <p>This page can record your choice to receive future company updates. It cannot accept an investment, amount or payment, and it creates no ownership or return rights.</p>
          {!isAppBackendConfigured && <p className="workspace-message">Shared newFrequency account access is not connected on this site yet.</p>}
          {isAppBackendConfigured && loading && <p className="workspace-message" role="status">Checking your newFrequency account…</p>}
          {isAppBackendConfigured && !loading && !session && <div className="auth-card">
            <p className="section-kicker">Use your app account</p>
            <div className="auth-tabs" role="group" aria-label="Account action">
              <button type="button" aria-pressed={mode === "signin"} onClick={() => { setMode("signin"); setMessage(""); setError(""); }}>Sign in</button>
              <button type="button" aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setMessage(""); setError(""); }}>Create account</button>
            </div>
            <form className="form-grid" onSubmit={authenticate}>
              <div className="form-field"><label htmlFor="updates-email">Email</label><input id="updates-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
              <div className="form-field"><label htmlFor="updates-password">Password</label><input id="updates-password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
              <button type="submit" className="button-primary" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
            </form>
          </div>}
          {session && <div className="auth-card">
            <div className="workspace-actions"><span className="status-tag">{session.user.email}</span><button type="button" className="small-button" onClick={signOut}>Sign out</button></div>
            {signupLoading && <p className="workspace-message" role="status">Checking your update preference…</p>}
            {!signupLoading && updatesAvailable === false && <p className="workspace-message" role="status">Company updates are not connected yet. Your account has not been changed.</p>}
            {!signupLoading && signup && <>
              <h2>You’re on the company updates list.</h2>
              <p>Your account email is associated with future company progress and funding-plan updates. This is not an investment offer.</p>
              <button type="button" className="small-button" onClick={withdrawUpdates} disabled={busy}>Remove my preference</button>
            </>}
            {!signupLoading && updatesAvailable && !signup && <>
              <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>I agree that New Frequency may use my account email for occasional company progress and future funding-plan updates. This is not an investment offer and does not commit me to invest.</span>
              </label>
              <button type="button" className="button-primary" onClick={joinUpdates} disabled={!consent || busy}>{busy ? "Saving…" : "Join company updates"}</button>
              <p className="fine-print">You can remove this preference at any time. See the <Link className="link-underline" to="/privacy">privacy policy</Link>.</p>
            </>}
          </div>}
          {error && <p className="workspace-message error" role="alert">{error}</p>}
          {message && <p className="workspace-message" role="status">{message}</p>}
          <Link className="button-secondary" to="/invest">Read the company overview</Link>
        </div>
      </div>
    </section>
  );
}
