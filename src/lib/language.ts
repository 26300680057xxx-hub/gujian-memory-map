import { createContext, useCallback, useContext } from 'react'
import { sites } from '@/data/sites'
import { englishSites } from '@/data/sites.en'
import { englishUI } from './ui.en'

export const LanguageContext = createContext(false)
const translations: Record<string, string> = { ...englishUI }

function register(source: unknown, target: unknown): void {
  if (typeof source === 'string' && typeof target === 'string') {
    if (!(source in translations)) translations[source] = target
  } else if (Array.isArray(source) && Array.isArray(target)) {
    source.forEach((item, index) => register(item, target[index]))
  } else if (source && target && typeof source === 'object' && typeof target === 'object') {
    Object.entries(target).forEach(([key, value]) => register((source as Record<string, unknown>)[key], value))
  }
}
sites.forEach((site) => register(site, englishSites[site.id]))

export function useTranslation() {
  const english = useContext(LanguageContext)
  const t = useCallback((source: string) => english ? translations[source] ?? source : source, [english])
  return { english, t }
}
