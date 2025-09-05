// Export types and constants
export type Language = 'en' | 'ru' | 'es'

// Also export as const for runtime use
export const LANGUAGES = ['en', 'ru', 'es'] as const
export type LanguageType = typeof LANGUAGES[number]

export interface Translations {
  [key: string]: string
}

export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Re-export React components and hooks from TSX file
export { I18nProvider, useI18n } from './index.tsx'