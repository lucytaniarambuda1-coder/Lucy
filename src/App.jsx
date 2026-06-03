import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'
import CalendarView from './components/CalendarView'
import HabitsView from './components/HabitsView'
import NotesView from './components/NotesView'
import { useLocalStorage } from './hooks/useLocalStorage'

const SAMPLE_TASKS = [
  {
    id: 1,
    title: 'Plan birthday dinner with family',
    description: 'Book a restaurant and send invites',
    category: 'social',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dueTime: '18:00',
    tags: ['family', 'celebration'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Complete quarterly report',
    description: 'Compile Q2 data and submit to manager',
    category: 'work',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    dueTime: '17:00',
    tags: ['work', 'report'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Morning yoga & stretching',
    description: '30 minutes of yoga to start the day right',
    category: 'health',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '07:00',
    tags: ['health', 'morning'],
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Review monthly budget',
    description: 'Track spending and adjust savings goals',
    category: 'finance',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    dueTime: '',
    tags: ['finance', 'budget'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Buy groceries',
    description: 'Fruits, veggies, and healthy snacks',
    category: 'personal',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    tags: ['errands'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'Read "Atomic Habits"',
    description: 'Finish chapters 8-12',
    category: 'personal',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    dueTime: '',
    tags: ['reading', 'self-improvement'],
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('lucys-tasks', SAMPLE_TASKS)
  const [activeView, setActiveView] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)

  const openAdd = () => {
    setEditTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleSave = (formData) => {
    if (editTask) {
      setTasks(prev => prev.map(t =>
        t.id === editTask.id ? { ...t, ...formData } : t
      ))
    } else {
      const newTask = {
        ...formData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
      }
      setTasks(prev => [newTask, ...prev])
    }
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div style={styles.app}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} tasks={tasks} />

      <main style={styles.main}>
        {activeView === 'dashboard' && (
          <Dashboard tasks={tasks} onAddTask={openAdd} />
        )}
        {activeView === 'tasks' && (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onEdit={openEdit}
            onDelete={deleteTask}
            onAdd={openAdd}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView tasks={tasks} />
        )}
        {activeView === 'habits' && (
          <HabitsView />
        )}
        {activeView === 'notes' && (
          <NotesView />
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editTask={editTask}
      />
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: '#F5F3FF',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
  },
}
