// Listino BETA: voci e prezzi indicativi, da sostituire con il listino reale di Harald's.
export interface DrinkItem { name: string; size?: string; price: number; top?: boolean }
export interface DrinkCategory { id: string; it: string; en: string; items: DrinkItem[] }

export const DRINKS: DrinkCategory[] = [
  {
    id: "apres", it: "Après-ski", en: "Après-ski",
    items: [
      { name: "Bombardino", price: 7, top: true },
      { name: "Calimero (bombardino al caffè)", price: 8 },
      { name: "Vin brulé", price: 6 },
      { name: "Hugo", price: 9 },
      { name: "Aperol Spritz", price: 9 },
      { name: "Moscow Mule", price: 11 },
    ],
  },
  {
    id: "beer", it: "Birre", en: "Beers",
    items: [
      { name: "Birra alla spina", size: "0,4 l", price: 6 },
      { name: "Birra alla spina", size: "1 l", price: 13 },
      { name: "Birra artigianale piemontese", size: "0,33 l", price: 7 },
    ],
  },
  {
    id: "bubbles", it: "Prosecco e champagne", en: "Prosecco & champagne",
    items: [
      { name: "Prosecco DOC", size: "0,75 l", price: 40 },
      { name: "Franciacorta Brut", size: "0,75 l", price: 60 },
      { name: "Moët & Chandon Brut Impérial", size: "0,75 l", price: 120 },
      { name: "Veuve Clicquot Brut", size: "0,75 l", price: 130 },
      { name: "Moët & Chandon Brut Impérial", size: "1,5 l", price: 250, top: true },
      { name: "Dom Pérignon", size: "0,75 l", price: 400 },
    ],
  },
  {
    id: "wine", it: "Vini", en: "Wines",
    items: [
      { name: "Calice di Barbera d'Asti", price: 7 },
      { name: "Calice di Nebbiolo Langhe", price: 9, top: true },
      { name: "Roero Arneis", size: "0,75 l", price: 32 },
      { name: "Barbera d'Alba Superiore", size: "0,75 l", price: 38 },
      { name: "Nebbiolo Langhe", size: "0,75 l", price: 42 },
      { name: "Barbaresco DOCG", size: "0,75 l", price: 65 },
      { name: "Barolo DOCG", size: "0,75 l", price: 80, top: true },
    ],
  },
  {
    id: "spirits", it: "Bottiglie spirits", en: "Spirits bottles",
    items: [
      { name: "Vodka Absolut", size: "0,7 l", price: 120 },
      { name: "Gin Bombay Sapphire", size: "0,7 l", price: 130 },
      { name: "Gin Hendrick's", size: "0,7 l", price: 150 },
      { name: "Vodka Belvedere", size: "0,7 l", price: 170 },
      { name: "Vodka Grey Goose", size: "0,7 l", price: 180, top: true },
      { name: "Gin Monkey 47", size: "0,5 l", price: 200 },
      { name: "Grey Goose", size: "1,5 l", price: 350 },
    ],
  },
  {
    id: "soft", it: "Analcolici e caldi", en: "Soft & hot drinks",
    items: [
      { name: "Acqua", size: "0,75 l", price: 3 },
      { name: "Soft drink", size: "0,33 l", price: 4 },
      { name: "Cioccolata calda con panna", price: 5 },
      { name: "Tè e tisane", price: 3 },
      { name: "Caffè", price: 1.5 },
    ],
  },
];
