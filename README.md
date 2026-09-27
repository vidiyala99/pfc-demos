# PFC website demos

Two working demos of the new Partnerships For Change website, with identical design and content, so PFC can choose the editor that suits them. Both are sandboxes: nothing is saved, and both reset on reload.

| Path | What |
|---|---|
| `content/` | The single source of content: `home.md` and `projects/*.md` |
| `design/` | `pfc.css` and self-hosted fonts, shared by both demos unchanged |
| `lib/content.ts` | Loads and validates content; holds the honesty rules |
| `fixtures/honesty.json` | Shared rule fixtures, tested against both the TypeScript and the PHP code |
| `next-demo/` | Next.js static site plus the Decap editor at `/admin` (test backend, seeded from `content/`) |
| `wp-theme/pfc-programme/` | WordPress block theme: no plugins, no build step |
| `wordpress/` | Generated WordPress import file and the Playground blueprint template |
| `chooser/` | The page PFC receives: both links, the three tasks, a scorecard, a comparison table |
| `HANDOFF.md` | How PFC takes ownership after choosing |

## Commands

```bash
npm ci && npm test                      # content rules (Vitest)
npx tsx scripts/build-wxr.ts            # content/ -> wordpress/pfc-content.xml
cd next-demo && npm ci && npm run build # static site + Decap admin in next-demo/out
node scripts/assemble-site.mjs          # _site/ exactly as GitHub Pages serves it
npx playwright test                     # smoke tests (Next, Decap, chooser; WordPress when Playground runs on :9400)
```

On Windows Git Bash, prefix commands that take a `/path` value with `MSYS_NO_PATHCONV=1`.
