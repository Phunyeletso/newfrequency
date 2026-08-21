import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Notice from "../components/Notice";
import ChoiceGroup from "../components/ChoiceGroup";
import useDocumentTitle from "../lib/useDocumentTitle";
import { submitFeedback, SubmitError, isConfigured } from "../lib/feedback";

const EMPTY = {
  liked: "",
  disliked: "",
  rating: "",
  keepUsing: "",
  device: "",
  email: "",
};

const RATINGS = [
  { value: "1", label: "1", hint: "Bad" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5", hint: "Great" },
];

const KEEP_USING = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const fieldClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-base " +
  "placeholder:text-faint focus:border-accent";

export default function Feedback() {
  useDocumentTitle(
    "Feedback",
    "Tell us what you thought of the newFrequency test build. No account needed, takes about thirty seconds.",
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
    if (!values.liked.trim()) next.liked = "Please tell us one thing you liked.";
    if (!values.disliked.trim()) next.disliked = "Please tell us one thing you didn't.";
    if (!values.rating) next.rating = true;
    if (!values.keepUsing) next.keepUsing = true;
    return next;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFailure("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      // Move the first problem into view so it isn't missed on a small screen.
      requestAnimationFrame(() => {
        const first = document.querySelector('[aria-invalid="true"]');
        first?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    setState("sending");
    try {
      await submitFeedback(values, trap);
      setState("done");
    } catch (err) {
      // Nothing is cleared — everything they typed stays in state.
      setFailure(
        err instanceof SubmitError
          ? err.message
          : "Something went wrong sending that. Your answers are still here, so try again.",
      );
      setState("error");
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (state === "done") {
    const email = values.email.trim();
    return (
      <section className="px-5 py-16">
        <div className="mx-auto max-w-prose">
          <h1 className="mb-4 text-3xl">Thanks, that's logged.</h1>
          <p className="mb-4 text-lg text-muted text-pretty">
            We read every one of these, including, especially, the part where
            you told us what didn't work.
          </p>
          <p className="mb-8 text-muted text-pretty">
            {email
              ? `If we need to ask you something about it, we'll write to ${email}.`
              : "You didn't leave an email, so we won't be replying, but it still counts."}
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
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">What did you think?</h1>
        <p className="mt-4 text-lg text-muted text-pretty">
          Be blunt. Negative feedback is more useful to us than praise.
        </p>

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

        <Notice className="mt-6">
          We use this to fix and improve the app, and for nothing else. We won't
          publish what you write, or use it as a testimonial, without asking you
          first. See the{" "}
          <Link to="/privacy" className="link-underline text-ink">
            privacy policy
          </Link>
          .
        </Notice>

        <form onSubmit={onSubmit} noValidate className="mt-10">
          {/* Liked */}
          <div className="mb-7">
            <label htmlFor="liked" className="mb-1.5 block text-base font-medium">
              What did you like?
            </label>
            <textarea
              id="liked"
              rows={4}
              required
              value={values.liked}
              onChange={(e) => set("liked")(e.target.value)}
              aria-invalid={Boolean(errors.liked) || undefined}
              aria-describedby={errors.liked ? "liked-error" : undefined}
              className={fieldClass}
              placeholder="Anything that worked, felt good, or you'd miss."
            />
            {errors.liked && (
              <p id="liked-error" role="alert" className="mt-2 text-sm text-snaps">
                {errors.liked}
              </p>
            )}
          </div>

          {/* Disliked — deliberately given equal weight, not buried */}
          <div className="mb-7">
            <label htmlFor="disliked" className="mb-1.5 block text-base font-medium">
              What didn't you like?
            </label>
            <p id="disliked-hint" className="mb-2 text-sm text-faint text-pretty">
              The one we actually need. Bugs, confusing bits, things that annoyed
              you, anything that made you put your phone down.
            </p>
            <textarea
              id="disliked"
              rows={4}
              required
              value={values.disliked}
              onChange={(e) => set("disliked")(e.target.value)}
              aria-invalid={Boolean(errors.disliked) || undefined}
              aria-describedby={
                errors.disliked ? "disliked-hint disliked-error" : "disliked-hint"
              }
              className={fieldClass}
              placeholder="Don't soften it."
            />
            {errors.disliked && (
              <p id="disliked-error" role="alert" className="mt-2 text-sm text-snaps">
                {errors.disliked}
              </p>
            )}
          </div>

          <ChoiceGroup
            legend="Overall"
            hint="1 is bad, 5 is great."
            name="rating"
            options={RATINGS}
            value={values.rating}
            onChange={set("rating")}
            invalid={Boolean(errors.rating)}
            errorId="rating-error"
          />

          <ChoiceGroup
            legend="Would you keep using it?"
            name="keepUsing"
            options={KEEP_USING}
            value={values.keepUsing}
            onChange={set("keepUsing")}
            invalid={Boolean(errors.keepUsing)}
            errorId="keep-error"
          />

          {/* Device — optional */}
          <div className="mb-7">
            <label htmlFor="device" className="mb-1.5 block text-base font-medium">
              Phone and Android/iOS version{" "}
              <span className="font-normal text-faint">(optional)</span>
            </label>
            <p id="device-hint" className="mb-2 text-sm text-faint text-pretty">
              Helps us reproduce bugs. Something like "Samsung A14, Android 14".
            </p>
            <input
              id="device"
              type="text"
              value={values.device}
              onChange={(e) => set("device")(e.target.value)}
              aria-describedby="device-hint"
              className={fieldClass}
              placeholder="Samsung A14, Android 14"
            />
          </div>

          {/* Email — optional, and clearly so */}
          <div className="mb-8">
            <label htmlFor="email" className="mb-1.5 block text-base font-medium">
              Email{" "}
              <span className="font-normal text-faint">
                (optional, only if you want a reply)
              </span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </div>

          {/* Honeypot — off-screen, hidden from assistive tech, tempting to bots */}
          <div aria-hidden="true" className="absolute left-[-9999px]">
            <label htmlFor="website">Website</label>
            <input
              id="website"
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
            {state === "sending" ? "Sending…" : "Send feedback"}
          </Button>
        </form>
      </div>
    </section>
  );
}
