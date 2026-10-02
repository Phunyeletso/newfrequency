import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import AccountGate from "../components/AccountGate";
import { FundingCatalog, ProjectFundingDashboard } from "./ProjectFundingWorkspace";
import useDocumentTitle from "../lib/useDocumentTitle";
import { investmentService } from "../lib/capitalUpdateService";
import { EMPTY_INTEREST, INTEREST_STATES, canEditInterest, interestToForm, investmentError, validateInterest } from "../lib/investmentForm";
import "./investment.css";

export default function Invest() {
  useDocumentTitle("Fund what comes next", "Fund newFrequency projects or contribute directly to the creator platform.");
  return <>
    <section className="story-hero invest-hero">
      <div className="page-container invest-story-grid">
        <div>
          <p className="eyebrow"><span className="signal-dot" /> Build with newFrequency</p>
          <h1 className="display-title">Culture moves.<br /><em>Build with it.</em></h1>
          <p className="lead-copy">A home for the next wave of creators. Born in South Africa. Built around what they make.</p>
          <div className="button-row"><Link className="button-primary" to="/invest/dashboard">Contribute <span className="button-arrow" aria-hidden="true">↗</span></Link><a className="button-secondary" href="#projects">Explore projects ↓</a></div>
          <p className="fine-print">Choose a project. Back its next chapter.</p>
        </div>
        <div className="capital-orbit" aria-hidden="true">
          <div className="capital-orbit-ring" /><div className="capital-orbit-ring second" />
          <span className="capital-orbit-tag create">Create</span><span className="capital-orbit-tag connect">Connect</span><span className="capital-orbit-tag grow">Grow</span>
          <div className="capital-orbit-core"><span>new</span><strong>Frequency</strong></div>
        </div>
      </div>
    </section>
    <section className="section music-section">
      <div className="page-container">
        <ScrollReveal><p className="section-kicker">One creative world</p><h2 className="section-title">The clip. The track.<br />The people behind them.</h2></ScrollReveal>
        <div className="capital-story-cards">
          <ScrollReveal><article><span className="capital-chapter">01 / Expression</span><h3>Ideas find a home.</h3><p>Reels, Snaps, Chats and Tunes. Four ways to create, in one place.</p></article></ScrollReveal>
          <ScrollReveal><article><span className="capital-chapter">02 / Connection</span><h3>People make it matter.</h3><p>Creator profiles, conversation and discovery keep the story moving.</p></article></ScrollReveal>
          <ScrollReveal><article><span className="capital-chapter">03 / Creator earnings</span><h3>Support reaches creators.</h3><p>Eligible coin-funded paid scrolls and gifts can generate creator earnings.</p><Link className="text-link" to="/creators">How creators earn →</Link></article></ScrollReveal>
        </div>
      </div>
    </section>
    <section className="section capital-invitation" id="projects">
      <div className="page-container story-grid">
        <ScrollReveal><p className="section-kicker">Your part in the story</p><h2 className="section-title">Back the next chapter.</h2><p className="section-lead">Fund a project, or contribute directly to newFrequency.</p><div className="capital-disclosure"><p>Voluntary project support. Contributions create no shares or return rights. Refund requests are reviewed by the team.</p><details><summary>Before you contribute</summary><p>Project scope, costs and provider access may change. A contribution does not guarantee a product release, delivery date or financial benefit.</p></details><Link className="text-link" to="/company">Meet the company →</Link></div></ScrollReveal>
        <FundingCatalog />
      </div>
    </section>
  </>;
}

const STEPS = ["You", "Your perspective", "Send"];
const FIELD_STEP = { full_name: 0, organization: 0, preferred_contact: 0, phone: 0, investor_type: 1, amount: 1, currency: 1, thesis: 1 };
function dateLabel(value) { return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(value)); }
function amountLabel(interest) { return interest?.amount ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: interest.currency }).format(interest.amount) : "Amount to discuss"; }

export function InvestDashboard() {
  return <ProjectFundingDashboard />;
}

export function InvestConversationDashboard() {
  useDocumentTitle("Investment workspace", "Save your investment introduction and track your conversation with newFrequency.");
  return <AccountGate title="A new chapter starts here." description="Your investment conversation, in one place." redirectPath="/invest/conversation">
    {(session) => <InvestmentWorkspace key={session.user.id} session={session} />}
  </AccountGate>;
}

function InvestmentWorkspace({ session }) {
  const [interest, setInterest] = useState(null);
  const [history, setHistory] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_INTEREST, full_name: session.user.user_metadata?.name || "" });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [withdrawConfirm, setWithdrawConfirm] = useState(false);
  const formRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await investmentService.workspace();
    if (!result.ok) { setError(investmentError(result)); setLoading(false); return; }
    setInterest(result.data.interest);
    setHistory(result.data.history || []);
    setCanReview(Boolean(result.data.can_review));
    setForm(result.data.interest ? interestToForm(result.data.interest) : { ...EMPTY_INTEREST, full_name: session.user.user_metadata?.name || "" });
    setDirty(false);
    setLoaded(true);
    setLoading(false);
  }, [session.user.user_metadata?.name]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!dirty) return undefined;
    const protectDraft = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", protectDraft);
    return () => window.removeEventListener("beforeunload", protectDraft);
  }, [dirty]);

  function change(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setErrors((current) => ({ ...current, [key]: undefined }));
    setMessage("");
  }
  function showErrors(nextErrors) {
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0];
    if (firstField) {
      setStep(FIELD_STEP[firstField] ?? step);
      window.requestAnimationFrame(() => formRef.current?.querySelector(`[name="${firstField}"]`)?.focus());
      return true;
    }
    return false;
  }
  function next() {
    const nextErrors = Object.fromEntries(Object.entries(validateInterest(form, true)).filter(([key]) => FIELD_STEP[key] === step));
    if (!showErrors(nextErrors)) { setStep(step + 1); setError(""); }
  }
  async function save(submit = false) {
    if (showErrors(validateInterest(form, submit))) return;
    if (submit && !consent) { setError("Agree to contact about this introduction before sending."); return; }
    setBusy(true); setError(""); setMessage("");
    const result = await investmentService.save(form, interest?.version ?? 0, submit);
    if (!result.ok) { setError(investmentError(result)); setBusy(false); return; }
    setInterest(result.data); setDirty(false); setConsent(false);
    const refreshed = await investmentService.workspace();
    if (refreshed.ok) setHistory(refreshed.data.history || []);
    setBusy(false);
    setMessage(submit ? "Your introduction is sent. You'll find the team's replies here." : "Draft saved to your newFrequency account.");
  }
  async function withdraw() {
    setBusy(true); setError(""); setMessage("");
    const result = await investmentService.withdraw(interest.version);
    if (!result.ok) { setError(investmentError(result)); setBusy(false); return; }
    setInterest(result.data); setForm(interestToForm(result.data)); setDirty(false); setWithdrawConfirm(false);
    const refreshed = await investmentService.workspace();
    if (refreshed.ok) setHistory(refreshed.data.history || []);
    setBusy(false); setStep(0); setMessage("Introduction withdrawn. Company update preference removed.");
  }
  const editable = canEditInterest(interest?.state);
  const status = INTEREST_STATES[interest?.state || "draft"];
  const fieldProps = (key) => ({ id: `capital-${key}`, name: key, value: form[key], onChange: (event) => change(key, event.target.value), "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `capital-${key}-error` : undefined });
  const fieldError = (key) => errors[key] && <span className="capital-field-error" id={`capital-${key}-error`}>{errors[key]}</span>;

  return <div className="capital-workspace">
    <div className="workspace-actions capital-workspace-nav"><Link className="text-link" to="/invest">← The newFrequency story</Link><button type="button" className="small-button" disabled={busy || loading} onClick={load}>Reload workspace</button></div>
    {error && <p className="workspace-message is-error" role="alert">{error}</p>}
    {message && <p className="workspace-message" role="status">{message}</p>}
    {loading && <p className="workspace-message" role="status">Opening your conversation…</p>}
    {!loading && loaded && <>
      <div className="capital-workspace-layout">
        <article className="capital-editor">
          <div className="capital-status"><span className="status-tag">{status.label}</span>{interest && <span className="fine-print">Updated {dateLabel(interest.updated_at)}</span>}</div>
          <p className="section-lead">{status.description}</p>
          {editable ? <form ref={formRef} onSubmit={(event) => { event.preventDefault(); if (step < 2) next(); else save(true); }} noValidate aria-busy={busy}>
            <ol className="capital-steps" aria-label="Introduction steps">{STEPS.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
            <fieldset disabled={busy} className="capital-form-step">
              <legend className="capital-step-title">{["First, you.", "What brings you here?", "Your introduction."][step]}</legend>
              {step === 0 && <div className="form-grid">
                <div className="form-field"><label htmlFor="capital-full_name">Your name</label><input {...fieldProps("full_name")} autoComplete="name" maxLength={140} required />{fieldError("full_name")}</div>
                <div className="form-field"><label htmlFor="capital-organization">Organisation <span className="fine-print">(optional)</span></label><input {...fieldProps("organization")} autoComplete="organization" maxLength={180} />{fieldError("organization")}</div>
                <div className="form-field"><label htmlFor="capital-preferred_contact">Let's connect by</label><select {...fieldProps("preferred_contact")}><option value="email">Email · {session.user.email}</option><option value="phone">Phone</option></select></div>
                {form.preferred_contact === "phone" && <div className="form-field"><label htmlFor="capital-phone">Phone with country code</label><input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={30} required />{fieldError("phone")}</div>}
              </div>}
              {step === 1 && <div className="form-grid">
                <div className="form-field"><label htmlFor="capital-investor_type">I'm here as</label><select {...fieldProps("investor_type")}><option value="individual">An individual</option><option value="company">A company</option><option value="fund">A fund</option></select>{fieldError("investor_type")}</div>
                <div className="capital-amount-fields"><div className="form-field"><label htmlFor="capital-amount">Amount you'd like to discuss</label><input {...fieldProps("amount")} inputMode="decimal" placeholder="50 000" required />{fieldError("amount")}</div><div className="form-field"><label htmlFor="capital-currency">Currency</label><select {...fieldProps("currency")}><option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option></select>{fieldError("currency")}</div></div>
                <div className="form-field"><label htmlFor="capital-thesis">Your perspective</label><textarea {...fieldProps("thesis")} rows={5} maxLength={3000} placeholder="What draws you to newFrequency? What would you bring to the conversation?" required />{fieldError("thesis")}</div>
                <p className="fine-print">This is an amount to discuss. Sending your introduction transfers no funds.</p>
              </div>}
              {step === 2 && <><InterestSummary interest={{ ...form, account_email: session.user.email }} /><label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree that newFrequency may contact me about this introduction.</span></label><label className="consent-check"><input type="checkbox" checked={form.updates_opt_in} onChange={(event) => change("updates_opt_in", event.target.checked)} /><span>Also send me occasional company updates. (Optional)</span></label><p className="fine-print">Non-binding interest. No payment, shares or return rights are created. <Link className="text-link" to="/privacy">Privacy policy</Link></p></>}
            </fieldset>
            <div className="workspace-actions capital-form-actions">
              {step > 0 && <button type="button" className="small-button" disabled={busy} onClick={() => setStep(step - 1)}>Back</button>}
              <button type="button" className="button-secondary" disabled={busy} onClick={() => save(false)}>{busy ? "Saving…" : "Save draft"}</button>
              <button type="submit" className="button-primary" disabled={busy || (step === 2 && !consent)}>{busy ? "One moment…" : step === 2 ? "Send introduction →" : "Continue →"}</button>
            </div>
            {dirty && <p className="fine-print" role="status">You have unsaved changes.</p>}
          </form> : <InterestSummary interest={interest} />}
          {interest && interest.state !== "withdrawn" && <div className="capital-withdraw">
            {withdrawConfirm ? <><p>Withdraw this introduction and remove your company update preference?</p><div className="workspace-actions"><button className="small-button" type="button" disabled={busy} onClick={() => setWithdrawConfirm(false)}>Keep introduction</button><button className="button-secondary" type="button" disabled={busy} onClick={withdraw}>{busy ? "Withdrawing…" : "Withdraw introduction"}</button></div></> : <button className="text-link" type="button" disabled={busy} onClick={() => setWithdrawConfirm(true)}>Withdraw introduction</button>}
          </div>}
        </article>
        <aside className="capital-history"><p className="section-kicker">The conversation</p><h2>Your timeline.</h2>{history.length ? <ol>{history.map((event) => <li key={event.id}><span className="capital-history-marker" aria-hidden="true" /><div><strong>{INTEREST_STATES[event.to_state]?.label || event.to_state}</strong><time dateTime={event.created_at}>{dateLabel(event.created_at)}</time>{event.note && <p>{event.note}</p>}</div></li>)}</ol> : <p>Send your introduction to start the conversation. Replies and status updates will appear here.</p>}<p className="fine-print">Your draft stays private until you send it.</p></aside>
      </div>
      {canReview && <CapitalReviewQueue />}
    </>}
  </div>;
}

function InterestSummary({ interest }) {
  return <div className="capital-summary"><h3>{interest.full_name || "Your introduction"}</h3>{interest.organization && <p>{interest.organization}</p>}<dl><div><dt>Amount to discuss</dt><dd>{amountLabel(interest)}</dd></div><div><dt>Contact</dt><dd>{interest.preferred_contact === "phone" ? interest.phone : interest.account_email}</dd></div><div><dt>Representing</dt><dd>{{ individual: "Individual", company: "Company", fund: "Fund" }[interest.investor_type]}</dd></div></dl><p className="capital-thesis">{interest.thesis}</p></div>;
}

function CapitalReviewQueue() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [state, setState] = useState("under_review");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const selected = items.find((item) => item.id === selectedId);
  async function loadQueue() {
    setLoading(true); setError("");
    const result = await investmentService.reviewQueue();
    if (result.ok) setItems(result.data || []); else setError(investmentError(result));
    setLoading(false);
  }
  useEffect(() => { loadQueue(); }, []);
  async function review(event) {
    event.preventDefault(); if (!selected) return;
    setBusy(true); setError(""); setMessage("");
    const result = await investmentService.review(selected.id, selected.version, state, note);
    if (!result.ok) { setError(investmentError(result)); setBusy(false); return; }
    setItems((current) => current.map((item) => item.id === result.data.id ? result.data : item));
    setNote(""); setMessage("Reply saved to the applicant's timeline."); setBusy(false);
  }
  return <section className="capital-review"><div className="workspace-heading"><div><p className="section-kicker">Team access</p><h2>Investment conversations.</h2></div><button type="button" className="small-button" onClick={loadQueue} disabled={busy || loading}>Refresh queue</button></div>
    {error && <p className="workspace-message is-error" role="alert">{error}</p>}{message && <p className="workspace-message" role="status">{message}</p>}
    {loading ? <p role="status">Loading introductions…</p> : !items.length ? <p>No introductions in the queue.</p> : <div className="capital-review-layout"><div className="capital-review-list">{items.map((item) => <button key={item.id} className="capital-review-item" type="button" aria-pressed={selectedId === item.id} onClick={() => { setSelectedId(item.id); setState("under_review"); setNote(""); setError(""); setMessage(""); }}><strong>{item.full_name}</strong><span>{amountLabel(item)} · {INTEREST_STATES[item.state]?.label}</span></button>)}</div><div>{selected ? <><InterestSummary interest={selected} /><div className="workspace-actions"><a className="text-link" href={`mailto:${selected.account_email}`}>Email applicant</a>{selected.phone && <a className="text-link" href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}>Call applicant</a>}</div>{selected.state !== "closed" && <form className="form-grid" onSubmit={review}><div className="form-field"><label htmlFor="capital-review-state">Next status</label><select id="capital-review-state" value={state} disabled={busy} onChange={(event) => setState(event.target.value)}><option value="under_review">In review</option><option value="needs_information">Request information</option><option value="conversation">Continue the conversation</option><option value="closed">Close conversation</option></select></div><div className="form-field"><label htmlFor="capital-review-note">Reply visible to the applicant</label><textarea id="capital-review-note" rows={4} maxLength={1500} minLength={["needs_information", "closed"].includes(state) ? 2 : undefined} required={["needs_information", "closed"].includes(state)} disabled={busy} value={note} onChange={(event) => setNote(event.target.value)} /></div><button className="button-primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save reply"}</button></form>}</> : <p>Select an introduction to review it.</p>}</div></div>}
  </section>;
}
