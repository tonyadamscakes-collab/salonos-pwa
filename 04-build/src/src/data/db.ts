const DB = "salonos";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", mode);
    const request = run(tx.objectStore("kv"));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const value = await withStore<T | undefined>("readonly", (store) => store.get(key));
  return value ?? null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await withStore("readwrite", (store) => store.put(value, key));
}

export function deviceId(): string {
  const existing = localStorage.getItem("salonos-device");
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem("salonos-device", created);
  return created;
}

export function channel(): BroadcastChannel {
  return new BroadcastChannel("salonos");
}
