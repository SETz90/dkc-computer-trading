(() => {
  'use strict';

  const D = window.DKC_DATA;
  const grid = document.getElementById('shopGrid');
  if (!D || !grid) return;

  const $ = (id) => document.getElementById(id);
  const filters = $('shopFilters'), title = $('shopTitle'), blurb = $('shopBlurb'),
        crumb = $('crumbCurrent'), count = $('resultCount'), chips = $('activeChips'),
        sortSel = $('sortSelect'), modal = $('pdModal');

  const EMAIL = 'kaex21@gmail.com';
  const peso = (n) => n == null
    ? 'Inquire for price'
    : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
  const STOCK = { in: ['In stock', 'ok'], low: ['Low stock', 'low'], out: ['Out of stock', 'out'], order: ['Available on order', 'order'] };
  const SORTS = ['featured', 'price-asc', 'price-desc', 'name'];

  const catById = Object.create(null);
  D.categories.forEach((c) => { catById[c.id] = c; });
  const icon = (c) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + c.icon + '</svg>';
  const subOf = (p) => catById[p.cat].subs.find((s) => s.id === p.sub);
  const mail = (p) => 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Inquiry: ' + p.name) +
    '&body=' + encodeURIComponent('Hello DKC, I would like to ask about: ' + p.name + '. Please send the current price and availability.');

  /* ---- state from the URL ---- */
  const params = new URLSearchParams(location.search);
  const state = {
    category: catById[params.get('category')] ? params.get('category') : '',
    sub: params.get('sub') || '',
    q: (params.get('q') || '').trim(),
    sort: SORTS.includes(params.get('sort')) ? params.get('sort') : 'featured'
  };
  const activeCat = catById[state.category];
  if (!activeCat || !activeCat.subs.some((s) => s.id === state.sub)) state.sub = '';

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.category) p.set('category', state.category);
    if (state.sub) p.set('sub', state.sub);
    if (state.q) p.set('q', state.q);
    if (state.sort !== 'featured') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  /* ---- filtering + sorting ---- */
  function visibleProducts() {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const items = D.products.filter((p) => {
      if (state.category && p.cat !== state.category) return false;
      if (state.sub && p.sub !== state.sub) return false;
      if (!terms.length) return true;
      const sub = subOf(p);
      const hay = [p.name, p.brand, p.desc, catById[p.cat].name, sub ? sub.name : ''].join(' ').toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    const by = {
      'price-asc': (a, b) => (a.price == null ? Infinity : a.price) - (b.price == null ? Infinity : b.price),
      'price-desc': (a, b) => (b.price == null ? -1 : b.price) - (a.price == null ? -1 : a.price),
      name: (a, b) => a.name.localeCompare(b.name)
    }[state.sort];
    return by ? items.slice().sort(by) : items;
  }

  /* ---- rendering ---- */
  function renderFilters() {
    const total = (id) => D.products.filter((p) => p.cat === id).length;
    let html = '<h2>Categories</h2><ul><li><a href="shop.html"' + (!state.category ? ' aria-current="page"' : '') +
      '>All products <span>' + D.products.length + '</span></a></li>' +
      D.categories.map((c) => '<li><a href="shop.html?category=' + c.id + '"' +
        (c.id === state.category ? ' aria-current="page"' : '') + '>' + c.name + ' <span>' + total(c.id) + '</span></a></li>').join('') + '</ul>';
    if (activeCat) {
      html += '<h2>' + activeCat.name + '</h2><ul class="shop-subs"><li><a href="shop.html?category=' + activeCat.id + '"' +
        (!state.sub ? ' aria-current="true"' : '') + '>All ' + activeCat.name + '</a></li>' +
        activeCat.subs.map((s) => '<li><a href="shop.html?category=' + activeCat.id + '&sub=' + s.id + '"' +
          (s.id === state.sub ? ' aria-current="true"' : '') + '>' + s.name + '</a></li>').join('') + '</ul>';
    }
    filters.innerHTML = html;
  }

  const card = (p) => {
    const c = catById[p.cat], st = STOCK[p.stock], sub = subOf(p);
    return '<article class="pc"><div class="pc-img"><span class="pc-sample">Sample</span>' +
      '<span class="pc-stock ' + st[1] + '">' + st[0] + '</span>' + icon(c) + '</div>' +
      '<div class="pc-body"><span class="pc-cat">' + (sub ? sub.name : c.name) + '</span>' +
      '<h3 class="pc-name">' + p.name + '</h3><span class="pc-brand">' + p.brand + '</span>' +
      '<div class="pc-price">' + peso(p.price) + '</div><div class="pc-actions">' +
      '<button type="button" class="pc-btn pc-btn--outline" data-view="' + p.id + '">View details</button>' +
      '<a class="pc-btn pc-btn--red" href="' + mail(p) + '">Inquire</a></div></div></article>';
  };

  function render() {
    const items = visibleProducts();
    const sub = activeCat && activeCat.subs.find((s) => s.id === state.sub);
    const name = sub ? sub.name : activeCat ? activeCat.name : 'All products';

    title.textContent = name;
    blurb.textContent = activeCat ? activeCat.desc : 'Browse computers, components, accessories, and networking equipment.';
    crumb.textContent = activeCat ? ' / ' + name : '';
    document.title = name + ' | DKC Computer Trading & Services';
    count.textContent = items.length + (items.length === 1 ? ' product' : ' products');
    sortSel.value = state.sort;

    chips.innerHTML = '';
    if (state.q) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'shop-chip';
      b.textContent = 'Search: “' + state.q + '”  ✕';
      b.setAttribute('aria-label', 'Clear search ' + state.q);
      b.addEventListener('click', () => { state.q = ''; const hs = $('headerSearchInput'); if (hs) hs.value = ''; syncUrl(); render(); });
      chips.appendChild(b);
    }

    grid.innerHTML = items.length ? items.map(card).join('') :
      '<div class="shop-empty"><h3>No matching products</h3>' +
      '<p>Can’t find it? Contact our team for current models, availability, and pricing.</p>' +
      '<a class="pc-btn pc-btn--outline" href="shop.html">View all products</a>' +
      '<a class="pc-btn pc-btn--red" href="tel:+639706151069">Call 0970-615-1069</a></div>';
  }

  /* ---- details modal ---- */
  function openModal(p) {
    const c = catById[p.cat], st = STOCK[p.stock], sub = subOf(p);
    modal.innerHTML = '<div class="pd-inner"><button type="button" class="pd-close" data-close aria-label="Close details">✕</button>' +
      '<div class="pd-media">' + icon(c) + '</div><div class="pd-info">' +
      '<span class="pc-cat">' + c.name + (sub ? ' › ' + sub.name : '') + '</span><h2>' + p.name + '</h2>' +
      '<p class="pc-brand">Brand: ' + p.brand + '</p>' +
      '<p class="pd-price">' + peso(p.price) + ' <span class="pc-stock ' + st[1] + '">' + st[0] + '</span></p>' +
      '<p>' + p.desc + '</p><p class="pd-note">Sample listing. Price, specifications, and stock will be confirmed by DKC.</p>' +
      '<div class="pc-actions"><a class="pc-btn pc-btn--red" href="' + mail(p) + '">Inquire by email</a>' +
      '<a class="pc-btn pc-btn--outline" href="tel:+639706151069">Call 0970-615-1069</a></div></div></div>';
    modal.showModal();
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-view]');
    const p = btn && D.products.find((x) => x.id === btn.dataset.view);
    if (p) openModal(p);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-close]')) modal.close();
  });

  /* ---- sorting + header search ---- */
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; syncUrl(); render(); });
  document.addEventListener('dkc:search', (e) => { state.q = e.detail.query; syncUrl(); render(); });
  const hs = $('headerSearchInput');
  if (hs && state.q) hs.value = state.q;

  renderFilters();
  render();
})();