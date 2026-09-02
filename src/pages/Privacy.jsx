import { Link } from "react-router-dom";
import Notice from "../components/Notice";
import useDocumentTitle from "../lib/useDocumentTitle";
import { COMPANY } from "../lib/config";

const UPDATED = "18 August 2026";

// LEGAL REVIEW REQUIRED: the historical transaction and ownership-record
// language below may have compliance implications. Do not silently remove or
// rewrite it as the monetisation model changes.

/** Renders the support email when we have one, otherwise points at the form. */
function ContactRoute() {
  if (COMPANY.supportEmail) {
    return (
      <a href={`mailto:${COMPANY.supportEmail}`} className="link-underline text-ink">
        {COMPANY.supportEmail}
      </a>
    );
  }
  return (
    <Link to="/contact" className="link-underline text-ink">
      the contact form on this site
    </Link>
  );
}

export default function Privacy() {
  useDocumentTitle(
    "Privacy policy",
    "How New Frequency handles personal information in the newFrequency app and on this website, under South Africa's POPIA.",
  );

  return (
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-faint">Last updated {UPDATED}</p>

        <p className="mt-6 text-lg text-muted text-pretty">
          This policy covers both the newFrequency app and this website. It
          explains what we collect, why we have it, how long we keep it, and how
          you get it deleted.
        </p>

        <Notice className="mt-6">
          We're based in South Africa and we handle personal information under
          South Africa's Protection of Personal Information Act (POPIA). This
          policy follows South African law wherever you're reading it from.
        </Notice>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="mb-3 text-xl">Who is responsible</h2>
            <p className="text-muted text-pretty">
              {COMPANY.legalName} is the responsible party for both the app and
              this website. You can reach us about anything on this page through{" "}
              <ContactRoute />.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">The app and the website are separate</h2>
            <p className="text-muted text-pretty">
              They keep their information in two different places. What you type
              into the feedback form on this website does not go anywhere near
              your app account, and this website cannot read your app data. We
              have kept them apart deliberately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">What the app collects</h2>
            <p className="mb-4 text-muted text-pretty">
              To run an account and let creators receive support, the app holds:
            </p>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium">Your account details</dt>
                <dd className="text-muted text-pretty">
                  What you give us when you sign up, and your profile as you set
                  it up. Used to identify your account and let people find you.
                </dd>
              </div>
              <div>
                <dt className="font-medium">What you post</dt>
                <dd className="text-muted text-pretty">
                  Your Reels, Tunes, Snaps and Chat posts, and whether each was
                  captured in the app or uploaded. Used to show your posts to
                  people and to run the app.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Your wallet balance and transactions</dt>
                <dd className="text-muted text-pretty">
                  The balance in your wallet, and a record of what you bought,
                  sold and tipped. We need this so the wallet adds up and so you
                  and the creator can see how support was recorded.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Historical music ownership records</dt>
                <dd className="text-muted text-pretty">
                  Historical records of music ownership and related transactions
                  from earlier versions of the service. These records are retained
                  for accounting and dispute handling.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Proof of ownership from artists</dt>
                <dd className="text-muted text-pretty">
                  If you put a song up as a Tune, whatever you send us to show the
                  song is yours. Used only to check that, and kept in case the
                  ownership of a track is ever disputed.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Comments and searches</dt>
                <dd className="text-muted text-pretty">
                  Comments you leave, and what you search for in the app. Used to
                  show your comments to people and to return search results.
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-xl">What this website collects</h2>
            <p className="mb-4 text-muted text-pretty">
              Only what you type into a form here, plus two details attached to it.
              Nothing else is gathered automatically.
            </p>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium">Your feedback</dt>
                <dd className="text-muted text-pretty">
                  What you liked, what you didn't, your rating, and whether you'd
                  keep using the app. We use it to decide what to fix and build
                  next.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Your device details (optional)</dt>
                <dd className="text-muted text-pretty">
                  Only if you type them in. Used to reproduce bugs on the phone
                  they happened on. This is free text you write yourself; we don't
                  read anything off your device or fingerprint your browser.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Your enquiry</dt>
                <dd className="text-muted text-pretty">
                  If you use the contact form: your email, what your message is
                  about, and the message itself. Used to answer you, and kept
                  while we deal with it.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Your email</dt>
                <dd className="text-muted text-pretty">
                  Required on the contact form, because a reply is the point of
                  it. Optional everywhere else: on feedback it's only used to
                  reply, and on the iOS form only to send a TestFlight invitation.
                  We don't add you to a mailing list and we don't market to you.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Time of submission and referring page</dt>
                <dd className="text-muted text-pretty">
                  Recorded with each submission so we know when feedback arrived
                  and which page it came from. That's the extent of the automatic
                  collection.
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 text-xl">On what basis</h2>
            <p className="mb-3 text-muted text-pretty">
              For the app, most of it is because we can't provide the service
              without it.               You can't have an account without account details, or receive
              creator support without records needed to operate the service.
            </p>
            <p className="text-muted text-pretty">
              For anything optional (your email, your device details, feedback)
              you choose to give it, and you can withdraw that by asking us to
              delete it. Nothing stops working if you do.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">How long we keep it</h2>
            <p className="mb-3 text-muted text-pretty">
              App information is kept while your account is open. If you delete
              your account, we delete your personal information, with one
              exception: records of completed sales are kept, because an artist and
              a buyer both have a right to a record of a transaction between them,
              and because we may be required to keep them.
            </p>
            <p className="text-muted text-pretty">
              Enquiries are kept until they're dealt with, and for a reasonable
              period after in case you follow up. Website feedback is kept while
              we're actively working on the app, and
              deleted once it's no longer useful or when you ask us to, whichever
              comes first. Emails given for a TestFlight invite are deleted when
              the test programme ends.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Who can see it</h2>
            <p className="mb-3 text-muted text-pretty">
              The New Frequency team, and the companies that host our databases on
              our behalf. Nobody else. We don't sell personal information and we
              don't share it with advertisers.
            </p>
            <p className="mb-3 text-muted text-pretty">
              Some things you do in the app are visible to other people by design:
              your profile, your posts and your comments. Financial balances and
              transaction records are not public.
            </p>
            <p className="text-muted text-pretty">
              We will never publish your feedback, your name or your email,
              including as a quote or testimonial, unless we ask you first and
              you say yes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Security</h2>
            <p className="text-muted text-pretty">
              Information travels over an encrypted connection and is stored with
              access limited to the people who need it. No system is perfect, and
              this is an early build. If something goes wrong that puts your
              information at risk, we'll tell you and the Information Regulator, as
              POPIA requires.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Analytics</h2>
            <p className="text-muted text-pretty">
              This website runs no analytics, no advertising trackers and no
              third-party cookies. If we add anything, we'll say so here before it
              goes live.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Your rights</h2>
            <p className="mb-3 text-muted text-pretty">Under POPIA you can ask us to:</p>
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-muted">
              <li>tell you what personal information we hold about you;</li>
              <li>correct anything that's wrong;</li>
              <li>delete it;</li>
              <li>stop processing it.</li>
            </ul>
            <p className="mb-3 text-muted text-pretty">
              Ask through <ContactRoute /> and we'll action it. If you're asking about
              website feedback and didn't leave an email with it, tell us roughly
              when you sent it and what it said so we can find the right record.
            </p>
            <p className="text-muted text-pretty">
              If you're unhappy with how we've handled your information, you can
              complain to the Information Regulator of South Africa at{" "}
              <a
                href="https://inforegulator.org.za"
                className="link-underline text-ink"
                rel="noopener noreferrer"
                target="_blank"
              >
                inforegulator.org.za
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Children</h2>
            <p className="text-muted text-pretty">
              If you're under 18, POPIA requires a parent or guardian to agree
              before you give us personal information. If you're a parent and your
              child has signed up without your agreement, contact us and we'll
              remove the account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Changes</h2>
            <p className="text-muted text-pretty">
              If this policy changes we'll update the date at the top. The app is in
              active testing, so it may change as the product does.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-faint">
          See also our{" "}
          <Link to="/terms" className="link-underline">
            terms of use
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
