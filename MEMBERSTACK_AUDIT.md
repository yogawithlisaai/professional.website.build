# Memberstack Audit

Repo-wide search for every trace of Memberstack across `.html`, `.js`, and `.css` files. No files were modified as part of this audit.

**Method:** grepped for the literal string `memberstack` (case-insensitive), for `data-ms-*` attributes, for `ms-` prefixed classes/IDs, and for the two API domains Memberstack scripts load from (`static.memberstack.com`, `api.memberstack.io`). Checked `nav.js`, `ga4-events.js`, and `style.css` explicitly. Checked whether each hit is exercised by any actual logic on the page (a form using it, an attribute selector reading it) or just present as inert markup.

## Summary

- **31 live pages** load the Memberstack script tag. In **28 of them it is dead code** — loaded, never referenced by anything else on the page.
- **Real functional usage exists in exactly 2 live pages**: `signin.html` (login form) and `create-account.html` (signup form). Both hand their entire auth flow to Memberstack — neither has a form `action`, a submit handler, or any fallback.
- **One CSS rule** (`style.css:1303`) gates visibility on Memberstack's member-login state, but the markup it targets (`.mcard`, `.locked`, `.lock`, `.card-shelf`, `.card-track`) doesn't exist on any page in the repo. It's a dead rule for a feature that was never wired up (or was removed after the CSS was written).
- **Two orphaned draft files** (`create-account-backup.html`, `drafts/login.backup.html`) also reference Memberstack but aren't linked from anywhere live.
- **`nav.js` and `ga4-events.js` have zero Memberstack references.**
- One real app ID appears 31 times (`app_cmfs64j5s00jl0wu4h1ee40in`); one legacy public key appears once, in the orphaned draft (`pk_f2c8df1bd82da003cc34`); one literal placeholder (`YOUR_ID`) appears once, in the orphaned backup.

---

## Category A — Script loaded, nothing else on the page uses it (dead)

Every file below has exactly one Memberstack-related line: the script tag. No `data-ms-*` attribute, no reference to the app's members-only state, nothing else on the page depends on it. Removing the `<script>` tag would change nothing observable on any of these pages.

| File | Line | What's there |
|---|---|---|
| `index.html` | 30 | `<script data-memberstack-app="app_cmfs64j5s00jl0wu4h1ee40in" src="https://static.memberstack.com/scripts/v1/memberstack.js">` |
| `about.html` | 27 | same script tag |
| `about-lisa-eshun-wilson.html` | 27 | same script tag |
| `accessibility.html` | 28 | same script tag |
| `ai-yoga-instructor-personalized-wellness.html` | 30 | same script tag |
| `bali-yoga-retreat-women-30s.html` | 29 | same script tag |
| `blog-old.html` | 27 | same script tag |
| `blog-post-template.html` | 29 | same script tag (this file itself is orphaned — see note below) |
| `class-schedule.html` | 28 | same script tag |
| `corporate-wellness.html` | 28 | same script tag |
| `data-protection.html` | 28 | same script tag |
| `enduserlicenseagreement.html` | 38 | same script tag |
| `free-members.html` | 28 | same script tag |
| `giveback.html` | 28 | same script tag |
| `login.html` | 19 | same script tag — see "login.html" section below, this page has no form at all |
| `membership.html` | 332 | same script tag — see "membership.html" section below |
| `on-demand.html` | 28 | same script tag |
| `premium.html` | 28 | same script tag |
| `privacy.html` | 38 | same script tag |
| `private-sessions.html` | 38 | same script tag |
| `terms.html` | 38 | same script tag |
| `ugc-iteration1.html` | 35 | same script tag |
| `vinyasa-yoga-berkeley-beginners-first-class.html` | 30 | same script tag |
| `waitlist.html` | 20-21 | same script tag, split across two lines |
| `welcome.html` | 28 | same script tag |
| `wellness.html` | 28 | same script tag |
| `yoga.html` | 18 | same script tag |
| `yoga-for-burnt-out-women-over-30.html` | 30 | same script tag |
| `yoga-inperson-backup.html` | 28 | same script tag |

All 28 use the identical tag:
```html
<script data-memberstack-app="app_cmfs64j5s00jl0wu4h1ee40in" src="https://static.memberstack.com/scripts/v1/memberstack.js" type="text/javascript"></script>
```
preceded everywhere by an identical `<!-- Memberstack webflow package -->` comment.

**Note on `blog-post-template.html`:** this is itself an orphaned file — nothing in the repo links to it (it predates the `post-template.html` I built earlier this session for the five yoga-* articles, and uses a different, older page structure). It carries the same dead script tag as everything else in this category.

---

## Category B — Real functional usage (login/signup forms)

### `signin.html` — login form, fully dependent on Memberstack

| Line | What's there |
|---|---|
| 18-23 | Script tag (same app ID as Category A) |
| 123 | `<form data-ms-form="login">` — no `action`, no `method`, no submit handler in any linked JS |
| 129 | `<input data-ms-member="email">` |
| 139 | `<input data-ms-member="password">` |
| 157 | `<button data-ms-auth-provider="google">` — Google OAuth trigger |
| 176 | `<a href="https://app.memberstack.com/#/reset-password">Reset it here.</a>` — hardcoded link straight to Memberstack's own hosted password-reset page |

This form has no fallback mechanism of any kind. Memberstack's script is what intercepts the `submit` event, reads the `data-ms-member` fields, and calls its own login API — there is no server-side form handler and no custom JS anywhere in the repo that does this instead.

### `create-account.html` — signup form, fully dependent on Memberstack

| Line | What's there |
|---|---|
| 10 | Script tag |
| 184 | `<form data-ms-form="signup">` |
| 185 | `<input data-ms-member="name">` |
| 187 | `<input data-ms-member="email">` |
| 189 | `<input data-ms-member="password">` |
| 217 | `<button data-ms-auth-provider="google">` |

Same story: no `action`, no handler outside Memberstack's own script.

### `style.css:1303` — the one content-gating rule in the whole repo

```css
/* Unlock state: when logged in, hide lock & remove "locked" pointer behavior */
body[data-ms-member="true"] .mcard.locked .lock { display: none; }
```
Memberstack sets `data-ms-member="true"` on `<body>` when a visitor is a logged-in member. This rule is designed to hide a padlock icon (`.lock`) on a "locked" card (`.mcard.locked`) once that happens — a classic "show a lock icon to non-members, hide it for members" pattern.

**It's dead.** The supporting markup — `.card-shelf`, `.card-track`, `.mcard`, `.mcard-link`, `.mcard-media`, `.mcard .lock`, `.mcard-meta` (all defined at `style.css:1226-1275`, under the comment `/* ===== Member Library Carousel ===== */`) — is not used by a single `class="..."` anywhere in any `.html` file in this repo. Either this carousel component was designed and styled but never actually built into a page, or a page that used it was later removed without cleaning up its CSS. Either way, right now this rule never fires because the elements it targets don't exist.

---

## Category C — Comment-only mentions (no code)

These reference Memberstack in a comment but the comment isn't attached to any live code path — either it's a TODO note or a leftover label.

| File | Line | Comment |
|---|---|---|
| `membership.html` | 387 | `<!-- Link this to your monthly Stripe checkout / Memberstack checkout -->` — the button underneath links to `waitlist.html`, not a checkout |
| `membership.html` | 420 | same TODO, second plan card |
| `membership.html` | 453 | same TODO, third plan card |

These three comments confirm the pricing page's checkout buttons were never actually wired to either Stripe or Memberstack — they're placeholder TODOs describing what was *supposed* to happen, left in place above buttons that currently just point at the waitlist page.

---

## Category D — Orphaned drafts (not linked from any live page)

Confirmed via repo-wide search: nothing under the live site links to either of these two files.

### `create-account-backup.html`
| Line | What's there |
|---|---|
| 191 | `<!-- Memberstack SIGNUP form -->` comment |
| 194, 197, 200 | `data-ms-member="name"/"email"/"password"` on inputs — same pattern as the live `create-account.html` |
| 251 | `<!-- Memberstack script: keep YOUR existing one from signin.html (paste it here) -->` |
| 253 | `<script src="https://static.memberstack.com/scripts/v1/memberstack.js" data-memberstack-id="YOUR_ID"></script>` — **`YOUR_ID` is a literal, unfilled placeholder string**, not a real key. This script tag would not authenticate against any real Memberstack app as it stands. |

### `drafts/login.backup.html`
| Line | What's there |
|---|---|
| 14-17 | `<!-- Memberstack --> <!-- Keep the same script+key you used on index.html --> <script src="https://api.memberstack.io/static/memberstack.js?custom" data-memberstack-id="pk_f2c8df1bd82da003cc34"></script>` |
| 85 | `<!-- Replace YOUR_LOGIN_LINK with the link you copy from Memberstack (Login modal / portal) -->`, followed by `href="YOUR_LOGIN_LINK"` |
| 95-100 | `<!-- Replace each href with the exact checkout/sign-up link from Memberstack -->`, followed by hrefs like `pln_free-plan-pqjp04f9`, `pln_monthly-membership-v4j40n2t` (Memberstack plan-ID-shaped strings, but as literal unresolved `href` values, not working links) |

This draft uses a **different, older Memberstack integration** entirely: the legacy `api.memberstack.io/static/memberstack.js?custom` endpoint with a `pk_`-prefixed public key, versus the `static.memberstack.com/scripts/v1/memberstack.js` + `app_`-prefixed app ID used by every live page. It predates the current integration and was superseded, not extended.

---

## `nav.js` and `ga4-events.js`

Both checked directly: **zero matches** for `memberstack`, `data-ms-`, or `ms-` in either file. Neither script has any awareness of Memberstack.

---

## Every distinct key/ID found

| Value | Where | Status |
|---|---|---|
| `app_cmfs64j5s00jl0wu4h1ee40in` | 31 live files (Categories A & B) | The one real, live app ID |
| `pk_f2c8df1bd82da003cc34` | `drafts/login.backup.html` only | Legacy v1 public key, orphaned draft, not live |
| `YOUR_ID` | `create-account-backup.html` only | Literal placeholder text, not a real key, not live |

---

## Answering the two questions

### Do `login.html` and `membership.html` depend on Memberstack for their core function? What's left if the script is removed?

**No, neither does.**

- **`login.html`** is a menu page, not a form. Its "core function" is a stack of plain `<a href>` buttons: "Make an account" → `create-account.html`, "Subscribe Today" → `membership.html`, Venmo/Zelle/crypto payment links (external, static image/URL links), "Manage My Subscription" → a hardcoded Stripe billing-portal URL, and "Sign In" → `signin.html`. None of these are Memberstack-driven — they're ordinary links. If the script tag were deleted, **every single thing on this page would keep working exactly as it does now.**

- **`membership.html`** is a three-card pricing table. Every "Join"/"Subscribe" button on it currently links to `waitlist.html` (or a `mailto:` link) — not to a real checkout of any kind, Memberstack or Stripe (the "link this to Stripe/Memberstack checkout" comments confirm these were never finished). If the script tag were deleted, **the page would look and behave identically**, because nothing on it currently invokes Memberstack.

The pages that *would* break are the two form pages in Category B: removing the script from `signin.html` or `create-account.html` would leave a plain `<form>` with no `action` — submitting it would do nothing (or reload the page with the query string appended, depending on the browser), since there's no server endpoint or custom JS behind either form.

### Is any content on any page hidden or shown based on Memberstack state?

**By CSS, yes — one rule (`style.css:1303`) — but it's inert.** It's written to hide a lock icon on member-carousel cards once `body[data-ms-member="true"]` is set, but no page in the repo contains the `.mcard`/`.card-shelf` markup that rule targets, so it currently has no visible effect anywhere on the live site.

**No other page has member-gated content.** There's no other CSS selector keyed off `data-ms-member`, no JS that reads Memberstack's member/plan state, and no server-side gating (this is a static site). "Free Plan," "Members-only," and similar wording that appears in the copy on pages like `membership.html`, `on-demand.html`, or `free-members.html` is just text — none of it is backed by an actual visibility toggle.

Nothing has been removed or changed as part of this audit.
