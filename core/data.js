export let HEROES = {};
export let ITEMS  = {};

const txt = (v) => (v ?? "").toString();
const slugify = (s) => txt(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function placeholder(label = "IMG") {
  const t = encodeURIComponent(label.slice(0, 6));
  return "data:image/svg+xml;utf8," +
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>" +
    "<rect width='120' height='120' fill='%23eee'/>" +
    `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'>${t}</text>` +
    "</svg>";
}

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`fetch ${path} ${res.status}`);
  return res.json();
}

function normalizeHeroes(list) {
  const map = {};
  for (const h of list || []) {
    const slug = h.slug ? slugify(h.slug) : slugify(h.name || "");
    if (!slug) continue;
    map[slug] = {
      slug,
      name: h.name || slug,
      img: h.img || h.icon || h.image || `./assets/heroes/${slug}.png`,
      counters: Array.isArray(h.counters) ? h.counters.map(slugify) : [],
      good_against: Array.isArray(h.good_against) ? h.good_against.map(slugify) : [],
      bad_against: Array.isArray(h.bad_against) ? h.bad_against.map(slugify) : [],
      items: Array.isArray(h.items) ? h.items.map(slugify) : []
    };
  }
  return map;
}

function normalizeItems(list) {
  const map = {};
  for (const it of list || []) {
    const key = it.key ? slugify(it.key) : slugify(it.name || "");
    if (!key) continue;
    map[key] = {
      key,
      name: it.name || key,
      img: it.img || it.icon || `./assets/items/${key}.png`
    };
  }
  return map;
}

export async function loadData() {
  try {
    const [heroesRaw, itemsRaw] = await Promise.all([
      loadJSON("./heroes.json"),
      loadJSON("./items.json")
    ]);

    const heroesList = Array.isArray(heroesRaw) ? heroesRaw : Object.values(heroesRaw || {});
    const itemsList  = Array.isArray(itemsRaw)  ? itemsRaw  : Object.values(itemsRaw || {});

    HEROES = normalizeHeroes(heroesList);
    ITEMS  = normalizeItems(itemsList);
  } catch (e) {
    HEROES = {};
    ITEMS = {};
    console.warn("loadData error:", e);
  }
}
