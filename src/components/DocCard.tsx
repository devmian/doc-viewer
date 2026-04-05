import { Link } from 'wouter'
import { FileText, Folder } from 'lucide-react'

interface DocCardProps {
  name: string
  path: string
  type: 'file' | 'directory'
  title?: string | null
  className?: string
}

export default function DocCard({ name, path, type, title, className = '' }: DocCardProps) {
  return (
    <Link
      href={type === 'directory' ? `/${path}` : `/${path.replace('.md', '')}`}
      className={`card block p-4 rounded-xl ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">
          {type === 'directory' ? <Folder className="w-6 h-6 text-blue-500" /> : <FileText className="w-6 h-6 text-gray-400" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${type === 'directory' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {name}
          </div>
          {title && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
              {title}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
