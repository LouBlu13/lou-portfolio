"use strict";

// main.js — loads content.json and builds the pages, runs the interactions.


// settings

// page ids (match the section ids in index.html and ids in content.json)
const PAGES = ["landing", "work", "about", "contact"];

// design canvas size, used to scale the stage to the window
const BASE_W = 1440;
const BASE_H = 760;

// hover delay before a nav link opens its page (ms)
const NAV_HOVER_DELAY = 150;

// resume auto-scroll speed (pixels per second)
const RESUME_SPEED = 36;


// state

// pages whose intro animation has already played
const visited = new Set();

// the loaded content.json
let SITE_CONTENT = null;


// helpers

// escape html special characters
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// wrap a path in css url()
const cssUrl = (path) => `url('${path}')`;

// set an element's background image
function setBackground(selector, path) {
  const el = document.querySelector(selector);
  if (el && path) el.style.backgroundImage = cssUrl(path);
}


// rendering

// build the nav links (current page gets .active)
function navHTML(activeId) {
  return SITE_CONTENT.nav
    .map((n) => {
      const active = n.id === activeId ? ' class="active"' : "";
      return `<a data-page="${n.id}" tabindex="0" role="button"${active}>${esc(n.label)}</a>`;
    })
    .join("");
}

// build the footer (name + role)
function footerHTML() {
  const f = SITE_CONTENT.footer;
  return `<span>${esc(f.name)}</span><span>${esc(f.role)}</span>`;
}

// fill all the empty parts of index.html from content.json
function renderSite() {
  const C = SITE_CONTENT;

  // page title + meta description
  if (C.meta) {
    if (C.meta.title) document.title = C.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && C.meta.description) desc.setAttribute("content", C.meta.description);
  }

  // nav + footer on the inner pages
  ["work", "about", "contact"].forEach((id) => {
    const nav = document.querySelector(`#${id} .nav`);
    if (nav) nav.innerHTML = navHTML(id);
    const footer = document.querySelector(`#${id} .footer`);
    if (footer) footer.innerHTML = footerHTML();
  });

  // landing: title + circle buttons
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

  // work: heading
  document.querySelector("#work .work-head").innerHTML =
    `<span class="t-light">${esc(C.work.eyebrow[0])}</span><br />` +
    `<span class="t-bold">${esc(C.work.eyebrow[1])}</span>`;
  // work: project cards (data-index = which project opens on click)
  document.querySelector("#work .work-grid").innerHTML = C.work.projects
    .map(
      (p, i) =>
        `<article class="work-card" data-index="${i}" tabindex="0" role="button" aria-label="${esc(p.title)}">` +
        `<span class="work-card-panel" style="background-image:${cssUrl(p.image)}"></span>` + // hover image
        `<span class="work-card-frame"></span>` + // hover crop marks
        `<span class="work-card-plus"></span>` + // rest "+" mark
        `<p class="work-card-title"><strong>${esc(p.title)}</strong>${esc(p.desc)}</p>` +
        `<span class="work-card-line"></span>` + // divider
        `</article>`
    )
    .join("");
  setBackground("#work .work-circles .pic", C.work.circlePhoto);

  // about: greeting, name, bio, resume, photo
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

  // contact: heading, label/value columns, photo
  document.querySelector("#contact .contact-heading").textContent = C.contact.heading;
  document.querySelector("#contact .contact-details").innerHTML =
    `<div class="contact-labels">${C.contact.details.map((d) => `<p>${esc(d.label)}</p>`).join("")}</div>` +
    `<div class="contact-values">${C.contact.details.map((d) => `<p>${esc(d.value)}</p>`).join("")}</div>`;
  setBackground("#contact .contact-pic", C.contact.circlePhoto);
}


// page switching

// show one page, hide the rest (.reveal plays the intro once per page)
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

  // about-only extras
  if (id === "about") {
    initResumeLoop();
    typeAboutIntro();
  } else {
    stopResumeLoop();
  }
}


// scaling

// scale the fixed stage to fit the window (sets the --scale css variable)
function scaleApp() {
  const scale = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
  document.getElementById("viewport").style.setProperty("--scale", scale);
}


// nav hover

let navHoverTimer = null;

// open the page after the hover delay
function hoverNav(id) {
  clearTimeout(navHoverTimer);
  navHoverTimer = setTimeout(() => showPage(id), NAV_HOVER_DELAY);
}

// cancel a pending hover-open
function cancelNavHover() {
  clearTimeout(navHoverTimer);
}


// wiring (clicks, hovers, keyboard)

// open a page when its focused link gets Enter/Space
function activateByKey(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    showPage(e.currentTarget.dataset.page);
  }
}

// connect nav links and landing circles to page switching
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


// project detail panel

// build the panel markup for one project
// blocks with a heading = image/text row (alternating); empty heading = full-width image
function projectDetailHTML(p) {
  let html = `<h2 class="po-title">${esc(p.title)}</h2>`;
  if (p.intro) html += `<p class="po-intro">${esc(p.intro)}</p>`;

  if (Array.isArray(p.blocks)) {
    let rowCount = 0; // counts headed rows to alternate sides
    p.blocks.forEach((b) => {
      if (!b) return;
      const img = b.image
        ? `<img class="po-img" src="${esc(b.image)}" alt="${esc(b.heading || p.title)}" />`
        : "";

      if (b.heading && b.heading.trim()) {
        // image/text row
        const rev = rowCount % 2 === 1 ? " po-row--rev" : "";
        rowCount++;
        html +=
          `<section class="po-row${rev}">` +
          `<span class="po-mark"></span>` +
          `<div class="po-media">${img}</div>` +
          `<div class="po-info">` +
          `<h3 class="po-heading">${esc(b.heading)}</h3>` +
          (b.text ? `<p class="po-body">${esc(b.text)}</p>` : "") +
          `</div>` +
          `</section>`;
      } else {
        // full-width image + caption
        html +=
          `<section class="po-feature">` +
          `<div class="po-feature-media">${img}</div>` +
          (b.text ? `<p class="po-caption">${esc(b.text)}</p>` : "") +
          `</section>`;
      }
    });
  }

  // bottom image strip
  if (Array.isArray(p.gallery) && p.gallery.length) {
    html +=
      `<div class="po-strip">` +
      p.gallery
        .map((g) => {
          // item can be {image, caption} or a plain image string
          const src = typeof g === "string" ? g : g && g.image;
          const cap = typeof g === "string" ? "" : (g && g.caption) || "";
          if (!src) return "";
          return (
            `<figure class="po-card">` +
            (cap ? `<figcaption class="po-card-label">${esc(cap)}</figcaption>` : "") +
            `<img class="po-img" src="${esc(src)}" alt="${esc(cap)}" />` +
            `</figure>`
          );
        })
        .join("") +
      `</div>`;
  }
  return html;
}

// fill and open the panel for a project
function openProject(i) {
  const p = SITE_CONTENT.work.projects[i];
  if (!p) return;
  const overlay = document.getElementById("project-overlay");
  overlay.querySelector(".po-content").innerHTML = projectDetailHTML(p);
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  scalePopup();
  overlay.querySelector(".po-scroll").scrollTop = 0;
  overlay.querySelector(".po-close").focus();
}

// scale the panel's design stage to fit the screen
function scalePopup() {
  const overlay = document.getElementById("project-overlay");
  if (!overlay.classList.contains("open")) return;
  const DESIGN_W = 1199;
  const scale = Math.min(window.innerWidth * 0.82, DESIGN_W) / DESIGN_W;
  overlay.style.setProperty("--po-scale", scale);
}

// close the panel
function closeProject() {
  const overlay = document.getElementById("project-overlay");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
}

// connect the cards (open) and the close controls (x, backdrop, Escape)
function wireProjects() {
  document.querySelectorAll(".work-card[data-index]").forEach((el) => {
    el.addEventListener("click", () => openProject(Number(el.dataset.index)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject(Number(el.dataset.index));
      }
    });
  });
  document.querySelectorAll("#project-overlay [data-close]").forEach((el) => {
    el.addEventListener("click", closeProject);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProject();
  });
  window.addEventListener("resize", scalePopup);
}


// about: typewriter

// start typing the greeting and name (skipped if reduced motion)
function typeAboutIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  typeOut(document.querySelector("#about .about-hello"), 800, 42, 0);
  typeOut(document.querySelector("#about .about-name"), 1550, 36, 600);
}

// reveal an element's text letter by letter with a caret
function typeOut(el, startMs, charMs, lingerMs) {
  if (!el || el.dataset.typed) return; // run once per element
  el.dataset.typed = "1";

  // rebuild the text as one span per letter
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

  // turn letters on one by one, then remove the caret
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


// about: resume auto-scroll

let resumeRAF = null; // running animation frame
let resumePaused = false; // true while hovered
let resumePos = 0; // current scroll position

// start the looping resume scroll (list is duplicated for a seamless loop)
function initResumeLoop() {
  const viewport = document.querySelector("#about .timeline");
  const list = document.querySelector("#about .timeline-list");
  if (!viewport || !list) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // duplicate the list + set up hover pause (once)
  if (!list.dataset.looped) {
    list.dataset.looped = "1";
    list.innerHTML += list.innerHTML;
    viewport.addEventListener("mouseenter", () => (resumePaused = true));
    viewport.addEventListener("mouseleave", () => (resumePaused = false));
  }

  // animation loop
  resumePos = viewport.scrollTop;
  if (resumeRAF) cancelAnimationFrame(resumeRAF);
  let last = performance.now();
  const step = (now) => {
    const dt = (now - last) / 1000; // seconds since last frame
    last = now;
    const oneCopy = list.scrollHeight / 2; // height of one copy
    if (resumePaused) {
      // follow manual wheel scrolling while paused
      resumePos = viewport.scrollTop;
    } else if (oneCopy > 0) {
      resumePos += RESUME_SPEED * dt;
      if (resumePos >= oneCopy) resumePos -= oneCopy; // wrap
      viewport.scrollTop = resumePos;
    }
    resumeRAF = requestAnimationFrame(step);
  };
  resumeRAF = requestAnimationFrame(step);
}

// stop the resume loop
function stopResumeLoop() {
  if (resumeRAF) {
    cancelAnimationFrame(resumeRAF);
    resumeRAF = null;
  }
}


// boot

// load content.json, then build + wire + show the landing page
async function boot() {
  try {
    SITE_CONTENT = await fetch("content.json", { cache: "no-store" }).then((r) => r.json());
  } catch (err) {
    console.error("Could not load content.json", err);
    return;
  }
  renderSite();
  wireNavigation();
  wireProjects();
  showPage("landing");
}

// scale the stage immediately and on resize (also runs before content loads)
scaleApp();
window.addEventListener("resize", scaleApp);

boot();
