import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

export default function HeaderButtons() {
  return (
    <div className="flex items-center space-x-2">
      <ThemeToggle />
      <div className="hidden sm:block">
        <LanguageToggle />
      </div>
    </div>
  )
}
