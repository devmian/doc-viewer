import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <button className="h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700">🌙</button>
  }

  return (
    <button
      onClick={toggleTheme}
      className={`h-10 px-3 rounded-lg transition-colors text-lg cursor-pointer ${
        theme === 'dark' 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
