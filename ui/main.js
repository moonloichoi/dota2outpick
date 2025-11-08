import { MAX, state, loadState, saveState } from "./state.js";
import { HEROES, ITEMS, loadData, placeholder } from "./data.js";
import { buildSuggestions } from "./logic.js";

const $ = (id) => document.getElementById(id);

// DOM refs
const slots       = $("slots");
const progress    = $("progress");
const btnClear    = $("btnClear");
const search      = $("search");
const clearSearch = $("clearSearch");
const pool        = $("pool");
const suggestPick = $("suggestPick");
const suggestItem = $("suggestItem");
const toastEl     = $("toast");

// ---------- TOAST ----------
let toastTimer = null;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg || "You have queued 5 enemies already!";
  toastEl.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ toastEl.style.display = "none"; }, 1800);
}

// ---------- RENDER ----------
function renderQueue(){
  slots.innerHTML = "";
  for(let i=0;i<MAX;i++){
    const s = document.createElement("div");
    const slug = state.enemyQueue[i];
    if(slug){
      s.className = "slot filled";
      const img = new Image();
      img.src = HEROES[slug]?.img || placeholder("HERO");
      img.alt = HEROES[slug]?.name || "";
      s.title = (HEROES[slug]?.name || "") + " — click to remove";
      s.onclick = ()=>{ state.enemyQueue.splice(i,1); update(); };
      s.appendChild(img);
    } else {
      s.className = "slot";
      s.textContent = "16:9";
    }
    slots.appendChild(s);
  }
  if(progress){
    progress.textContent = `${state.enemyQueue.length}/${MAX}`;
  }
}

function renderPool(){
  pool.innerHTML = "";
  const term = (search?.value||"").trim().toLowerCase();

  Object.entries(HEROES)
    .filter(([_,h]) => !term || h.name.toLowerCase().includes(term))
    .sort((a,b) => a[1].name.localeCompare(b[1].name))
    .forEach(([slug,h])=>{
      const picked = state.enemyQueue.includes(slug);
      const t = document.createElement("div");
      t.className = "tile" + (picked ? " picked" : "");
      t.innerHTML = `
        <img src="${h.img || placeholder('HERO')}" alt="${h.name}">
        <div class="tname">${h.name}</div>
        ${picked ? '<div class="pickedBadge">PICKED</div>' : ''}`;

      t.onclick = ()=>{
        const idx = state.enemyQueue.indexOf(slug);
        if(idx>=0){
          state.enemyQueue.splice(idx,1);
        } else if(state.enemyQueue.length < MAX){
          state.enemyQueue.push(slug);
        } else {
          toast("You have queued 5 enemies already!");
        }
        update();
      };
      pool.appendChild(t);
    });
}

function renderSuggestions(){
  const { heroSources, itemSources } = buildSuggestions(state.enemyQueue, HEROES);

  // Heroes to pick — Exactly 1 row of 5 cards (CSS hides >5)
  suggestPick.innerHTML = "";
  Array.from(heroSources.entries())
    .sort((a,b)=> b[1].size - a[1].size || (HEROES[a[0]]?.name||"").localeCompare(HEROES[b[0]]?.name||""))
    .forEach(([slug, srcSet], idx)=>{
      const h = HEROES[slug]; if(!h) return;
      const e = document.createElement("div");
      e.className = "sug";
      e.innerHTML = `
        <img src="${h.img || placeholder('HERO')}" alt="${h.name}">
        <div class="sname">${h.name}</div>
      `;
      const srcWrap = document.createElement("div"); srcWrap.className="sources";
      const sources = Array.from(srcSet);

      // Show ALL sources, overlay only (doesn't affect layout)
      sources.forEach(slg=>{
        const box = document.createElement("div"); box.className="src";
        box.innerHTML = `<img src="${HEROES[slg]?.img || placeholder('H')}" alt="${HEROES[slg]?.name||''}">`;
        srcWrap.appendChild(box);
      });
      e.appendChild(srcWrap);
      suggestPick.appendChild(e);
    });

  // Items to buy — Exactly 1 row of 5 cards (CSS hides >5)
  suggestItem.innerHTML = "";
  Array.from(itemSources.entries())
    .sort((a,b)=> b[1].size - a[1].size || a[0].localeCompare(b[0]))
    .forEach(([itemSlug, srcSet])=>{
      const it = ITEMS[itemSlug]; if(!it) return;
      const e = document.createElement("div");
      e.className = "sug";
      e.style.aspectRatio = "11 / 8";
      e.innerHTML = `
        <img src="${it.img || placeholder('ITEM')}" alt="${it.name}">
        <div class="sname">${it.name}</div>
      `;
      const srcWrap = document.createElement("div"); srcWrap.className="sources";
      const sources = Array.from(srcSet);

      // Show ALL sources, overlay only
      sources.forEach(slg=>{
        const box = document.createElement("div"); box.className="src";
        box.innerHTML = `<img src="${HEROES[slg]?.img || placeholder('H')}" alt="${HEROES[slg]?.name||''}">`;
        srcWrap.appendChild(box);
      });
      e.appendChild(srcWrap);
      suggestItem.appendChild(e);
    });
}

function update(){
  renderQueue();
  renderPool();
  renderSuggestions();
  saveState();
}

// ---------- INIT ----------
if(btnClear){ btnClear.addEventListener("click", ()=>{ state.enemyQueue=[]; update(); }); }
if(search){ search.addEventListener("input", ()=> renderPool()); }
if(clearSearch){ clearSearch.addEventListener("click", ()=>{ search.value=''; renderPool(); }); }

(async function init(){
  loadState();
  await loadData();
  update();
})();
