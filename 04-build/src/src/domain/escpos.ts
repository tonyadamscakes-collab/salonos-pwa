/** Minimal ESC/POS receipt and drawer kick. No printer is contacted. */

const ESC = 0x1b;

export function escposReceipt(lines: string[]): Uint8Array {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  parts.push(new Uint8Array([ESC, 0x40]));
  for (const line of lines) {
    parts.push(encoder.encode(`${line}\n`));
  }
  parts.push(new Uint8Array([ESC, 0x70, 0x00, 0x19, 0xfa]));
  parts.push(encoder.encode("\n\n\n"));
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
