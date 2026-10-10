export default function Footer() {
  return (
    <footer className="border-t border-[#2c2619] bg-[#0e0c08] py-14">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#c03a2a] bg-[#a53428]">
            <span className="font-kai text-sm font-bold text-[#f3e3c0]">记忆</span>
          </div>
          <span className="text-lg font-bold tracking-widest text-[#ece5d8]">华流古建 · 记忆地图</span>
        </div>
        <p className="text-sm text-[#8f8672]">
          用技术让「华流」成为世界的「顶流」——让每一座古建筑被看见、被听见、被记住。
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#6b6350]">
          <span>携程首届高校 AI HACKATHON · 热AI赴山海</span>
          <span>赛道：目的地出圈计划</span>
          <span className="text-[#a08c5f]">Team 502.5</span>
        </div>
        <p className="mt-4 text-[11px] text-[#4a4232]">
          Demo 演示站点 · 站内叙事与短剧文本由 AI 生成 · 历史信息以官方文保资料为准
        </p>
      </div>
    </footer>
  )
}
