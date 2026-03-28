import { Link } from 'wouter'

interface BreadcrumbProps {
  path: string
}

export default function Breadcrumb({ path }: BreadcrumbProps) {
  const parts = path.split('/').filter(Boolean)
  
  const breadcrumbs = [
    { name: '首页', href: '/' },
    ...parts.map((part, index) => ({
      name: part.replace('.md', ''),
      href: '/' + parts.slice(0, index + 1).join('/').replace('.md', '')
    }))
  ]

  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-white font-medium">{crumb.name}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {crumb.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
