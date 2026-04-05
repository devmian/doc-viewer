import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { Clock, FileText } from 'lucide-react'

const RECENT_KEY = 'doc-viewer-recent'

interface RecentDoc {
  name: string
  path: string
}

interface RecentDocsProps {
  limit?: number
}

export default function RecentDocs({ limit = 6 }: RecentDocsProps) {
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY)
    if (stored) {
      try {
        setRecentDocs(JSON.parse(stored))
      } catch {
        setRecentDocs([])
      }
    }
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) {
        try {
          setRecentDocs(JSON.parse(stored))
        } catch {
          setRecentDocs([])
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (recentDocs.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Clock size={20} className="text-gray-400" />
        最近查看
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {recentDocs.slice(0, limit).map((doc, index) => (
          <Link
            key={doc.path}
            href={`/${doc.path}`}
            className={`card block p-4 rounded-xl animate-fade-in-up stagger-${index + 1} opacity-0`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-[var(--text-primary)] text-sm font-medium truncate">
                {doc.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
