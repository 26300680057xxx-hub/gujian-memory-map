import { Clapperboard, Film, Mic2, Database, Route } from 'lucide-react'
import { featuredDrama } from '@/data/sites'

const pipeline = [
  { icon: Database, title: '史料 RAG', desc: '方志、碑刻、学术论文构建古建知识库' },
  { icon: Clapperboard, title: '剧本生成', desc: 'AI 以古建第一人称创作微短剧分镜' },
  { icon: Film, title: '文生视频', desc: '分镜画面由 AI 生成，风格化千年场景' },
  { icon: Mic2, title: '方言配音', desc: 'AI 语音合成，太原话、大同话讲故乡' },
  { icon: Route, title: '记忆点挂载', desc: '接入携程行程，走到哪，故事讲到哪' },
]

export default function DramaSection() {
  const drama = featuredDrama.drama!
  return (
    <section id="drama" className="relative border-y border-[#2c2619] bg-[#120f0a] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-4 text-center">
          <p className="mb-2 text-xs tracking-[0.4em] text-[#a08c5f]">AI MICRO-DRAMA</p>
          <h2 className="text-3xl font-bold text-[#ece5d8] sm:text-4xl">AI 短剧 · 让古建成为主角</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#8f8672]">
            不是解说词，是它们的「第一人称自白」。以下为应县木塔记忆点的样例分镜。
          </p>
        </div>

        {/* 宣传片：站内可播，点击跳转 B 站自动播放 */}
        <div className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-[#3a3226] bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="relative aspect-video">
              <iframe
                src="https://player.bilibili.com/player.html?bvid=BV1gYph6hEum&autoplay=0&high_quality=1&danmaku=0"
                title="山西古建筑宣传片"
                className="absolute inset-0 h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-[#8f8672]">
            宣传片《你真的见过山西的古建筑吗》 ·{' '}
            <a
              href="https://www.bilibili.com/video/BV1gYph6hEum"
              target="_blank"
              rel="noreferrer"
              className="text-[#e07a4f] underline-offset-2 hover:underline"
            >
              在 B 站打开（自动播放）↗
            </a>
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-[#3a3226] bg-gradient-to-br from-[#1d1811] to-[#14100a] p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h3 className="font-kai text-2xl font-bold text-[#ece5d8]">{drama.title}</h3>
              <p className="mt-1 text-sm text-[#8f8672]">{drama.logline}</p>
            </div>
            <span className="rounded-full border border-[#c03a2a] px-3 py-1 text-xs text-[#e07a4f]">
              AI 生成 · 演示分镜
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {drama.scenes.map((sc) => (
              <div
                key={sc.no}
                className="group rounded-xl border border-[#2c2619] bg-[#1c1710] p-5 transition hover:border-[#4a3f2a]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-3xl font-black text-[#c03a2a] transition group-hover:text-[#e05a42]">
                    {sc.no}
                  </span>
                  <span className="text-lg font-bold text-[#ece5d8]">{sc.title}</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-[#a99c80]">
                  <span className="mr-2 rounded bg-[#2c2619] px-1.5 py-0.5 text-[11px] text-[#a08c5f]">画面</span>
                  {sc.visual}
                </p>
                <p className="font-kai text-[15px] leading-relaxed text-[#e3d9c4]">
                  <span className="mr-2 rounded bg-[#3a2018] px-1.5 py-0.5 text-[11px] text-[#e07a4f]">旁白</span>
                  {sc.vo}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 制作管线 */}
        <div className="mt-14">
          <p className="mb-6 text-center text-xs tracking-[0.3em] text-[#6b6350]">生 成 管 线</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {pipeline.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="relative rounded-xl border border-[#2c2619] bg-[#17130d] p-4 text-center"
              >
                <span className="absolute right-3 top-2 font-mono text-[10px] text-[#4a4232]">0{i + 1}</span>
                <Icon size={20} className="mx-auto mb-2 text-[#c9a05a]" />
                <div className="text-sm font-bold text-[#ece5d8]">{title}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-[#8f8672]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
