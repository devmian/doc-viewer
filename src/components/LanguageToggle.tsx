import { Languages } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      className="flex items-center space-x-2 h-10 px-4 rounded-xl neumorphic-btn text-[var(--text-secondary)] hover:text-[var(--brand-primary)] font-medium group"
      title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Languages size={16} className="group-hover:rotate-12 transition-transform" />
      <span className="text-sm tracking-wide">{locale === 'zh' ? 'EN' : '中文'}</span>
    </button>
  )
}
