const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const GRADS = ["g1","g2","g3","g4"];

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

let EVENTS = [];
let active = { type: null, community: null };

async function load() {
  try {
    const res = await fetch("data/events.json", { cache: "no-store" });
    if (!res.ok) throw new Error();
    return (await res.json()).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch { return []; }
}

function shots(e) {
  const photos = Array.isArray(e.photos) ? e.photos.filter(Boolean) : [];
  const cells = [];
  for (let i = 0; i < 4; i++) {
    if (photos[i]) {
      cells.push(`<div class="shot"><img src="${photos[i]}" alt="" loading="lazy"></div>`);
    } else {
      cells.push(`<div class="shot ${GRADS[i % 4]}"><div class="ph">photo</div></div>`);
    }
  }
  return `<div class="strip">${cells.join("")}</div>`;
}

function render() {
  const host = document.querySelector("[data-entries]");
  if (!host) return;

  const list = EVENTS.filter(e =>
    (!active.type || e.type === active.type) &&
    (!active.community || e.community === active.community)
  );

  if (!list.length) {
    host.innerHTML = `<div class="empty">Nothing matches this filter.</div>`;
    return;
  }

  host.innerHTML = list.map(e => `
    <article class="entry">
      <div class="date">${fmtDate(e.date)}</div>
      <div>
        <h3>${e.name}</h3>
        <div class="tags">
          <span class="tag">${e.community}</span>
          <span class="tag">${e.type}</span>
        </div>
        ${shots(e)}
      </div>
    </article>`).join("");
}

function buildFilters() {
  const types = [...new Set(EVENTS.map(e => e.type))].sort();
  const comms = [...new Set(EVENTS.map(e => e.community))].sort();

  const tHost = document.querySelector("[data-filter-types]");
  const cHost = document.querySelector("[data-filter-communities]");

  if (tHost) tHost.innerHTML = types.map(t =>
    `<button class="filter" data-type="${t}" aria-pressed="false">${t}</button>`).join("");
  if (cHost) cHost.innerHTML = comms.map(c =>
    `<button class="filter" data-community="${c}" aria-pressed="false">${c}</button>`).join("");

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.type ? "type" : "community";
      const val = btn.dataset.type || btn.dataset.community;
      active[key] = active[key] === val ? null : val;
      syncButtons();
      render();
    });
  });

  const clear = document.querySelector("[data-clear]");
  if (clear) clear.addEventListener("click", () => {
    active = { type: null, community: null };
    syncButtons();
    render();
  });
}

function syncButtons() {
  document.querySelectorAll(".filter").forEach(b => {
    const key = b.dataset.type ? "type" : "community";
    const val = b.dataset.type || b.dataset.community;
    b.setAttribute("aria-pressed", active[key] === val ? "true" : "false");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  EVENTS = await load();
  buildFilters();
  render();
});
