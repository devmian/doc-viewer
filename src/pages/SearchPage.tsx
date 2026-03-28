import { useLocation } from 'wouter'
import Search from '../components/Search'

export default function SearchPage() {
  const [location] = useLocation()
  const query = new URLSearchParams(location.split('?')[1] || '').get('q') || ''

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Search />
      </div>
      
      {!query && (
        <p className="text-gray-500">输入关键词搜索文档</p>
      )}
    </div>
  )
}
