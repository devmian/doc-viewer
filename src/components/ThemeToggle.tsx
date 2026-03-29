import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[var(--brand-light)] animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 transform active:scale-95 ${
        theme === 'dark' 
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 shadow-inner' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
