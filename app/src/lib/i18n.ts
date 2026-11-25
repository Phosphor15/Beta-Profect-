export type Lang = "it" | "en";

const it = {
  nav: {
    apres: "Après-Ski", restaurant: "Ristorante", events: "Eventi", drinks: "Listino bevande",
    contact: "Contatti", book: "Prenota il tavolo", staff: "Area staff",
  },
  footer: {
    tagline: "Ski restaurant, bar e après-ski ai piedi delle piste di Campo Smith.",
    privacy: "Privacy policy", terms: "Termini e condizioni prenotazione", cookies: "Preferenze cookie",
    rights: "Tutti i diritti riservati.", beta: "Versione beta — contenuti e prezzi indicativi.",
    betaBanner: "Anteprima beta · dati di esempio e pagamenti simulati",
  },
  hero: {
    eyebrow: "Campo Smith · Bardonecchia",
    title1: "Harald's", title2: "Ski Restaurant · Bar · Après-Ski",
    subtitle: "Dalla colazione sulle piste al tramonto in terrazza: la tradizione alpina servita con lo stile di un club.",
    ctaBook: "Prenota il tavolo", ctaMenu: "Listino bevande",
  },
  home: {
    eventsEyebrow: "Calendario", eventsTitle: "Prossimi eventi", allEvents: "Vedi il calendario",
    apresEyebrow: "Tutti i giorni · 15:30 – 19:30",
    apresTitle: "L'après-ski di Bardonecchia",
    apresText: "Scarponi ai piedi, il sole che scende su Campo Smith e un DJ set che sale piano. Si arriva dalle piste e non si va più via.",
    restEyebrow: "Dalle 7:30 al dopocena",
    restTitle: "Cucina alpina, fatta in casa",
    restText: "Colazioni con la pasticceria interna, pranzi di montagna e cene à la carte: tradizione alpina e ingredienti locali reinterpretati dal nostro chef.",
    stepsEyebrow: "Tavoli après-ski",
    stepsTitle: "Scegli la zona, paga online, entra con il QR",
    steps: [
      ["Scegli", "Serata, zona e numero di persone."],
      ["Paga", "Carta, Apple Pay o Google Pay."],
      ["Ricevi il QR", "Conferma immediata via email."],
      ["Entra", "Lo staff scansiona il QR: tavolo pronto."],
    ] as [string, string][],
    igEyebrow: "Instagram", igTitle: "Harald's su Instagram",
    igText: "Serate, DJ set, piatti e foto dalle piste: tutto in tempo reale sul nostro profilo.", igCta: "Seguici",
  },
  hero2: {
    eyebrow: "Campo Smith · Bardonecchia",
    line: "Ski Restaurant & Après-Ski",
    words: ["sulle piste", "a pranzo", "al tramonto", "in pista da ballo"],
    lead: "La montagna si festeggia",
    ctaBook: "Prenota il tavolo", ctaMenu: "Scopri il listino", scroll: "Scorri",
    marquee: ["Après-ski ogni giorno 15:30 – 19:30", "DJ set", "Cucina alpina", "Bombardini & bollicine", "Campo Smith · Bardonecchia", "Tavoli in terrazza"],
  },
  intro: {
    eyebrow: "Benvenuti da Harald's",
    a: "Dalla prima colazione al", b: "tramonto", c: ", Harald's è il posto dove la montagna si", d: "festeggia", e: ".",
    stats: [["7:30", "apriamo con la colazione"], ["15:30", "parte l'après-ski"], ["2", "zone tavoli da prenotare"]] as [string, string][],
  },
  duo: {
    restTitle: "Ristorante", restText: "Cucina alpina fatta in casa, dalla pasticceria del mattino alle cene à la carte.", restCta: "Il ristorante",
    apresTitle: "Après-Ski", apresText: "Terrazza sulle piste, DJ set e bombardini: quando chiudono gli impianti, si accende Harald's.", apresCta: "L'après-ski",
  },
  tables: {
    eyebrow: "Tavoli riservati", title: "Il tuo tavolo,", titleItalic: "sulla neve",
    text: "Scegli la serata e la zona, paghi online e ricevi un QR: all'ingresso il tavolo è già pronto.",
    cta: "Prenota ora",
  },
  finale: { title: "Ci vediamo", titleItalic: "sulle piste", text: "Tutti i giorni in stagione, a fondo pista a Campo Smith.", cta: "Prenota il tavolo" },
  booking: {
    eyebrow: "Tavoli après-ski", title: "Prenota il tavolo",
    intro: "Scegli la serata, poi la zona sulla piantina. Pagamento completo online e QR all'ingresso.",
    specialEvents: "Eventi speciali", calendarTitle: "Scegli il giorno",
    prevMonth: "Mese precedente", nextMonth: "Mese successivo",
    weekdays: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    closed: "Chiuso", soldOut: "Esaurito", cutoff: "Online chiuse", from: "da",
    pickZone: "Scegli la zona",
    zoneHint: "Terrazza sulle piste o Sala chalet. Il tavolo viene assegnato dal nostro staff, senza scelta del numero.",
    zones: { terrazza: "Terrazza sulle piste", chalet: "Sala chalet" },
    zonesShort: { terrazza: "Terrazza", chalet: "Chalet" },
    freeTables: "tavoli liberi", legendNote: "Da 4 a 8 persone · consumazione inclusa nel prezzo del tavolo",
    menuNote: "Al tavolo: spirits, prosecco, champagne e cocktail après-ski.", seeDrinks: "Vedi il listino bevande",
    pickDayFirst: "Prima scegli un giorno dal calendario.",
    map: { slopes: "LATO PISTE", bar: "BAR", dj: "DJ", entrance: "INGRESSO", kitchen: "CUCINA" },
    tablePrice: "Prezzo tavolo", included: "Consumazione inclusa fino a {amount}", payNow: "Da pagare ora",
    guests: "Persone", name: "Nome e cognome", phone: "Telefono (con prefisso)", email: "Email", notes: "Note (facoltative)",
    accept: "Accetto i", termsLink: "Termini e condizioni", wholeNight: "Il tavolo è tuo per tutto l'après-ski.",
    nonRefundable: "Non rimborsabile", pay: "Continua al pagamento", sending: "Attendere…", close: "Chiudi",
    changeDay: "Cambia giorno",
    noDays: "Nessuna serata aperta alle prenotazioni in questo mese.",
    errors: {
      TABLE_TAKEN: "Zona appena esaurita, scegline un'altra.",
      DAY_CLOSED: "Questa serata non è prenotabile.",
      CUTOFF_PASSED: "Le prenotazioni online per oggi sono chiuse: chiamaci o vieni al locale.",
      ONLINE_CLOSED: "Prenotazioni online chiuse — chiamaci.",
      DATE_OUT_OF_RANGE: "Data non valida.",
      GUESTS_INVALID: "Numero di persone non valido.",
      CONTACT_INVALID: "Controlla nome, telefono ed email.",
      SLOT_INVALID: "Zona non valida.",
      GENERIC: "Qualcosa è andato storto. Riprova.",
    } as Record<string, string>,
  },
  page: {
    title: "La tua prenotazione", code: "Codice prenotazione", date: "Serata", time: "Orario après-ski",
    zone: "Zona", table: "Tavolo", guests: "Persone", total: "Totale da pagare", paid: "Pagato",
    included: "Consumazione inclusa fino a",
    status: {
      hold: "In attesa di pagamento", confirmed: "Confermata", manual: "Confermata dal locale",
      cancelled: "Annullata", expired: "Scaduta: il tavolo è stato liberato",
    } as Record<string, string>,
    holdLeft: "Tavolo bloccato per te ancora", payNow: "Paga ora",
    demoMode: "Modalità demo: nessun addebito reale. Il pagamento viene simulato.",
    testMode: "Modalità test Stripe: usa la carta 4242 4242 4242 4242, scadenza futura, CVC qualsiasi.",
    release: "Annulla e libera il tavolo", paidWait: "Pagamento ricevuto, stiamo confermando…",
    qrTitle: "Il tuo QR d'ingresso", qrHint: "Un solo QR per tutto il tavolo. Mostralo all'ingresso: vale una sola volta.",
    brightness: "Consiglio: alza la luminosità dello schermo al massimo.",
    ics: "Aggiungi al calendario", checkedIn: "Ingresso registrato alle {time}",
    nonRefundable: "Non rimborsabile: la prenotazione non prevede rimborsi, salvo annullamento dell'evento da parte del locale.",
    back: "Torna alla piantina", notFound: "Prenotazione non trovata.", emailSent: "Ti abbiamo inviato la conferma via email.",
  },
  drinks: {
    eyebrow: "Al tavolo e al bar", title: "Listino bevande",
    intro: "Listino beta con prezzi indicativi. Il listino definitivo è disponibile al locale.",
    featured: "Consigliato", beta: "Prezzi indicativi (beta)",
    zonesTitle: "Le zone tavolo",
    zonesText: {
      terrazza: "All'aperto sulla terrazza, vista piste e DJ set. Il cuore dell'après-ski.",
      chalet: "Al caldo nella sala in legno, vicino al bar. Perfetta per gruppi e serate fredde.",
    },
  },
  apres: {
    eyebrow: "Tutti i giorni in stagione", title: "Après-Ski",
    intro: "Quando gli impianti chiudono, la festa inizia. Musica, DJ set, cocktail e bombardini sulla terrazza ai piedi delle piste di Campo Smith.",
    blocks: [
      ["15:30 – 19:30", "DJ set e musica dal vivo nei weekend e nelle serate evento."],
      ["Terrazza sulle piste", "Ci arrivi con gli sci ai piedi: Harald's è a fondo pista a Campo Smith."],
      ["Tavoli riservati", "Prenota online la tua zona: consumazione inclusa, QR all'ingresso."],
    ] as [string, string][],
  },
  restaurant: {
    eyebrow: "Dalle 7:30 al dopocena", title: "Ristorante",
    intro: "Harald's è molto più di un ristorante: è un'esperienza alpina a 360°, dove il calore dello chalet di montagna incontra i servizi e l'accoglienza di un locale moderno.",
    blocks: [
      ["Colazione · dalle 7:30", "Brioches fragranti, mini panini, torte fatte in casa dalla nostra pasticceria interna."],
      ["Pranzo", "Primi piatti montani, secondi succulenti, contorni saporiti e insalate fresche."],
      ["Cena à la carte", "Specialità alpine rielaborate con cura, da vivere tra amici o in famiglia."],
    ] as [string, string][],
    reserve: "Per prenotare pranzo o cena chiamaci al",
  },
  contact: {
    title: "Contatti", address: "Indirizzo", phone: "Telefono", email: "Email", hours: "Orari",
    hoursText: "In stagione invernale: tutti i giorni dalle 7:30. Après-ski 15:30 – 19:30.",
    map: "Apri in Google Maps",
  },
  cookie: {
    text: "Usiamo solo cookie tecnici necessari al funzionamento del sito (lingua, prenotazione). Nessun cookie di profilazione.",
    ok: "Ho capito",
  },
};

export type Dict = typeof it;

const en: Dict = {
  nav: {
    apres: "Après-Ski", restaurant: "Restaurant", events: "Events", drinks: "Drinks list",
    contact: "Contact", book: "Book a table", staff: "Staff area",
  },
  footer: {
    tagline: "Ski restaurant, bar and après-ski at the foot of the Campo Smith slopes.",
    privacy: "Privacy policy", terms: "Booking terms and conditions", cookies: "Cookie preferences",
    rights: "All rights reserved.", beta: "Beta version — content and prices are indicative.",
    betaBanner: "Beta preview · sample data and simulated payments",
  },
  hero: {
    eyebrow: "Campo Smith · Bardonecchia",
    title1: "Harald's", title2: "Ski Restaurant · Bar · Après-Ski",
    subtitle: "From breakfast on the slopes to sunset on the terrace: alpine tradition, served with the style of a club.",
    ctaBook: "Book a table", ctaMenu: "Drinks list",
  },
  home: {
    eventsEyebrow: "Calendar", eventsTitle: "Upcoming events", allEvents: "See the calendar",
    apresEyebrow: "Every day · 3:30 – 7:30 pm",
    apresTitle: "Bardonecchia's après-ski",
    apresText: "Ski boots still on, the sun setting over Campo Smith and a DJ set slowly building. You arrive from the slopes and never leave.",
    restEyebrow: "From 7:30 am to after dinner",
    restTitle: "Alpine cooking, homemade",
    restText: "Breakfasts from our in-house pastry kitchen, mountain lunches and à la carte dinners: alpine tradition and local ingredients, reinterpreted by our chef.",
    stepsEyebrow: "Après-ski tables",
    stepsTitle: "Pick your area, pay online, enter with your QR",
    steps: [
      ["Choose", "Night, area and number of guests."],
      ["Pay", "Card, Apple Pay or Google Pay."],
      ["Get your QR", "Instant confirmation by email."],
      ["Walk in", "Staff scan the QR: your table is ready."],
    ],
    igEyebrow: "Instagram", igTitle: "Harald's on Instagram",
    igText: "Nights, DJ sets, food and photos from the slopes: all live on our profile.", igCta: "Follow us",
  },
  hero2: {
    eyebrow: "Campo Smith · Bardonecchia",
    line: "Ski Restaurant & Après-Ski",
    words: ["on the slopes", "at lunch", "at sunset", "on the dance floor"],
    lead: "Celebrate the mountain",
    ctaBook: "Book a table", ctaMenu: "See the drinks list", scroll: "Scroll",
    marquee: ["Après-ski daily 3:30 – 7:30 pm", "DJ sets", "Alpine cooking", "Bombardini & bubbles", "Campo Smith · Bardonecchia", "Terrace tables"],
  },
  intro: {
    eyebrow: "Welcome to Harald's",
    a: "From first breakfast to", b: "sunset", c: ", Harald's is where the mountain comes to", d: "celebrate", e: ".",
    stats: [["7:30", "we open with breakfast"], ["3:30", "après-ski kicks off"], ["2", "table areas to book"]],
  },
  duo: {
    restTitle: "Restaurant", restText: "Homemade alpine cooking, from morning pastries to à la carte dinners.", restCta: "The restaurant",
    apresTitle: "Après-Ski", apresText: "A slope-side terrace, DJ sets and bombardini: when the lifts close, Harald's lights up.", apresCta: "The après-ski",
  },
  tables: {
    eyebrow: "Reserved tables", title: "Your table,", titleItalic: "on the snow",
    text: "Pick the night and the area, pay online and get a QR: your table is ready when you arrive.",
    cta: "Book now",
  },
  finale: { title: "See you", titleItalic: "on the slopes", text: "Every day in season, at the bottom of the Campo Smith runs.", cta: "Book a table" },
  booking: {
    eyebrow: "Après-ski tables", title: "Book a table",
    intro: "Pick the night, then the area on the floor plan. Full payment online and QR at the door.",
    specialEvents: "Special events", calendarTitle: "Pick a day",
    prevMonth: "Previous month", nextMonth: "Next month",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    closed: "Closed", soldOut: "Sold out", cutoff: "Online closed", from: "from",
    pickZone: "Pick an area",
    zoneHint: "Slope-side terrace or chalet room. Our staff assign the table number.",
    zones: { terrazza: "Slope-side terrace", chalet: "Chalet room" },
    zonesShort: { terrazza: "Terrace", chalet: "Chalet" },
    freeTables: "tables left", legendNote: "4 to 8 guests · drinks included in the table price",
    menuNote: "At the table: spirits, prosecco, champagne and après-ski cocktails.", seeDrinks: "See the drinks list",
    pickDayFirst: "First pick a day from the calendar.",
    map: { slopes: "SLOPE SIDE", bar: "BAR", dj: "DJ", entrance: "ENTRANCE", kitchen: "KITCHEN" },
    tablePrice: "Table price", included: "Drinks included up to {amount}", payNow: "Due now",
    guests: "Guests", name: "Full name", phone: "Phone (with country code)", email: "Email", notes: "Notes (optional)",
    accept: "I accept the", termsLink: "Terms and conditions", wholeNight: "The table is yours for the whole après-ski.",
    nonRefundable: "Non-refundable", pay: "Continue to payment", sending: "Please wait…", close: "Close",
    changeDay: "Change day",
    noDays: "No nights open for booking this month.",
    errors: {
      TABLE_TAKEN: "This area just sold out, please pick another.",
      DAY_CLOSED: "This night can't be booked.",
      CUTOFF_PASSED: "Online bookings for today are closed: call us or come to the venue.",
      ONLINE_CLOSED: "Online bookings are closed — please call us.",
      DATE_OUT_OF_RANGE: "Invalid date.",
      GUESTS_INVALID: "Invalid number of guests.",
      CONTACT_INVALID: "Please check name, phone and email.",
      SLOT_INVALID: "Invalid area.",
      GENERIC: "Something went wrong. Please try again.",
    },
  },
  page: {
    title: "Your booking", code: "Booking code", date: "Night", time: "Après-ski time",
    zone: "Area", table: "Table", guests: "Guests", total: "Total due", paid: "Paid",
    included: "Drinks included up to",
    status: {
      hold: "Awaiting payment", confirmed: "Confirmed", manual: "Confirmed by the venue",
      cancelled: "Cancelled", expired: "Expired: the table was released",
    },
    holdLeft: "Table held for you for", payNow: "Pay now",
    demoMode: "Demo mode: no real charge. Payment is simulated.",
    testMode: "Stripe test mode: use card 4242 4242 4242 4242, any future expiry, any CVC.",
    release: "Cancel and release the table", paidWait: "Payment received, confirming…",
    qrTitle: "Your entry QR", qrHint: "One QR for the whole table. Show it at the door: it works once.",
    brightness: "Tip: turn your screen brightness all the way up.",
    ics: "Add to calendar", checkedIn: "Checked in at {time}",
    nonRefundable: "Non-refundable: no refunds unless the venue cancels the event.",
    back: "Back to the floor plan", notFound: "Booking not found.", emailSent: "We've emailed you the confirmation.",
  },
  drinks: {
    eyebrow: "At the table and at the bar", title: "Drinks list",
    intro: "Beta list with indicative prices. The final list is available at the venue.",
    featured: "Recommended", beta: "Indicative prices (beta)",
    zonesTitle: "Table areas",
    zonesText: {
      terrazza: "Outdoors on the terrace, slope views and DJ set. The heart of the après-ski.",
      chalet: "Warm inside the wooden room, next to the bar. Great for groups and cold nights.",
    },
  },
  apres: {
    eyebrow: "Every day in season", title: "Après-Ski",
    intro: "When the lifts close, the party starts. Music, DJ sets, cocktails and bombardini on the terrace at the foot of the Campo Smith slopes.",
    blocks: [
      ["3:30 – 7:30 pm", "DJ sets and live music on weekends and event nights."],
      ["Slope-side terrace", "Ski right in: Harald's is at the bottom of the Campo Smith runs."],
      ["Reserved tables", "Book your area online: drinks included, QR at the door."],
    ],
  },
  restaurant: {
    eyebrow: "From 7:30 am to after dinner", title: "Restaurant",
    intro: "Harald's is much more than a restaurant: it's a complete alpine experience, where the warmth of a mountain chalet meets the service of a modern venue.",
    blocks: [
      ["Breakfast · from 7:30", "Fresh croissants, mini sandwiches and homemade cakes from our in-house pastry kitchen."],
      ["Lunch", "Mountain first courses, hearty mains, tasty sides and fresh salads."],
      ["À la carte dinner", "Carefully reworked alpine specialities, to share with friends or family."],
    ],
    reserve: "To book lunch or dinner call us on",
  },
  contact: {
    title: "Contact", address: "Address", phone: "Phone", email: "Email", hours: "Opening hours",
    hoursText: "Winter season: every day from 7:30 am. Après-ski 3:30 – 7:30 pm.",
    map: "Open in Google Maps",
  },
  cookie: {
    text: "We only use technical cookies needed for the site to work (language, booking). No tracking cookies.",
    ok: "Got it",
  },
};

export const dicts: Record<Lang, Dict> = { it, en };

export const VENUE = {
  name: "Harald's Ski Restaurant Bar",
  short: "Harald's",
  address: "Regione Molino 18, Campo Smith",
  city: "10052 Bardonecchia (TO)",
  phone: "+39 0122 99002",
  phoneHref: "+39012299002",
  email: "info@haraldsrestaurant.com",
  instagram: "https://www.instagram.com/haralds_ski_restaurant_bar/",
  instagramHandle: "@haralds_ski_restaurant_bar",
  maps: "https://www.google.com/maps/search/?api=1&query=Harald%27s+Ski+Restaurant+Bar+Bardonecchia",
  apresStart: "15:30",
  apresEnd: "19:30",
};

export function formatEuro(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "it-IT", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(date: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "it-IT", { ...opts, timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
}
