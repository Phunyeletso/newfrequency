import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import useDocumentTitle from "../lib/useDocumentTitle";
import Notice from "../components/Notice";
import { submitEnquiry, SubmitError, isConfigured } from "../lib/feedback";

const EMPTY = { email: "", topic: "", message: "" };

const fieldClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-base " +
  "placeholder:text-faint focus:border-accent";

export default function Contact() {
  useDocumentTitle(
    "Contact",
    "Ask us anything about newFrequency: general questions, creator monetisation, problems with the app, or a request about your personal information.",
  );

  const [values, setValues] = useState(EMPTY);
  const [trap, setTrap] = useState(""); // honeypot
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [failure, setFailure] = useState("");
  const errorRef = useRef(null);

  const set = (key) => (value) => setValues((prev) => ({ ...prev, [key]: value }));

  function validate() {
    const next = {};
    if (!values.email.trim()) next.email = "We need an email address to reply to.";
    else if (!values.email.includes("@")) next.email = "That doesn't look like an email address.";
    if (!values.topic.trim()) next.topic = "Give us a line on what it's about.";
    if (!values.message.trim()) next.message = "Tell us what you'd like to ask.";
    return next;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFailure("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => {
        const first = document.querySelector('[aria-invalid="true"]');
        first?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    setState("sending");
    try {
      await submitEnquiry(values, trap);
      setState("done");
    } catch (err) {
      // Nothing is cleared — everything they typed stays in state.
      setFailure(
        err instanceof SubmitError
          ? err.message
          : "Something went wrong sending that. Your message is still here, so try again.",
      );
      setState("error");
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (state === "done") {
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-prose">
          <h1 className="mb-4 text-3xl">Got it, thanks.</h1>
          <p className="mb-4 text-lg text-muted text-pretty">
            Your message is with us and we'll reply to{" "}
            <strong className="font-medium text-ink">{values.email.trim()}</strong>.
          </p>
          <p className="mb-8 text-muted text-pretty">
            We're a small team on an early build, so it may take us a few days.
            If it's a request about your personal information, we'll come back to
            you within the time POPIA allows.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to="/">Back to the start</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setValues(EMPTY);
                setErrors({});
                setState("idle");
              }}
            >
              Send another
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">Get in touch</h1>

        {/*
          The backend is not wired up. Without this, the only sign is a failure
          message AFTER somebody has filled in the whole form and pressed send,
          which wastes their time and loses their words. Say it before they
          start typing. Renders nothing at all once the env vars are set, which
          is the normal case.
        */}
        {!isConfigured() && (
          <Notice className="mt-6 border-snaps/40 bg-snaps/5">
            <strong className="font-medium text-ink">
              This form is not connected yet.
            </strong>{" "}
            Nothing you type here will reach us until it is. Sorry about that,
            it is being set up.
          </Notice>
        )}

        <form onSubmit={onSubmit} noValidate className="mt-8">
          {/* Email — required here, because a reply is the point */}
          <div className="mb-7">
            <label htmlFor="email" className="mb-1.5 block text-base font-medium">
              Your email
            </label>
            <p id="email-hint" className="mb-2 text-sm text-faint text-pretty">
              So we can reply. We won't use it for anything else.
            </p>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? "email-hint email-error" : "email-hint"}
              className={fieldClass}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-2 text-sm text-snaps">
                {errors.email}
              </p>
            )}
          </div>

          {/* Free text, deliberately — a fixed list would put words in their
              mouth and we'd rather hear it as they'd say it. */}
          <div className="mb-7">
            <label htmlFor="topic" className="mb-1.5 block text-base font-medium">
              What's it about?
            </label>
            <input
              id="topic"
              type="text"
              required
              value={values.topic}
              onChange={(e) => set("topic")(e.target.value)}
              aria-invalid={Boolean(errors.topic) || undefined}
              aria-describedby={errors.topic ? "topic-error" : undefined}
              className={fieldClass}
            />
            {errors.topic && (
              <p id="topic-error" role="alert" className="mt-2 text-sm text-snaps">
                {errors.topic}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="mb-8">
            <label htmlFor="message" className="mb-1.5 block text-base font-medium">
              Your message
            </label>
            <textarea
              id="message"
              rows={6}
              required
              value={values.message}
              onChange={(e) => set("message")(e.target.value)}
              aria-invalid={Boolean(errors.message) || undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={fieldClass}
              placeholder="As much or as little detail as you like."
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-2 text-sm text-snaps">
                {errors.message}
              </p>
            )}
          </div>

          {/* Honeypot — off-screen, hidden from assistive tech, tempting to bots */}
          <div aria-hidden="true" className="absolute left-[-9999px]">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
            />
          </div>

          {failure && (
            <p
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="mb-5 rounded-lg border border-snaps/40 bg-snaps/5 px-4 py-3 text-sm"
            >
              {failure}
            </p>
          )}

          <Button type="submit" disabled={state === "sending"} className="w-full sm:w-auto">
            {state === "sending" ? "Sending…" : "Send message"}
          </Button>
        </form>

        <p className="mt-8 text-sm text-faint text-pretty">
          What we do with what you send is set out in the{" "}
          <Link to="/privacy" className="link-underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
