import { useLocation } from 'wouter'
import { Link } from 'wouter'
import { Folder, FileText, ChevronRight, Loader2, ArrowLeft } from 'lucide-react'
import { useDocContent, useDocsTree, useDocTitles } from '../hooks/useDocs'
import { useI18n } from '../hooks/useI18n'
import type { DocNode } from '../hooks/useDocs'
import MarkdownViewer from '../components/MarkdownViewer'
import Breadcrumb from '../components/Breadcrumb'
import TableOfContents from '../components/TableOfContents'
import { useEffect } from 'react'

const RECENT_KEY = 'doc-viewer-recent'

function findNode(nodes: DocNode[], path: string): DocNode | null {
  for (const node of nodes) {
    if (node.relativePath === path) return node
    if (node.children) {
      const found = findNode(node.children, path)
      if (found) return found
    }
  }
  return null
}

function sortItems(nodes: DocNode[]) {
  return [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

function addToRecent(path: string, name: string) {
  const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  const filtered = recent.filter((r: { path: string }) => r.path !== path)
  filtered.unshift({ path, name })
  localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, 20)))
}

function ItemCard({ item, title }: { item: DocNode; title?: string | null }) {
  const isDir = item.type === 'directory'
  return (
    <Link
      href={`/${item.relativePath.replace('.md', '')}`}
      className="group relative flex items-start p-5 border border-[var(--border-primary)] rounded-2xl bg-[var(--bg-secondary)] hover:border-[var(--brand-primary)] hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${isDir ? 'bg-blue-500' : 'bg-emerald-500'} opacity-[0.03] -translate-y-8 translate-x-8 rounded-full group-hover:scale-150 transition-transform duration-500`} />
      
      <div className={`shrink-0 p-3 rounded-xl ${isDir ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'} group-hover:scale-110 transition-transform`}>
        {isDir ? <Folder size={24} strokeWidth={2.5} /> : <FileText size={24} strokeWidth={2.5} />}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className={`font-bold text-base truncate ${isDir ? 'text-[var(--text-primary)] group-hover:text-blue-600' : 'text-[var(--text-primary)] group-hover:text-emerald-600'} transition-colors`}>
            {item.name}
          </div>
          <ChevronRight size={16} className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
        </div>
        {title && (
          <div className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2 opacity-80 leading-relaxed font-medium">
            {title}
          </div>
        )}
        <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity">
          <span>{isDir ? 'Directory' : 'Document'}</span>
        </div>
      </div>
    </Link>
  )
}

export default function DocPage() {
  const [location] = useLocation()
  const { tree } = useDocsTree()
  const titles = useDocTitles()
  const { t } = useI18n()
  
  const path = ['/', '', '/docs'].includes(location) ? '' : location.replace(/^\//, '')
  const node = path ? findNode(tree, path) : null
  const isDir = node?.type === 'directory'
  const mdPath = path ? `${path}.md` : ''
  
  const { content, loading, error } = useDocContent(mdPath)

  useEffect(() => {
    if (path && !isDir) {
      addToRecent(path, path.split('/').pop() || '')
    }
  }, [path, isDir])

  const renderContent = () => {
    // Root Directory
    if (!path && tree.length > 0) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Breadcrumb path="/docs" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortItems(tree).map(item => <ItemCard key={item.relativePath} item={item} />)}
          </div>
        </div>
      )
    }

    // Directory list
    if (isDir && node?.children) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8">
            <Breadcrumb path={path} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortItems(node.children).map(item => (
              <ItemCard key={item.relativePath} item={item} title={item.type === 'file' ? titles[item.relativePath] : null} />
            ))}
          </div>
        </div>
      )
    }

    // Single Document
    return (
      <div className="max-w-screen-xl mx-auto">
        <Breadcrumb path={path} />
        
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--brand-primary)] opacity-40" />
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)] opacity-50 px-4 py-1.5 bg-[var(--brand-light)] rounded-full">
              {t('loading')}
            </p>
          </div>
        )}
        
        {error && (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full mb-4">
              <span className="text-3xl font-bold">!</span>
            </div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{t('load_failed')}</p>
          </div>
        )}
        
        {!loading && !content && !isDir && (
          <div className="py-20 text-center">
            <p className="text-lg font-bold text-[var(--text-secondary)]">{t('not_found')}</p>
            <Link href="/" className="mt-4 inline-flex items-center text-sm font-bold text-[var(--brand-primary)] hover:underline">
              <ArrowLeft size={16} className="mr-2" /> {t('back_to_dashboard')}
            </Link>
          </div>
        )}
        
        {content && (
          <div className="animate-in fade-in duration-1000 relative">
            {content.match(/^#\s+(.+)$/m)?.[1] && (
              <div className="mb-8 pb-8 border-b border-[var(--border-primary)]/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
                      {content.match(/^#\s+(.+)$/m)?.[1]}
                    </h1>
                    <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50">
                      <FileText size={14} className="mr-2" />
                      <span>Documentation Page</span>
                    </div>
                  </div>
                  <div className="fixed right-8 top-24 z-40">
                    <TableOfContents content={content} />
                  </div>
                </div>
              </div>
            )}
            <MarkdownViewer content={content} skipFirstTitle />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full pb-20">
      {renderContent()}
    </div>
  )
}
