"use strict";

/*
  main.js — builds the portfolio pages and runs the interactions.

  The short version:
  - All the words and image paths live in content.json.
  - When the page loads, boot() fetches that file, builds the four pages from
    it, wires up the navigation, and shows the landing page.
  - All four pages exist at the same time; only one is visible. Switching
    pages just toggles a CSS class and the pages crossfade.

  To change wording or photos, edit content.json (or use the CMS).
  Edit this file only to change behaviour: timings, animations, wiring.
*/


/* ---- Settings you may want to tweak ---- */

// The four page ids. These must match the id="" on each <section> in
// index.html and the ids used in content.json (nav links + landing circles).
const PAGES = ["landing", "work", "about", "contact"];

// The design was drawn on a fixed 1440 x 720 canvas (a "stage"). Everything is
// positioned in those pixels and then scaled to fit the window (see scaleApp).
// BASE_H is a little taller than 720 so content never touches the edges.
const BASE_W = 1440;
const BASE_H = 760;

// How long (in milliseconds) you must hover a nav link before it opens that
// page. This stops pages flashing past as the mouse crosses the menu.
const NAV_HOVER_DELAY = 150;

// Speed of the résumé's gentle auto-scroll, in pixels per second.
// Lower = calmer.
const RESUME_SPEED = 36;


/* ---- Internal state (don't usually need to touch) ---- */

// Pages whose one-time intro animation has already played this visit.
const visited = new Set();

// The contents of content.json once it has loaded. Stays null until boot runs.
let SITE_CONTENT = null;


/* ---- Small helpers ---- */

// Escape the characters that mean something special in HTML, so text coming
// from content.json can never accidentally break or inject markup.
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Wrap a path in a CSS url(). Single quotes keep it safe inside style="...".
const cssUrl = (path) => `url('${path}')`;

// Set one element's background image from a content.json image path.
function setBackground(selector, path) {
  const el = document.querySelector(selector);
  if (el && path) el.style.backgroundImage = cssUrl(path);
}


/* ---- Rendering: turn content.json into page markup ---- */

// Build the navigation links. The link for the current page gets .active.
function navHTML(activeId) {
  return SITE_CONTENT.nav
    .map((n) => {
      const active = n.id === activeId ? ' class="active"' : "";
      return `<a data-page="${n.id}" tabindex="0" role="button"${active}>${esc(n.label)}</a>`;
    })
    .join("");
}

// Build the footer (name + role) shown on every inner page.
function footerHTML() {
  const f = SITE_CONTENT.footer;
  return `<span>${esc(f.name)}</span><span>${esc(f.role)}</span>`;
}

// Fill every empty shell in index.html with the content from content.json.
function renderSite() {
  const C = SITE_CONTENT;

  // Browser-tab title and meta description. They also exist in index.html;
  // copying them here keeps both in step with content.json.
  if (C.meta) {
    if (C.meta.title) document.title = C.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && C.meta.description) desc.setAttribute("content", C.meta.description);
  }

  // Nav + footer on the three inner pages. The active nav link is the page
  // it lives on.
  ["work", "about", "contact"].forEach((id) => {
    const nav = document.querySelector(`#${id} .nav`);
    if (nav) nav.innerHTML = navHTML(id);
    const footer = document.querySelector(`#${id} .footer`);
    if (footer) footer.innerHTML = footerHTML();
  });

  // Landing: the big name (one <br> per line in the array) and the three
  // circle buttons that lead to the other pages.
  document.querySelector("#landing .landing-title").innerHTML =
    C.landing.title.map(esc).join("<br />");
  document.querySelector("#landing .landing-circles").innerHTML = C.landing.circles
    .map(
      (c) =>
        `<a class="lc-btn" data-page="${c.id}" tabindex="0" role="button" aria-label="${esc(c.label)}">` +
        `<span class="lc-circle ${c.color}"></span>` +
        `<span class="lc-label">${esc(c.label)}</span>` +
        `</a>`
    )
    .join("");

  // Work: the two-line eyebrow heading (line 0 light, line 1 bold), the 2x2
  // grid of project cards, and the portrait photo.
  document.querySelector("#work .work-head").innerHTML =
    `<span class="t-light">${esc(C.work.eyebrow[0])}</span><br />` +
    `<span class="t-bold">${esc(C.work.eyebrow[1])}</span>`;
  document.querySelector("#work .work-grid").innerHTML = C.work.projects
    .map(
      (p) =>
        `<article class="work-card">` +
        `<span class="work-card-panel" style="background-image:${cssUrl(p.image)}"></span>` + // project image, revealed on hover
        `<span class="work-card-frame"></span>` + // crop marks, shown on hover
        `<span class="work-card-plus"></span>` + // small "+" shown at rest
        `<p class="work-card-title"><strong>${esc(p.title)}</strong>${esc(p.desc)}</p>` +
        `<span class="work-card-line"></span>` + // divider under the title
        `</article>`
    )
    .join("");
  setBackground("#work .work-circles .pic", C.work.circlePhoto);

  // About: greeting + name (typed out later by typeOut), two bio paragraphs,
  // the résumé entries, and the portrait photo.
  document.querySelector("#about .about-hello").innerHTML = C.about.hello.map(esc).join("<br />");
  document.querySelector("#about .about-name").innerHTML = C.about.name.map(esc).join("<br />");
  document.querySelector("#about .about-bio-1").textContent = C.about.bio[0];
  document.querySelector("#about .about-bio-2").textContent = C.about.bio[1];
  document.querySelector("#about .resume-label").textContent = C.about.resumeLabel;
  document.querySelector("#about .timeline-list").innerHTML = C.about.resume
    .map(
      (r) => `<div class="t-item"><p class="year">${esc(r.period)}</p><p>${esc(r.text)}</p></div>`
    )
    .join("");
  setBackground("#about .about-circle-pic", C.about.circlePhoto);

  // Contact: heading, the label/value pairs (two aligned columns), the photo.
  document.querySelector("#contact .contact-heading").textContent = C.contact.heading;
  document.querySelector("#contact .contact-details").innerHTML =
    `<div class="contact-labels">${C.contact.details.map((d) => `<p>${esc(d.label)}</p>`).join("")}</div>` +
    `<div class="contact-values">${C.contact.details.map((d) => `<p>${esc(d.value)}</p>`).join("")}</div>`;
  setBackground("#contact .contact-pic", C.contact.circlePhoto);
}


/* ---- Page switching ---- */

// Show one page and hide the rest (CSS does the crossfade via the .active
// class). The first time a page opens we add .reveal so its intro animation
// plays once; on later visits .reveal is removed so it won't replay.
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

  scaleApp(); // make sure the incoming page is sized to the window

  // The About page has two extras that only run while it is open.
  if (id === "about") {
    initResumeLoop();
    typeAboutIntro();
  } else {
    stopResumeLoop();
  }
}


/* ---- Scaling: fit the fixed stage to any window ---- */

// Pick the largest scale that still fits the 1440 x 760 stage inside the
// window, and hand it to CSS as the --scale variable (used by .stage etc.).
function scaleApp() {
  const scale = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
  document.getElementById("viewport").style.setProperty("--scale", scale);
}


/* ---- Navigation: hover-to-open (with a short delay) ---- */

let navHoverTimer = null;

// Open the page once the mouse has rested on its link for NAV_HOVER_DELAY ms.
function hoverNav(id) {
  clearTimeout(navHoverTimer);
  navHoverTimer = setTimeout(() => showPage(id), NAV_HOVER_DELAY);
}

// Mouse left the link before the delay was up: cancel the pending open.
function cancelNavHover() {
  clearTimeout(navHoverTimer);
}


/* ---- Keyboard support + wiring up clicks and hovers ---- */

// Let Enter or Space activate a focused link, like a real button would.
function activateByKey(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    showPage(e.currentTarget.dataset.page);
  }
}

// Attach behaviour to everything carrying a data-page="..." attribute.
// Nav links open on hover, click, or keyboard. The landing circles open on
// click or keyboard only (no hover, so their labels can be read first).
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


/* ---- About page: typewriter for the greeting and name ---- */

// Start the two typed lines (skipped for visitors who prefer reduced motion).
// Each typeOut call takes: the element, the start delay (ms), the time per
// character (ms), and how long the caret lingers at the end (ms).
function typeAboutIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  typeOut(document.querySelector("#about .about-hello"), 800, 42, 0);
  typeOut(document.querySelector("#about .about-name"), 1550, 36, 600);
}

// Reveal an element's text one character at a time with a blinking caret.
// The text is first rebuilt as individual letter <span>s so the final layout
// is reserved up front (nothing jumps around as letters appear).
function typeOut(el, startMs, charMs, lingerMs) {
  if (!el || el.dataset.typed) return; // type each element only once
  el.dataset.typed = "1";

  // Rebuild the text as one span per letter, keeping any line breaks.
  const lines = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = "";
  const chars = [];
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) el.appendChild(document.createElement("br"));
    for (const ch of line) {
      const span = document.createElement("span");
      span.className = "ty";
      span.textContent = ch;
      el.appendChild(span);
      chars.push(span);
    }
  });

  // After the start delay, switch the letters on one by one and drag the
  // caret along. When finished, remove the caret after lingerMs.
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


/* ---- About page: gentle résumé auto-scroll ---- */

let resumeRAF = null; // id of the running animation frame, so we can stop it
let resumePaused = false; // true while the mouse is over the résumé
let resumePos = 0; // the scroll position we are currently animating to

// Start the slow looping scroll of the résumé. The list is duplicated once so
// that as the first copy scrolls out of view the second copy is already in
// view, making the wrap invisible. You can also scroll it with the mouse
// wheel; it pauses while hovered. Skipped for reduced-motion visitors.
function initResumeLoop() {
  const viewport = document.querySelector("#about .timeline");
  const list = document.querySelector("#about .timeline-list");
  if (!viewport || !list) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Set up the duplicate copy and the hover-pause just once.
  if (!list.dataset.looped) {
    list.dataset.looped = "1";
    list.innerHTML += list.innerHTML;
    viewport.addEventListener("mouseenter", () => (resumePaused = true));
    viewport.addEventListener("mouseleave", () => (resumePaused = false));
  }

  // (Re)start the animation loop from the current scroll position.
  resumePos = viewport.scrollTop;
  if (resumeRAF) cancelAnimationFrame(resumeRAF);
  let last = performance.now();
  const step = (now) => {
    const dt = (now - last) / 1000; // seconds elapsed since the last frame
    last = now;
    const oneCopy = list.scrollHeight / 2; // height of a single (un-duplicated) copy
    if (resumePaused) {
      // While paused, follow whatever the user scrolls with the wheel.
      resumePos = viewport.scrollTop;
    } else if (oneCopy > 0) {
      resumePos += RESUME_SPEED * dt;
      if (resumePos >= oneCopy) resumePos -= oneCopy; // wrap back for a seamless loop
      viewport.scrollTop = resumePos;
    }
    resumeRAF = requestAnimationFrame(step);
  };
  resumeRAF = requestAnimationFrame(step);
}

// Stop the résumé loop (called whenever you leave the About page).
function stopResumeLoop() {
  if (resumeRAF) {
    cancelAnimationFrame(resumeRAF);
    resumeRAF = null;
  }
}


/* ---- Boot: load content, build the pages, show the landing page ---- */

// Fetch content.json and start everything. "no-store" means edits made in the
// CMS show up without a hard refresh. If the file fails to load we leave the
// page blank rather than show it half-built.
async function boot() {
  try {
    SITE_CONTENT = await fetch("content.json", { cache: "no-store" }).then((r) => r.json());
  } catch (err) {
    console.error("Could not load content.json", err);
    return;
  }
  renderSite();
  wireNavigation();
  window.addEventListener("resize", scaleApp);
  showPage("landing");
}

boot();
