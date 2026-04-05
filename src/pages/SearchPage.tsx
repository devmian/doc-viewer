import { useLocation } from 'wouter'
import { Search as SearchIcon, FileSearch } from 'lucide-react'
import Search from '../components/Search'

export default function SearchPage() {
  const [location] = useLocation()
  const query = new URLSearchParams(location.split('?')[1] || '').get('query') || ''

  return (
    <div className="w-full max-w-screen-xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12 max-w-2xl mx-auto text-center px-4">
        <div className="inline-flex p-4 bg-[var(--brand-light)] text-[var(--brand-primary)] rounded-3xl mb-6 shadow-sm">
          <FileSearch size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
          查找文档
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          快速定位系统资源、规范与开发指南
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        <Search />
      </div>
      
      {!query && (
        <div className="mt-20 text-center opacity-40">
          <div className="flex justify-center mb-6">
            <SearchIcon size={64} className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-lg font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            输入关键词开始搜索
          </p>
        </div>
      )}
    </div>
  )
}
