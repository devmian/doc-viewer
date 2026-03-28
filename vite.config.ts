import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOCS_PATH = path.resolve(__dirname, '../../docs')
const IMAGES_PATH = path.resolve(__dirname, '../../images')

interface DocNode {
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  children?: DocNode[]
  modifiedTime?: number
}

function getDocsTree(dir: string = DOCS_PATH): DocNode[] {
  const items = fs.readdirSync(dir)
  
  const nodes: DocNode[] = items
    .filter(item => !item.startsWith('.') && item !== 'node_modules')
    .map(item => {
      const fullPath = path.join(dir, item)
      const stats = fs.statSync(fullPath)
      const relativePath = path.relative(DOCS_PATH, fullPath)
      
      if (stats.isDirectory()) {
        return {
          name: item,
          path: fullPath,
          relativePath,
          type: 'directory',
          children: getDocsTree(fullPath).sort((a: any, b: any) => {
            if (a.type !== b.type) {
              return a.type === 'directory' ? -1 : 1
            }
            return a.name.localeCompare(b.name)
          })
        }
      }
      
      if (item.endsWith('.md')) {
        return {
          name: item.replace('.md', ''),
          path: fullPath,
          relativePath,
          type: 'file',
          modifiedTime: stats.mtimeMs
        }
      }
      
      return null
    })
    .filter((node): node is any => node !== null)
    .sort((a: any, b: any) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  
  return nodes
}

function getDocContent(relativePath: string) {
  const safePath = path.resolve(DOCS_PATH, relativePath)
  
  if (!safePath.startsWith(DOCS_PATH)) {
    return null
  }
  
  if (!fs.existsSync(safePath)) {
    return null
  }
  
  return fs.readFileSync(safePath, 'utf-8')
}

function getAllDocs() {
  const docs: any[] = []
  
  function scanDir(dir: string) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      if (item.startsWith('.')) continue
      
      const fullPath = path.join(dir, item)
      const stats = fs.statSync(fullPath)
      
      if (stats.isDirectory()) {
        scanDir(fullPath)
        } else if (item.endsWith('.md')) {
          const relativePath = path.relative(DOCS_PATH, fullPath)
          const content = fs.readFileSync(fullPath, 'utf-8')
          const titleMatch = content.match(/^#\s+(.+)$/m)
          const title = titleMatch ? titleMatch[1] : path.basename(item, '.md')
          docs.push({
            path: relativePath,
            title,
            content,
            modifiedTime: stats.mtimeMs
          })
        }
    }
  }
  
  scanDir(DOCS_PATH)
  return docs
}

function searchDocs(query: string) {
  const docs = getAllDocs()
  const results: any[] = []
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

function docsPlugin(): Plugin {
  return {
    name: 'docs-api',
    configureServer(server) {
      server.middlewares.use('/images', (req, res) => {
        const filePath = path.join(IMAGES_PATH, req.url || '')
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath)
          const contentTypes: Record<string, string> = {
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
          }
          res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
          res.end(fs.readFileSync(filePath))
        } else {
          res.statusCode = 404
          res.end('Not found')
        }
      })

      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/docs')) {
          const url = new URL(req.url, 'http://localhost')
          const action = url.searchParams.get('action')
          
          if (action === 'tree') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(getDocsTree()))
            return
          }
          
          if (action === 'content') {
            const docPath = url.searchParams.get('path')
            if (!docPath) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Missing path' }))
              return
            }
            
            const content = getDocContent(docPath)
            if (content === null) {
              res.statusCode = 404
              res.end(JSON.stringify({ error: 'Not found' }))
              return
            }
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ content }))
            return
          }
          
          if (action === 'search') {
            const query = url.searchParams.get('q')
            if (!query) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Missing query' }))
              return
            }
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(searchDocs(query)))
            return
          }
          
          if (action === 'all') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(getAllDocs()))
            return
          }

          if (action === 'titles') {
            const docs = getAllDocs()
            const titles = docs.map(d => ({ path: d.path, title: d.title }))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(titles))
            return
          }

          if (action === 'linecounts') {
            const docs = getAllDocs()
            const lineCounts = docs.map(d => ({
              name: d.path.split('/').pop()?.replace('.md', '') || d.path,
              lines: d.content.split('\n').length
            })).sort((a, b) => b.lines - a.lines)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(lineCounts))
            return
          }
          
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Unknown action' }))
          return
        }
        
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), docsPlugin()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '/images': IMAGES_PATH
    }
  }
})
