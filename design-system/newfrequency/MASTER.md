# newFrequency Web Design System

This system follows the live app's design tokens in `C:/Users/user/Desktop/newFrequency/constants/design.js` and the verified product status in `docs/PRODUCT_STATUS.md`. The app repository is read-only from the website project; update this file when its authoritative tokens or feature status change.

## Product direction

- Product: South African creator-social app for Reels, Tunes, Snaps and Chats, with creator support and community features.
- Pattern: feature-rich product showcase that tells one connected story. Use real product states and useful actions instead of invented testimonials, growth figures or brand logos.
- Visual style: near-black media canvas, clean white text, app-green primary actions, and content-type colors used only as accents.
- Use the native app's post/feed structure as a reference. Website device screens are labeled illustrative when they do not contain actual captured app media.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--ground` | `#0A0A0B` | Page background |
| `--surface` | `#141416` | Cards and feed surface |
| `--surface-raised` | `#1C1C1F` | Raised cards and controls |
| `--line` | `#2A2A30` | Borders and separators |
| `--ink` | `#F4F4F5` | Primary text |
| `--muted` | `#A1A1AA` | Body copy |
| `--faint` | `#85858E` | Secondary labels; retain readable contrast |
| `--accent` | `#22C55E` | Primary and positive actions |
| `--accent-dim` | `#16A34A` | App accent's dark state |
| Reels | `#7C3AED` | Reel markers and illustrative media only |
| Tunes | `#10B981` | Tune markers and waveforms |
| Snaps | `#F59E0B` | Snap markers |
| Chats | `#3B82F6` | Chat markers |

## Type and layout

- Use the current system sans stack; do not add remote font requests.
- Large editorial headlines use tight tracking and responsive `clamp()` sizing. Body copy should stay readable and line lengths should remain constrained.
- Use mobile-first content width, generous section spacing, visible focus, and consistent 44px minimum interactive controls.
- Retain app navigation labels and ordering in any product illustration: Reels, Tunes, Snaps, Chats; the bottom bar is Home, Collection, Create, Notifications, Profile.

## Motion and scroll story

- Build one sticky product illustration that follows the reader through the story using a passive, animation-frame-throttled viewport-center scroll tracker; leave browser scrolling native and all story copy present in the document.
- Animate opacity/transform only, with short transitions. Avoid scroll-jacking, forced pinning, number counters, continuous decorative motion, and hiding essential copy until JavaScript runs.
- Keep one focal motion per viewport. `prefers-reduced-motion: reduce` removes transitions and presents a stable readable state.
- On narrow screens, keep the illustration compact and sticky only within its story section; ensure it does not cover headings or controls.

## Product truth and screen states

- Reels, Tunes, Snaps and Chats are actual post types. Tune selection can add audio to a creator's post; do not claim Tune reuse creates royalties.
- Tips, gifts and eligible paid scroll use Frequency Coins in current source. Purchased Coins are non-withdrawable and remain separate from ZAR creator earnings. Store billing, full database verification and release-device validation remain gates.
- Frequency Trails support attribution relationships in current source; staging migration and release-device verification remain. A Trail is not a license, endorsement or payout promise.
- Missions support private drafts and local submission workflows; authorization/database release checks remain. Funding and public launch stay closed.
- Live, Marketplace and Frequency SOS must carry their current test/release status. Keep SOS live dispatch unavailable until its consented staging and device gates pass.

## Accessibility and quality

- Preserve semantic headings, form labels, keyboard operation, visible focus, descriptive controls and contrast.
- Do not use color as the only feature-status signal. Label illustrative UI for screen readers and keep its fictional actions out of the accessibility tree.
- Check responsive layouts at 320, 360, 390, 412, 768, 1024, 1366 and 1920px. Check reduced motion and JS-disabled readability.
