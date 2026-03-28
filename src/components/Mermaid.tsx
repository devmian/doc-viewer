import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  code: string
}

export default function Mermaid({ code }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      mermaid.render(`mermaid-${Date.now()}`, code).then((result) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg
        }
      }).catch((err) => {
        console.error('Mermaid error:', err)
        if (containerRef.current) {
          containerRef.current.textContent = '图表渲染失败'
        }
      })
    }
  }, [code])

  return <div ref={containerRef} className="mermaid-container my-4" />
}
