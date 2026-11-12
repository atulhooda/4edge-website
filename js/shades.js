(function () {
  "use strict";
  const SERIES = window.SHADE_SERIES || [];
  // shade = [code, name, base, dark, light, finish]
  const img = (s) => `assets/shades/${s[0]}.webp`;
  const label = (s) => (s[1] ? s[1] + " " : "") + s[0];
  const finishLabel = (f) => ({ matt: "Matt", gloss: "High gloss" }[f] || "");

  /* ---------- Home teaser: a strip of shades ---------- */
  const teaser = document.querySelector("[data-shade-teaser]");
  if (teaser) {
    const picks = [];
    SERIES.forEach((se) => {
      const step = Math.max(1, Math.floor(se.shades.length / 3));
      for (let i = 0; i < se.shades.length && picks.length < 24; i += step) picks.push([se, se.shades[i]]);
    });
    teaser.innerHTML = picks.slice(0, 24).map(([se, s]) =>
      `<span class="photo" style="--b:${s[2]};background-image:url(${img(s)})" title="${label(s)}"></span>`).join("");
  }

  /* ---------- Shade library page ---------- */
  const lib = document.querySelector("[data-shade-library]");
  if (!lib) return;

  const tabs = document.querySelector("[data-shade-tabs]");
  const search = document.querySelector("[data-shade-search]");
  const total = SERIES.reduce((n, s) => n + s.shades.length, 0);
  document.querySelectorAll("[data-shade-total]").forEach((el) => (el.textContent = total));
  document.querySelectorAll("[data-series-total]").forEach((el) => (el.textContent = SERIES.length));

  tabs.innerHTML =
    `<button class="chip active" data-series="all">All<em>${total}</em></button>` +
    SERIES.map((s) => `<button class="chip" data-series="${s.id}">${s.name}<em>${s.shades.length}</em></button>`).join("");

  lib.innerHTML = SERIES.map((se) => `
    <section class="series-block" id="${se.id}" data-block="${se.id}">
      <div class="series-head">
        <div><span class="eyebrow">${groupLabel(se.group)}</span><h2>${se.name}</h2></div>
        <span class="count"><b data-count>${se.shades.length}</b> shades</span>
      </div>
      <div class="shade-grid">
        ${se.shades.map((s) => `
          <button class="shade" type="button" data-code="${s[0]}" data-q="${(s[0] + " " + s[1]).toLowerCase()}" data-series-id="${se.id}">
            <div class="chip-swatch photo" style="--b:${s[2]}"><img src="${img(s)}" alt="${label(s)}" loading="lazy" decoding="async" width="480" height="160"></div>
            <div class="code"><b>${s[1] || se.name}</b><span>${s[0]}${s[5] ? " · " + finishLabel(s[5]) : ""}</span></div>
          </button>`).join("")}
      </div>
    </section>`).join("") + `<p class="shade-empty" hidden>No shade matches that search.</p>`;

  function groupLabel(g) {
    return { solid: "Solid colour", wood: "Woodgrain texture", fabric: "Fabric design", marble: "Marble & stone" }[g] || "";
  }

  let active = "all";
  const apply = () => {
    const q = (search.value || "").trim().toLowerCase();
    let shown = 0;
    lib.querySelectorAll("[data-block]").forEach((block) => {
      const inSeries = active === "all" || block.dataset.block === active;
      let n = 0;
      block.querySelectorAll(".shade").forEach((el) => {
        const ok = inSeries && (!q || el.dataset.q.includes(q));
        el.hidden = !ok;
        if (ok) n++;
      });
      block.hidden = n === 0;
      block.querySelector("[data-count]").textContent = n;
      shown += n;
    });
    lib.querySelector(".shade-empty").hidden = shown !== 0;
  };

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    active = b.dataset.series;
    tabs.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
    apply();
    const top = lib.getBoundingClientRect().top + scrollY - 150;
    if (scrollY > top) scrollTo({ top, behavior: "smooth" });
  });
  search.addEventListener("input", apply);

  // Deep link: shades.html#wooden-matt selects that series
  const hash = location.hash.slice(1);
  if (hash && SERIES.some((s) => s.id === hash)) {
    tabs.querySelector(`[data-series="${hash}"]`).click();
  }

  /* ---------- Detail dialog ---------- */
  const dlg = document.querySelector("#shade-dialog");
  lib.addEventListener("click", (e) => {
    const btn = e.target.closest(".shade");
    if (!btn) return;
    const se = SERIES.find((s) => s.id === btn.dataset.seriesId);
    const s = se.shades.find((x) => x[0] === btn.dataset.code);
    dlg.querySelector(".big").className = "big photo";
    dlg.querySelector(".big").setAttribute("style", `--b:${s[2]};background-image:url(${img(s)})`);
    dlg.querySelector("h3").textContent = s[1] || se.name;
    dlg.querySelector(".sub").textContent = ["Code " + s[0], groupLabel(se.group), finishLabel(s[5])].filter(Boolean).join(" · ");
    const q = encodeURIComponent(label(s));
    dlg.querySelector("[data-enquire]").href = `contact.html?shade=${q}`;
    dlg.querySelector("[data-wa]").href = "https://wa.me/919309537501?text=" +
      encodeURIComponent(`Hello 4Edge, I'm interested in shade ${label(s)} (${se.name}). Please share price and availability.`);
    dlg.showModal();
  });
  dlg.querySelector(".close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
})();
