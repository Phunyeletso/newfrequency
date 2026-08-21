import { Link } from "react-router-dom";
import Notice from "../components/Notice";
import useDocumentTitle from "../lib/useDocumentTitle";
import { APP, COMPANY } from "../lib/config";

const UPDATED = "18 August 2026";

export default function Terms() {
  useDocumentTitle(
    "Terms of use",
    "The terms that apply to using the newFrequency website, the feedback form and the test build download.",
  );

  return (
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">Terms of use</h1>
        <p className="mt-3 text-sm text-faint">Last updated {UPDATED}</p>

        <p className="mt-6 text-lg text-muted text-pretty">
          These terms cover this website: the pages here, the feedback form, and
          downloading the test build. Using the newFrequency app itself is
          governed by the terms you accept inside the app.
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
            <h2 className="mb-3 text-xl">This is a test build</h2>
            <Notice className="mb-4">
              newFrequency version {APP.version} is pre-release software provided
              for testing. It is not a finished product.
            </Notice>
            <p className="mb-3 text-muted text-pretty">
              That means, plainly: it will have bugs. It may crash, lose things,
              or behave in ways it shouldn't. Data, including posts and account
              details, may be reset while we test. Features may change or be
              removed. Availability isn't guaranteed and the test can end at any
              time.
            </p>
            <p className="text-muted text-pretty">
              The build is provided as-is, without warranty. To the extent the law
              allows, we aren't liable for loss or damage arising from using
              pre-release software. Nothing here limits any right you have under
              South African consumer law that can't be excluded.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Downloading the app</h2>
            <p className="mb-3 text-muted text-pretty">
              The Android build is distributed as a file from this site rather
              than through Google Play, and iOS testing runs through Apple's
              TestFlight. Install it on a device you own or are allowed to install
              software on.
            </p>
            <p className="text-muted text-pretty">
              Don't redistribute the file, host copies of it elsewhere, or pass
              TestFlight invitations on to other people. We need to know who's
              testing, and a copy circulating outside this site is one we can't
              update or withdraw if there's a problem with it.
            </p>
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
              before you send us personal information or take part in the test.
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
