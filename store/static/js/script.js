// Sample product data
const products = [
  {
    id: 1,
    title: "The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "skincare",
    price: 8.50,
    originalPrice: 12.00,
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=500&fit=crop"
    ],
    description: "Brand new, sealed. This serum helps reduce the appearance of blemishes and congestion. Perfect for oily skin types.",
    seller: { name: "SarahBeauty", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", rating: 4.9, reviews: 127 },
    shipping: "Free",
    badge: "New"
  },
  {
    id: 2,
    title: "Charlotte Tilbury Pillow Talk Lipstick",
    brand: "Charlotte Tilbury",
    category: "makeup",
    price: 22.00,
    originalPrice: 34.00,
    condition: "Like new",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=500&fit=crop"
    ],
    description: "Swatched once, basically new. The iconic Pillow Talk shade that suits everyone. Comes with original box.",
    seller: { name: "MakeupLover99", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", rating: 4.8, reviews: 89 },
    shipping: "$3.99",
    badge: null
  },
  {
    id: 3,
    title: "Drunk Elephant C-Firma Day Serum",
    brand: "Drunk Elephant",
    category: "skincare",
    price: 45.00,
    originalPrice: 80.00,
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop"
    ],
    description: "About 70% remaining. This vitamin C serum is amazing for brightening. Stored in fridge to maintain potency.",
    seller: { name: "SkincareJunkie", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", rating: 4.7, reviews: 203 },
    shipping: "$4.99",
    badge: null
  },
  {
    id: 4,
    title: "Olaplex No. 3 Hair Perfector",
    brand: "Olaplex",
    category: "haircare",
    price: 18.00,
    originalPrice: 30.00,
    condition: "New without tags",
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
    ],
    description: "Never used but opened to smell. Repairs and strengthens damaged hair. Full size bottle.",
    seller: { name: "HairCarePro", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", rating: 5.0, reviews: 56 },
    shipping: "Free",
    badge: "Popular"
  },
  {
    id: 5,
    title: "Fenty Beauty Gloss Bomb Universal",
    brand: "Fenty Beauty",
    category: "makeup",
    price: 14.00,
    originalPrice: 21.00,
    condition: "Like new",
    images: [
      "https://images.unsplash.com/photo-1599733594230-6b823cc31b23?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop"
    ],
    description: "Used twice. The perfect universal lip luminizer in the shade Fenty Glow. Non-sticky formula.",
    seller: { name: "GlossQueen", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", rating: 4.6, reviews: 178 },
    shipping: "$2.99",
    badge: null
  },
  {
    id: 6,
    title: "CeraVe Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "skincare",
    price: 10.00,
    originalPrice: 16.00,
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1608979048467-6194bab013f8?w=400&h=500&fit=crop"
    ],
    description: "Brand new in packaging. Gentle, non-foaming cleanser with ceramides and hyaluronic acid. 16oz bottle.",
    seller: { name: "CleanBeauty", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", rating: 4.9, reviews: 312 },
    shipping: "Free",
    badge: "New"
  },
  {
    id: 7,
    title: "Rare Beauty Soft Pinch Liquid Blush",
    brand: "Rare Beauty",
    category: "makeup",
    price: 16.00,
    originalPrice: 23.00,
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop"
    ],
    description: "Shade: Joy. About 80% remaining. A little goes a long way with this highly pigmented blush!",
    seller: { name: "BlushBabe", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", rating: 4.8, reviews: 94 },
    shipping: "$3.49",
    badge: null
  },
  {
    id: 8,
    title: "Dior J'adore Eau de Parfum 50ml",
    brand: "Dior",
    category: "fragrance",
    price: 85.00,
    originalPrice: 135.00,
    condition: "Like new",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop"
    ],
    description: "Sprayed 5 times only. Iconic feminine fragrance with notes of ylang-ylang and rose. Comes with box.",
    seller: { name: "LuxuryScents", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", rating: 5.0, reviews: 67 },
    shipping: "Free",
    badge: "Luxury"
  },
  {
    id: 9,
    title: "Sol de Janeiro Brazilian Bum Bum Cream",
    brand: "Sol de Janeiro",
    category: "bodycare",
    price: 32.00,
    originalPrice: 48.00,
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&h=500&fit=crop"
    ],
    description: "About 60% remaining. The famous bum bum cream with pistachio and salted caramel scent. 240ml jar.",
    seller: { name: "BodyCareAddic", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop", rating: 4.7, reviews: 145 },
    shipping: "$4.99",
    badge: null
  },
  {
    id: 10,
    title: "MAC Ruby Woo Lipstick",
    brand: "MAC",
    category: "makeup",
    price: 12.00,
    originalPrice: 22.00,
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?w=400&h=500&fit=crop"
    ],
    description: "Used several times but still has plenty of product. The iconic red matte lipstick everyone needs.",
    seller: { name: "RedLipLover", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop", rating: 4.5, reviews: 89 },
    shipping: "$2.99",
    badge: null
  },
  {
    id: 11,
    title: "Dyson Airwrap Attachments Set",
    brand: "Dyson",
    category: "tools",
    price: 120.00,
    originalPrice: 200.00,
    condition: "Like new",
    images: [
      "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1629380519372-0d67a98cd3f9?w=400&h=500&fit=crop"
    ],
    description: "Full set of Airwrap attachments including barrels and brush. Used once, in perfect condition.",
    seller: { name: "HairToolsHQ", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop", rating: 4.9, reviews: 234 },
    shipping: "Free",
    badge: "Hot Deal"
  },
  {
    id: 12,
    title: "OPI Nail Lacquer Set (6 colors)",
    brand: "OPI",
    category: "nails",
    price: 28.00,
    originalPrice: 48.00,
    condition: "New",
    images: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=500&fit=crop"
    ],
    description: "Brand new set of 6 OPI nail polishes in popular shades. Perfect for a mini manicure collection.",
    seller: { name: "NailArtist", avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop", rating: 4.8, reviews: 156 },
    shipping: "$3.99",
    badge: "New"
  },
  {
    id: 13,
    title: "Paula's Choice 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "skincare",
    price: 22.00,
    originalPrice: 35.00,
    condition: "New without tags",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop"
    ],
    description: "Full size 118ml bottle, unopened but no box. Cult favorite salicylic acid exfoliant for smooth skin.",
    seller: { name: "AcidQueen", avatar: "https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=100&h=100&fit=crop", rating: 4.9, reviews: 278 },
    shipping: "Free",
    badge: "Popular"
  },
  {
    id: 14,
    title: "NARS Orgasm Blush",
    brand: "NARS",
    category: "makeup",
    price: 20.00,
    originalPrice: 32.00,
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1599733594230-6b823cc31b23?w=400&h=500&fit=crop"
    ],
    description: "Small dip in the middle but lots of product left. The bestselling peachy-pink blush with golden shimmer.",
    seller: { name: "BlushCollector", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", rating: 4.6, reviews: 112 },
    shipping: "$3.49",
    badge: null
  },
  {
    id: 15,
    title: "Moroccanoil Treatment Original 100ml",
    brand: "Moroccanoil",
    category: "haircare",
    price: 28.00,
    originalPrice: 48.00,
    condition: "Like new",
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1597354984706-fac992d9306f?w=400&h=500&fit=crop"
    ],
    description: "95% full. The iconic argan oil treatment that transforms your hair. Original scent.",
    seller: { name: "HairOilAddict", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop", rating: 4.8, reviews: 189 },
    shipping: "$3.99",
    badge: null
  },
  {
    id: 16,
    title: "Chanel Coco Mademoiselle 100ml",
    brand: "Chanel",
    category: "fragrance",
    price: 110.00,
    originalPrice: 165.00,
    condition: "Like new",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop"
    ],
    description: "About 90% remaining. The modern classic fragrance with orange, rose, and patchouli notes.",
    seller: { name: "ChanelLover", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", rating: 5.0, reviews: 98 },
    shipping: "Free",
    badge: "Luxury"
  }
];

// ─── Persistent State via localStorage ───────────────────────────────────────

function loadState() {
  try {
    return {
      favourites: new Set(JSON.parse(localStorage.getItem('gm_favourites') || '[]')),
      cart: JSON.parse(localStorage.getItem('gm_cart') || '[]'),
      viewingHistory: JSON.parse(localStorage.getItem('gm_history') || '[]'),
    };
  } catch {
    return { favourites: new Set(), cart: [], viewingHistory: [] };
  }
}

function saveState() {
  localStorage.setItem('gm_favourites', JSON.stringify([...state.favourites]));
  localStorage.setItem('gm_cart', JSON.stringify(state.cart));
  localStorage.setItem('gm_history', JSON.stringify(state.viewingHistory));
}

let state = loadState();

// Reviews (static — not persisted)
const userReviews = [
  { productId: 1,  rating: 5, text: "Amazing serum! My skin has never looked better. Highly recommend for anyone with oily or acne-prone skin.", date: "March 15, 2024" },
  { productId: 4,  rating: 5, text: "Olaplex is a game changer! My bleached hair feels so much stronger and healthier after using this.", date: "March 10, 2024" },
  { productId: 6,  rating: 4, text: "Great gentle cleanser. Does not strip the skin at all. Perfect for my dry, sensitive skin.", date: "February 28, 2024" },
  { productId: 8,  rating: 5, text: "J adore is absolutely stunning! Long lasting and the scent is so elegant and feminine.", date: "February 20, 2024" },
  { productId: 2,  rating: 4, text: "The Pillow Talk shade is beautiful! Very flattering on most skin tones. The formula is a bit drying though.", date: "February 15, 2024" },
  { productId: 13, rating: 5, text: "Holy grail exfoliant! Makes my skin so smooth and really helps with congestion and blackheads.", date: "January 30, 2024" },
  { productId: 15, rating: 4, text: "Smells amazing and makes my hair so shiny. A little goes a long way!", date: "January 22, 2024" },
  { productId: 5,  rating: 5, text: "The best lip gloss ever! Non-sticky, beautiful shine, and the shade works on everyone.", date: "January 15, 2024" }
];

// ─── Navigation ───────────────────────────────────────────────────────────────

function navigateTo(page, productId = null) {
  if (page === 'product' && productId) {
    localStorage.setItem('gm_currentProduct', productId);
    window.location.href = 'product.html';
  } else if (page === 'home') {
    window.location.href = 'index.html';
  } else {
    window.location.href = `${page}.html`;
  }
}

// ─── Shared Utilities ─────────────────────────────────────────────────────────

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 200); }, 3000);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating
      ? `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
      : `<svg viewBox="0 0 24 24" class="empty"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }
  return stars;
}

function updateBadges() {
  const favBadge = document.getElementById('favouritesBadge');
  const cartBadge = document.getElementById('cartBadge');
  if (favBadge) {
    favBadge.textContent = state.favourites.size;
    favBadge.style.display = state.favourites.size > 0 ? 'flex' : 'none';
  }
  if (cartBadge) {
    cartBadge.textContent = state.cart.length;
    cartBadge.style.display = state.cart.length > 0 ? 'flex' : 'none';
  }
}

function toggleFavourite(id, btn) {
  if (state.favourites.has(id)) {
    state.favourites.delete(id);
    btn?.classList.remove('active');
    showToast('Removed from favourites');
  } else {
    state.favourites.add(id);
    btn?.classList.add('active');
    showToast('Added to favourites');
  }
  saveState();
  updateBadges();
}

function addToCart(id) {
  if (!state.cart.find(item => item.id === id)) {
    state.cart.push({ id });
    saveState();
    updateBadges();
    showToast('Added to cart');
  } else {
    showToast('Item already in cart');
  }
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveState();
  updateBadges();
  showToast('Removed from cart');
}

function addToHistory(productId) {
  state.viewingHistory = state.viewingHistory.filter(h => h.productId !== productId);
  state.viewingHistory.unshift({
    productId,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });
  if (state.viewingHistory.length > 20) state.viewingHistory = state.viewingHistory.slice(0, 20);
  saveState();
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function createProductCard(product) {
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="product-favourite ${state.favourites.has(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Add to favourites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-meta">
          <span class="product-brand">${product.brand}</span>
          <span class="product-condition">${product.condition}</span>
        </div>
      </div>
    </article>
  `;
}

function attachProductCardListeners(container) {
  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.product-favourite') && !e.target.closest('.wishlist-remove')) {
        navigateTo('product', parseInt(card.dataset.id));
      }
    });
  });
  container.querySelectorAll('.product-favourite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavourite(parseInt(btn.dataset.id), btn);
    });
  });
}

// ─── Shared Header Listeners ──────────────────────────────────────────────────

function setupSharedListeners() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }

  // Escape key closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu) mobileMenu.classList.remove('open');
  });
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function initHomePage() {
  let filteredProducts = [...products];
  let currentCategory = 'all';

  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const resultsCount = document.getElementById('resultsCount');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const filtersSidebar = document.getElementById('filtersSidebar');

  function renderProducts() {
    productsGrid.innerHTML = filteredProducts.map(p => createProductCard(p)).join('');
    resultsCount.textContent = filteredProducts.length;
    attachProductCardListeners(productsGrid);
  }

  function sortProducts() {
    switch (sortSelect.value) {
      case 'newest':    filteredProducts.sort((a, b) => b.id - a.id); break;
      case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
      case 'price-high':filteredProducts.sort((a, b) => b.price - a.price); break;
    }
  }

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('#filter-categories input:checked')).map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('priceMin').value) || 0;
    const maxPrice = parseFloat(document.getElementById('priceMax').value) || Infinity;
    const freeShipping = document.querySelector('#filter-shipping input[value="free"]')?.checked;

    filteredProducts = products.filter(p => {
      if (searchTerm && !p.title.toLowerCase().includes(searchTerm) && !p.brand.toLowerCase().includes(searchTerm)) return false;
      if (currentCategory !== 'all' && p.category !== currentCategory) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (freeShipping && p.shipping !== 'Free') return false;
      return true;
    });

    sortProducts();
    renderProducts();
  }

  function clearFilters() {
    searchInput.value = '';
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    currentCategory = 'all';
    filteredProducts = [...products];
    renderProducts();
    showToast('Filters cleared');
  }

  // Category buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      filterProducts();
    });
  });

  // Filter toggles (collapse/expand)
  document.querySelectorAll('.filter-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('collapsed');
      toggle.nextElementSibling.classList.toggle('open');
    });
  });

  // Filter inputs
  document.querySelectorAll('.filters-sidebar input').forEach(input => {
    input.addEventListener('change', filterProducts);
  });

  // Search
  searchInput.addEventListener('input', debounce(filterProducts, 300));

  // Sort
  sortSelect.addEventListener('change', () => { sortProducts(); renderProducts(); });

  // Clear filters
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

  // Load more
  document.getElementById('loadMoreBtn').addEventListener('click', () => showToast('All products loaded!'));

  // Filters sidebar toggle (mobile)
  const filtersToggleBtn = document.getElementById('filtersToggleBtn');
  if (filtersToggleBtn && filtersSidebar) {
    filtersToggleBtn.addEventListener('click', () => {
      filtersSidebar.classList.toggle('open');
      document.body.style.overflow = filtersSidebar.classList.contains('open') ? 'hidden' : '';
    });
    filtersSidebar.addEventListener('click', (e) => {
      if (e.target === filtersSidebar) {
        filtersSidebar.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        filtersSidebar.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  renderProducts();
}

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────

function initProductPage() {
  const productId = parseInt(localStorage.getItem('gm_currentProduct'));
  if (!productId) { window.location.href = 'index.html'; return; }

  const product = products.find(p => p.id === productId);
  if (!product) { window.location.href = 'index.html'; return; }

  addToHistory(productId);

  // Populate fields
  document.getElementById('productMainImage').src = product.images[0];
  document.getElementById('productMainImage').alt = product.title;
  document.getElementById('productThumbnails').innerHTML = product.images.map((img, i) => `
    <div class="product-thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">
      <img src="${img}" alt="${product.title} ${i + 1}">
    </div>
  `).join('');
  document.getElementById('productSellerAvatar').src = product.seller.avatar;
  document.getElementById('productSellerName').textContent = product.seller.name;
  document.getElementById('productSellerRating').textContent = `${product.seller.rating} (${product.seller.reviews} reviews)`;
  document.getElementById('productDetailTitle').textContent = product.title;
  document.getElementById('productDetailPrice').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('productOriginalPrice').textContent = `$${product.originalPrice.toFixed(2)}`;
  document.getElementById('productDetailBrand').textContent = product.brand;
  document.getElementById('productDetailCondition').textContent = product.condition;
  document.getElementById('productDetailDescription').textContent = product.description;
  document.getElementById('productDetailShipping').textContent = product.shipping;

  // Favourite button state
  const favBtn = document.getElementById('favouriteDetailBtn');
  favBtn.classList.toggle('active', state.favourites.has(productId));

  // Thumbnail switcher
  document.querySelectorAll('.product-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.getElementById('productMainImage').src = product.images[parseInt(thumb.dataset.index)];
      document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Action buttons
  document.getElementById('backFromProduct').addEventListener('click', () => window.location.href = 'index.html');
  document.getElementById('addToCartBtn').addEventListener('click', () => addToCart(productId));
  document.getElementById('buyNowBtn').addEventListener('click', () => { addToCart(productId); window.location.href = 'cart.html'; });
  favBtn.addEventListener('click', () => { toggleFavourite(productId, favBtn); });

  // Similar products
  const similar = products.filter(p => p.category === product.category && p.id !== productId).slice(0, 4);
  const similarGrid = document.getElementById('similarProductsGrid');
  similarGrid.innerHTML = similar.map(p => createProductCard(p)).join('');
  attachProductCardListeners(similarGrid);
}

// ─── FAVOURITES PAGE ──────────────────────────────────────────────────────────

function initFavouritesPage() {
  const grid = document.getElementById('favouritesGrid');
  const emptyState = document.getElementById('emptyFavourites');
  const countEl = document.getElementById('favouritesCount');

  function render() {
    const favProducts = products.filter(p => state.favourites.has(p.id));
    countEl.textContent = `${favProducts.length} items saved`;

    if (favProducts.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'flex';
    } else {
      grid.style.display = 'grid';
      emptyState.style.display = 'none';
      grid.innerHTML = favProducts.map(p => createProductCard(p)).join('');
      attachProductCardListeners(grid);
      // Re-render when unfavouriting from this page
      grid.querySelectorAll('.product-favourite').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavourite(parseInt(btn.dataset.id), btn);
          render();
        });
      });
    }
  }

  render();
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────

function initCartPage() {
  function render() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    const cartCount = document.getElementById('cartItemsCount');

    cartCount.textContent = `${state.cart.length} items`;

    if (state.cart.length === 0) {
      cartItemsEl.innerHTML = '';
      cartSummary.style.display = 'none';
      emptyCart.style.display = 'flex';
      return;
    }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItemsEl.innerHTML = state.cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="cart-item-image">
            <img src="${p.images[0]}" alt="${p.title}">
          </div>
          <div class="cart-item-details">
            <h3 class="cart-item-title">${p.title}</h3>
            <p class="cart-item-brand">${p.brand}</p>
            <span class="cart-item-condition">${p.condition}</span>
            <div class="cart-item-price">$${p.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-actions">
            <button class="remove-item-btn" data-id="${p.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const subtotal = state.cart.reduce((sum, item) => {
      const p = products.find(prod => prod.id === item.id);
      return sum + p.price;
    }, 0);
    const shippingTotal = state.cart.reduce((sum, item) => {
      const p = products.find(prod => prod.id === item.id);
      return sum + (p.shipping === 'Free' ? 0 : parseFloat(p.shipping.replace('$', '')));
    }, 0);

    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartShippingTotal').textContent = shippingTotal === 0 ? 'Free' : `$${shippingTotal.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${(subtotal + shippingTotal).toFixed(2)}`;

    cartItemsEl.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(parseInt(btn.dataset.id));
        render();
      });
    });
  }

  document.getElementById('checkoutBtn').addEventListener('click', () => showToast('Proceeding to checkout...'));
  render();
}

// ─── CHATBOT PAGE ─────────────────────────────────────────────────────────────

const chatResponses = {
  skincare: 'I would love to help you find the perfect skincare products! Based on our top-rated items, I recommend checking out The Ordinary Niacinamide for blemish-prone skin, or CeraVe Hydrating Cleanser for a gentle cleanse. What is your main skin concern?',
  find: 'Sure! I can help you find any beauty product. What are you looking for? You can tell me the brand, product type, or what skin/hair concern you want to address.',
  deals: 'Great question! Right now we have some amazing deals: Drunk Elephant C-Firma Serum at 44% off, Olaplex No.3 at 40% off, and Dyson Airwrap attachments at 40% off. Would you like me to show you more deals in a specific category?',
  shipping: 'We offer several shipping options! Many items qualify for free shipping. Standard shipping typically takes 3-5 business days. Express shipping is available for an additional fee.',
  makeup: 'We have a fantastic selection of makeup! From Charlotte Tilbury lipsticks to Fenty Beauty glosses and NARS blushes. What type of makeup product are you interested in?',
  hair: 'Looking for haircare? We have popular items like Olaplex treatments and Moroccanoil. What is your main hair concern — damage repair, shine, or something else?',
  fragrance: "We have beautiful fragrances available including Dior J'adore and Chanel Coco Mademoiselle at great prices. Are you looking for something fresh, floral, or more intense?",
  default: 'I am here to help you find amazing beauty products. You can ask me about skincare recommendations, finding specific products, our best deals, or shipping information. How can I assist you today?'
};

function getBotResponse(message) {
  const m = message.toLowerCase();
  if (m.includes('skincare') || m.includes('skin')) return chatResponses.skincare;
  if (m.includes('find') || m.includes('looking for') || m.includes('search')) return chatResponses.find;
  if (m.includes('deal') || m.includes('discount') || m.includes('sale')) return chatResponses.deals;
  if (m.includes('ship') || m.includes('delivery')) return chatResponses.shipping;
  if (m.includes('makeup')) return chatResponses.makeup;
  if (m.includes('hair')) return chatResponses.hair;
  if (m.includes('fragrance') || m.includes('perfume')) return chatResponses.fragrance;
  if (m.includes('thank')) return 'You are welcome! Is there anything else I can help you with today?';
  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return 'Hello! Welcome to GlowMarket. I am here to help you find amazing beauty products. What can I assist you with today?';
  return chatResponses.default;
}

function initChatbotPage() {
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  function addMessage(message, isUser = false) {
    const div = document.createElement('div');
    div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    div.innerHTML = `
      <div class="message-avatar">
        ${isUser
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`
        }
      </div>
      <div class="message-content"><p>${message}</p></div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </div>
      <div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
  }

  function sendMessage(message) {
    addMessage(message, true);
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(getBotResponse(message));
    }, 1000 + Math.random() * 1000);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) { chatInput.value = ''; sendMessage(message); }
  });

  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.message));
  });
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────

function initProfilePage() {
  document.getElementById('profileSavedCount').textContent = state.favourites.size;
  document.getElementById('profileReviewsCount').textContent = userReviews.length;

  // Recommended tab
  const recommendedGrid = document.getElementById('recommendedGrid');
  const recommended = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
  recommendedGrid.innerHTML = recommended.map(p => createProductCard(p)).join('');
  attachProductCardListeners(recommendedGrid);

  // Wishlist tab
  renderWishlistTab();

  // History tab
  renderHistoryTab();

  // Reviews tab
  renderReviewsTab();

  // Tab switching
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

function renderWishlistTab() {
  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('emptyWishlist');
  const wishlistProducts = products.filter(p => state.favourites.has(p.id));

  if (wishlistProducts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  grid.innerHTML = wishlistProducts.map(p => `
    <article class="product-card wishlist-card" data-id="${p.id}">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="wishlist-remove product-favourite active" data-id="${p.id}" aria-label="Remove from wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <h3 class="product-title">${p.title}</h3>
        <div class="product-meta">
          <span class="product-brand">${p.brand}</span>
          <span class="product-condition">${p.condition}</span>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.wishlist-remove')) navigateTo('product', parseInt(card.dataset.id));
    });
  });

  grid.querySelectorAll('.wishlist-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavourite(parseInt(btn.dataset.id));
      renderWishlistTab();
      document.getElementById('profileSavedCount').textContent = state.favourites.size;
    });
  });
}

function renderHistoryTab() {
  const list = document.getElementById('historyList');
  const emptyState = document.getElementById('emptyHistory');

  if (state.viewingHistory.length === 0) {
    list.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  list.style.display = 'flex';
  emptyState.style.display = 'none';
  list.innerHTML = state.viewingHistory.map(h => {
    const product = products.find(p => p.id === h.productId);
    if (!product) return '';
    const review = userReviews.find(r => r.productId === h.productId);
    return `
      <div class="history-item" data-id="${product.id}">
        <div class="history-image"><img src="${product.images[0]}" alt="${product.title}"></div>
        <div class="history-details">
          <h3 class="history-title">${product.title}</h3>
          <p class="history-date">Viewed: ${h.date}</p>
        </div>
        ${review ? `<div class="history-rating">${generateStars(review.rating)}</div>` : ''}
      </div>
    `;
  }).join('');

  list.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => navigateTo('product', parseInt(item.dataset.id)));
  });
}

function renderReviewsTab() {
  const list = document.getElementById('reviewsList');
  const emptyState = document.getElementById('emptyReviews');

  if (userReviews.length === 0) {
    list.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  list.style.display = 'flex';
  emptyState.style.display = 'none';
  list.innerHTML = userReviews.map(review => {
    const product = products.find(p => p.id === review.productId);
    if (!product) return '';
    return `
      <div class="review-card">
        <div class="review-product-image" data-id="${product.id}" style="cursor:pointer;">
          <img src="${product.images[0]}" alt="${product.title}">
        </div>
        <div class="review-content">
          <h3 class="review-product-name">${product.title}</h3>
          <div class="review-rating">${generateStars(review.rating)}</div>
          <p class="review-text">${review.text}</p>
          <span class="review-date">${review.date}</span>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.review-product-image').forEach(img => {
    img.addEventListener('click', () => navigateTo('product', parseInt(img.dataset.id)));
  });
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  updateBadges();
  setupSharedListeners();

  switch (page) {
    case 'home':       initHomePage();       break;
    case 'product':    initProductPage();    break;
    case 'favourites': initFavouritesPage(); break;
    case 'cart':       initCartPage();       break;
    case 'chatbot':    initChatbotPage();    break;
    case 'profile':    initProfilePage();    break;
  }
});
