import { describe, expect, it } from "vitest";
import {
  applyTierMultiplier,
  assertTendersMatch,
  cashVariance,
  commissionOn,
  depositPence,
  expectedCash,
  formatDateUK,
  formatGBP,
  noShowCharge,
  pointsExpire,
  pointsForPayment,
  qualifyingTipsTotal,
  redeemVoucher,
  renterSplit,
  splitVatInclusive,
  allocateTips,
} from "../src/domain/money";

const salon = { percent: 20, minimumPence: 1500 };

describe("money and tier prices", () => {
  it("formats pounds and UK dates", () => {
    expect(formatGBP(4200)).toBe("£42.00");
    expect(formatGBP(5040)).toBe("£50.40");
    expect(formatDateUK("2026-11-01T12:00:00.000Z")).toBe("01/11/2026");
  });

  it("applies the locked tier multipliers and rounds to the nearest penny", () => {
    expect(applyTierMultiplier(4200, 1.2)).toBe(5040);
    expect(applyTierMultiplier(4200, 0.85)).toBe(3570);
    expect(applyTierMultiplier(2200, 1.4)).toBe(3080);
    expect(applyTierMultiplier(1001, 1 / 3)).toBe(334);
  });

  it("splits VAT-inclusive prices", () => {
    const split = splitVatInclusive(5400, 2000);
    expect(split.grossPence).toBe(5400);
    expect(split.netPence + split.vatPence).toBe(5400);
    expect(split.netPence).toBe(4500);
  });
});

describe("deposits", () => {
  it("uses the greater of 20% and £15, and never more than the price", () => {
    expect(depositPence(1000, null, salon)).toBe(1000);
    expect(depositPence(13000, null, salon)).toBe(2600);
    expect(depositPence(4800, null, salon)).toBe(1500);
  });

  it("lets a service or the salon set a lower, fixed, or zero deposit", () => {
    expect(depositPence(13000, { mode: "none" }, salon)).toBe(0);
    expect(depositPence(13000, { mode: "fixed", fixedPence: 500 }, salon)).toBe(500);
    expect(depositPence(13000, { mode: "greater-of", percent: 10, minimumPence: 0 }, salon)).toBe(1300);
    const raised = { percent: 25, minimumPence: 2000 };
    expect(depositPence(10000, { mode: "salon-default" }, raised)).toBe(2500);
    expect(depositPence(10000, { mode: "greater-of", percent: 20, minimumPence: 1500 }, raised)).toBe(2000);
  });

  it("calculates the deposit after the discount", () => {
    const discounted = 9000;
    expect(depositPence(discounted, null, salon)).toBe(1800);
  });
});

describe("no-show cap", () => {
  it("cannot charge more than the deposit unless a card-on-file charge was agreed", () => {
    const capped = noShowCharge({
      requestedPence: 4000,
      depositTakenPence: 1500,
      cardOnFileAgreed: false,
      ownerOverride: false,
      policyLimitPence: 4000,
    });
    expect(capped.chargePence).toBe(1500);
    expect(capped.capped).toBe(true);

    const agreed = noShowCharge({
      requestedPence: 4000,
      depositTakenPence: 1500,
      cardOnFileAgreed: true,
      ownerOverride: false,
      policyLimitPence: 4000,
    });
    expect(agreed.chargePence).toBe(4000);
  });

  it("charges nothing when the deposit is zero and there is no card-on-file agreement", () => {
    const result = noShowCharge({
      requestedPence: 2000,
      depositTakenPence: 0,
      cardOnFileAgreed: false,
      ownerOverride: true,
      policyLimitPence: 2000,
    });
    expect(result.chargePence).toBe(0);
  });

  it("still respects the policy limit without an owner override", () => {
    const result = noShowCharge({
      requestedPence: 3000,
      depositTakenPence: 3000,
      cardOnFileAgreed: true,
      ownerOverride: false,
      policyLimitPence: 1500,
    });
    expect(result.chargePence).toBe(1500);
  });
});

describe("commission, renters, points, tenders", () => {
  it("commissions the discounted price, net of VAT when registered", () => {
    const registered = commissionOn({
      grossAfterDiscountPence: 5400,
      rateBps: 4000,
      vatRegistered: true,
      vatRateBps: 2000,
    });
    expect(registered.basePence).toBe(4500);
    expect(registered.commissionPence).toBe(1800);

    const unregistered = commissionOn({
      grossAfterDiscountPence: 5400,
      rateBps: 4000,
      vatRegistered: false,
      vatRateBps: null,
    });
    expect(unregistered.basePence).toBe(5400);
    expect(unregistered.commissionPence).toBe(2160);
  });

  it("records a renter split and does not pay it out", () => {
    expect(renterSplit({ grossPence: 10000, rule: "percent", salonShareBps: 3000 })).toEqual({
      salonPence: 3000,
      renterPence: 7000,
    });
    expect(renterSplit({ grossPence: 10000, rule: "record-only" })).toEqual({ salonPence: 0, renterPence: 0 });
  });

  it("earns 1 point per £1 after payment, rounds down, and expires after 12 months idle", () => {
    expect(pointsForPayment(4200 + 3000)).toBe(72);
    expect(pointsForPayment(199)).toBe(1);
    expect(pointsForPayment(0)).toBe(0);
    expect(pointsExpire("2025-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z")).toBe(true);
    expect(pointsExpire("2026-06-01T00:00:00.000Z", "2026-11-01T00:00:00.000Z")).toBe(false);
  });

  it("refuses a tender mix that is not the bill", () => {
    expect(() =>
      assertTendersMatch(10000, [
        { method: "cash", amountPence: 4000 },
        { method: "card", amountPence: 5000 },
      ]),
    ).toThrow(/do not match/);
    expect(() =>
      assertTendersMatch(10000, [
        { method: "cash", amountPence: 4000 },
        { method: "external-card", amountPence: 6000 },
      ]),
    ).not.toThrow();
  });

  it("keeps a voucher at or above zero", () => {
    expect(redeemVoucher(5000, 3000)).toEqual({ redeemedPence: 3000, remainingPence: 2000 });
    expect(() => redeemVoucher(5000, 5001)).toThrow(/below zero/);
  });
});

describe("tips pass-through", () => {
  it("allocates the full tip and never deducts a fee", () => {
    const allocations = allocateTips(
      [
        { id: "t1", amountPence: 500, method: "card", staffId: "jordan" },
        { id: "t2", amountPence: 300, method: "cash", staffId: null },
        { id: "t3", amountPence: 200, method: "direct-cash", staffId: "casey" },
      ],
      ["casey", "jordan"],
      "Named staff member, or equal pool",
    );
    expect(qualifyingTipsTotal(allocations)).toBe(800);
    const direct = allocations.find((row) => row.tipId === "t3");
    expect(direct?.qualifying).toBe(false);
    const pool = allocations.filter((row) => row.tipId === "t2");
    expect(pool.reduce((sum, row) => sum + row.amountPence, 0)).toBe(300);
    expect(allocations.reduce((sum, row) => sum + row.amountPence, 0)).toBe(1000);
  });
});

describe("cash-up", () => {
  it("matches a hand count to the penny", () => {
    const expected = expectedCash({
      floatPence: 5000,
      cashTendersPence: 12000,
      cashRefundsPence: 1500,
      cashPaidOutPence: 2000,
      cashPaidInPence: 500,
    });
    expect(expected).toBe(14000);
    expect(cashVariance(13900, expected)).toBe(-100);
    expect(cashVariance(14000, expected)).toBe(0);
  });
});
