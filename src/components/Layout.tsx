import { useState, type ReactNode } from 'react'
import { Link } from 'wouter'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import Search from './Search'
import { useI18n } from '../hooks/useI18n'
import type { DocNode } from '../hooks/useDocs'

interface LayoutProps {
  children: ReactNode
  tree: DocNode[]
}

export default function Layout({ children, tree }: LayoutProps) {
  const { t } = useI18n()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 xl:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          <Sidebar tree={tree} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden xl:block fixed inset-y-0 left-0 z-30">
        <Sidebar tree={tree} />
      </div>

      {/* Main content */}
      <div className="xl:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 xl:hidden"
              >
                <span className="text-xl text-gray-900 dark:text-white">☰</span>
              </button>
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                📚 {t('docs')}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-64 hidden md:block">
                <Search />
              </div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
              >
                🔍
              </button>
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
          
          {/* Mobile search */}
          {searchOpen && (
            <div className="px-4 pb-3 md:hidden">
              <Search onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
