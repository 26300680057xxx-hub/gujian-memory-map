import { useRef, useState, useCallback } from 'react'
import { sites, type Site } from '@/data/sites'
import mapImg from '@/assets/shanxi-map.jpg'
import popYingxian from '@/assets/pop-yingxian.png'
import popYanmenguan from '@/assets/pop-yanmenguan.png'
import popWutaishan from '@/assets/pop-wutaishan.png'
import popXiaoxitian from '@/assets/pop-xiaoxitian.png'
import popJinci from '@/assets/pop-jinci.png'
import popGuandimiao from '@/assets/pop-guandimiao.png'
import popYungang from '@/assets/pop-yungang.png'
import popXuankong from '@/assets/pop-xuankong.png'
import popHukou from '@/assets/pop-hukou.png'
import popHukouMask from '@/assets/pop-hukou-mask.png'
import hukouFlow from '@/assets/hukou-flow.png'
import popNiangziguan from '@/assets/pop-niangziguan.png'
import popQiaojia from '@/assets/pop-qiaojia.png'
import popShuanglin from '@/assets/pop-shuanglin.png'
import popHuangcheng from '@/assets/pop-huangcheng.png'
import popYonglegong from '@/assets/pop-yonglegong.png'
import popHengshan from '@/assets/pop-hengshan.png'

interface Props {
  selected: Site
  onSelect: (s: Site) => void
}

/** 已做真轮廓抠图的记忆点（其余用椭圆裁切兜底） */
const POP_IMG: Record<string, string> = {
  yingxian: popYingxian,
  yanmenguan: popYanmenguan,
  wutaishan: popWutaishan, // 五台山以佛光寺东大殿为代表
  xiaoxitian: popXiaoxitian,
  jinci: popJinci,
  guandimiao: popGuandimiao,
  yungang: popYungang,
  xuankong: popXuankong,
  hukou: popHukou,
  niangziguan: popNiangziguan,
  qiaojia: popQiaojia,
  shuanglin: popShuanglin,
  huangcheng: popHuangcheng,
  yonglegong: popYonglegong,
  hengshan: popHengshan,
}

/* ---------- 记忆点位置 + 建筑凸起裁切区域（图片百分比坐标） ---------- */
interface Pin {
  x: number
  y: number
  /** 建筑插画凸起裁切：椭圆 rx/ry（%）与圆心 cx/cy（默认等于钉位） */
  rx?: number
  ry?: number
  cx?: number
  cy?: number
}

const PIN_POS: Record<string, Pin> = {
  yungang: { x: 65.4, y: 13.3, rx: 9, ry: 7, cy: 12.5 }, // 云冈大佛石窟
  hengshan: { x: 85.9, y: 14.8, rx: 6, ry: 6 }, // 北岳恒山
  xuankong: { x: 75.6, y: 19.2, rx: 7, ry: 6 }, // 恒山 · 浑源
  yingxian: { x: 51.3, y: 19.5, rx: 5.5, ry: 9, cy: 18 }, // 应县木塔
  yanmenguan: { x: 61.0, y: 23.0, rx: 6, ry: 5 }, // 代县山脊 · 合成城楼
  wutaishan: { x: 71.8, y: 31.3 }, // 五台山 · 以佛光寺东大殿为代表（佛光寺并入此点，避免遮挡）
  jinci: { x: 55.7, y: 43.0, rx: 7, ry: 6 }, // 晋祠殿宇与桥
  niangziguan: { x: 77.1, y: 43.8, rx: 6, ry: 6 }, // 娘子关
  qiaojia: { x: 53.7, y: 53.1, rx: 7, ry: 4.5 }, // 乔家大院
  shuanglin: { x: 39.6, y: 60.8, rx: 5, ry: 4 }, // 双林寺
  xiaoxitian: { x: 27.5, y: 61.6 }, // 小西天 · 悬塑佛龛
  hukou: { x: 44.0, y: 70.0, rx: 7, ry: 6 }, // 壶口瀑布
  huangcheng: { x: 73.2, y: 69.5, rx: 8, ry: 8 }, // 皇城相府
  guandimiao: { x: 28.3, y: 82.0, rx: 7, ry: 6 }, // 解州关帝庙
  yonglegong: { x: 24.4, y: 93.5, rx: 7, ry: 5 }, // 永乐宫
}

const clipOf = (p: Pin) =>
  `ellipse(${p.rx ?? 6}% ${p.ry ?? 5.5}% at ${p.cx ?? p.x}% ${p.cy ?? p.y}%)`

export default function PaintingMap({ selected, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef<string | null>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, on: false })
  const [hoverId, setHoverId] = useState<string | null>(null)

  const popId = hoverId ?? selected.id
  const popPin = PIN_POS[popId]

  const enterPin = useCallback((id: string) => {
    hoverRef.current = id
    setHoverId(id)
  }, [])
  const leavePin = useCallback(() => {
    hoverRef.current = null
    setHoverId(null)
  }, [])

  const handleMove = useCallback((e: React.MouseEvent) => {
    // 悬停在光点上时冻结倾斜：目标不再随鼠标漂移，保证点击稳定命中
    if (hoverRef.current) return
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({ rx: (0.5 - py) * 9, ry: (px - 0.5) * 11, on: true })
  }, [])

  const handleLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, on: false })
    hoverRef.current = null
    setHoverId(null)
  }, [])

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto w-full max-w-[520px]"
      style={{ perspective: '1400px' }}
    >
      <div
        className="relative"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
          transition: tilt.on ? 'transform 0.08s linear' : 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* 古画底图 */}
        <img
          src={mapImg}
          alt="山西省文旅地图"
          className="block w-full select-none rounded-lg border border-[#4a3f2a]"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.85), 0 0 0 6px #17130d, 0 0 0 7px #4a3f2a' }}
          draggable={false}
        />

        {/* 单体建筑凸起层：把建筑从画卷上"拔"出来（优先真轮廓抠图） */}
        {popPin && POP_IMG[popId] && (
          <img
            key={popId}
            src={POP_IMG[popId]}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 w-full select-none"
            style={{ animation: 'building-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both' }}
            draggable={false}
          />
        )}
        {popPin && !POP_IMG[popId] && (
          <img
            key={popId}
            src={mapImg}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 w-full select-none"
            style={{
              clipPath: clipOf(popPin),
              animation: 'building-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
            draggable={false}
          />
        )}

        {/* 壶口专属：瀑布水体真正向下奔流（水体蒙版 + 无缝水纹滚动，岩石不动） */}
        {popId === 'hukou' && (
          <div
            className="pointer-events-none absolute left-0 top-0 w-full"
            style={{ aspectRatio: '1024 / 1280' }}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                WebkitMaskImage: `url(${popHukouMask})`,
                maskImage: `url(${popHukouMask})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
              }}
            >
              <div
                className="absolute left-0 w-full"
                style={{
                  top: '-100%',
                  height: '200%',
                  backgroundImage: `url(${hukouFlow})`,
                  backgroundSize: '100% 50%',
                  backgroundRepeat: 'repeat',
                  animation: 'water-scroll 1.4s linear infinite',
                  opacity: 0.55,
                }}
              />
            </div>
            {/* 瀑底水雾 */}
            <div
              className="absolute left-[36%] top-[74%] h-[4%] w-[16%] rounded-[50%] blur-md"
              style={{
                background: 'radial-gradient(ellipse, rgba(235,215,175,0.65) 0%, transparent 70%)',
                animation: 'mist-pulse 1.8s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* 悬浮记忆点层（translateZ 制造立体感） */}
        <div className="absolute inset-0" style={{ transform: 'translateZ(58px)', transformStyle: 'preserve-3d' }}>
          {sites.map((s) => {
            const pos = PIN_POS[s.id]
            if (!pos) return null
            const active = s.id === selected.id
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                onMouseEnter={() => enterPin(s.id)}
                onMouseLeave={leavePin}
                className="group absolute cursor-pointer before:absolute before:-inset-5 before:content-['']"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%,-50%) translateZ(${active ? 26 : 0}px)`,
                  transition: 'transform .35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                aria-label={s.name}
              >
                {/* 涟漪 */}
                <span
                  className={`absolute left-1/2 top-1/2 -z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                    active ? 'border-[#d43d2a]' : 'border-[#c9a05a]'
                  }`}
                  style={{ animation: 'ping 2.4s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.5 }}
                />
                {/* 钉 */}
                <span
                  className={`block rounded-full border-2 transition-all duration-300 ${
                    active
                      ? 'h-4 w-4 border-[#f3e3c0] bg-[#d43d2a] shadow-[0_0_18px_rgba(212,61,42,0.9)]'
                      : 'h-3 w-3 border-[#c9a05a] bg-[#241c10] shadow-[0_0_10px_rgba(201,160,90,0.6)] group-hover:h-3.5 group-hover:w-3.5 group-hover:bg-[#c9a05a]'
                  }`}
                />
                {/* 名牌（仿古木匾） */}
                <span
                  className={`pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-[3px] border px-2 py-0.5 text-[11px] tracking-[0.15em] shadow-lg transition-all duration-300 ${
                    active
                      ? 'border-[#c03a2a] bg-[#a53428] font-bold text-[#f3e3c0] opacity-100'
                      : 'border-[#8a744a] bg-[#ece0c3]/95 text-[#3a2f1d] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {s.name}
                  {s.hot && active && <span className="ml-1 text-[9px] text-[#f0b89a]">◈悟空足迹</span>}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部操作提示 */}
      <p className="mt-4 text-center text-[11px] tracking-[0.25em] text-[#6b6350]">
        移动鼠标 · 画卷立体浮动 —— 悬停光点 · 建筑拔地而起 —— 点击翻开记忆
      </p>
    </div>
  )
}
