export type Language = 'en' | 'ru' | 'es'

export interface Translations {
  [key: string]: string
}

export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}