(function () {
  /* ---------- Language: Italian is the page source, English is the dictionary ---------- */
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
    "f.tables": "Tables",
    "f.guests": "4 – 8 guests",
    "f.price": "Table price",
    "f.incl": "drinks included",
    "f.entry": "Entry",
    "f.qr": "QR code at the door",
    "f.breakfast": "Breakfast",
    "f.from730": "from 07:30",
    "f.lunch": "Lunch",
    "res.title": "Dinner first, <em>then the dance floor.</em>",
    "res.lede": "Breakfast from our own pastry kitchen at 7:30, lunch on the slopes and dinner à la carte. After 22:30 the dining room becomes the club and your table stays yours.",
    "res.btn": "Reserve for dinner",
    "ev.eyebrow": "Season 2026 / 27",
    "ev.title": "Coming <em>up.</em>",
    "ev.all": "Full calendar · next step",
    "ev.t1": "Opening",
    "ev.d1": "Sat · December",
    "ev.p1": "First day of the season. Terrace from 15:30, club from 22:30.",
    "ev.d2": "Tue · December",
    "ev.h2": "Immacolata Après",
    "ev.p2": "The long weekend closes on the terrace with a guest DJ.",
    "ev.t3": "Limited tables",
    "ev.d3": "Thu · December",
    "ev.h3": "New Year's Eve",
    "ev.p3": "Dinner, midnight fireworks over the slopes and the club until late.",
    "cta.eyebrow": "Tables · bottles · champagne",
    "cta.title": "Your table <em>is waiting.</em>",
    "cta.lede": "Pick the night, your zone on the floor plan and your bottles. Pay online and walk in with a QR code.",
    "cta.soon": "Booking opens in step 2",
    "ft.hours": "Hours",
    "ft.hourstext": "Every day from 07:30<br>Club nights Thu – Sat",
    "ft.contact": "Contact",
    "ft.demo": "Internal demo · not a public site"
  };
  var CLOSE = { it: "Chiudi", en: "Close" };

  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  nodes.forEach(function (n) { n._it = n.innerHTML; });
  var current = "it";

  function setLang(lang) {
    current = lang === "en" ? "en" : "it";
    document.documentElement.lang = current;
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = current === "en" && EN[k] ? EN[k] : n._it;
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === current));
    });
    try { localStorage.setItem("haralds-lang", current); } catch (e) {}
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  var saved = null;
  try { saved = localStorage.getItem("haralds-lang"); } catch (e) {}
  if (saved === "en") setLang("en");

  /* ---------- Header + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");

  function onScroll() { header.classList.toggle("is-solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = current === "en" ? EN.menu : "Menu";
  }
  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) return closeMenu();
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = CLOSE[current];
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
})();
