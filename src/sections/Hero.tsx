import { MapPin, ChevronDown, Clapperboard, Play, Orbit } from 'lucide-react'

export default function Hero() {
  return (
    <header className="ink-noise relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* 背景大字水印 */}
      <div
        aria-hidden
        className="font-kai pointer-events-none absolute inset-0 flex items-center justify-center text-[42vw] font-bold leading-none text-[#c9a05a] opacity-[0.045] select-none"
      >
        塔
      </div>
      {/* 竖排装饰 */}
      <div className="text-vertical absolute left-6 top-1/2 hidden -translate-y-1/2 text-sm tracking-[0.5em] text-[#6b6350] md:block">
        让古建筑开口讲自己的故事
      </div>
      <div className="text-vertical absolute right-6 top-1/2 hidden -translate-y-1/2 text-sm tracking-[0.5em] text-[#6b6350] md:block">
        山西 · 地上文物之省
      </div>

      <div className="animate-fade-up relative z-10 max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-[11px] tracking-[0.2em] text-[#a08c5f]">
          <span className="rounded-full border border-[#4a3f2a] px-3 py-1">携程首届高校 AI HACKATHON</span>
          <span className="rounded-full border border-[#4a3f2a] px-3 py-1">赛道 · 目的地出圈计划</span>
        </div>

        <p className="font-kai mb-4 text-lg text-[#c9a05a]">地上文物看山西，五千年很远，山西很近</p>
        <h1 className="text-5xl font-black leading-tight tracking-wide text-[#ece5d8] sm:text-7xl">
          华流古建
          <span className="mx-3 text-[#c03a2a]">·</span>
          记忆地图
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#a99c80] sm:text-lg">
          每一座古建筑都是一个「记忆点」。
          <br />
          点开它，听 AI 让它们亲口讲述自己的千年。
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#map"
            className="flex items-center gap-2 rounded-full bg-[#c03a2a] px-7 py-3.5 font-bold text-[#f3e3c0] shadow-[0_8px_30px_-8px_rgba(192,58,42,0.6)] transition hover:bg-[#d14533] hover:shadow-[0_8px_36px_-6px_rgba(192,58,42,0.8)]"
          >
            <MapPin size={17} />
            进入记忆地图
          </a>
          <a
            href="https://26300680057xxx-hub.github.io/foguang-temple/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-[#c9a05a] bg-[#c9a05a]/10 px-7 py-3.5 font-bold text-[#e3c88a] transition hover:bg-[#c9a05a]/25 hover:text-[#f3e3c0]"
          >
            <Orbit size={17} />
            佛光寺全景真实展示
          </a>
          <a
            href="https://www.bilibili.com/video/BV1gYph6hEum"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-[#c03a2a] bg-[#c03a2a]/15 px-7 py-3.5 font-bold text-[#e07a4f] transition hover:bg-[#c03a2a]/30 hover:text-[#f0927a]"
          >
            <Play size={17} />
            观看宣传片
          </a>
          <a
            href="#drama"
            className="flex items-center gap-2 rounded-full border border-[#4a3f2a] px-7 py-3.5 text-[#cdbf9f] transition hover:border-[#c9a05a] hover:text-[#ece5d8]"
          >
            <Clapperboard size={17} />
            观看 AI 短剧示例
          </a>
        </div>

        {/* 数字亮点 */}
        <div className="mt-14 grid grid-cols-3 gap-6 text-center">
          {[
            ['28000+', '山西现存古建筑'],
            ['531', '全国重点文保单位（全国第一）'],
            ['15', '首批开放记忆点'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-[#c9a05a] sm:text-3xl">{v}</div>
              <div className="mt-1 text-[11px] tracking-wider text-[#8f8672] sm:text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <ChevronDown size={22} className="animate-float-slow absolute bottom-8 text-[#6b6350]" />
    </header>
  )
}
