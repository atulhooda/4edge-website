(function () {
  "use strict";

  /* Nav: solid on scroll + mobile menu */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const toggle = nav.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.querySelectorAll(".mobile-menu a").forEach((a) =>
        a.addEventListener("click", () => nav.classList.remove("open"))
      );
    }
  }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* Finishes explorer */
  const explorer = document.querySelector("[data-explorer]");
  if (explorer) {
    const items = explorer.querySelectorAll(".finish-item");
    const swatches = explorer.querySelectorAll(".swatch-stage .swatch");
    const label = explorer.querySelector(".swatch-label");
    const desc = explorer.querySelector(".panel-desc");
    const specs = explorer.querySelector(".spec-rows");

    const activate = (i) => {
      items.forEach((it, j) => it.classList.toggle("active", i === j));
      swatches.forEach((s, j) => s.classList.toggle("show", i === j));
      const d = items[i].dataset;
      label.textContent = d.label;
      desc.textContent = d.desc;
      specs.innerHTML =
        `<div><span>Look</span><span>${d.look}</span></div>` +
        `<div><span>Best for</span><span>${d.use}</span></div>` +
        `<div><span>Thickness</span><span>0.5 mm – 2 mm</span></div>`;
    };
    items.forEach((it, i) => {
      const btn = it.querySelector("button");
      btn.addEventListener("mouseenter", () => activate(i));
      btn.addEventListener("focus", () => activate(i));
      btn.addEventListener("click", () => activate(i));
    });
    activate(0);
  }

  /* Size table filter */
  document.querySelectorAll("[data-size-filter]").forEach((group) => {
    const table = document.querySelector(group.dataset.sizeFilter);
    if (!table) return;
    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
        const w = chip.dataset.width;
        table.querySelectorAll("tbody tr").forEach((tr) => {
          tr.classList.toggle("hide", w !== "all" && tr.dataset.width !== w);
        });
      });
    });
  });

  /* Parallax image band */
  const bands = document.querySelectorAll(".image-band img");
  if (bands.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const tick = () => {
      bands.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${p * -8}%)`;
      });
    };
    tick();
    window.addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true });
  }

  /* Enquiry form -> WhatsApp */
  const form = document.querySelector("#enquiry-form");
  if (form) {
    const pre = new URLSearchParams(location.search).get("shade");
    if (pre && form.shade) form.shade.value = pre;
    const buildLines = () => {
      const f = new FormData(form);
      const finishes = f.getAll("finish").join(", ") || "Not specified";
      const lines = [
        "Hello 4Edge, I'd like a quote for PVC edge banding.",
        "",
        `Name: ${f.get("name")}`,
        f.get("company") ? `Company: ${f.get("company")}` : null,
        `Phone: ${f.get("phone")}`,
        f.get("city") ? `City: ${f.get("city")}` : null,
        `I am a: ${f.get("type")}`,
        `Finishes: ${finishes}`,
        f.get("shade") ? `Shade: ${f.get("shade")}` : null,
        f.get("sizes") ? `Size codes: ${f.get("sizes")}` : null,
        f.get("message") ? `Details: ${f.get("message")}` : null,
      ].filter((l) => l !== null);
      return lines;
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const url = "https://wa.me/919309537501?text=" + encodeURIComponent(buildLines().join("\n"));
      window.open(url, "_blank", "noopener");
    });
    const emailBtn = form.querySelector("[data-send-email]");
    if (emailBtn) emailBtn.addEventListener("click", () => {
      if (!form.reportValidity()) return;
      const name = form.elements.namedItem("name").value.trim();
      location.href = "mailto:4edge.in@gmail.com?subject=" +
        encodeURIComponent("Quote request" + (name ? " from " + name : "")) +
        "&body=" + encodeURIComponent(buildLines().join("\n"));
    });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
