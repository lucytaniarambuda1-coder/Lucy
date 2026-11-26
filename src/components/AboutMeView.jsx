import React from 'react'
import LoveLanguageView from './LoveLanguageView'
import AttachmentView from './AttachmentView'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Love Languages and Attachment used to be two tabs. They now live here together;
// their saved answers (lucys-love-languages, lucys-attachment) are unchanged.
const SECTIONS = [
  { id: 'love', label: 'Love Languages' },
  { id: 'attachment', label: 'Attachment' },
]

export default function AboutMeView() {
  const [section, setSection] = useLocalStorage('lucys-about-section', 'love')

  return (
    <div>
      <div style={s.bar}>
        {SECTIONS.map(x => (
          <button key={x.id} onClick={() => setSection(x.id)}
            style={{ ...s.pill, ...(section === x.id ? s.pillActive : {}) }}>
            {x.label}
          </button>
        ))}
      </div>
      {section === 'love' ? <LoveLanguageView /> : <AttachmentView />}
    </div>
  )
}

const s = {
  bar: { display: 'flex', gap: 8, padding: '14px 16px 0' },
  pill: { flex: 1, padding: '9px 12px', borderRadius: 99, fontSize: 14, fontWeight: 600, color: 'var(--text-2)', background: 'white', boxShadow: 'var(--shadow)' },
  pillActive: { background: 'var(--primary)', color: 'white' },
}
