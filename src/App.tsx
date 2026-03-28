import { Route, Switch, useLocation } from 'wouter'
import { ThemeProvider } from './hooks/useTheme'
import { I18nProvider, useI18n } from './hooks/useI18n'
import { useDocsTree } from './hooks/useDocs'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DocPage from './pages/DocPage'
import SearchPage from './pages/SearchPage'

function AppContent() {
  const { tree } = useDocsTree()
  const [location] = useLocation()
  const { t } = useI18n()

  const getTitle = () => {
    if (location === '/' || location === '') return t('dashboard')
    if (location === '/docs' || location === '/docs/') return t('docs')
    if (location === '/search') return t('search')
    
    const cleanPath = location.replace(/^\//, '')
    const parts = cleanPath.split('/')
    
    const findName = (path: string): string | null => {
      for (const node of tree) {
        if (node.relativePath === path && node.type === 'directory') {
          return node.name
        }
      }
      return null
    }
    
    const names = parts.map((_, i) => {
      const path = parts.slice(0, i + 1).join('/')
      return findName(path)
    }).filter(Boolean)
    
    return names.join(' / ') || ''
  }

  return (
    <Layout tree={tree} title={getTitle()}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/docs" component={DocPage} />
        <Route path="/docs/:id" component={DocPage} />
        <Route path="/search" component={SearchPage} />
        <Route component={DocPage} />
      </Switch>
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
