/* ═══════════════════════════════════════════════════════════════════
   SITE CONTENT — single source of truth for everything editable
   ───────────────────────────────────────────────────────────────────
   • Edit all text/images HERE (not in index.html). main.js builds the
     pages from this object on load, so the markup stays clean.
   • CMS later: this object is the content model. Replace it with data
     fetched from a CMS in the SAME shape (e.g. `const SITE_CONTENT =
     await fetch('/api/content').then(r => r.json());`) and nothing else
     needs to change. Each key below maps 1:1 to a CMS field/collection.
   • Lists (nav, projects, resume, details) = CMS "collections".
   • Multi-line fields are arrays — one string per visual line.
═══════════════════════════════════════════════════════════════════ */

const SITE_CONTENT = {
  /* ── Document head (SEO) ── */
  meta: {
    title: "Lou Blumenthal — Interaction Designer",
    description:
      "Portfolio of Lou Blumenthal, an interaction designer based in Zürich, Switzerland — work, about, and contact.",
    author: "Lou Blumenthal",
  },

  /* ── Footer, shown bottom-left on every inner page ── */
  footer: { name: "Lou Blumenthal", role: "Interaction Designer" },

  /* ── Top-left navigation (collection; order matters; id = page id) ── */
  nav: [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ],

  /* ── Landing page ── */
  landing: {
    title: ["Lou Cirill Clau", "Blumenthal"], // one string per line
    circles: [
      { id: "work", label: "Work", color: "red" },
      { id: "about", label: "About", color: "blue" },
      { id: "contact", label: "Contact", color: "green" },
    ],
  },

  /* ── Work page ── */
  work: {
    eyebrow: ["Some of my", "Work"], // [light line, bold line]
    circlePhoto: "img/work.jpg",     // portrait circle on the right
    projects: [                      // collection — one card each
      { title: "Editorial Design", desc: " — magazines, posters, visual essays", image: "img/work-1.jpg" },
      { title: "Editorial Design", desc: " — magazines, posters, visual essays", image: "img/work-2.jpg" },
      { title: "Editorial Design", desc: " — magazines, posters, visual essays", image: "img/work-3.jpg" },
      { title: "Editorial Design", desc: " — magazines, posters, visual essays", image: "img/work-4.jpg" },
    ],
  },

  /* ── About page ── */
  about: {
    hello: ["Hello,", "My name is"],            // typed out, one string per line
    name: ["Lou Cyrill Clau.", "Blumenthal"],   // typed out, one string per line
    bio: [
      "I'm an Interaction Designer based in Zürich, Switzerland. I can develop responsive websites from scratch and raise them into modern user-friendly web experiences.",
      "Transforming my creativity and knowledge into websites has been my passion for the last 3 years. I have been helping various clients to establish their presence online. I always strive to learn about the newest technologies and frameworks.",
    ],
    circlePhoto: "img/about.jpg",
    resumeLabel: "Resume",
    resume: [                                   // collection — one entry each
      { period: "2023 — Present", text: "Freelance Interaction Designer. Self-employed, Zürich, Switzerland" },
      { period: "2021 — 2023", text: "UX / UI Designer. Bonsai Digital Studio, Zürich" },
      { period: "2020 — 2021", text: "Junior Web Designer. Nordlicht Agency, Berlin, Germany" },
      { period: "2017 — 2020", text: "Bachelor's in Graphic & Visual Communication Design. Central European Design Institute, Prague" },
      { period: "2015 — 2017", text: "Foundation Diploma in Visual Arts. Kantonsschule Zürich" },
    ],
  },

  /* ── Contact page ── */
  contact: {
    heading: "Let's connect",
    circlePhoto: "img/contact.jpg",
    details: [                                  // collection — label : value rows
      { label: "Email:", value: "LOU.BLUMENTHAL@ZHDK.CH" },
      { label: "Phone:", value: "+410 000 00 00" },
      { label: "Instagram:", value: "@en.dood" },
    ],
  },
};
