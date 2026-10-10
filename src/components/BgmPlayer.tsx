import { useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { playClick } from '@/lib/sound'

/**
 * 背景音乐播放器：固定在右下角的小圆钮。
 * 浏览器禁止网页自动出声，所以必须由用户点一下才开始播（比赛演示时点一次即可）。
 * 音频文件：public/audio/bgm.mp3（《平生意》关大洲 · 逆水寒手游国风推广曲）
 */
export default function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    playClick()
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }
    if (!audioRef.current) {
      const a = new Audio(`${import.meta.env.BASE_URL}audio/bgm.mp3`)
      a.loop = true
      a.volume = 0.35
      a.onended = () => setPlaying(false)
      a.onerror = () => setPlaying(false)
      audioRef.current = a
    }
    void audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {playing && (
        <span className="animate-fade-up rounded-full border border-[#4a3f2a] bg-[#17130d]/90 px-3 py-1 text-[11px] tracking-wider text-[#a08c5f]">
          ♪ 平生意 · 关大洲
        </span>
      )}
      <button
        onClick={toggle}
        aria-label={playing ? '暂停背景音乐' : '播放背景音乐'}
        title={playing ? '暂停背景音乐' : '播放背景音乐《平生意》'}
        className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] transition ${
          playing
            ? 'border-[#c9a05a] bg-[#2a2113] text-[#e3c88a]'
            : 'border-[#4a3f2a] bg-[#17130d]/90 text-[#cdbf9f] hover:border-[#c9a05a] hover:text-[#ece5d8]'
        }`}
      >
        {playing ? <Pause size={18} /> : <Music size={18} />}
      </button>
    </div>
  )
}
