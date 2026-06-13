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
      className={`neumorphic-card block p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl" style={{
          background: 'var(--inset-bg)',
          boxShadow: 'var(--shadow-inset-sm)'
        }}>
          {type === 'directory' ? <Folder className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} /> : <FileText className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold truncate text-[var(--text-primary)]`}>
            {name}
          </div>
          {title && (
            <div className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-1">
              {title}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
