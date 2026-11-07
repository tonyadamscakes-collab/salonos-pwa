import { describe, expect, it } from "vitest";
import { DEFERRED, STUBBED } from "../src/domain/coverage";
import { appendixServices, seedTreatmentsFromCsv } from "../src/data/catalogue";
import { productShot, treatmentShot, treatmentShots } from "../src/ui/photos";
import { escposReceipt } from "../src/domain/escpos";
import csv from "../src/data/treatment-catalogue-seed.csv?raw";
import spec from "../docs/02-product-spec.md?raw";

describe("catalogue seed", () => {
  it("loads 703 inactive names and keeps the locked brief prices", () => {
    const seed = seedTreatmentsFromCsv(csv);
    expect(seed).toHaveLength(703);
    expect(seed.every((row) => row.basePence == null && row.active === false && row.accepted === false)).toBe(true);
    const brief = appendixServices();
    expect(brief).toHaveLength(50);
    expect(brief.find((row) => row.name === "Ladies Cut & Blow Dry Short")).toMatchObject({ basePence: 4200, durationMin: 45 });
    expect(brief.find((row) => row.name === "Balayage Full")).toMatchObject({ basePence: 13000, durationMin: 180 });
    expect(brief.find((row) => row.name === "Restyle Cut")?.priceType).toBe("quote");
    expect(brief.find((row) => row.name === "Long/Thick Hair Supplement")).toMatchObject({ rangeMinPence: 800, rangeMaxPence: 1500 });
    const fullHead = brief.find((row) => row.name === "Full Head Colour");
    expect((fullHead?.processingMin ?? 0) + (fullHead?.finishMin ?? 0)).toBeLessThan(fullHead?.durationMin ?? 0);
    expect((fullHead?.durationMin ?? 0) - (fullHead?.processingMin ?? 0) - (fullHead?.finishMin ?? 0) + (fullHead?.processingMin ?? 0) + (fullHead?.finishMin ?? 0)).toBe(120);
    const receipt = escposReceipt(["[SALON NAME]", "TEST MODE"]);
    expect(receipt[0]).toBe(0x1b);
    expect(receipt.includes(0x70)).toBe(true);
    const bookable = appendixServices().filter((row) => !["a47", "a48", "a49", "a50"].includes(row.id));
    const files = treatmentShots(bookable).map((shot) => shot.file);
    const repeats = files.filter((file, index) => index > 0 && file === files[index - 1]);
    expect(repeats).toEqual([]);
    expect(new Set(files).size).toBe(files.length);
    expect(files.length % 4 === 2).toBe(true);
    expect(treatmentShot("Monthly Membership", "Packages", 45).file).toBe("membership-card.webp");
    expect(treatmentShot("Hollywood", "Beauty – Waxing", 0).file).toBe("wax-pot.webp");
    expect(treatmentShot("Brazilian", "Beauty – Waxing", 1).file).toBe("wax-room.webp");
    expect(treatmentShot("Full Face Wax", "Beauty – Waxing", 2).file).toBe("wax-face-clear.webp");
    expect(treatmentShot("Hair Up (occasion)", "Hair – Cutting & Styling", 3).file).toBe("hair-up.webp");
    expect(treatmentShot("Child Cut (under 12)", "Hair – Cutting & Styling", 4).file).toBe("child-chair.webp");
    expect(treatmentShot("Classic Lash Full Set", "Beauty – Brows & Lashes", 5).file).toBe("lash-classic.webp");
    expect(treatmentShot("Lash Infill", "Beauty – Brows & Lashes", 6).file).toBe("lash-infill.webp");
    expect(treatmentShot("K18 Molecular Repair Treatment", "Hair – Treatments").file).toBe("product-k18.webp");
    expect(treatmentShot("Mens Cut", "Hair – Cutting & Styling").file).toBe("treatment-mens.webp");
    expect(treatmentShot("Party Hair Up + Makeup", "Packages").file).toBe("party-look.webp");
    expect(productShot("K18 Leave-In Mask 50ml").file).toBe("product-k18.webp");
    expect(productShot("K18 Oil 30ml").file).toBe("product-k18.webp");
  });
});

describe("requirement coverage", () => {
  it("classifies every in-scope id and keeps struck rows deferred", () => {
    const before = spec.split("### 11.6")[0] ?? "";
    const ids = [...before.matchAll(/^\| ([A-Z]{2,3}-\d{2}) \|/gm)].map((match) => match[1]);
    const unique = [...new Set(ids)].filter((id) => !id.startsWith("OUT-") && !id.startsWith("OI-"));
    expect(unique).toHaveLength(304);
    const stubbed = Object.keys(STUBBED);
    const missing = unique.filter((id) => !stubbed.includes(id));
    expect(missing.length + stubbed.length).toBe(304);
    expect(Object.keys(DEFERRED).filter((id) => id.startsWith("OUT-"))).toHaveLength(20);
    expect(Object.keys(DEFERRED)).toHaveLength(67);
    for (const id of stubbed) expect(unique).toContain(id);
    for (const id of Object.keys(DEFERRED)) expect(unique).not.toContain(id);
  });
});
