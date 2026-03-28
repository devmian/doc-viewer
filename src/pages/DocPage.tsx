import { useLocation } from 'wouter'
import { Link } from 'wouter'
import { useDocContent, useDocsTree, useDocTitles } from '../hooks/useDocs'
import { useI18n } from '../hooks/useI18n'
import type { DocNode } from '../hooks/useDocs'
import MarkdownViewer from '../components/MarkdownViewer'
import Breadcrumb from '../components/Breadcrumb'
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
      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start">
        <span className="text-2xl mr-3">{isDir ? '📁' : '📄'}</span>
        <div>
          <div className={`font-medium ${isDir ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
            {item.name}
          </div>
          {title && <div className="text-sm text-gray-500 mt-1 line-clamp-2">{title}</div>}
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

  // 根目录
  if (!path && tree.length > 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Breadcrumb path="/docs" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortItems(tree).map(item => <ItemCard key={item.relativePath} item={item} />)}
        </div>
      </div>
    )
  }

  // 空路径
  if (!path) return null

  // 目录
  if (isDir && node?.children) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Breadcrumb path={path} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortItems(node.children).map(item => (
            <ItemCard key={item.relativePath} item={item} title={item.type === 'file' ? titles[item.relativePath] : null} />
          ))}
        </div>
      </div>
    )
  }

  // 文档
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Breadcrumb path={path} />
      {loading && <div className="text-gray-500 py-8 text-center">{t('loading')}</div>}
      {error && <div className="text-red-500 py-8 text-center">{t('load_failed')}</div>}
      {!loading && !content && <div className="text-gray-500 py-8 text-center">{t('not_found')}</div>}
      {content && (
        <>
          {content.match(/^#\s+(.+)$/m)?.[1] && (
            <h1 className="doc-page-title">{content.match(/^#\s+(.+)$/m)?.[1]}</h1>
          )}
          <MarkdownViewer content={content} skipFirstTitle />
        </>
      )}
    </div>
  )
}
