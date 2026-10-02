import useDocumentTitle from "../lib/useDocumentTitle";

const UPDATED = "2 October 2026";

const CONTACT_URL = "https://www.newfrequency.co.za/contact";
const TERMS_URL = "https://www.newfrequency.co.za/terms";
const REGULATOR_URL = "https://inforegulator.org.za/";

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

export default function Privacy() {
  useDocumentTitle(
    "Privacy policy",
    "How New Frequency handles personal information in the newFrequency app and on this website under POPIA.",
  );

  return (
    <section className="px-5 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="text-3xl leading-[1.15] sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-faint">Last updated {UPDATED}</p>

        <div className="mt-8 space-y-8 text-muted text-pretty">
          <p>
            This policy explains what the newFrequency app and this website
            collect, why they use it, who receives it, how long it is kept, and
            how you can exercise your rights.
          </p>

          <p>
            New Frequency is based in South Africa. We handle personal
            information in line with the Protection of Personal Information Act
            (POPIA) and applicable app-store privacy requirements.
          </p>

          <section>
            <h2 className="mb-3 text-xl text-ink">Who is responsible</h2>
            <p>
              New Frequency is responsible for the app and this website.
              Contact us about privacy, access, correction or deletion through{" "}
              <ExternalLink href={CONTACT_URL}>the contact form on this site</ExternalLink>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">The app and website</h2>
            <p>
              The public feedback, invite-request and contact forms use the
              shared app database. When available, the Business and contribution
              workspaces use your existing newFrequency account and the app’s
              Supabase authentication and database. This does not create a
              second user identity.
            </p>
            <p className="mt-4">
              If Mission campaigns are available, a form can include campaign
              details, media, reward split and schedule, plus legal and trading
              names, registration number,
              business type and industry, business contact information and
              representative name and role for verification. The database also
              records verification status, the submitted Mission terms version,
              declarations and campaign review state.
            </p>
            <p className="mt-4">
              Project contributions record your account ID, chosen project and amount,
              payment reference, verified payment status, receipt and any refund
              request or outcome. Paystack processes payment details on its hosted
              checkout; this website does not collect your card number. The team can
              review contribution and refund records to operate the service and
              resolve disputes. Public project totals do not identify contributors.
            </p>
            <p className="mt-4">
              An optional investment conversation records your name, organization,
              contact preference, proposed amount, introduction, consent and review
              history. Only your account and authorized reviewers can access it.
              If you separately opt in to company updates, we record your account,
              consent version and time. You can withdraw that preference in your
              conversation workspace.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl text-ink">Information collected by the app</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium text-ink">Account and profile</h3>
                <p>
                  Email address, password-related authentication data held by
                  Supabase Auth, your name, profile picture, bio, phone number
                  where supplied, account timestamps and account status. This is
                  used to create and secure your account, show your profile and
                  provide account support.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Your activity and content</h3>
                <p>
                  Posts (Reels, Snaps, Tunes and Chat posts), captions, audio
                  and music metadata, thumbnails,
                  likes, follows, saves, shares, views, comments and replies. We
                  use this to publish and operate the feed, search and creator
                  features. Public profiles, posts, comments, likes, follows and
                  some gift activity may be visible to other users according to
                  the app’s settings and access rules.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Search and messages</h3>
                <p>
                  Search terms used to find users or content, direct-message
                  conversations and messages, message replies/reactions and
                  related timestamps or participant IDs. We use these
                  to return results, deliver messages and keep conversations
                  working.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Wallet, coins and transactions</h3>
                <p>
                  ZAR earnings balances, coin balances, gifts, tips or legacy tip
                  records, eligible paid-scroll activity, marketplace orders for
                  goods and services, fees, payment references and transaction
                  timestamps. These records operate the ledger, show your history,
                  pay creators and investigate disputes or refunds. ZAR balances
                  are for earnings; users cannot top them up with a deposit.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Payment and payout details</h3>
                <p>
                  ZAR wallet withdrawals are currently disabled. If payout
                  processing is enabled, the service may receive the bank account
                  number, bank code and optional account name needed to make a
                  payout, and store the payout status and provider references.
                  New Frequency’s app code does not collect or store your card
                  number, CVV or
                  online-banking password. Paystack processes payment details on
                  its own payment pages and may retain them under its own policy.
                  When Mission checkout is enabled, the app calculates the campaign total,
                  starts a hosted Paystack transaction and stores the Mission,
                  amount in minor currency units, provider reference, status and
                  verification timestamps needed for the funding ledger. The app
                  does not receive or store your full card number, CVV or
                  online-banking password. The Mission is credited only after
                  server-side Paystack verification.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Creator and seller verification</h3>
                <p>
                  If marketplace selling is available, sellers can submit an ID document, a
                  face/document photograph, and a bank statement or certificate.
                  These files and the review status are used for identity, seller
                  and payout checks. If brand or business Mission features are
                  available, they can also
                  contain business profile, authorisation, verification documents,
                  campaign information, declarations, reward and usage-rights
                  information.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Missions and brand interactions</h3>
                <p>
                  If a Mission campaign is available, its records may contain a
                  brand, brief, requirements, eligibility, campaign media,
                  deadline, prize pool, reward split,
                  usage rights and submission status. A creator’s selected post
                  can be linked to a mission submission; review decisions and
                  reward records are kept to run the campaign and pay approved
                  rewards.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Reports and safety records</h3>
                <p>
                  Reports about posts or comments, selected report reasons,
                  optional notes, moderation status, hidden/restored content,
                  suspensions or related review and appeal information. Moderators
                  use these records to enforce rules, investigate abuse, protect
                  users and keep an audit trail of safety decisions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Camera, microphone, photos and uploads</h2>
            <p>
              The app asks for camera access when you choose to take a Reel,
              Snap or other camera content. It asks for microphone access
              when you choose to record sound or a Reel. It asks for photo/media access when you choose existing
              photos or videos. It can also use the document picker for audio
              files, PDFs and other creator or seller documents. These permissions
              are optional, but the related capture or upload feature will not
              work if you deny them.
            </p>
            <p className="mt-4">
              Selected media is uploaded only when you publish or submit it.
              Photos, audio, covers, thumbnails and ordinary post media are stored
              in Supabase Storage. Video may be uploaded to Cloudflare Stream when
              that service is configured; otherwise it uses Supabase Storage.
              Seller and identity documents use a private storage area, not the
              public post-media bucket.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Notifications, device and diagnostic data</h2>
            <p>
              If you grant notification permission, the app registers an Expo
              push identifier, platform and the device name supplied by the
              operating system against your account. The identifier is used to
              deliver activity such as likes, messages and purchases; it is
              removed when you sign out where the service can do so. Notification
              records also appear in the app’s activity inbox.
            </p>
            <p className="mt-4">
              The app stores a small local diagnostic log in AsyncStorage: time,
              error context, error message and a short JavaScript stack. It is
              used to help diagnose failures and can be cleared through the app’s
              diagnostics controls. The app does not currently include a separate
              crash-reporting or analytics SDK in its shipped dependency graph.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Advertising and coin purchases</h2>
            <p>
              Advertising is not available in the current release. The app does
              not currently show ads or offer an ad-free tier. If advertising is
              introduced, this policy will be updated before it is enabled.
            </p>
            <p className="mt-4">
              Where coin purchases are available, Android uses Google Play
              Billing and iOS uses Apple In-App Purchase. Google and
              Apple process the payment credentials and store payment records
              under their own terms. New Frequency does not receive your full
              card number, CVV, bank password or Apple/Google account password
              from these purchases. New Frequency receives and stores the selected
              store, product ID, purchase identifier, the account linked to the
              purchase, transaction and verification status, refund or reversal
              status, timestamps and the store response or verification data, and
              the coin-credit record needed to prevent duplicate crediting and to
              reconcile the coin balance. New Frequency verifies the purchase with
              the relevant store before crediting coins, and may reverse or record
              a coin adjustment when the store reports a refund. Coins are for
              in-app spending and cannot be withdrawn. The ZAR wallet is for
              creator earnings; deposits are not available and withdrawals are
              currently disabled.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Website information</h2>
            <p>
              The feedback form can send your answers, rating, whether you would
              keep using the app, optional device description and optional email,
              plus submission time and referring page. The contact form sends your
              email, topic, message, submission time and referring page. An iOS
              invite request sends your email, platform, submission time and
              referring page. The forms also use local browser storage for a short
              submission cooldown and a hidden anti-bot field.
            </p>
            <p className="mt-4">
              This website’s code contains no analytics SDK, advertising tracker
              or third-party cookie integration. Your browser, hosting provider or
              security infrastructure may still create ordinary technical logs;
              those are controlled by the relevant hosting provider rather than by
              the form code.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Service providers and international processing</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="font-medium text-ink">Supabase:</strong> authentication, database, Row Level Security, Edge Functions and file storage for the app. The Business workspace uses the same app account and database when configured. Website feedback forms use the endpoint configured by the site operator.</li>
              <li><strong className="font-medium text-ink">Paystack:</strong> Mission checkout where enabled, payment verification and payout processing where available.</li>
              <li><strong className="font-medium text-ink">Cloudflare Stream:</strong> video upload, encoding, playback, thumbnails and downloads when enabled for the project.</li>
              <li><strong className="font-medium text-ink">Expo services:</strong> the app uses Expo/EAS update and push-registration infrastructure. Push delivery can involve the platform notification services required by Android or iOS.</li>
              <li><strong className="font-medium text-ink">Google Play and Apple:</strong> process coin purchases where available. New Frequency sends the product and purchase identifier to the relevant store for verification and receives the verification result and store transaction information needed to credit or reverse coins.</li>
            </ul>
            <p className="mt-4">
              These providers may process information outside South Africa. We use
              them only for the functions described here, apply contractual or
              technical safeguards where available, and require appropriate
              security for information entrusted to them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">How long information is kept</h2>
            <p>
              We keep account, content, messaging, wallet, safety and mission
              information while needed to provide the service and resolve
              disputes. Website enquiries and feedback are kept while they are
              being handled and for a reasonable follow-up period. Payment,
              payout, tax, ledger, fraud, moderation and audit records may be
              retained for as long as needed for legal, accounting, security or
              dispute purposes.
            </p>
            <p className="mt-4">
              You can request account deletion in the app. The request starts a
              14-day period during which you can sign in and cancel it. After
              that, the service deletes account content, messages, posts,
              comments, reports, notifications, push identifiers and ordinary
              media where the system can identify it, and anonymises the profile
              before deleting the authentication account. Transaction and coin
              ledger rows may be retained and de-identified because they reconcile
              another person’s wallet and may be needed for accounting or
              disputes. Store purchase records, coin-credit and refund records
              may likewise be retained for fraud prevention, refunds, accounting
              and reconciliation. Private KYC documents and their audit record may
              also be retained where required for seller, payment, fraud or legal
              obligations. Media deletion can depend on the relevant storage or
              video provider completing its job.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Security</h2>
            <p>
              The app uses authenticated Supabase requests, database access
              rules, private storage for KYC files, signed temporary document
              links and server-side verification for payment and payout
              operations. Network connections use HTTPS where provided by the
              service. No online system is completely secure, so keep your
              password private and tell us about suspected account or safety
              problems promptly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Children</h2>
            <p>
              If you are a child or minor, use New Frequency only where you are
              legally permitted to do so and where any parent, guardian or other
              consent required by POPIA or applicable law has been obtained. We do
              not use this policy to impose a separate fixed 18+ rule. A parent or
              guardian who believes a child has provided personal information may
              contact us so we can investigate and remove it where appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Your POPIA rights</h2>
            <p>Subject to lawful limits, you may ask us to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>confirm whether we hold personal information about you and give access to it;</li>
              <li>correct or update inaccurate information;</li>
              <li>object to processing or ask us to stop or restrict it where POPIA permits;</li>
              <li>ask for deletion, subject to records we must retain;</li>
              <li>ask about the source, purpose and recipients of your information; and</li>
              <li>complain to the Information Regulator of South Africa.</li>
            </ul>
            <p className="mt-4">
              Send a request through{" "}
              <ExternalLink href={CONTACT_URL}>the contact form on this site</ExternalLink>.
              We may need enough information to verify that you are the account
              holder. We will respond within the period required by applicable law
              and explain any lawful reason we cannot complete a request.
            </p>
            <p className="mt-4">
              You can contact the Information Regulator at{" "}
              <ExternalLink href={REGULATOR_URL}>inforegulator.org.za</ExternalLink>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl text-ink">Changes</h2>
            <p>
              We will update the date above when this policy changes. If a change
              materially affects how the app uses personal information, we will
              use an appropriate in-app or website notice where practical.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-faint">
          See also our{" "}
          <ExternalLink href={TERMS_URL}>terms of use</ExternalLink>.
        </p>
      </div>
    </section>
  );
}
