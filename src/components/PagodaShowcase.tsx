import { useEffect } from 'react'
import r1 from '@/assets/pagoda-r1.png'
import r2 from '@/assets/pagoda-r2.png'
import r3 from '@/assets/pagoda-r3.png'
import r4 from '@/assets/pagoda-r4.png'
import r5 from '@/assets/pagoda-r5.png'
import r6 from '@/assets/pagoda-r6.png'
import r7 from '@/assets/pagoda-r7.png'

interface Props {
  onDone: () => void
}

/** 七层切片（顶→底），y 区间为裁剪图(808x1206)内坐标 */
const FLOORS = [
  { src: r7, y0: 1130, y1: 1206 }, // 台基（先落）
  { src: r6, y0: 1040, y1: 1130 }, // 副阶檐
  { src: r5, y0: 890, y1: 1040 },
  { src: r4, y0: 720, y1: 890 },
  { src: r3, y0: 550, y1: 720 },
  { src: r2, y0: 380, y1: 550 },
  { src: r1, y0: 0, y1: 380 }, // 塔刹（最后落）
]

const BOX_H = 1206
const STACK_MS = 340

export default function PagodaShowcase({ onDone }: Props) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onDone()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onDone])

  const stackEnd = FLOORS.length * STACK_MS + 650

  return (
    <div
      className="fixed inset-0 z-[70] flex cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 75% 60% at 50% 44%, #2a2110 0%, #171208 48%, #0a0805 100%)',
      }}
      onClick={onDone}
      role="dialog"
      aria-label="应县木塔 · 营造"
    >
      {/* 纸纹噪点（ink-noise 自带 position:relative，会覆盖 fixed，故放内层） */}
      <div className="ink-noise pointer-events-none absolute inset-0" />
      {/* 缓慢旋转的金色法环 */}
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[86vmin] w-[86vmin] rounded-full opacity-[0.16]"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, #c9a05a 8deg, transparent 16deg, transparent 30deg, #c9a05a 38deg, transparent 46deg, transparent 60deg, #c9a05a 68deg, transparent 76deg, transparent 90deg, #c9a05a 98deg, transparent 106deg, transparent 120deg, #c9a05a 128deg, transparent 136deg, transparent 150deg, #c9a05a 158deg, transparent 166deg, transparent 180deg, #c9a05a 188deg, transparent 196deg, transparent 210deg, #c9a05a 218deg, transparent 226deg, transparent 240deg, #c9a05a 248deg, transparent 256deg, transparent 270deg, #c9a05a 278deg, transparent 286deg, transparent 300deg, #c9a05a 308deg, transparent 316deg, transparent 330deg, #c9a05a 338deg, transparent 346deg)',
            WebkitMask: 'radial-gradient(circle, transparent 58%, black 60%, black 63%, transparent 65%)',
            mask: 'radial-gradient(circle, transparent 58%, black 60%, black 63%, transparent 65%)',
            animation: 'spin 40s linear infinite',
          }}
        />
      </div>
      {/* 内圈描金环 */}
      <div className="pointer-events-none absolute left-1/2 top-[44%] h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a05a]/15" />
      <div className="pointer-events-none absolute left-1/2 top-[44%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#c9a05a]/10" />

      {/* 两侧竖排金字 */}
      <div
        className="text-vertical pointer-events-none absolute left-[6%] top-1/2 hidden -translate-y-1/2 font-kai text-lg tracking-[0.6em] text-[#8a744a]/70 md:block"
        style={{ animation: 'building-rise 1.2s ease 0.3s both' }}
      >
        佛宫寺释迦塔
      </div>
      <div
        className="text-vertical pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 font-kai text-lg tracking-[0.6em] text-[#8a744a]/70 md:block"
        style={{ animation: 'building-rise 1.2s ease 0.5s both' }}
      >
        辽清宁二年 · 敕建
      </div>

      {/* 金粉粒子 */}
      {[
        { l: '20%', d: '0.2s', s: 1 }, { l: '30%', d: '0.9s', s: 0.7 }, { l: '40%', d: '1.5s', s: 1.2 },
        { l: '50%', d: '0.6s', s: 0.8 }, { l: '60%', d: '1.2s', s: 1 }, { l: '70%', d: '1.8s', s: 0.7 },
        { l: '80%', d: '0.4s', s: 1.1 }, { l: '26%', d: '2.2s', s: 0.9 }, { l: '66%', d: '2.5s', s: 1 },
        { l: '44%', d: '2.8s', s: 0.8 }, { l: '56%', d: '3.1s', s: 1.1 }, { l: '36%', d: '3.4s', s: 0.9 },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[14%] rounded-full bg-[#e8cf9a]"
          style={{
            left: p.l,
            width: `${5 * p.s}px`,
            height: `${5 * p.s}px`,
            boxShadow: '0 0 10px 2px rgba(201,160,90,0.7)',
            animation: `particle-float 3.2s ease-out ${p.d} both`,
          }}
        />
      ))}

      {/* 木塔逐层搭建 */}
      <div className="relative" style={{ height: '54vh', aspectRatio: '808/1206' }}>
        {/* 底部流雾 */}
        <div
          className="pointer-events-none absolute -bottom-[4%] left-1/2 h-[9%] w-[220%] -translate-x-1/2 rounded-[50%] opacity-40 blur-xl"
          style={{
            background: 'radial-gradient(ellipse, rgba(220,200,160,0.5) 0%, transparent 70%)',
            animation: `mist-drift 7s ease-in-out ${stackEnd}ms infinite alternate`,
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-[2%] left-1/2 h-[7%] w-[170%] -translate-x-1/2 rounded-[50%] opacity-30 blur-lg"
          style={{
            background: 'radial-gradient(ellipse, rgba(201,160,90,0.6) 0%, transparent 70%)',
            animation: `mist-drift 5.5s ease-in-out ${stackEnd + 400}ms infinite alternate-reverse`,
          }}
        />

        {FLOORS.map((f, i) => (
          <div key={i}>
            <img
              src={f.src}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute left-0 w-full select-none"
              style={{
                top: `${(f.y0 / BOX_H) * 100}%`,
                animation: `floor-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * STACK_MS}ms both`,
                filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.65))',
              }}
            />
            {/* 每层落定时的金环扩散 */}
            <span
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] border-2 border-[#e8cf9a]"
              style={{
                top: `${(f.y1 / BOX_H) * 100}%`,
                width: '12%',
                height: '3%',
                animation: `ring-burst 0.7s ease-out ${i * STACK_MS + 350}ms both`,
              }}
            />
          </div>
        ))}

        {/* 落成后的整体描金呼吸光 */}
        <div
          className="pointer-events-none absolute inset-[-10%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(201,160,90,0.26) 0%, transparent 62%)',
            animation: `glow-breathe 3.6s ease-in-out ${stackEnd - 200}ms infinite`,
          }}
        />
      </div>

      {/* 标题区 */}
      <div className="relative z-10 mt-7 flex flex-col items-center px-4 text-center">
        <p
          className="mb-2 text-[11px] tracking-[0.7em] text-[#a08c5f]"
          style={{ animation: `building-rise 0.9s cubic-bezier(0.22,1,0.36,1) ${stackEnd}ms both` }}
        >
          辽 · 清宁二年 1056 · 山西朔州应县
        </p>

        <div
          className="flex items-center gap-4"
          style={{ animation: `building-rise 1s cubic-bezier(0.22,1,0.36,1) ${stackEnd + 150}ms both` }}
        >
          <span className="hidden h-px w-14 bg-gradient-to-r from-transparent to-[#c9a05a] sm:block" />
          <span className="hidden rotate-45 text-[10px] text-[#c9a05a] sm:block">◆</span>
          <h2
            className="font-kai text-5xl font-black tracking-wide text-[#f3e3c0] sm:text-6xl"
            style={{ textShadow: '0 0 46px rgba(201,160,90,0.55), 0 4px 22px rgba(0,0,0,0.85)' }}
          >
            应县木塔
          </h2>
          <span className="hidden rotate-45 text-[10px] text-[#c9a05a] sm:block">◆</span>
          <span className="hidden h-px w-14 bg-gradient-to-l from-transparent to-[#c9a05a] sm:block" />
        </div>

        <p
          className="mt-2 text-sm tracking-[0.35em] text-[#8f8672]"
          style={{ animation: `building-rise 0.9s ease ${stackEnd + 300}ms both` }}
        >
          佛宫寺释迦塔 · 世界上最高最古老的木塔
        </p>

        {/* 数据环 */}
        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-3"
          style={{ animation: `building-rise 0.9s ease ${stackEnd + 450}ms both` }}
        >
          {[
            ['67.31 m', '塔高'],
            ['54 种', '斗拱'],
            ['0 根', '铁钉'],
            ['969 年', '已站立'],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-bold text-[#c9a05a]" style={{ textShadow: '0 0 18px rgba(201,160,90,0.4)' }}>{v}</div>
              <div className="mt-0.5 text-[10px] tracking-[0.35em] text-[#8f8672]">{l}</div>
            </div>
          ))}
        </div>

        {/* 双印 */}
        <div
          className="mt-6 flex items-center gap-3"
          style={{ animation: `seal-stamp 0.7s cubic-bezier(0.34,1.56,0.64,1) ${stackEnd + 650}ms both` }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-[6px] border-2 border-[#d84a38] bg-[#a53428] shadow-[0_0_30px_rgba(192,58,42,0.5)]">
            <span className="font-kai text-vertical text-lg font-bold leading-none text-[#f3e3c0]">应县</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[6px] border-2 border-[#c9a05a] bg-transparent">
            <span className="font-kai text-vertical text-lg font-bold leading-none text-[#c9a05a]">木塔</span>
          </div>
        </div>
      </div>

      <p
        className="absolute bottom-6 text-[10px] tracking-[0.55em] text-[#5a5342]"
        style={{ animation: `building-rise 0.8s ease ${stackEnd + 950}ms both` }}
      >
        点 击 任 意 处 · 翻 开 木 塔 的 记 忆
      </p>
    </div>
  )
}
