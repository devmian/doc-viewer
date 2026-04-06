import { useState, useMemo } from 'react'
import { Link, useLocation } from 'wouter'
import { ChevronDown, ChevronRight, FileText, Folder, LayoutGrid, Search, Home, Settings, Sun, Moon } from 'lucide-react'
import type { DocNode } from '../hooks/useDocs'
import { useTheme } from '../hooks/useTheme'

interface SidebarProps {
  tree: DocNode[]
}

interface TreeItemProps {
  node: DocNode
  depth: number
  searchTerm: string
}

const filterTree = (node: DocNode, searchTerm: string): boolean => {
  if (!searchTerm) return true
  if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true
  if (node.children) {
    return node.children.some(child => filterTree(child, searchTerm))
  }
  return false
}

function TreeItem({ node, depth, searchTerm }: TreeItemProps) {
  const [location] = useLocation()
  const [expanded, setExpanded] = useState(depth < 2)
  
  const isActive = node.type === 'file' && `/${node.relativePath.replace(/\.md$/, '')}` === location
  const isDir = node.type === 'directory'
  
  if (isDir) {
    const hasVisibleChildren = node.children?.some(child => filterTree(child, searchTerm))
    if (searchTerm && !hasVisibleChildren && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null
    }
    
    return (
      <div className="mb-px">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)] rounded-xl transition-all duration-200 group sidebar-item-hover"
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
              <TreeItem key={child.relativePath} node={child} depth={depth + 1} searchTerm={searchTerm} />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return null
  }
  
  return (
    <Link
      href={`/${node.relativePath.replace(/\.md$/, '')}`}
      className={`relative flex items-center w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 group sidebar-item-hover ${
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
  const [searchTerm, setSearchTerm] = useState('')
  const { theme, toggleTheme } = useTheme()
  
  const filteredTree = useMemo(() => {
    if (!searchTerm) return tree
    return tree.filter(node => filterTree(node, searchTerm))
  }, [tree, searchTerm])
  
  return (
    <div className="flex flex-col h-full py-6 bg-[var(--bg-secondary)] sidebar-glass">
      {/* Header */}
      <div className="px-5 mb-6">
        <Link 
          href="/" 
          className="flex items-center space-x-3 text-xl font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors group mb-5"
        >
          <div className="p-2.5 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-hover)] text-white rounded-xl sidebar-logo-hover group-hover:shadow-lg transition-all duration-200">
            <LayoutGrid size={20} />
          </div>
          <span>LogicDoc</span>
        </Link>
        
        {/* Search Box */}
        <div className="sidebar-search flex items-center px-3 py-2.5">
          <Search size={16} className="text-[var(--text-secondary)] mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索文档..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredTree.length === 0 ? (
          <p className="px-4 py-8 text-sm text-[var(--text-secondary)] text-center italic opacity-60">
            {searchTerm ? '未找到匹配文档' : '暂无可用文档'}
          </p>
        ) : (
          filteredTree.map(node => (
            <TreeItem key={node.relativePath} node={node} depth={0} searchTerm={searchTerm} />
          ))
        )}
      </nav>
      
      {/* Status Bar */}
      <div className="sidebar-status-bar px-4 py-4 mt-auto">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="user-avatar relative">
            J
            <div className="online-indicator"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--text-primary)]">Jason</div>
            <div className="text-xs text-[var(--text-secondary)]">在线</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link href="/" className="sidebar-action-btn flex-1">
            <Home size={14} />
            <span>首页</span>
          </Link>
          <button className="sidebar-action-btn flex-1" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>主题</span>
          </button>
          <button className="sidebar-action-btn flex-1">
            <Settings size={14} />
            <span>设置</span>
          </button>
        </div>
      </div>
    </div>
  )
}