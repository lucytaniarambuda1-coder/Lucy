import React, { useState, useEffect } from 'react'
import { getStatus, subscribe, connect, disconnect, pull, getPasscode } from '../sync/store'

const LABELS = {
  disconnected: { text: 'Connect sync', color: '#7C3AED', bg: '#EDE9FE' },
  syncing:      { text: 'Syncing…',     color: '#6B7280', bg: '#F3F4F6' },
  synced:       { text: 'Synced ✓',     color: '#059669', bg: '#D1FAE5' },
  offline:      { text: 'Offline',      color: '#B45309', bg: '#FEF3C7' },
  badkey:       { text: 'Wrong passcode', color: '#DC2626', bg: '#FEE2E2' },
  error:        { text: 'Sync error',   color: '#DC2626', bg: '#FEE2E2' },
}

export default function SyncBadge() {
  const [status, setStatus] = useState(getStatus())
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => subscribe(setStatus), [])

  const label = LABELS[status]
  const needsCode = !getPasscode() || status === 'disconnected' || status === 'badkey'

  const submit = async () => {
    if (!code.trim()) return
    await connect(code)
    setCode('')
    if (getStatus() !== 'badkey') setOpen(false)
  }

  return (
    <>
      <button style={{ ...s.badge, color: label.color, background: label.bg }} onClick={() => setOpen(true)}>
        {label.text}
      </button>

      {open && (
        <div style={s.overlay} onClick={() => setOpen(false)}>
          <div style={s.sheet} onClick={e => e.stopPropagation()}>
            <h3 style={s.title}>Sync across devices</h3>
            {needsCode ? (
              <>
                <p style={s.text}>
                  Enter your sync passcode so your phone and computer share the same tasks, habits and notes.
                  Connect the device with your most up-to-date data first.
                </p>
                <input
                  style={s.input}
                  type="password"
                  placeholder="Sync passcode"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  autoFocus
                />
                {status === 'badkey' && <p style={s.err}>That passcode didn't match. Try again.</p>}
                <button style={s.btn} onClick={submit}>Connect</button>
              </>
            ) : (
              <>
                <p style={s.text}>This device is connected. Changes save to the cloud automatically.</p>
                <button style={s.btn} onClick={() => { pull(); setOpen(false) }}>Sync now</button>
                <button style={s.ghost} onClick={() => { disconnect(); setOpen(false) }}>Disconnect this device</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const s = {
  badge: {
    marginLeft: 'auto', border: 'none', borderRadius: 99, padding: '5px 10px',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.4)', zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  sheet: { background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
  title: {
    fontSize: 20, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 10,
  },
  text: { fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 16 },
  input: {
    width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB', borderRadius: 10,
    fontSize: 16, outline: 'none', fontFamily: 'inherit', color: '#1F2937', marginBottom: 12,
  },
  err: { fontSize: 13, color: '#DC2626', marginBottom: 12 },
  btn: {
    width: '100%', padding: '14px', background: '#7C3AED', color: 'white',
    border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  ghost: {
    width: '100%', padding: '12px', background: 'none', color: '#9CA3AF',
    border: 'none', borderRadius: 12, fontSize: 14, cursor: 'pointer', marginTop: 6,
  },
}
