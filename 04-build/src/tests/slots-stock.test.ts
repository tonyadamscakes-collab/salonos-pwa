import { describe, expect, it } from "vitest";
import { clashReason, segmentsOf, slotsOnShift, timeline, totalMinutes } from "../src/domain/slots";
import { available, canTake, formulaDeductions, onHand, rangePriceAllowed, reserved, searchProducts, stockTakeVariance, type StockMovement } from "../src/domain/stock";
import { parseDurationText } from "../src/domain/time";
import { londonWallToUtc } from "../src/domain/time";
import {
  applyOnePromo,
  assessPatchTest,
  cancellationDeadline,
  manufacturerCheckRequired,
  planProductImport,
  postcodeAllowed,
  quoteBooking,
  refuseSecondPromo,
  syncBookings,
  waiverReady,
  withinCancellation,
} from "../src/domain/booking";
import { can, managerSwitches, type Actor } from "../src/domain/access";
import { applyIdempotent } from "../src/domain/finance";

const multipliers = { junior: 0.85, stylist: 1, senior: 1.2, director: 1.4 };

describe("slot length", () => {
  it("follows the treatment duration and leaves processing time bookable", () => {
    const colour = segmentsOf(120, 30, 30);
    expect(totalMinutes(colour)).toBe(120);
    const start = londonWallToUtc(2026, 11, 2, 10, 0).getTime();
    const parts = timeline(start, colour);
    const processing = parts.find((part) => part.kind === "processing");
    expect(processing).toBeTruthy();
    const duringProcessing = slotsOnShift({
      dayKey: "2026-11-02",
      shift: { startMin: 9 * 60, endMin: 18 * 60 },
      segments: [{ kind: "active", minutes: 30 }],
      occupancy: {
        active: parts.filter((part) => part.kind === "active"),
        blocks: [],
      },
      staffId: "jordan",
    });
    expect(duringProcessing.some((slot) => slot.startMs === londonWallToUtc(2026, 11, 2, 11, 0).getTime())).toBe(true);
    const clash = slotsOnShift({
      dayKey: "2026-11-02",
      shift: { startMin: 9 * 60, endMin: 18 * 60 },
      segments: [{ kind: "active", minutes: 30 }],
      occupancy: { active: parts.filter((part) => part.kind === "active"), blocks: [] },
      staffId: "jordan",
    });
    expect(clash.some((slot) => slot.startMs === start)).toBe(false);
  });

  it("does not offer a short gap for a long treatment", () => {
    const offers = slotsOnShift({
      dayKey: "2026-11-02",
      shift: { startMin: 10 * 60, endMin: 11 * 60 },
      segments: [{ kind: "active", minutes: 180 }],
      occupancy: { active: [], blocks: [] },
      staffId: "jordan",
    });
    expect(offers).toHaveLength(0);
  });

  it("refuses overlapping active time and blocked time", () => {
    const start = londonWallToUtc(2026, 11, 2, 10, 0).getTime();
    const parts = timeline(start, [{ kind: "active", minutes: 45 }]);
    expect(clashReason(parts, { active: [{ startMs: start, endMs: start + 15 * 60_000 }], blocks: [] })).toMatch(/overlaps work/i);
    expect(clashReason(parts, { active: [], blocks: [{ startMs: start, endMs: start + 15 * 60_000 }] })).toMatch(/blocked/i);
  });

  it("parses catalogue duration text, including ranges", () => {
    expect(parseDurationText("1hr").minutes).toBe(60);
    expect(parseDurationText("1 hr, 30 mins").minutes).toBe(90);
    expect(parseDurationText("1 hr 45min").minutes).toBe(105);
    expect(parseDurationText("1.5 hours").minutes).toBe(90);
    expect(parseDurationText("2.5 hrs").minutes).toBe(150);
    expect(parseDurationText("30minutes").minutes).toBe(30);
    expect(parseDurationText("").minutes).toBeNull();
    expect(parseDurationText("15/55 min").options).toEqual([15, 55]);
    expect(parseDurationText("25/55/85 min").options).toEqual([25, 55, 85]);
  });
});

describe("stock ledger", () => {
  const base = (partial: Partial<StockMovement> & Pick<StockMovement, "id" | "qty" | "reason">): StockMovement => ({
    siteId: "site-1",
    productId: "shade-a",
    location: "backbar",
    unit: "gram",
    ref: "visit",
    at: "2026-11-01T10:00:00.000Z",
    note: "",
    ...partial,
  });

  it("deducts grams used and waste, and reverses them as new movements", () => {
    const lines = formulaDeductions([
      { productId: "shade-a", grams: 40, wasteGrams: 2 },
      { productId: "developer", grams: 20.5, wasteGrams: 0 },
    ]);
    expect(lines[0]).toEqual({ productId: "shade-a", grams: 40, wasteGrams: 2 });
    expect(() => formulaDeductions([{ productId: "x", grams: 1.25, wasteGrams: 0 }])).toThrow(/decimal/);
    const movements: StockMovement[] = [
      base({ id: "in", qty: 100, reason: "goods-in" }),
      base({ id: "use", qty: -40, reason: "formula" }),
      base({ id: "waste", qty: -2, reason: "waste" }),
    ];
    expect(onHand(movements, "shade-a", "backbar")).toBe(58);
    movements.push(base({ id: "void-use", qty: 40, reason: "formula", note: "void" }));
    movements.push(base({ id: "void-waste", qty: 2, reason: "waste", note: "void" }));
    expect(onHand(movements, "shade-a", "backbar")).toBe(100);
  });

  it("shares one ledger between the till, reservations and stock take", () => {
    const movements: StockMovement[] = [
      base({ id: "g", qty: 12, reason: "goods-in", productId: "olaplex", location: "retail", unit: "each" }),
      base({ id: "sale", qty: -1, reason: "sale", productId: "olaplex", location: "retail", unit: "each" }),
      base({ id: "hold", qty: 1, reason: "reserve", productId: "olaplex", location: "retail", unit: "each" }),
    ];
    expect(onHand(movements, "olaplex", "retail")).toBe(11);
    expect(reserved(movements, "olaplex", "retail")).toBe(1);
    expect(available(11, 1, 0)).toBe(10);
    expect(canTake(11, 1, 0, 1).ok).toBe(true);
    expect(canTake(1, 1, 0, 1).ok).toBe(false);
    expect(stockTakeVariance(10, 8)).toBe(-2);
    expect(rangePriceAllowed(1400, 1400, 1800, false)).toBe(true);
    expect(rangePriceAllowed(1300, 1400, 1800, false)).toBe(false);
    expect(rangePriceAllowed(1300, 1400, 1800, true)).toBe(true);
  });

  it("searches a large catalogue without loading every row onto one page", () => {
    const products = Array.from({ length: 50_000 }, (_, index) => ({
      id: `p${index}`,
      name: index === 12345 ? "Olaplex No.3 100ml" : `Product ${index}`,
      brand: index % 2 ? "SAMPLE" : "Other",
      range: "",
      sku: `SKU-${index}`,
      ean: index === 20 ? "0000000000020" : "",
      supplierCode: "",
      category: "retail",
      supplier: "typed on goods-in",
      useType: "retail",
      channel: "shop",
      active: true,
      onHand: index,
      reorderLevel: 3,
    }));
    const started = Date.now();
    const page = searchProducts(products, "Olaplex", {}, 1, 25);
    expect(Date.now() - started).toBeLessThan(1000);
    expect(page.total).toBe(1);
    expect(page.rows).toHaveLength(1);
    expect(page.pages).toBe(1);
    const scanned = searchProducts(products, "0000000000020", {}, 1, 10);
    expect(scanned.rows[0]?.id).toBe("p20");
  });
});

describe("quotes, offers, patch tests and sync", () => {
  it("prices on the server and ignores a tampered browser total", () => {
    const quote = quoteBooking({
      service: {
        id: "ladies-short",
        name: "Ladies Cut & Blow Dry Short",
        priceType: "tier",
        basePence: 4200,
        durationMin: 45,
        processingMin: 0,
        finishMin: 0,
        patchTest: false,
        chemical: false,
        depositRule: null,
        quoteOnly: false,
        location: "salon",
        onlineBookable: true,
      },
      tier: "senior",
      multipliers,
      lines: [
        {
          kind: "addon",
          id: "extra-15",
          name: "Extra 15 min",
          extraMinutes: 15,
          pricePence: 1200,
          pricePlaceholder: null,
          clientSuppliedPence: 1,
          collect: false,
        },
      ],
      discountPence: 0,
      salonDeposit: { percent: 20, minimumPence: 1500 },
    });
    expect(quote.totalPence).toBe(5040 + 1200);
    expect(quote.durationMin).toBe(60);
    expect(quote.depositPence).toBe(Math.max(1500, Math.round((6240 * 20) / 100)));
  });

  it("refuses a second offer and applies the discount before the deposit", () => {
    expect(refuseSecondPromo("a", "b")).toMatch(/one offer/i);
    const applied = applyOnePromo(
      [
        {
          id: "sample10",
          type: "percent",
          amount: 10,
          code: "SAMPLE10",
          automatic: false,
          newClientsOnly: false,
          membersOnly: false,
          minSpendPence: null,
          serviceIds: [],
          startsOn: null,
          endsOn: null,
          active: true,
        },
      ],
      {
        serviceId: "cut",
        subtotalPence: 10000,
        isNewClient: false,
        isMember: false,
        nowIso: "2026-11-01T12:00:00.000Z",
        code: "SAMPLE10",
        qualifyingItemCount: 1,
      },
      "sample10",
    );
    expect(applied.discountPence).toBe(1000);
  });

  it("enforces the 48-hour patch test, the declined-test record and under-16 checks", () => {
    const appointment = "2026-11-03T10:00:00.000Z";
    expect(
      assessPatchTest({
        required: true,
        tests: [],
        productClass: "colour",
        appointmentIso: appointment,
        validityDays: 180,
        clearedReaction: false,
      }).ok,
    ).toBe(false);
    expect(
      assessPatchTest({
        required: true,
        tests: [{ atIso: "2026-11-02T10:00:00.000Z", result: "clear", productClass: "colour" }],
        productClass: "colour",
        appointmentIso: appointment,
        validityDays: 180,
        clearedReaction: false,
      }).reason,
    ).toMatch(/48 hours/);
    expect(
      assessPatchTest({
        required: true,
        tests: [{ atIso: "2026-10-01T10:00:00.000Z", result: "clear", productClass: "colour" }],
        productClass: "colour",
        appointmentIso: appointment,
        validityDays: 180,
        clearedReaction: false,
      }).ok,
    ).toBe(true);
    expect(waiverReady({
      managerId: "",
      reason: "",
      toldRisk: true,
      choseToDecline: true,
      insuranceMayNotCover: false,
      clientAcknowledged: true,
    }).ok).toBe(false);
    expect(waiverReady({
      managerId: "mgr",
      reason: "Client asked to proceed",
      toldRisk: true,
      choseToDecline: true,
      insuranceMayNotCover: true,
      clientAcknowledged: true,
    }).ok).toBe(true);
    expect(manufacturerCheckRequired(15, true)).toBe(true);
    expect(manufacturerCheckRequired(16, true)).toBe(false);
  });

  it("keeps one of two offline bookings and sends the other to needs attention", () => {
    const first = syncBookings(
      [
        { id: "a", deviceId: "desk", localTime: "2026-11-02T09:00:00.000Z", type: "booking", staffId: "jordan", startMs: 1, endMs: 2, clientPhone: "07000900001" },
        { id: "b", deviceId: "desk", localTime: "2026-11-02T09:01:00.000Z", type: "booking", staffId: "jordan", startMs: 1, endMs: 2, clientPhone: "07000900002" },
        { id: "a", deviceId: "desk", localTime: "2026-11-02T09:00:00.000Z", type: "booking", staffId: "jordan", startMs: 1, endMs: 2, clientPhone: "07000900001" },
      ],
      new Set(),
    );
    expect(first.applied).toEqual(["a"]);
    expect(first.attention).toHaveLength(1);
    expect(first.attention[0]?.phone).toBe("07000900002");
    const again = syncBookings(
      [{ id: "a", deviceId: "desk", localTime: "2026-11-02T09:00:00.000Z", type: "booking", staffId: "jordan", startMs: 1, endMs: 2, clientPhone: "07000900001" }],
      new Set(first.applied),
    );
    expect(again.applied).toEqual([]);
  });

  it("does not change RRP from a supplier cost file and flags a duplicate EAN", () => {
    const plan = planProductImport(
      [
        { row: 2, sku: "R1", ean: "111", name: "Olaplex No.3 100ml", costPence: 1500, rrpPence: 9999 },
        { row: 3, sku: "NEW", ean: "222", name: "New shampoo", costPence: 400, rrpPence: null },
        { row: 4, sku: "DUP", ean: "222", name: "Copy", costPence: 100, rrpPence: null },
      ],
      [{ sku: "R1", ean: "111", name: "Olaplex No.3 100ml", supplierCode: "", costPence: 1200, rrpPence: 3000 }],
      "update",
    );
    expect(plan.costChanges).toEqual([{ sku: "R1", from: 1200, to: 1500 }]);
    expect(plan.errors.some((error) => error.column === "rrp")).toBe(true);
    expect(plan.create).toEqual([3]);
    expect(plan.errors.some((error) => error.column === "ean")).toBe(true);
  });

  it("keeps travel fees and shipping as placeholders outside a set zone", () => {
    expect(postcodeAllowed("SW1A 1AA", []).allowed).toBe(false);
    expect(postcodeAllowed("SW1A 1AA", ["SW1"]).allowed).toBe(true);
    expect(postcodeAllowed("EH1 1AA", ["SW1"]).allowed).toBe(false);
    expect(cancellationDeadline("2026-11-01T00:00:00.000Z")).toBe("2026-11-15T00:00:00.000Z");
    expect(withinCancellation("2026-11-01T00:00:00.000Z", "2026-11-14T00:00:00.000Z")).toBe(true);
  });
});

describe("permissions and idempotency", () => {
  const base: Actor = {
    id: "u",
    role: "junior",
    staffId: "morgan",
    managerCan: managerSwitches(),
    juniorCanSeeSpend: false,
    operatorGrantUntil: null,
  };

  it("hides spend from a restricted junior and blocks operator access without a grant", () => {
    expect(can(base, "client.health", "2026-11-01T00:00:00.000Z")).toBe(true);
    expect(can(base, "client.spend", "2026-11-01T00:00:00.000Z")).toBe(false);
    expect(can({ ...base, juniorCanSeeSpend: true }, "client.spend", "2026-11-01T00:00:00.000Z")).toBe(true);
    expect(can({ ...base, role: "reception" }, "catalogue.write", "2026-11-01T00:00:00.000Z")).toBe(false);
    expect(can({ ...base, role: "operator" }, "client.contact", "2026-11-01T00:00:00.000Z")).toBe(false);
    expect(
      can(
        { ...base, role: "operator", operatorGrantUntil: "2026-11-02T00:00:00.000Z" },
        "client.contact",
        "2026-11-01T12:00:00.000Z",
      ),
    ).toBe(true);
    expect(can({ ...base, role: "fulfilment" }, "orders", "2026-11-01T00:00:00.000Z")).toBe(true);
    expect(can({ ...base, role: "fulfilment" }, "till", "2026-11-01T00:00:00.000Z")).toBe(false);
    expect(can({ ...base, role: "renter" }, "finance", "2026-11-01T00:00:00.000Z")).toBe(false);
  });

  it("applies one Stripe event the second time as a no-op", () => {
    const seen = new Set<string>();
    const first = applyIdempotent(seen, "evt_1", () => "ledger");
    const second = applyIdempotent(seen, "evt_1", () => "ledger");
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
  });
});
