import { Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import LanguageToggle from './components/LanguageToggle'
import { LanguageContext } from './lib/language'

export default function App() {
  const [english, setEnglish] = useState(() => {
    try { return localStorage.getItem('gujian-language') === 'en' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.lang = english ? 'en' : 'zh-CN'
    document.title = english ? 'Chinese Heritage · Memory Map' : '华流古建 · 记忆地图'
    document.querySelector('meta[name="description"]')?.setAttribute('content', english
      ? 'Chinese Heritage · Memory Map—historic buildings tell their own stories. Explore Shanxi’s architectural heritage through AI.'
      : '华流古建·记忆地图——让古建筑开口讲自己的故事。山西古建 AI 文化体验 Demo。')
    try { localStorage.setItem('gujian-language', english ? 'en' : 'zh-CN') } catch { /* Storage may be unavailable in private browsing. */ }
  }, [english])

  return (
    <LanguageContext value={english}>
      <div className={english ? 'language-english' : ''}>
        <LanguageToggle english={english} onToggle={() => setEnglish((value) => !value)} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </LanguageContext>
  )
}
