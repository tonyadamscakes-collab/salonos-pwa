import manifest from "../content/manifest.json";

export interface Shot {
  file: string;
  thumb: string | null;
  alt: string;
  width: number;
  height: number;
  thumbWidth: number | null;
  thumbHeight: number | null;
}

interface ManifestImage {
  file: string;
  thumb: string | null;
  slot: string;
  alt: string;
  width: number;
  height: number;
  thumb_width?: number;
  thumb_height?: number;
}

const images = manifest.images as ManifestImage[];

const byFile = new Map(images.map((image) => [image.file, image]));
const bySlot = new Map<string, ManifestImage[]>();
for (const image of images) {
  const list = bySlot.get(image.slot) ?? [];
  list.push(image);
  bySlot.set(image.slot, list);
}

function toShot(image: ManifestImage | undefined, fallbackAlt: string): Shot {
  const file = image?.file ?? "treatment-other.webp";
  const found = image ?? byFile.get(file);
  return {
    file,
    thumb: found?.thumb ?? null,
    alt: found?.alt ?? fallbackAlt,
    width: found?.width ?? 1152,
    height: found?.height ?? 864,
    thumbWidth: found?.thumb_width ?? null,
    thumbHeight: found?.thumb_height ?? null,
  };
}

export function shotFile(file: string, alt?: string): Shot {
  const found = byFile.get(file);
  if (!found) {
    const stem = file.replace(/^.*\//, "").replace(/\.webp$/, "");
    return {
      file,
      thumb: file.endsWith(".svg") ? null : `thumbs/${stem}-600.webp`,
      alt: alt ?? stem,
      width: file.endsWith(".svg") ? 200 : 1152,
      height: file.endsWith(".svg") ? 200 : 864,
      thumbWidth: file.endsWith(".svg") ? null : 600,
      thumbHeight: file.endsWith(".svg") ? null : 450,
    };
  }
  return toShot(found, alt ?? file);
}

export function shotSlot(slot: string): Shot {
  return toShot(bySlot.get(slot)?.[0], slot);
}

const CATEGORY_FILE: Record<string, string> = {
  "Hair – Cutting & Styling": "treatment-hair-cut-1.webp",
  "Hair – Colour & Chemical": "treatment-hair-colour-1.webp",
  "Hair – Treatments": "treatment-hair-scalp.webp",
  "Beauty – Brows & Lashes": "treatment-brows-lashes.webp",
  "Beauty – Nails": "treatment-nails-manicure.webp",
  "Beauty – Waxing": "treatment-waxing-1.webp",
  "Beauty – Facials": "treatment-facials-1.webp",
  Packages: "treatment-bridal.webp",
  "Add-ons": "treatment-other.webp",
  "Massage & body": "treatment-massage.webp",
  Tanning: "treatment-tanning.webp",
  "Make-up": "treatment-makeup.webp",
  "Men's grooming": "treatment-mens.webp",
  "Texture & smoothing": "treatment-hair-texture.webp",
  Extensions: "treatment-extensions.webp",
};

export function categoryShot(category: string): Shot {
  return shotFile(CATEGORY_FILE[category] ?? "treatment-other.webp", category);
}

const POOLS = {
  cut: ["treatment-hair-cut-1.webp", "cut-blowdry.webp", "treatment-hair-cut-2.webp", "cut-fringe.webp", "keyword-curls.webp", "treatment-mens.webp", "keyword-fade.webp"],
  colour: ["treatment-hair-colour-1.webp", "keyword-balayage.webp", "keyword-highlights.webp", "treatment-hair-colour-2.webp", "keyword-vivid-colour.webp"],
  wax: ["wax-legs.webp", "wax-legs-full.webp", "wax-pot.webp", "wax-room.webp", "wax-underarm.webp", "wax-brow.webp", "wax-face.webp", "treatment-waxing-1.webp"],
  facial: ["treatment-facials-1.webp", "facial-mask.webp", "facial-glow.webp", "treatment-facials-2.webp", "keyword-hydra-facial.webp"],
  nails: ["treatment-nails-manicure.webp", "keyword-gel.webp", "keyword-pedicure.webp", "keyword-acrylic.webp", "treatment-nails-biab-1.webp", "treatment-nails-art.webp", "treatment-nails-biab-2.webp"],
  brows: ["treatment-brows-lashes.webp", "keyword-brow-lamination.webp", "keyword-lash-lift.webp", "keyword-threading.webp"],
  treatments: ["treatment-hair-scalp.webp", "treatment-hair-texture.webp", "product-hair-treatments.webp", "keyword-curls.webp"],
  packages: ["treatment-bridal.webp", "option-wedding-party.webp", "option-events.webp", "keyword-bridal-makeup.webp"],
};

/** One photo per locked brief treatment, so neighbouring cards do not share a file. */
const EXACT: Record<string, string> = {
  "Ladies Cut & Blow Dry Short": "treatment-hair-cut-1.webp",
  "Ladies Cut & Blow Dry Long": "treatment-hair-cut-2.webp",
  "Mens Cut": "treatment-mens.webp",
  "Restyle Cut": "keyword-fade.webp",
  "Blow Dry Short": "cut-blowdry.webp",
  "Blow Dry Long": "keyword-curls.webp",
  "Hair Up (occasion)": "hair-up.webp",
  "Fringe Trim": "cut-fringe.webp",
  "Child Cut (under 12)": "child-chair.webp",
  "Root Tint": "treatment-hair-colour-1.webp",
  "Full Head Colour": "treatment-hair-colour-2.webp",
  "Balayage Full": "keyword-balayage.webp",
  "Half Head Highlights": "keyword-highlights.webp",
  Toner: "keyword-vivid-colour.webp",
  "Colour Correction": "product-colour-care.webp",
  "Keratin Smoothing Short": "treatment-hair-texture.webp",
  "Keratin Smoothing Long": "treatment-extensions.webp",
  "Olaplex Stand-alone Treatment": "product-hair-treatments.webp",
  "K18 Molecular Repair Treatment": "product-k18.webp",
  "Deep Conditioning Mask": "treatment-other.webp",
  "Scalp Treatment": "treatment-hair-scalp.webp",
  "Brow Shape & Tint": "keyword-threading.webp",
  "Brow Lamination": "keyword-brow-lamination.webp",
  "Lash Lift & Tint": "keyword-lash-lift.webp",
  "Classic Lash Full Set": "lash-classic.webp",
  "Volume Lash Full Set": "treatment-brows-lashes.webp",
  "Lash Infill": "lash-infill.webp",
  "Gel Manicure": "keyword-gel.webp",
  "Gel Pedicure": "keyword-pedicure.webp",
  "Builder Gel Overlay": "treatment-nails-biab-1.webp",
  "Full Set Extensions": "keyword-acrylic.webp",
  Infill: "treatment-nails-biab-2.webp",
  "Half Leg": "wax-legs.webp",
  "Full Leg": "wax-legs-full.webp",
  Hollywood: "wax-pot.webp",
  Brazilian: "wax-room.webp",
  Underarm: "wax-underarm.webp",
  "Brow Wax": "wax-brow.webp",
  "Full Face Wax": "wax-face-clear.webp",
  "Express Facial 30 min": "facial-mask.webp",
  "Full Facial 60 min": "treatment-facials-1.webp",
  Dermaplaning: "facial-glow.webp",
  "Hydrafacial-style": "keyword-hydra-facial.webp",
  "Bridal Hair + Makeup": "treatment-bridal.webp",
  "Party Hair Up + Makeup": "party-look.webp",
  "Monthly Membership": "membership-card.webp",
};

function poolFor(name: string, category: string): string[] {
  const exact = EXACT[name];
  if (exact) return [exact];
  const n = name.toLowerCase();
  if (n.includes("monthly membership")) return ["membership-card.webp"];
  if (n.includes("hollywood")) return ["wax-pot.webp"];
  if (n.includes("brazilian")) return ["wax-room.webp"];
  if (n.includes("full face")) return ["wax-face-clear.webp"];
  if (n.includes("brow wax")) return ["wax-brow.webp"];
  if (n.includes("underarm")) return ["wax-underarm.webp"];
  if (n.includes("full leg")) return ["wax-legs-full.webp"];
  if (n.includes("half leg") || n.includes("leg wax")) return ["wax-legs.webp"];
  if (n === "hair up (occasion)" || n.startsWith("hair up")) return ["hair-up.webp"];
  if (n.includes("party hair")) return ["party-look.webp"];
  if (n.includes("child")) return ["child-chair.webp"];
  if (n.includes("classic lash")) return ["lash-classic.webp"];
  if (n.includes("lash infill")) return ["lash-infill.webp"];
  if (n.includes("volume lash")) return ["treatment-brows-lashes.webp", "keyword-lash-lift.webp"];
  if (n.includes("bridal")) return ["treatment-bridal.webp", "keyword-bridal-makeup.webp", "option-wedding-party.webp"];
  if (n.includes("balayage") || n.includes("ombre")) return ["keyword-balayage.webp", "treatment-hair-colour-2.webp", "keyword-highlights.webp"];
  if (n.includes("half head")) return ["treatment-hair-colour-2.webp", "keyword-vivid-colour.webp", "treatment-hair-colour-1.webp"];
  if (n.includes("highlight") || n.includes("full head colour") || n.includes("full head color")) {
    return ["keyword-highlights.webp", "treatment-hair-colour-1.webp", "keyword-vivid-colour.webp"];
  }
  if (n.includes("pedicure")) return ["keyword-pedicure.webp", "treatment-nails-manicure.webp", "keyword-gel.webp"];
  if (n.includes("gel") || n.includes("biab") || n.includes("builder")) return ["keyword-gel.webp", "treatment-nails-biab-2.webp", "treatment-nails-biab-1.webp"];
  if (n.includes("acrylic") || (n.includes("extension") && category.includes("Nail")) || n === "infill") {
    return ["keyword-acrylic.webp", "treatment-nails-art.webp", "treatment-nails-biab-1.webp"];
  }
  if (n.includes("lash")) return ["keyword-lash-lift.webp", "treatment-brows-lashes.webp"];
  if (n.includes("brow")) return ["keyword-brow-lamination.webp", "keyword-threading.webp", "treatment-brows-lashes.webp"];
  if (n.includes("hydra") || n.includes("dermaplan")) return ["keyword-hydra-facial.webp", "facial-glow.webp", "facial-mask.webp"];
  if (n.includes("facial")) return POOLS.facial;
  if (n.includes("wax") || n.includes("hollywood") || n.includes("brazilian") || category.includes("Wax")) return POOLS.wax;
  if (/\bmens\b|\bmen's\b|\bbeard\b|\bfade\b/.test(n)) {
    return ["treatment-mens.webp", "keyword-fade.webp", "keyword-beard.webp"];
  }
  if (n.includes("blow")) return ["cut-blowdry.webp", "treatment-hair-cut-2.webp", "keyword-curls.webp"];
  if (n.includes("fringe")) return ["cut-fringe.webp", "treatment-hair-cut-1.webp"];
  if (n.includes("child")) return ["treatment-hair-cut-2.webp", "cut-fringe.webp", "keyword-curls.webp"];
  if (category.includes("Cutting")) return POOLS.cut;
  if (category.includes("Colour") || category.includes("Color")) return POOLS.colour;
  if (category.includes("Nail")) return POOLS.nails;
  if (category.includes("Facial")) return POOLS.facial;
  if (category.includes("Wax")) return POOLS.wax;
  if (category.includes("Brow") || category.includes("Lash")) return POOLS.brows;
  if (category.includes("Treatment")) return POOLS.treatments;
  if (category === "Packages") return POOLS.packages;
  const fallback = CATEGORY_FILE[category] ?? "treatment-other.webp";
  return [fallback, "treatment-other.webp", "salon-interior.webp"];
}

/** Rotate through a pool. `avoid` skips the photo used on the previous card. */
export function treatmentShot(name: string, category: string, index = 0, avoid?: string): Shot {
  const pool = poolFor(name, category);
  let cursor = Math.abs(index) % pool.length;
  if (pool[cursor] === avoid && pool.length > 1) cursor = (cursor + 1) % pool.length;
  const file = pool[cursor] ?? pool[0] ?? "treatment-other.webp";
  return shotFile(file, name);
}

export function treatmentShots(rows: { name: string; category: string }[]): Shot[] {
  const shots: Shot[] = [];
  rows.forEach((row, index) => {
    shots.push(treatmentShot(row.name, row.category, index, shots[index - 1]?.file));
  });
  return shots;
}

export function productShot(name: string): Shot {
  const haystack = name.toLowerCase();
  let file = "product-colour-care.webp";
  if (haystack.includes("k18")) file = "product-k18.webp";
  else if (haystack.includes("shampoo") || haystack.includes("conditioner")) file = "product-shampoo-conditioner.webp";
  else if (haystack.includes("mask") || haystack.includes("no.3")) file = "product-hair-treatments.webp";
  else if (haystack.includes("nail")) file = "product-nails.webp";
  else if (haystack.includes("serum") || haystack.includes("skin")) file = "product-skincare.webp";
  else if (
    haystack.includes("styling") ||
    haystack.includes("heat") ||
    haystack.includes("elixir") ||
    haystack.includes("dream coat") ||
    haystack.includes("oil") ||
    haystack.includes("moroccan")
  ) {
    file = "product-styling.webp";
  } else if (haystack.includes("beard") || haystack.includes("men")) file = "product-mens-grooming.webp";
  else if (haystack.includes("gift")) file = "product-gift-sets.webp";
  else if (haystack.includes("dryer") || haystack.includes("brush") || haystack.includes("scissor")) file = "product-tools.webp";
  return shotFile(file, name);
}

const AVATARS = [1, 2, 3, 4, 5, 6];

export function avatarFor(id: string): Shot {
  let hash = 0;
  for (const char of id) hash = (hash + char.charCodeAt(0)) % AVATARS.length;
  const n = AVATARS[hash] ?? 1;
  return shotFile(`avatars/avatar-placeholder-${n}.svg`, "Sample stylist avatar. Not a real person.");
}

export const HERO = {
  desktop: shotFile("hero.webp"),
  mobile: shotFile("hero-mobile.webp"),
  banner: shotFile("banner-bg.webp"),
  interior: shotFile("salon-interior.webp"),
};

export const OPTIONS = {
  stylist: shotSlot("option:Choose your stylist"),
  home: shotSlot("option:Home visit"),
  wedding: shotSlot("option:Wedding party"),
  events: shotSlot("option:Events"),
  loyalty: shotSlot("option:Loyalty club"),
  vouchers: shotSlot("option:Gift vouchers"),
  shop: shotSlot("option:Online shop"),
  delivery: shotSlot("option:Delivery"),
  consult: shotSlot("option:Consultation & patch test"),
  offers: shotSlot("option:Special offers"),
  about: shotSlot("option:About us"),
  careers: shotSlot("option:Careers & rent-a-chair"),
};
