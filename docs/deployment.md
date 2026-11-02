# Deployment runbook

Production hosting: **GitHub → Vercel**, custom domain over HTTPS.

Status legend: **[done]** verified in the repository · **[you]** needs your accounts · **[verify]** check after deploying.

> Do not record DNS values, verification tokens or API keys in this file. Copy them from the Vercel, Resend and registrar dashboards at the time you configure them.

---

## 1. Repository readiness

| #    | Item                                                                                                                                | Status |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1.1  | `npm run check` passes: typecheck, lint, formatting, unit tests                                                                     | [done] |
| 1.2  | `npm run build` succeeds; every page is static except `/api/contact`                                                                | [done] |
| 1.3  | `npm run test:e2e` passes on desktop and mobile                                                                                     | [done] |
| 1.4  | Development-only route `/design-system` removed                                                                                     | [done] |
| 1.5  | Secret scan: no API keys, tokens or private keys in the source                                                                      | [done] |
| 1.6  | `.gitignore` excludes `.env*` (except `.env.example`), `.vercel`, `.next`, test output                                              | [done] |
| 1.7  | Only `NEXT_PUBLIC_SITE_URL` is exposed to the browser; all other variables are server-only                                          | [done] |
| 1.8  | `npm audit --omit=dev`: 0 vulnerabilities in production dependencies                                                                | [done] |
| 1.9  | Node version pinned: `engines.node = "24.x"` and `.nvmrc` (Vercel reads `engines`)                                                  | [done] |
| 1.10 | Security headers set in `next.config.ts` (HSTS, nosniff, referrer policy, frame denial, permissions policy); `X-Powered-By` removed | [done] |
| 1.11 | `robots.txt` and `sitemap.xml` generated; previews are blocked from indexing                                                        | [done] |
| 1.12 | Vercel Web Analytics component installed (`@vercel/analytics`)                                                                      | [done] |
| 1.13 | Pre-build check (`scripts/check-env.mjs`) fails **production** builds with missing or placeholder variables                         | [done] |

### Before the first push

- [ ] Replace placeholder content you want live (`src/config/site.ts`, `src/content/**`), or accept that example projects and draft articles stay labelled and `noindex`.
- [ ] Add the resume at `public/resume/sagar-dixit-resume.pdf` (download links 404 without it).

---

## 2. GitHub repository [you]

No `gh` CLI is installed here, so create the repository in the browser.

1. Initialise and commit locally (if not already done):
   ```bash
   git init -b main
   git add -A
   git status            # confirm no .env.local or other secrets are staged
   git commit -m "Initial commit"
   ```
2. On github.com → **New repository**. Choose private or public. Do **not** add a README, license or .gitignore (the repo already has them).
3. Push using the commands GitHub shows on the empty repository page (`git remote add origin …` then `git push -u origin main`).
4. Recommended: **Settings → Branches → Add rule** for `main`: require a pull request and require status checks (Vercel's check appears after the first deployment).

---

## 3. Vercel project [you]

1. vercel.com → **Add New… → Project** → import the GitHub repository (install the Vercel GitHub app for that repo when prompted).
2. Framework preset: **Next.js** (auto-detected). Leave build and output settings at their defaults; `npm run build` already runs the environment check.
3. **Before the first deploy**, open **Environment Variables** and add the values in section 4. If you deploy first, the production build will stop at the environment check, which is expected; add the variables and redeploy.
4. **Settings → Git**
   - Production branch: `main` → every push or merge to `main` deploys to production.
   - Preview deployments are created automatically for every pull request and non-`main` branch, with a link posted on the PR.
5. **Settings → Deployment Protection**: decide whether previews require Vercel login (default on new projects). Production should be public.

---

## 4. Environment variables [you]

Set in **Vercel → Project → Settings → Environment Variables**. Mark the API key **Sensitive**.

| Variable                    | Production              | Preview    | Notes                                                                                                                                                              |
| --------------------------- | ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`      | `https://<your-domain>` | optional   | Canonical origin, no trailing slash. Read at **build time**: changing it requires a redeploy. Previews fall back to Vercel's production domain for canonical URLs. |
| `RESEND_API_KEY`            | required                | optional   | Sending-only key from resend.com. If omitted on previews, the form reports "unavailable" there.                                                                    |
| `CONTACT_TO_EMAIL`          | required                | if key set | Inbox that receives messages.                                                                                                                                      |
| `CONTACT_FROM_EMAIL`        | required                | if key set | Sender on a domain verified in Resend, e.g. `Portfolio <contact@<your-domain>>`.                                                                                   |
| `CONTACT_RATE_LIMIT_PER_IP` | optional                | optional   | Default 5 per 10 minutes.                                                                                                                                          |
| `CONTACT_RATE_LIMIT_GLOBAL` | optional                | optional   | Default 30 per hour.                                                                                                                                               |

Locally: `npm run check:env` lists anything missing (names only, never values).

---

## 5. Custom domain, DNS and HTTPS [you]

1. Vercel → **Settings → Domains** → add the apex domain (`<your-domain>`) and `www.<your-domain>`.
2. Choose the canonical host. This project assumes the **apex** is canonical: set `www` to **redirect** to the apex (permanent 308). If you prefer `www`, set `NEXT_PUBLIC_SITE_URL` to the `www` origin instead and redirect the apex.
3. Vercel shows the exact DNS records each domain needs. **Copy those values into your registrar's DNS settings exactly as displayed**; record types and values vary by registrar and by whether you use Vercel nameservers.
4. If Vercel asks for a TXT verification record (for example, because the domain is linked to another Vercel account), add the value it shows.
5. Wait until Vercel shows both domains as **Valid Configuration**. DNS can take from minutes to a few hours depending on TTLs.
6. HTTPS: Vercel issues and renews certificates automatically once DNS is valid. No action needed beyond waiting for the certificate.
7. Set `NEXT_PUBLIC_SITE_URL` to the final origin and **redeploy** so `robots.txt`, the sitemap and canonical URLs use it.

---

## 6. Contact email (Resend) [you]

1. resend.com → **Domains → Add domain** (`<your-domain>`, or a subdomain such as `mail.<your-domain>`).
2. Resend shows the DNS records it needs (SPF, DKIM and others). **Add them exactly as shown** at your registrar, then click **Verify** in Resend.
3. Create an API key with **sending access** only and add it to Vercel as `RESEND_API_KEY`.
4. Set `CONTACT_FROM_EMAIL` to an address on the verified domain and `CONTACT_TO_EMAIL` to your inbox. Redeploy.

---

## 7. Analytics [you]

1. Vercel → Project → **Analytics** → **Enable** Web Analytics. It is cookieless and needs no consent banner in most jurisdictions; review for your situation.
2. Redeploy, visit the site, and confirm page views appear in the Analytics tab (allow a few minutes). Ad blockers may hide your own visits.
3. Optional: enable **Speed Insights** for real-user Core Web Vitals (requires adding `@vercel/speed-insights`).

---

## 8. Post-deployment verification [verify]

Do not consider the deployment done until every item below has been checked on the live URL.

1. Automated read-only checks (pages, 404, headers, canonical, robots, sitemap, HTTP→HTTPS, www redirect):
   ```bash
   npm run smoke -- https://<your-domain> --www
   ```
2. A preview deployment is not indexable:
   ```bash
   npm run smoke -- https://<preview-url> --preview
   ```
3. HTTPS certificate: open the site in a browser; the padlock shows a valid certificate for `<your-domain>`. Or run `curl -vI https://<your-domain> 2>&1 | grep -E "subject:|expire date:"`.
4. **Contact form delivery** (sends a real email; do it once):
   - Submit the form on the live site with your own details. Wait at least 3 seconds after the page loads, because faster submissions are treated as spam and silently dropped.
   - Confirm the message arrives at `CONTACT_TO_EMAIL`, and that **Reply** addresses the sender.
   - In Vercel → **Logs**, the function log shows `{"event":"contact","outcome":"sent"}` and no personal data.
   - In Resend → **Emails**, the message shows as delivered.
5. Search Console (optional): add the domain property, verify with the record Google shows, and submit `https://<your-domain>/sitemap.xml`.
6. Spot-check on a phone: menu, case study, contact form.

---

## 9. Redeploying

- **Normal**: merge a pull request into `main`. Vercel builds and promotes automatically.
- **Without code changes** (after changing environment variables or the domain): Vercel → **Deployments** → latest production deployment → **⋯ → Redeploy**.
- **Clean build**: in the Redeploy dialog, untick "Use existing build cache".

## 10. Rolling back

1. **Instant rollback (fastest)**: Vercel → **Deployments** → choose the last good production deployment → **⋯ → Instant Rollback** (or **Promote to Production**). The domain switches to that build without rebuilding.
2. After an instant rollback, Vercel may stop auto-promoting new `main` deployments until you undo the rollback or promote a deployment. Follow the notice Vercel shows in the dashboard.
3. **Fix forward** (keeps Git history honest): `git revert <bad-commit>` on a branch, open a PR, check the preview, merge.
4. Re-run `npm run smoke -- https://<your-domain> --www` after any rollback or redeploy.

---

## Known limitations

- **Rate limits are in memory** and per serverless instance, so they are approximate on Vercel. For strict limits, back `src/lib/contact/rate-limit.ts` with a shared store (for example Upstash Redis).
- **No Content-Security-Policy** header: Next.js inline scripts would need per-request nonces, which makes every page dynamic. Revisit if the site starts embedding third-party content.
- `NEXT_PUBLIC_SITE_URL` is read at build time; domain changes need a redeploy.
