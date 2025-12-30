// =======================
// Mix You Menu Data
// =======================
const menu = [
  // Smoothies
  { id:"SM01", cat:"Smoothies", name:"Banana Smoothie", price:5.00, emoji:"🍌", desc:"Classic banana blend. Real fruits.", tags:["noSugar"] },
  { id:"SM02", cat:"Smoothies", name:"McApple (Apple + Banana)", price:5.00, emoji:"🍎", desc:"Apple freshness + banana smooth.", tags:["noSugar"] },
  { id:"SM03", cat:"Smoothies", name:"Jade Rush (Kiwi + Apple)", price:6.00, emoji:"🥝", desc:"Tangy kiwi with crisp apple.", tags:["healthy","noSugar"] },
  { id:"SM04", cat:"Smoothies", name:"Golden Swirl (Mango + Banana)", price:6.00, emoji:"🥭", desc:"Creamy tropical blend.", tags:["noSugar"] },
  { id:"SM05", cat:"Smoothies", name:"Berry Breeze (Strawberry + Blueberry)", price:6.50, emoji:"🍓", desc:"Berry combo, refreshing taste.", tags:["healthy","noSugar"] },
  { id:"SM06", cat:"Smoothies", name:"Summer Splash (Mixed Tropical)", price:6.50, emoji:"🍍", desc:"Tropical mix for hot days.", tags:["noSugar"] },
  { id:"SM07", cat:"Smoothies", name:"Golden Glow (Mango + Pineapple)", price:6.00, emoji:"🍍", desc:"Bright, juicy and uplifting.", tags:["noSugar"] },

  // Juices
  { id:"JU01", cat:"Fresh Juices", name:"Fresh Orange Juice", price:5.00, emoji:"🍊", desc:"Freshly made. Vitamin C.", tags:["healthy","noSugar"] },
  { id:"JU02", cat:"Fresh Juices", name:"Watermelon Juice", price:4.50, emoji:"🍉", desc:"Light and hydrating.", tags:["healthy","noSugar"] },
  { id:"JU03", cat:"Fresh Juices", name:"Pineapple Juice", price:5.00, emoji:"🍍", desc:"Sweet-tart tropical juice.", tags:["noSugar"] },
  { id:"JU04", cat:"Fresh Juices", name:"Apple Carrot Juice", price:5.50, emoji:"🥕", desc:"Balanced taste, daily-friendly.", tags:["healthy","noSugar"] },
  { id:"JU05", cat:"Fresh Juices", name:"ABC Juice (Apple+Beet+Carrot)", price:6.00, emoji:"🥤", desc:"Popular healthy mix.", tags:["healthy","noSugar"] },
  { id:"JU06", cat:"Fresh Juices", name:"Refreshing Lime Juice", price:4.50, emoji:"🍋", desc:"Zesty and cooling.", tags:["noSugar"] },

  // Ice Cream / Dessert
  { id:"IC01", cat:"Ice Cream", name:"Vanilla Ice Cream Cup", price:3.00, emoji:"🍦", desc:"Simple, creamy vanilla.", tags:[] },
  { id:"IC02", cat:"Ice Cream", name:"Fruit Ice Cream Smoothie", price:6.50, emoji:"🍨", desc:"Any fruit + light ice cream.", tags:[] },
  { id:"IC03", cat:"Ice Cream", name:"Berry Ice Cream Blast", price:7.00, emoji:"🫐", desc:"Berry smoothie with ice cream.", tags:[] },
  { id:"IC04", cat:"Ice Cream", name:"Mango Ice Cream Swirl", price:7.00, emoji:"🥭", desc:"Mango + ice cream swirl.", tags:[] },

  // Healthy
  { id:"HL01", cat:"Healthy Choice", name:"Avocado Lover", price:7.50, emoji:"🥑", desc:"Creamy avocado blend.", tags:["healthy","noSugar"] },
  { id:"HL02", cat:"Healthy Choice", name:"Green Detox (Apple+Spinach+Kiwi)", price:6.50, emoji:"🥬", desc:"Green mix, refreshing.", tags:["healthy","noSugar"] },
  { id:"HL03", cat:"Healthy Choice", name:"Protein Banana Smoothie", price:6.50, emoji:"💪", desc:"Banana + oats (add-on).", tags:["healthy","noSugar"] },
];

const categories = ["Smoothies","Fresh Juices","Ice Cream","Healthy Choice"];

// =======================
// Elements
// =======================
const els = {
  tabs: document.getElementById("tabs"),
  grid: document.getElementById("grid"),
  search: document.getElementById("search"),
  pills: Array.from(document.querySelectorAll(".pill")),
  modal: document.getElementById("modal"),
  closeModal: document.getElementById("closeModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalDesc: document.getElementById("modalDesc"),
  modalPrice: document.getElementById("modalPrice"),
  modalImg: document.getElementById("modalImg"),
  modalBadges: document.getElementById("modalBadges"),
  ice: document.getElementById("ice"),
  sugar: document.getElementById("sugar"),
  size: document.getElementById("size"),
  copyOrder: document.getElementById("copyOrder"),
  year: document.getElementById("year"),
};

els.year.textContent = new Date().getFullYear();

// =======================
// State
// =======================
let activeCat = categories[0];
let activeFilter = "all";
let activeItem = null;

// =======================
// Helpers
// =======================
function formatRM(n){ return `RM ${n.toFixed(2)}`; }

function badgeHTML(tag){
  const map = { noSugar: "No Sugar Option", healthy: "Healthy" };
  const label = map[tag] || tag;
  return `<span class="badge ${tag}">${label}</span>`;
}

// =======================
// Tabs
// =======================
function buildTabs(){
  els.tabs.innerHTML = categories.map(c => `
    <button class="tab ${c===activeCat ? "active":""}" data-cat="${c}">${c}</button>
  `).join("");

  els.tabs.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      activeCat = btn.dataset.cat;
      buildTabs();
      render();
    });
  });
}

function getVisibleItems(){
  const q = (els.search.value || "").trim().toLowerCase();

  return menu.filter(item=>{
    const inCat = item.cat === activeCat;

    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q);

    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "noSugar" && item.tags.includes("noSugar")) ||
      (activeFilter === "healthy" && item.tags.includes("healthy"));

    return inCat && matchSearch && matchFilter;
  });
}

// =======================
// Render grid
// =======================
function render(){
  const items = getVisibleItems();

  if(items.length === 0){
    els.grid.innerHTML = `
      <div class="card" style="grid-column: span 12; cursor: default;">
        <div>
          <h3 class="title">No results</h3>
          <p class="desc">Try another keyword or change filter.</p>
        </div>
      </div>
    `;
    return;
  }

  els.grid.innerHTML = items.map(item=>`
    <article class="card" data-id="${item.id}">
      <div class="thumb">${item.emoji || "🥤"}</div>
      <div style="flex:1">
        <h3 class="title">${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="row">
          <div class="price">${formatRM(item.price)}</div>
          <div class="badges">${(item.tags || []).map(badgeHTML).join("")}</div>
        </div>
      </div>
    </article>
  `).join("");

  els.grid.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id = card.dataset.id;
      openModal(menu.find(x=>x.id===id));
    });
  });
}

// =======================
// Modal
// =======================
function openModal(item){
  activeItem = item;
  els.modalTitle.textContent = item.name;
  els.modalDesc.textContent = item.desc;
  els.modalPrice.textContent = formatRM(item.price);
  els.modalImg.textContent = item.emoji || "🥤";
  els.modalBadges.innerHTML = (item.tags || []).map(badgeHTML).join("");

  els.modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  els.modal.classList.add("hidden");
  document.body.style.overflow = "";
  activeItem = null;
}

els.closeModal.addEventListener("click", closeModal);
els.modal.addEventListener("click", (e)=>{
  if(e.target === els.modal) closeModal();
});

document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape" && !els.modal.classList.contains("hidden")) closeModal();
});

// =======================
// Events
// =======================
els.search.addEventListener("input", render);

els.pills.forEach(p=>{
  p.addEventListener("click", ()=>{
    els.pills.forEach(x=>x.classList.remove("active"));
    p.classList.add("active");
    activeFilter = p.dataset.filter;
    render();
  });
});

// ✅ Copy Order (works on HTTPS / GitHub Pages)
els.copyOrder.addEventListener("click", async ()=>{
  if(!activeItem) return;

  const text =
`Mix You Order:
- Item: ${activeItem.name}
- Price: ${formatRM(activeItem.price)}
- Ice: ${els.ice.value}
- Sugar: ${els.sugar.value}
- Size: ${els.size.value}`;

  // feedback first
  els.copyOrder.textContent = "Copying...";

  try{
    await navigator.clipboard.writeText(text);
    els.copyOrder.textContent = "Copied ✅";
    setTimeout(()=> els.copyOrder.textContent = "Copy Order Text", 1200);
  }catch{
    // fallback: show text if blocked
    els.copyOrder.textContent = "Copy Order Text";
    alert("Copy blocked. Copy manually:\n\n" + text);
  }
});

// =======================
// Init
// =======================
buildTabs();
render();
