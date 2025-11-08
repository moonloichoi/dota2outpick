// logic.js
// Helper & mapping logic for OutPick

export function slugToImg(basePath, slug) {
  return `${basePath}/${slug}.png`;
}

export function itemSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// Build source maps: suggestion -> Set(enemySlug)
// Returns { heroSources: Map<heroSlug, Set<enemySlug>>, itemSources: Map<itemSlug, Set<enemySlug>> }
export function buildSourceMaps(enemyQueue, HEROES) {
  const heroSources = new Map();
  const itemSources = new Map();

  enemyQueue.forEach((eSlug) => {
    const enemy = HEROES[eSlug];
    if (!enemy) return;

    // hero counters
    (enemy.counters || []).forEach((sug) => {
      if (enemyQueue.includes(sug)) return; // don't suggest an enemy already picked
      if (!heroSources.has(sug)) heroSources.set(sug, new Set());
      heroSources.get(sug).add(eSlug);
    });

    // item counters
    (enemy.item_counters || []).forEach((it) => {
      const key = itemSlug(it);
      if (!itemSources.has(key)) itemSources.set(key, new Set());
      itemSources.get(key).add(eSlug);
    });
  });

  return { heroSources, itemSources };
}

// Sort + limit to 5 suggestions (1 row)
export function topFiveHeroes(heroSources, HEROES) {
  return [...heroSources.keys()]
    .filter((s) => HEROES[s])
    .sort((a, b) => HEROES[a].name.localeCompare(HEROES[b].name))
    .slice(0, 5);
}

export function topFiveItems(itemSources, ITEMS) {
  return [...itemSources.keys()]
    .sort((a, b) => (ITEMS[a]?.name || a).localeCompare(ITEMS[b]?.name || b))
    .slice(0, 5);
}
