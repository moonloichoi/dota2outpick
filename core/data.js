// data.js
export const HEROES = {};
export const ITEMS  = {};

export async function loadData(){
  try {
    const [h, i] = await Promise.all([
      fetch("./heroes.json").then(r => r.json()),
      fetch("./items.json").then(r => r.json())
    ]);
    Object.assign(HEROES, h);
    Object.assign(ITEMS, i);
  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

/**
 * Get normalized item slug
 */
export function itemSlug(s){
  return (s || "").toLowerCase().replace(/\s+/g, "_");
}

/**
 * Placeholder fallback
 * @param {'HERO'|'ITEM'|string} kind
 */
export function placeholder(kind){
  if(kind === "ITEM") return "https://via.placeholder.com/88x64?text=ITEM";
  if(kind === "HERO") return "https://via.placeholder.com/256x144?text=HERO";
  return "https://via.placeholder.com/64x64?text=?";
}
