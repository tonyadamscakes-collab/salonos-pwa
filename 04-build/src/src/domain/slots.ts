import { londonWallToUtc, parseDayKey } from "./time";

export interface Segment {
  kind: "active" | "processing";
  minutes: number;
}

export interface Interval {
  startMs: number;
  endMs: number;
}

export interface TimelinePart extends Interval {
  kind: "active" | "processing";
}

export function segmentsOf(totalMinutes: number, processingMinutes: number, finishMinutes: number): Segment[] {
  if (processingMinutes < 0 || finishMinutes < 0 || totalMinutes <= 0) {
    throw new Error("Durations must be positive");
  }
  const apply = totalMinutes - processingMinutes - finishMinutes;
  if (apply <= 0) throw new Error("Processing and finish exceed the service duration");
  if (processingMinutes === 0) return [{ kind: "active", minutes: totalMinutes }];
  return [
    { kind: "active", minutes: apply },
    { kind: "processing", minutes: processingMinutes },
    { kind: "active", minutes: finishMinutes },
  ];
}

export function timeline(startMs: number, segments: Segment[]): TimelinePart[] {
  const parts: TimelinePart[] = [];
  let cursor = startMs;
  for (const segment of segments) {
    if (segment.minutes < 0 || !Number.isInteger(segment.minutes)) throw new Error("Bad segment");
    const endMs = cursor + segment.minutes * 60_000;
    parts.push({ kind: segment.kind, startMs: cursor, endMs });
    cursor = endMs;
  }
  return parts;
}

export function totalMinutes(segments: Segment[]): number {
  return segments.reduce((sum, segment) => sum + segment.minutes, 0);
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.startMs < b.endMs && b.startMs < a.endMs;
}

export interface Occupancy {
  /** Active time already booked, held, or blocked. Processing time is not included. */
  active: Interval[];
  blocks: Interval[];
}

/**
 * Active time may not overlap another booking's active time, a hold, or a block.
 * Processing time is free for another client's active work.
 */
export function clashReason(parts: TimelinePart[], occupancy: Occupancy): string | null {
  for (const part of parts) {
    if (part.kind !== "active") continue;
    for (const busy of occupancy.active) {
      if (overlaps(part, busy)) return "That time overlaps work this person is already doing.";
    }
    for (const block of occupancy.blocks) {
      if (overlaps(part, block)) return "That time is blocked for a break, travel, training or cleaning.";
    }
  }
  return null;
}

export interface Shift {
  startMin: number;
  endMin: number;
}

export interface SlotOffer {
  startMs: number;
  endMs: number;
  staffId: string;
}

export function slotsOnShift(input: {
  dayKey: string;
  shift: Shift;
  segments: Segment[];
  occupancy: Occupancy;
  staffId: string;
  stepMin?: number;
  nowMs?: number;
}): SlotOffer[] {
  const step = input.stepMin ?? 15;
  const { year, month, day } = parseDayKey(input.dayKey);
  const span = totalMinutes(input.segments);
  const offers: SlotOffer[] = [];
  for (let minute = input.shift.startMin; minute + span <= input.shift.endMin; minute += step) {
    const start = londonWallToUtc(year, month, day, Math.floor(minute / 60), minute % 60);
    const startMs = start.getTime();
    if (input.nowMs != null && startMs < input.nowMs) continue;
    const parts = timeline(startMs, input.segments);
    if (clashReason(parts, input.occupancy)) continue;
    offers.push({ startMs, endMs: startMs + span * 60_000, staffId: input.staffId });
  }
  return offers;
}

/** Concatenate services in order. Each keeps its own processing gap. */
export function concatSegments(groups: Segment[][]): Segment[] {
  return groups.flat();
}

export function holdExpired(holdUntilMs: number, nowMs: number): boolean {
  return nowMs >= holdUntilMs;
}
