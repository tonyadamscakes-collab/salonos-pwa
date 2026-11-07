const text = new TextEncoder();
const decoder = new TextDecoder();

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", text.encode(value));
  return hex(new Uint8Array(digest));
}

export function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

export async function derivePinKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", text.encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 120_000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function aesEncrypt(key: CryptoKey, value: unknown): Promise<{ iv: string; ciphertext: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, text.encode(JSON.stringify(value)) as BufferSource);
  return { iv: b64(iv), ciphertext: b64(new Uint8Array(cipher)) };
}

export async function aesDecrypt<T>(key: CryptoKey, iv: string, ciphertext: string): Promise<T> {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(iv) as BufferSource }, key, bytes(ciphertext) as BufferSource);
  return JSON.parse(decoder.decode(plain)) as T;
}

export async function createWrapPair(): Promise<{ publicJwk: JsonWebKey; privateJwk: JsonWebKey }> {
  const pair = await crypto.subtle.generateKey(
    { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"],
  );
  const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  return { publicJwk, privateJwk };
}

export interface Sealed {
  wrappedKey: string;
  iv: string;
  ciphertext: string;
}

/** Hybrid encryption so a guest can leave a booking the locked staff device can open. */
export async function seal(publicJwk: JsonWebKey, value: unknown): Promise<Sealed> {
  const publicKey = await crypto.subtle.importKey("jwk", publicJwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const aes = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt"]);
  const sealed = await aesEncrypt(aes, value);
  const wrapped = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, raw as BufferSource);
  return { wrappedKey: b64(new Uint8Array(wrapped)), iv: sealed.iv, ciphertext: sealed.ciphertext };
}

export async function openSealed<T>(privateJwk: JsonWebKey, packet: Sealed): Promise<T> {
  const privateKey = await crypto.subtle.importKey("jwk", privateJwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["decrypt"]);
  const raw = new Uint8Array(await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, bytes(packet.wrappedKey) as BufferSource));
  const aes = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
  return aesDecrypt<T>(aes, packet.iv, packet.ciphertext);
}

function hex(bytesIn: Uint8Array): string {
  return [...bytesIn].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64(bytesIn: Uint8Array): string {
  let binary = "";
  for (const byte of bytesIn) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function bytes(value: string): Uint8Array {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

export function randomId(): string {
  return crypto.randomUUID();
}

export function randomSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}
