import { useEffect, useState } from "react";
import Button from "../components/Button";
import useDocumentTitle from "../lib/useDocumentTitle";
import { useAccountSession } from "../lib/useAccountSession";
import { APP } from "../lib/config";

export default function EmailConfirmed() {
  useDocumentTitle("Your account");
  const { session, loading } = useAccountSession();
  const [error, setError] = useState("");
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = search.get("error") || hash.get("error");
    if (code) {
      setError(search.get("error_description") || hash.get("error_description") || "This confirmation link is invalid or expired.");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  return <section className="section"><div className="page-container" style={{ maxWidth: 760 }}>
    <p className="section-kicker">newFrequency account</p>
    <h1 className="section-title">{error ? "Let’s try that again." : loading ? "Opening your account…" : session ? "You’re in." : "Continue your story."}</h1>
    {error ? <p role="alert" className="workspace-message is-error">{error}</p> : <p className="section-lead">{session ? "Your account is ready for the app, Missions and project contributions." : "Sign in or enter your email confirmation code to open your workspace."}</p>}
    <div className="button-row"><Button to="/account">Open your workspace</Button><Button to="/business/missions" variant="secondary">Campaign chats</Button><Button href={`${APP.scheme}://`} variant="secondary">Open the app</Button></div>
  </div></section>;
}
