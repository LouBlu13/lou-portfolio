# Lou Blumenthal — Portfolio

A hand-coded portfolio (HTML / CSS / vanilla JS). All editable content lives in
`content.js`; `main.js` builds the pages from it.

---

## Going live + adding a CMS — the plan

We do this in two phases so nothing breaks:

1. **Phase 1 — Get it online** (this guide). The site works as-is.
2. **Phase 2 — Add the CMS** (after it's live; Claude prepares the code, you click through auth).

Legend: 🔵 = **you do it** · 🟢 = **Claude does it**

---

## PHASE 1 — Put the site online (free)

### Part A · Put the code on GitHub  🔵

The easiest way (no command line) is **GitHub Desktop**:

1. Make a free account at **https://github.com** (🔵).
2. Download & install **GitHub Desktop**: https://desktop.github.com (🔵).
3. Open GitHub Desktop → sign in with your GitHub account.
4. Menu: **File → Add local repository…** → choose this folder:
   `C:\Users\blume\OneDrive\Desktop\adapt\working-copy`
   - If it says "this isn't a git repository," click **"create a repository"** — accept the defaults and click **Create Repository**.
5. Click **"Publish repository"** (top bar).
   - Name it e.g. `lou-portfolio`.
   - You can leave **"Keep this code private"** ticked or unticked.
   - Click **Publish Repository**.

✅ Your code is now on GitHub. (Whenever you change files later, GitHub Desktop
will show the changes — type a short message and click **Commit**, then **Push**.)

### Part B · Deploy on Netlify  🔵

1. Make a free account at **https://www.netlify.com** — choose **"Sign up with GitHub"** (easiest).
2. On the Netlify dashboard click **"Add new site" → "Import an existing project"**.
3. Choose **GitHub**, authorize it, and pick your `lou-portfolio` repository.
4. Build settings — **leave everything blank/default**:
   - Build command: *(empty)*
   - Publish directory: *(empty, or `.`)*
   - Click **Deploy**.
5. Wait ~1 minute. Netlify gives you a live link like
   `https://something-random.netlify.app`. Open it — your site is live! 🎉
   - You can rename it under **Site settings → Change site name**.

### Part C · Tell Claude it's live  🟢

Paste your Netlify URL into the chat. Then Claude starts **Phase 2 (the CMS)**.

---

## PHASE 2 — Add the CMS (after Phase 1)  🟢🔵

Claude will:
- 🟢 Convert `content.js` → an editable `content.json` and make the site load it.
- 🟢 Add an `/admin` page + the CMS configuration (the edit form: nav, work
  projects, résumé, contact, etc.).
- 🟢 Write you exact click-by-click steps for the login/authorization.

You will:
- 🔵 Click "Allow/Authorize" on a couple of GitHub permission screens and set
  your editor login.

Then you visit `your-site.netlify.app/admin`, log in, and edit your content in a
friendly form. Save → the live site updates in about a minute.

---

## Optional later — custom domain  🔵
Buy a domain (e.g. Namecheap or Cloudflare, ~$10/year) and connect it in
**Netlify → Domain settings**. Claude can guide you.

---

## Editing content today (before the CMS)
Open `content.js` and edit the text/image paths there. Images live in `img/`.
