// Cloud sync: mirrors every `lucys-*` localStorage key to Netlify Blobs so all devices share one copy.

const ENDPOINT = '/.netlify/functions/sync'
const PASSCODE_KEY = 'lucys-sync-key'
const PREFIX = 'lucys-'
export const REMOTE_EVENT = 'lucys-remote-update'

let status = 'disconnected' // disconnected | syncing | synced | offline | badkey | error
let ready = false // no pushes until the first pull finishes, so a fresh device can't overwrite the cloud
let lastSnapshot = null
let pushTimer = null
const listeners = new Set()

const setStatus = (next) => { status = next; listeners.forEach(fn => fn(status)) }
export const getStatus = () => status
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }

export const getPasscode = () => {
  try { return window.localStorage.getItem(PASSCODE_KEY) || '' } catch { return '' }
}

function collect() {
  const data = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (k.startsWith(PREFIX) && k !== PASSCODE_KEY) data[k] = window.localStorage.getItem(k)
  }
  return data
}

const snapshotOf = (data) => JSON.stringify(Object.keys(data).sort().map(k => [k, data[k]]))

async function request(method, body) {
  const res = await fetch(ENDPOINT, {
    method,
    headers: { 'x-sync-key': getPasscode(), 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) { setStatus('badkey'); throw new Error('badkey') }
  if (!res.ok) { setStatus('error'); throw new Error(`sync ${res.status}`) }
  return res.json()
}

async function push() {
  clearTimeout(pushTimer)
  pushTimer = null
  const data = collect()
  const snap = snapshotOf(data)
  if (snap === lastSnapshot) return
  setStatus('syncing')
  try {
    await request('POST', { data })
    lastSnapshot = snap
    setStatus('synced')
  } catch {
    if (status === 'syncing') setStatus('offline')
  }
}

export async function pull() {
  if (!getPasscode()) return setStatus('disconnected')
  if (pushTimer) await push() // send pending local edits before taking the cloud copy
  setStatus('syncing')
  try {
    const { data } = await request('GET')
    if (!data) {
      // Cloud is empty: this device becomes the main copy.
      ready = true
      lastSnapshot = null
      await push()
      return
    }
    Object.keys(collect()).forEach(k => { if (!(k in data)) window.localStorage.removeItem(k) })
    Object.entries(data).forEach(([k, v]) => window.localStorage.setItem(k, v))
    lastSnapshot = snapshotOf(data)
    ready = true
    window.dispatchEvent(new Event(REMOTE_EVENT))
    setStatus('synced')
  } catch {
    if (status === 'syncing') setStatus('offline')
  }
}

// Called by useLocalStorage after every write.
export function notifyChange() {
  if (!ready || !getPasscode()) return
  clearTimeout(pushTimer)
  pushTimer = setTimeout(push, 1500)
}

export function connect(passcode) {
  window.localStorage.setItem(PASSCODE_KEY, passcode.trim())
  ready = false
  return pull()
}

export function disconnect() {
  window.localStorage.removeItem(PASSCODE_KEY)
  ready = false
  setStatus('disconnected')
}

export function startSync() {
  pull()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pull()
    else if (pushTimer) push()
  })
  window.addEventListener('online', pull)
}
