const STORAGE_KEY = 'hrms-demo-state'

export interface PersistedState<T> {
  version: number
  data: T
}

export function loadState<T>(version: number, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw) as PersistedState<T>
    if (parsed.version !== version) return fallback
    return parsed.data
  } catch {
    return fallback
  }
}

export function saveState<T>(version: number, data: T) {
  if (typeof localStorage === 'undefined') return
  const payload: PersistedState<T> = { version, data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
