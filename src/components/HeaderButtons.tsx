import { useTheme } from '../hooks/useTheme'
import { useI18n } from '../hooks/useI18n'

export default function HeaderButtons() {
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className={`h-10 px-3 rounded-lg transition-colors text-lg cursor-pointer ${
          theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <button
        onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
        className="h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors font-medium cursor-pointer"
        title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
      >
        {locale === 'zh' ? 'EN' : '中'}
      </button>
    </div>
  )
}
