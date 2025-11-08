import { itemSlug } from "./data.js";

/** Tạo map gợi ý + nguồn (hero nào gây ra gợi ý đó), GIỮ TRÙNG LẶP */
export function buildSuggestions(enemyQueue, HEROES){
  // heroSlug -> Array(enemySlug)  (giữ trùng)
  const heroSources = new Map();
  // itemSlug -> Array(enemySlug)  (giữ trùng)
  const itemSources = new Map();

  enemyQueue.forEach(eSlug => {
    const enemy = HEROES[eSlug];
    if (!enemy) return;

    // Gợi ý hero
    (enemy?.counters || []).forEach(sug => {
      if (enemyQueue.includes(sug)) return;      // không gợi ý hero đã có trong queue
      const arr = heroSources.get(sug) || [];
      arr.push(eSlug);                            // GIỮ TRÙNG
      heroSources.set(sug, arr);
    });

    // Gợi ý item
    (enemy?.item_counters || []).forEach(it => {
      const key = itemSlug(it);
      const arr = itemSources.get(key) || [];
      arr.push(eSlug);                            // GIỮ TRÙNG
      itemSources.set(key, arr);
    });
  });

  return { heroSources, itemSources };
}
