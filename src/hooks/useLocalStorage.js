import { useState, useEffect } from 'react'
import { notifyChange, REMOTE_EVENT } from '../sync/store'

function read(key, initialValue) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  } catch {
    return initialValue
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {}
    notifyChange()
  }, [key, value])

  // Reload when the cloud copy arrives from another device
  useEffect(() => {
    const onRemote = () => setValue(read(key, initialValue))
    window.addEventListener(REMOTE_EVENT, onRemote)
    return () => window.removeEventListener(REMOTE_EVENT, onRemote)
  }, [key]) // eslint-disable-line

  return [value, setValue]
}
