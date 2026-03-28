import { Route, Switch } from 'wouter'
import { ThemeProvider } from './hooks/useTheme'
import { I18nProvider } from './hooks/useI18n'
import { useDocsTree } from './hooks/useDocs'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DocPage from './pages/DocPage'
import SearchPage from './pages/SearchPage'

function App() {
  const { tree } = useDocsTree()

  return (
    <ThemeProvider>
      <I18nProvider>
        <Layout tree={tree}>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/docs" component={DocPage} />
            <Route path="/docs/:id" component={DocPage} />
            <Route path="/search" component={SearchPage} />
            <Route component={DocPage} />
          </Switch>
        </Layout>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
