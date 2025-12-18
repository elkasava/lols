/** * TRADITIONAL RECORDS - CORE ENGINE V38.0 (AGENDA FIX) **/

// 1. DATA LAYER
const MOCK_DB = {
    releases: [
        { id: 1, artist: "PAWANA", title: "Erome Pawana Sewa Imyero", type: "VINYL - LP", price: 25.00, img: "cd1.jpg", desc: "Een unieke mix van traditionele klanken en moderne beats." },
        { id: 2, artist: "FAJA WOWIA", title: "Sama Toli", type: "CD ALBUM", price: 22.50, img: "cd2.jpg", desc: "Faja Wowia brengt vuur met Sama Toli." },
        { id: 3, artist: "STIMOFO", title: "Fodu Yowé", type: "DIGITAL", price: 12.95, img: "cd3.jpg", desc: "DE BESTE WINTI BAND VAN SURINAME. Nu op vinyl." },
        { id: 4, artist: "PAPA TOUWTJIE", title: "The Legend 4 ever", type: "CD ALBUM", price: 20.00, img: "cd4.jpg", desc: "De legende leeft voort." },
        { id: 5, artist: "THE MESSENGERS", title: "Wang Gado De", type: "CASSETTE", price: 18.50, img: "cd5.jpg", desc: "Spirituele klanken." }
    ],
    merch: [
        { id: 101, title: "LIMITED 'UNITY' JACKET", price: 120.00, img: "1.webp", badge: "LOW STOCK", desc: "Heavyweight canvas jacket met geborduurd ruglogo." },
        { id: 102, title: "SIGNATURE HOODIE - ONYX", price: 85.00, img: "2.webp", desc: "Premium katoen, oversized fit." },
        { id: 103, title: "ESSENTIAL TEE - BONE", price: 45.00, img: "3.webp", badge: "NEW", desc: "Zwaargewicht t-shirt met subtiele print." },
        { id: 104, title: "TOUR CAP 2026", price: 35.00, img: "4.webp", desc: "Verstelbare dad cap met 3D borduursel." },
        { id: 105, title: "VINYL TOTE BAG", price: 25.00, img: "5.webp", desc: "Stevige katoenen tas." }
    ],
    events: [
        { day: "12", month: "MRT", year: "2025", artist: "PAWANA", venue: "PARADISO", city: "AMSTERDAM", link: "#" },
        { day: "28", month: "MRT", year: "2025", artist: "FAJA WOWIA", venue: "TIVOLI VREDENBURG", city: "UTRECHT", link: "#" },
        { day: "05", month: "APR", year: "2025", artist: "STIMOFO", venue: "013", city: "TILBURG", link: "#" }
    ]
};

const API = {
    async getData() { return new Promise(resolve => setTimeout(() => resolve(MOCK_DB), 300)); }
};

// 2. STATE & INIT
let globalCatalog = []; 
const currency = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await API.getData();
        globalCatalog = [...data.releases, ...data.merch];

        Modules.Render.releases(data.releases);
        Modules.Render.merch(data.merch); 
        Modules.Render.agenda(data.events); 
    } catch (e) { console.error("Data error", e); }

    Modules.Cart.init();
    Modules.Search.init();
    Modules.Mobile.init();
    Modules.UX.init();
    Modules.Carousel.init();
    Modules.Effects.init(); 
});

// 3. MODULES
const Modules = {
    Render: {
        releases(items) {
            const el = document.getElementById('releasesGrid');
            if(el) el.innerHTML = items.map(i => `<div class="release-card hover-target" onclick="Modules.UI.openModal(${i.id})"><div class="card-img-container"><img src="${i.img}" loading="lazy"></div><div class="card-info"><h3>${i.artist}</h3><p>${i.title}</p></div></div>`).join('');
        },
        merch(items) {
            const el = document.getElementById('merchTrack');
            if(el) el.innerHTML = items.map(i => `
                <div class="merch-carousel-item hover-target" onclick="Modules.UI.openModal(${i.id})">
                    ${i.badge ? `<span class="scarcity-badge">${i.badge}</span>` : ''}
                    <div class="merch-carousel-img"><img src="${i.img}" loading="lazy"></div>
                    <div class="merch-carousel-info"><h3>${i.title}</h3><p>${currency.format(i.price)}</p></div>
                </div>`).join('');
        },
        agenda(items) {
            const el = document.getElementById('agendaList');
            if(el) el.innerHTML = items.map(e => `<div class="agenda-item-classic hover-target"><div class="agenda-date-box"><span class="agenda-day">${e.day}</span><span class="agenda-month">${e.month}</span></div><div class="agenda-details"><h3>${e.artist}</h3><p>${e.venue} // ${e.city}</p></div><a href="${e.link}" class="ticket-btn-classic hover-target">TICKETS</a></div>`).join('');
        }
    },
    Effects: {
        init() {
            // Custom Cursor Logic
            const cursor = document.getElementById('cursor');
            const hoverTargets = document.querySelectorAll('.hover-target, a, button');
            
            document.addEventListener('mousemove', (e) => {
                if(window.innerWidth > 900) {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                }
            });

            document.body.addEventListener('mouseover', (e) => {
                if(e.target.closest('.hover-target') || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    cursor.classList.add('hovered');
                } else {
                    cursor.classList.remove('hovered');
                }
            });

            // UPDATED: Parallax & Soft Fade Hero
            const heroText = document.getElementById('heroText');
            window.addEventListener('scroll', () => {
                if(window.innerWidth > 900) {
                    const scrollY = window.scrollY;
                    const translateY = scrollY * 0.3;
                    const opacity = 1 - (scrollY / 600);
                    
                    heroText.style.transform = `translateY(${translateY}px)`;
                    heroText.style.opacity = Math.max(0, opacity); 
                }
            });
        }
    },
    Carousel: {
        init() {
            const track = document.getElementById('merchTrack');
            const prev = document.getElementById('merchPrevBtn');
            const next = document.getElementById('merchNextBtn');
            if(!track) return;
            const scroll = track.offsetWidth / 3;
            next?.addEventListener('click', () => track.scrollBy({ left: scroll, behavior: 'smooth' }));
            prev?.addEventListener('click', () => track.scrollBy({ left: -scroll, behavior: 'smooth' }));
        }
    },
    Cart: {
        items: JSON.parse(localStorage.getItem('myCart')) || [],
        init() { this.updateBadge(); },
        add(p) { const ex = this.items.find(i => i.id === p.id); ex ? ex.qty += p.qty : this.items.push(p); this.save(); },
        save() { localStorage.setItem('myCart', JSON.stringify(this.items)); this.updateBadge(); Modules.UI.renderCart(); },
        updateBadge() { const b = document.getElementById('cartCountBadge'); const t = this.items.reduce((s, i) => s + i.qty, 0); if(b) { b.innerText = t; b.style.display = t > 0 ? 'flex' : 'none'; } }
    },
    Search: {
        init() {
            const box = document.getElementById('searchContainer'), inp = document.getElementById('searchInput'), res = document.getElementById('searchResults');
            document.getElementById('toggleSearchBtn')?.addEventListener('click', (e) => { e.preventDefault(); box.classList.toggle('active'); if(box.classList.contains('active')) inp.focus(); });
            document.getElementById('closeSearch')?.addEventListener('click', () => box.classList.remove('active'));
            inp?.addEventListener('keyup', (e) => {
                const term = e.target.value.toLowerCase();
                if(term.length < 2) { res.classList.remove('active'); return; }
                const hits = globalCatalog.filter(x => x.title.toLowerCase().includes(term) || (x.artist && x.artist.toLowerCase().includes(term)));
                res.innerHTML = hits.length ? hits.map(h => `<div class="search-result-item" onclick="Modules.UI.openModal(${h.id})"><img src="${h.img}"><div><h4>${h.title || h.artist}</h4></div></div>`).join('') : '<div style="padding:15px; text-align:center;">Geen resultaten</div>';
                res.classList.add('active');
            });
        }
    },
    Mobile: {
        init() {
            const btn = document.getElementById('hamburgerBtn'), menu = document.getElementById('navMenu');
            btn?.addEventListener('click', () => { btn.classList.toggle('active'); menu.classList.toggle('active'); });
        }
    },
    UX: {
        init() {
            const nav = document.querySelector('.navbar');
            window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
            
            const obs = new IntersectionObserver(es => es.forEach(e => { 
                if(e.isIntersecting) {
                    e.target.classList.add('active');
                    const vinyl = e.target.querySelector('.decor-vinyl');
                    if(vinyl) vinyl.classList.add('visible');
                }
            }), { threshold: 0.2 });
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
            document.querySelectorAll('.close-modal, #continueShopping').forEach(b => b.addEventListener('click', Modules.UI.closeModals));
            document.getElementById('openCartBtn')?.addEventListener('click', (e) => { e.preventDefault(); Modules.UI.openCart(); });
            
            const qty = document.getElementById('modalQty');
            document.querySelector('button[data-action="increase"]')?.addEventListener('click', () => qty.value++);
            document.querySelector('button[data-action="decrease"]')?.addEventListener('click', () => { if(qty.value > 1) qty.value--; });
            document.getElementById('addToCartBtn')?.addEventListener('click', () => {
                const id = document.getElementById('addToCartBtn').dataset.id;
                const p = globalCatalog.find(x => x.id == id);
                if(p) { Modules.Cart.add({ ...p, qty: parseInt(qty.value) }); Modules.UI.closeModals(); Modules.UI.openCart(); }
            });
        }
    },
    UI: {
        modals: { p: document.getElementById('productModal'), c: document.getElementById('cartModal') },
        openModal(id) {
            const p = globalCatalog.find(x => x.id == id);
            if(!p) return;
            document.getElementById('modalImg').src = p.img;
            document.getElementById('modalArtist').innerText = p.artist || "TRADITIONAL RECORDS";
            document.getElementById('modalTitle').innerText = p.title;
            document.getElementById('modalPrice').innerText = currency.format(p.price);
            document.getElementById('addToCartBtn').dataset.id = id;
            document.getElementById('modalQty').value = 1;
            this.modals.p.style.display = 'flex';
        },
        openCart() { this.renderCart(); this.modals.c.style.display = 'flex'; },
        closeModals() { document.getElementById('productModal').style.display = 'none'; document.getElementById('cartModal').style.display = 'none'; },
        renderCart() {
            const c = document.getElementById('cartItemsContainer');
            if(!c) return;
            c.innerHTML = Modules.Cart.items.map(i => `<div class="cart-item" style="margin-bottom: 20px;"><img src="${i.img}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; float: left;"><div><h4 style="margin: 0;">${i.title || i.artist}</h4><p style="margin: 0; color: #666;">x${i.qty} - ${currency.format(i.price * i.qty)}</p></div><div style="clear: both;"></div></div>`).join('');
            
            // NaN FIX
            const total = Modules.Cart.items.reduce((s, i) => s + (Number(i.price) * i.qty), 0);
            document.getElementById('cartTotalPrice').innerText = currency.format(total);
        }
    }
};