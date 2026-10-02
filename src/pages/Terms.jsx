import { Link } from "react-router-dom";
import useDocumentTitle from "../lib/useDocumentTitle";
import { COMPANY } from "../lib/config";

const UPDATED = "2 October 2026";

export default function Terms() {
  useDocumentTitle(
    "Terms of use",
    "The terms that apply to the newFrequency website, Google Play app, Mission submissions and project contributions.",
  );

  return (
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">Terms of use</h1>
        <p className="mt-3 text-sm text-faint">Last updated {UPDATED}</p>

        <p className="mt-6 text-lg text-muted text-pretty">
          These terms cover the public pages, feedback and contact forms, the
          Google Play app, Business Missions and project contributions. Using
          the newFrequency app itself is governed by the terms you accept inside
          the app.
        </p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="mb-3 text-xl">Who we are</h2>
            <p className="text-muted text-pretty">
              This site and the newFrequency app are operated by{" "}
              <strong className="font-medium text-ink">{COMPANY.legalName}</strong>.
              Questions go to{" "}
              {COMPANY.supportEmail ? (
                <a href={`mailto:${COMPANY.supportEmail}`} className="link-underline text-ink">
                  {COMPANY.supportEmail}
                </a>
              ) : (
                <Link to="/contact" className="link-underline text-ink">
                  the contact form on this site
                </Link>
              )}
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Using the app</h2>
            <p className="mb-3 text-muted text-pretty">
              Download newFrequency for Android from Google Play. Features may
              change as the service develops, and availability may vary.
            </p>
            <p className="text-muted text-pretty">
              The app is provided as-is, without warranty. To the extent the law
              allows, we aren't liable for loss or damage arising from using
              the app. Nothing here limits any right you have under
              South African consumer law that can't be excluded.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Downloading the app</h2>
            <p className="mb-3 text-muted text-pretty">
              The Android app is distributed through Google Play. iOS access is
              by invitation or TestFlight where available. Install software only
              on a device you own or are allowed to use.
            </p>
            <p className="text-muted text-pretty">
              Don't redistribute the app or pass TestFlight invitations on to
              other people.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Business Missions and checkout</h2>
            <p className="text-muted text-pretty">
              The Business workspace uses your existing newFrequency account.
              Draft information is saved to the app database under its access
              rules. A submitted Mission may require business verification and
              campaign review before it can proceed. When Mission checkout is
              enabled, the app calculates the checkout amount and processes it
              on Paystack’s hosted payment
              page. A payment is credited only after server-side verification;
              it does not itself approve or publish a campaign. Creator
              percentages divide the creator reward pool, and platform fees are
              calculated separately. No creator reward or campaign launch is
              guaranteed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Project contributions</h2>
            <p className="text-muted text-pretty">A project contribution voluntarily supports the project described at checkout. It does not buy company shares, ownership, a product entitlement or a financial return. Choose your amount before opening Paystack’s hosted checkout. The website records payment only after the server verifies the amount, currency and status with Paystack.</p>
            <p className="mt-4 text-muted text-pretty">Your dashboard shows payment receipts and lets you request a refund for team review. A request is separate from a completed refund; the dashboard confirms completion after Paystack processes it. Contact the team about payment disputes. These terms do not exclude any applicable consumer rights.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Sending feedback</h2>
            <p className="mb-3 text-muted text-pretty">
              Send what you actually think. Critical feedback is what we're
              asking for. What you shouldn't send is anything unlawful, anyone
              else's personal information, or confidential material that isn't
              yours to share.
            </p>
            <p className="mb-3 text-muted text-pretty">
              By sending feedback you allow us to use it to improve the app and
              our products. We won't publish it, quote it or attribute it to you
              without asking you first. We may act on a suggestion without owing
              you payment or credit for it.
            </p>
            <p className="text-muted text-pretty">
              What we do with the information itself is set out in the{" "}
              <Link to="/privacy" className="link-underline text-ink">
                privacy policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Age</h2>
            <p className="text-muted text-pretty">
              If you're under 18, POPIA requires a parent or guardian to agree
              before you send us personal information or use the service, where
              consent is required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Our content</h2>
            <p className="text-muted text-pretty">
              The newFrequency name, logo and the text and design of this site
              belong to us. Please don't copy them or use them to represent
              yourself as us.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Governing law</h2>
            <p className="text-muted text-pretty">
              These terms are governed by the law of South Africa, and the courts
              of South Africa have jurisdiction over any dispute about them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Changes</h2>
            <p className="text-muted text-pretty">
              We may update these terms as the product changes. The date at the
              top tells you when they last changed.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-faint">
          See also our{" "}
          <Link to="/privacy" className="link-underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
