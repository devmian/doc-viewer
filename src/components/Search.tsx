import { useState } from 'react'
import { Search as SearchIcon, Loader2, FileText, ChevronRight } from 'lucide-react'
import { Link } from 'wouter'
import { useSearch } from '../hooks/useDocs'

interface SearchProps {
  onClose?: () => void
}

export default function Search({ onClose }: SearchProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useSearch(query)

  return (
    <div className="w-full relative group">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文档..."
          className="w-full px-4 py-2.5 pl-11 text-sm border border-[var(--border-primary)] rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200 placeholder:text-[var(--text-secondary)] shadow-sm group-hover:shadow-md"
          autoFocus
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-50 group-hover:opacity-100 transition-opacity">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <SearchIcon size={18} />}
        </div>
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50 border border-[var(--border-primary)] rounded-2xl bg-[var(--bg-secondary)] max-h-[32rem] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-8 text-center space-y-3">
              <Loader2 size={24} className="mx-auto animate-spin text-[var(--brand-primary)]" />
              <p className="text-sm text-[var(--text-secondary)]">正在搜索文档...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">未找到相关结果</p>
              <p className="text-xs text-[var(--text-secondary)]">尝试使用不同的关键字</p>
            </div>
          ) : (
            <div className="p-2">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] opacity-50">
                搜索结果 ({results.length})
              </div>
              <ul className="space-y-1">
                {results.map((result) => (
                  <li key={result.path}>
                    <Link
                      href={`/${result.path.replace(/\.md$/, '')}`}
                      className="flex items-start p-3 rounded-xl hover:bg-[var(--brand-light)] transition-all duration-200 group/item"
                      onClick={onClose}
                    >
                      <div className="mt-1 p-2 bg-[var(--bg-primary)] rounded-lg text-[var(--brand-primary)] group-hover/item:bg-white transition-colors">
                        <FileText size={16} />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm text-[var(--text-primary)] truncate transition-colors group-hover/item:text-[var(--brand-primary)]">
                            {result.title}
                          </div>
                          <ChevronRight size={14} className="text-[var(--text-secondary)] opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1 opacity-70 italic">
                          {result.path}
                        </div>
                        {result.snippet && (
                          <div className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed" 
                               dangerouslySetInnerHTML={{ __html: result.snippet! }} />
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
