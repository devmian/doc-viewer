import { useState, useEffect, useRef } from 'react'
import { Link } from 'wouter'
import Highcharts from 'highcharts'
import { Book, Search as SearchIcon, ChevronRight, BarChart3, PieChart } from 'lucide-react'
import { useDocsTree, useDocLineCounts } from '../hooks/useDocs'
import { useI18n } from '../hooks/useI18n'
import SunburstChart from '../components/SunburstChart'
import type { DocNode } from '../hooks/useDocs'

const quickLinks = [
  { name: 'docs', path: '/docs', icon: <Book size={32} />, desc: 'browse_docs', color: 'bg-blue-500' },
  { name: 'search', path: '/search', icon: <SearchIcon size={32} />, desc: 'search_docs', color: 'bg-emerald-500' },
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
    const labelColor = isDark ? '#94a3b8' : '#475569'
    
    Highcharts.chart(chartRef.current, {
      chart: { type: 'bar', backgroundColor: 'transparent', height: 450 },
      title: { text: undefined },
      xAxis: { categories: data.map(d => d.name), labels: { style: { fontSize: '13px', color: labelColor, fontFamily: 'Plus Jakarta Sans' } }, tickWidth: 0, lineColor: 'transparent' },
      yAxis: { title: { text: undefined }, labels: { enabled: false }, gridLineWidth: 0 },
      legend: { enabled: false },
      plotOptions: { bar: { borderWidth: 0, borderRadius: 8, groupPadding: 0.1 } },
      series: [{ type: 'bar', name: t('doc_count'), data: data.map((d, i) => ({ name: d.name, y: d.value, color: colors[i % colors.length] })) }],
      credits: { enabled: false }
    })
  }, [loading, tree.length, t])

  useEffect(() => {
    if (!lineChartRef.current || lineCounts.length === 0) return

    const topDocs = lineCounts.slice(0, 10)
    const isDark = document.documentElement.classList.contains('dark')
    const labelColor = isDark ? '#94a3b8' : '#475569'

    Highcharts.chart(lineChartRef.current, {
      chart: { type: 'column', backgroundColor: 'transparent', height: 400 },
      title: { text: undefined },
      xAxis: { categories: topDocs.map(d => d.name), labels: { style: { fontSize: '11px', color: labelColor, fontFamily: 'Plus Jakarta Sans' }, rotation: -45 }, tickWidth: 1, tickColor: 'rgba(148, 163, 184, 0.2)' },
      yAxis: { title: { text: undefined }, labels: { style: { fontSize: '11px', color: labelColor } }, gridLineColor: 'rgba(148, 163, 184, 0.1)' },
      legend: { enabled: false },
      plotOptions: { column: { borderWidth: 0, borderRadius: 8, pointPadding: 0.2 } },
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
    <div className="w-full h-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid gap-8 md:grid-cols-2">
        {quickLinks.map(item => (
          <Link key={item.path} href={item.path} className="group relative overflow-hidden block p-8 border border-[var(--border-primary)] rounded-3xl bg-[var(--bg-secondary)] hover:border-[var(--brand-primary)] hover:shadow-2xl transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-5 -translate-y-8 translate-x-8 rounded-full group-hover:scale-150 transition-transform duration-500`} />
            <div className={`inline-flex p-4 rounded-2xl ${item.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">{t(item.name)}</h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{t(item.desc)}</p>
            <div className="mt-8 flex items-center text-[var(--brand-primary)] font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
              <span>{t('explore')}</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {tree.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="p-8 border border-[var(--border-primary)] rounded-3xl bg-[var(--bg-secondary)] shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <BarChart3 className="text-[var(--brand-primary)]" size={24} />
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">{t('doc_stats')}</h3>
            </div>
            <div ref={chartRef}></div>
          </div>

          <div className="p-8 border border-[var(--border-primary)] rounded-3xl bg-[var(--bg-secondary)] shadow-sm">
            {selectedDir ? (
              <div>
                <button onClick={() => setSelectedDir(null)} className="flex items-center text-sm font-bold text-[var(--brand-primary)] hover:opacity-80 mb-6 transition-opacity uppercase tracking-wider">
                  <ChevronRight size={16} className="rotate-180 mr-1" /> {t('back')}
                </button>
                <div className="flex items-center space-x-3 mb-6">
                  <FolderIcon className="text-[var(--brand-primary)]" size={24} />
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">{selectedDir}</h3>
                </div>
                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {getSubItems(selectedDir).map(file => (
                    <Link key={file.path} href={`/${file.path.replace(/\.md$/, '')}`} className="flex items-center justify-between p-4 border border-[var(--border-primary)] rounded-2xl hover:bg-[var(--brand-light)] hover:border-[var(--brand-primary)] transition-all group">
                      <span className="text-[var(--text-primary)] font-medium group-hover:text-[var(--brand-primary)]">{file.name}</span>
                      <ChevronRight size={16} className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-8">
                  <PieChart className="text-[var(--brand-primary)]" size={24} />
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">{t('dir_dist')}</h3>
                </div>
                <div className="flex justify-center items-center h-[450px]">
                  <SunburstChart key={sunburstData.children?.length} data={sunburstData} width={420} height={420} onNodeClick={handleSunburstClick} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {lineCounts.length > 0 && (
        <div className="p-8 border border-[var(--border-primary)] rounded-3xl bg-[var(--bg-secondary)] shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">文档行数分析 (TOP 10)</h3>
          </div>
          <div ref={lineChartRef} className="w-full"></div>
        </div>
      )}
    </div>
  )
}

function FolderIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"></path>
    </svg>
  )
}
