import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <button className="p-2">🌙</button>
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
      style={{ background: theme === 'dark' ? '#374151' : '#f3f4f6' }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
