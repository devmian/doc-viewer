import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import type { DocNode } from '../hooks/useDocs'

interface SidebarProps {
  tree: DocNode[]
}

interface TreeItemProps {
  node: DocNode
  depth: number
}

function TreeItem({ node, depth }: TreeItemProps) {
  const [location] = useLocation()
  const [expanded, setExpanded] = useState(depth < 2)
  
  const isActive = node.type === 'file' && `/${node.relativePath.replace('.md', '')}` === location
  const isDir = node.type === 'directory'
  
  if (isDir) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <span className="mr-1 text-gray-500 dark:text-gray-400 text-xs">
            {expanded ? '▼' : '▶'}
          </span>
          <span className="font-medium text-blue-600 dark:text-blue-400">{node.name}</span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map(child => (
              <TreeItem key={child.relativePath} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <Link
      href={`/${node.relativePath.replace('.md', '')}`}
      className={`flex items-center w-full px-2 py-1.5 text-sm text-left rounded transition-colors ${
        isActive 
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      <span className="mr-2">📄</span>
      <span className="text-green-600 dark:text-green-400">{node.name}</span>
    </Link>
  )
}

export default function Sidebar({ tree }: SidebarProps) {
  return (
    <aside className="w-64 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
      <div className="p-4">
        <Link href="/" className="block text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          📚 文档
        </Link>
      </div>
      <nav className="px-2 pb-4">
        {tree.length === 0 ? (
          <p className="px-2 py-4 text-sm text-gray-500">暂无文档</p>
        ) : (
          tree.map(node => (
            <TreeItem key={node.relativePath} node={node} depth={0} />
          ))
        )}
      </nav>
    </aside>
  )
}
