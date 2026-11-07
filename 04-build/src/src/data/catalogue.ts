import type { ServiceRecord } from "./model";
import { SITE_ID } from "./model";
import { parseDurationText } from "../domain/time";

type Row = [
  id: string,
  category: string,
  name: string,
  minutes: number | null,
  price: number | null,
  priceType: ServiceRecord["priceType"],
  patch: boolean,
  chemical: boolean,
  processing: number,
  finish: number,
  location: ServiceRecord["location"],
];

/** Locked brief catalogue. Prices are the brief's, not invented. */
const APPENDIX: Row[] = [
  ["a1", "Hair – Cutting & Styling", "Ladies Cut & Blow Dry Short", 45, 4200, "tier", false, false, 0, 0, "salon"],
  ["a2", "Hair – Cutting & Styling", "Ladies Cut & Blow Dry Long", 60, 5200, "tier", false, false, 0, 0, "salon"],
  ["a3", "Hair – Cutting & Styling", "Mens Cut", 30, 2200, "tier", false, false, 0, 0, "salon"],
  ["a4", "Hair – Cutting & Styling", "Restyle Cut", 75, null, "quote", false, false, 0, 0, "salon"],
  ["a5", "Hair – Cutting & Styling", "Blow Dry Short", 30, 2800, "tier", false, false, 0, 0, "salon"],
  ["a6", "Hair – Cutting & Styling", "Blow Dry Long", 40, 3600, "tier", false, false, 0, 0, "salon"],
  ["a7", "Hair – Cutting & Styling", "Hair Up (occasion)", 60, 5500, "tier", false, false, 0, 0, "both"],
  ["a8", "Hair – Cutting & Styling", "Fringe Trim", 15, 1200, "tier", false, false, 0, 0, "salon"],
  ["a9", "Hair – Cutting & Styling", "Child Cut (under 12)", 30, 1800, "tier", false, false, 0, 0, "salon"],
  ["a10", "Hair – Colour & Chemical", "Root Tint", 75, 4800, "tier", true, true, 30, 15, "salon"],
  ["a11", "Hair – Colour & Chemical", "Full Head Colour", 120, 8500, "tier", true, true, 30, 30, "salon"],
  ["a12", "Hair – Colour & Chemical", "Balayage Full", 180, 13000, "tier", true, true, 60, 30, "salon"],
  ["a13", "Hair – Colour & Chemical", "Half Head Highlights", 120, 9500, "tier", true, true, 30, 30, "salon"],
  ["a14", "Hair – Colour & Chemical", "Toner", 30, 2800, "tier", true, true, 10, 5, "salon"],
  ["a15", "Hair – Colour & Chemical", "Colour Correction", 240, null, "quote", true, true, 90, 30, "salon"],
  ["a16", "Hair – Colour & Chemical", "Keratin Smoothing Short", 150, 14000, "tier", true, true, 60, 20, "salon"],
  ["a17", "Hair – Colour & Chemical", "Keratin Smoothing Long", 180, 18000, "tier", true, true, 70, 20, "salon"],
  ["a18", "Hair – Treatments", "Olaplex Stand-alone Treatment", 30, 3500, "tier", false, false, 0, 0, "salon"],
  ["a19", "Hair – Treatments", "K18 Molecular Repair Treatment", 20, 4000, "tier", false, false, 0, 0, "salon"],
  ["a20", "Hair – Treatments", "Deep Conditioning Mask", 20, 1800, "tier", false, false, 0, 0, "salon"],
  ["a21", "Hair – Treatments", "Scalp Treatment", 30, 3200, "tier", false, false, 0, 0, "salon"],
  ["a22", "Beauty – Brows & Lashes", "Brow Shape & Tint", 20, 1800, "tier", true, true, 0, 0, "salon"],
  ["a23", "Beauty – Brows & Lashes", "Brow Lamination", 45, 4200, "tier", false, false, 0, 0, "salon"],
  ["a24", "Beauty – Brows & Lashes", "Lash Lift & Tint", 60, 4800, "tier", true, true, 0, 0, "salon"],
  ["a25", "Beauty – Brows & Lashes", "Classic Lash Full Set", 90, 7500, "tier", false, false, 0, 0, "salon"],
  ["a26", "Beauty – Brows & Lashes", "Volume Lash Full Set", 120, 9500, "tier", false, false, 0, 0, "salon"],
  ["a27", "Beauty – Brows & Lashes", "Lash Infill", 45, 4200, "tier", false, false, 0, 0, "salon"],
  ["a28", "Beauty – Nails", "Gel Manicure", 45, 2800, "tier", false, false, 0, 0, "salon"],
  ["a29", "Beauty – Nails", "Gel Pedicure", 60, 3500, "tier", false, false, 0, 0, "salon"],
  ["a30", "Beauty – Nails", "Builder Gel Overlay", 60, 3800, "tier", false, false, 0, 0, "salon"],
  ["a31", "Beauty – Nails", "Full Set Extensions", 90, 4800, "tier", false, false, 0, 0, "salon"],
  ["a32", "Beauty – Nails", "Infill", 45, 3200, "tier", false, false, 0, 0, "salon"],
  ["a33", "Beauty – Waxing", "Half Leg", 20, 1800, "tier", false, false, 0, 0, "salon"],
  ["a34", "Beauty – Waxing", "Full Leg", 40, 3200, "tier", false, false, 0, 0, "salon"],
  ["a35", "Beauty – Waxing", "Hollywood", 30, 3800, "tier", false, false, 0, 0, "salon"],
  ["a36", "Beauty – Waxing", "Brazilian", 25, 3400, "tier", false, false, 0, 0, "salon"],
  ["a37", "Beauty – Waxing", "Underarm", 10, 1200, "tier", false, false, 0, 0, "salon"],
  ["a38", "Beauty – Waxing", "Brow Wax", 10, 1000, "tier", false, false, 0, 0, "salon"],
  ["a39", "Beauty – Waxing", "Full Face Wax", 25, 2800, "tier", false, false, 0, 0, "salon"],
  ["a40", "Beauty – Facials", "Express Facial 30 min", 30, 3800, "tier", false, false, 0, 0, "salon"],
  ["a41", "Beauty – Facials", "Full Facial 60 min", 60, 6200, "tier", false, false, 0, 0, "salon"],
  ["a42", "Beauty – Facials", "Dermaplaning", 45, 5500, "tier", false, false, 0, 0, "salon"],
  ["a43", "Beauty – Facials", "Hydrafacial-style", 50, 7500, "tier", false, false, 0, 0, "salon"],
  ["a44", "Packages", "Bridal Hair + Makeup", null, null, "quote", false, false, 0, 0, "event"],
  ["a45", "Packages", "Party Hair Up + Makeup", 90, 9500, "fixed", false, false, 0, 0, "both"],
  ["a46", "Packages", "Monthly Membership", null, null, "monthly", false, false, 0, 0, "salon"],
  ["a47", "Add-ons", "Extra 15 min", 15, 1200, "fixed", false, false, 0, 0, "salon"],
  ["a48", "Add-ons", "Long/Thick Hair Supplement", 0, null, "range", false, false, 0, 0, "salon"],
  ["a49", "Add-ons", "Toner Add-on", 0, 1800, "fixed", false, false, 0, 0, "salon"],
  ["a50", "Add-ons", "Deep Conditioning Add-on", 0, 1200, "fixed", false, false, 0, 0, "salon"],
];

const HAIR = ["jordan", "casey", "morgan", "riley", "sam"];
const COLOUR = ["jordan", "casey", "riley"];
const COLOUR_SENIOR = ["jordan", "riley"];
const TREAT = ["jordan", "casey", "riley"];
const BEAUTY = ["alex"];
const NAILS = ["drew"];
const PARTY = ["jordan", "riley", "alex"];

function qualified(id: string): string[] {
  if (id === "a12" || id === "a15") return COLOUR_SENIOR;
  if (["a10", "a11", "a13", "a14", "a16", "a17"].includes(id)) return COLOUR;
  if (id.startsWith("a") && Number(id.slice(1)) <= 9) return HAIR;
  if (["a18", "a19", "a20", "a21"].includes(id)) return TREAT;
  if (Number(id.slice(1)) >= 22 && Number(id.slice(1)) <= 27) return BEAUTY;
  if (Number(id.slice(1)) >= 28 && Number(id.slice(1)) <= 32) return NAILS;
  if (Number(id.slice(1)) >= 33 && Number(id.slice(1)) <= 43) return BEAUTY;
  if (id === "a45" || id === "a44") return PARTY;
  return HAIR;
}

export function appendixServices(): ServiceRecord[] {
  return APPENDIX.map((row) => {
    const [id, category, name, minutes, price, priceType, patch, chemical, processing, finish, location] = row;
    const range = id === "a48";
    return {
      id,
      siteId: SITE_ID,
      source: "brief",
      category,
      name,
      durationMin: minutes,
      durationText: minutes == null ? "" : `${minutes} min`,
      durationOptions: [],
      processingMin: processing,
      finishMin: finish,
      priceType,
      basePence: price,
      rangeMinPence: range ? 800 : null,
      rangeMaxPence: range ? 1500 : null,
      patchTest: patch,
      chemical,
      under16: id === "a9",
      depositRule: null,
      qualifiedStaffIds: qualified(id),
      linkedProductIds: id === "a10" || id === "a11" ? ["r1"] : id === "a19" ? ["r5"] : [],
      photoNote: "No photo yet. Upload the salon's own photo in admin. SalonOS does not ship brand images.",
      onlineBookable: priceType !== "quote" && priceType !== "monthly" && id !== "a47" && id !== "a48" && id !== "a49" && id !== "a50",
      active: true,
      accepted: true,
      location,
      sourceUrl: "",
      sourceName: "Locked brief Appendix A",
      confidence: "Locked",
      contraindications: "",
      minTier: null,
    };
  });
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cell = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else quoted = false;
      } else cell += char;
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (char !== "\r") cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export function seedTreatmentsFromCsv(csv: string): ServiceRecord[] {
  const table = parseCsv(csv.trim());
  const header = table[0] ?? [];
  const index = (name: string) => header.indexOf(name);
  const rows = table.slice(1).filter((columns) => columns.some((column) => column.trim()));
  return rows.map((columns, position) => {
    const durationText = columns[index("typical_duration_text")] ?? "";
    const parsed = parseDurationText(durationText);
    const patchText = columns[index("patch_test_required")] ?? "";
    const category = columns[index("category")] ?? "Uncategorised";
    return {
      id: `seed-${position + 1}`,
      siteId: SITE_ID,
      source: "seed" as const,
      category: mapCategory(category),
      name: columns[index("treatment_name")] ?? "",
      durationMin: parsed.minutes,
      durationText,
      durationOptions: parsed.options,
      processingMin: 0,
      finishMin: 0,
      priceType: "tier" as const,
      basePence: null,
      rangeMinPence: null,
      rangeMaxPence: null,
      patchTest: /48|patch/i.test(patchText),
      chemical: /colour|color|tint|chemical|keratin|lash|brow/i.test(`${category} ${patchText}`),
      under16: false,
      depositRule: null,
      qualifiedStaffIds: [],
      linkedProductIds: [],
      photoNote: "",
      onlineBookable: false,
      active: false,
      accepted: false,
      location: /bridal|event|wedding/i.test(category) ? "event" : "salon",
      sourceUrl: columns[index("source_url")] ?? "",
      sourceName: columns[index("source_name")] ?? "",
      confidence: columns[index("confidence")] ?? "",
      contraindications: "",
      minTier: null,
    };
  });
}

function mapCategory(seedCategory: string): string {
  const known: Record<string, string> = {
    "Hair - cut & finish": "Hair – Cutting & Styling",
    "Hair - colour": "Hair – Colour & Chemical",
    "Hair - treatments & scalp": "Hair – Treatments",
    "Texture & smoothing": "Hair – Colour & Chemical",
    Extensions: "Hair – Treatments",
    "Nails - manicure & pedicure": "Beauty – Nails",
    "Nails - gel, BIAB, acrylic & dip": "Beauty – Nails",
    "Nails - art & add-ons": "Beauty – Nails",
    "Brows & lashes": "Beauty – Brows & Lashes",
    "Waxing & threading": "Beauty – Waxing",
    "Facials & skin": "Beauty – Facials",
    "Massage & body": "Massage & body",
    Tanning: "Tanning",
    "Make-up": "Make-up",
    "Men's grooming & barbering": "Men's grooming",
    "Bridal & events": "Packages",
  };
  return known[seedCategory] ?? seedCategory;
}

export const CATALOGUE_CATEGORIES = [
  "Hair – Cutting & Styling",
  "Hair – Colour & Chemical",
  "Hair – Treatments",
  "Beauty – Brows & Lashes",
  "Beauty – Nails",
  "Beauty – Waxing",
  "Beauty – Facials",
  "Packages",
  "Add-ons",
  "Massage & body",
  "Tanning",
  "Make-up",
  "Men's grooming",
  "Texture & smoothing",
  "Extensions",
];
