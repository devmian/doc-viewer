import { Languages } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      className="flex items-center space-x-2 h-10 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all duration-200 font-medium group active:scale-95"
      title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Languages size={16} className="group-hover:rotate-12 transition-transform" />
      <span className="text-sm tracking-wide">{locale === 'zh' ? 'EN' : '中文'}</span>
    </button>
  )
}
