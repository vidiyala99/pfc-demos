# Handoff runbook

How Partnerships For Change (PFC) takes over the new website so it never depends on the volunteer who built it.

## The rule that makes handoff safe

PFC creates every account, with a PFC email address, two admins and two-factor login. The builder is only ever *invited*, and is removed at the end. No account is ever created in the builder's name and transferred later.

## Before either path

- [ ] PFC names one decision-maker and one editor.
- [ ] PFC confirms: which projects are active, the donation processor, the primary phone number and inbox, and photo consent (children especially).
- [ ] PFC supplies original high-resolution photos, and stills for Women Are Sacred and PACT.
- [ ] PFC clears or replaces the Great Green Wall cover, which carries a printed "confidential" notice.
- [ ] Back up the current WordPress site and export every URL on the `.org` and `.com` domains (for redirects).

## Path A: Next.js + Decap (about one working day)

1. **GitHub:** PFC creates a GitHub organization (PFC email, 2 owners, two-factor). Transfer this repo to it: Settings, then Transfer ownership.
2. **Hosting:** create a free Netlify or Cloudflare Pages account under PFC and connect the repo. Build command: `npm ci && npm test && npx tsx scripts/build-wxr.ts && cd next-demo && npm ci && npm run build`. Publish directory: `next-demo/out`. Do not use GitHub Pages for production: it cannot do 301 redirects.
3. **Domain:** point `partnershipsforchange.org` at the host (a DNS change at PFC's registrar). HTTPS is automatic.
4. **Real editing:** in `next-demo/admin-src/config.yml`, replace `backend: test-repo` with the `github` backend and configure login (a GitHub OAuth app, or a free sign-in bridge; confirm current terms at the time). Remove `repo-files.js` and the demo notice.
5. **Redirects:** add the old-URL to new-URL map (from the URL export) as the host's redirects file.
6. **Services:** set the verified donation processor URL (`DONATE_URL` in `next-demo/components/parts.tsx`), a no-cost form service, and privacy-friendly analytics if wanted.
7. **Allow search engines:** remove the demo-only `robots: { index: false, follow: false }` from `next-demo/app/layout.tsx`. Without this step, the real site stays out of Google.
8. **Train and hand over:** a recorded session with the editor, then remove the builder from every account.

## Path B: WordPress (about half a day)

1. **Back up** the current site (files and database).
2. **Install the theme:** zip `wp-theme/pfc-programme` and upload it under Appearance, Themes. Activate it.
3. **Import content:** Tools, Import, WordPress, then upload `wordpress/pfc-content.xml` (built by `npx tsx scripts/build-wxr.ts`).
4. **Redirects:** install one free redirects plugin and add the old-URL map.
5. **Hygiene:** turn on automatic updates for WordPress core and the theme. Remove Elementor and unused plugins once nothing depends on them. Keep plugins to the minimum.
6. **Allow search engines:** make sure Settings, Reading, "Discourage search engines" is unticked on the live site.
7. **Train and hand over:** a recorded session with the editor, then remove the builder's admin account.

## After launch (PFC owns this)

- Quarterly: review every project's status and "last reviewed" date, staff and contact details.
- Monthly: check the donation link works and the contact inbox receives mail.
- Design rules live in `DESIGN.md` at the project root; the shared stylesheet is `design/pfc.css`. Gold is only for Donate.
