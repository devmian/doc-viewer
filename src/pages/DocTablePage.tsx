import { useMemo } from 'react'
import { useLocation } from 'wouter'
import { FileText, Folder } from 'lucide-react'
import { useDocsTree } from '../hooks/useDocs'
import type { FC } from 'react'

interface DocItem {
  name: string
  path: string
  type: string
  modifiedTime?: number
}

const DocTablePage: FC = () => {
  const { tree, loading } = useDocsTree()
  const [, setLocation] = useLocation()

  const allItems = useMemo(() => {
    const result: DocItem[] = []
    
    function collect(nodes: any[]) {
      for (const node of nodes) {
        result.push({
          name: node.name,
          path: node.relativePath,
          type: node.type,
          modifiedTime: node.modifiedTime,
        })
        if (node.children) {
          collect(node.children)
        }
      }
    }
    
    if (tree) collect(tree)
    return result
  }, [tree])

  const formatDate = (ts: number | undefined) => ts ? new Date(ts).toLocaleDateString('zh-CN') : '-'

  if (loading) {
    return (
      <div className="w-full max-w-screen-xl mx-auto py-10 text-center">
        <p className="text-[var(--text-secondary)]">加载中...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto py-10 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">文档表格</h1>
        <p className="text-[var(--text-secondary)]">共 {allItems.length} 个项目</p>
      </header>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-secondary)]">类型</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-secondary)]">名称</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-secondary)]">路径</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--text-secondary)]">修改时间</th>
              </tr>
            </thead>
            <tbody>
                {allItems.map(item => (
                <tr 
                  key={item.path} 
                  className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] cursor-pointer"
                  onClick={() => item.type === 'file' ? setLocation(`/${item.path.replace(/\.md$/, '')}`) : null}
                >
                  <td className="px-4 py-3">
                    {item.type === 'directory' 
                      ? <Folder size={16} className="text-yellow-500" />
                      : <FileText size={16} className="text-blue-500" />
                    }
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)] font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-mono">{item.path}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] text-right">{formatDate(item.modifiedTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DocTablePage