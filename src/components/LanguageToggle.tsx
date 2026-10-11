import { Languages } from 'lucide-react'

interface Props {
  english: boolean
  onToggle: () => void
}

export default function LanguageToggle({ english, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="language-toggle fixed left-4 top-4 z-[90] flex items-center gap-2 rounded-full border border-[#c9a05a]/70 bg-[#17130d]/90 px-4 py-2.5 text-xs font-bold tracking-wide text-[#f3e3c0] shadow-[0_10px_28px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md transition hover:border-[#e8cf9a] hover:bg-[#2a2113] hover:text-white"
      aria-label={english ? '切换成中文' : 'Switch to English'}
      title={english ? '切换成中文' : 'Switch to English'}
      lang={english ? 'zh-CN' : 'en'}
    >
      <Languages size={15} className="text-[#e3c88a]" />
      <span>{english ? '切换成中文' : 'Switch to English'}</span>
    </button>
  )
}
