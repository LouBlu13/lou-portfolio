/* ═══════════════════════════════════════════════════════════════════
   LOU BLUMENTHAL — PORTFOLIO  ·  main.js
   ───────────────────────────────────────────────────────────────────
   Sections
     0. RENDER           — build the pages from content.js (CMS-ready)
     1. PAGE SWITCHING   — crossfade one page in at a time
     2. SCALING          — fit the fixed 1440×720 stages to the window
     3. NAV HOVER        — debounced hover-to-open navigation
     4. ABOUT TYPEWRITER — type out the greeting + name (first visit)
     5. RESUME LOOP       — calm seamless self-scroll (also wheel-scrollable)
     6. EVENT WIRING      — attach behaviour to [data-page] elements
   Content is supplied by content.js (SITE_CONTENT). To add a CMS, feed
   the same shape into SITE_CONTENT — the rendering below is unchanged.
═══════════════════════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────────────────────
   CONFIG
─────────────────────────────────────────────────────────────────── */
const PAGES = ["landing", "work", "about", "contact"]; // must match id="" / nav ids
const BASE_W = 1440;          // Figma stage width
const BASE_H = 760;           // a touch taller than 720 so content never crowds edges
const NAV_HOVER_DELAY = 150;  // ms to rest on a nav link before it opens
const RESUME_SPEED = 36;      // résumé auto-scroll, px/sec (lower = calmer)

const visited = new Set();    // pages whose intro animation has already played


/* ───────────────────────────────────────────────────────────────────
   0 · RENDER  (build the DOM from content.js)
   Markup here mirrors the design exactly; only the text/images come from
   SITE_CONTENT. Swap SITE_CONTENT for CMS data and this all still works.
─────────────────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cssUrl = (path) => `url('${path}')`; // single quotes: safe inside style="…"

function navHTML(activeId) {
  return SITE_CONTENT.nav
    .map((n) =>
      `<a data-page="${n.id}" tabindex="0" role="button"${n.id === activeId ? ' class="active"' : ""}>${esc(n.label)}</a>`
    )
    .join("");
}

function footerHTML() {
  const f = SITE_CONTENT.footer;
  return `<span>${esc(f.name)}</span><span>${esc(f.role)}</span>`;
}

function setBackground(selector, path) {
  const el = document.querySelector(selector);
  if (el && path) el.style.backgroundImage = cssUrl(path);
}

function renderSite() {
  const C = SITE_CONTENT;

  /* <head> (keep content.js as the source for title/description) */
  if (C.meta) {
    if (C.meta.title) document.title = C.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && C.meta.description) desc.setAttribute("content", C.meta.description);
  }

  /* Nav + footer on every inner page (active link = that page) */
  ["work", "about", "contact"].forEach((id) => {
    const nav = document.querySelector(`#${id} .nav`);
    if (nav) nav.innerHTML = navHTML(id);
    const footer = document.querySelector(`#${id} .footer`);
    if (footer) footer.innerHTML = footerHTML();
  });

  /* Landing */
  document.querySelector("#landing .landing-title").innerHTML =
    C.landing.title.map(esc).join("<br />");
  document.querySelector("#landing .landing-circles").innerHTML = C.landing.circles
    .map(
      (c) =>
        `<a class="lc-btn" data-page="${c.id}" tabindex="0" role="button" aria-label="${esc(c.label)}">` +
        `<span class="lc-circle ${c.color}"></span>` +
        `<span class="lc-label">${esc(c.label)}</span></a>`
    )
    .join("");

  /* Work */
  document.querySelector("#work .work-head").innerHTML =
    `<span class="t-light">${esc(C.work.eyebrow[0])}</span><br />` +
    `<span class="t-bold">${esc(C.work.eyebrow[1])}</span>`;
  document.querySelector("#work .work-grid").innerHTML = C.work.projects
    .map(
      (p) =>
        `<article class="work-card">` +
        `<span class="work-card-panel" style="background-image:${cssUrl(p.image)}"></span>` +
        `<span class="work-card-frame"></span>` +
        `<span class="work-card-plus"></span>` +
        `<p class="work-card-title"><strong>${esc(p.title)}</strong>${esc(p.desc)}</p>` +
        `<span class="work-card-line"></span>` +
        `</article>`
    )
    .join("");
  setBackground("#work .work-circles .pic", C.work.circlePhoto);

  /* About */
  document.querySelector("#about .about-hello").innerHTML = C.about.hello.map(esc).join("<br />");
  document.querySelector("#about .about-name").innerHTML = C.about.name.map(esc).join("<br />");
  document.querySelector("#about .about-bio-1").textContent = C.about.bio[0];
  document.querySelector("#about .about-bio-2").textContent = C.about.bio[1];
  document.querySelector("#about .resume-label").textContent = C.about.resumeLabel;
  document.querySelector("#about .timeline-list").innerHTML = C.about.resume
    .map((r) => `<div class="t-item"><p class="year">${esc(r.period)}</p><p>${esc(r.text)}</p></div>`)
    .join("");
  setBackground("#about .about-circle-pic", C.about.circlePhoto);

  /* Contact */
  document.querySelector("#contact .contact-heading").textContent = C.contact.heading;
  document.querySelector("#contact .contact-details").innerHTML =
    `<div class="contact-labels">${C.contact.details.map((d) => `<p>${esc(d.label)}</p>`).join("")}</div>` +
    `<div class="contact-values">${C.contact.details.map((d) => `<p>${esc(d.value)}</p>`).join("")}</div>`;
  setBackground("#contact .contact-pic", C.contact.circlePhoto);
}


/* ───────────────────────────────────────────────────────────────────
   1 · PAGE SWITCHING
   Toggle `.active` (CSS crossfades) and play the intro only on first visit.
─────────────────────────────────────────────────────────────────── */
function showPage(id) {
  PAGES.forEach((p) => {
    const el = document.getElementById(p);
    if (!el) return;
    const isActive = p === id;
    el.classList.toggle("active", isActive);
    if (isActive && !visited.has(p)) {
      el.classList.add("reveal");
      visited.add(p);
    } else {
      el.classList.remove("reveal");
    }
  });

  scaleApp();

  if (id === "about") {
    initResumeLoop();
    typeAboutIntro();
  } else {
    stopResumeLoop();
  }
}


/* ───────────────────────────────────────────────────────────────────
   2 · SCALING
─────────────────────────────────────────────────────────────────── */
function scaleApp() {
  const scale = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
  document.getElementById("viewport").style.setProperty("--scale", scale);
}


/* ───────────────────────────────────────────────────────────────────
   3 · NAV HOVER (debounced)
─────────────────────────────────────────────────────────────────── */
let navHoverTimer = null;

function hoverNav(id) {
  clearTimeout(navHoverTimer);
  navHoverTimer = setTimeout(() => showPage(id), NAV_HOVER_DELAY);
}
function cancelNavHover() {
  clearTimeout(navHoverTimer);
}


/* ───────────────────────────────────────────────────────────────────
   4 · ABOUT TYPEWRITER (first visit only)
─────────────────────────────────────────────────────────────────── */
function typeAboutIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  typeOut(document.querySelector("#about .about-hello"), 800, 42, 0);    // start 0.80s
  typeOut(document.querySelector("#about .about-name"), 1550, 36, 600);  // start 1.55s
}

function typeOut(el, startMs, charMs, lingerMs) {
  if (!el || el.dataset.typed) return; // run once per element
  el.dataset.typed = "1";

  const lines = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = "";
  const chars = [];
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) el.appendChild(document.createElement("br"));
    for (const ch of line) {
      const span = document.createElement("span");
      span.className = "ty";
      span.textContent = ch === " " ? " " : ch; // nbsp so spaces don't collapse
      el.appendChild(span);
      chars.push(span);
    }
  });

  setTimeout(() => {
    const caret = document.createElement("span");
    caret.className = "caret";
    el.insertBefore(caret, chars[0] || null);
    let i = 0;
    const tick = () => {
      if (i < chars.length) {
        chars[i].classList.add("on");
        chars[i].after(caret);
        i++;
        setTimeout(tick, charMs);
      } else {
        setTimeout(() => caret.remove(), lingerMs);
      }
    };
    tick();
  }, startMs);
}


/* ───────────────────────────────────────────────────────────────────
   5 · RESUME AUTO-SCROLL LOOP  (also mouse-wheel scrollable)
─────────────────────────────────────────────────────────────────── */
let resumeRAF = null;
let resumePaused = false;
let resumePos = 0;

function initResumeLoop() {
  const viewport = document.querySelector("#about .timeline");
  const list = document.querySelector("#about .timeline-list");
  if (!viewport || !list) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (!list.dataset.looped) {
    list.dataset.looped = "1";
    list.innerHTML += list.innerHTML; // duplicate once for a seamless loop
    viewport.addEventListener("mouseenter", () => (resumePaused = true));
    viewport.addEventListener("mouseleave", () => (resumePaused = false));
  }

  resumePos = viewport.scrollTop;
  if (resumeRAF) cancelAnimationFrame(resumeRAF);
  let last = performance.now();
  const step = (now) => {
    const dt = (now - last) / 1000;
    last = now;
    const oneCopy = list.scrollHeight / 2;
    if (resumePaused) {
      resumePos = viewport.scrollTop;
    } else if (oneCopy > 0) {
      resumePos += RESUME_SPEED * dt;
      if (resumePos >= oneCopy) resumePos -= oneCopy;
      viewport.scrollTop = resumePos;
    }
    resumeRAF = requestAnimationFrame(step);
  };
  resumeRAF = requestAnimationFrame(step);
}

function stopResumeLoop() {
  if (resumeRAF) {
    cancelAnimationFrame(resumeRAF);
    resumeRAF = null;
  }
}


/* ───────────────────────────────────────────────────────────────────
   6 · EVENT WIRING
   Any element with data-page="<id>" navigates:
     • inside .nav → hover (debounced) + click + keyboard
     • .lc-btn     → click + keyboard (landing circles)
─────────────────────────────────────────────────────────────────── */
function activateByKey(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    showPage(e.currentTarget.dataset.page);
  }
}

function wireNavigation() {
  document.querySelectorAll(".nav a[data-page]").forEach((el) => {
    el.addEventListener("mouseenter", () => hoverNav(el.dataset.page));
    el.addEventListener("mouseleave", cancelNavHover);
    el.addEventListener("click", () => showPage(el.dataset.page));
    el.addEventListener("keydown", activateByKey);
  });
  document.querySelectorAll(".lc-btn[data-page]").forEach((el) => {
    el.addEventListener("click", () => showPage(el.dataset.page));
    el.addEventListener("keydown", activateByKey);
  });
}


/* ───────────────────────────────────────────────────────────────────
   BOOT  (render content → wire behaviour → show landing)
─────────────────────────────────────────────────────────────────── */
renderSite();
wireNavigation();
window.addEventListener("resize", scaleApp);
showPage("landing");
