(() => {
  "use strict";

  const data = window.SUGAR_HOUSE_DATA;
  if (!data) return;

  const business = data.business;
  const byId = (id) => document.getElementById(id);
  const money = (amount) => new Intl.NumberFormat("ar-EG", {
    style: "currency", currency: business.currency, currencyDisplay: "symbol", maximumFractionDigits: 0
  }).format(amount);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const imageUrl = (key, width = 900) => {
    const source = data.images[key] || data.images.dessert;
    try {
      const url = new URL(source);
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", width > 1100 ? "82" : "78");
      return url.href;
    } catch {
      return source;
    }
  };
  const imageMarkup = (key, alt, className = "", width = 900, loading = "lazy") => `
    <div class="image-frame ${className}">
      <img src="${escapeHtml(imageUrl(key, width))}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async">
      <span class="image-fallback" aria-hidden="true"><span>✿</span></span>
    </div>`;

  const state = {
    activeCategory: "all",
    query: "",
    sort: "featured",
    cart: loadCart(),
    toastTimer: 0,
    lastFocus: null
  };

  function loadCart() {
    try {
      const stored = JSON.parse(localStorage.getItem("sugar-house-cart-v1") || "{}");
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
      return Object.fromEntries(Object.entries(stored)
        .filter(([id, qty]) => data.products.some((product) => product.id === id) && Number.isInteger(qty) && qty > 0)
        .map(([id, qty]) => [id, Math.min(qty, 99)]));
    } catch {
      return {};
    }
  }

  function saveCart() {
    try { localStorage.setItem("sugar-house-cart-v1", JSON.stringify(state.cart)); } catch { /* storage may be disabled */ }
  }

  function renderCategories() {
    byId("category-grid").innerHTML = data.categories.map((category) => `
      <a class="category-card image-frame" href="#products" data-category-link="${escapeHtml(category.id)}" aria-label="تصفح ${escapeHtml(category.name)}">
        <img src="${escapeHtml(imageUrl(category.image, 800))}" alt="" loading="lazy" decoding="async">
        <span class="image-fallback" aria-hidden="true"><span>✿</span></span>
        <span class="category-card__copy"><span><small>${escapeHtml(category.note)}</small><strong>${escapeHtml(category.name)}</strong></span><span class="category-card__arrow" aria-hidden="true">↙</span></span>
      </a>`).join("");

    byId("filter-pills").innerHTML = [
      { id: "all", name: "كل المنتجات" },
      ...data.categories.map(({ id, name }) => ({ id, name }))
    ].map(({ id, name }) => `
      <button class="filter-pill${id === "all" ? " is-active" : ""}" type="button" data-filter="${escapeHtml(id)}" aria-pressed="${id === "all"}">${escapeHtml(name)}</button>`).join("");
  }

  function renderProducts() {
    const query = state.query.trim().toLocaleLowerCase("ar");
    let products = data.products.filter((product) => {
      const matchesCategory = state.activeCategory === "all" || (product.categories || [product.category]).includes(state.activeCategory);
      const searchText = `${product.name} ${product.description} ${product.categoryLabel}`.toLocaleLowerCase("ar");
      return matchesCategory && (!query || searchText.includes(query));
    });
    if (state.sort === "low") products = [...products].sort((a, b) => a.price - b.price);
    if (state.sort === "high") products = [...products].sort((a, b) => b.price - a.price);

    byId("product-grid").innerHTML = products.map((product) => `
      <article class="product-card">
        <div class="product-card__image image-frame">
          <img src="${escapeHtml(imageUrl(product.image, 780))}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async">
          <span class="image-fallback" aria-hidden="true"><span>✿</span></span>
          ${product.popular ? '<span class="product-badge">الأكثر طلبًا</span>' : ""}
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${escapeHtml(product.categoryLabel)}</span>
          <h3>${escapeHtml(product.name)}</h3>
          <p class="product-card__description">${escapeHtml(product.description)}</p>
          <div class="product-card__bottom"><span class="product-price">${money(product.price)}</span>
            <button class="add-to-cart" type="button" data-add="${escapeHtml(product.id)}" aria-label="أضف ${escapeHtml(product.name)} إلى السلة">+</button>
          </div>
        </div>
      </article>`).join("");
    byId("empty-state").hidden = products.length !== 0;
  }

  function renderOffers() {
    byId("offers-grid").innerHTML = data.offers.map((offer, index) => `
      <article class="offer-card">
        <div class="offer-card__image image-frame">
          <img src="${escapeHtml(imageUrl(offer.image, 900))}" alt="${escapeHtml(offer.title)}" loading="lazy" decoding="async">
          <span class="image-fallback" aria-hidden="true"><span>✿</span></span>
          <span class="offer-card__badge">${escapeHtml(offer.label)}</span>
        </div>
        <div class="offer-card__copy"><small>${escapeHtml(offer.kicker)}</small><h3>${escapeHtml(offer.title)}</h3><p>${escapeHtml(offer.detail)}</p>
          ${offer.price ? `<div class="offer-price">${money(offer.price)} <del>${money(offer.oldPrice)}</del></div>` : '<div class="offer-price"><em>خصم تجريبي 15%</em></div>'}
          <a class="button button--dark" href="#" data-whatsapp="offer-${index}">${escapeHtml(offer.cta)} <span aria-hidden="true">↗</span></a>
        </div>
      </article>`).join("");
  }

  function renderFeatures() {
    byId("feature-grid").innerHTML = data.features.map((feature) => `
      <article class="feature-card"><span class="feature-icon" aria-hidden="true">${escapeHtml(feature.icon)}</span><h3>${escapeHtml(feature.title)}</h3><p>${escapeHtml(feature.text)}</p></article>`).join("");
  }

  function renderReviews() {
    byId("review-grid").innerHTML = data.reviews.map((review) => `
      <article class="review-card"><span class="review-quote" aria-hidden="true">“</span><div class="review-stars" aria-label="تقييم تجريبي خمس نجوم">★★★★★</div>
        <blockquote>${escapeHtml(review.text)}</blockquote><div class="review-person"><span class="review-avatar" aria-hidden="true">${escapeHtml(review.initials)}</span><span><strong>${escapeHtml(review.name)}</strong><small>رأي تجريبي للعرض</small></span></div>
      </article>`).join("");
  }

  function renderCart() {
    const entries = Object.entries(state.cart)
      .map(([id, qty]) => ({ product: data.products.find((product) => product.id === id), qty }))
      .filter((entry) => entry.product && entry.qty > 0);
    const totalQty = entries.reduce((sum, entry) => sum + entry.qty, 0);
    const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.qty, 0);
    document.querySelectorAll(".cart-count").forEach((count) => { count.textContent = totalQty > 99 ? "99+" : String(totalQty); });
    byId("cart-total").textContent = money(total);
    byId("cart-body").innerHTML = entries.length ? entries.map(({ product, qty }) => `
      <article class="cart-line" data-cart-line="${escapeHtml(product.id)}">
        <div class="cart-line__image image-frame"><img src="${escapeHtml(imageUrl(product.image, 180))}" alt="" loading="lazy"><span class="image-fallback" aria-hidden="true"><span>✿</span></span></div>
        <div class="cart-line__copy"><strong>${escapeHtml(product.name)}</strong><small>${money(product.price)}</small>
          <div class="quantity-control" aria-label="الكمية"><button type="button" data-qty="minus" data-id="${escapeHtml(product.id)}" aria-label="تقليل كمية ${escapeHtml(product.name)}">−</button><span>${qty}</span><button type="button" data-qty="plus" data-id="${escapeHtml(product.id)}" aria-label="زيادة كمية ${escapeHtml(product.name)}">+</button></div>
        </div><button class="cart-line__remove" type="button" data-remove="${escapeHtml(product.id)}" aria-label="حذف ${escapeHtml(product.name)} من السلة">×</button>
      </article>`).join("") : `<div class="cart-empty"><span class="cart-empty__icon" aria-hidden="true">♡</span><strong>سلتك لسه مستنية حلاوتك</strong><p>اختار حاجة بتحبها وهنضيفها هنا.</p></div>`;
    document.querySelector(".cart-footer").classList.toggle("is-empty", entries.length === 0);
  }

  function showToast(message) {
    const toast = document.querySelector(".toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function addToCart(productId) {
    const product = data.products.find((item) => item.id === productId);
    if (!product) return;
    state.cart[productId] = Math.min((state.cart[productId] || 0) + 1, 99);
    saveCart();
    renderCart();
    showToast(`اتضاف ${product.name} للسلة ♡`);
  }

  function updateQuantity(productId, direction) {
    if (!state.cart[productId]) return;
    state.cart[productId] = direction === "plus" ? Math.min(state.cart[productId] + 1, 99) : state.cart[productId] - 1;
    if (state.cart[productId] <= 0) delete state.cart[productId];
    saveCart();
    renderCart();
  }

  function normalizedWhatsappNumber() {
    let number = String(business.whatsapp).replace(/\D/g, "");
    if (number.startsWith("00")) number = number.slice(2);
    if (number.startsWith("0")) number = `20${number.slice(1)}`;
    return number;
  }

  function orderMessage(kind = "welcome") {
    if (kind === "cart") {
      const entries = Object.entries(state.cart)
        .map(([id, qty]) => ({ product: data.products.find((product) => product.id === id), qty }))
        .filter((entry) => entry.product && entry.qty > 0);
      if (!entries.length) return null;
      const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.qty, 0);
      const lines = entries.map(({ product, qty }) => `• ${product.name} × ${qty} — ${money(product.price)} × ${qty} = ${money(product.price * qty)}`);
      return `السلام عليكم، أرغب في الاستفسار وتأكيد الطلب:\n${lines.join("\n")}\n\nالإجمالي: ${money(total)}\nمن فضلكم أكدوا التوافر وتفاصيل الاستلام والدفع. الطلب غير مؤكد حتى تأكيد المتجر.`;
    }
    if (kind === "custom") return "السلام عليكم، أرغب في طلب تصميم حلويات خاص لمناسبة. ممكن تفاصيل الخيارات والأسعار؟";
    if (kind.startsWith("offer-")) {
      const offer = data.offers[Number(kind.slice("offer-".length))];
      return `السلام عليكم، ممكن تفاصيل وتأكيد توافر العرض التجريبي: ${offer ? offer.title : ""}؟`;
    }
    return "السلام عليكم، أود الاستفسار عن قائمة حلويات سكر هاوس والمنتجات المتاحة اليوم.";
  }

  function openWhatsapp(kind) {
    const message = orderMessage(kind);
    if (!message) {
      showToast("سلتك فاضية… اختار حلوى الأول ♡");
      return false;
    }
    const url = `https://wa.me/${normalizedWhatsappNumber()}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  function openCart() {
    state.lastFocus = document.activeElement;
    byId("cart-overlay").hidden = false;
    byId("cart-drawer").inert = false;
    byId("cart-drawer").setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    requestAnimationFrame(() => {
      byId("cart-overlay").classList.add("is-open");
      byId("cart-drawer").classList.add("is-open");
      document.querySelector(".cart-close").focus();
    });
  }

  function closeCart() {
    byId("cart-overlay").classList.remove("is-open");
    byId("cart-drawer").classList.remove("is-open");
    byId("cart-drawer").setAttribute("aria-hidden", "true");
    byId("cart-drawer").inert = true;
    document.body.classList.remove("drawer-open");
    window.setTimeout(() => { byId("cart-overlay").hidden = true; }, 280);
    if (state.lastFocus && typeof state.lastFocus.focus === "function") state.lastFocus.focus();
  }

  function setCategory(category) {
    state.activeCategory = category;
    document.querySelectorAll("[data-filter]").forEach((pill) => {
      const active = pill.dataset.filter === category;
      pill.classList.toggle("is-active", active);
      pill.setAttribute("aria-pressed", String(active));
    });
    renderProducts();
  }

  function fillBusinessDetails() {
    document.querySelectorAll("[data-business]").forEach((node) => {
      const field = node.dataset.business;
      if (business[field]) node.textContent = business[field];
    });
    document.title = `${business.name} — ${business.arabicName} | ${business.tagline}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${business.arabicName}: ${business.type} ${business.tagline}.`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", `${business.tagline} — ${business.type}`);
    document.querySelectorAll("[data-photo-key]").forEach((image) => {
      image.src = imageUrl(image.dataset.photoKey, Number(image.dataset.photoWidth) || 900);
    });
    document.querySelectorAll('[data-business="address"]').forEach((node) => { node.textContent = business.address; });
    document.querySelectorAll('[data-site="hours"]').forEach((node) => { node.textContent = business.hours; });
    document.querySelectorAll('[data-site="phone"]').forEach((node) => { node.textContent = business.phone; });
    document.querySelectorAll('[data-site="email"]').forEach((node) => { node.textContent = business.email; });
    document.querySelectorAll('[data-contact="maps"]').forEach((node) => { node.href = business.mapUrl; node.target = "_blank"; node.rel = "noopener noreferrer"; });
    document.querySelectorAll('[data-contact="phone"]').forEach((node) => { node.href = `tel:${business.phone}`; });
    document.querySelectorAll('[data-contact="email"]').forEach((node) => { node.href = `mailto:${business.email}`; });
    byId("current-year").textContent = String(new Date().getFullYear());
  }

  renderCategories();
  renderProducts();
  renderOffers();
  renderFeatures();
  renderReviews();
  renderCart();
  fillBusinessDetails();

  document.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    image.closest(".image-frame")?.classList.add("image-broken");
  }, true);

  byId("product-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderProducts();
  });
  byId("product-sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });
  byId("filter-pills").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) setCategory(button.dataset.filter);
  });
  byId("category-grid").addEventListener("click", (event) => {
    const link = event.target.closest("[data-category-link]");
    if (!link) return;
    setCategory(link.dataset.categoryLink);
  });
  byId("product-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });
  byId("cart-body").addEventListener("click", (event) => {
    const quantity = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if (quantity) updateQuantity(quantity.dataset.id, quantity.dataset.qty);
    if (remove) {
      delete state.cart[remove.dataset.remove];
      saveCart();
      renderCart();
      showToast("اتحذف المنتج من السلة.");
    }
  });
  document.querySelectorAll(".cart-trigger").forEach((button) => button.addEventListener("click", openCart));
  document.querySelector(".cart-close").addEventListener("click", closeCart);
  byId("cart-overlay").addEventListener("click", closeCart);
  document.querySelector(".continue-shopping").addEventListener("click", closeCart);
  document.querySelectorAll('[data-whatsapp]').forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    if (openWhatsapp(link.dataset.whatsapp) && link.dataset.whatsapp === "cart") closeCart();
  }));
  document.querySelectorAll("[data-contact]").forEach((link) => link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") event.preventDefault();
  }));
  byId("show-all").addEventListener("click", (event) => {
    event.preventDefault();
    state.query = "";
    state.sort = "featured";
    byId("product-search").value = "";
    byId("product-sort").value = "featured";
    setCategory("all");
    byId("products-title").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = byId("primary-nav");
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "فتح القائمة" : "إغلاق القائمة");
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "فتح القائمة");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && byId("cart-drawer").classList.contains("is-open")) closeCart();
    if (event.key === "Tab" && byId("cart-drawer").classList.contains("is-open")) {
      const focusable = [...byId("cart-drawer").querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')]
        .filter((node) => !node.closest("[hidden]") && node.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
