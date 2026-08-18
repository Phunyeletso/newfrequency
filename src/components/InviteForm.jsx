import { useState } from "react";
import Button from "./Button";
import { submitInviteRequest, SubmitError } from "../lib/feedback";

/** iOS testers can't self-install — they need a TestFlight invite each. */
export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState(""); // honeypot
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      await submitInviteRequest(email, trap);
      setState("done");
    } catch (err) {
      setError(
        err instanceof SubmitError
          ? err.message
          : "Something went wrong. Your email is still here — try again.",
      );
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
        Got it. We'll send a TestFlight invite to{" "}
        <strong className="font-medium">{email}</strong> when a slot opens.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <label htmlFor="invite-email" className="mb-1.5 block text-sm font-medium">
        Your email
      </label>
      <input
        id="invite-email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 w-full rounded-lg border border-line bg-surface px-4 py-3
          text-base placeholder:text-faint focus:border-accent"
        placeholder="you@example.com"
      />

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="invite-company">Company</label>
        <input
          id="invite-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="mb-3 rounded-lg border border-snaps/40 bg-snaps/5 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <Button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Request an invite"}
      </Button>
    </form>
  );
}
