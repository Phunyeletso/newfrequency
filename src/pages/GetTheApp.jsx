import { Link } from "react-router-dom";
import Button from "../components/Button";
import Section from "../components/Section";
import Notice from "../components/Notice";
import InviteForm from "../components/InviteForm";
import useDocumentTitle from "../lib/useDocumentTitle";
import { APP, DOWNLOAD } from "../lib/config";

const ANDROID_STEPS = [
  {
    title: "Download the file",
    body: "Tap the download button above. Your browser saves an .apk file, which is the app's installer.",
  },
  {
    title: "Let your browser install it",
    body: "Android only installs apps from the Play Store unless you say otherwise. When it asks, allow your browser to install apps. You can also set this yourself: Settings › Apps › your browser › Install unknown apps › Allow.",
  },
  {
    title: "Open the file and tap Install",
    body: "Find it in your notifications or your Downloads folder, tap it, then tap Install.",
  },
  {
    title: "If Play Protect warns you",
    body: "You may see “unsafe app blocked” or “app not recognised”. That appears for any app Google hasn't scanned through the Play Store, which includes every test build like this one. Tap More details, then Install anyway.",
  },
  {
    title: "Open newFrequency",
    body: "It'll be in your app drawer with everything else.",
  },
];

export default function GetTheApp() {
  useDocumentTitle(
    "Get the app",
    "Install the newFrequency test build on Android, or request a TestFlight invite for iOS. It's an early build, so expect bugs.",
  );

  return (
    <>
      <section className="px-5 pb-10 pt-12 sm:pt-16">
        <div className="mx-auto max-w-content">
          <h1 className="text-3xl leading-[1.15] sm:text-4xl">Get the app</h1>
          <p className="mt-5 max-w-prose text-lg text-muted text-pretty">
            newFrequency is in testing. It isn't on the App Store or Google Play,
            so installing it takes a couple more steps than usual. Here's exactly
            what those are.
          </p>

          <Notice className="mt-6 max-w-prose">
            <strong className="font-medium text-ink">Before you start:</strong>{" "}
            This is an early test build. You may encounter bugs, glitches, or
            incomplete features during testing, and some features may change or
            behave differently over time. Please install the app with the
            understanding that this is a work in progress.
          </Notice>
        </div>
      </section>

      {/* Android */}
      <Section title="Android" className="border-t border-line">
        <div className="max-w-prose">
          {DOWNLOAD.androidApkUrl ? (
            <>
              <Button href={DOWNLOAD.androidApkUrl} className="mb-3">
                Download for Android (.apk)
              </Button>
              <p className="mb-8 text-sm text-faint">Version {APP.version}</p>
            </>
          ) : (
            /*
              VITE_ANDROID_APK_URL is not set, so there is no file to hand over.
              This used to render the same button with no href, which looked
              live and did nothing at all: a tester tapped it, nothing happened,
              and there was no way for them to know whether the site was broken
              or their phone was. Say it instead, and point them somewhere that
              works.
            */
            <>
              <Notice className="mb-6 max-w-prose">
                <strong className="font-medium text-ink">
                  The Android build is not up yet.
                </strong>{" "}
                There is no file to download at the moment. Leave your email on
                the{" "}
                <Link to="/contact" className="link-underline text-ink">
                  contact page
                </Link>{" "}
                and we will tell you the day it goes live.
              </Notice>
              <p className="mb-8 text-sm text-faint">
                The steps below are what installing it will look like.
              </p>
            </>
          )}

          <h3 className="mb-4 text-lg">Installing it</h3>
          <ol className="space-y-4">
            {ANDROID_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                    bg-raised text-sm font-semibold text-muted"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div>
                  <h4 className="mb-1 font-medium">{s.title}</h4>
                  <p className="text-sm text-muted text-pretty">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

        </div>
      </Section>

      {/* iOS */}
      <Section title="iPhone and iPad" className="border-t border-line">
        <div className="max-w-prose">
          {DOWNLOAD.iosTestFlightLive && DOWNLOAD.iosTestFlightUrl ? (
            <>
              <p className="mb-6 text-muted text-pretty">
                iOS testing runs through TestFlight, Apple's official app for
                test builds. Install TestFlight first, then open our invite link.
              </p>
              <Button href={DOWNLOAD.iosTestFlightUrl}>Open in TestFlight</Button>
            </>
          ) : (
            <>
              <p className="mb-4 text-muted text-pretty">
                There's no file you can download and install on iPhone, because
                Apple doesn't allow it. iOS testing has to go through
                TestFlight, and that needs a separate invitation for each
                tester.
              </p>
              <p className="mb-6 text-muted text-pretty">
                Leave your email and we'll send you one when a slot opens. We'll
                use it for the invite and nothing else.
              </p>
              <InviteForm />
            </>
          )}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="mb-2 text-2xl">Once you've used it</h2>
          <p className="mb-6 max-w-prose text-muted text-pretty">
            Tell us what broke, what confused you, and what you'd change. No
            account needed and it takes about thirty seconds.
          </p>
          <Button to="/feedback">Send feedback</Button>
        </div>
      </Section>
    </>
  );
}
