import fS from "./assets/ribeye.webp";
import oS from "./assets/salmon.webp";
import hS from "./assets/sea-bass.webp";
import dS from "./assets/melon.webp";
import pS from "./assets/egg.webp";
import gS from "./assets/room.webp";

// Original illustrative data from the referenced demo, not Health Food reviews.
export const dishes = [
  {
    title: "Char grill",
    subtitle: "Ribeye",
    label: "Ribeye frites",
    image: fS,
    alt: "Grilled ribeye with fries, broccoli and a pot of ketchup on a dark plate",
    rating: 4.9,
    chef: "Chef Mara Lind",
    kitchen: "Ember Counter, Harbour St",
    description:
      "Dry-aged for 28 days, seared over charcoal and rested in brown butter. Thin fries, charred greens.",
    likes: 96,
    ingredients: [
      "Ribeye",
      "Fries",
      "Broccoli",
      "Green beans",
      "Smoked ketchup",
    ],
    accent: "#f6a37c",
  },
  {
    title: "Garden",
    subtitle: "Salmon",
    label: "Garden salmon salad",
    image: oS,
    alt: "Leafy salad with cured salmon, avocado and cucumber on a white plate",
    rating: 4.3,
    chef: "Chef Teo Ashe",
    kitchen: "The Greenhouse Table",
    description:
      "Citrus-cured salmon over rocket, frisée and avocado, with cucumber ribbons and a dill dressing.",
    likes: 71,
    ingredients: ["Cured salmon", "Avocado", "Rocket", "Cucumber", "Dill"],
    accent: "#f2a6c6",
  },
  {
    title: "Black lentil",
    subtitle: "Sea bass",
    label: "Lentil sea bass",
    image: hS,
    alt: "Seared sea bass with sesame on black lentils, a soft egg and carrots",
    rating: 4.6,
    chef: "Chef Ilse Noor",
    kitchen: "Saltwater Kitchen",
    description:
      "Crisp-skin sea bass on beluga lentils with a jammy egg, glazed carrots and a soy-honey jus.",
    likes: 88,
    ingredients: ["Sea bass", "Beluga lentils", "Soft egg", "Carrot", "Sesame"],
    accent: "#bcd98e",
  },
  {
    title: "Summer",
    subtitle: "Melon",
    label: "Summer melon salad",
    image: dS,
    alt: "Melon and cured ham salad with rocket and cherry tomatoes on a white plate",
    rating: 4.5,
    chef: "Chef Rafa Okoye",
    kitchen: "Pergola Café",
    description:
      "Cantaloupe, cured ham and blistered tomatoes, tossed with rocket and a squeeze of lime.",
    likes: 64,
    ingredients: ["Cantaloupe", "Cured ham", "Cherry tomato", "Rocket", "Lime"],
    accent: "#f5d26a",
  },
  {
    title: "Sunny",
    subtitle: "Side up",
    label: "Sunny side up",
    image: pS,
    alt: "A fried egg with a bright yolk on a white plate",
    rating: 4.7,
    chef: "Chef June Park",
    kitchen: "Morning Room",
    description:
      "One farm egg, basted in brown butter until the edges lace and the yolk just sets. Breakfast, done right.",
    likes: 120,
    ingredients: ["Farm egg", "Brown butter", "Sea salt", "Black pepper"],
    accent: "#9fcbe8",
  },
];
export const backdrop = gS;
