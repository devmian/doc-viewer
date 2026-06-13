import { BookOpen, Table } from 'lucide-react'
import { Link } from 'wouter'

export default function HeroSection() {
  return (
    <section className="relative mb-8 p-8 rounded-[20px] overflow-hidden neumorphic-card">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
          欢迎使用 Doc Viewer
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-6 max-w-xl">
          浏览和管理您的技术文档，快速定位所需信息
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium neumorphic-btn-primary"
          >
            <BookOpen size={18} />
            浏览文档
          </Link>
          <Link
            href="/table"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-[var(--text-primary)] neumorphic-btn"
          >
            <Table size={18} />
            表格视图
          </Link>
        </div>
      </div>
    </section>
  )
}
