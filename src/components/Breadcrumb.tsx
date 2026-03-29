import { Link } from 'wouter'
import { ChevronRight, Home } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

interface BreadcrumbProps {
  path: string
}

export default function Breadcrumb({ path }: BreadcrumbProps) {
  const { t } = useI18n()
  const parts = path.split('/').filter(Boolean)
  
  const breadcrumbs = [
    { name: t('dashboard'), href: '/' },
    { name: t('docs'), href: '/docs' },
    ...parts.map((part, index) => ({
      name: part.replace('.md', ''),
      href: '/' + parts.slice(0, index + 1).join('/')
    }))
  ]

  return (
    <nav className="flex items-center text-xs sm:text-sm text-[var(--text-secondary)] mb-8 bg-[var(--brand-light)]/30 px-4 py-2 rounded-full w-fit border border-[var(--border-primary)]/50">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        return (
          <span key={crumb.href} className="flex items-center">
            {index === 0 && (
              <Home size={14} className="mr-2 text-[var(--brand-primary)]" />
            )}
            {index > 0 && <ChevronRight size={12} className="mx-2 opacity-40 shrink-0" />}
            {isLast ? (
              <span className="text-[var(--text-primary)] font-semibold truncate max-w-[120px] sm:max-w-none">
                {crumb.name}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                className="hover:text-[var(--brand-primary)] transition-colors hover:font-medium whitespace-nowrap"
              >
                {crumb.name}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
