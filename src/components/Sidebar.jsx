import React from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', icon: '✦', label: 'Dashboard' },
  { id: 'tasks', icon: '◈', label: 'My Tasks' },
  { id: 'calendar', icon: '◉', label: 'Calendar' },
  { id: 'habits', icon: '◆', label: 'Habits' },
  { id: 'notes', icon: '◎', label: 'Notes' },
]

const CATEGORIES = [
  { id: 'personal', label: 'Personal', color: '#A78BFA' },
  { id: 'work', label: 'Work', color: '#34D399' },
  { id: 'health', label: 'Health', color: '#F87171' },
  { id: 'finance', label: 'Finance', color: '#FBBF24' },
  { id: 'social', label: 'Social', color: '#60A5FA' },
]

export default function Sidebar({ activeView, setActiveView, tasks }) {
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = tasks.filter(t => t.category === cat.id && !t.completed).length
    return acc
  }, {})

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>✿</div>
        <div>
          <div style={styles.logoName}>Lucy's World</div>
          <div style={styles.logoSub}>My Life Hub</div>
        </div>
      </div>

      <nav style={styles.nav}>
        <div style={styles.navSection}>MENU</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            style={{
              ...styles.navItem,
              ...(activeView === item.id ? styles.navItemActive : {})
            }}
            onClick={() => setActiveView(item.id)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {activeView === item.id && <span style={styles.navDot} />}
          </button>
        ))}
      </nav>

      <div style={styles.categories}>
        <div style={styles.navSection}>CATEGORIES</div>
        {CATEGORIES.map(cat => (
          <div key={cat.id} style={styles.catItem}>
            <div style={{ ...styles.catDot, background: cat.color }} />
            <span style={styles.catLabel}>{cat.label}</span>
            {categoryCounts[cat.id] > 0 && (
              <span style={{ ...styles.catCount, background: cat.color + '33', color: cat.color }}>
                {categoryCounts[cat.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={styles.sidebarFooter}>
        <div style={styles.avatar}>L</div>
        <div>
          <div style={styles.avatarName}>Lucy</div>
          <div style={styles.avatarStatus}>✦ In my world</div>
        </div>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 260,
    minWidth: 260,
    background: '#1E1B4B',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'sticky',
    top: 0,
    overflow: 'auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 24px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: 'white',
    flexShrink: 0,
  },
  logoName: {
    color: 'white',
    fontWeight: 700,
    fontSize: 15,
    fontFamily: "'Playfair Display', serif",
  },
  logoSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 1,
  },
  nav: {
    padding: '8px 12px',
    flex: 1,
  },
  navSection: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.3)',
    padding: '12px 12px 6px',
  },
  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    background: 'transparent',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'left',
    transition: 'all 0.2s',
    position: 'relative',
    cursor: 'pointer',
  },
  navItemActive: {
    background: 'rgba(124,58,237,0.3)',
    color: '#A78BFA',
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  navDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#A78BFA',
    marginLeft: 'auto',
  },
  categories: {
    padding: '0 12px 8px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: 8,
  },
  catItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    borderRadius: 8,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  catLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    flex: 1,
  },
  catCount: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 99,
  },
  sidebarFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    marginTop: 'auto',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: 15,
    flexShrink: 0,
  },
  avatarName: {
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
  },
  avatarStatus: {
    color: '#A78BFA',
    fontSize: 11,
    marginTop: 1,
  },
}
