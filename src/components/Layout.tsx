import { useState, type ReactNode } from 'react'
import { Link } from 'wouter'
import { Menu, Home, Search as SearchIcon, X } from 'lucide-react'
import Sidebar from './Sidebar'
import HeaderButtons from './HeaderButtons'
import Search from './Search'
import type { DocNode } from '../hooks/useDocs'

interface LayoutProps {
  children: ReactNode
  tree: DocNode[]
  title?: string
}

export default function Layout({ children, tree, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 xl:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out xl:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-2xl">
          <div className="flex justify-end p-4">
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-[var(--brand-light)] text-[var(--text-secondary)]">
              <X size={20} />
            </button>
          </div>
          <Sidebar tree={tree} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden xl:block fixed inset-y-0 left-0 z-30 w-72 border-r border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <Sidebar tree={tree} />
      </div>

      {/* Main content */}
      <div className="xl:pl-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 glass-header border-b border-[var(--border-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)] xl:hidden transition-all duration-200"
                  aria-label="Open menu"
                >
                  <Menu size={22} />
                </button>
                <Link href="/" className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)] transition-all duration-200" aria-label="Go home">
                  <Home size={22} />
                </Link>
                {title && (
                  <div className="hidden sm:block h-6 w-px bg-[var(--border-primary)] mx-2" />
                )}
                {title && (
                  <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] truncate max-w-[200px] md:max-w-md">
                    {title}
                  </h1>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden md:block w-70">
                  <Search />
                </div>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)] md:hidden transition-all duration-200"
                  aria-label="Search documents"
                >
                  <SearchIcon size={20} />
                </button>
                <HeaderButtons />
              </div>
            </div>
          </div>
          
          {/* Mobile search */}
          {searchOpen && (
            <div className="px-4 pb-4 md:hidden animate-in slide-in-from-top duration-200">
              <Search onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 flex flex-col p-4 sm:p-8 lg:p-12 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-8 px-6 border-top border-[var(--border-primary)] text-center text-sm text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} LogicEngine Documentation</p>
        </footer>
      </div>
    </div>
  )
}
