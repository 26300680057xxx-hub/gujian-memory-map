import { useEffect, useRef, useState } from 'react'
import { BookOpen, MapPin, Scroll, Compass, Sparkle } from 'lucide-react'
import ShanxiMap from '@/components/ShanxiMap'
import PaintingMap from '@/components/PaintingMap'
import TempleReveal from '@/components/TempleReveal'
import { sites, type Site } from '@/data/sites'
import { playClick } from '@/lib/sound'

interface Props {
  selected: Site
  onSelect: (s: Site) => void
  onOpen: (s: Site) => void
}

type MapMode = 'painting' | 'drawn'

export default function MapSection({ selected, onSelect, onOpen }: Props) {
  const [mode, setMode] = useState<MapMode>('painting')
  const [temple, setTemple] = useState(0) // 0=未播放；>0 为播放场次（用于重挂载）
  const playedRef = useRef(false)
  const secRef = useRef<HTMLElement>(null)

  /** 滑动到记忆地图时，自动上演一次「实体 → 全息 → 粒子散开」 */
  useEffect(() => {
    const el = secRef.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !playedRef.current) {
          playedRef.current = true
          setTemple(1)
          ob.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  /** 地图上点击光点 = 直接翻开记忆（应县木塔会先上演全屏「营造」） */
  const openFromMap = (s: Site) => {
    playClick()
    onSelect(s)
    onOpen(s)
  }

  return (
    <section id="map" ref={secRef} className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      {temple > 0 && <TempleReveal key={temple} onDone={() => setTemple(0)} />}
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs tracking-[0.4em] text-[#a08c5f]">MEMORY MAP</p>
        <h2 className="text-3xl font-bold text-[#ece5d8] sm:text-4xl">记忆地图 · 山西</h2>
        <p className="mt-3 text-sm text-[#8f8672]">点击光点，翻开一座古建的千年记忆</p>

        {/* 地图形态切换 */}
        <div className="mt-6 inline-flex rounded-full border border-[#3a3226] bg-[#17130d] p-1">
          <button
            onClick={() => { playClick(); setMode('painting') }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs transition ${
              mode === 'painting' ? 'bg-[#c03a2a] font-bold text-[#f3e3c0]' : 'text-[#a99c80] hover:text-[#cdbf9f]'
            }`}
          >
            <Scroll size={13} />
            古画立体版
          </button>
          <button
            onClick={() => { playClick(); setMode('drawn') }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs transition ${
              mode === 'drawn' ? 'bg-[#c03a2a] font-bold text-[#f3e3c0]' : 'text-[#a99c80] hover:text-[#cdbf9f]'
            }`}
          >
            <Compass size={13} />
            金线舆图版
          </button>
          <button
            onClick={() => setTemple((n) => n + 1)}
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs text-[#a99c80] transition hover:text-[#cdbf9f]"
            title="重播古刹全息入场秀"
          >
            <Sparkle size={13} />
            全息入场
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* 地图 */}
        <div className="ink-noise paper-edge relative overflow-hidden rounded-2xl border border-[#3a3226] bg-[#14100a] p-3">
          <div className="pointer-events-none absolute inset-2 z-10 rounded-xl border border-[#4a3f2a]/50" />
          {mode === 'painting' ? (
            <div className="py-4">
              <PaintingMap selected={selected} onSelect={openFromMap} />
            </div>
          ) : (
            <div className="mx-auto aspect-[11/16] max-h-[680px]">
              <ShanxiMap selected={selected} onSelect={openFromMap} />
            </div>
          )}
        </div>

        {/* 右栏：选中记忆点 + 列表 */}
        <div className="flex flex-col gap-4">
          <div className="paper-edge rounded-2xl border border-[#3a3226] bg-gradient-to-br from-[#1d1811] to-[#14100a] p-6">
            <div className="mb-1 flex items-center gap-2 text-[11px] tracking-widest text-[#a08c5f]">
              <span className="rounded border border-[#4a3f2a] px-1.5 py-0.5">
                {selected.dynasty} · {selected.year}
              </span>
              {selected.hot && <span className="text-[#e07a4f]">◈ 黑神话取景地</span>}
            </div>
            <h3 className="text-2xl font-bold text-[#ece5d8]">{selected.name}</h3>
            <p className="mb-3 mt-0.5 text-xs text-[#8f8672]">{selected.alias} — {selected.location}</p>
            <p className="text-sm leading-relaxed text-[#a99c80]">{selected.intro}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selected.tags.map((t) => (
                <span key={t} className="rounded-full bg-[#241e13] px-2.5 py-1 text-[11px] text-[#c9a05a]">
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => { playClick(); onOpen(selected) }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#c03a2a] py-3 font-bold text-[#f3e3c0] transition hover:bg-[#d14533]"
            >
              <BookOpen size={16} />
              翻开「{selected.name}」的记忆
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sites.map((s) => (
              <button
                key={s.id}
                onClick={() => { playClick(); onSelect(s) }}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                  s.id === selected.id
                    ? 'border-[#c03a2a] bg-[#2a1a14] text-[#ece5d8]'
                    : 'border-[#2c2619] bg-[#17130d] text-[#a99c80] hover:border-[#4a3f2a] hover:text-[#cdbf9f]'
                }`}
              >
                <MapPin size={13} className={s.id === selected.id ? 'text-[#e07a4f]' : 'text-[#6b6350]'} />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto shrink-0 text-[10px] text-[#6b6350]">{s.dynasty}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
