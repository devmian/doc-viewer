import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Mermaid from './Mermaid'

interface MarkdownViewerProps {
  content: string
  skipFirstTitle?: boolean
}

export default function MarkdownViewer({ content, skipFirstTitle }: MarkdownViewerProps) {
  let processedContent = content.replace(/\.\.\/\.\.\/images\//g, '/images/')
  
  if (skipFirstTitle) {
    processedContent = processedContent.replace(/^#\s+.+$/m, '').replace(/^\n+/, '')
  }
  
  return (
    <div className="doc-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')
            
            if (match && match[1] === 'mermaid') {
              return <Mermaid code={code} />
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
