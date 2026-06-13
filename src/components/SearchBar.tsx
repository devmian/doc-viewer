import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = '搜索文档...' }: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
        <Search size={18} />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 text-sm neumorphic-input"
      />
    </div>
  )
}
