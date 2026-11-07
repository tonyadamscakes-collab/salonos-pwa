const LONDON = "Europe/London";

export interface LondonParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
}

function part(parts: Intl.DateTimeFormatPart[], type: string): string {
  return parts.find((p) => p.type === type)?.value ?? "";
}

export function londonParts(date: Date): LondonParts {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const hour = Number(part(formatted, "hour"));
  return {
    year: Number(part(formatted, "year")),
    month: Number(part(formatted, "month")),
    day: Number(part(formatted, "day")),
    hour: hour === 24 ? 0 : hour,
    minute: Number(part(formatted, "minute")),
    second: Number(part(formatted, "second")),
    weekday: weekdayMap[part(formatted, "weekday")] ?? 0,
  };
}

/** Convert a Europe/London wall-clock time to a UTC Date. Handles BST. */
export function londonWallToUtc(year: number, month: number, day: number, hour: number, minute: number): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const asLondon = londonParts(guess);
  const guessedAsUtc = Date.UTC(asLondon.year, asLondon.month - 1, asLondon.day, asLondon.hour, asLondon.minute, 0);
  const wanted = Date.UTC(year, month - 1, day, hour, minute, 0);
  return new Date(guess.getTime() - (guessedAsUtc - wanted));
}

export function londonDayKey(date: Date): string {
  const p = londonParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function addLondonDays(year: number, month: number, day: number, days: number): { year: number; month: number; day: number } {
  const utc = londonWallToUtc(year, month, day, 12, 0);
  utc.setUTCDate(utc.getUTCDate() + days);
  const p = londonParts(utc);
  return { year: p.year, month: p.month, day: p.day };
}

export function parseDayKey(dayKey: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) throw new Error("Day must be YYYY-MM-DD");
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function weekdayOfDayKey(dayKey: string): number {
  const { year, month, day } = parseDayKey(dayKey);
  return londonParts(londonWallToUtc(year, month, day, 12, 0)).weekday;
}

/** "1hr", "1 hr, 30 mins", "15/55 min", "30minutes". Empty text has no duration. */
export function parseDurationText(text: string): { minutes: number | null; options: number[] } {
  const raw = text.trim();
  if (!raw) return { minutes: null, options: [] };
  if (raw.includes("/")) {
    const unit = /min/i.test(raw) ? "min" : /hour|hr/i.test(raw) ? "h" : "min";
    const options = raw
      .split("/")
      .map((partText) => {
        const piece = partText.trim();
        const withUnit = /\d/.test(piece) && !/h|m/i.test(piece) ? `${piece} ${unit}` : piece;
        return parseOneDuration(withUnit);
      })
      .filter((n): n is number => n != null);
    return { minutes: options[0] ?? null, options };
  }
  const minutes = parseOneDuration(raw);
  return { minutes, options: minutes == null ? [] : [minutes] };
}

function parseOneDuration(text: string): number | null {
  const normalised = text
    .trim()
    .toLowerCase()
    .replace(/minutes|minute|mins|min/g, "m")
    .replace(/hours|hour|hrs|hr/g, "h");
  const hours = normalised.match(/(\d+(?:\.\d+)?)\s*h/);
  const minutes = normalised.match(/(\d+)\s*m/);
  if (!hours && !minutes) return null;
  let total = 0;
  if (hours) total += Math.round(parseFloat(hours[1]) * 60);
  if (minutes && !(hours && hours[1].includes("."))) total += Number(minutes[1]);
  return total;
}

export function formatDuration(minutes: number | null): string {
  if (minutes == null) return "Duration not set";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return hours === 1 ? "1 h" : `${hours} h`;
  return `${hours} h ${rest} min`;
}
