import { getStore } from '@netlify/blobs'
import { timingSafeEqual } from 'node:crypto'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

function keyMatches(given, expected) {
  const a = Buffer.from(given || '')
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export default async (req) => {
  const expected = process.env.SYNC_KEY
  if (!expected) return json({ error: 'SYNC_KEY is not set on Netlify' }, 500)
  if (!keyMatches(req.headers.get('x-sync-key'), expected)) return json({ error: 'Wrong passcode' }, 401)

  const store = getStore('lucys-world')

  if (req.method === 'GET') {
    const state = await store.get('state', { type: 'json' })
    return json(state || { data: null })
  }

  if (req.method === 'POST') {
    const body = await req.json()
    if (!body || typeof body.data !== 'object') return json({ error: 'Bad data' }, 400)
    const state = { data: body.data, updatedAt: new Date().toISOString() }
    await store.setJSON('state', state)
    return json({ ok: true, updatedAt: state.updatedAt })
  }

  return json({ error: 'Method not allowed' }, 405)
}
