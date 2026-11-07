import { assertPence, type Pence } from "./money";

export type StockLocation = "retail" | "backbar";

export type StockReason =
  | "sale"
  | "refund"
  | "goods-in"
  | "stock-take"
  | "formula"
  | "waste"
  | "transfer-out"
  | "transfer-in"
  | "reserve"
  | "release"
  | "online-sale"
  | "return-put-back"
  | "write-off";

export interface StockMovement {
  id: string;
  siteId: string;
  productId: string;
  location: StockLocation;
  /** Units, or grams when unit is gram. Positive adds stock. Reservations do not change on-hand. */
  qty: number;
  unit: "each" | "gram";
  reason: StockReason;
  ref: string;
  at: string;
  note: string;
}

const RESERVATIONS = new Set<StockReason>(["reserve", "release"]);

export function onHand(movements: StockMovement[], productId: string, location: StockLocation): number {
  return movements
    .filter((row) => row.productId === productId && row.location === location && !RESERVATIONS.has(row.reason))
    .reduce((sum, row) => sum + row.qty, 0);
}

export function reserved(movements: StockMovement[], productId: string, location: StockLocation): number {
  const net = movements
    .filter((row) => row.productId === productId && row.location === location && RESERVATIONS.has(row.reason))
    .reduce((sum, row) => sum + row.qty, 0);
  return Math.max(0, net);
}

/** Online availability = on hand − reserved − safety buffer. */
export function available(onHandQty: number, reservedQty: number, buffer: number): number {
  return onHandQty - reservedQty - buffer;
}

export interface TakeResult {
  ok: boolean;
  reason?: string;
}

/**
 * Two sales of the last unit: the first succeeds, the second is refused.
 * `alreadyReservedByThis` is stock this checkout already holds.
 */
export function canTake(onHandQty: number, reservedQty: number, buffer: number, want: number, alreadyReservedByThis = 0): TakeResult {
  if (want <= 0) return { ok: false, reason: "Quantity must be at least 1" };
  const free = available(onHandQty, reservedQty, buffer) + alreadyReservedByThis;
  if (want > free) return { ok: false, reason: "Not enough stock" };
  return { ok: true };
}

export function stockTakeVariance(systemQty: number, countedQty: number): number {
  return countedQty - systemQty;
}

export interface FormulaLine {
  productId: string;
  grams: number;
  wasteGrams: number;
}

export function formulaDeductions(lines: FormulaLine[]): { productId: string; grams: number; wasteGrams: number }[] {
  return lines.map((line) => {
    if (!Number.isFinite(line.grams) || !Number.isFinite(line.wasteGrams)) throw new Error("Grams must be a number");
    if (line.grams < 0 || line.wasteGrams < 0) throw new Error("Grams cannot be negative");
    const gramsOk = Math.round(line.grams * 10) === line.grams * 10;
    const wasteOk = Math.round(line.wasteGrams * 10) === line.wasteGrams * 10;
    if (!gramsOk || !wasteOk) throw new Error("Grams are whole numbers or one decimal place");
    return { productId: line.productId, grams: line.grams, wasteGrams: line.wasteGrams };
  });
}

export function rangePriceAllowed(pence: Pence, minPence: Pence, maxPence: Pence, ownerOverride: boolean): boolean {
  assertPence(pence, "price");
  if (ownerOverride) return pence >= 0;
  return pence >= minPence && pence <= maxPence;
}

export interface Paged<T> {
  rows: T[];
  total: number;
  page: number;
  pages: number;
}

export function paginate<T>(rows: T[], page: number, pageSize: number): Paged<T> {
  if (pageSize < 1) throw new Error("Page size must be at least 1");
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page: safePage,
    pages: Math.max(1, Math.ceil(rows.length / pageSize)),
  };
}

export interface ProductSearchFields {
  id: string;
  name: string;
  brand: string;
  range: string;
  sku: string;
  ean: string;
  supplierCode: string;
  category: string;
  supplier: string;
  useType: string;
  channel: string;
  active: boolean;
  onHand: number;
  reorderLevel: number;
}

export function searchProducts(
  products: ProductSearchFields[],
  query: string,
  filters: Partial<Pick<ProductSearchFields, "category" | "brand" | "supplier" | "useType" | "channel">> & {
    active?: boolean;
    stock?: "any" | "low" | "out";
  },
  page: number,
  pageSize: number,
): Paged<ProductSearchFields> {
  const q = query.trim().toLowerCase();
  const matched = products.filter((product) => {
    if (q) {
      const hay = [product.name, product.brand, product.range, product.sku, product.ean, product.supplierCode]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q) && product.ean !== query.trim()) return false;
    }
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.supplier && product.supplier !== filters.supplier) return false;
    if (filters.useType && product.useType !== filters.useType) return false;
    if (filters.channel && product.channel !== filters.channel) return false;
    if (filters.active != null && product.active !== filters.active) return false;
    if (filters.stock === "out" && product.onHand > 0) return false;
    if (filters.stock === "low" && !(product.onHand <= product.reorderLevel)) return false;
    return true;
  });
  matched.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  return paginate(matched, page, pageSize);
}
