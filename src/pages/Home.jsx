import Button from "../components/Button";
import Section from "../components/Section";
import Notice from "../components/Notice";
import ContentTypes from "../components/ContentTypes";
import useDocumentTitle from "../lib/useDocumentTitle";

const LEAD_POINTS = [
  {
    title: "Every creator earns automatically",
    body: "There is no application or approval process before you can start earning. Post your work and your content can earn through gifts, optional pay-per-scroll support and ad revenue share.",
  },
  {
    title: "Viewers choose how to support creators",
    body: "Viewers can send a gift, choose pay-per-scroll support, or watch an available ad while supporting the creator.",
  },
  {
    title: "Artists earn when music travels",
    body: "Post a Tune and let other creators use your music freely across the app. Your music can keep earning through gifts, optional pay-per-scroll support and ad revenue share wherever it is used.",
  },
];

export default function Home() {
  useDocumentTitle(
    null,
    "New Frequency is a social media platform where all creators are automatically monetized through gifts, pay-per-scroll support and ad revenue share.",
  );

  return (
    <>
      {/* Hero */}
      <section className="px-5 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-content">
          <h1 className="max-w-[24ch] text-3xl leading-[1.15] sm:text-5xl">
            A social media platform where all creators are automatically monetized.
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted text-pretty sm:text-xl">
            New Frequency gives every creator a way to earn from the content they
            share. Supporters can send gifts, choose pay-per-scroll support, or
            watch available ads.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/get-the-app">Get the app</Button>
            <Button to="/for-artists" variant="secondary">
              I make music
            </Button>
          </div>

          <Notice className="mt-8 max-w-prose">
            This is an early test build, on Android and iOS. It isn't on the App
            Store or Google Play yet.
          </Notice>
        </div>
      </section>

      {/* The three things worth leading with */}
      <Section title="What makes it different" className="border-t border-line">
        <ol className="grid gap-4 sm:grid-cols-3">
          {LEAD_POINTS.map((p, i) => (
            <li key={p.title} className="rounded-xl border border-line bg-surface p-5">
              <span
                className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full
                  bg-accent/10 text-sm font-semibold text-accent"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg text-balance">{p.title}</h3>
              <p className="text-sm text-muted text-pretty">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Post types */}
      <Section
        title="Five ways to share"
        lead="Everything on newFrequency is one of these."
        className="border-t border-line"
      >
        <ContentTypes />
      </Section>

      {/* For whoever you are */}
      <Section className="border-t border-line">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-2 text-xl">If you just want to watch and post</h2>
            <p className="mb-4 text-muted text-pretty">
              Post photos, video and text as much as you like. Choose whether to
              support creators with gifts, pay-per-scroll support, or available
              ads.
            </p>
            <Button to="/get-the-app" variant="secondary">Get the app</Button>
          </div>
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-2 text-xl">If you make music</h2>
            <p className="mb-4 text-muted text-pretty">
              Put a song up as a Tune and let other creators use it freely across
              the app. You can earn through gifts, pay-per-scroll support and ad
              revenue share whenever your music is used.
            </p>
            <Button to="/for-artists" variant="secondary">How artists earn</Button>
          </div>
        </div>
      </Section>

      {/* Also in the app */}
      <Section
        title="Also in the app"
        lead="Supporting pieces."
        className="border-t border-line"
      >
        <ul className="grid gap-x-8 gap-y-3 text-muted sm:grid-cols-2">
          <li className="text-pretty">
            <strong className="font-medium text-ink">Trust:</strong> a verified
            badge on content we can trust.
          </li>
          <li className="text-pretty">
            <strong className="font-medium text-ink">Marketplace:</strong> sell
            things you own to other people on the app.
          </li>
          <li className="text-pretty">
            <strong className="font-medium text-ink">Monetisation:</strong>{" "}
            every creator can earn automatically through gifts, optional
            pay-per-scroll support and ad revenue share.
          </li>
          <li className="text-pretty">
            <strong className="font-medium text-ink">Support:</strong> viewers
            choose gifts, pay-per-scroll support or ads.
          </li>
        </ul>
      </Section>

      {/* Close */}
      <Section className="border-t border-line">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="mb-2 text-2xl">Try it and tell us what's wrong with it</h2>
          <p className="mb-6 max-w-prose text-muted text-pretty">
            We're testing. The most useful thing you can send us is the part you
            didn't like.
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
