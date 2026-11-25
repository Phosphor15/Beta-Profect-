(function () {
  "use strict";
  var D = window.HARALDS;

  /* ================= Storage (best effort, demo only) ================= */
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

  /* ================= Language: Italian is the page source ================= */
  var EN = {
    "menu": "Menu",
    "nav.restaurant": "Restaurant",
    "nav.events": "Events",
    "cta.book": "Book a table",
    "hero.eyebrow": "Winter 2026 / 27 · Campo Smith, 1312 m",
    "hero.lede": "Skis off at four. Champagne on the terrace at five. Then dinner à la carte, the lights go down and Harald's becomes a club until late.",
    "hero.season": "See the season",
    "w.dinner": "Dinner",
    "w.terrace": "Terrace",
    "w.restaurant": "Restaurant",
    "marquee": "<span>Après-ski</span><span>Champagne on snow</span><span>Live DJ on the terrace</span><span>Dinner à la carte</span><span>Club nights</span><span>Bardonecchia</span><span>Après-ski</span><span>Champagne on snow</span><span>Live DJ on the terrace</span><span>Dinner à la carte</span><span>Club nights</span><span>Bardonecchia</span>",
    "acts.eyebrow": "One night, three acts",
    "acts.title": "From the last run <em>to the last song.</em>",
    "acts.lede": "The same room changes three times a night. Book for one act or stay for all three.",
    "acts.apres": "DJ on the terrace at the foot of the slopes. Ski boots welcome, bottles on ice, sunset over the Valle Stretta.",
    "acts.diner": "The kitchen takes over: Piedmontese cuts, fresh pasta and the wine list. Low lights, live sax on weekends.",
    "acts.club": "Tables move, the booth comes on. House and disco until late, with table service and champagne parades.",
    "mani.eyebrow": "The new Harald's",
    "mani.quote": "The mountain closes at five. <em>We don't.</em>",
    "mani.lede": "Harald's has always been the place to stop after skiing. This winter it is also where Bardonecchia spends the night.",
    "ter.title": "The terrace <em>on the piste.</em>",
    "ter.lede": "Right at the bottom of Campo Smith, with the DJ booth facing the slope. Book a table, choose your bottles in advance and skip the queue at the bar.",
    "ter.btn": "Book the terrace",
    "f.tables": "Tables", "f.guests": "4 – 8 guests", "f.price": "Table price", "f.incl": "drinks included",
    "f.entry": "Entry", "f.qr": "QR code at the door", "f.breakfast": "Breakfast", "f.from730": "from 07:30", "f.lunch": "Lunch",
    "res.title": "Dinner first, <em>then the dance floor.</em>",
    "res.lede": "Breakfast from our own pastry kitchen at 7:30, lunch on the slopes and dinner à la carte. After 22:30 the dining room becomes the club and your table stays yours.",
    "res.btn": "Reserve for dinner",
    "ev.eyebrow": "Season 2026 / 27",
    "ev.title": "Coming <em>up.</em>",
    "ev.all": "Full calendar",
    "cta.eyebrow": "Tables · bottles · champagne",
    "cta.title": "Your table <em>is waiting.</em>",
    "cta.lede": "Pick the night, your zone on the floor plan and your bottles. Pay online and walk in with a QR code.",
    "cta.order": "Order champagne",
    "cta.soon": "Tables: floor plan coming soon",
    "ft.hours": "Hours", "ft.hourstext": "Every day from 07:30<br>Club nights Thu – Sat", "ft.contact": "Contact",
    "ft.demo": "Internal demo · not a public site",
    /* shop */
    "sh.eyebrow": "Bottles · table service",
    "sh.title": "Champagne <em>to your table.</em>",
    "sh.lede": "Order your bottles before you arrive and find them on ice at your table. Magnums and up arrive with a sparkler parade.",
    "sh.fine": "Spirits are served with ice and your choice of mixers (soft drinks, tonic, Red Bull). Availability and prices may vary. No alcohol is served to anyone under 18.",
    "sh.cart": "Your order", "sh.empty": "No bottles yet. Pick one from the list with “Add”.",
    "sh.total": "Total", "sh.night": "Night", "sh.moment": "When", "sh.optdinner": "Dinner · 19:00",
    "sh.name": "Full name", "sh.phone": "Phone",
    "sh.parade": "Sparkler parade (included from Magnum up)",
    "sh.pay": "Confirm and pay", "sh.demo": "Demo: payment is simulated, nothing is charged.",
    "sh.review": "Review",
    /* events */
    "ec.eyebrow": "Season 2026 / 27 · 5 December – 11 April",
    "ec.title": "The season <em>calendar.</em>",
    "ec.lede": "Après, dinners and club nights. Book a table for any night and order your bottles in advance.",
    "ec.all": "All",
    /* done */
    "dn.eyebrow": "Order confirmed", "dn.title": "See you <em>at the table.</em>",
    "dn.fine": "Show the QR code at the door: your bottles arrive at the table at the time you chose. Demo, nothing charged.",
    "dn.close": "Close"
  };
  var T = {
    it: { add: "Aggiungi", top: "Top", empty: "Nessuna serata con questo filtro.", book: "Prenota un tavolo", order: "Ordina champagne",
          next: "Prossimo", events: "serate", apres: "Après · 16:30", dinner: "Cena · 19:00", club: "Club · 22:30", close: "Chiudi",
          errCart: "Aggiungi almeno una bottiglia.", errName: "Scrivi nome e cognome.", errPhone: "Scrivi un numero di telefono valido.",
          code: "Codice", night: "Serata", when: "Momento", name: "Nome", total: "Totale", parade: "Parata sparkler", yes: "Sì", remove: "Togli", more: "Aggiungi una" },
    en: { add: "Add", top: "Top", empty: "No nights match this filter.", book: "Book a table", order: "Order champagne",
          next: "Next up", events: "nights", apres: "Après · 16:30", dinner: "Dinner · 19:00", club: "Club · 22:30", close: "Close",
          errCart: "Add at least one bottle.", errName: "Enter your full name.", errPhone: "Enter a valid phone number.",
          code: "Code", night: "Night", when: "When", name: "Name", total: "Total", parade: "Sparkler parade", yes: "Yes", remove: "Remove", more: "Add one" }
  };

  var lang = "it";
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  nodes.forEach(function (n) { n._it = n.innerHTML; });
  function t(k) { return T[lang][k]; }
  function L(o) { return o ? (o[lang] || o.it) : ""; }
  var locale = function () { return lang === "en" ? "en-GB" : "it-IT"; };
  function euro(n) { return "€ " + n.toLocaleString(locale()); }
  function liters(n) { return n.toLocaleString(locale(), { minimumFractionDigits: n < 1 ? 2 : 1 }) + " L"; }
  function parseDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d, opts) { return new Intl.DateTimeFormat(locale(), opts).format(d); }

  function setLang(next) {
    lang = next === "en" ? "en" : "it";
    document.documentElement.lang = lang;
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = lang === "en" && EN[k] ? EN[k] : n._it;
    });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    save("haralds-lang", lang);
    renderAll();
  }
  document.querySelectorAll(".lang button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); }); });

  /* ================= Header + mobile menu ================= */
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");
  function onScroll() { header.classList.toggle("is-solid", window.scrollY > 40 || current !== "home"); }
  window.addEventListener("scroll", onScroll, { passive: true });
  function closeMenu() { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "Menu"; }
  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) return closeMenu();
    nav.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); toggle.textContent = t("close");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });

  /* ================= Router (hash views) ================= */
  var VIEWS = ["home", "champagne", "eventi"];
  var current = "home";
  function route() {
    var h = (location.hash || "").slice(1);
    var view = VIEWS.indexOf(h) > -1 ? h : "home";
    var changed = view !== current;
    current = view;
    document.querySelectorAll("[data-view]").forEach(function (v) { v.hidden = v.dataset.view !== view; });
    nav.querySelectorAll("a[data-nav]").forEach(function (a) {
      var on = (a.dataset.nav === view && view !== "home") || (view === "home" && a.getAttribute("href") === "#" + h);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (view === "home" && h && h !== "home") {
      var target = document.getElementById(h);
      if (target) { target.scrollIntoView({ behavior: changed ? "auto" : "smooth" }); }
    } else if (changed || h === "home") {
      window.scrollTo(0, 0);
    }
    updateBar();
    onScroll();
  }
  window.addEventListener("hashchange", route);

  /* ================= Events data helpers ================= */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var upcoming = D.events.filter(function (e) { return parseDate(e.date) >= today; });
  if (!upcoming.length) upcoming = D.events.slice();
  var ICE_SIZES = ["300%", "320%", "340%", "280%"];

  function typePills(e, isNext) {
    var html = isNext ? '<span class="pill pill--next">' + t("next") + "</span>" : "";
    return html + e.types.map(function (ty) { return '<span class="pill">' + t(ty) + "</span>"; }).join("");
  }

  /* Home teaser: next three nights */
  function renderHomeEvents() {
    var box = document.getElementById("home-events");
    box.innerHTML = upcoming.slice(0, 3).map(function (e, i) {
      var d = parseDate(e.date);
      return '<a class="event-card" href="#eventi">' +
        (e.tag ? '<span class="tag">' + L(e.tag) + "</span>" : "") +
        '<div class="thumb ice" style="--zoom:' + ICE_SIZES[i % 4] + ";--pos:" + e.pos + ';--tint:linear-gradient(180deg,rgba(74,15,34,.2),rgba(13,8,9,.5))"></div>' +
        '<div class="event-body"><div class="event-date"><b>' + fmt(d, { day: "2-digit" }) + "</b><span>" +
        fmt(d, { weekday: "short" }) + " · " + fmt(d, { month: "long" }) + "</span></div>" +
        "<h3>" + L(e.title) + "</h3><p>" + L(e.text) + "</p></div></a>";
    }).join("");
  }

  /* Events calendar */
  var filter = "all";
  document.getElementById("event-filters").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-filter]"); if (!b) return;
    filter = b.dataset.filter;
    this.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    renderEvents();
  });
  function renderEvents() {
    var list = D.events.filter(function (e) { return filter === "all" || e.types.indexOf(filter) > -1; });
    var box = document.getElementById("event-list");
    if (!list.length) { box.innerHTML = '<p class="ev-empty">' + t("empty") + "</p>"; return; }
    var nextDate = upcoming[0] && upcoming[0].date;
    var groups = {};
    list.forEach(function (e) { var k = e.date.slice(0, 7); (groups[k] = groups[k] || []).push(e); });
    box.innerHTML = Object.keys(groups).map(function (k) {
      var first = parseDate(groups[k][0].date);
      var title = fmt(first, { month: "long", year: "numeric" });
      return '<section class="month"><h2><span>' + title.charAt(0).toUpperCase() + title.slice(1) + "</span><small>" +
        groups[k].length + " " + t("events") + "</small></h2>" +
        groups[k].map(function (e, i) {
          var d = parseDate(e.date);
          return '<article class="ev">' +
            '<div class="ev-date"><b>' + fmt(d, { day: "2-digit" }) + "</b><span>" + fmt(d, { weekday: "short" }) + "</span></div>" +
            '<div class="ev-thumb ice" style="--pos:' + e.pos + '">' + (e.tag ? '<span class="tag">' + L(e.tag) + "</span>" : "") + "</div>" +
            '<div class="ev-copy"><div class="pills">' + typePills(e, e.date === nextDate) + "</div><h3>" + L(e.title) + "</h3><p>" + L(e.text) + "</p></div>" +
            '<div class="ev-actions"><a class="btn btn--sm" href="#book">' + t("book") + "</a>" +
            '<a class="btn btn--ghost btn--sm" href="#champagne" data-order-night="' + e.date + '">' + t("order") + "</a></div>" +
            "</article>";
        }).join("") + "</section>";
    }).join("");
  }
  document.getElementById("event-list").addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-order-night]"); if (!a) return;
    presetNight = a.dataset.orderNight;
    renderNightSelect();
  });

  /* ================= Champagne shop ================= */
  var cart = load("haralds-cart", {});
  var activeCat = "all";
  var presetNight = null;
  var byId = {}; D.bottles.forEach(function (b) { byId[b.id] = b; });
  Object.keys(cart).forEach(function (id) { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; });

  function bottleSvg(b) {
    var h = Math.round(62 + b.size * 27), w = Math.round(h * 0.4);
    var champagne = b.cat === "bubbles";
    var body = champagne
      ? "M16 2H24V28C24 36 34 38 34 48V96Q34 100 30 100H10Q6 100 6 96V48C6 38 16 36 16 28Z"
      : "M15 2H25V22L30 30Q34 32 34 38V96Q34 100 30 100H10Q6 100 6 96V38Q6 32 10 30L15 22Z";
    var foil = champagne ? '<path d="M16 2H24V22H16Z" fill="#dcbf86"/>' : '<rect x="15" y="2" width="10" height="6" fill="#dcbf86"/>';
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 40 101" aria-hidden="true">' +
      '<path d="' + body + '" fill="rgba(243,235,224,.06)" stroke="#dcbf86" stroke-width="1.2"/>' + foil +
      '<rect x="9" y="58" width="22" height="22" fill="' + (b.top ? "#7a1a36" : "#4a0f22") + '" stroke="#dcbf86" stroke-width=".6"/>' +
      '<path d="M13 69H27" stroke="#dcbf86" stroke-width=".8"/></svg>';
  }
  function stepper(id, q) {
    return '<span class="stepper"><button type="button" data-dec="' + id + '" aria-label="' + t("remove") + '">−</button><output>' + q +
      '</output><button type="button" data-inc="' + id + '" aria-label="' + t("more") + '">+</button></span>';
  }
  function renderTabs() {
    var tabs = [{ id: "all", it: "Tutte", en: "All" }].concat(D.cats);
    document.getElementById("bottle-tabs").innerHTML = tabs.map(function (c) {
      return '<button type="button" role="tab" data-cat="' + c.id + '" aria-selected="' + (c.id === activeCat) + '">' + L(c) + "</button>";
    }).join("");
  }
  document.getElementById("bottle-tabs").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-cat]"); if (!b) return;
    activeCat = b.dataset.cat; renderTabs(); renderBottles();
  });
  function renderBottles() {
    var cats = D.cats.filter(function (c) { return activeCat === "all" || c.id === activeCat; });
    document.getElementById("bottles").innerHTML = cats.map(function (c) {
      return '<div><h2 class="cat-title" style="margin-bottom:16px">' + L(c) + '</h2><div class="bottle-grid">' +
        D.bottles.filter(function (b) { return b.cat === c.id; }).map(function (b) {
          var q = cart[b.id] || 0;
          return '<article class="bottle' + (q ? " in-cart" : "") + '">' + (b.top ? '<span class="top">' + t("top") + "</span>" : "") +
            '<div class="bottle-stage">' + bottleSvg(b) + "</div>" +
            '<div class="bottle-body"><span class="bottle-size">' + liters(b.size) + (b.kind ? " · " + b.kind : "") + "</span>" +
            "<h3>" + b.name + "</h3>" +
            '<div class="bottle-foot"><span class="price">' + euro(b.price) + "</span>" +
            (q ? stepper(b.id, q) : '<button type="button" class="btn btn--sm" data-inc="' + b.id + '">' + t("add") + "</button>") +
            "</div></div></article>";
        }).join("") + "</div></div>";
    }).join("");
  }
  function cartTotals() {
    var count = 0, total = 0, big = false;
    Object.keys(cart).forEach(function (id) { count += cart[id]; total += cart[id] * byId[id].price; if (byId[id].size >= 1.5) big = true; });
    return { count: count, total: total, big: big };
  }
  function renderCart() {
    var ids = Object.keys(cart);
    var tot = cartTotals();
    document.getElementById("cart-empty").hidden = ids.length > 0;
    document.getElementById("cart-lines").innerHTML = ids.map(function (id) {
      var b = byId[id];
      return "<li><span>" + b.name + " <small>· " + liters(b.size) + "</small></span><b>" + euro(b.price * cart[id]) + "</b>" + stepper(id, cart[id]) + "</li>";
    }).join("");
    document.getElementById("cart-total").textContent = euro(tot.total);
    document.getElementById("cart-count").textContent = tot.count;
    document.getElementById("bar-count").textContent = tot.count;
    document.getElementById("bar-total").textContent = euro(tot.total);
    document.getElementById("bar-word").textContent = tot.count === 1 ? (lang === "en" ? "bottle" : "bottiglia") : (lang === "en" ? "bottles" : "bottiglie");
    updateBar();
  }
  function updateBar() {
    var bar = document.getElementById("cart-bar");
    bar.hidden = !(current === "champagne" && cartTotals().count > 0);
    document.body.classList.toggle("has-bar", !bar.hidden);
  }
  function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    save("haralds-cart", cart);
    renderBottles(); renderCart();
  }
  document.querySelector("[data-view='champagne']").addEventListener("click", function (ev) {
    var inc = ev.target.closest("[data-inc]"), dec = ev.target.closest("[data-dec]");
    if (inc) changeQty(inc.dataset.inc, 1);
    if (dec) changeQty(dec.dataset.dec, -1);
  });

  function renderNightSelect() {
    var sel = document.getElementById("o-night");
    var keep = presetNight || sel.value;
    sel.innerHTML = upcoming.map(function (e) {
      var d = parseDate(e.date);
      return '<option value="' + e.date + '">' + fmt(d, { weekday: "short", day: "numeric", month: "short" }) + " · " + L(e.title) + "</option>";
    }).join("");
    if (keep && upcoming.some(function (e) { return e.date === keep; })) sel.value = keep;
    if (presetNight) {
      var e = upcoming.filter(function (x) { return x.date === presetNight; })[0];
      if (e) document.getElementById("o-moment").value = e.types[e.types.length - 1];
      presetNight = null;
    }
  }

  /* Order submit -> simulated payment -> ticket */
  var form = document.getElementById("order-form");
  var err = document.getElementById("o-error");
  var lastOrder = null;
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var tot = cartTotals();
    var name = document.getElementById("o-name").value.trim();
    var phone = document.getElementById("o-phone").value.replace(/[^\d+]/g, "");
    var msg = !tot.count ? t("errCart") : name.length < 3 ? t("errName") : phone.replace(/\D/g, "").length < 8 ? t("errPhone") : "";
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    err.hidden = true;
    var btn = document.getElementById("o-submit");
    btn.disabled = true; btn.style.opacity = ".6";
    setTimeout(function () {
      btn.disabled = false; btn.style.opacity = "";
      var night = document.getElementById("o-night").value;
      var code = "HA-" + night.slice(8, 10) + night.slice(5, 7) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      lastOrder = {
        code: code, night: night, moment: document.getElementById("o-moment").value, name: name,
        parade: document.getElementById("o-parade").checked && tot.big,
        items: Object.keys(cart).map(function (id) { return { id: id, q: cart[id] }; }), total: tot.total
      };
      var orders = load("haralds-orders", []); orders.push(lastOrder); save("haralds-orders", orders);
      cart = {}; save("haralds-cart", cart);
      renderBottles(); renderCart(); showTicket();
    }, 900);
  });

  var overlay = document.getElementById("done");
  function showTicket() {
    if (!lastOrder) return;
    var o = lastOrder;
    var qr = qrcode(0, "M");
    qr.addData("HARALDS|" + o.code + "|" + o.night + "|" + o.moment + "|" + o.items.map(function (i) { return i.q + "x" + i.id; }).join(","));
    qr.make();
    document.getElementById("done-qr").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0 });
    document.getElementById("done-code").textContent = o.code;
    var ev = D.events.filter(function (e) { return e.date === o.night; })[0];
    var rows = [[t("name"), o.name], [t("night"), fmt(parseDate(o.night), { weekday: "short", day: "numeric", month: "long" }) + (ev ? " · " + L(ev.title) : "")], [t("when"), t(o.moment)]];
    o.items.forEach(function (i) { rows.push([i.q + " × " + byId[i.id].name, euro(byId[i.id].price * i.q)]); });
    if (o.parade) rows.push([t("parade"), t("yes")]);
    rows.push([t("total"), euro(o.total)]);
    document.getElementById("done-lines").innerHTML = rows.map(function (r) { return "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>"; }).join("");
    overlay.hidden = false;
    document.getElementById("done-close").focus();
  }
  function hideTicket() { overlay.hidden = true; lastOrder = null; }
  document.getElementById("done-close").addEventListener("click", hideTicket);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) hideTicket(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !overlay.hidden) hideTicket(); });

  /* ================= Boot ================= */
  function renderAll() {
    renderHomeEvents(); renderEvents(); renderTabs(); renderBottles(); renderCart(); renderNightSelect();
    if (!overlay.hidden) showTicket();
    if (!nav.classList.contains("is-open")) toggle.textContent = "Menu";
  }
  if (load("haralds-lang", "it") === "en") setLang("en"); else renderAll();
  route();
})();
