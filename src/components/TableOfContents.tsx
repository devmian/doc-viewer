import { useState, useEffect, useRef } from 'react'
import { List, ChevronRight } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n')
  const headings: Heading[] = []
  
  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/\*\*|__/g, '').trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      headings.push({ id, text, level })
    }
  })
  
  return headings
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const extracted = extractHeadings(content)
    setHeadings(extracted)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (headings.length < 2) return null

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] shadow-lg hover:shadow-xl hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all duration-300"
        title="Table of Contents"
      >
        <List size={18} strokeWidth={2.5} />
        <span className="text-sm font-semibold">Contents</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 max-h-[60vh] overflow-y-auto bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">On this page</span>
          </div>
          <nav className="p-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium transition-all duration-200 group
                  ${heading.level === 1 
                    ? 'text-[var(--text-primary)]' 
                    : heading.level === 2 
                      ? 'text-[var(--text-secondary)] ml-3 text-xs' 
                      : 'text-[var(--text-secondary)] ml-6 text-xs'
                  }
                  ${activeId === heading.id 
                    ? 'bg-[var(--brand-light)] text-[var(--brand-primary)]' 
                    : 'hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)]'
                  }
                `}
              >
                <ChevronRight 
                  size={12} 
                  className={`shrink-0 transition-transform duration-200 ${activeId === heading.id ? 'text-[var(--brand-primary)] rotate-90' : 'text-[var(--text-secondary)] opacity-40 group-hover:opacity-100'}`} 
                />
                <span className="truncate">{heading.text}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
