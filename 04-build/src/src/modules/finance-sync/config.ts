export interface FinanceSyncConfig {
  siteId: string;
  enabled: boolean;
  baseUrl: string;
  authType: string;
  postingTime: string;
}

export const FINANCE_BASE_URL_PLACEHOLDER = "[FINANCE API BASE URL – Tony to set]";
export const FINANCE_AUTH_PLACEHOLDER = "[FINANCE API AUTH – Tony to set]";

export interface ConfigStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

const memory = new Map<string, string>();

function browserStore(): ConfigStore {
  return {
    get(key) {
      try {
        if (typeof localStorage === "undefined") return memory.get(key) ?? null;
        return localStorage.getItem(key);
      } catch {
        return memory.get(key) ?? null;
      }
    },
    set(key, value) {
      try {
        if (typeof localStorage === "undefined") {
          memory.set(key, value);
          return;
        }
        localStorage.setItem(key, value);
      } catch {
        memory.set(key, value);
      }
    },
  };
}

function storageKey(siteId: string): string {
  return `salonos-finance-sync:${siteId}`;
}

/** Optional module. Off until a salon turns it on. No secret is stored here. */
export function defaultFinanceSyncConfig(siteId: string): FinanceSyncConfig {
  return {
    siteId,
    enabled: false,
    baseUrl: FINANCE_BASE_URL_PLACEHOLDER,
    authType: FINANCE_AUTH_PLACEHOLDER,
    postingTime: "22:00",
  };
}

export function loadFinanceSyncConfig(siteId: string, store: ConfigStore = browserStore()): FinanceSyncConfig {
  const fallback = defaultFinanceSyncConfig(siteId);
  const raw = store.get(storageKey(siteId));
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<FinanceSyncConfig>;
    return {
      siteId,
      enabled: parsed.enabled === true,
      baseUrl: FINANCE_BASE_URL_PLACEHOLDER,
      authType: FINANCE_AUTH_PLACEHOLDER,
      postingTime: typeof parsed.postingTime === "string" && parsed.postingTime ? parsed.postingTime : fallback.postingTime,
    };
  } catch {
    return fallback;
  }
}

export function saveFinanceSyncConfig(config: FinanceSyncConfig, store: ConfigStore = browserStore()): FinanceSyncConfig {
  const saved: FinanceSyncConfig = {
    ...defaultFinanceSyncConfig(config.siteId),
    enabled: config.enabled === true,
    postingTime: config.postingTime || "22:00",
  };
  store.set(storageKey(config.siteId), JSON.stringify(saved));
  return saved;
}
