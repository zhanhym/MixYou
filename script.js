// =======================
// Mix You Menu Data
// =======================
const menu = [
    { id:"SM01", cat:"Smoothies", name:"Banana Smoothie", price:5.00, emoji:"🍌", desc:"Classic banana blend. Real fruits.", tags:["noSugar"] },
    { id:"SM02", cat:"Smoothies", name:"McApple (Apple + Banana)", price:5.00, emoji:"🍎", desc:"Apple freshness + banana smooth.", tags:["noSugar"] },
    { id:"SM03", cat:"Smoothies", name:"Jade Rush (Kiwi + Apple)", price:6.00, emoji:"🥝", desc:"Tangy kiwi with crisp apple.", tags:["healthy","noSugar"] },
    { id:"SM04", cat:"Smoothies", name:"Golden Swirl (Mango + Banana)", price:6.00, emoji:"🥭", desc:"Creamy tropical blend.", tags:["noSugar"] },
    { id:"SM05", cat:"Smoothies", name:"Berry Breeze (Strawberry + Blueberry)", price:6.50, emoji:"🍓", desc:"Berry combo, refreshing taste.", tags:["healthy","noSugar"] },
  
    { id:"JU01", cat:"Fresh Juices", name:"Fresh Orange Juice", price:5.00, emoji:"🍊", desc:"Freshly made. Vitamin C.", tags:["healthy","noSugar"] },
    { id:"JU02", cat:"Fresh Juices", name:"Watermelon Juice", price:4.50, emoji:"🍉", desc:"Light and hydrating.", tags:["healthy","noSugar"] },
  
    { id:"IC01", cat:"Ice Cream", name:"Vanilla Ice Cream Cup", price:3.00, emoji:"🍦", desc:"Simple, creamy vanilla.", tags:[] },
  
    { id:"HL01", cat:"Healthy Choice", name:"Avocado Lover", price:7.50, emoji:"🥑", desc:"Creamy avocado blend.", tags:["healthy","noSugar"] },
  ];
  
  const categories = ["Smoothies","Fresh Juices","Ice Cream","Healthy Choice"];
  
  // =======================
  // Elements
  // =======================
  const els = {
    pageLoader: document.getElementById("pageLoader"),
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
  
  // =======================
  // State
  // =======================
  let activeCat = categories[0];
  let activeFilter = "all";
  let activeItem = null;
  
  els.year.textContent = new Date().getFullYear();
  
  // =======================
  // ✅ Loader helpers
  // =======================
  function showPageLoader(){
    if(!els.pageLoader) return;
    els.pageLoader.classList.remove("hide");
    els.pageLoader.style.display = "grid";
    document.body.style.overflow = "hidden";
  }
  
  function hidePageLoader(){
    if(!els.pageLoader) return;
    els.pageLoader.classList.add("hide");
    document.body.style.overflow = "";
    setTimeout(()=> {
      els.pageLoader.style.display = "none";
    }, 380);
  }
  
  // =======================
  // Helpers
  // =======================
  function formatRM(n){ return `RM ${n.toFixed(2)}`; }
  
  function badgeHTML(tag){
    const labelMap = { noSugar:"No Sugar Option", healthy:"Healthy" };
    const label = labelMap[tag] || tag;
    return `<span class="badge ${tag}">${label}</span>`;
  }
  
  // =======================
  // UI Builders
  // =======================
  function buildTabs(){
    els.tabs.innerHTML = categories.map(c => `
      <button class="tab ${c===activeCat ? "active":""}" data-cat="${c}">${c}</button>
    `).join("");
  
    els.tabs.querySelectorAll(".tab").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        activeCat = btn.dataset.cat;
        buildTabs();
        render(true);
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
  
  function render(withLoader=false){
    if(withLoader) showPageLoader();
  
    // simulate loading a bit (so customers can SEE the nice loader)
    setTimeout(()=>{
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
        els.grid.classList.remove("hidden");
        els.grid.classList.add("show");
        if(withLoader) hidePageLoader();
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
  
      // ✅ show grid with fade
      els.grid.classList.remove("hidden");
      requestAnimationFrame(()=> els.grid.classList.add("show"));
  
      if(withLoader) hidePageLoader();
    }, 550);
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
  }
  
  function closeModal(){
    els.modal.classList.add("hidden");
    activeItem = null;
  }
  
  els.closeModal.addEventListener("click", closeModal);
  els.modal.addEventListener("click", (e)=>{ if(e.target === els.modal) closeModal(); });
  
  // =======================
  // Events
  // =======================
  els.search.addEventListener("input", ()=> render(true));
  
  els.pills.forEach(p=>{
    p.addEventListener("click", ()=>{
      els.pills.forEach(x=>x.classList.remove("active"));
      p.classList.add("active");
      activeFilter = p.dataset.filter;
      render(true);
    });
  });
  
  // =======================
  // Init
  // =======================
  showPageLoader();
  buildTabs();
  render(false);
  setTimeout(hidePageLoader, 700);
  