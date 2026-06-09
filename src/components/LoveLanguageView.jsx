import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LL = {
  WA: {
    name: 'Words of Affirmation',
    color: '#7C3AED',
    bg: '#EDE9FE',
    summary: 'You feel most loved through verbal expressions — compliments, encouragement, and being told you are valued.',
    fill: 'Verbal affirmation, acknowledgement, and encouragement fill your cup. Words carry real weight for you.',
    needs: [
      'Hear "I love you", "I\'m proud of you", and "you matter" regularly',
      'Receive specific compliments about your character and efforts',
      'Be acknowledged for your contributions — publicly and privately',
      'Get encouraging texts and voice notes just because',
      'Have your dreams spoken life into with genuine belief',
    ],
  },
  AS: {
    name: 'Acts of Service',
    color: '#2563EB',
    bg: '#DBEAFE',
    summary: 'You feel most loved when people show their care through helpful actions — easing your load and following through.',
    fill: 'Actions speak louder than words for you. When someone helps without being asked, you feel truly seen and cared for.',
    needs: [
      'Have someone help before you even need to ask',
      'Watch people take over tasks when you\'re overwhelmed',
      'See consistent follow-through on promises and commitments',
      'Have practical burdens lifted from your shoulders',
      'Be supported through action, especially in tough seasons',
    ],
  },
  RG: {
    name: 'Receiving Gifts',
    color: '#EC4899',
    bg: '#FCE7F3',
    summary: 'You feel most loved through thoughtful gestures and tokens that say "I was thinking of you."',
    fill: 'It\'s not about the size of the gift — it\'s the intention behind it. Thoughtful gestures remind you that you are on someone\'s heart.',
    needs: [
      'Receive gifts that show someone truly knows you',
      'Be surprised with your favourite things "just because"',
      'Have milestones and special moments marked meaningfully',
      'Notice that people remember what you mentioned and act on it',
      'Feel real intention behind every gesture — big or small',
    ],
  },
  QT: {
    name: 'Quality Time',
    color: '#059669',
    bg: '#D1FAE5',
    summary: 'You feel most loved through undivided, intentional presence — real conversations and shared experiences.',
    fill: 'Fully present, undistracted time is the greatest gift someone can give you. Being truly seen and heard means everything.',
    needs: [
      'Spend time with people who put their phone face-down for you',
      'Have regular one-on-ones or dates with no distractions',
      'Share activities and experiences that build real connection',
      'Feel heard through genuine eye contact and full engagement',
      'Build shared rituals and meaningful traditions together',
    ],
  },
  PT: {
    name: 'Physical Touch',
    color: '#D97706',
    bg: '#FEF3C7',
    summary: 'You feel most loved through physical warmth and closeness — hugs, a reassuring hand, and comfortable proximity.',
    fill: 'Physical warmth and closeness communicate love to you more powerfully than most other expressions.',
    needs: [
      'Be greeted and farewelled with real, intentional hugs',
      'Have someone sit close and be physically present with you',
      'Feel a reassuring hand on your shoulder during hard moments',
      'Experience warmth and openness in body language',
      'Enjoy comfortable physical proximity in everyday moments',
    ],
  },
}

const QUESTIONS = [
  {
    q: 'On a tough day, what helps you most?',
    opts: [
      { lang: 'WA', text: 'Someone tells you "I believe in you — you\'ve got this"' },
      { lang: 'AS', text: 'Someone quietly takes a task off your plate' },
      { lang: 'RG', text: 'Someone surprises you with your favourite treat' },
      { lang: 'QT', text: 'Someone sits with you and truly listens' },
      { lang: 'PT', text: 'Someone gives you a long, warm hug' },
    ],
  },
  {
    q: 'You feel most loved when someone...',
    opts: [
      { lang: 'QT', text: 'Plans a full day out just for the two of you' },
      { lang: 'WA', text: 'Writes you a heartfelt message about what you mean to them' },
      { lang: 'PT', text: 'Holds your hand through a difficult moment' },
      { lang: 'AS', text: 'Fixes something for you without waiting to be asked' },
      { lang: 'RG', text: 'Brings a small gift they remembered you mentioning' },
    ],
  },
  {
    q: 'Your ideal birthday gesture from a loved one would be...',
    opts: [
      { lang: 'RG', text: 'A meaningful, thoughtful gift that shows they truly know you' },
      { lang: 'QT', text: 'A whole day together doing your absolute favourite things' },
      { lang: 'WA', text: 'A heartfelt speech or card about what you mean to them' },
      { lang: 'PT', text: 'Lots of warmth, closeness, and affection all day long' },
      { lang: 'AS', text: 'Everything planned so you don\'t have to lift a finger' },
    ],
  },
  {
    q: 'During a conflict, you feel most reassured when...',
    opts: [
      { lang: 'PT', text: 'They reach for your hand or offer a comforting touch' },
      { lang: 'RG', text: 'They bring a peace offering or thoughtful gesture' },
      { lang: 'QT', text: 'You sit together for a long, honest, open conversation' },
      { lang: 'WA', text: 'They verbally affirm their love and commitment to you' },
      { lang: 'AS', text: 'They show up through consistent, caring actions' },
    ],
  },
  {
    q: 'You start to feel disconnected when someone...',
    opts: [
      { lang: 'AS', text: 'Says they care but never actually does anything to show it' },
      { lang: 'PT', text: 'Pulls away from physical contact or seems cold and distant' },
      { lang: 'WA', text: 'Never compliments you or acknowledges your efforts' },
      { lang: 'RG', text: 'Never thinks to mark a special moment with a gesture' },
      { lang: 'QT', text: 'Is always on their phone when you\'re together' },
    ],
  },
  {
    q: 'The most meaningful thing a close friend could do is...',
    opts: [
      { lang: 'WA', text: 'Send a voice note saying how much they appreciate you' },
      { lang: 'QT', text: 'Block out regular, protected time just for your friendship' },
      { lang: 'AS', text: 'Help with a big task when you\'re overwhelmed' },
      { lang: 'PT', text: 'Give you the warmest, most genuine hug every time they see you' },
      { lang: 'RG', text: 'Show up with something thoughtful, completely out of the blue' },
    ],
  },
  {
    q: 'When celebrating a win, you love when others...',
    opts: [
      { lang: 'RG', text: 'Mark the occasion with something special or symbolic' },
      { lang: 'AS', text: 'Take over responsibilities so you can just enjoy the moment' },
      { lang: 'PT', text: 'Celebrate with hugs, high-fives, and physical warmth' },
      { lang: 'WA', text: 'Shower you with praise and heartfelt acknowledgement' },
      { lang: 'QT', text: 'Plan a celebration and spend real, meaningful time together' },
    ],
  },
  {
    q: 'You feel most connected to someone when...',
    opts: [
      { lang: 'QT', text: 'You lose track of time in deep, unguarded conversation' },
      { lang: 'RG', text: 'They remember the small things and gift thoughtfully' },
      { lang: 'WA', text: 'They tell you exactly what they admire about you' },
      { lang: 'AS', text: 'They anticipate your needs and act without being asked' },
      { lang: 'PT', text: 'You\'re physically close — walking side by side, sitting together' },
    ],
  },
  {
    q: 'The fastest way to lift your spirits when you\'re feeling low is...',
    opts: [
      { lang: 'PT', text: 'A warm, genuine, intentional embrace from someone who loves you' },
      { lang: 'WA', text: 'Hearing kind, encouraging words from someone close to you' },
      { lang: 'RG', text: 'Receiving something that says "I was thinking of you"' },
      { lang: 'QT', text: 'Spending real, undistracted time with someone who truly sees you' },
      { lang: 'AS', text: 'Someone quietly stepping in to help without being asked' },
    ],
  },
  {
    q: '"Showing up" for you really looks like...',
    opts: [
      { lang: 'AS', text: 'Getting things done that take real pressure off you' },
      { lang: 'PT', text: 'A tight, intentional hug the moment they walk through the door' },
      { lang: 'QT', text: 'Being fully present and engaged — nothing else competing' },
      { lang: 'RG', text: 'Arriving with something thoughtful already in hand' },
      { lang: 'WA', text: 'Calling to check in with warm, genuine words of care' },
    ],
  },
  {
    q: 'In a close relationship, a dealbreaker for you would be...',
    opts: [
      { lang: 'WA', text: 'Someone who never verbally expresses love or appreciation' },
      { lang: 'RG', text: 'Someone who never puts thought into gestures or gifting' },
      { lang: 'QT', text: 'Someone who is always too busy to give you real quality time' },
      { lang: 'AS', text: 'Someone who leaves everything for you to carry alone' },
      { lang: 'PT', text: 'Someone who avoids physical affection or warmth entirely' },
    ],
  },
  {
    q: 'If you could design the perfect gesture of love, it would be...',
    opts: [
      { lang: 'PT', text: 'Being held in a long, slow, intentional embrace' },
      { lang: 'QT', text: 'A weekend away — phones off, completely focused on each other' },
      { lang: 'AS', text: 'Having every practical worry lifted without asking' },
      { lang: 'WA', text: 'A handwritten letter capturing everything you are loved for' },
      { lang: 'RG', text: 'A beautifully chosen gift that perfectly captures who you are' },
    ],
  },
]

const TOTAL = QUESTIONS.length

function calcScores(answers) {
  const scores = { WA: 0, AS: 0, RG: 0, QT: 0, PT: 0 }
  answers.forEach(lang => { if (lang) scores[lang]++ })
  return scores
}

function rankLangs(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k]) => k)
}

export default function LoveLanguageView() {
  const [profiles, setProfiles] = useLocalStorage('lucys-love-languages', [])
  const [phase, setPhase] = useState('landing')
  const [name, setName] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [viewProfile, setViewProfile] = useState(null)

  const startNew = () => {
    setPhase('name')
    setName('')
    setCurrentQ(0)
    setAnswers([])
  }

  const beginQuiz = () => {
    if (name.trim()) setPhase('quiz')
  }

  const handleAnswer = (lang) => {
    const next = [...answers, lang]
    setAnswers(next)
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1)
    } else {
      setPhase('result')
    }
  }

  const handleBack = () => {
    if (currentQ === 0) {
      setPhase('name')
    } else {
      setCurrentQ(currentQ - 1)
      setAnswers(answers.slice(0, -1))
    }
  }

  const saveResult = () => {
    const scores = calcScores(answers)
    const ranked = rankLangs(scores)
    const profile = {
      id: Date.now(),
      name: name.trim() || 'Anonymous',
      date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
      scores,
      primary: ranked[0],
      secondary: ranked[1],
    }
    setProfiles(prev => [profile, ...prev.filter(p => p.name !== profile.name)])
    setViewProfile(profile)
    setPhase('landing')
  }

  const deleteProfile = (id) => setProfiles(prev => prev.filter(p => p.id !== id))

  if (viewProfile) {
    return (
      <ProfileDetail
        profile={viewProfile}
        onBack={() => setViewProfile(null)}
        onRetake={() => { setViewProfile(null); startNew() }}
      />
    )
  }

  if (phase === 'landing') {
    return (
      <Landing
        profiles={profiles}
        onStart={startNew}
        onView={setViewProfile}
        onDelete={deleteProfile}
      />
    )
  }

  if (phase === 'name') {
    return (
      <NameEntry
        name={name}
        setName={setName}
        onBegin={beginQuiz}
        onBack={() => setPhase('landing')}
      />
    )
  }

  if (phase === 'quiz') {
    return (
      <Quiz
        currentQ={currentQ}
        onAnswer={handleAnswer}
        onBack={handleBack}
      />
    )
  }

  if (phase === 'result') {
    const scores = calcScores(answers)
    const ranked = rankLangs(scores)
    return (
      <Results
        name={name}
        scores={scores}
        ranked={ranked}
        onSave={saveResult}
        onRetake={() => { setCurrentQ(0); setAnswers([]); setPhase('quiz') }}
        onBack={() => setPhase('landing')}
      />
    )
  }

  return null
}

function Landing({ profiles, onStart, onView, onDelete }) {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroHeart}>♥</div>
        <h1 style={s.heroTitle}>Love Language Assessment</h1>
        <p style={s.heroSub}>
          Discover how you give and receive love — and exactly what others can do to make you feel truly seen.
        </p>
        <button style={s.btn} onClick={onStart}>Start Assessment</button>
      </div>

      {profiles.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Saved Profiles</p>
          {profiles.map(p => (
            <ProfileCard key={p.id} profile={p} onView={() => onView(p)} onDelete={() => onDelete(p.id)} />
          ))}
          <p style={s.hint}>Tap a profile to view full results. Share with friends and family to compare.</p>
        </div>
      )}

      <div style={s.section}>
        <div style={s.langGrid}>
          {Object.entries(LL).map(([k, l]) => (
            <div key={k} style={{ ...s.langPill, background: l.bg, color: l.color }}>
              {l.name}
            </div>
          ))}
        </div>
        <p style={s.tip}>12 questions · 5 love languages · Saved locally · Multiple profiles</p>
      </div>
    </div>
  )
}

function ProfileCard({ profile, onView, onDelete }) {
  const lang = LL[profile.primary]
  return (
    <div style={{ ...s.profileCard, borderLeftColor: lang.color }} onClick={onView}>
      <div>
        <p style={s.pcName}>{profile.name}</p>
        <p style={{ ...s.pcLang, color: lang.color }}>{lang.name}</p>
        <p style={s.pcDate}>{profile.date}</p>
      </div>
      <div style={s.pcRight}>
        <div style={{ ...s.pcDot, background: lang.color }} />
        <button
          style={s.delBtn}
          onClick={e => { e.stopPropagation(); onDelete() }}
          aria-label="Delete profile"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function NameEntry({ name, setName, onBegin, onBack }) {
  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={onBack}>← Back</button>
      <div style={s.card}>
        <h2 style={s.cardTitle}>Who is taking this?</h2>
        <p style={s.cardSub}>
          Enter your name so your results can be saved and compared with others.
        </p>
        <input
          style={s.input}
          placeholder="Your name..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onBegin()}
          autoFocus
        />
        <button
          style={{ ...s.btn, marginTop: 16, opacity: name.trim() ? 1 : 0.4 }}
          onClick={onBegin}
          disabled={!name.trim()}
        >
          Begin Assessment
        </button>
      </div>
      <p style={s.hint}>Results are saved privately on this device.</p>
    </div>
  )
}

function Quiz({ currentQ, onAnswer, onBack }) {
  const q = QUESTIONS[currentQ]
  const pct = (currentQ / TOTAL) * 100

  return (
    <div style={s.page}>
      <div style={s.quizTop}>
        <button style={s.quizBackBtn} onClick={onBack}>← Back</button>
        <span style={s.qCounter}>{currentQ + 1} of {TOTAL}</span>
      </div>
      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${pct}%` }} />
      </div>
      <div style={s.card}>
        <p style={s.questionText}>{q.q}</p>
      </div>
      <div style={s.optsList}>
        {q.opts.map(opt => (
          <button key={opt.lang} style={s.optBtn} onClick={() => onAnswer(opt.lang)}>
            <span style={{ ...s.optDot, background: LL[opt.lang].color }} />
            <span style={s.optText}>{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Results({ name, scores, ranked, onSave, onRetake, onBack }) {
  const primary = ranked[0]
  const secondary = ranked[1]
  const lang = LL[primary]

  return (
    <div style={s.page}>
      <div style={{ ...s.resultHero, background: lang.bg, borderColor: lang.color }}>
        <p style={s.resultFor}>{name}&rsquo;s Love Language</p>
        <h2 style={{ ...s.resultPrimary, color: lang.color }}>{lang.name}</h2>
        <p style={s.resultSummary}>{lang.summary}</p>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>Your Scores</p>
        {ranked.map(k => (
          <ScoreRow key={k} langKey={k} score={scores[k]} />
        ))}
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>What fills your cup</p>
        <div style={{ ...s.infoBox, background: lang.bg, borderColor: lang.color }}>
          <p style={s.infoText}>{lang.fill}</p>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>What you need from those who love you</p>
        {lang.needs.map((n, i) => (
          <NeedRow key={i} text={n} color={lang.color} />
        ))}
      </div>

      {secondary && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Your secondary language</p>
          <SecondaryBox langKey={secondary} />
        </div>
      )}

      <div style={s.actions}>
        <button style={s.btn} onClick={onSave}>Save My Results</button>
        <button style={s.btnOutline} onClick={onRetake}>Retake Assessment</button>
        <button style={s.btnGhost} onClick={onBack}>Back to Home</button>
      </div>
    </div>
  )
}

function ProfileDetail({ profile, onBack, onRetake }) {
  const primary = profile.primary
  const secondary = profile.secondary
  const lang = LL[primary]
  const ranked = Object.entries(profile.scores).sort((a, b) => b[1] - a[1]).map(([k]) => k)

  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={onBack}>← Back</button>

      <div style={{ ...s.resultHero, background: lang.bg, borderColor: lang.color }}>
        <p style={s.resultFor}>{profile.name}&rsquo;s Love Language</p>
        <h2 style={{ ...s.resultPrimary, color: lang.color }}>{lang.name}</h2>
        <p style={s.resultSummary}>{lang.summary}</p>
        <p style={s.pcDate}>Taken {profile.date}</p>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>Scores</p>
        {ranked.map(k => (
          <ScoreRow key={k} langKey={k} score={profile.scores[k]} />
        ))}
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>What fills {profile.name}&rsquo;s cup</p>
        <div style={{ ...s.infoBox, background: lang.bg, borderColor: lang.color }}>
          <p style={s.infoText}>{lang.fill}</p>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>How to love {profile.name} well</p>
        {lang.needs.map((n, i) => (
          <NeedRow key={i} text={n} color={lang.color} />
        ))}
      </div>

      {secondary && (
        <div style={s.section}>
          <p style={s.sectionLabel}>Secondary language</p>
          <SecondaryBox langKey={secondary} />
        </div>
      )}

      <div style={s.actions}>
        <button style={s.btnOutline} onClick={onRetake}>Retake Assessment</button>
      </div>
    </div>
  )
}

function ScoreRow({ langKey, score }) {
  const lang = LL[langKey]
  return (
    <div style={s.scoreRow}>
      <span style={{ ...s.scoreName, color: lang.color }}>{lang.name}</span>
      <div style={s.scoreTrack}>
        <div style={{ ...s.scoreFill, width: `${(score / TOTAL) * 100}%`, background: lang.color }} />
      </div>
      <span style={s.scoreNum}>{score}</span>
    </div>
  )
}

function NeedRow({ text, color }) {
  return (
    <div style={s.needRow}>
      <div style={{ ...s.needDot, background: color }} />
      <p style={s.needText}>{text}</p>
    </div>
  )
}

function SecondaryBox({ langKey }) {
  const lang = LL[langKey]
  return (
    <div style={{ ...s.infoBox, background: lang.bg, borderColor: lang.color }}>
      <p style={{ ...s.infoTitle, color: lang.color }}>{lang.name}</p>
      <p style={s.infoText}>{lang.summary}</p>
    </div>
  )
}

const s = {
  page: { padding: '16px 16px 48px' },

  hero: { textAlign: 'center', padding: '28px 8px 24px' },
  heroHeart: { fontSize: 44, color: '#EC4899', marginBottom: 12, lineHeight: 1 },
  heroTitle: {
    fontSize: 24, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 10,
  },
  heroSub: { fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 300, margin: '0 auto 24px' },

  btn: {
    width: '100%', padding: '14px', background: '#7C3AED', color: 'white',
    border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  btnOutline: {
    width: '100%', padding: '13px', background: 'white', color: '#7C3AED',
    border: '2px solid #7C3AED', borderRadius: 12, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', marginTop: 10,
  },
  btnGhost: {
    width: '100%', padding: '12px', background: 'none', color: '#9CA3AF',
    border: 'none', borderRadius: 12, fontSize: 14, cursor: 'pointer', marginTop: 6,
  },
  backBtn: {
    background: 'none', border: 'none', color: '#7C3AED', fontSize: 14,
    fontWeight: 600, cursor: 'pointer', padding: '0 0 16px', display: 'block',
  },
  quizBackBtn: {
    background: 'none', border: 'none', color: '#7C3AED', fontSize: 14,
    fontWeight: 600, cursor: 'pointer', padding: '4px 0',
  },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
  },
  tip: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
  hint: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 10 },

  langGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  langPill: {
    fontSize: 12, fontWeight: 600, padding: '5px 10px',
    borderRadius: 99, lineHeight: 1.3,
  },

  profileCard: {
    background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 10,
    borderLeft: '4px solid', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  pcName: { fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 2 },
  pcLang: { fontSize: 13, fontWeight: 600, marginBottom: 2 },
  pcDate: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  pcRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  pcDot: { width: 10, height: 10, borderRadius: '50%' },
  delBtn: {
    background: 'none', border: 'none', color: '#D1D5DB',
    fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
  },

  card: {
    background: 'white', borderRadius: 16, padding: '20px', marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: 20, fontWeight: 800, color: '#1F2937',
    fontFamily: "'Playfair Display', serif", marginBottom: 10,
  },
  cardSub: { fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 20 },
  input: {
    width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB',
    borderRadius: 10, fontSize: 16, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', color: '#1F2937',
  },

  quizTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  qCounter: { fontSize: 13, fontWeight: 600, color: '#9CA3AF' },
  progressTrack: { height: 4, background: '#E5E7EB', borderRadius: 99, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#7C3AED', borderRadius: 99, transition: 'width 0.3s ease' },
  questionText: {
    fontSize: 18, fontWeight: 700, color: '#1F2937', lineHeight: 1.45,
    fontFamily: "'Playfair Display', serif",
  },
  optsList: { display: 'flex', flexDirection: 'column', gap: 10 },
  optBtn: {
    background: 'white', border: '2px solid #E5E7EB', borderRadius: 12,
    padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12,
    cursor: 'pointer', textAlign: 'left', width: '100%',
  },
  optDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4 },
  optText: { fontSize: 14, color: '#374151', lineHeight: 1.5 },

  resultHero: {
    borderRadius: 16, padding: '24px 20px', marginBottom: 24,
    border: '2px solid', textAlign: 'center',
  },
  resultFor: {
    fontSize: 11, fontWeight: 700, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
  },
  resultPrimary: {
    fontSize: 26, fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: 12,
  },
  resultSummary: { fontSize: 14, color: '#374151', lineHeight: 1.6 },

  scoreRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  scoreName: { fontSize: 11, fontWeight: 700, width: 128, flexShrink: 0, lineHeight: 1.3 },
  scoreTrack: { flex: 1, height: 8, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
  scoreNum: { fontSize: 14, fontWeight: 700, color: '#374151', width: 18, textAlign: 'right', flexShrink: 0 },

  infoBox: { borderRadius: 12, padding: '16px', border: '1.5px solid', marginBottom: 8 },
  infoTitle: { fontSize: 15, fontWeight: 700, marginBottom: 6 },
  infoText: { fontSize: 14, color: '#374151', lineHeight: 1.7 },

  needRow: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  needDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 6 },
  needText: { fontSize: 14, color: '#374151', lineHeight: 1.6 },

  actions: { marginTop: 32 },
}
