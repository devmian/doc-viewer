import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { ChevronDown, ChevronRight, FileText, Folder, LayoutGrid } from 'lucide-react'
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
  
  const isActive = node.type === 'file' && `/${node.relativePath.replace(/\.md$/, '')}` === location
  const isDir = node.type === 'directory'
  
  if (isDir) {
    return (
      <div className="mb-px">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)] rounded-xl transition-all duration-200 group"
        >
          <span className="mr-2 text-[var(--text-secondary)] opacity-40 group-hover:opacity-100">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <Folder size={16} className="mr-2 text-[var(--brand-primary)] opacity-70 group-hover:opacity-100" />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && node.children && (
          <div className="ml-5 border-l border-[var(--border-primary)] pl-2 mt-1 space-y-1">
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
      href={`/${node.relativePath.replace(/\.md$/, '')}`}
      className={`relative flex items-center w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-[var(--brand-light)] text-[var(--brand-primary)] font-semibold shadow-sm' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)]'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[var(--brand-primary)] rounded-r-md" />
      )}
      <FileText size={16} className={`mr-2 flex-shrink-0 ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-secondary)] opacity-50 group-hover:opacity-100'}`} />
      <span className="truncate">{node.name}</span>
    </Link>
  )
}

export default function Sidebar({ tree }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] py-6">
      <div className="px-6 mb-8">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors group">
          <div className="p-2 bg-[var(--brand-primary)] text-white rounded-xl group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            <LayoutGrid size={20} />
          </div>
          <span>LogicDoc</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {tree.length === 0 ? (
          <p className="px-4 py-8 text-sm text-[var(--text-secondary)] text-center italic opacity-60">
            暂无可用文档
          </p>
        ) : (
          tree.map(node => (
            <TreeItem key={node.relativePath} node={node} depth={0} />
          ))
        )}
      </nav>
      
      <div className="px-6 pt-4 border-t border-[var(--border-primary)] mt-auto">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] opacity-60">
          <span>v1.2.0</span>
          <span>© 2024 Engine</span>
        </div>
      </div>
    </div>
  )
}
