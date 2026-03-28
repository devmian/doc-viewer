import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import Sunburst from 'sunburst-chart'

interface SunburstData {
  name: string
  children?: SunburstData[]
  value?: number
}

interface SunburstChartProps {
  data: SunburstData
  width?: number
  height?: number
  onNodeClick?: (node: { data: { name: string }; depth: number }) => void
}

function SunburstChartComponent({ data, width = 300, height = 300, onNodeClick }: SunburstChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<unknown>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !data) return

    container.innerHTML = ''
    const color = d3.scaleOrdinal(d3.schemePaired)

    try {
      // @ts-expect-error - Sunburst is called as a function
      const sunburst = Sunburst()
        .width(width)
        .height(height)
        .data(data)
        .label('name')
        .size('value')
        .color((_d: unknown, parent: unknown) => color(parent ? (parent as { data: { name: string } }).data.name : 'root'))
        .excludeRoot(true)
        .tooltipContent((_d: unknown, node: { value: number }) => `Size: <i>${node.value}</i>`)
      
      chartRef.current = sunburst
      
      sunburst(container)

      // Add click handler after chart is created
      container.addEventListener('click', (e) => {
        const target = e.target as SVGElement & { __data__?: unknown }
        const nodeData = target.__data__
        if (nodeData && onNodeClick) {
          onNodeClick(nodeData as { data: { name: string }; depth: number })
        }
      })
    } catch {
      // Suppress errors
    }
  }, [data, width, height, onNodeClick])

  return <div ref={containerRef} style={{ width, height }}></div>
}

export default SunburstChartComponent
