import Button from "../components/Button";
import Section from "../components/Section";
import Notice from "../components/Notice";
import useDocumentTitle from "../lib/useDocumentTitle";

const STEPS = [
  {
    n: "1",
    title: "Put your song up as a Tune",
    body: "Upload a song you created and post it as a Tune. There is no purchase requirement. The song remains yours, and you choose whether to share it.",
  },
  {
    n: "2",
    title: "Let other creators use it freely",
    body: "Other people can use your Tune across the app without buying permission. Your music can travel further without a paywall in front of every post.",
  },
  {
    n: "3",
    title: "Start earning automatically",
    body: "You do not need an application or approval to start earning. Gifts, pay-per-scroll support and ad revenue share can all contribute when your content is supported.",
  },
  {
    n: "4",
    title: "Earn when your music is used",
    body: "When your Tune is used in posts across New Frequency, it helps people discover your work and can earn through gifts, pay-per-scroll support and ad revenue share.",
  },
  {
    n: "5",
    title: "Go live and receive gifts",
    body: "Live streams give supporters a direct way to send gifts in real time. The exact gift catalogue and creator share will be published before the feature is offered commercially.",
  },
];

export default function ForArtists() {
  useDocumentTitle(
    "For artists",
    "Post your music freely, let it travel across the app, and earn automatically through gifts, pay-per-scroll support and ad revenue share.",
  );

  return (
    <>
      <section className="px-5 pb-10 pt-12 sm:pt-16">
        <div className="mx-auto max-w-content">
          <h1 className="max-w-[20ch] text-3xl leading-[1.15] sm:text-4xl">
            Your music travels. Your content earns.
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted text-pretty">
            On New Frequency, every creator can start earning without an
            application or approval. Post a Tune, let other creators use it
            freely, and build support around your work.
          </p>
        </div>
      </section>

      <Section title="How it works" className="border-t border-line">
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-xl border border-line bg-surface p-5"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                  bg-accent/10 text-sm font-semibold text-accent"
                aria-hidden="true"
              >
                {s.n}
              </span>
              <div>
                <h3 className="mb-1.5 text-lg text-balance">{s.title}</h3>
                <p className="text-sm text-muted text-pretty">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Why automatic monetisation matters" className="border-t border-line">
        <div className="max-w-prose space-y-4 text-muted">
          <p className="text-pretty">
            New Frequency puts earning into the normal experience of sharing.
            You do not have to wait for an invitation or meet a follower
            threshold before your work can be supported.
          </p>
          <p className="text-pretty">
            Supporters can send gifts directly on posts and livestreams. Viewers
            can also choose pay-per-scroll support, and qualifying
            content may receive a share of advertising revenue.
          </p>
          <p className="text-pretty">
            Music can be used freely across the app. When your Tune travels into
            other creators' posts, it can bring new listeners and contribute to
            gifts, pay-per-scroll support and ad revenue share.
          </p>
        </div>
      </Section>

      <Section title="Straight answers about earning" className="border-t border-line">
        <dl className="max-w-prose space-y-6">
          <div>
            <dt className="mb-1.5 font-medium">Do I need approval to start earning?</dt>
            <dd className="text-muted text-pretty">
              No application or approval is needed to start earning. Post your
              content and it can receive support through the available earning
              mechanisms.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">How can supporters support me?</dt>
            <dd className="text-muted text-pretty">
              Supporters can send gifts on posts and livestreams. Viewers can
              optionally choose pay-per-scroll support, and qualifying content
              can earn a share of advertising revenue.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">How much will I make?</dt>
            <dd className="text-muted text-pretty">
              It depends on the support your content receives and whether it
              qualifies for a share of advertising revenue. Gift values, ad eligibility
              requirements and creator revenue shares are not yet published.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">Can people use my music?</dt>
            <dd className="text-muted text-pretty">
              Yes. Other creators can use your Tune freely across the app without
              paying for permission.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">Can I take money out?</dt>
            <dd className="text-muted text-pretty">
              Withdrawal details are still being finalised for the new
              monetisation model. We will publish the available methods,
              timing and requirements before withdrawals open.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">What are the ad requirements?</dt>
            <dd className="text-muted text-pretty">
              The eligibility rules and revenue share have not been specified
              yet. We will publish them before advertising revenue share is offered.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">Do I keep the rights to my music?</dt>
            <dd className="text-muted text-pretty">
              Yes. The song stays yours. Posting it as a Tune lets other creators
              use it freely on New Frequency.
            </dd>
          </div>
        </dl>

        <Notice className="mt-8 max-w-prose">
          Only upload music you created or have permission to share. The exact
          rights and takedown process still apply, even though New Frequency does
          not sell access to music.
        </Notice>
      </Section>

      <Section className="border-t border-line">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="mb-2 text-2xl">Get on the test build</h2>
          <p className="mb-6 max-w-prose text-muted text-pretty">
            It's early and it's rough in places. If you list a song and something
            about the process annoys you, that's exactly what we need to hear.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to="/get-the-app">Get the app</Button>
            <Button to="/feedback" variant="secondary">Send feedback</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
