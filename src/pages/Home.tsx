import { useState, useEffect } from 'react'
import { useDocsTree, useDocTitles } from '../hooks/useDocs'
import { Link } from 'wouter'

const RECENT_KEY = 'doc-viewer-recent'

export default function Home() {
  const { tree, loading, error } = useDocsTree()
  const titles = useDocTitles()
  const [recentDocs, setRecentDocs] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY)
    if (stored) {
      try {
        setRecentDocs(JSON.parse(stored))
      } catch {}
    }
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) {
        try {
          setRecentDocs(JSON.parse(stored))
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">加载失败: {error}</div>
      </div>
    )
  }

  const renderNode = (node: any) => {
    const title = node.type === 'file' ? titles[node.relativePath] : null
    return (
      <Link
        key={node.relativePath}
        href={node.type === 'directory' 
          ? `/${node.relativePath}` 
          : `/${node.relativePath.replace('.md', '')}`}
        className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
      >
        <div className="flex items-start">
          <span className="text-xl mr-2">{node.type === 'directory' ? '📁' : '📄'}</span>
          <div>
            <div className={node.type === 'directory' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}>{node.name}</div>
            {title && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{title}</div>}
          </div>
        </div>
      </Link>
    )
  }

  const directories = tree.filter(n => n.type === 'directory')
  const files = tree.filter(n => n.type === 'file')
  const allInRoot = [...directories, ...files]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">文档浏览器</h1>
      
      {tree.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">暂无文档</p>
          <p className="text-sm mt-2">在 docs/ 文件夹中添加 Markdown 文档即可显示</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">目录</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {allInRoot.map(renderNode)}
            </div>
          </div>

          {recentDocs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">最近查看</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {recentDocs.slice(0, 6).map((doc) => (
                  <Link
                    key={doc.path}
                    href={`/${doc.path}`}
                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start">
                      <span className="text-xl mr-2">📄</span>
                      <span className="text-gray-900 dark:text-white text-sm">{doc.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">文档</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {files.map(renderNode)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
