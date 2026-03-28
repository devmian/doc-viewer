import { useState, useEffect, useCallback } from 'react'

export type DocNode = {
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  children?: DocNode[]
  modifiedTime?: number
}

export function useDocsTree() {
  const [tree, setTree] = useState<DocNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/docs?action=tree')
      if (!response.ok) throw new Error('Failed to fetch docs')
      const data = await response.json()
      setTree(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTree()
  }, [fetchTree])

  return { tree, loading, error, refetch: fetchTree }
}

export function useDocContent(relativePath: string | null) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!relativePath) {
      setContent(null)
      return
    }

    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/docs?action=content&path=${encodeURIComponent(relativePath)}`)
        if (!response.ok) throw new Error('Failed to fetch doc')
        const data = await response.json()
        setContent(data.content)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [relativePath])

  return { content, loading, error }
}

export function useSearch(query: string) {
  const [results, setResults] = useState<Array<{ path: string; title: string; snippet: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const search = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/docs?action=search&q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Search failed')
        const data = await response.json()
        setResults(data)
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return { results, loading }
}

export function useDocTitles() {
  const [titles, setTitles] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/docs?action=titles')
      .then(res => res.json())
      .then(data => {
        const map: Record<string, string> = {}
        for (const item of data) {
          map[item.path] = item.title
        }
        setTitles(map)
      })
      .catch(console.error)
  }, [])

  return titles
}

export function useDocLineCounts() {
  const [lineCounts, setLineCounts] = useState<{ name: string; lines: number }[]>([])

  useEffect(() => {
    fetch('/api/docs?action=linecounts')
      .then(res => res.json())
      .then(setLineCounts)
      .catch(console.error)
  }, [])

  return lineCounts
}
