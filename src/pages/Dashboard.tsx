import { useState, useEffect, useRef } from 'react'
import { Link } from 'wouter'
import Highcharts from 'highcharts'
import { useDocsTree, useDocLineCounts } from '../hooks/useDocs'
import { useI18n } from '../hooks/useI18n'
import SunburstChart from '../components/SunburstChart'
import type { DocNode } from '../hooks/useDocs'

const quickLinks = [
  { name: 'docs', path: '/docs', icon: '📚', desc: 'browse_docs' },
  { name: 'search', path: '/search', icon: '🔍', desc: 'search_docs' },
]

function buildSunburstData(nodes: DocNode[]) {
  const children = nodes
    .filter(n => n.type === 'directory')
    .map(node => ({
      name: node.name,
      children: [
        ...(node.children || [])
          .filter((c: DocNode) => c.type === 'directory')
          .map((d: DocNode) => ({
            name: d.name,
            children: (d.children || [])
              .filter((c: DocNode) => c.type === 'file')
              .map((f: DocNode) => ({ name: f.name, value: 1 }))
          })),
        ...(node.children || [])
          .filter((c: DocNode) => c.type === 'file')
          .map((f: DocNode) => ({ name: f.name, value: 1 }))
      ]
    }))
  return { name: 'root', children }
}

export default function Dashboard() {
  const { tree, loading } = useDocsTree()
  const { t } = useI18n()
  const [selectedDir, setSelectedDir] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const lineChartRef = useRef<HTMLDivElement>(null)
  const lineCounts = useDocLineCounts()

  const sunburstData = buildSunburstData(tree)
  const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']

  useEffect(() => {
    if (!chartRef.current || loading || tree.length === 0) return

    const dirStats: Record<string, number> = {}
    const countFiles = (nodes: DocNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file') {
          const dir = node.relativePath.split('/')[0] || 'root'
          dirStats[dir] = (dirStats[dir] || 0) + 1
        }
        if (node.children) countFiles(node.children)
      }
    }
    countFiles(tree)

    const data = Object.entries(dirStats).map(([name, value]) => ({ name, value }))

    const isDark = document.documentElement.classList.contains('dark')
    const labelColor = isDark ? '#e5e7eb' : '#374151'
    
    Highcharts.chart(chartRef.current, {
      chart: { type: 'bar', backgroundColor: 'transparent', height: 250 },
      title: { text: undefined },
      xAxis: { categories: data.map(d => d.name), labels: { style: { fontSize: '12px', color: labelColor } }, tickWidth: 0, lineColor: labelColor, tickColor: labelColor },
      yAxis: { title: { text: undefined }, labels: { enabled: false }, gridLineWidth: 0 },
      legend: { enabled: false },
      plotOptions: { bar: { borderWidth: 0, borderRadius: 4 } },
      series: [{ type: 'bar', name: t('doc_count'), data: data.map((d, i) => ({ name: d.name, y: d.value, color: colors[i % colors.length] })) }],
      credits: { enabled: false }
    })
  }, [loading, tree.length, t])

  useEffect(() => {
    if (!lineChartRef.current || lineCounts.length === 0) return

    const topDocs = lineCounts.slice(0, 10)
    const isDark = document.documentElement.classList.contains('dark')
    const labelColor = isDark ? '#e5e7eb' : '#374151'

    Highcharts.chart(lineChartRef.current, {
      chart: { type: 'column', backgroundColor: 'transparent', height: 250 },
      title: { text: undefined },
      xAxis: { categories: topDocs.map(d => d.name), labels: { style: { fontSize: '9px', color: labelColor, whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '80px' } }, tickWidth: 0, tickColor: 'transparent' },
      yAxis: { title: { text: undefined }, labels: { style: { fontSize: '10px', color: labelColor } } },
      legend: { enabled: false },
      plotOptions: { column: { borderWidth: 0, borderRadius: 4 } },
      series: [{ type: 'column', name: '行数', data: topDocs.map((d, i) => ({ name: d.name, y: d.lines, color: colors[i % colors.length] })) }],
      credits: { enabled: false }
    })
  }, [lineCounts, t])

  const handleSunburstClick = (node: { data: { name: string }; depth: number }) => {
    if (node.depth === 1) setSelectedDir(node.data.name)
  }

  const getSubItems = (dirName: string) => {
    const results: { name: string; path: string }[] = []
    const find = (nodes: DocNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file' && node.relativePath.split('/')[0] === dirName) {
          results.push({ name: node.name, path: node.relativePath })
        }
        if (node.children) find(node.children)
      }
    }
    find(tree)
    return results
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {quickLinks.map(item => (
          <Link key={item.path} href={item.path} className="block p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all bg-white dark:bg-gray-800">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t(item.name)}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t(item.desc)}</p>
          </Link>
        ))}
      </div>

      {tree.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('doc_stats')}</h3>
            <div ref={chartRef}></div>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
            {selectedDir ? (
              <div>
                <button onClick={() => setSelectedDir(null)} className="text-sm text-blue-500 hover:text-blue-400 mb-4">← {t('back')}</button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{selectedDir}</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {getSubItems(selectedDir).map(file => (
                    <Link key={file.path} href={`/${file.path.replace('.md', '')}`} className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-all">
                      <span className="text-gray-900 dark:text-white">{file.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dir_dist')}</h3>
                <div className="flex justify-center">
                  <SunburstChart key={sunburstData.children?.length} data={sunburstData} width={280} height={280} onNodeClick={handleSunburstClick} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {lineCounts.length > 0 && (
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">文档行数 TOP 10</h3>
          <div ref={lineChartRef}></div>
        </div>
      )}
    </div>
  )
}
