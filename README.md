# Lou Blumenthal — Portfolio


**Live site:** https://lou-blumenthal.netlify.app/

## Editing the content
All text and photos live in `content.json`, edited through a free visual editor —
you never touch code:

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open portfolio project → click **Site Content**.
3. Edit any field (text or images) → click **Save**.
4. Wait ~1 minute, then refresh the live site (Ctrl + F5). Done.


---

## How it's hosted

- Code lives on **GitHub** (private repo).
- **Netlify** watches the repo and automatically rebuilds + republishes the live
  site whenever anything changes — a CMS save *or* a code push. Takes ~1 minute.
- No build step: Netlify just serves the files as they are.

---

## Files

| File / folder      | What it is                                               |
| ------------------ | -------------------------------------------------------- |
| `index.html`       | Page structure (empty shells filled in by `main.js`)     |
| `styles.css`       | All styling, layout, and animations                      |
| `main.js`          | Loads `content.json` and builds the pages                |
| `content.json`     | **All editable text & image paths** (what the CMS edits) |
| `.pages.yml`       | Pages CMS configuration (defines the editor's fields)    |
| `img/`             | Photos and project images                                |
| `DESIGN_TOKENS.md` | Design reference (colors, type, spacing)                 |

---

## 🧑‍💻 Making design / code changes (advanced)

Content edits go through Pages CMS (above). To change the *design* or *code*:

1. Edit the files in this folder.
2. Open **GitHub Desktop** → write a short summary → **Commit** → **Push**.
3. Netlify redeploys automatically (~1 minute).
