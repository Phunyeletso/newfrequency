import useDocumentTitle from "../lib/useDocumentTitle";

const UPDATED = "12 September 2026";
const CONTACT_URL = "https://www.newfrequency.co.za/contact";

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="link-underline text-ink"
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export default function ChildSafety() {
  useDocumentTitle(
    "Child safety standards",
    "newFrequency standards against child sexual abuse and exploitation.",
  );

  return (
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">
          newFrequency Child Safety Standards
        </h1>
        <p className="mt-3 text-sm text-faint">Last updated {UPDATED}</p>

        <div className="mt-8 space-y-8 text-muted text-pretty">
          <section>
            <h2 className="mb-3 text-xl text-ink">Child Safety Standards</h2>
            <p>
              newFrequency is committed to maintaining a safe platform and has
              zero tolerance for child sexual abuse and exploitation (CSAE),
              child sexual abuse material (CSAM), grooming, sextortion,
              trafficking, or any other content or behaviour that sexually
              exploits, abuses, or endangers children.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Prohibited content and behaviour</h2>
            <p>Users may not use newFrequency to create, upload, share, promote, request, distribute, or facilitate:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Child sexual abuse material (CSAM).</li>
              <li>Sexual exploitation or abuse of minors.</li>
              <li>Grooming or attempts to establish relationships with minors for sexual purposes.</li>
              <li>Sextortion involving minors.</li>
              <li>Sexual trafficking or exploitation of children.</li>
              <li>Sexualised content involving minors.</li>
              <li>Requests for sexual images, videos, messages, or other sexual content involving minors.</li>
              <li>Content or behaviour that facilitates, encourages, glorifies, or normalises child sexual abuse or exploitation.</li>
            </ul>
            <p className="mt-4">Accounts or content that violate these standards may be removed or suspended.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Reporting child safety concerns</h2>
            <p>newFrequency provides mechanisms within the app for users to report content, accounts, or behaviour that may violate our safety standards.</p>
            <p className="mt-4">Reports involving potential child sexual abuse or exploitation are treated as high-priority safety matters.</p>
            <p className="mt-4">Where required by applicable law, confirmed or suspected child sexual abuse material or exploitation may be reported to the appropriate authorities or child-safety organisations.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Enforcement</h2>
            <p>We may remove content, restrict functionality, suspend accounts, permanently terminate accounts, preserve relevant information where legally required, and cooperate with appropriate law-enforcement or child-protection authorities when investigating suspected child sexual abuse or exploitation.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Compliance</h2>
            <p>newFrequency complies with applicable child-safety laws and regulations and does not permit its services to be used for the sexual exploitation or abuse of children.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Child safety contact</h2>
            <p>
              Questions or reports concerning child safety on newFrequency can
              be submitted through our{" "}
              <ExternalLink href={CONTACT_URL}>official contact page</ExternalLink>.
            </p>
            <p className="mt-4">For an immediate threat to a child&apos;s safety, users should contact their local law-enforcement or emergency services.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
