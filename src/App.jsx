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

const TASKS_VERSION = 4

const HOME_TASKS = [
  { id: 401, title: 'Pay outstanding rates and taxes — R40,000', description: 'Pay outstanding rates and taxes on the house', category: 'home', priority: 'high', dueDate: '2026-06-14', dueTime: '', tags: ['rates', 'taxes'], completed: false, createdAt: new Date().toISOString() },
  { id: 402, title: 'Complete home landscaping', description: '', category: 'home', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['garden'], completed: false, createdAt: new Date().toISOString() },
  { id: 403, title: 'Wall plaster and interior design', description: '', category: 'home', priority: 'medium', dueDate: '2026-09-30', dueTime: '', tags: ['renovation'], completed: false, createdAt: new Date().toISOString() },
  { id: 404, title: 'Install built-in kitchen cupboards', description: '', category: 'home', priority: 'medium', dueDate: '2026-09-30', dueTime: '', tags: ['renovation', 'kitchen'], completed: false, createdAt: new Date().toISOString() },
  { id: 405, title: 'Install bedroom built-in cupboards', description: '', category: 'home', priority: 'medium', dueDate: '2026-10-31', dueTime: '', tags: ['renovation', 'bedroom'], completed: false, createdAt: new Date().toISOString() },
  { id: 406, title: 'Complete bathroom improvements', description: '', category: 'home', priority: 'medium', dueDate: '2026-10-31', dueTime: '', tags: ['renovation', 'bathroom'], completed: false, createdAt: new Date().toISOString() },
  { id: 407, title: 'Set up dedicated home study/office space', description: 'Dedicated home office/study area', category: 'home', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['workspace'], completed: false, createdAt: new Date().toISOString() },
  { id: 408, title: 'Complete home décor and furnishing', description: '', category: 'home', priority: 'low', dueDate: '2026-11-30', dueTime: '', tags: ['decor'], completed: false, createdAt: new Date().toISOString() },
  { id: 409, title: 'Monthly home maintenance check', description: '', category: 'home', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['maintenance', 'recurring'], completed: false, createdAt: new Date().toISOString() },
]

const WORK_TASKS = [
  { id: 501, title: 'Submit Kenya bank CRS documents', description: '', category: 'work', priority: 'high', dueDate: '2026-06-14', dueTime: '', tags: ['dash-bpo', 'kenya', 'banking'], completed: false, createdAt: new Date().toISOString() },
  { id: 502, title: 'Respond to SARS third-party notices', description: '', category: 'work', priority: 'high', dueDate: '2026-06-14', dueTime: '', tags: ['dash-bpo', 'sars', 'compliance'], completed: false, createdAt: new Date().toISOString() },
  { id: 503, title: 'Finalise Nakama Master Services Agreement', description: '', category: 'work', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['dash-bpo', 'nakama', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 504, title: "Resolve O'Neill & Borges Puerto Rico labour matter", description: '', category: 'work', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['dash-bpo', 'labour'], completed: false, createdAt: new Date().toISOString() },
  { id: 505, title: 'Deliver NBC reporting dashboard', description: '', category: 'work', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['dash-bpo', 'nbc'], completed: false, createdAt: new Date().toISOString() },
  { id: 506, title: 'Develop TTI growth opportunities', description: '', category: 'work', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['dash-bpo', 'tti'], completed: false, createdAt: new Date().toISOString() },
  { id: 507, title: 'Develop Bar Taco opportunities', description: '', category: 'work', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['dash-bpo', 'bar-taco'], completed: false, createdAt: new Date().toISOString() },
  { id: 508, title: 'Progress Lombard Insurance engagement', description: '', category: 'work', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['dash-bpo', 'lombard'], completed: false, createdAt: new Date().toISOString() },
  { id: 509, title: 'Finalise 4th Floor contract', description: '', category: 'work', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['dash-bpo', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 510, title: 'Review and confirm Apollo AI contract', description: '', category: 'work', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['dash-bpo', 'apollo', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 511, title: 'Compile AI cost master list', description: 'Compile master list of all AI-related costs', category: 'work', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['dash-bpo', 'ai', 'budget'], completed: false, createdAt: new Date().toISOString() },
  { id: 512, title: 'Build AI team capability development plan', description: '', category: 'work', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['dash-bpo', 'ai', 'team'], completed: false, createdAt: new Date().toISOString() },
  { id: 513, title: 'Launch Dash Digital reporting dashboard', description: '', category: 'work', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['dash-digital'], completed: false, createdAt: new Date().toISOString() },
  { id: 514, title: 'Finalise Dash Digital MSA for TTI', description: '', category: 'work', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['dash-digital', 'tti', 'contract'], completed: false, createdAt: new Date().toISOString() },
  { id: 515, title: 'Define Dash Digital operating model', description: '', category: 'work', priority: 'high', dueDate: '2026-07-31', dueTime: '', tags: ['dash-digital'], completed: false, createdAt: new Date().toISOString() },
  { id: 516, title: 'Execute Move the Needle initiatives', description: '', category: 'work', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['dash-digital', 'needle'], completed: false, createdAt: new Date().toISOString() },
  { id: 517, title: 'Prepare weekly board deck', description: '', category: 'work', priority: 'medium', dueDate: '2026-06-12', dueTime: '', tags: ['recurring', 'board'], completed: false, createdAt: new Date().toISOString() },
  { id: 518, title: 'Write weekly executive summary', description: '', category: 'work', priority: 'medium', dueDate: '2026-06-12', dueTime: '', tags: ['recurring'], completed: false, createdAt: new Date().toISOString() },
  { id: 519, title: 'Run management steering meeting', description: '', category: 'work', priority: 'medium', dueDate: '2026-06-09', dueTime: '', tags: ['recurring', 'meetings'], completed: false, createdAt: new Date().toISOString() },
  { id: 520, title: 'Run weekly AI team meeting', description: '', category: 'work', priority: 'medium', dueDate: '2026-06-09', dueTime: '', tags: ['recurring', 'ai', 'meetings'], completed: false, createdAt: new Date().toISOString() },
  { id: 521, title: 'Review client visit processes', description: '', category: 'work', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['recurring', 'clients'], completed: false, createdAt: new Date().toISOString() },
]

const PERSONAL_TASKS = [
  { id: 601, title: 'Launch How Corner website', description: '', category: 'personal', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['brand', 'website'], completed: false, createdAt: new Date().toISOString() },
  { id: 602, title: 'Acquire first consulting clients', description: '', category: 'personal', priority: 'high', dueDate: '2026-07-31', dueTime: '', tags: ['brand', 'clients'], completed: false, createdAt: new Date().toISOString() },
  { id: 603, title: 'Launch Open Flow Corner platform', description: '', category: 'personal', priority: 'high', dueDate: '2026-08-31', dueTime: '', tags: ['brand', 'flow-corner'], completed: false, createdAt: new Date().toISOString() },
  { id: 604, title: 'Publish weekly Substack article', description: 'Consistent weekly publishing on Substack', category: 'personal', priority: 'medium', dueDate: '2026-06-12', dueTime: '', tags: ['writing', 'substack', 'recurring'], completed: false, createdAt: new Date().toISOString() },
  { id: 605, title: 'Launch Passion Purpose Peace book', description: '', category: 'personal', priority: 'high', dueDate: '2026-09-30', dueTime: '', tags: ['writing', 'book'], completed: false, createdAt: new Date().toISOString() },
  { id: 606, title: 'Write weekly blog post', description: '', category: 'personal', priority: 'medium', dueDate: '2026-06-12', dueTime: '', tags: ['writing', 'blog', 'recurring'], completed: false, createdAt: new Date().toISOString() },
  { id: 607, title: 'Plan Concerns of Six Prayer Retreat', description: '', category: 'personal', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['events', 'prayer'], completed: false, createdAt: new Date().toISOString() },
  { id: 608, title: 'Host Jennifer Hudson event', description: '', category: 'personal', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['events'], completed: false, createdAt: new Date().toISOString() },
  { id: 609, title: 'Organise Significance Conference', description: '', category: 'personal', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['events', 'conference'], completed: false, createdAt: new Date().toISOString() },
  { id: 610, title: 'Plan and host Gracevation event', description: '', category: 'personal', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['events'], completed: false, createdAt: new Date().toISOString() },
  { id: 611, title: 'Organise Relationship Room event', description: '', category: 'personal', priority: 'medium', dueDate: '2026-09-30', dueTime: '', tags: ['events', 'relationships'], completed: false, createdAt: new Date().toISOString() },
  { id: 612, title: 'Plan Precious Daughters event', description: '', category: 'personal', priority: 'medium', dueDate: '2026-09-30', dueTime: '', tags: ['events'], completed: false, createdAt: new Date().toISOString() },
  { id: 613, title: 'Plan solo travel trip', description: '', category: 'personal', priority: 'medium', dueDate: '2026-09-30', dueTime: '', tags: ['growth', 'travel'], completed: false, createdAt: new Date().toISOString() },
  { id: 614, title: 'Book cooking classes', description: '', category: 'personal', priority: 'low', dueDate: '2026-10-31', dueTime: '', tags: ['growth'], completed: false, createdAt: new Date().toISOString() },
  { id: 615, title: 'Complete 3 books from reading list', description: '', category: 'personal', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['growth', 'reading'], completed: false, createdAt: new Date().toISOString() },
  { id: 616, title: 'Start daily journaling practice', description: '', category: 'personal', priority: 'medium', dueDate: '2026-06-14', dueTime: '', tags: ['growth', 'journaling'], completed: false, createdAt: new Date().toISOString() },
  { id: 617, title: 'Schedule monthly friendship catch-ups', description: '', category: 'personal', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['growth', 'social'], completed: false, createdAt: new Date().toISOString() },
  { id: 618, title: 'Write future husband standards list', description: '', category: 'personal', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['relationships'], completed: false, createdAt: new Date().toISOString() },
  { id: 619, title: 'Begin intentional dating preparation', description: '', category: 'personal', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['relationships'], completed: false, createdAt: new Date().toISOString() },
]

const SCHOOL_TASKS = [
  { id: 701, title: "Submit Industrial Psychology Master's proposal", description: '', category: 'school', priority: 'high', dueDate: '2026-07-31', dueTime: '', tags: ['masters', 'proposal'], completed: false, createdAt: new Date().toISOString() },
  { id: 702, title: 'Book supervisor meeting', description: '', category: 'school', priority: 'high', dueDate: '2026-06-14', dueTime: '', tags: ['masters', 'supervisor'], completed: false, createdAt: new Date().toISOString() },
  { id: 703, title: 'Complete research methodology chapter', description: '', category: 'school', priority: 'high', dueDate: '2026-08-31', dueTime: '', tags: ['masters', 'research'], completed: false, createdAt: new Date().toISOString() },
  { id: 704, title: 'Complete literature review', description: '', category: 'school', priority: 'high', dueDate: '2026-08-31', dueTime: '', tags: ['masters', 'research'], completed: false, createdAt: new Date().toISOString() },
  { id: 705, title: 'Submit ethics application', description: '', category: 'school', priority: 'high', dueDate: '2026-07-31', dueTime: '', tags: ['masters', 'ethics'], completed: false, createdAt: new Date().toISOString() },
  { id: 706, title: 'Complete research project milestone', description: '', category: 'school', priority: 'high', dueDate: '2026-09-30', dueTime: '', tags: ['masters', 'research'], completed: false, createdAt: new Date().toISOString() },
  { id: 707, title: 'Complete weekly academic reading', description: '', category: 'school', priority: 'medium', dueDate: '2026-06-12', dueTime: '', tags: ['masters', 'reading', 'recurring'], completed: false, createdAt: new Date().toISOString() },
  { id: 708, title: 'Complete Anthropic Claude course', description: '', category: 'school', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['courses', 'ai'], completed: false, createdAt: new Date().toISOString() },
  { id: 709, title: 'Enrol in AI skills course', description: '', category: 'school', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['courses', 'ai'], completed: false, createdAt: new Date().toISOString() },
]

const HEALTH_TASKS = [
  { id: 801, title: 'Create weekly exercise schedule', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-14', dueTime: '', tags: ['physical', 'exercise'], completed: false, createdAt: new Date().toISOString() },
  { id: 802, title: 'Establish morning walk routine', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-14', dueTime: '', tags: ['physical', 'exercise'], completed: false, createdAt: new Date().toISOString() },
  { id: 803, title: 'Book pilates classes for July', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['physical', 'exercise'], completed: false, createdAt: new Date().toISOString() },
  { id: 804, title: 'Set up sleep tracking system', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['physical', 'sleep'], completed: false, createdAt: new Date().toISOString() },
  { id: 805, title: 'Buy daily water tracker bottle', description: '', category: 'health', priority: 'low', dueDate: '2026-06-14', dueTime: '', tags: ['physical', 'habits'], completed: false, createdAt: new Date().toISOString() },
  { id: 806, title: 'Book therapy or coaching sessions', description: '', category: 'health', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['mental', 'therapy'], completed: false, createdAt: new Date().toISOString() },
  { id: 807, title: 'Set up weekly journaling practice', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-14', dueTime: '', tags: ['mental', 'journaling'], completed: false, createdAt: new Date().toISOString() },
  { id: 808, title: 'Create burnout prevention protocol', description: '', category: 'health', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['mental', 'wellbeing'], completed: false, createdAt: new Date().toISOString() },
  { id: 809, title: 'Start prayer journal', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-14', dueTime: '', tags: ['spiritual'], completed: false, createdAt: new Date().toISOString() },
  { id: 810, title: 'Join Bible study group', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['spiritual'], completed: false, createdAt: new Date().toISOString() },
  { id: 811, title: 'Complete Growth Track registration', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['church', 'growth-track'], completed: false, createdAt: new Date().toISOString() },
  { id: 812, title: 'Schedule meeting with pastors', description: '', category: 'health', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['church', 'pastors'], completed: false, createdAt: new Date().toISOString() },
  { id: 813, title: 'Attend Singles Ministry event', description: '', category: 'health', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['church', 'singles-ministry'], completed: false, createdAt: new Date().toISOString() },
  { id: 814, title: 'Build SCFC website', description: 'Soweto Christian Family Church website', category: 'health', priority: 'medium', dueDate: '2026-08-31', dueTime: '', tags: ['church', 'website'], completed: false, createdAt: new Date().toISOString() },
]

const FINANCE_TASKS = [
  { id: 901, title: 'Open emergency savings account (3-month target)', description: '', category: 'finance', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['savings'], completed: false, createdAt: new Date().toISOString() },
  { id: 902, title: 'Start house improvement savings fund', description: '', category: 'finance', priority: 'medium', dueDate: '2026-06-30', dueTime: '', tags: ['savings'], completed: false, createdAt: new Date().toISOString() },
  { id: 903, title: 'Open travel savings account', description: '', category: 'finance', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['savings'], completed: false, createdAt: new Date().toISOString() },
  { id: 904, title: "Pay Master's degree registration fees", description: '', category: 'finance', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['career', 'education'], completed: false, createdAt: new Date().toISOString() },
  { id: 905, title: 'Register for professional development course', description: '', category: 'finance', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['career', 'education'], completed: false, createdAt: new Date().toISOString() },
  { id: 906, title: 'Register for target industry conference', description: '', category: 'finance', priority: 'medium', dueDate: '2026-07-31', dueTime: '', tags: ['career'], completed: false, createdAt: new Date().toISOString() },
  { id: 907, title: 'Open investment account (EasyEquities or similar)', description: '', category: 'finance', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['wealth', 'investing'], completed: false, createdAt: new Date().toISOString() },
  { id: 908, title: 'Generate first R10k in side business revenue', description: '', category: 'finance', priority: 'high', dueDate: '2026-07-31', dueTime: '', tags: ['wealth', 'income'], completed: false, createdAt: new Date().toISOString() },
  { id: 909, title: 'Sign first consulting client', description: '', category: 'finance', priority: 'high', dueDate: '2026-06-30', dueTime: '', tags: ['wealth', 'income'], completed: false, createdAt: new Date().toISOString() },
  { id: 910, title: 'Generate first revenue from Open Flow Corner', description: '', category: 'finance', priority: 'high', dueDate: '2026-08-31', dueTime: '', tags: ['wealth', 'flow-corner'], completed: false, createdAt: new Date().toISOString() },
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
  const [top3, setTop3] = useLocalStorage('lucys-top3', {})
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
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setTop3(prev => {
      const next = {}
      Object.entries(prev).forEach(([day, ids]) => { next[day] = ids.filter(x => x !== id) })
      return next
    })
  }
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
          <TodayView tasks={tasks} onToggle={toggleTask} top3={top3} setTop3={setTop3} />
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
