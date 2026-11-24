# Cohesive redesign — report

Branch `refine/cohesive-redesign`, HEAD `45ddf7f`, seven commits from `main @ f9a622f`. Not merged, not pushed, not deployed. The owner reviews it first.

The brief was cohesion. The last two rounds added real content and controls, and the owner said the result read as appended sections rather than one intentional visual system. This round tightened what existed into a single design system. It added no new feature, no new motif, and no new content. Every change below is a unification of something already on the page.

## What was already complete

I verified the previous rounds before touching anything, and most of it held.

The scrolled header is a solid surface in both themes (rgb 255,255,255 light, rgb 20,20,19 dark, no backdrop filter) and it never covers a heading: `scroll-margin-top` is 96px and the Background heading lands 161px below the viewport top on a direct `/#background` load, with the header bottom at 84px. The Contact active state works in all four cases the earlier rounds claimed: click, direct `/#contact` load, scroll to the page bottom, and back and forward through history. I re-ran each of those and they pass. The theme cross-fade is 200ms, color-only, and toggling the theme moves nothing on the page. The contact form has no delivery backend, and its labelling is honest: the submit button reads "Open in your email app" and the note under it reads "Opens your email app with the message ready to send — nothing is sent from this page." The three SVG mockups were already polished and share one window-chrome language. The Dresden location panel and the pixel field were already in place.

Two things in that list did not hold. The wordmark link lost its accessible name once scrolled, which axe reported as `link-name`, and the certificate plates, location panel, and form fields had no theme transition while their neighbours faded 200ms. Both are fixed in this round and covered below.

## The cohesion audit

I rendered the home page at 1440, 768, and 375 pixels, light and dark, plus all three case pages with mockups, and measured the system against itself. Twelve incoherencies, each with a location.

| # | Incoherency | Where |
|---|---|---|
| 1 | Flagship cards had a 0px radius while certificate plates and the location panel were 8px | `WorkSection`, `CertificatesSection`, `Background` |
| 2 | JetBrains Mono appeared in four sizes (11, 12, 13, 14px) with no named role | `globals.css`, cards, skills, case pages |
| 3 | Section titles were raw `1.125 / 1.25 / 1.375rem` values even though a token scale existed | `globals.css` |
| 4 | Head-to-content gaps were 105px (Work), 40px (Skills), 16px (Background), 24px (Certificates) | Home sections |
| 5 | A redundant "Featured" eyebrow sat above the Work grid; the Work intro already says it | `WorkSection`, `content.ts`, `content.de.ts` |
| 6 | Certificate plates, the location panel, and form fields had no theme transition (computed `transition-property: all` at 0s duration) | `CertificatesSection`, `Background`, contact form |
| 7 | The flagship card's own background transition was dead, overridden by `.reveal.is-visible` | `.flagship-card` |
| 8 | Case-page figures were bare figures with a body-small caption while the same mockup on a home card sat in a padded visual area with a mono caption | `CaseStudy`, `WorkSection` |
| 9 | The hero range was 240px but the name leaves the viewport past about 150px of scroll, so the full 1.22x growth was never seen | `SiteHeader`, hero |
| 10 | The wordmark link lost its accessible name once scrolled (wordmark words `display: none`, monogram `aria-hidden`) | `SiteHeader`, axe `link-name` |
| 11 | Card and case prose ran at 1rem (16px) while `--text-body` is 17px | `WorkSection`, `CaseStudy` |
| 12 | Off-scale micro-values: certificate-name margin 12px, skills rows 6px | `CertificatesSection`, skills grid |

The nav has three items for five sections (Skills and Certificates group under Background). That is an area model and a deliberate decision, not a bug. I left it alone.

## What changed

Seven commits. Each one is a single logical change.

**Tokens (`a2640af`).** Mono now has two named roles, `--text-mono-sm` (0.75rem) and `--text-mono-md` (0.875rem), replacing the 11/12/13/14px spread. Titles have four named roles, `--text-title-sm/md/lg/xl`, replacing the raw rem values. Card and case prose use `--text-body` (17px) instead of 1rem. The certificate-name margin went 12px to 16px and the skills rows 6px to 8px, both onto the spacing scale.

**Rhythm (`4a49b0d`).** Flagship cards take the 8px radius with `overflow: hidden`, so they match the certificate plates and the location panel. Every section's first content block now sits 24px below its head or intro. The "Featured" eyebrow is gone, with its `featured` strings removed from `content.ts` and `content.de.ts`. Section headers are one pattern now: head plus intro or lead animating together in a single Reveal, so the Background lead and the certificates intro moved from their components into `page.tsx`.

**Theme (`03b8938`).** Certificate plates, the location panel, and form fields join the 200ms color-only cross-fade. The flagship card's surface transition joins the reveal transition as `.flagship-card.reveal.is-visible` inside `no-preference`, so reduced motion still gets none. The dead transition on `.flagship-card` is removed.

**Evidence (`b2a57e1`).** Case figures share the card visual's framed presentation: hairline border, 8px radius, ground background, 24px padding, 24px top margin. The mockup caption uses the same mono label in both places through a new `case-figure--mockup` class. The SAM photo keeps its body-small caption, since it is a photograph, not a mockup.

**Hero and accessibility (`30e5713`, `fdc1b28`, `45ddf7f`).** The hero range went 240px to 160px, so the 1.22x growth completes while the name is still in view. The wordmark link fix took two attempts. An `aria-label` duplicating the wordmark fixed `link-name` but tripped `label-content-name-mismatch`, because the label could not match the visible text exactly. The fix that held: the wordmark words are now visually hidden instead of `display: none` once scrolled, using the same pattern already applied below 400px. The spans are not focusable, so nothing leaves the tab order, and the link's name comes from its own content in both states, so it cannot drift from the visible text.

## Per required item

**1. Navigation.** Verified working, no behaviour change. Contact is active on click, direct `/#contact` load, scroll to the page bottom, and back and forward. The header is fully opaque when scrolled and headings clear it. The only navigation-adjacent change is the wordmark accessible-name fix above.

**2. Hero.** Refined, not rebuilt. The range is 160px now and the name reaches exactly 1.22x at 160px (1.083 at 60px, 1.165 at 120px). One honest limit: the name starts 32px below the header bottom, so it is fully visible for only the first 30px of scroll, at about 1.04x, and the rest of the growth happens while it slides under the fixed header. The visible effect is a gentle grow-as-it-leaves, not a moment where the full 1.22x is seen. I considered giving the hero more top padding so the growth stays visible longer, but that pushes the first card back below the fold and undoes the fold improvement, so I left the padding alone. If the owner wants the expansion to be a visible moment, the hero would need to be sticky, which is a bigger change than this round.

**3. Project visuals.** No mockup was redesigned. The three SVGs already shared one window-chrome language. The inconsistency was between the home cards and the case pages, and the framed case figure closes it. All three case figures now measure 8px radius, 24px padding, ground background, and a 12px JetBrains Mono caption, matching the card visuals.

**4. Certificates.** The editorial plates were kept. They now share the 8px radius, hairline, and 200ms cross-fade with the project cards, the skills section, and the location panel, and their type uses the same named mono and title roles. Nothing about the certificates themselves changed: the same four Google certificates, the same shared period Nov 2025 – Sep 2026, the same note that per-certificate dates are not on record, no badges, IDs, or links.

**5. Contact.** The mailto fallback stands and its labelling is verified accurate (see above). No endpoint exists: there is no `src/app/api`, and no form service in `package.json`. The email, GitHub, LinkedIn, and CV actions are all present. No secret or key appears in client code.

**6. Unification.** The system is now one spacing rhythm (24px from head or intro to first content, 8px radius, hairlines, the named mono and title scales), one accent usage (oxide red for proof, labels, and the pixel field; emerald only for the hero availability dot), and one theme behaviour (200ms color-only cross-fade on every surface, no flash). No new motif was added.

## Decisions: Dresden visual and pixel ending

**The Dresden location panel stays.** It now shares the 8px radius, hairline, and 200ms cross-fade with the certificate plates and form fields, so it reads as part of the system instead of a pasted panel. It earns its place because it grounds two claims the page already makes: the "Dresden" pill in the hero and the working-student availability line. The address (Fritz-Löffler-Straße 12, 01069 Dresden) and the live Dresden clock are real, and the contour motif is plainly labelled decorative, not a survey map. No map data, coordinates, or location claims were fabricated. Removing it would leave the Background section as text only and cut the one concrete location anchor on the page.

**The pixel field stays.** The 72 by 5 static oxide-red SVG field (147 rects) at the very bottom of the footer is the contact section's closing mark. It now sits under a contact section whose form fields, buttons, and copy share the same geometry and accent, so it reads as the system's full stop rather than decoration pasted on the end. It costs nothing at runtime (static SVG, no canvas, no animation), it is aria-hidden, and it is secondary to the contact actions. Removing it would leave the footer ending on the form note with no visual close.

## What I verified

The QA suite at `~/workspace/.baseline-qa/refine-cohesive-redesign-qa.js` passes **55 of 55 checks**, 0 console errors. The list below is the measured result, not a summary of intent.

- Head-to-content gaps are 24px for Work, Skills, and Certificates, and 24px from the Background head to its lead. Gaps are measured with `offsetTop` and `offsetHeight`, which ignore the Reveal transform; the earlier `getBoundingClientRect` measurement understated them by up to 16px while a Reveal was settling. The gap checks tolerate 1px because `offsetTop` rounds fractional layout positions.
- Fold: first flagship card top 682px to **636px** at 1440 by 900, and 753px to **706px** at 375 by 844.
- Hero scale: 1.083 at 60px, 1.165 at 120px, 1.22 at 160px; claim opacity stays 0.92 or above; name clears the header at rest (name top 124px, header bottom 92px).
- Navigation: Contact active after click, direct `/#contact`, page bottom, back, and forward. Background heading visible below the header on a direct anchor load. Header solid at scroll 500 in both themes, no backdrop filter.
- Theme: certificate plates, location panel, and flagship card all cross-fade `background-color` (and `border-color` where present). Toggling the theme moves nothing. Reduced motion leaves the hero static.
- Case figures: LeaseLens, Sales ETL, and OratorPath all framed at 8px radius and 24px padding with a 12px JetBrains Mono caption. All six case routes return 200.
- Contrast: muted intro 7.25 light and 7.76 dark; accent on wash 6.10 light and 5.57 dark. All above WCAG AA.
- Mobile and tablet: no horizontal overflow at 375, 768, or 1440 pixels, in English or German. The mobile full-page capture shows blank regions where sections were mid-fade when the capture was taken; a probe that scrolls to each region and waits 1 second past the 600ms Reveal transition confirms every section reaches opacity 1 on mobile (ETL card, Background, Skills, and Certificates all verified, with viewport screenshots in the folder).
- Build, TypeScript, ESLint, and Prettier are clean. The impeccable detector reports 0 on the 9 changed source files.
- Axe reports 0 on home light, home light scrolled, and home dark. The `label-content-name-mismatch` that appeared after the first wordmark fix is gone.

Lighthouse, local production build, measured twice:

| | Mobile | Desktop |
|---|---|---|
| Performance | 74, 74 | 86, 91 |
| Accessibility / Best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| CLS | 0 | 0 |
| TBT | 1.49–1.51s | 250–320ms |
| Transfer | 505 KB | 567 KB |

The previous round measured mobile 76 and desktop 100. The mobile number did not recover. The desktop number swung 86 to 91 between my two consecutive runs, so the drop from 100 is within this VM's run-to-run variance rather than a regression this round caused: nothing here adds JavaScript, weight, or DOM of substance. The changes are CSS-only plus one removed locale string, and the "Featured" eyebrow removal reduces DOM. The added DOM from the last round (the SVG mockups and the pixel field) is still there, and that is the likelier cause of the mobile TBT. I did not cut any visual to chase the number.

## Contact-form configuration still needed

Nothing changed here. There is still no delivery backend, and the mailto fallback is the honest mechanism. Two routes were named in the last round and still need the owner's choice:

- **Route A:** a Next.js route handler plus Resend, SendGrid, or Mailgun, with the key in a Vercel environment variable.
- **Route B:** Formspree or Basin.

Either route needs his choice before it is built. The `/api/contact` 404 in the QA log is the script's own intentional endpoint probe, not a real error.

## Files

- Report: `docs/refine-cohesive-redesign-report.md` (this file)
- QA script: `~/workspace/.baseline-qa/refine-cohesive-redesign-qa.js`
- Lighthouse script: `~/workspace/.baseline-qa/refine-cohesive-redesign-lighthouse.js`
- Screenshots: `docs/screenshots/refine-cohesive-redesign/` (27 files: home first viewport and full page at 1440 light, dark, and German, plus 375 and 768; hero at 60, 120, and 160px of scroll; all three case pages, first viewport and full page; certificates at 1440 and 375; location panel; contact ending at 1440 and 375; and the four mobile reveal probes)
- Branch: `refine/cohesive-redesign`, 7 commits, HEAD `45ddf7f`. Not merged, pushed, or deployed.

## Not verified

The live site was not re-checked by curl after this round, because nothing was deployed and the branch is local only. The live site still serves `main @ f9a622f`. German copy was checked for layout (no overflow at 1440) but the German strings themselves were not re-audited for wording; only the removed `featured` strings changed.
