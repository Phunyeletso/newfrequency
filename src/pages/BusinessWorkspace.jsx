import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isAppBackendConfigured, supabase } from "../lib/supabaseClient";
import { businessMissionService } from "../lib/businessMissionService";

const STEPS = [
  { id: "campaign", label: "Campaign", heading: "Set the direction" },
  { id: "brief", label: "Creator brief", heading: "Explain the work" },
  { id: "reward", label: "Reward outline", heading: "Set a reward pool" },
  { id: "schedule", label: "Schedule", heading: "Choose the timing" },
  { id: "review", label: "Review", heading: "Check your draft" },
];
const EMPTY_DRAFT = {
  title: "",
  missionType: "creator_campaign",
  primaryObjective: "brand_awareness",
  description: "",
  taskSummary: "",
  rewardModel: "winner_pool",
  rewardPool: "",
  launchAt: "",
  submissionDeadlineAt: "",
};

function displayError(result) {
  if (result.code === "not_configured") return "Business accounts are temporarily unavailable.";
  if (["PGRST202", "42883", "42P01"].includes(result.code)) return "The Mission workspace is not enabled on this app release yet. Your account and draft were not changed.";
  if (result.code === "network_error") return result.message;
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
      <p>Business access uses the same sign-in as the app. This creates a private Mission draft; campaign funding is not open.</p>
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
  const [error, setError] = useState("");
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
    if (index === 0 && configuration.title.trim().length < 3) return "Add a campaign title with at least 3 characters.";
    if (index === 1 && configuration.description.trim().length < 20) return "Add a creator-facing description with at least 20 characters.";
    if (index === 1 && configuration.taskSummary.trim().length < 10) return "Describe the creator task in at least 10 characters.";
    if (index === 2 && (!Number.isFinite(Number(configuration.rewardPool)) || Number(configuration.rewardPool) <= 0)) return "Add a reward pool greater than zero.";
    if (index === 3) {
      const start = new Date(configuration.launchAt);
      const deadline = new Date(configuration.submissionDeadlineAt);
      if (!configuration.launchAt || !configuration.submissionDeadlineAt || Number.isNaN(start.getTime()) || Number.isNaN(deadline.getTime()) || deadline <= start) return "Choose a submission deadline after the planned start.";
    }
    return "";
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

  if (loading) return <div className="workspace-message" role="status">Loading your private draft…</div>;
  if (error && !mission) return <div><p className="workspace-message error" role="alert">{error}</p><button className="small-button" type="button" onClick={() => navigate("/business/missions")}>Back to workspace</button></div>;
  if (!mission) return <p className="workspace-message" role="status">No Mission draft is open.</p>;
  const editable = ["draft", "changes_requested", "awaiting_brand_verification"].includes(mission.state);
  if (!editable) return (
    <div className="workspace-empty">
      <p className="section-kicker">Mission status · {mission.payment_state || "not funded"}</p>
      <h2>{mission.title}</h2>
      <p>This Mission is in “{mission.state}”. Funding and launch cannot be completed from this website yet.</p>
      <Link className="small-button" to="/business/missions">Back to Missions</Link>
    </div>
  );

  function setField(field, value) { setConfiguration((current) => ({ ...current, [field]: value })); }
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
          <div className="form-field"><label htmlFor="mission-title">Campaign title</label><input id="mission-title" maxLength={140} value={configuration.title} onChange={(event) => setField("title", event.target.value)} placeholder="e.g. A sound for the city" /><span className="form-hint">Shown to creators when a Mission is approved.</span></div>
          <div className="form-field"><label htmlFor="mission-type">Campaign type</label><select id="mission-type" value={configuration.missionType} onChange={(event) => setField("missionType", event.target.value)}><option value="creator_campaign">Creator campaign</option><option value="music_discovery">Music discovery</option><option value="community_prompt">Community prompt</option></select></div>
          <div className="form-field"><label htmlFor="mission-objective">Primary objective</label><select id="mission-objective" value={configuration.primaryObjective} onChange={(event) => setField("primaryObjective", event.target.value)}><option value="brand_awareness">Brand awareness</option><option value="product_story">Product story</option><option value="music_discovery">Music discovery</option><option value="community_prompt">Community participation</option></select></div>
        </div>}

        {step === 1 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-description">Creator-facing description</label><textarea id="mission-description" maxLength={10000} value={configuration.description} onChange={(event) => setField("description", event.target.value)} placeholder="What is the idea, and why should a creator care?" /><span className="form-hint">{configuration.description.length}/10,000 characters.</span></div>
          <div className="form-field"><label htmlFor="mission-task">What should the creator make?</label><textarea id="mission-task" maxLength={2000} value={configuration.taskSummary} onChange={(event) => setField("taskSummary", event.target.value)} placeholder="Describe the creative task in a sentence or two." /><span className="form-hint">This becomes the core task in the campaign outline.</span></div>
        </div>}

        {step === 2 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-reward">Creator reward pool (ZAR)</label><input id="mission-reward" type="number" min="0.01" step="0.01" inputMode="decimal" value={configuration.rewardPool} onChange={(event) => setField("rewardPool", event.target.value)} placeholder="0.00" /><span className="form-hint">A draft estimate only. No payment is taken or reserved here.</span></div>
          <div className="note-banner">The connected database calculates the final campaign amount from its current pricing policy. That policy, tax and payment method are not shown as confirmed totals in this draft.</div>
        </div>}

        {step === 3 && <div className="form-grid">
          <div className="form-field"><label htmlFor="mission-start">Planned start</label><input id="mission-start" type="datetime-local" value={dateField(configuration.launchAt)} onChange={(event) => setField("launchAt", event.target.value ? new Date(event.target.value).toISOString() : "")} /></div>
          <div className="form-field"><label htmlFor="mission-deadline">Creator submission deadline</label><input id="mission-deadline" type="datetime-local" value={dateField(configuration.submissionDeadlineAt)} onChange={(event) => setField("submissionDeadlineAt", event.target.value ? new Date(event.target.value).toISOString() : "")} /><span className="form-hint">Choose a time after the planned start.</span></div>
        </div>}

        {step === 4 && <>
          <ul className="review-list">
            <li><span>Campaign</span><strong>{configuration.title || "Not added"}</strong></li>
            <li><span>Objective</span><strong>{configuration.primaryObjective.replaceAll("_", " ")}</strong></li>
            <li><span>Creator task</span><strong>{configuration.taskSummary || "Not added"}</strong></li>
            <li><span>Reward pool estimate</span><strong>{Number.isFinite(amount) && amount > 0 ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount) : "Not added"}</strong></li>
            <li><span>Submission deadline</span><strong>{configuration.submissionDeadlineAt ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(configuration.submissionDeadlineAt)) : "Not added"}</strong></li>
          </ul>
          <p className="workspace-message">This review saves your draft only. Business verification, final campaign terms, payment checkout and publishing are still gated. No money will be charged.</p>
        </>}

        {error && <p className="workspace-message error" role="alert">{error}</p>}
        <div className="wizard-footer">
          <span className="save-indicator" role="status" aria-live="polite">{saveStatus}</span>
          <div className="button-row">
            <button type="button" className="small-button" disabled={busy || step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
            <button type="button" className="small-button" disabled={busy} onClick={() => saveNow()}>{busy ? "Saving…" : "Save draft"}</button>
            {step < STEPS.length - 1 && <button type="button" className="button-primary" disabled={busy} onClick={nextStep}>Continue <span aria-hidden="true">→</span></button>}
            {step === STEPS.length - 1 && <button type="button" className="button-secondary" disabled={busy} onClick={() => navigate("/business/missions")}>Finish for now</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionRow({ mission, onSubmissions }) {
  return (
    <article className="mission-row">
      <div><h2>{mission.title || "Untitled Mission"}</h2><p>{mission.updated_at ? `Updated ${new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(mission.updated_at))}` : "Draft"}</p></div>
      <span className="status-tag">{String(mission.state || "draft").replaceAll("_", " ")}</span>
      {mission.state === "draft" || mission.state === "changes_requested" || mission.state === "awaiting_brand_verification"
        ? <Link className="small-button" to={`/business/create?mission=${encodeURIComponent(mission.id)}`}>Continue</Link>
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
      <p className="workspace-message">This workspace reads Mission records permitted to your account. Funding and campaign launch remain disabled. No placeholder campaign counts are shown.</p>
      {loading ? <p className="workspace-message" role="status">Loading your Missions…</p> : missions.length === 0 ? (
        <div className="workspace-empty"><p className="section-kicker">No Mission drafts</p><h2>Start with an idea.</h2><p>Create a private campaign draft and return to it later. It will not be submitted or funded from this website.</p><button type="button" className="button-primary" onClick={createDraft} disabled={busy}>Create a Mission draft</button></div>
      ) : <div className="mission-list">{missions.map((mission) => <MissionRow key={mission.id} mission={mission} onSubmissions={setSelectedId} />)}</div>}
      {selected && <div style={{ marginTop: 28 }}><SubmissionInbox mission={selected} onReviewed={load} /></div>}
    </>
  );
}

export function BusinessCreate() {
  return <BusinessGate title="Create a Mission draft" description="A private outline that saves to your newFrequency account. This does not submit or fund a campaign."><MissionBuilder /></BusinessGate>;
}

export function BusinessMissions() {
  return <BusinessGate title="Missions" description="Your account’s saved campaigns and any submissions you are authorised to review."><MissionDashboard /></BusinessGate>;
}
