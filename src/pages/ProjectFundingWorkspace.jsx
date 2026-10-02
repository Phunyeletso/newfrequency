import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AccountGate from "../components/AccountGate";
import useDocumentTitle from "../lib/useDocumentTitle";
import { projectFundingService } from "../lib/projectFundingService";
import { amountToMinor, fundingError, isContributionRequestKey } from "../lib/projectFundingServiceCore";

const PAYMENT_STATES = { payment_required: "Checkout started", payment_pending: "Awaiting confirmation", payment_processing: "Team check", funded: "Received", payment_failed: "Not completed", refund_requested: "Refund requested", refund_processing: "Refund in progress", refunded: "Refunded", refund_failed: "Refund needs a team check" };
const PAID_STATES = ["funded", "refund_requested", "refund_processing", "refunded", "refund_failed"];
const PENDING_STATES = ["payment_required", "payment_pending", "payment_processing"];
function money(minor, currency = "ZAR") { return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(Number(minor) / 100); }
function date(value) { return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(value)); }
function checkoutUrl(value) { try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "checkout.paystack.com" && !url.username && !url.password && /^\/[A-Za-z0-9]+\/?$/.test(url.pathname) && !url.search && !url.hash; } catch { return false; } }

export function FundingCatalog() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    const result = await projectFundingService.catalog();
    if (result.ok) setProjects(result.data || []); else setError(fundingError(result));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  return <div className="funding-catalog">
    {loading && <p role="status" className="workspace-message">Loading projects…</p>}
    {error && <div className="workspace-message is-error" role="alert"><p>{error}</p><button type="button" className="small-button" onClick={load}>Try again</button></div>}
    {!loading && !error && !projects.length && <p>No published projects right now. <Link className="text-link" to="/invest/dashboard">Open your contribution workspace →</Link></p>}
    {projects.map((project) => <article className="funding-project-card" key={project.id}><div className="workspace-actions"><span className="section-kicker">Project support</span><span className="status-tag">{project.state === "published" ? "Open" : project.state === "paused" ? "Paused" : "Closed"}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="funding-progress"><strong>{money(project.raised_minor)}</strong><span>received{project.goal_minor ? ` of ${money(project.goal_minor)}` : ""}</span>{project.goal_minor && <progress max={project.goal_minor} value={Math.min(project.raised_minor, project.goal_minor)} aria-label={`${project.title} funding progress`} />}</div>{project.state === "published" && <Link className="button-primary" to={`/invest/dashboard?project=${project.id}`}>Support this project ↗</Link>}</article>)}
  </div>;
}

export function ProjectFundingDashboard() {
  useDocumentTitle("Your contributions", "Support newFrequency projects and manage your contributions, receipts and refund requests.");
  const [params] = useSearchParams();
  const project = params.get("project");
  const redirectPath = project ? `/invest/dashboard?project=${encodeURIComponent(project)}` : "/invest/dashboard";
  return <AccountGate title="Make the next chapter happen." description="Your projects. Your contributions. One workspace." redirectPath={redirectPath}>{session => <ContributionWorkspace key={session.user.id} session={session} />}</AccountGate>;
}

function requestKeyFor(userId, projectId, amountMinor) {
  const key = `nf-contribution:${userId}:${projectId}:${amountMinor}`;
  try {
    const current = window.sessionStorage.getItem(key);
    if (/^[0-9a-f-]{36}$/i.test(current || "")) return current;
    const fresh = crypto.randomUUID(); window.sessionStorage.setItem(key, fresh); return fresh;
  } catch { return crypto.randomUUID(); }
}
function clearRequestKey(userId, contribution) {
  try {
    const name = `nf-contribution:${userId}:${contribution.project_id}:${contribution.amount_minor}`;
    if (isContributionRequestKey(contribution, window.sessionStorage.getItem(name))) window.sessionStorage.removeItem(name);
  } catch { /* storage optional */ }
}
function downloadReceipt(contribution, email) {
  const text = ["newFrequency project contribution receipt", "", `Receipt: ${contribution.receipt_number}`, `Project: ${contribution.project_title}`, `Account: ${email}`, `Amount: ${money(contribution.amount_minor, contribution.currency)}`, `Verified: ${date(contribution.verified_at)}`, `Current status: ${PAYMENT_STATES[contribution.status]}`, `Payment reference: ${contribution.provider_reference}`, "", "A voluntary project contribution. No shares, ownership or financial returns are created.", "Refund requests and updates are available in your newFrequency contribution workspace."].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = `${contribution.receipt_number}.txt`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ContributionWorkspace({ session }) {
  const [params, setParams] = useSearchParams();
  const initialProject = params.get("project") || "";
  const reference = params.get("reference") || params.get("trxref");
  const verifiedReference = useRef("");
  const fallbackRequestKey = useRef({});
  const [projects, setProjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [projectId, setProjectId] = useState(initialProject);
  const [amount, setAmount] = useState("100");
  const [consent, setConsent] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [tab, setTab] = useState("contribute");
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refundId, setRefundId] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const selected = projects.find(project => project.id === projectId);
  const openProjects = projects.filter(project => project.state === "published");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    const [catalog, workspace] = await Promise.all([projectFundingService.catalog(), projectFundingService.workspace()]);
    if (!catalog.ok || !workspace.ok) { setError(fundingError(!catalog.ok ? catalog : workspace)); setLoading(false); return; }
    setProjects(catalog.data || []); setContributions(workspace.data.contributions || []); setCanManage(Boolean(workspace.data.can_manage));
    setProjectId(current => (catalog.data || []).some(project => project.id === current && project.state === "published") ? current : (catalog.data || []).find(project => project.state === "published")?.id || "");
    for (const contribution of workspace.data.contributions || []) {
      if (PAID_STATES.includes(contribution.status) || contribution.status === "payment_failed") {
        clearRequestKey(session.user.id, contribution);
        const quote = `${contribution.project_id}:${contribution.amount_minor}`;
        if (isContributionRequestKey(contribution, fallbackRequestKey.current[quote])) delete fallbackRequestKey.current[quote];
      }
    }
    setLoaded(true); setLoading(false);
  }, [session.user.id]);
  async function refreshCatalog() {
    const result = await projectFundingService.catalog();
    if (result.ok) {
      setProjects(result.data || []);
      setProjectId(current => (result.data || []).some(project => project.id === current && project.state === "published") ? current : (result.data || []).find(project => project.state === "published")?.id || "");
    }
  }
  useEffect(() => { if (!reference) load(); }, [load, reference]);
  useEffect(() => {
    if (!reference || verifiedReference.current === reference) return;
    verifiedReference.current = reference;
    setBusy(true); setTab("history");
    projectFundingService.verifyPayment(null, reference).then(async (result) => {
      const detail = result.ok ? null : fundingError(result);
      await load(); setBusy(false);
      if (detail) setError(detail);
      else setMessage(result.data.status === "funded" ? "Contribution received. Thank you for backing this chapter." : "Payment status refreshed. Your history shows the latest confirmation.");
    });
  }, [reference, load]);

  async function contribute(event) {
    event.preventDefault(); setError(""); setMessage("");
    const minor = amountToMinor(amount);
    if (!selected || !minor || minor < selected.minimum_amount_minor || minor > selected.maximum_amount_minor) { setError(selected ? `Choose an amount from ${money(selected.minimum_amount_minor)} to ${money(selected.maximum_amount_minor)}.` : "Choose an open project."); return; }
    if (!consent) { setError("Confirm that this is a voluntary project contribution."); return; }
    setBusy(true);
    const quote = `${projectId}:${minor}`;
    const requestKey = fallbackRequestKey.current[quote] || requestKeyFor(session.user.id, projectId, minor);
    fallbackRequestKey.current[quote] = requestKey;
    const result = await projectFundingService.startPayment(projectId, minor, requestKey);
    if (!result.ok) { const detail = fundingError(result); await load(); setError(detail); setBusy(false); return; }
    if (PAID_STATES.includes(result.data.status)) { delete fallbackRequestKey.current[quote]; await load(); setTab("history"); setMessage("This contribution is already recorded. You can see its receipt below."); setBusy(false); return; }
    if (!checkoutUrl(result.data.checkout_url)) { await load(); setTab("history"); setMessage("Your payment reference is saved. Check its status in your history before trying again."); setBusy(false); return; }
    // The server's frozen amount is the amount the checkout will collect.
    if (Number(result.data.amount_minor) !== minor) { await load(); setTab("history"); setError("You already have a pending contribution for this project. Continue or check that payment from your history."); setBusy(false); return; }
    window.location.assign(result.data.checkout_url);
  }
  async function checkPayment(contribution) {
    setBusy(true); setError(""); setMessage("");
    const result = await projectFundingService.verifyPayment(contribution.id, contribution.provider_reference);
    const detail = result.ok ? null : fundingError(result);
    await load(); setBusy(false);
    if (detail) setError(detail); else setMessage(result.data.status === "funded" ? "Contribution received. Your receipt is ready." : "Payment status refreshed.");
  }
  async function sendRefund(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const result = await projectFundingService.requestRefund(refundId, refundReason);
    if (!result.ok) { setError(fundingError(result)); setBusy(false); return; }
    setRefundId(""); setRefundReason(""); await load(); setBusy(false); setMessage("Refund request sent to the team. Its status will appear with your contribution.");
  }
  function chooseProject(id) { setProjectId(id); setConsent(false); const next = new URLSearchParams(params); next.set("project", id); next.delete("reference"); next.delete("trxref"); setParams(next, { replace: true }); }

  return <div className="funding-workspace">
    <div className="workspace-actions capital-workspace-nav"><Link className="text-link" to="/invest">← Explore projects</Link><button type="button" className="small-button" disabled={busy || loading} onClick={load}>Refresh workspace</button></div>
    <div className="auth-tabs funding-tabs" role="group" aria-label="Contribution workspace"><button type="button" aria-pressed={tab === "contribute"} onClick={() => setTab("contribute")}>Contribute</button><button type="button" aria-pressed={tab === "history"} onClick={() => setTab("history")}>Your history{contributions.length ? ` · ${contributions.length}` : ""}</button>{canManage && <button type="button" aria-pressed={tab === "manage"} onClick={() => setTab("manage")}>Manage projects</button>}</div>
    {loading && <p className="workspace-message" role="status">Loading your workspace…</p>}{error && <p className="workspace-message is-error" role="alert">{error}</p>}{message && <p className="workspace-message" role="status">{message}</p>}
    {!loading && loaded && tab === "contribute" && <div className="capital-workspace-layout"><form className="capital-editor" onSubmit={contribute} aria-busy={busy}><p className="section-kicker">Choose your chapter</p><h2>Make a contribution.</h2>{openProjects.length ? <fieldset className="capital-form-step" disabled={busy}><div className="form-grid"><div className="form-field"><label htmlFor="funding-project">Project</label><select id="funding-project" value={projectId} onChange={event => chooseProject(event.target.value)} required>{openProjects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}</select></div>{selected && <p className="section-lead">{selected.description}</p>}<div className="form-field"><label htmlFor="funding-amount">Your contribution in ZAR</label><input id="funding-amount" inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} required aria-describedby="funding-range" /><p id="funding-range" className="fine-print">{selected && `${money(selected.minimum_amount_minor)} to ${money(selected.maximum_amount_minor)}`}</p></div><div className="funding-presets" role="group" aria-label="Contribution amounts">{[50, 100, 250, 500].filter(value => selected && value * 100 >= selected.minimum_amount_minor && value * 100 <= selected.maximum_amount_minor).map(value => <button className="small-button" type="button" key={value} aria-pressed={amount === String(value)} onClick={() => setAmount(String(value))}>{money(value * 100)}</button>)}</div><label className="consent-check"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>I understand this is voluntary project support, with no shares or financial returns.</span></label><button type="submit" className="button-primary" disabled={!consent || busy}>{busy ? "Opening checkout…" : "Continue to Paystack ↗"}</button><p className="fine-print">You'll confirm the payment with Paystack. Refund requests are reviewed by the newFrequency team. <Link className="text-link" to="/terms">Terms</Link></p></div></fieldset> : <p>No projects are accepting new contributions. {canManage && <button type="button" className="text-link" onClick={() => setTab("manage")}>Publish a project →</button>}</p>}</form><aside className="capital-history"><p className="section-kicker">From you to the project</p><h2>Every contribution has a trail.</h2><ol><li><span className="capital-history-marker" aria-hidden="true" /><div><strong>Choose your amount</strong><p>Support the project that speaks to you.</p></div></li><li><span className="capital-history-marker" aria-hidden="true" /><div><strong>Confirm with Paystack</strong><p>Your contribution is recorded after payment confirmation.</p></div></li><li><span className="capital-history-marker" aria-hidden="true" /><div><strong>Keep your receipt</strong><p>History, receipts and refund requests stay in this workspace.</p></div></li></ol></aside></div>}
    {!loading && loaded && tab === "history" && <section className="funding-history"><p className="section-kicker">Your part in the story</p><h2>Contribution history.</h2>{!contributions.length ? <div className="capital-editor"><p>Your first chapter is waiting.</p><button type="button" className="button-primary" onClick={() => setTab("contribute")}>Choose a project →</button></div> : contributions.map(contribution => <article className="funding-receipt-card" key={contribution.id}><div className="funding-receipt-heading"><div><p className="section-kicker">{date(contribution.created_at)}</p><h3>{contribution.project_title}</h3></div><div><strong>{money(contribution.amount_minor, contribution.currency)}</strong><span className="status-tag">{PAYMENT_STATES[contribution.status]}</span></div></div><p className="funding-reference">Reference: {contribution.provider_reference}</p>{contribution.refund_request && <p className="workspace-message">Refund: {contribution.refund_request.state}{contribution.refund_request.review_note ? ` · ${contribution.refund_request.review_note}` : ""}</p>}<div className="workspace-actions">{PENDING_STATES.includes(contribution.status) && <button type="button" className="small-button" disabled={busy} onClick={() => checkPayment(contribution)}>Check payment status</button>}{contribution.status === "payment_pending" && checkoutUrl(contribution.checkout_url) && <a className="button-secondary" href={contribution.checkout_url}>Continue checkout ↗</a>}{PAID_STATES.includes(contribution.status) && contribution.verified_at && <button type="button" className="small-button" onClick={() => downloadReceipt(contribution, session.user.email)}>Download receipt</button>}{contribution.status === "funded" && !contribution.refund_request && <button className="text-link" type="button" disabled={busy} onClick={() => { setRefundId(contribution.id); setRefundReason(""); }}>Request a refund</button>}</div>{refundId === contribution.id && <form className="form-grid funding-refund-form" onSubmit={sendRefund}><div className="form-field"><label htmlFor="funding-refund-reason">Tell the team why</label><textarea id="funding-refund-reason" rows={3} required minLength={5} maxLength={1500} value={refundReason} onChange={event => setRefundReason(event.target.value)} disabled={busy} /></div><div className="workspace-actions"><button className="small-button" type="button" disabled={busy} onClick={() => setRefundId("")}>Cancel</button><button className="button-primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send refund request"}</button></div></form>}</article>)}</section>}
    {!loading && loaded && tab === "manage" && canManage && <FundingProjectAdmin onChanged={refreshCatalog} />}
  </div>;
}

const EMPTY_PROJECT = { title: "", description: "", state: "draft", minimum: "1", maximum: "50000", goal: "" };
function RefundReconciliationInput({ refund, busy, value, onChange }) {
  if (refund.state !== "processing" || refund.provider_refund_id) return null;
  return <div className="form-field"><label htmlFor={`refund-provider-${refund.id}`}>Paystack refund ID</label><input id={`refund-provider-${refund.id}`} inputMode="numeric" pattern="[0-9]+" value={value} disabled={busy} onChange={event => onChange(event.target.value.replace(/\D/g, ""))} /><p className="fine-print">If provider confirmation was interrupted, find this refund in Paystack and enter its ID to reconcile the saved request.</p></div>;
}
function FundingProjectAdmin({ onChanged }) {
  const [projects, setProjects] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [id, setId] = useState("");
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refundNotes, setRefundNotes] = useState({});
  const [refundProviderIds, setRefundProviderIds] = useState({});
  async function load() {
    setLoading(true); const result = await projectFundingService.adminWorkspace();
    if (!result.ok) setError(fundingError(result)); else { setProjects(result.data.projects || []); setRefunds(result.data.refunds || []); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  function selectProject(project) {
    setId(project?.id || ""); setError(""); setMessage("");
    setForm(project ? { title: project.title, description: project.description, state: project.state, minimum: String(project.minimum_amount_minor / 100), maximum: String(project.maximum_amount_minor / 100), goal: project.goal_minor ? String(project.goal_minor / 100) : "" } : EMPTY_PROJECT);
  }
  async function save(event) {
    event.preventDefault(); setError(""); setMessage("");
    const minimum = amountToMinor(form.minimum); const maximum = amountToMinor(form.maximum); const goal = form.goal.trim() ? amountToMinor(form.goal) : null;
    if (!minimum || !maximum || minimum < 100 || maximum < minimum || maximum > 100000000 || (form.goal.trim() && !goal)) { setError("Check the minimum, maximum and optional goal. The maximum supported contribution is R1,000,000."); return; }
    setBusy(true);
    const result = await projectFundingService.saveProject(id, { title: form.title, description: form.description, state: form.state, minimum_amount_minor: minimum, maximum_amount_minor: maximum, goal_minor: goal });
    if (!result.ok) { setError(fundingError(result)); setBusy(false); return; }
    setId(result.data.id); await load(); await onChanged(); setBusy(false); setMessage(result.data.state === "published" ? "Project published. It's accepting contributions." : "Project saved.");
  }
  async function refundAction(refund, approve) {
    setError(""); setMessage("");
    if (!approve && (refundNotes[refund.id] || "").trim().length < 2) { setError("Add a note before declining this refund."); return; }
    setBusy(true);
    const result = approve ? await projectFundingService.processRefund(refund.contribution_id, refundProviderIds[refund.id]) : await projectFundingService.rejectRefund(refund.id, refundNotes[refund.id]);
    if (!result.ok) { setError(fundingError(result)); setBusy(false); return; }
    await load(); await onChanged(); setBusy(false); setMessage(approve ? (result.data.status === "refunded" ? "Refund confirmed." : "Refund is processing with Paystack. Check its status again for confirmation.") : "Refund response saved.");
  }
  function change(key, value) { setForm(current => ({ ...current, [key]: value })); }
  return <section className="funding-admin"><div className="workspace-heading"><div><p className="section-kicker">Team access</p><h2>Shape the next chapter.</h2></div><div className="workspace-actions"><button className="small-button" type="button" disabled={busy} onClick={() => selectProject(null)}>New project</button><button className="small-button" type="button" disabled={busy} onClick={() => { load(); onChanged(); }}>Refresh projects</button></div></div>{error && <p className="workspace-message is-error" role="alert">{error}</p>}{message && <p className="workspace-message" role="status">{message}</p>}{loading && <p role="status">Loading project controls…</p>}<div className="capital-review-layout"><div className="capital-review-list">{projects.map(project => <button type="button" disabled={busy} className="capital-review-item" key={project.id} aria-pressed={id === project.id} onClick={() => selectProject(project)}><strong>{project.title}</strong><span>{project.state}</span></button>)}</div><form className="capital-editor form-grid" onSubmit={save}><h3>{id ? "Edit project" : "Create project"}</h3><fieldset className="capital-form-step form-grid" disabled={busy}><div className="form-field"><label htmlFor="funding-title">Project title</label><input id="funding-title" required minLength={3} maxLength={140} value={form.title} onChange={event => change("title", event.target.value)} /></div><div className="form-field"><label htmlFor="funding-description">What contributions support</label><textarea id="funding-description" required minLength={10} maxLength={3000} rows={5} value={form.description} onChange={event => change("description", event.target.value)} /></div><div className="form-field"><label htmlFor="funding-state">Availability</label><select id="funding-state" value={form.state} onChange={event => change("state", event.target.value)}><option value="draft">Private draft</option><option value="published">Published · accepts contributions</option><option value="paused">Paused</option><option value="closed">Closed</option></select></div><div className="funding-admin-amounts">{[["minimum", "Minimum (ZAR)"], ["maximum", "Maximum (ZAR)"], ["goal", "Goal (ZAR, optional)"]].map(([key, label]) => <div className="form-field" key={key}><label htmlFor={`funding-${key}`}>{label}</label><input id={`funding-${key}`} inputMode="decimal" required={key !== "goal"} value={form[key]} onChange={event => change(key, event.target.value)} /></div>)}</div><button type="submit" className="button-primary" disabled={busy}>{busy ? "Saving…" : "Save project"}</button></fieldset></form></div><div className="funding-admin-refunds"><p className="section-kicker">Contribution care</p><h3>Refund requests.</h3>{!refunds.length && <p>No refund requests.</p>}{refunds.map(refund => <article className="funding-receipt-card" key={refund.id}><div className="funding-receipt-heading"><h4>{refund.project_title}</h4><span>{money(refund.amount_minor)} · {refund.state}</span></div><p>{refund.reason}</p>{refund.review_note && <p className="fine-print">{refund.review_note}</p>}{["requested", "failed", "processing"].includes(refund.state) && <><RefundReconciliationInput refund={refund} busy={busy} value={refundProviderIds[refund.id] || ""} onChange={value => setRefundProviderIds(current => ({ ...current, [refund.id]: value }))} /><div className="form-field"><label htmlFor={`refund-note-${refund.id}`}>Reply for a declined request</label><textarea id={`refund-note-${refund.id}`} disabled={busy || refund.state === "processing"} rows={2} maxLength={1500} value={refundNotes[refund.id] || ""} onChange={event => setRefundNotes(current => ({ ...current, [refund.id]: event.target.value }))} /></div><div className="workspace-actions">{refund.state !== "processing" && <button type="button" className="small-button" disabled={busy} onClick={() => refundAction(refund, false)}>Decline with reply</button>}<button type="button" className="button-secondary" disabled={busy} onClick={() => refundAction(refund, true)}>{refund.state === "processing" ? "Check provider status" : refund.state === "failed" ? (refund.provider_refund_id ? "Check provider status" : "Retry full refund") : "Approve full refund"}</button></div></>}</article>)}</div></section>;
}
