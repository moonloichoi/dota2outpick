export function buildSuggestions(enemyQueue, HEROES) {
  const heroSources = new Map();
  const itemSources = new Map();

  enemyQueue.forEach((slug) => {
    const enemy = HEROES[slug];
    if (!enemy) return;

    (enemy.counters || []).forEach((targetSlug) => {
      if (enemyQueue.includes(targetSlug)) return;
      const arr = heroSources.get(targetSlug) || new Set();
      arr.add(slug);
      heroSources.set(targetSlug, arr);
    });

    (enemy.item_counters || []).forEach((item) => {
      const arr = itemSources.get(item) || new Set();
      arr.add(slug);
      itemSources.set(item, arr);
    });
  });

  return { heroSources, itemSources };
}
