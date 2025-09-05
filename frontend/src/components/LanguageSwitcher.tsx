import React from 'react'
import { useI18n, Language } from '../i18n'
import { Globe } from 'lucide-react'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n()

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  ]

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default LanguageSwitcher