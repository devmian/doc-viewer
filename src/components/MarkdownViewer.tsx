import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import Mermaid from './Mermaid'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface MarkdownViewerProps {
  content: string
  skipFirstTitle?: boolean
}

function CodeBlock({ className, children, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const code = String(children).replace(/\n$/, '')
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (match && match[1] === 'mermaid') {
    return <Mermaid code={code} />
  }

  const isInline = !match

  if (isInline) {
    return <code className={className} {...props}>{children}</code>
  }

  return (
    <div className="relative group overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
        title="Copy code"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </button>
      <pre className={className}>
        <code {...props}>{children}</code>
      </pre>
    </div>
  )
}

export default function MarkdownViewer({ content, skipFirstTitle }: MarkdownViewerProps) {
  let processedContent = content.replace(/\.\.\/\.\.\/images\//g, '/images/')
  
  if (skipFirstTitle) {
    processedContent = processedContent.replace(/^#\s+.+$/m, '').replace(/^\n+/, '')
  }
  
  return (
    <div className="doc-content animate-in fade-in duration-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: CodeBlock,
          h1: ({ children }) => {
            const text = String(children)
            const id = slugify(text)
            return <h1 id={id} className="scroll-mt-20">{children}</h1>
          },
          h2: ({ children }) => {
            const text = String(children)
            const id = slugify(text)
            return <h2 id={id} className="scroll-mt-20">{children}</h2>
          },
          h3: ({ children }) => {
            const text = String(children)
            const id = slugify(text)
            return <h3 id={id} className="scroll-mt-20">{children}</h3>
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
