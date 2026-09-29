import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isAppBackendConfigured, supabase } from "../lib/supabaseClient";
import { businessMissionService } from "../lib/businessMissionService";

const STEPS = [
  { id: "campaign", label: "Campaign", heading: "Set the direction" },
  { id: "brief", label: "Creator brief", heading: "Explain the work" },
  { id: "media", label: "Campaign media", heading: "Add campaign media" },
  { id: "funding", label: "Funding", heading: "Set a funding amount" },
  { id: "schedule", label: "Schedule", heading: "Choose the timing" },
  { id: "review", label: "Review", heading: "Review your draft" },
];
const EMPTY_DRAFT = {
  companyName: "",
  companyWebsite: "",
  companyEmail: "",
  legalName: "",
  registrationNumber: "",
  businessType: "",
  industry: "",
  businessPhone: "",
  representativeName: "",
  representativeTitle: "",
  title: "",
  missionType: "creator_campaign",
  primaryObjective: "brand_awareness",
  description: "",
  taskSummary: "",
  requirements: "",
  eligibility: "",
  usageRights: "",
  rewardModel: "winner_pool",
  rewardPool: "",
  winnerCount: "1",
  winnerPercentages: ["100"],
  launchAt: "",
  submissionDeadlineAt: "",
  supportAssets: [],
};

function displayError(result) {
  const detail = `${result.code || ""} ${result.message || ""}`.toLowerCase();
  if (result.code === "not_configured") return "Business accounts are temporarily unavailable.";
  if (["PGRST202", "42883", "42P01"].includes(result.code)) return "The Mission workspace is not enabled on this app release yet. Your account and draft were not changed.";
  if (result.code === "network_error") return result.message;
  if (result.code === "upload_failed") return "That campaign asset could not be uploaded. Try a smaller image or video.";
  if (detail.includes("mission_payments_disabled")) return "Mission Paystack checkout has not been enabled in the Supabase environment yet.";
  if (detail.includes("brand_verification_required")) return "Business verification must be complete before this Mission can be paid.";
  if (detail.includes("invalid_timeline")) return "Choose a submission deadline after the planned start.";
  if (detail.includes("invalid_rewards")) return "Check the creator reward pool and try again.";
  if (detail.includes("mission_incomplete")) return "Complete the campaign brief, task, reward pool and schedule before submitting.";
  return "We could not save that change. Check your connection and try again.";
}

function BusinessAuthForm() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
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
            options: { emailRedirectTo: `${window.location.origin}/business/missions` },
          });
      if (result.error) throw result.error;
      if (mode === "signup" && !result.data.session) {
        setMessage("Check your inbox for a confirmation link. Open it in this browser, then return to Business.");
      } else if (mode === "signup") {
        setMessage("Your account is ready. You can continue to the workspace.");
      }
    } catch {
      setError("We could not complete sign-in. Check your email and password, or try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <p className="section-kicker">Business workspace</p>
      <h2>Use your newFrequency account.</h2>
      <p>Business access uses the same sign-in as the app. Create a Mission draft, submit it for review, then pay through Paystack after required business verification.</p>
      <div className="auth-tabs" role="group" aria-label="Account action">
        <button type="button" aria-pressed={mode === "signin"} onClick={() => { setMode("signin"); setMessage(""); setError(""); }}>Sign in</button>
        <button type="button" aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setMessage(""); setError(""); }}>Create account</button>
      </div>
      <form className="form-grid" onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="business-email">Email</label>
          <input id="business-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="business-password">Password</label>
          <input id="business-password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
          {mode === "signup" && <span className="form-hint">Use at least 8 characters. Your app account uses the same password.</span>}
        </div>
        {error && <p className="workspace-message error" role="alert">{error}</p>}
        {message && <p className="workspace-message" role="status">{message}</p>}
        <button type="submit" className="button-primary" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
      </form>
      <p className="fine-print" style={{ marginTop: 17 }}>By continuing, you agree to the <Link className="link-underline" to="/terms">site terms</Link> and acknowledge the <Link className="link-underline" to="/privacy">privacy policy</Link>.</p>
    </div>
  );
}

function BusinessGate({ children, title, description }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isAppBackendConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAuthError("We could not check your sign-in. Refresh the page to try again.");
      setSession(data?.session ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  if (!isAppBackendConfigured) {
    return <section className="section"><div className="page-container"><div className="closed-state">
      <p className="section-kicker">Business workspace</p>
      <h1>Business sign-in is not connected here yet.</h1>
      <p>The public campaign story is available. Account access will open when the shared app authentication connection is configured for this site.</p>
      <Link className="button-secondary" to="/contact">Contact the team</Link>
    </div></div></section>;
  }
  if (loading) return <section className="section"><div className="page-container"><div className="workspace-shell" role="status">Checking your newFrequency account…</div></div></section>;
  if (!session) return <section className="section"><div className="page-container"><BusinessAuthForm />{authError && <p className="workspace-message error" role="alert">{authError}</p>}</div></section>;

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError("Sign-out did not complete. Try again.");
  }

  return (
    <section className="section">
      <div className="page-container">
        <div className="workspace-shell">
          <header className="workspace-header">
            <div><p className="section-kicker">Business workspace</p><h1>{title}</h1><p>{description}</p></div>
            <div className="workspace-actions"><span className="status-tag">{session.user.email}</span><button type="button" className="small-button" onClick={signOut}>Sign out</button></div>
          </header>
          {authError && <p className="workspace-message error" role="alert">{authError}</p>}
          {children(session.user)}
        </div>
      </div>
    </section>
  );
}

function unwrap(result) {
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

function formatZarMinor(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount / 100);
}

function MissionPaymentPanel({ mission, payment, busy, error, notice, onPay, onCheck }) {
  const funded = mission.state === "funded" || payment?.status === "funded";
  const reviewing = mission.payment_state === "payment_processing" || payment?.status === "payment_processing";
  return (
    <div className="workspace-empty">
      <p className="section-kicker">Mission payment · {mission.payment_state || mission.state}</p>
      <h2>{funded ? "Payment verified" : reviewing ? "Payment status is being checked" : "Review and pay for this Mission"}</h2>
      <p>{funded ? "The server verified the Paystack payment. The Mission remains subject to campaign review before it can launch." : reviewing ? "We have not marked this Mission as funded. Check again shortly or contact the team if the status does not update." : "The amount below was calculated by the app. Paystack will open a secure hosted checkout; your Mission is not funded until the server verifies the transaction."}</p>
      <ul className="review-list">
        <li><span>Creator reward pool</span><strong>{formatZarMinor(mission.reward_pool_minor)}</strong></li>
        <li><span>Platform fee</span><strong>{formatZarMinor(mission.platform_fee_minor)}</strong></li>
        <li><span>Tax</span><strong>{formatZarMinor(mission.tax_minor)}</strong></li>
        <li><span>Total checkout amount</span><strong>{formatZarMinor(payment?.amount_minor ?? mission.total_funding_minor)}</strong></li>
      </ul>
      <p className="fine-print">Creator percentages divide the reward pool. Platform fees are calculated separately. Payment does not publish or approve the campaign.</p>
      {payment?.status === "payment_failed" && <p className="workspace-message" role="status">The previous checkout did not complete. You can start a new checkout.</p>}
      {payment?.status === "payment_processing" && <p className="workspace-message" role="status">The provider response needs reconciliation before this Mission can be funded. <Link className="link-underline" to="/contact">Contact the team</Link> with Mission NF-{mission.id}.</p>}
      {error && <p className="workspace-message error" role="alert">{error}</p>}
      {notice && <p className="workspace-message" role="status">{notice}</p>}
      <div className="button-row">
        <button type="button" className="small-button" onClick={onCheck} disabled={busy || funded}>{busy ? "Checking…" : "Check payment status"}</button>
        {!funded && <button type="button" className="button-primary" onClick={onPay} disabled={busy || reviewing}>{busy ? "Please wait…" : "Continue to Paystack checkout"}</button>}
        <Link className="small-button" to="/business/missions">Back to Missions</Link>
      </div>
    </div>
  );
}

function MissionBuilder({ user }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const missionId = searchParams.get("mission");
  const [mission, setMission] = useState(null);
  const [configuration, setConfiguration] = useState(EMPTY_DRAFT);
  const [completed, setCompleted] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [payment, setPayment] = useState(null);
  const paymentReference = searchParams.get("payment_reference") || searchParams.get("reference");
  const [saveStatus, setSaveStatus] = useState("Draft not saved yet");
  const didCreate = useRef(false);
  const loaded = useRef(false);
  const queue = useRef(Promise.resolve());
  const timer = useRef(null);
  const latestConfig = useRef("");
  const savedConfig = useRef("");

  const persist = useCallback((nextConfig, nextStep, nextCompleted) => {
    const request = queue.current.catch(() => undefined).then(() => businessMissionService.saveDraft({
      id: missionId,
      step: nextStep,
      configuration: nextConfig,
      completedSteps: nextCompleted,
    }));
    queue.current = request.then(() => undefined, () => undefined);
    return request;
  }, [missionId]);

  useEffect(() => {
    let active = true;
    loaded.current = false;
    setLoading(true);
    setError("");

    async function loadOrCreate() {
      if (!missionId) {
        if (didCreate.current) return;
        didCreate.current = true;
        const created = await businessMissionService.createDraft();
        if (!active) return;
        if (!created.ok) {
          didCreate.current = false;
          setError(displayError(created));
          setLoading(false);
          return;
        }
        const row = unwrap(created);
        setSearchParams({ mission: String(row.id) }, { replace: true });
        return;
      }

      const [missionResult, draftResult] = await Promise.all([
        businessMissionService.get(missionId),
        businessMissionService.getDraft(missionId),
      ]);
      if (!active) return;
      const row = unwrap(missionResult);
      if (!missionResult.ok || !row || String(row.brand_id) !== String(user.id)) {
        setError("That Mission draft could not be found for this account.");
        setLoading(false);
        return;
      }
      if (!draftResult.ok) {
        setError(displayError(draftResult));
        setLoading(false);
        return;
      }
      const draft = unwrap(draftResult);
      const nextConfig = { ...EMPTY_DRAFT, ...(draft?.configuration || {}) };
      const done = Array.isArray(draft?.completed_steps) ? draft.completed_steps : [];
      latestConfig.current = JSON.stringify(nextConfig);
      savedConfig.current = latestConfig.current;
      setMission(row);
      setConfiguration(nextConfig);
      setCompleted(done);
      setStep(Math.max(0, STEPS.findIndex((item) => item.id === draft?.last_step)));
      setSaveStatus(draft?.last_saved_at ? "Saved" : "Draft ready");
      loaded.current = true;
      setLoading(false);
    }

    loadOrCreate().catch(() => {
      if (!active) return;
      setError("Could not load this Mission draft. Check your connection and retry.");
      setLoading(false);
    });
    return () => { active = false; };
  }, [missionId, setSearchParams, user.id]);

  useEffect(() => {
    if (!missionId || !paymentReference) return undefined;
    let active = true;
    setBusy(true);
    businessMissionService.verifyPayment({ missionId, reference: paymentReference }).then(async (result) => {
      if (!active) return;
      setBusy(false);
      if (!result.ok) {
        setError(displayError(result));
      } else {
        setPayment(result.data);
        setNotice(result.data?.status === "funded" ? "Paystack confirmed the payment." : "Paystack has not confirmed this payment yet. No funds have been credited to the Mission.");
        const refreshed = await businessMissionService.get(missionId);
        if (active && refreshed.ok) setMission(unwrap(refreshed));
      }
      const next = new URLSearchParams(window.location.search);
      next.delete("payment_reference");
      next.delete("reference");
      setSearchParams(next, { replace: true });
    }).catch(() => {
      if (active) { setBusy(false); setError("We could not check the Paystack result. Use Check payment status to retry."); }
    });
    return () => { active = false; };
  }, [missionId, paymentReference, setSearchParams]);

  useEffect(() => {
    latestConfig.current = JSON.stringify(configuration);
    if (!loaded.current || !missionId || latestConfig.current === savedConfig.current) return undefined;
    window.clearTimeout(timer.current);
    setSaveStatus("Unsaved changes");
    timer.current = window.setTimeout(async () => {
      setSaveStatus("Saving…");
      const fingerprint = JSON.stringify(configuration);
      const result = await persist(configuration, STEPS[step].id, completed);
      if (result.ok) {
        savedConfig.current = fingerprint;
        setSaveStatus(fingerprint === latestConfig.current ? "Saved" : "Unsaved changes");
      } else {
        setSaveStatus("Could not save");
      }
    }, 900);
    return () => window.clearTimeout(timer.current);
  }, [configuration, completed, missionId, persist, step]);

  async function saveNow(nextStep = step, nextCompleted = completed) {
    if (!missionId) return false;
    window.clearTimeout(timer.current);
    const fingerprint = JSON.stringify(configuration);
    setBusy(true);
    setError("");
    setSaveStatus("Saving…");
    const result = await persist(configuration, STEPS[nextStep].id, nextCompleted);
    setBusy(false);
    if (!result.ok) {
      setSaveStatus("Could not save");
      setError(displayError(result));
      return false;
    }
    savedConfig.current = fingerprint;
    setSaveStatus(fingerprint === latestConfig.current ? "Saved" : "Unsaved changes");
    return true;
  }

  function validationError(index) {
    if (index === 0 && configuration.companyName.trim().length < 2) return "Add your company or brand name.";
    if (index === 0 && configuration.title.trim().length < 3) return "Add a campaign title with at least 3 characters.";
    if (index === 1 && configuration.description.trim().length < 20) return "Add a creator-facing description with at least 20 characters.";
    if (index === 1 && configuration.taskSummary.trim().length < 10) return "Describe the creator task in at least 10 characters.";
    if (index === 3 && (!Number.isFinite(Number(configuration.rewardPool)) || Number(configuration.rewardPool) <= 0)) return "Add a creator reward pool greater than zero.";
    if (index === 3 && (!Number.isInteger(Number(configuration.winnerCount)) || Number(configuration.winnerCount) < 1 || Number(configuration.winnerCount) > 10)) return "Choose between 1 and 10 creators.";
    if (index === 3 && (configuration.winnerPercentages.length !== Number(configuration.winnerCount) || configuration.winnerPercentages.some((value) => !Number.isFinite(Number(value)) || Number(value) <= 0 || Number(value) > 100) || Math.round(configuration.winnerPercentages.reduce((sum, value) => sum + Number(value || 0), 0) * 100) !== 10000)) return "Creator percentages must be positive and add up to 100%.";
    if (index === 4) {
      const start = new Date(configuration.launchAt);
      const deadline = new Date(configuration.submissionDeadlineAt);
      if (!configuration.launchAt || !configuration.submissionDeadlineAt || Number.isNaN(start.getTime()) || Number.isNaN(deadline.getTime()) || deadline <= start) return "Choose a submission deadline after the planned start.";
    }
    return "";
  }

  async function addCampaignAssets(event) {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = "";
    if (files.length === 0) return;
    if (supportAssets.length + files.length > 4) {
      setError("Add up to four campaign images or videos.");
      return;
    }
    const invalid = files.find((file) => {
      const supported = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/webm"].includes(file.type);
      return !supported || file.size > 50 * 1024 * 1024;
    });
    if (invalid) {
      setError("Use an image or MP4, QuickTime or WebM video under 50 MB.");
      return;
    }

    setUploading(true);
    setError("");
    const uploaded = [...supportAssets];
    for (const file of files) {
      const result = await businessMissionService.uploadCampaignAsset({ userId: user.id, missionId, file });
      if (!result.ok) {
        setError(displayError(result));
        break;
      }
      uploaded.push({ ...result.data, name: file.name, type: file.type, size: file.size });
      setField("supportAssets", [...uploaded]);
    }
    setUploading(false);
  }

  async function removeCampaignAsset(asset) {
    setUploading(true);
    setError("");
    const result = await businessMissionService.removeCampaignAsset({ userId: user.id, missionId, path: asset.path });
    setUploading(false);
    if (!result.ok) {
      setError(displayError(result));
      return;
    }
    setField("supportAssets", supportAssets.filter((item) => item.path !== asset.path));
  }

  async function nextStep() {
    const invalid = validationError(step);
    if (invalid) { setError(invalid); return; }
    const nextCompleted = [...new Set([...completed, STEPS[step].id])];
    const next = Math.min(step + 1, STEPS.length - 1);
    if (await saveNow(next, nextCompleted)) {
      setCompleted(nextCompleted);
      setStep(next);
    }
  }

  async function submitMission() {
    if (!missionId || !termsAccepted) {
      setError("Confirm the Mission declarations before submitting.");
      return;
    }
    for (const index of [0, 1, 3, 4]) {
      const invalid = validationError(index);
      if (invalid) { setError(invalid); setStep(index); return; }
    }
    if (configuration.legalName.trim().length < 2 || configuration.businessType.trim().length < 2
      || configuration.industry.trim().length < 2 || configuration.businessPhone.trim().length < 7
      || configuration.representativeName.trim().length < 2 || configuration.representativeTitle.trim().length < 2) {
      setError("Complete the legal business and representative details before submitting for verification.");
      setStep(0);
      return;
    }
    if (!await saveNow(5, [...new Set([...completed, "schedule", "review"]) ])) return;

    setBusy(true);
    setError("");
    setNotice("");
    const profileResult = await businessMissionService.getBrandProfile(user.id);
    if (!profileResult.ok) {
      setBusy(false);
      setError(displayError(profileResult));
      return;
    }
    const profile = profileResult.data;
    if (profile?.verification_status === "pending" && mission.state === "awaiting_brand_verification") {
      setBusy(false);
      setNotice("Your business details are awaiting review. You can continue to payment after the team verifies the business.");
      return;
    }
    if (profile?.verification_status !== "verified" && profile?.verification_status !== "pending") {
      const savedProfile = await businessMissionService.saveBrandVerification({
        legalName: configuration.legalName.trim(),
        tradingName: configuration.companyName.trim(),
        countryCode: "ZA",
        registrationNumber: configuration.registrationNumber.trim(),
        businessType: configuration.businessType.trim(),
        industry: configuration.industry.trim(),
        website: configuration.companyWebsite.trim(),
        businessEmail: configuration.companyEmail.trim(),
        businessPhone: configuration.businessPhone.trim(),
        representativeName: configuration.representativeName.trim(),
        representativeTitle: configuration.representativeTitle.trim(),
      });
      if (!savedProfile.ok) {
        setBusy(false);
        setError(displayError(savedProfile));
        return;
      }
    }
    const submitted = await businessMissionService.submitForFunding(missionId);
    setBusy(false);
    if (!submitted.ok) {
      setError(displayError(submitted));
      return;
    }
    const updated = unwrap(submitted);
    setMission(updated);
    setNotice(updated.state === "awaiting_brand_verification"
      ? "Mission submitted. The team must verify the business before Paystack checkout becomes available."
      : "Mission submitted. Review the server-calculated total, then continue to Paystack when ready.");
  }

  async function checkPayment() {
    setBusy(true);
    setError("");
    setNotice("");
    const result = await businessMissionService.verifyPayment({ missionId });
    setBusy(false);
    if (!result.ok) { setError(displayError(result)); return; }
    setPayment(result.data);
    setNotice(result.data?.status === "funded" ? "Paystack confirmed the payment." : "Payment is not confirmed yet. No funds have been credited to the Mission.");
    const refreshed = await businessMissionService.get(missionId);
    if (refreshed.ok) setMission(unwrap(refreshed));
  }

  async function payMission() {
    setBusy(true);
    setError("");
    setNotice("");
    const result = await businessMissionService.startPayment(missionId);
    setBusy(false);
    if (!result.ok) { setError(displayError(result)); return; }
    setPayment(result.data);
    if (result.data?.checkout_url && /^https:\/\/checkout\.paystack\.com\//.test(result.data.checkout_url)) {
      window.location.assign(result.data.checkout_url);
      return;
    }
    if (result.data?.status === "funded") {
      setNotice("Paystack payment is verified.");
      const refreshed = await businessMissionService.get(missionId);
      if (refreshed.ok) setMission(unwrap(refreshed));
      return;
    }
    if (result.data?.status === "payment_processing") {
      setNotice("The provider response needs reconciliation. Another charge has not been started; contact the team before retrying.");
      return;
    }
    setNotice("Checkout is being prepared. Check again in a moment.");
  }

  if (loading) return <div className="workspace-message" role="status">Loading your private draft…</div>;
  if (error && !mission) return <div><p className="workspace-message error" role="alert">{error}</p><button className="small-button" type="button" onClick={() => navigate("/business/missions")}>Back to workspace</button></div>;
  if (!mission) return <p className="workspace-message" role="status">No Mission draft is open.</p>;
  const editable = ["draft", "changes_requested", "awaiting_brand_verification"].includes(mission.state);
  const paymentManaged = ["payment_required", "payment_pending", "funded"].includes(mission.state)
    || ["payment_processing", "funded"].includes(mission.payment_state);
  if (paymentManaged) return <MissionPaymentPanel mission={mission} payment={payment} busy={busy} error={error} notice={notice} onPay={payMission} onCheck={checkPayment} />;
  if (!editable) return (
    <div className="workspace-empty">
      <p className="section-kicker">Mission status · {mission.payment_state || "not funded"}</p>
      <h2>{mission.title}</h2>
      <p>This Mission is in “{mission.state}”. Funding and launch cannot be completed from this website yet.</p>
      <Link className="small-button" to="/business/missions">Back to Missions</Link>
    </div>
  );

  function setField(field, value) { setConfiguration((current) => ({ ...current, [field]: value })); }
  function setWinnerCount(value) {
    const count = Math.min(10, Math.max(1, Number.parseInt(value, 10) || 1));
    const each = Math.floor((100 / count) * 100) / 100;
    const percentages = Array.from({ length: count }, (_, index) =>
      (index === count - 1 ? 100 - each * (count - 1) : each).toFixed(2),
    );
    setConfiguration((current) => ({ ...current, winnerCount: String(count), winnerPercentages: percentages }));
  }
  const supportAssets = Array.isArray(configuration.supportAssets) ? configuration.supportAssets : [];
  const amount = Number(configuration.rewardPool);
  const dateField = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
  };

  return (
    <div className="wizard-grid">
      <nav className="wizard-nav" aria-label="Mission draft steps">
        {STEPS.map((item, index) => (
          <button key={item.id} type="button" className={step === index ? "active" : ""} aria-current={step === index ? "step" : undefined} onClick={() => { if (index <= step || completed.includes(STEPS[index - 1]?.id)) setStep(index); }}>
            <i>{completed.includes(item.id) ? "✓" : String(index + 1).padStart(2, "0")}</i>{item.label}
          </button>
        ))}
      </nav>
      <div className="wizard-form">
        <p className="section-kicker">Private draft · NF-{mission.id}</p>
        <h2>{STEPS[step].heading}</h2>
        <p>Work through the campaign outline. Your changes save to your account as you go.</p>

        {step === 0 && <div className="form-grid">
          <div className="form-field"><label htmlFor="company-name">Company or brand name</label><input id="company-name" maxLength={140} value={configuration.companyName} onChange={(event) => setField("companyName", event.target.value)} placeholder="Your company or brand" autoComplete="organization" /></div>
          <div className="form-field"><label htmlFor="legal-name">Registered legal name</label><input id="legal-name" maxLength={180} value={configuration.legalName} onChange={(event) => setField("legalName", event.target.value)} autoComplete="organization" /></div>
          <div className="form-field"><label htmlFor="registration-number">Registration number</label><input id="registration-number" maxLength={100} value={configuration.registrationNumber} onChange={(event) => setField("registrationNumber", event.target.value)} /><span className="form-hint">Leave blank if your business has no registration number.</span></div>
          <div className="form-field"><label htmlFor="business-type">Business type</label><input id="business-type" maxLength={100} value={configuration.businessType} onChange={(event) => setField("businessType", event.target.value)} placeholder="Company, partnership, sole proprietor…" /></div>
          <div className="form-field"><label htmlFor="business-industry">Industry</label><input id="business-industry" maxLength={120} value={configuration.industry} onChange={(event) => setField("industry", event.target.value)} /></div>
          <div className="form-field"><label htmlFor="company-website">Company website</label><input id="company-website" type="url" maxLength={500} value={configuration.companyWebsite} onChange={(event) => setField("companyWebsite", event.target.value)} placeholder="https://" autoComplete="url" /></div>
          <div className="form-field"><label htmlFor="company-email">Business contact email</label><input id="company-email" type="email" maxLength={254} value={configuration.companyEmail} onChange={(event) => setField("companyEmail", event.target.value)} placeholder="name@company.com" autoComplete="email" /></div>
          <div className="form-field"><label htmlFor="business-phone">Business phone</label><input id="business-phone" type="tel" maxLength={50} value={configuration.businessPhone} onChange={(event) => setField("businessPhone", event.target.value)} autoComplete="tel" /></div>
          <div className="form-field"><label htmlFor="representative-name">Authorised representative</label><input id="representative-name" maxLength={140} value={configuration.representativeName} onChange={(event) => setField("representativeName", event.target.value)} autoComplete="name" /></div>
          <div className="form-field"><label htmlFor="representative-title">Representative role or title</label><input id="representative-title" maxLength={100} value={configuration.representativeTitle} onChange={(event) => setField("representativeTitle", event.target.value)} /></div>
          <div className="form-field"><label htmlFor="mission-title">Campaign title</label><input id="mission-title" maxLength={140} value={configuration.title} onChange={(event) => setField("title", event.target.value)} placeholder="e.g. A sound for the city" /><span className="form-hint">Shown to creators when a Mission is approved.</span></div>
          <div className="form-field"><label htmlFor="mission-type">Campaign type</label><select id="mission-type" value={configuration.missionType} onChange={(event) => setField("missionType", event.target.value)}><option value="creator_campaign">Creator campaign</option><option value="music_discovery">Music discovery</option><option value="community_prompt">Community prompt</option></select></div>
          <div className="form-field"><label htmlFor="mission-objective">Primary objective</label><select id="mission-objective" value={configuration.primaryObjective} onChange={(event) => setField("primaryObjective", event.target.value)}><option value="brand_awareness">Brand awareness</option><option value="product_story">Product story</option><option value="music_discovery">Music discovery</option><option value="community_prompt">Community participation</option></select></div>
        </div>}

        {step === 1 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-description">Creator-facing description</label><textarea id="mission-description" maxLength={10000} value={configuration.description} onChange={(event) => setField("description", event.target.value)} placeholder="What is the idea, and why should a creator care?" /><span className="form-hint">{configuration.description.length}/10,000 characters.</span></div>
          <div className="form-field"><label htmlFor="mission-task">What should the creator make?</label><textarea id="mission-task" maxLength={2000} value={configuration.taskSummary} onChange={(event) => setField("taskSummary", event.target.value)} placeholder="Describe the creative task in a sentence or two." /><span className="form-hint">This becomes the core task in the campaign outline.</span></div>
          <div className="form-field"><label htmlFor="mission-requirements">Deliverables and requirements</label><textarea id="mission-requirements" maxLength={4000} value={configuration.requirements} onChange={(event) => setField("requirements", event.target.value)} placeholder="Format, tags, mentions, deadline details, or other required deliverables." /></div>
          <div className="form-field"><label htmlFor="mission-eligibility">Who can take part?</label><textarea id="mission-eligibility" maxLength={2000} value={configuration.eligibility} onChange={(event) => setField("eligibility", event.target.value)} placeholder="Audience, location, age or account requirements." /></div>
          <div className="form-field"><label htmlFor="mission-rights">Content usage rights</label><textarea id="mission-rights" maxLength={3000} value={configuration.usageRights} onChange={(event) => setField("usageRights", event.target.value)} placeholder="Explain where and how the brand wants to use submitted content." /></div>
        </div>}

        {step === 2 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-assets">Campaign images or videos</label><input id="mission-assets" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" multiple onChange={addCampaignAssets} disabled={uploading || supportAssets.length >= 4} /><span className="form-hint">Up to four JPG, PNG, WebP or video files, 50 MB each. Upload campaign-ready media only: these files use public app storage.</span></div>
          {supportAssets.length > 0 && <div className="campaign-assets" aria-label="Uploaded campaign media">{supportAssets.map((asset) => (
            <article className="campaign-asset" key={asset.path}>
              {asset.type?.startsWith("video/") ? <video src={asset.url} controls playsInline preload="metadata" aria-label={asset.name} /> : <img src={asset.url} alt={asset.name} loading="lazy" />}
              <div><strong title={asset.name}>{asset.name}</strong><button className="small-button" type="button" onClick={() => removeCampaignAsset(asset)} disabled={uploading}>Remove</button></div>
            </article>
          ))}</div>}
          {uploading && <p className="workspace-message" role="status">Uploading campaign media…</p>}
        </div>}

        {step === 3 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-reward">Creator reward pool (ZAR)</label><input id="mission-reward" type="number" min="0.01" step="0.01" inputMode="decimal" value={configuration.rewardPool} onChange={(event) => setField("rewardPool", event.target.value)} placeholder="0.00" /><span className="form-hint">Enter the amount for creator rewards.</span></div>
          <div className="form-field"><label htmlFor="mission-winners">Number of creators rewarded</label><input id="mission-winners" type="number" min="1" max="10" step="1" value={configuration.winnerCount} onChange={(event) => setWinnerCount(event.target.value)} /></div>
          <fieldset className="form-field"><legend>Creator reward split</legend><span className="form-hint">Set each creator’s percentage of the reward pool. Shares must total 100%. App fees are calculated separately.</span>
            <div className="form-grid">{configuration.winnerPercentages.map((share, index) => <div className="form-field" key={`share-${index}`}><label htmlFor={`winner-share-${index}`}>Creator {index + 1} (%)</label><input id={`winner-share-${index}`} type="number" min="0.01" max="100" step="0.01" inputMode="decimal" value={share} onChange={(event) => setField("winnerPercentages", configuration.winnerPercentages.map((value, shareIndex) => shareIndex === index ? event.target.value : value))} /></div>)}</div>
          </fieldset>
          <div className="note-banner">This is a creator reward pool estimate. The server calculates platform fees and any configured tax separately when you submit. This step does not charge a payment method.</div>
        </div>}

        {step === 4 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-start">Planned start</label><input id="mission-start" type="datetime-local" value={dateField(configuration.launchAt)} onChange={(event) => setField("launchAt", event.target.value ? new Date(event.target.value).toISOString() : "")} /></div>
          <div className="form-field"><label htmlFor="mission-deadline">Creator submission deadline</label><input id="mission-deadline" type="datetime-local" value={dateField(configuration.submissionDeadlineAt)} onChange={(event) => setField("submissionDeadlineAt", event.target.value ? new Date(event.target.value).toISOString() : "")} /><span className="form-hint">Choose a time after the planned start.</span></div>
        </div>}

        {step === 5 && <>
          <ul className="review-list">
            <li><span>Company</span><strong>{configuration.companyName || "Not added"}</strong></li>
            <li><span>Business contact</span><strong>{configuration.companyEmail || "Not added"}</strong></li>
            <li><span>Campaign</span><strong>{configuration.title || "Not added"}</strong></li>
            <li><span>Objective</span><strong>{configuration.primaryObjective.replaceAll("_", " ")}</strong></li>
            <li><span>Creator brief</span><strong>{configuration.description || "Not added"}</strong></li>
            <li><span>Creator task</span><strong>{configuration.taskSummary || "Not added"}</strong></li>
            <li><span>Requirements</span><strong>{configuration.requirements || "Not added"}</strong></li>
            <li><span>Eligibility</span><strong>{configuration.eligibility || "Not added"}</strong></li>
            <li><span>Usage rights</span><strong>{configuration.usageRights || "Not added"}</strong></li>
            <li><span>Campaign media</span><strong>{supportAssets.length ? `${supportAssets.length} file${supportAssets.length === 1 ? "" : "s"}` : "None added"}</strong></li>
            <li><span>Reward pool estimate</span><strong>{Number.isFinite(amount) && amount > 0 ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount) : "Not added"}</strong></li>
            <li><span>Creator split</span><strong>{configuration.winnerPercentages.map((share, index) => `${index + 1}: ${share}%`).join(" · ")}</strong></li>
            <li><span>Submission deadline</span><strong>{configuration.submissionDeadlineAt ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(configuration.submissionDeadlineAt)) : "Not added"}</strong></li>
          </ul>
          <label className="consent-check"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
            <span>I am authorised to submit this Mission and confirm the usage rights described. I agree to the Mission submission terms. The creator percentages divide the reward pool; platform fees are separate.</span>
          </label>
          <p className="fine-print">Business verification is required before checkout. Submission and payment do not publish or approve a campaign. Read the <Link className="link-underline" to="/terms">Mission terms</Link> and <Link className="link-underline" to="/privacy">privacy policy</Link>.</p>
          {notice && <p className="workspace-message" role="status">{notice}</p>}
          <button type="button" className="button-primary" disabled={busy || uploading || !termsAccepted} onClick={submitMission}>{busy ? "Submitting…" : mission.state === "awaiting_brand_verification" ? "Check verification and continue" : "Submit for review"}</button>
        </>}

        {error && <p className="workspace-message error" role="alert">{error}</p>}
        <div className="wizard-footer">
          <span className="save-indicator" role="status" aria-live="polite">{saveStatus}</span>
          <div className="button-row">
            <button type="button" className="small-button" disabled={busy || step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
            <button type="button" className="small-button" disabled={busy || uploading} onClick={() => saveNow()}>{busy ? "Saving…" : "Save draft"}</button>
            {step < STEPS.length - 1 && <button type="button" className="button-primary" disabled={busy || uploading} onClick={nextStep}>{uploading ? "Uploading…" : <>Continue <span aria-hidden="true">→</span></>}</button>}
            {step === STEPS.length - 1 && <button type="button" className="button-secondary" disabled={busy} onClick={() => navigate("/business/missions")}>Save and finish later</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionRow({ mission, onSubmissions }) {
  const canContinue = ["draft", "changes_requested", "awaiting_brand_verification", "payment_required", "payment_pending", "funded"].includes(mission.state);
  const actionLabel = mission.state === "payment_required" ? "Review and pay"
    : mission.state === "payment_pending" ? "Continue checkout"
      : mission.state === "funded" ? "View payment" : "Continue";
  return (
    <article className="mission-row">
      <div><h2>{mission.title || "Untitled Mission"}</h2><p>{mission.updated_at ? `Updated ${new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(mission.updated_at))}` : "Draft"}</p></div>
      <span className="status-tag">{String(mission.state || "draft").replaceAll("_", " ")}</span>
      {canContinue
        ? <Link className="small-button" to={`/business/create?mission=${encodeURIComponent(mission.id)}`}>{actionLabel}</Link>
        : <button className="small-button" type="button" onClick={() => onSubmissions(mission.id)}>Submissions</button>}
    </article>
  );
}

function safeHttpsUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; } catch { return ""; }
}

function SubmissionInbox({ mission, onReviewed }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const canReview = ["published", "closed", "judging"].includes(mission.state);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await businessMissionService.submissions(mission.id);
    if (result.ok) setRows(Array.isArray(result.data) ? result.data : []);
    else setError(displayError(result));
    setLoading(false);
  }, [mission.id]);

  useEffect(() => { load(); }, [load]);

  async function review(row, state) {
    setBusyId(row.id);
    setError("");
    const result = await businessMissionService.review(row.id, state);
    setBusyId(null);
    if (!result.ok) { setError(displayError(result)); return; }
    await load();
    onReviewed?.();
  }

  return (
    <section className="workspace-message" aria-labelledby="submission-heading">
      <div className="workspace-header"><div><p className="section-kicker">Submissions</p><h1 id="submission-heading">{mission.title}</h1><p>Content is retrieved only for this brand’s Mission.</p></div><button type="button" className="small-button" onClick={load}>Refresh</button></div>
      {error && <p className="workspace-message error" role="alert">{error}</p>}
      {loading ? <p role="status">Loading submissions…</p> : rows.length === 0 ? <p>No submissions have been received for this Mission.</p> : (
        <div className="submission-list">
          {rows.map((row) => {
            const video = safeHttpsUrl(row.post?.stream_hls_url || row.post?.file);
            const image = safeHttpsUrl(row.post?.thumbnail_url);
            const text = typeof row.post?.body === "string" ? row.post.body : "";
            return (
              <article className="submission-card" key={row.id}>
                <div className="submission-card-top"><strong>Submitted {row.submitted_at ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.submitted_at)) : ""}</strong><span className="status-tag">{row.state}</span></div>
                {text && <p>{text}</p>}
                {image && <img className="submission-media" src={image} alt="Creator submission preview" loading="lazy" />}
                {video && <video className="submission-media" src={video} controls playsInline preload="none" aria-label="Creator video submission" />}
                {video && <a className="text-link" href={video} target="_blank" rel="noopener noreferrer">Open submission in a new tab <span aria-hidden="true">↗</span></a>}
                {canReview && row.state === "submitted" && <div className="submission-actions"><button type="button" className="small-button" disabled={busyId === row.id} onClick={() => review(row, "shortlisted")}>Shortlist</button><button type="button" className="small-button" disabled={busyId === row.id} onClick={() => review(row, "passed")}>Pass</button></div>}
                {canReview && row.state === "shortlisted" && <div className="submission-actions"><button type="button" className="small-button primary" disabled={busyId === row.id} onClick={() => review(row, "winner")}>Select winner</button><button type="button" className="small-button" disabled={busyId === row.id} onClick={() => review(row, "passed")}>Pass</button></div>}
              </article>
            );
          })}
        </div>
      )}
      {!canReview && <p className="fine-print">Review controls open only for Missions in a reviewable state. Selection is checked by the database against the Mission owner and winner limit.</p>}
    </section>
  );
}

function MissionDashboard({ user }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await businessMissionService.list(user.id);
    if (result.ok) {
      const own = (result.data || []).filter((mission) => String(mission.brand_id) === String(user.id));
      setMissions(own);
      setError("");
    } else setError(displayError(result));
    setLoading(false);
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  async function createDraft() {
    setBusy(true);
    setError("");
    const result = await businessMissionService.createDraft();
    setBusy(false);
    if (!result.ok) { setError(displayError(result)); return; }
    const draft = unwrap(result);
    navigate(`/business/create?mission=${encodeURIComponent(draft.id)}`);
  }

  const selected = missions.find((item) => String(item.id) === String(selectedId));

  return (
    <>
      <div className="workspace-actions" style={{ justifyContent: "flex-start", marginTop: 22 }}>
        <button type="button" className="small-button primary" onClick={createDraft} disabled={busy}>{busy ? "Starting draft…" : "Create a Mission draft"}</button>
        <button type="button" className="small-button" onClick={load} disabled={loading}>Refresh</button>
      </div>
      {error && <p className="workspace-message error" role="alert">{error}</p>}
      <p className="workspace-message">Create and submit a Mission from your account. Business verification is required before Paystack checkout; a paid Mission still requires campaign review before launch.</p>
      {loading ? <p className="workspace-message" role="status">Loading your Missions…</p> : missions.length === 0 ? (
        <div className="workspace-empty"><p className="section-kicker">No Missions yet</p><h2>Start with an idea.</h2><p>Create a private campaign draft, submit its details for verification and review, then pay through Paystack when checkout is available.</p><button type="button" className="button-primary" onClick={createDraft} disabled={busy}>Create a Mission</button></div>
      ) : <div className="mission-list">{missions.map((mission) => <MissionRow key={mission.id} mission={mission} onSubmissions={setSelectedId} />)}</div>}
      {selected && <div style={{ marginTop: 28 }}><SubmissionInbox mission={selected} onReviewed={load} /></div>}
    </>
  );
}

export function BusinessCreate() {
  return <BusinessGate title="Create a Mission" description="Build a campaign, submit it for review and pay through Paystack after required business verification."><MissionBuilder /></BusinessGate>;
}

export function BusinessMissions() {
  return <BusinessGate title="Missions" description="Your account’s saved campaigns and any submissions you are authorised to review."><MissionDashboard /></BusinessGate>;
}
