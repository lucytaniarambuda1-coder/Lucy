import React, { useMemo, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import journey from '../data/journey.json'

// The Women Who Build: 21-Day Journey — four slides per day, with tick-off progress.
// Progress is stored under `lucys-` keys, so it syncs across devices like Habits.

const C = {
  plum: '#261D2D',
  plum2: '#31233C',
  ink: '#2B2132',
  body: '#4A3D52',
  lav: '#A58BE8',
  violet: '#5F3987',
  light: '#FAF7FD',
  lilac: '#EEE8F5',
  lime: '#D6EB5C',
  soft: '#D9CFE6',
  pale: '#F4EFFA',
}
const SERIF = "'EB Garamond', Georgia, serif"
const SLIDES = ['Title', 'Teaching', 'Reflect', 'Build']
const DAYS = journey.days

const Html = ({ as: Tag = 'span', html, style }) => (
  <Tag style={style} dangerouslySetInnerHTML={{ __html: html }} />
)

export default function JourneyView() {
  const [done, setDone] = useLocalStorage('lucys-journey-done', {})
  const firstOpen = useMemo(() => {
    const from = DAYS.find(d => d.day >= journey.restartDay && !done[d.day])
    return (from || DAYS.find(d => !done[d.day]) || DAYS[DAYS.length - 1]).day
  }, []) // eslint-disable-line
  const [pos, setPos] = useLocalStorage('lucys-journey-pos', { day: firstOpen, slide: 0 })
  const touch = useRef(null)

  const day = DAYS.find(d => d.day === pos.day) || DAYS[0]
  const doneCount = Object.keys(done).length

  const go = (dayNum, slide = 0) => setPos({ day: dayNum, slide })
  const next = () => {
    if (pos.slide < 3) go(pos.day, pos.slide + 1)
    else if (pos.day < 21) go(pos.day + 1, 0)
  }
  const prev = () => {
    if (pos.slide > 0) go(pos.day, pos.slide - 1)
    else if (pos.day > 1) go(pos.day - 1, 3)
  }
  const toggleDone = () => setDone(p => {
    const n = { ...p }
    if (n[day.day]) delete n[day.day]
    else n[day.day] = new Date().toISOString().split('T')[0]
    return n
  })

  const onTouchStart = e => { touch.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    touch.current = null
    if (dx < -50) next()
    else if (dx > 50) prev()
  }

  return (
    <div style={s.wrap}>
      {/* Progress header */}
      <div style={s.head}>
        <p style={s.kicker}>The Women Who Build</p>
        <h1 style={s.headTitle}>21-Day Journey</h1>
        <p style={s.motto}>Know her. Heal her. Build.</p>
        <div style={s.barTrack}><div style={{ ...s.barFill, width: `${(doneCount / 21) * 100}%` }} /></div>
        <p style={s.barText}>{doneCount} of 21 days complete</p>
      </div>

      {/* Day picker */}
      <div style={s.chips}>
        {DAYS.map(d => {
          const active = d.day === pos.day
          const isDone = !!done[d.day]
          return (
            <button
              key={d.day}
              onClick={() => go(d.day, 0)}
              aria-label={`Day ${d.day}${isDone ? ', complete' : ''}`}
              style={{
                ...s.chip,
                ...(isDone ? s.chipDone : {}),
                ...(active ? s.chipActive : {}),
              }}
            >
              {d.day}
            </button>
          )
        })}
      </div>

      {day.day === journey.restartDay && !done[day.day] && (
        <div style={s.restart}>
          <b>Start again here.</b> You didn’t fail — you paused. One day at a time.
        </div>
      )}

      {/* Slide tabs */}
      <div style={s.slideTabs}>
        {SLIDES.map((label, i) => (
          <button
            key={label}
            onClick={() => go(pos.day, i)}
            style={{ ...s.slideTab, ...(pos.slide === i ? s.slideTabActive : {}) }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* The slide */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {pos.slide === 0 && <TitleSlide d={day} />}
        {pos.slide === 1 && <TeachingSlide d={day} />}
        {pos.slide === 2 && <ReflectSlide d={day} />}
        {pos.slide === 3 && <BuildSlide d={day} isDone={!!done[day.day]} onToggle={toggleDone} />}
      </div>

      {/* Prev / next */}
      <div style={s.nav}>
        <button style={s.navBtn} onClick={prev} disabled={pos.day === 1 && pos.slide === 0}>← Back</button>
        <span style={s.navInfo}>Day {day.day} · {pos.slide + 1}/4</span>
        <button style={{ ...s.navBtn, ...s.navNext }} onClick={next} disabled={pos.day === 21 && pos.slide === 3}>Next →</button>
      </div>
    </div>
  )
}

function Foot({ d, dark }) {
  return <p style={{ ...s.foot, color: dark ? C.soft : C.body }}>Day {String(d.day).padStart(2, '0')} of 21 · {d.weekName}</p>
}

function TitleSlide({ d }) {
  const weekWord = ['', 'One', 'Two', 'Three'][d.week]
  return (
    <div style={{ ...s.card, background: C.plum, color: C.pale }}>
      <p style={{ ...s.eyebrow, color: C.lav }}>Week {weekWord} · {d.weekName}</p>
      <p style={s.dayNum}>Day {String(d.day).padStart(2, '0')}</p>
      <Html as="h2" html={d.title} style={s.title} />
      <Html as="p" html={d.theme} style={s.theme} />
      <Html as="p" html={d.desc} style={{ ...s.text, color: C.soft }} />
      <Html as="p" html={d.verses} style={s.verses} />
      <Foot d={d} dark />
    </div>
  )
}

function TeachingSlide({ d }) {
  return (
    <div style={{ ...s.card, background: C.light, color: C.ink }}>
      <p style={s.eyebrow}>Day {String(d.day).padStart(2, '0')} · The Teaching</p>
      <Html as="h2" html={d.teaching.heading} style={s.heading} />
      {d.teaching.points.map((p, i) => (
        <div key={i} style={s.point}>
          <span style={s.num}>{i + 1}</span>
          <div>
            <Html as="p" html={p.h} style={s.pointHead} />
            <Html as="p" html={p.t} style={{ ...s.text, color: C.body }} />
          </div>
        </div>
      ))}
      <Foot d={d} />
    </div>
  )
}

function ReflectSlide({ d }) {
  return (
    <div style={{ ...s.card, background: C.lilac, color: C.ink }}>
      <p style={s.eyebrow}>Day {String(d.day).padStart(2, '0')} · {d.reflect.label}</p>
      <Html as="h2" html={d.reflect.heading} style={s.heading} />
      <ol style={s.list}>
        {d.reflect.items.map((it, i) => <Html as="li" key={i} html={it} style={s.listItem} />)}
      </ol>
      {d.reflect.note && <Html as="p" html={d.reflect.note} style={s.note} />}
      <p style={s.journal}>✎ Write your answers in your journal.</p>
      <Foot d={d} />
    </div>
  )
}

function BuildSlide({ d, isDone, onToggle }) {
  return (
    <div style={{ ...s.card, background: C.plum, color: C.pale }}>
      <p style={{ ...s.eyebrow, color: C.lav }}>Day {String(d.day).padStart(2, '0')} · {d.build.label}</p>
      <Html as="h2" html={d.build.heading} style={{ ...s.heading, color: C.pale }} />
      <Html as="p" html={d.build.steps} style={{ ...s.text, color: C.soft }} />
      <div style={s.decl}>
        <p style={s.declLabel}>{d.build.declLabel}</p>
        <Html as="p" html={d.build.decl} style={s.declText} />
      </div>
      {d.build.prayer && (
        <details style={s.prayer}>
          <summary style={s.prayerSum}>Today’s prayer</summary>
          <Html as="p" html={d.build.prayer.replace(/^(Final prayer|Prayer):\s*/, '')} style={s.prayerText} />
        </details>
      )}
      <button onClick={onToggle} style={{ ...s.doneBtn, ...(isDone ? s.doneBtnOn : {}) }}>
        {isDone ? `✓ Day ${d.day} complete` : `Mark Day ${d.day} complete`}
      </button>
      <Foot d={d} dark />
    </div>
  )
}

const s = {
  wrap: { padding: '16px 14px 32px' },
  head: { background: C.plum, borderRadius: 16, padding: '20px 18px 16px', color: C.pale, marginBottom: 12 },
  kicker: { fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.lav },
  headTitle: { fontFamily: SERIF, fontSize: 30, fontWeight: 600, lineHeight: 1.1, marginTop: 4 },
  motto: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 17, color: C.lav, marginTop: 2 },
  barTrack: { height: 8, background: C.plum2, borderRadius: 99, marginTop: 14, overflow: 'hidden' },
  barFill: { height: '100%', background: C.lime, borderRadius: 99, transition: 'width .3s' },
  barText: { fontSize: 12, color: C.soft, marginTop: 6 },

  chips: { display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 2px 10px', scrollbarWidth: 'none' },
  chip: { flexShrink: 0, width: 36, height: 36, borderRadius: 99, background: 'white', border: `1.5px solid ${C.soft}`, color: C.ink, fontSize: 13, fontWeight: 700 },
  chipDone: { background: C.lime, borderColor: C.lime, color: C.plum },
  chipActive: { background: C.plum, borderColor: C.plum, color: C.lime },

  restart: { background: C.lime, color: C.plum, borderRadius: 12, padding: '10px 14px', fontSize: 14, marginBottom: 10 },

  slideTabs: { display: 'flex', gap: 4, background: 'white', borderRadius: 12, padding: 4, marginBottom: 10, border: '1px solid var(--border)' },
  slideTab: { flex: 1, padding: '8px 0', borderRadius: 9, fontSize: 13, fontWeight: 600, color: C.body },
  slideTabActive: { background: C.plum, color: C.pale },

  card: { borderRadius: 18, padding: '24px 20px 18px', minHeight: 440, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(38,29,45,0.12)' },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.violet, marginBottom: 10 },
  dayNum: { fontSize: 15, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.lime, marginBottom: 6 },
  title: { fontFamily: SERIF, fontSize: 36, fontWeight: 600, lineHeight: 1.05 },
  theme: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, lineHeight: 1.3, color: C.lav, marginTop: 16 },
  heading: { fontFamily: SERIF, fontSize: 26, fontWeight: 600, lineHeight: 1.15, marginBottom: 16 },
  text: { fontSize: 15, lineHeight: 1.6, marginTop: 12 },
  verses: { fontSize: 13, fontWeight: 700, color: C.lime, marginTop: 16, lineHeight: 1.5 },

  point: { display: 'flex', gap: 12, marginBottom: 14 },
  num: { fontFamily: SERIF, fontSize: 28, fontWeight: 600, lineHeight: 1, color: C.violet, width: 20, flexShrink: 0 },
  pointHead: { fontSize: 15, fontWeight: 800, lineHeight: 1.35 },

  list: { paddingLeft: 22, fontSize: 15, lineHeight: 1.6 },
  listItem: { marginBottom: 10 },
  note: { fontSize: 14, fontStyle: 'italic', color: C.body, lineHeight: 1.55, marginTop: 4 },
  journal: { fontSize: 13, color: C.violet, fontWeight: 600, marginTop: 12 },

  decl: { borderLeft: `4px solid ${C.lime}`, paddingLeft: 14, marginTop: 18 },
  declLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.lime, marginBottom: 4 },
  declText: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 19, lineHeight: 1.35, color: C.pale },
  prayer: { marginTop: 16, background: C.plum2, borderRadius: 10, padding: '10px 12px' },
  prayerSum: { fontSize: 13, fontWeight: 700, color: C.lav, cursor: 'pointer' },
  prayerText: { fontSize: 14, lineHeight: 1.6, color: C.soft, marginTop: 8 },
  doneBtn: { marginTop: 18, padding: '13px 0', borderRadius: 12, background: C.lime, color: C.plum, fontSize: 15, fontWeight: 800 },
  doneBtnOn: { background: 'transparent', border: `2px solid ${C.lime}`, color: C.lime },

  foot: { fontSize: 11, marginTop: 'auto', paddingTop: 16 },

  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  navBtn: { padding: '10px 16px', borderRadius: 10, background: 'white', border: '1px solid var(--border)', fontSize: 14, fontWeight: 600, color: C.ink },
  navNext: { background: C.plum, color: C.pale, borderColor: C.plum },
  navInfo: { fontSize: 12, color: 'var(--text-2)' },
}
