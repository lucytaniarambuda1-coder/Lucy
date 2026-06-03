export function buildGCalUrl(task) {
  const base = 'https://calendar.google.com/calendar/render'
  const title = encodeURIComponent(task.title)
  const desc = encodeURIComponent(task.description || '')

  let dates
  if (task.dueDate) {
    const d = task.dueDate.replace(/-/g, '')
    if (task.dueTime) {
      const [hh, mm] = task.dueTime.split(':')
      const endHour = Number(hh) >= 23 ? '23' : String(Number(hh) + 1).padStart(2, '0')
      dates = `${d}T${hh}${mm}00/${d}T${endHour}${mm}00`
    } else {
      const next = new Date(task.dueDate + 'T00:00:00')
      next.setDate(next.getDate() + 1)
      dates = `${d}/${next.toISOString().split('T')[0].replace(/-/g, '')}`
    }
  } else {
    const t = new Date()
    const n = new Date(t)
    n.setDate(n.getDate() + 1)
    dates = `${t.toISOString().split('T')[0].replace(/-/g, '')}/${n.toISOString().split('T')[0].replace(/-/g, '')}`
  }

  return `${base}?action=TEMPLATE&text=${title}&dates=${dates}&details=${desc}`
}
