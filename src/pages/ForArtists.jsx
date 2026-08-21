import Button from "../components/Button";
import Section from "../components/Section";
import Notice from "../components/Notice";
import useDocumentTitle from "../lib/useDocumentTitle";

const STEPS = [
  {
    n: "1",
    title: "Put your song up as a Tune",
    body: "A Tune is a song you're offering for sale. You upload it yourself, and you'll need to provide proof you own it before it goes on sale. It stays your song, and you decide whether it's listed at all.",
  },
  {
    n: "2",
    title: "Set your price",
    body: "You choose what a licence for your song costs. Not us, and not an algorithm. A platform fee is taken off the sale, and it's shown to you in the app before you list.",
  },
  {
    n: "3",
    title: "Decide how many licences exist",
    body: "You set the number of copies. Once they're sold, no more exist, so the people who bought early hold something that can't be reprinted.",
  },
  {
    n: "4",
    title: "Get paid when a creator buys one",
    body: "The money comes from the person who wants to use your track, and it lands in your wallet when the sale goes through. It isn't split out of a pool at the end of the month.",
  },
  {
    n: "5",
    title: "Earn again every time it's resold",
    body: "Licences can be resold between users. Each time one of yours changes hands, a royalty goes back to you, for as long as that licence keeps moving.",
  },
];

export default function ForArtists() {
  useDocumentTitle(
    "For artists",
    "Sell usage licences for your own songs at a price you set, cap how many exist, and earn a royalty again each time a licence is resold.",
  );

  return (
    <>
      <section className="px-5 pb-10 pt-12 sm:pt-16">
        <div className="mx-auto max-w-content">
          <h1 className="max-w-[20ch] text-3xl leading-[1.15] sm:text-4xl">
            You set the price. You decide how many exist.
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted text-pretty">
            On newFrequency, a creator who wants your song behind their post has
            to own your music licence. That's the whole model.
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

      <Section title="Why the resale market matters" className="border-t border-line">
        <div className="max-w-prose space-y-4 text-muted">
          <p className="text-pretty">
            A licence isn't only a permission slip. It's something the buyer
            owns and can sell on. If your song gets used and talked about, the
            licences for it become worth holding, and the people who bought them
            early have a reason to have taken the chance on you.
          </p>
          <p className="text-pretty">
            You don't lose out when that happens. Every resale sends a royalty
            back to you, so a track that keeps circulating keeps paying you long
            after the first sale.
          </p>
          <p className="text-pretty">
            There's no follower threshold anywhere in this. You don't need ten
            thousand followers, a manager, or an invitation to list a song. If
            you've made something, you can sell licences for it from your first
            day on the app.
          </p>
        </div>
      </Section>

      <Section title="Straight answers about money" className="border-t border-line">
        <dl className="max-w-prose space-y-6">
          <div>
            <dt className="mb-1.5 font-medium">What does it cost to list a song?</dt>
            <dd className="text-muted text-pretty">
              Listing is free. A platform fee comes off each sale, and the
              amount is shown to you in the app before you confirm anything. You
              will never be charged something you weren't shown first.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">What is the wallet for?</dt>
            <dd className="text-muted text-pretty">
              It holds your balance inside the app. Money arrives in it two
              ways: what you top up yourself, and what you earn when someone
              buys one of your licences or resells one.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">Can I take money out?</dt>
            <dd className="text-muted text-pretty">
              Yes. Money comes out to your bank account. One thing to know:
              deposits and withdrawals are both switched off during testing, and
              will open when we launch.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">How much will I make?</dt>
            <dd className="text-muted text-pretty">
              It depends entirely on what you charge, how many licences you made,
              and how many people buy.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">How does royalty work?</dt>
            <dd className="text-muted text-pretty">
              Every time someone resells your song, you get a 10% royalty on what
              it sells for. You keep earning from a licence long after you first
              sold it, for as long as it keeps changing hands.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">How much is the platform fee?</dt>
            <dd className="text-muted text-pretty">
              10% per transaction. It comes off the sale price, so on a licence
              sold at R10 you keep R9.
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-medium">Do I keep the rights to my music?</dt>
            <dd className="text-muted text-pretty">
              Yes. You're selling a licence to use the track on the app. The song
              stays yours, and you decide whether it's listed.
            </dd>
          </div>
        </dl>

        <Notice className="mt-8 max-w-prose">
          You'll be asked for proof of ownership before a Tune goes on sale. Only
          upload music you actually have the rights to. If you don't own it, or
          you don't have permission from everyone who does, don't list it.
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
