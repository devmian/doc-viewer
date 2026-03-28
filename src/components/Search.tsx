import { useState } from 'react'
import { useSearch } from '../hooks/useDocs'

interface SearchProps {
  onClose?: () => void
}

export default function Search({ onClose }: SearchProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useSearch(query)

  return (
    <div className="w-full relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文档..."
          className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 max-h-80 overflow-y-auto shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-gray-500">搜索中...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">未找到相关文档</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <li key={result.path}>
                  <a
                    href={`/${result.path.replace('.md', '')}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{result.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{result.snippet}</div>
                    <div className="text-xs text-gray-400 mt-1">{result.path}</div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
