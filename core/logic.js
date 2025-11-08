// core/logic.js
// Build suggestions from selected enemy queue.
// Trả về heroSources & itemSources, giữ NGUYÊN số lần trùng lặp (không gộp Set).

export function buildSuggestions(enemyQueue, HEROES) {
  // slug -> array các enemySlug gây ra gợi ý (CHO PHÉP TRÙNG)
  const heroSources = new Map();
  // itemKey -> array các enemySlug gây ra gợi ý (CHO PHÉP TRÙNG)
  const itemSources = new Map();

  for (const enSlug of enemyQueue) {
    const enemy = HEROES[enSlug];
    if (!enemy) continue;

    const countersHero = enemy?.counters?.heroes || [];
    for (const targetSlug of countersHero) {
      if (!HEROES[targetSlug]) continue;
      const arr = heroSources.get(targetSlug) || [];
      arr.push(enSlug);
      heroSources.set(targetSlug, arr);
    }

    const countersItem = enemy?.counters?.items || [];
    for (const itemKey of countersItem) {
      const arr = itemSources.get(itemKey) || [];
      arr.push(enSlug);
      itemSources.set(itemKey, arr);
    }
  }

  // Không gợi ý những hero đã có trong queue
  for (const s of enemyQueue) heroSources.delete(s);

  return { heroSources, itemSources };
}
