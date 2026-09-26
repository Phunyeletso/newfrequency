import { useEffect, useState } from "react";
import Button from "../components/Button";
import useDocumentTitle from "../lib/useDocumentTitle";
import { APP } from "../lib/config";

/**
 * Where a confirmation email lands.
 *
 * A confirmation link is opened in a BROWSER, never in the app, so the last hop
 * of signing up is always a web page. Without one, Supabase sends the tester to
* the project's Site URL, which is https://www.newfrequency.co.za and
 * shows a connection error on a phone. The account is confirmed either way, but
 * the tester sees a failure and gives up. This page is the fix.
 *
 * WHAT THIS PAGE DOES AND DOES NOT DO
 * It does not confirm anything. Supabase has already verified the token by the
 * time the browser gets here; this page is only the receipt. It deliberately
 * does not load a Supabase client, hold a key, or read the URL fragment: the
 * marketing site has no business touching an app session, and there is nothing
 * useful it could do with one.
 *
 * ERRORS COME BACK IN THE QUERY STRING. If the link was already used or has
 * expired, Supabase redirects here with `error` and `error_description` set,
 * rather than to some error page of its own. Reading them is the difference
 * between "confirmed, go and log in" and a page that cheerfully congratulates
 * somebody whose link just failed. Supabase puts them in the hash for implicit
 * flows and in the search string for PKCE, so both are checked.
 */
export default function EmailConfirmed() {
  useDocumentTitle("Email confirmed");

  const [error, setError] = useState(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = search.get("error") || hash.get("error");
    if (!code) return;

    const description =
      search.get("error_description") || hash.get("error_description") || "";
    setError(description.replace(/\+/g, " ") || code.replace(/_/g, " "));

    // The token is in the address bar either way. It is spent, but a spent
    // token still identifies the person it was issued to, and this URL will sit
    // in browser history and get pasted into support chats. Take it out.
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (error) {
    return (
      <section className="px-5 py-20">
        <div className="mx-auto max-w-prose">
          <div
            aria-hidden="true"
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-raised text-3xl"
          >
            ⚠
          </div>
          <h1 className="mb-4 text-3xl">That link did not work</h1>
          <p className="mb-4 text-lg text-muted text-pretty">
            {error}
          </p>
          <p className="mb-8 text-lg text-muted text-pretty">
            Confirmation links last 24 hours and work once. Open {APP.name},
            sign up again with the same email address, and a fresh one is sent.
            If it keeps failing, tell us and we will sort it out.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to="/contact">Contact us</Button>
            <Button to="/get-the-app" variant="secondary">
              Get the app
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-prose">
        <div
          aria-hidden="true"
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-3xl text-accent"
        >
          ✓
        </div>

        <h1 className="mb-4 text-3xl">Email confirmed</h1>
        <p className="mb-8 text-lg text-muted text-pretty">
          Your {APP.name} account is ready. Go back to the app and log in with
          the email address and password you just chose.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/*
            A plain link to the app's scheme (app.json). On a phone with the app
            installed this opens it; on a desktop, or a phone without it, the
            browser does nothing at all, which is why the sentence above already
            tells the reader what to do. No timer, no "if nothing happened"
            fallback that fires on the machines where it did.
          */}
          <Button href={`${APP.scheme}://`}>Open {APP.name}</Button>
          <Button to="/get-the-app" variant="secondary">
            Get the app
          </Button>
        </div>

        <p className="mt-10 text-sm text-faint text-pretty">
          You can close this page. Nothing else is needed here.
        </p>
      </div>
    </section>
  );
}
