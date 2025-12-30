// =======================
// Mix You Menu Data
// =======================
const menu = [
  { id:"SM01", cat:"Smoothies", name:"Banana Smoothie", price:5.00, emoji:"🍌", desc:"Classic banana blend.", tags:["noSugar"] },
  { id:"SM02", cat:"Smoothies", name:"Mango Banana", price:6.00, emoji:"🥭", desc:"Creamy tropical mix.", tags:["noSugar"] },
  { id:"JU01", cat:"Fresh Juices", name:"Orange Juice", price:5.00, emoji:"🍊", desc:"Fresh & vitamin C.", tags:["healthy","noSugar"] },
  { id:"IC01", cat:"Ice Cream", name:"Vanilla Ice Cream", price:3.00, emoji:"🍦", desc:"Classic vanilla.", tags:[] }
];

const categories = ["Smoothies","Fresh Juices","Ice Cream"];

// =======================
// Elements
// =======================
const els = {
  tabs: document.getElementById("tabs"),
  grid: document.getElementById("grid"),
  search: document.getElementById("search"),
  pills: document.querySelectorAll(".pill"),
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
  year: document.getElementById("year")
};

let activeCat = categories[0];
let activeFilter = "all";
let activeItem = null;

els.year.textContent = new Date().getFullYear();

// =======================
// Helpers
// =======================
function formatRM(n){
  return `RM ${n.toFixed(2)}`;
}

function badgeHTML(tag){
  if(tag === "noSugar") return `<span class="badge noSugar">No Sugar</span>`;
  if(tag === "healthy") return `<span class="badge healthy">Healthy</span>`;
  return "";
}

// =======================
// Tabs
// =======================
function buildTabs(){
  els.tabs.innerHTML = categories.map(c =>
    `<button class="tab ${c===activeCat?"active":""}" data-cat="${c}">${c}</button>`
  ).join("");

  els.tabs.querySelectorAll(".tab").forEach(btn=>{
    btn.onclick = () => {
      activeCat = btn.dataset.cat;
      buildTabs();
      render();
    };
  });
}

// =======================
// Render Menu
// =======================
function render(){
  const q = els.search.value.toLowerCase();

  const items = menu.filter(item =>
    item.cat === activeCat &&
    (!q || item.name.toLowerCase().includes(q))
  );

  els.grid.innerHTML = items.map(item => `
    <article class="card" data-id="${item.id}">
      <div class="thumb">${item.emoji}</div>
      <div style="flex:1">
        <h3 class="title">${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="row">
          <div class="price">${formatRM(item.price)}</div>
          <div class="badges">${item.tags.map(badgeHTML).join("")}</div>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".card").forEach(card=>{
    card.onclick = () => {
      const id = card.dataset.id;
      openModal(menu.find(x=>x.id===id));
    };
  });

  els.grid.classList.remove("hidden");
  els.grid.classList.add("show");
}

// =======================
// Modal
// =======================
function openModal(item){
  activeItem = item;

  els.modalTitle.textContent = item.name;
  els.modalDesc.textContent = item.desc;
  els.modalPrice.textContent = formatRM(item.price);
  els.modalImg.textContent = item.emoji;
  els.modalBadges.innerHTML = item.tags.map(badgeHTML).join("");

  els.modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  bindCopyButton(); // 🔥 IMPORTANT
}

function closeModal(){
  els.modal.classList.add("hidden");
  document.body.style.overflow = "";
  activeItem = null;
}

els.closeModal.onclick = closeModal;
els.modal.onclick = e => { if(e.target === els.modal) closeModal(); };

// =======================
// 🔥 COPY ORDER (FIXED)
// =======================
function bindCopyButton(){
  const btn = document.getElementById("copyOrder");
  if(!btn) return;

  btn.onclick = () => {
    if(!activeItem){
      alert("Please select a drink first 🍹");
      return;
    }

    const text =
`Mix You Order
Item: ${activeItem.name}
Price: ${formatRM(activeItem.price)}
Ice: ${els.ice.value}
Sugar: ${els.sugar.value}
Size: ${els.size.value}`;

    btn.textContent = "Copying...";

    navigator.clipboard.writeText(text).then(()=>{
      btn.textContent = "Copied ✅";
      setTimeout(()=>btn.textContent="Copy Order Text",1500);
    }).catch(()=>{
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btn.textContent = "Copied ✅";
      setTimeout(()=>btn.textContent="Copy Order Text",1500);
    });
  };
}

// =======================
// Init
// =======================
els.search.oninput = render;
buildTabs();
render();
