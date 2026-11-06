/* =========================================================
   DKC HOMEPAGE (index.html)
   - builds the category cards and featured products from products.js
   - connects "Request service" buttons to the quotation form
   - quotation form opens the visitor's email app (no backend yet)
   ========================================================= */
(() => {
  'use strict';
  const D = window.DKC_DATA;
  const EMAIL = 'kaex21@gmail.com';

  /* ---- category cards ---- */
  const catGrid = document.getElementById('categoryGrid');
  if (catGrid && D) {
    catGrid.innerHTML = D.categories.map((c, i) =>
      '<a class="cat" data-tone="' + i + '" href="shop.html?category=' + c.id + '">' +
      '<span class="cat-num">0' + (i + 1) + '</span>' +
      '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + c.icon + '</svg>' +
      '<strong>' + c.name + '</strong><small>' + c.desc + '</small>' +
      '<span class="cat-go" aria-hidden="true">↗</span></a>').join('');
  }

  /* ---- featured products (sample ids picked from products.js) ---- */
  const featGrid = document.getElementById('featuredGrid');
  if (featGrid && D) {
    const peso = (n) => n == null ? 'Inquire for price'
      : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
    const STOCK = { in: ['In stock', 'ok'], low: ['Low stock', 'low'], out: ['Out of stock', 'out'], order: ['Available on order', 'order'] };
    const cats = Object.create(null);
    D.categories.forEach((c) => { cats[c.id] = c; });
    featGrid.innerHTML = ['d2', 'l1', 'c4', 'n1']
      .map((id) => D.products.find((p) => p.id === id)).filter(Boolean)
      .map((p) => {
        const c = cats[p.cat], st = STOCK[p.stock], sub = c.subs.find((s) => s.id === p.sub);
        const mail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Inquiry: ' + p.name) +
          '&body=' + encodeURIComponent('Hello DKC, I would like to ask about: ' + p.name + '. Please send the current price and availability.');
        return '<article class="pc"><div class="pc-img"><span class="pc-sample">Sample</span>' +
          '<span class="pc-stock ' + st[1] + '">' + st[0] + '</span>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + c.icon + '</svg></div>' +
          '<div class="pc-body"><span class="pc-cat">' + (sub ? sub.name : c.name) + '</span><h3 class="pc-name">' + p.name + '</h3>' +
          '<span class="pc-brand">' + p.brand + '</span><div class="pc-price">' + peso(p.price) + '</div>' +
          '<div class="pc-actions"><a class="pc-btn pc-btn--outline" href="shop.html?category=' + p.cat + '&sub=' + p.sub + '">View details</a>' +
          '<a class="pc-btn pc-btn--red" href="' + mail + '">Inquire</a></div></div></article>';
      }).join('');
  }

  /* ---- quotation form ---- */
  const form = document.getElementById('quoteForm');
  if (!form) return;

  document.querySelectorAll('[data-need]').forEach((link) =>
    link.addEventListener('click', () => { form.elements.need.value = link.dataset.need; }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    const body = 'Name: ' + f.name.value.trim() + '\nContact: ' + f.contact.value.trim() +
      '\nNeed: ' + f.need.value + '\n\nDetails:\n' + f.details.value.trim();
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quotation request: ' + f.need.value) +
      '&body=' + encodeURIComponent(body);
  });
})();