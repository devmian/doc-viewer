import { useState, useMemo } from 'react'
import { useDocsTree, useDocTitles } from '../hooks/useDocs'
import DocCard from '../components/DocCard'
import SearchBar from '../components/SearchBar'
import RecentDocs from '../components/RecentDocs'
import HeroSection from '../components/HeroSection'
import SunburstChart from '../components/SunburstChart'
import type { DocNode } from '../hooks/useDocs'

interface SunburstData {
  name: string
  children?: SunburstData[]
  value?: number
}

function transformToSunburst(nodes: DocNode[], parentName = 'root'): SunburstData {
  const children = nodes.map(node => {
    if (node.type === 'directory' && node.children) {
      return {
        name: node.name,
        children: transformToSunburst(node.children, node.name).children
      }
    }
    return {
      name: node.name,
      value: 1
    }
  })
  return { name: parentName, children }
}

export default function Home() {
  const { tree, loading, error } = useDocsTree()
  const titles = useDocTitles()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return tree
    
    const query = searchQuery.toLowerCase()
    const filterNodes = (nodes: DocNode[]): DocNode[] => {
      return nodes.reduce<DocNode[]>((acc, node) => {
        const title = node.type === 'file' ? titles[node.relativePath] : null
        const matchesName = node.name.toLowerCase().includes(query)
        const matchesTitle = title?.toLowerCase().includes(query)
        
        if (matchesName || matchesTitle) {
          acc.push(node)
        } else if (node.type === 'directory' && node.children) {
          const filteredChildren = filterNodes(node.children)
          if (filteredChildren.length > 0) {
            acc.push({ ...node, children: filteredChildren })
          }
        }
        return acc
      }, [])
    }
    return filterNodes(tree)
  }, [tree, searchQuery, titles])

  const sunburstData = useMemo(() => {
    return transformToSunburst(tree)
  }, [tree])

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

  const directories = filteredTree.filter(n => n.type === 'directory')
  const files = filteredTree.filter(n => n.type === 'file')
  const allInRoot = [...directories, ...files]

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      
      {tree.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">暂无文档</p>
          <p className="text-sm mt-2">在 docs/ 文件夹中添加 Markdown 文档即可显示</p>
        </div>
      ) : (
        <>
          <RecentDocs limit={6} />
          
          {sunburstData.children && sunburstData.children.length > 0 && (
            <div className="mb-8 p-6 glass rounded-xl">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                📊 文档概览
              </h2>
              <div className="flex justify-center">
                <SunburstChart 
                  data={sunburstData} 
                  width={350} 
                  height={350}
                  onNodeClick={({ data }) => {
                    if (data.name && data.name !== 'root') {
                      window.location.href = `/${data.name.replace('.md', '')}`
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {allInRoot.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                📁 目录
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {allInRoot.map((node, index) => (
                  <div key={node.relativePath} className={`animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 6)}`}>
                    <DocCard
                      name={node.name}
                      path={node.relativePath}
                      type={node.type}
                      title={node.type === 'file' ? titles[node.relativePath] : null}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {files.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                📄 所有文档
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {files.map((node, index) => (
                  <div key={node.relativePath} className={`animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 6)}`}>
                    <DocCard
                      name={node.name}
                      path={node.relativePath}
                      type={node.type}
                      title={titles[node.relativePath]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
