import React, { useState, useEffect } from 'react'
import TodayView from './components/TodayView'
import TaskList from './components/TaskList'
import WeeklyPlanner from './components/WeeklyPlanner'
import BrainDump from './components/BrainDump'
import HabitsView from './components/HabitsView'
import NotesView from './components/NotesView'
import FocusView from './components/FocusView'
import TaskModal from './components/TaskModal'
import { useLocalStorage } from './hooks/useLocalStorage'

const TASKS_VERSION = 3

const HOME_TASKS = [
  { id: 401, title: 'Pay rates and taxes (R40,000)', description: 'Pay outstanding rates and taxes on the house', category: 'home', priority: 'high', dueDate: '', dueTime: '', tags: ['rates', 'taxes'], completed: false, createdAt: new Date().toISOString() },
  { id: 402, title: 'Landscaping', description: '', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['garden'], completed: false, createdAt: new Date().toISOString() },
  { id: 403, title: 'Wall plaster and design', description: '', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['renovation'], completed: false, createdAt: new Date().toISOString() },
  { id: 404, title: 'Built-in kitchen cupboards', description: '', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['renovation', 'kitchen'], completed: false, createdAt: new Date().toISOString() },
  { id: 405, title: 'Bedroom cupboards', description: '', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['renovation', 'bedroom'], completed: false, createdAt: new Date().toISOString() },
  { id: 406, title: 'Bathroom improvements', description: '', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['renovation', 'bathroom'], completed: false, createdAt: new Date().toISOString() },
  { id: 407, title: 'Create study/work space', description: 'Dedicated home office/study area', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['workspace'], completed: false, createdAt: new Date().toISOString() },
  { id: 408, title: 'Home décor and furnishing', description: '', category: 'home', priority: 'low', dueDate: '', dueTime: '', tags: ['decor'], completed: false, createdAt: new Date().toISOString() },
  { id: 409, title: 'Maintenance and repairs', description: '', category: 'home', priority: 'medium', dueDate: '', dueTime: '', tags: ['maintenance'], completed: false, createdAt: new Date().toISOString() },
]

const WORK_TASKS = [
  { id: 501, title: 'Kenya Bank Account (CRS documents)', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-bpo', 'kenya', 'banking'], completed: false, createdAt: new Date().toISOString() },
  { id: 502, title: 'SARS Third-Party Notices', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-bpo', 'sars', 'compliance'], completed: false, createdAt: new Date().toISOString() },
  { id: 503, title: 'Nakama MSA', description: 'Master Services Agreement for Nakama', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-bpo', 'nakama', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 504, title: "O'Neill & Borges – Puerto Rico Labour", description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'labour'], completed: false, createdAt: new Date().toISOString() },
  { id: 505, title: 'NBC Dashboard', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-bpo', 'nbc'], completed: false, createdAt: new Date().toISOString() },
  { id: 506, title: 'TTI Opportunities', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'tti'], completed: false, createdAt: new Date().toISOString() },
  { id: 507, title: 'Bar Taco Opportunities', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'bar-taco'], completed: false, createdAt: new Date().toISOString() },
  { id: 508, title: 'Lombard Insurance', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'lombard'], completed: false, createdAt: new Date().toISOString() },
  { id: 509, title: '4th Floor Contract', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 510, title: 'Apollo AI Month-to-Month', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'apollo', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 511, title: 'AI Cost Master List', description: 'Compile master list of all AI-related costs', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['dash-bpo', 'ai', 'budget'], completed: false, createdAt: new Date().toISOString() },
  { id: 512, title: 'AI Team Capability Development Plan', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-bpo', 'ai', 'team'], completed: false, createdAt: new Date().toISOString() },
  { id: 513, title: 'Dash Digital reporting dashboard', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-digital'], completed: false, createdAt: new Date().toISOString() },
  { id: 514, title: 'Dash Digital MSA for TTI', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-digital', 'tti', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 515, title: 'Dash Digital operating model', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-digital'], completed: false, createdAt: new Date().toISOString() },
  { id: 516, title: 'Move the Needle initiatives', description: '', category: 'work', priority: 'high', dueDate: '', dueTime: '', tags: ['dash-digital', 'needle'], completed: false, createdAt: new Date().toISOString() },
  { id: 517, title: 'Weekly Board Deck', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['recurring', 'board'], completed: false, createdAt: new Date().toISOString() },
  { id: 518, title: 'Weekly Executive Summary', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['recurring'], completed: false, createdAt: new Date().toISOString() },
  { id: 519, title: 'Management Steering Meetings', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['recurring', 'meetings'], completed: false, createdAt: new Date().toISOString() },
  { id: 520, title: 'AI Meetings', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['recurring', 'ai', 'meetings'], completed: false, createdAt: new Date().toISOString() },
  { id: 521, title: 'Client Visit Process Improvements', description: '', category: 'work', priority: 'medium', dueDate: '', dueTime: '', tags: ['recurring', 'clients'], completed: false, createdAt: new Date().toISOString() },
]

const PERSONAL_TASKS = [
  { id: 601, title: 'How Corner website', description: '', category: 'personal', priority: 'high', dueDate: '', dueTime: '', tags: ['brand', 'website'], completed: false, createdAt: new Date().toISOString() },
  { id: 602, title: 'Get first clients', description: '', category: 'personal', priority: 'high', dueDate: '', dueTime: '', tags: ['brand', 'clients'], completed: false, createdAt: new Date().toISOString() },
  { id: 603, title: 'Open Flow Corner development', description: '', category: 'personal', priority: 'high', dueDate: '', dueTime: '', tags: ['brand', 'flow-corner'], completed: false, createdAt: new Date().toISOString() },
  { id: 604, title: 'Substack article weekly', description: 'Consistent weekly publishing on Substack', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['writing', 'substack'], completed: false, createdAt: new Date().toISOString() },
  { id: 605, title: 'Passion Purpose Peace book launch', description: '', category: 'personal', priority: 'high', dueDate: '', dueTime: '', tags: ['writing', 'book'], completed: false, createdAt: new Date().toISOString() },
  { id: 606, title: 'Blog content creation', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['writing', 'blog'], completed: false, createdAt: new Date().toISOString() },
  { id: 607, title: 'Concerns of Six Prayer Retreat', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['events', 'prayer'], completed: false, createdAt: new Date().toISOString() },
  { id: 608, title: 'Jennifer Hudson Event', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['events'], completed: false, createdAt: new Date().toISOString() },
  { id: 609, title: 'Significance Conference', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['events', 'conference'], completed: false, createdAt: new Date().toISOString() },
  { id: 610, title: 'Gracevation', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['events'], completed: false, createdAt: new Date().toISOString() },
  { id: 611, title: 'Relationship Room', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['events', 'relationships'], completed: false, createdAt: new Date().toISOString() },
  { id: 612, title: 'Precious Daughters', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['events'], completed: false, createdAt: new Date().toISOString() },
  { id: 613, title: 'Solo travel', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['growth', 'travel'], completed: false, createdAt: new Date().toISOString() },
  { id: 614, title: 'Cooking classes', description: '', category: 'personal', priority: 'low', dueDate: '', dueTime: '', tags: ['growth'], completed: false, createdAt: new Date().toISOString() },
  { id: 615, title: 'Reading list', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['growth', 'reading'], completed: false, createdAt: new Date().toISOString() },
  { id: 616, title: 'Journaling', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['growth', 'journaling'], completed: false, createdAt: new Date().toISOString() },
  { id: 617, title: 'Friendship catch-ups', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['growth', 'social'], completed: false, createdAt: new Date().toISOString() },
  { id: 618, title: 'Future husband standards list', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['relationships'], completed: false, createdAt: new Date().toISOString() },
  { id: 619, title: 'Intentional dating preparation', description: '', category: 'personal', priority: 'medium', dueDate: '', dueTime: '', tags: ['relationships'], completed: false, createdAt: new Date().toISOString() },
]

const SCHOOL_TASKS = [
  { id: 701, title: "Industrial Psychology Master's proposal submission", description: '', category: 'school', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'proposal'], completed: false, createdAt: new Date().toISOString() },
  { id: 702, title: 'Supervisor engagement', description: '', category: 'school', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'supervisor'], completed: false, createdAt: new Date().toISOString() },
  { id: 703, title: 'Research methodology', description: '', category: 'school', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'research'], completed: false, createdAt: new Date().toISOString() },
  { id: 704, title: 'Literature review', description: '', category: 'school', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'research'], completed: false, createdAt: new Date().toISOString() },
  { id: 705, title: 'Ethics approval', description: '', category: 'school', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'ethics'], completed: false, createdAt: new Date().toISOString() },
  { id: 706, title: 'Research project', description: '', category: 'school', priority: 'high', dueDate: '', dueTime: '', tags: ['masters', 'research'], completed: false, createdAt: new Date().toISOString() },
  { id: 707, title: 'Academic reading', description: '', category: 'school', priority: 'medium', dueDate: '', dueTime: '', tags: ['masters', 'reading'], completed: false, createdAt: new Date().toISOString() },
  { id: 708, title: 'Claude Courses', description: '', category: 'school', priority: 'medium', dueDate: '', dueTime: '', tags: ['courses', 'ai'], completed: false, createdAt: new Date().toISOString() },
  { id: 709, title: 'AI Courses', description: '', category: 'school', priority: 'medium', dueDate: '', dueTime: '', tags: ['courses', 'ai'], completed: false, createdAt: new Date().toISOString() },
]

const HEALTH_TASKS = [
  { id: 801, title: 'Exercise routine', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['physical', 'exercise'], completed: false, createdAt: new Date().toISOString() },
  { id: 802, title: 'Walking', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['physical', 'exercise'], completed: false, createdAt: new Date().toISOString() },
  { id: 803, title: 'Pilates', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['physical', 'exercise'], completed: false, createdAt: new Date().toISOString() },
  { id: 804, title: 'Sleep tracking', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['physical', 'sleep'], completed: false, createdAt: new Date().toISOString() },
  { id: 805, title: 'Water intake', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['physical', 'habits'], completed: false, createdAt: new Date().toISOString() },
  { id: 806, title: 'Therapy/coaching', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['mental', 'therapy'], completed: false, createdAt: new Date().toISOString() },
  { id: 807, title: 'Reflection and journaling', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['mental', 'journaling'], completed: false, createdAt: new Date().toISOString() },
  { id: 808, title: 'Burnout prevention', description: '', category: 'health', priority: 'high', dueDate: '', dueTime: '', tags: ['mental', 'wellbeing'], completed: false, createdAt: new Date().toISOString() },
  { id: 809, title: 'Daily prayer', description: '', category: 'health', priority: 'high', dueDate: '', dueTime: '', tags: ['spiritual'], completed: false, createdAt: new Date().toISOString() },
  { id: 810, title: 'Daily Bible study', description: '', category: 'health', priority: 'high', dueDate: '', dueTime: '', tags: ['spiritual'], completed: false, createdAt: new Date().toISOString() },
  { id: 811, title: 'Growth Track Scheduling', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['church', 'growth-track'], completed: false, createdAt: new Date().toISOString() },
  { id: 812, title: 'Meet with Pastors', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['church', 'pastors'], completed: false, createdAt: new Date().toISOString() },
  { id: 813, title: 'Singles Ministry Event', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['church', 'singles-ministry'], completed: false, createdAt: new Date().toISOString() },
  { id: 814, title: 'Soweto Christian Family Church Website', description: '', category: 'health', priority: 'medium', dueDate: '', dueTime: '', tags: ['church', 'website'], completed: false, createdAt: new Date().toISOString() },
]

const FINANCE_TASKS = [
  { id: 901, title: 'Emergency Fund', description: '', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['savings'], completed: false, createdAt: new Date().toISOString() },
  { id: 902, title: 'House Improvement Fund', description: '', category: 'finance', priority: 'medium', dueDate: '', dueTime: '', tags: ['savings'], completed: false, createdAt: new Date().toISOString() },
  { id: 903, title: 'Travel Fund', description: '', category: 'finance', priority: 'medium', dueDate: '', dueTime: '', tags: ['savings'], completed: false, createdAt: new Date().toISOString() },
  { id: 904, title: "Master's Fees", description: '', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['career', 'education'], completed: false, createdAt: new Date().toISOString() },
  { id: 905, title: 'Professional Courses', description: '', category: 'finance', priority: 'medium', dueDate: '', dueTime: '', tags: ['career', 'education'], completed: false, createdAt: new Date().toISOString() },
  { id: 906, title: 'Conference Attendance', description: '', category: 'finance', priority: 'medium', dueDate: '', dueTime: '', tags: ['career'], completed: false, createdAt: new Date().toISOString() },
  { id: 907, title: 'Investment Account', description: '', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['wealth', 'investing'], completed: false, createdAt: new Date().toISOString() },
  { id: 908, title: 'Side Business Revenue', description: '', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['wealth', 'income'], completed: false, createdAt: new Date().toISOString() },
  { id: 909, title: 'Consulting Revenue', description: '', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['wealth', 'income'], completed: false, createdAt: new Date().toISOString() },
  { id: 910, title: 'Open Flow Corner Revenue', description: '', category: 'finance', priority: 'high', dueDate: '', dueTime: '', tags: ['wealth', 'flow-corner'], completed: false, createdAt: new Date().toISOString() },
]

const LIFE_LIST_TASKS = [...HOME_TASKS, ...WORK_TASKS, ...PERSONAL_TASKS, ...SCHOOL_TASKS, ...HEALTH_TASKS, ...FINANCE_TASKS]

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'tasks', label: 'Master List' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'braindump', label: 'Brain Dump' },
  { id: 'habits', label: 'Habits' },
  { id: 'notes', label: 'Notes' },
  { id: 'focus', label: 'Focus' },
]

const todayISO = () => new Date().toISOString().split('T')[0]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('lucys-tasks', LIFE_LIST_TASKS)
  const [seededVersion, setSeededVersion] = useLocalStorage('lucys-tasks-version', 0)
  const [activeTab, setActiveTab] = useState('today')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)

  useEffect(() => {
    if (seededVersion < TASKS_VERSION) {
      setTasks(prev => {
        const userCreated = prev.filter(t => t.id >= 10000)
        return [...LIFE_LIST_TASKS, ...userCreated]
      })
      setSeededVersion(TASKS_VERSION)
    }
  }, []) // eslint-disable-line

  const openAdd = (defaults = {}) => {
    setEditTask(defaults.title ? { ...defaults, id: null } : null)
    setModalOpen(true)
  }
  const openEdit = (task) => { setEditTask(task); setModalOpen(true) }

  const handleSave = (formData) => {
    if (editTask?.id) {
      setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...formData } : t))
    } else {
      setTasks(prev => [{ ...formData, id: Date.now(), completed: false, createdAt: new Date().toISOString() }, ...prev])
    }
  }

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))
  const updateTaskDate = (id, date) => setTasks(prev => prev.map(t => t.id === id ? { ...t, dueDate: date } : t))
  const bulkAdd = (newTasks) => setTasks(prev => [...newTasks, ...prev])

  const todayDueCount = tasks.filter(t => !t.completed && t.dueDate === todayISO()).length

  return (
    <div style={s.app}>
      {/* Header */}
      <header style={s.header}>
        <span style={s.logo}>Lucy's World</span>
      </header>

      {/* Tabs */}
      <div style={s.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'today' && todayDueCount > 0 && (
              <span style={s.badge}>{todayDueCount > 99 ? '99+' : todayDueCount}</span>
            )}
            {activeTab === tab.id && <div style={s.tabLine} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={s.main}>
        {activeTab === 'today' && (
          <TodayView tasks={tasks} onToggle={toggleTask} onPickTop3={() => setActiveTab('tasks')} />
        )}
        {activeTab === 'tasks' && (
          <TaskList tasks={tasks} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} onAdd={openAdd} onUpdateDate={updateTaskDate} />
        )}
        {activeTab === 'weekly' && (
          <WeeklyPlanner tasks={tasks} onAdd={openAdd} onToggle={toggleTask} />
        )}
        {activeTab === 'braindump' && (
          <BrainDump onBulkAdd={bulkAdd} />
        )}
        {activeTab === 'habits' && (
          <HabitsView />
        )}
        {activeTab === 'notes' && (
          <NotesView />
        )}
        {activeTab === 'focus' && (
          <FocusView />
        )}
      </main>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editTask={editTask} />
    </div>
  )
}

const s = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  header: {
    height: 'var(--header-h)',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--primary)',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '-0.02em',
  },
  tabBar: {
    display: 'flex',
    overflowX: 'auto',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    scrollbarWidth: 'none',
    position: 'sticky',
    top: 'var(--header-h)',
    zIndex: 99,
    WebkitOverflowScrolling: 'touch',
  },
  tab: {
    flexShrink: 0,
    padding: '0 16px',
    height: 'var(--tabs-h)',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-2)',
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--primary)',
    fontWeight: 700,
  },
  tabLine: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    background: 'var(--primary)',
    borderRadius: '2px 2px 0 0',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#EF4444',
    color: 'white',
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 99,
    minWidth: 16,
    height: 16,
    padding: '0 4px',
    marginLeft: 4,
    verticalAlign: 'middle',
    lineHeight: 1,
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
}
