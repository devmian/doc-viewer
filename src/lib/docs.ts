// @ts-nocheck
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOCS_PATH = path.resolve(__dirname, '../../docs')

export interface DocNode {
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  children?: DocNode[]
  modifiedTime?: number
}

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.md')
}

function getRelativePath(fullPath: string): string {
  return path.relative(DOCS_PATH, fullPath)
}

export function getDocsTree(dir: string = DOCS_PATH): DocNode[] {
  const items = fs.readdirSync(dir)
  
  const nodes: DocNode[] = items
    .filter(item => !item.startsWith('.') && item !== 'node_modules')
    .map(item => {
      const fullPath = path.join(dir, item)
      const stats = fs.statSync(fullPath)
      const relativePath = getRelativePath(fullPath)
      
      if (stats.isDirectory()) {
        return {
          name: item,
          path: fullPath,
          relativePath,
          type: 'directory' as const,
          children: getDocsTree(fullPath).sort((a, b) => {
            if (a.type !== b.type) {
              return a.type === 'directory' ? -1 : 1
            }
            return a.name.localeCompare(b.name)
          })
        }
      }
      
      if (isMarkdownFile(item)) {
        return {
          name: item.replace('.md', ''),
          path: fullPath,
          relativePath,
          type: 'file' as const,
          modifiedTime: stats.mtimeMs
        }
      }
      
      return null
    })
    .filter((node): node is DocNode => node !== null)
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  
  return nodes
}

export function getDocContent(relativePath: string): string | null {
  const safePath = path.resolve(DOCS_PATH, relativePath)
  
  if (!safePath.startsWith(DOCS_PATH)) {
    return null
  }
  
  if (!fs.existsSync(safePath)) {
    return null
  }
  
  return fs.readFileSync(safePath, 'utf-8')
}

export function getAllDocs(): Array<{ path: string; content: string; modifiedTime: number }> {
  const docs: Array<{ path: string; content: string; modifiedTime: number }> = []
  
  function scanDir(dir: string) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      if (item.startsWith('.')) continue
      
      const fullPath = path.join(dir, item)
      const stats = fs.statSync(fullPath)
      
      if (stats.isDirectory()) {
        scanDir(fullPath)
      } else if (isMarkdownFile(item)) {
        const relativePath = getRelativePath(fullPath)
        docs.push({
          path: relativePath,
          content: fs.readFileSync(fullPath, 'utf-8'),
          modifiedTime: stats.mtimeMs
        })
      }
    }
  }
  
  scanDir(DOCS_PATH)
  return docs
}

export function searchDocs(query: string): Array<{ path: string; title: string; snippet: string }> {
  const docs = getAllDocs()
  const results: Array<{ path: string; title: string; snippet: string }> = []
  const lowerQuery = query.toLowerCase()
  
  for (const doc of docs) {
    const lines = doc.content.split('\n')
    const title = lines[0]?.replace(/^#+\s*/, '') || doc.path
    const lowerContent = doc.content.toLowerCase()
    const lowerTitle = title.toLowerCase()
    
    if (lowerTitle.includes(lowerQuery) || lowerContent.includes(lowerQuery)) {
      const index = lowerContent.indexOf(lowerQuery)
      const start = Math.max(0, index - 50)
      const end = Math.min(doc.content.length, index + query.length + 50)
      const snippet = (start > 0 ? '...' : '') + doc.content.slice(start, end) + (end < doc.content.length ? '...' : '')
      
      results.push({
        path: doc.path,
        title,
        snippet
      })
    }
  }
  
  return results
}
