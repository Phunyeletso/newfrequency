import Button from "../components/Button";
import Section from "../components/Section";
import Notice from "../components/Notice";
import ContentTypes from "../components/ContentTypes";
import useDocumentTitle from "../lib/useDocumentTitle";

const LEAD_POINTS = [
  {
    title: "Scarcity is real",
    body: "An artist publishes a specific song once, with the number of licences they choose. There's no second run. When they're gone, they're gone, which is what makes holding one worth something, and what gives resale a floor.",
  },
  {
    title: "Musicians get paid directly by their supporters",
    body: "A licence is sold by the artist directly to the supporter, at a price the artist sets. It's the right to use the song, not ownership of it, and not a share of a royalty pool or a fraction of a stream.",
  },
  {
    title: "Proof you can scout talent",
    body: "Owning a licence is proof you backed an artist early. It's a record of your ability to scout talent before anyone else did.",
  },
];

export default function Home() {
  useDocumentTitle(
    null,
    "An app for short videos, photos and music. Watching is free. Buy a song licence from the artist at their price, and you can resell at your price.",
  );

  return (
    <>
      {/* Hero */}
      <section className="px-5 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-content">
          <h1 className="max-w-[24ch] text-3xl leading-[1.15] sm:text-5xl">
            Buy a music licence to use in your content.
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted text-pretty sm:text-xl">
            An app for short videos, photos and music. Watching is free. To use a
            song, buy a licence from the artist at their price, and you can
            resell at your price.
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
        title="Four kinds of post"
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
              Watching is free, all of it. Post photos, video and text as much
              as you like. You only pay when you want to put someone else's song
              behind your post.
            </p>
            <Button to="/get-the-app" variant="secondary">Get the app</Button>
          </div>
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-2 text-xl">If you make music</h2>
            <p className="mb-4 text-muted text-pretty">
              Put a song up as a Tune, set your price, and decide how many
              licences exist. You'll need to provide proof you own it. You're
              paid when a supporter buys one, and you earn a royalty again each
              time that licence is resold.
            </p>
            <Button to="/for-artists" variant="secondary">How licensing works</Button>
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
            qualifying creators are eligible to earn from their content.
          </li>
          <li className="text-pretty">
            <strong className="font-medium text-ink">Wallet:</strong> holds what
            you top up and what you earn, and pays for licences and tips.
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
