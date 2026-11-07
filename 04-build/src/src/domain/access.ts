export type Role =
  | "owner"
  | "manager"
  | "reception"
  | "stylist"
  | "junior"
  | "renter"
  | "fulfilment"
  | "client"
  | "operator";

export type Action =
  | "diary.all"
  | "diary.own"
  | "client.contact"
  | "client.health"
  | "client.spend"
  | "formula"
  | "till"
  | "void"
  | "cashup.count"
  | "cashup.close"
  | "prices"
  | "staff"
  | "commission.rates"
  | "commission.own"
  | "tips"
  | "promo"
  | "loyalty.adjust"
  | "stock"
  | "voucher"
  | "finance"
  | "export"
  | "audit"
  | "catalogue.write"
  | "catalogue.cost"
  | "orders"
  | "campaign"
  | "settings";

const ALL: Action[] = [
  "diary.all",
  "diary.own",
  "client.contact",
  "client.health",
  "client.spend",
  "formula",
  "till",
  "void",
  "cashup.count",
  "cashup.close",
  "prices",
  "staff",
  "commission.rates",
  "commission.own",
  "tips",
  "promo",
  "loyalty.adjust",
  "stock",
  "voucher",
  "finance",
  "export",
  "audit",
  "catalogue.write",
  "catalogue.cost",
  "orders",
  "campaign",
  "settings",
];

const MATRIX: Record<Role, Action[] | "owner-copy"> = {
  owner: ALL,
  manager: "owner-copy",
  reception: [
    "diary.all",
    "client.contact",
    "client.health",
    "client.spend",
    "till",
    "cashup.count",
    "stock",
    "voucher",
    "orders",
  ],
  stylist: ["diary.own", "client.contact", "client.health", "formula", "till", "commission.own", "tips"],
  junior: ["diary.own", "client.contact", "client.health", "formula", "till", "commission.own"],
  renter: ["diary.own", "client.contact", "client.health", "formula", "till", "commission.own"],
  fulfilment: ["orders"],
  client: [],
  operator: [],
};

export interface Actor {
  id: string;
  role: Role;
  staffId: string | null;
  /** Owner switches. Default true for a manager. */
  managerCan: {
    commissionRates: boolean;
    export: boolean;
    void: boolean;
    cashupClose: boolean;
    loyaltyAdjust: boolean;
  };
  /** Juniors see allergies but not spend unless the owner allows it. */
  juniorCanSeeSpend: boolean;
  /** Logged, time-limited support grant. */
  operatorGrantUntil: string | null;
}

export function managerSwitches() {
  return {
    commissionRates: false,
    export: false,
    void: true,
    cashupClose: true,
    loyaltyAdjust: false,
  };
}

export function can(actor: Actor, action: Action, nowIso: string): boolean {
  if (actor.role === "operator") {
    if (!actor.operatorGrantUntil || nowIso > actor.operatorGrantUntil) return false;
    return action === "client.contact" || action === "client.health" || action === "audit";
  }
  if (actor.role === "client") return false;
  if (actor.role === "junior" && action === "client.spend") return actor.juniorCanSeeSpend;
  let allowed = MATRIX[actor.role];
  if (allowed === "owner-copy") allowed = ALL;
  if (!allowed.includes(action)) return false;
  if (actor.role === "manager") {
    if (action === "commission.rates" && !actor.managerCan.commissionRates) return false;
    if (action === "export" && !actor.managerCan.export) return false;
    if (action === "void" && !actor.managerCan.void) return false;
    if (action === "cashup.close" && !actor.managerCan.cashupClose) return false;
    if (action === "loyalty.adjust" && !actor.managerCan.loyaltyAdjust) return false;
    if (action === "audit" && !actor.managerCan.export) return false;
  }
  return true;
}

export function assertCan(actor: Actor, action: Action, nowIso: string): void {
  if (!can(actor, action, nowIso)) {
    throw new Error(`Not allowed (${actor.role} cannot ${action}).`);
  }
}

export function seesAllDiary(actor: Actor): boolean {
  return actor.role === "owner" || actor.role === "manager" || actor.role === "reception";
}

/** Stylist, junior and renter only see their own takings. */
export function canSeeStaffTakings(actor: Actor, staffId: string): boolean {
  if (actor.role === "owner" || actor.role === "manager") return true;
  if (actor.role === "reception") return false;
  return actor.staffId === staffId;
}
