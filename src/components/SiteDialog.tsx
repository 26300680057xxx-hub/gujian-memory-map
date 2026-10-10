import { useEffect, useRef, useState } from 'react'
import { X, Play, Pause, Landmark, Sparkles, ScrollText, BarChart3, Orbit } from 'lucide-react'
import type { Site } from '@/data/sites'
import { playClick } from '@/lib/sound'
import revealFoguang from '@/assets/reveal-foguang.png'
import revealXiaoxitian from '@/assets/reveal-xiaoxitian.png'
import revealYanmenguan from '@/assets/reveal-yanmenguan.png'
import revealJinci from '@/assets/reveal-jinci.png'
import revealGuandimiao from '@/assets/reveal-guandimiao.png'
import revealYungang from '@/assets/reveal-yungang.png'
import revealXuankong from '@/assets/reveal-xuankong.png'
import revealHukou from '@/assets/reveal-hukou.png'
import revealNiangziguan from '@/assets/reveal-niangziguan.png'
import revealQiaojia from '@/assets/reveal-qiaojia.png'
import revealShuanglin from '@/assets/reveal-shuanglin.png'
import revealHuangcheng from '@/assets/reveal-huangcheng.png'
import revealYonglegong from '@/assets/reveal-yonglegong.png'
import revealSurveyors from '@/assets/reveal-surveyors.png'
import revealHengshan from '@/assets/reveal-hengshan.png'
import revealWukong from '@/assets/reveal-wukong.png'

interface Props {
  site: Site | null
  onClose: () => void
}

type Tab = 'monologue' | 'drama' | 'facts' | 'stats'

/** 每个记忆点的出场方式（各不一样） */
type RevealKind = 'rise' | 'glow' | 'mist' | 'spin' | 'lantern' | 'unroll' | 'seal' | 'flythrough' | 'warflame' | 'survey'
const REVEAL_KIND: Record<string, RevealKind> = {
  yungang: 'warflame', // 云冈大佛 · 抗日烽火下岿然挺立
  hengshan: 'mist', // 北岳恒山 · 云雾散开
  xuankong: 'mist', // 悬空寺 · 云雾散开
  yanmenguan: 'spin', // 雁门关 · 关城旋转落定
  wutaishan: 'survey', // 五台山佛光寺 · 梁林考察测绘
  foguang: 'survey',
  jinci: 'unroll', // 晋祠 · 卷轴展开
  niangziguan: 'spin', // 娘子关 · 旋转落定
  qiaojia: 'flythrough', // 乔家大院 · 穿过牌坊
  shuanglin: 'glow', // 双林寺 · 彩塑金光
  xiaoxitian: 'glow', // 小西天 · 悬塑金光涌现
  hukou: 'mist', // 壶口 · 水雾升腾
  huangcheng: 'lantern', // 皇城相府 · 深宅点灯
  guandimiao: 'seal', // 关帝庙 · 印章盖下
  yonglegong: 'unroll', // 永乐宫 · 壁画长卷展开
}

/** 有单体抠图的记忆点，出场时建筑本尊浮现 */
const REVEAL_IMG: Record<string, string> = {
  wutaishan: revealFoguang,
  foguang: revealFoguang,
  xiaoxitian: revealXiaoxitian,
  yanmenguan: revealYanmenguan,
  jinci: revealJinci,
  guandimiao: revealGuandimiao,
  yungang: revealYungang,
  xuankong: revealXuankong,
  hukou: revealHukou,
  niangziguan: revealNiangziguan,
  qiaojia: revealQiaojia,
  shuanglin: revealShuanglin,
  huangcheng: revealHuangcheng,
  yonglegong: revealYonglegong,
  hengshan: revealHengshan,
}

const MAIN_ANIM: Record<RevealKind, string> = {
  rise: 'building-rise 1.15s cubic-bezier(0.22,1,0.36,1) 0.1s both',
  glow: 'reveal-glow-in 1.6s ease 0.1s both',
  mist: 'reveal-mist-in 1.7s ease 0.1s both',
  spin: 'reveal-spin-in 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
  lantern: 'reveal-lantern 1.7s ease 0.15s both',
  unroll: 'reveal-unroll 1.25s cubic-bezier(0.22,1,0.36,1) 0.1s both',
  seal: 'building-rise 1s ease 0.6s both',
  flythrough: 'fly-through 3.1s ease-in-out 0.1s both',
  warflame: 'reveal-glow-in 1.6s ease 0.1s both',
  survey: 'building-rise 1.15s cubic-bezier(0.22,1,0.36,1) 0.1s both',
}

/** 个别记忆点需要更长的出场时间 */
const REVEAL_MS: Record<string, number> = {
  qiaojia: 3400, // 穿过牌坊的运镜需要时间
  yungang: 3000, // 烽火与火星多停留一会
  wutaishan: 3000, // 看清测绘背影
  foguang: 3000,
}

const tabs: { key: Tab; label: string; icon: typeof Sparkles }[] = [
  { key: 'monologue', label: '它的独白', icon: Sparkles },
  { key: 'drama', label: 'AI 短剧', icon: Play },
  { key: 'facts', label: '记忆碎片', icon: ScrollText },
  { key: 'stats', label: '档案', icon: BarChart3 },
]

export default function SiteDialog({ site, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('monologue')
  const [revealing, setRevealing] = useState(false)
  const [playing, setPlaying] = useState<'std' | 'dia' | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /** 播放/暂停讲解（普通话 or 太原话），同一时刻只响一路 */
  const toggleNarration = (kind: 'std' | 'dia') => {
    if (!site) return
    if (playing === kind) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    playClick()
    audioRef.current?.pause()
    const a = new Audio(`${import.meta.env.BASE_URL}audio/${site.id}-${kind}.mp3`)
    a.onended = () => setPlaying(null)
    a.onerror = () => setPlaying(null)
    audioRef.current = a
    setPlaying(kind)
    void a.play().catch(() => setPlaying(null))
  }

  useEffect(() => {
    setTab('monologue')
    // 切换记忆点/关闭时停掉讲解
    audioRef.current?.pause()
    audioRef.current = null
    setPlaying(null)
    // 应县木塔的开场由全屏「营造」动画承担，弹窗内不再重复
    if (site && site.id !== 'yingxian') {
      setRevealing(true)
      const t = window.setTimeout(() => setRevealing(false), REVEAL_MS[site.id] ?? 2500)
      return () => window.clearTimeout(t)
    }
    setRevealing(false)
  }, [site?.id])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  if (!site) return null

  const revealKind: RevealKind = REVEAL_KIND[site.id] ?? 'rise'
  const revealImg = REVEAL_IMG[site.id]
  const revealMs = REVEAL_MS[site.id] ?? 2500

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="ink-noise paper-edge relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[#3a3226] bg-[#17130d] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${site.name} 记忆档案`}
      >
        {/* 建筑浮现 · 出场特效（每个记忆点各不相同） */}
        {revealing && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-t-2xl bg-[#0d0b07f7] sm:rounded-2xl"
            style={{ animation: `reveal-fade-out 0.45s ease ${(revealMs - 450) / 1000}s both` }}
            onClick={() => setRevealing(false)}
          >
            {/* 金色光晕 */}
            <div
              className="absolute h-72 w-72 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(201,160,90,0.28) 0%, rgba(192,58,42,0.12) 45%, transparent 70%)',
                animation: 'reveal-glow 1.8s ease both',
              }}
            />
            {/* 金粉粒子 */}
            {[
              { l: '22%', b: '26%', d: '0s' }, { l: '35%', b: '18%', d: '0.25s' },
              { l: '50%', b: '22%', d: '0.1s' }, { l: '66%', b: '16%', d: '0.4s' },
              { l: '78%', b: '28%', d: '0.2s' }, { l: '30%', b: '34%', d: '0.5s' },
              { l: '60%', b: '32%', d: '0.35s' }, { l: '44%', b: '12%', d: '0.55s' },
            ].map((p, i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-[#e8cf9a]"
                style={{
                  left: p.l,
                  bottom: p.b,
                  boxShadow: '0 0 8px 2px rgba(201,160,90,0.8)',
                  animation: `particle-float 1.3s ease-out ${p.d} both`,
                }}
              />
            ))}
            {/* 云雾散场（mist 专属） */}
            {revealKind === 'mist' && (
              <>
                <div
                  className="pointer-events-none absolute bottom-[18%] left-[8%] h-16 w-64 rounded-[50%] opacity-50 blur-xl"
                  style={{ background: 'radial-gradient(ellipse, rgba(220,200,160,0.55) 0%, transparent 70%)', animation: 'mist-drift 2.2s ease-in-out 0.1s both' }}
                />
                <div
                  className="pointer-events-none absolute bottom-[26%] right-[6%] h-14 w-56 rounded-[50%] opacity-40 blur-lg"
                  style={{ background: 'radial-gradient(ellipse, rgba(201,160,90,0.5) 0%, transparent 70%)', animation: 'mist-drift 2.6s ease-in-out 0.3s both reverse' }}
                />
              </>
            )}
            {/* 夜幕点灯（lantern 专属）：暖黄灯盏次第亮起 */}
            {revealKind === 'lantern' && (
              <>
                {[
                  { l: '24%', b: '30%', d: '0.5s' }, { l: '38%', b: '22%', d: '0.75s' },
                  { l: '52%', b: '28%', d: '0.95s' }, { l: '66%', b: '20%', d: '1.15s' },
                  { l: '76%', b: '30%', d: '1.35s' },
                ].map((p, i) => (
                  <span
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-[#f0b86a]"
                    style={{
                      left: p.l, bottom: p.b,
                      boxShadow: '0 0 14px 5px rgba(240,184,106,0.75)',
                      animation: `lantern-on 1.4s ease ${p.d} both`,
                    }}
                  />
                ))}
              </>
            )}
            {/* 卷轴上下杆（unroll 专属） */}
            {revealKind === 'unroll' && (
              <>
                <div className="pointer-events-none absolute left-[12%] right-[12%] top-[31%] h-[3px] rounded bg-gradient-to-r from-transparent via-[#c9a05a] to-transparent" style={{ animation: 'reveal-unroll-bar 1.25s cubic-bezier(0.22,1,0.36,1) 0.1s both' }} />
                <div className="pointer-events-none absolute left-[12%] right-[12%] top-[63%] h-[3px] rounded bg-gradient-to-r from-transparent via-[#c9a05a] to-transparent" style={{ animation: 'reveal-unroll-bar 1.25s cubic-bezier(0.22,1,0.36,1) 0.1s both' }} />
              </>
            )}
            {/* 烽火挺立（warflame 专属）：战火映天、火星升腾，大佛岿然 */}
            {revealKind === 'warflame' && (
              <>
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45%]"
                  style={{
                    background: 'radial-gradient(ellipse 60% 90% at 30% 100%, rgba(192,58,42,0.5) 0%, transparent 70%)',
                    animation: 'flame-flicker 1.1s ease-in-out infinite',
                    transformOrigin: 'bottom',
                  }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-[40%]"
                  style={{
                    background: 'radial-gradient(ellipse 55% 85% at 72% 100%, rgba(212,101,42,0.45) 0%, transparent 70%)',
                    animation: 'flame-flicker 0.9s ease-in-out 0.25s infinite',
                    transformOrigin: 'bottom',
                  }}
                />
                {[
                  { l: '18%', d: '0s' }, { l: '32%', d: '0.4s' }, { l: '50%', d: '0.2s' },
                  { l: '66%', d: '0.6s' }, { l: '80%', d: '0.3s' }, { l: '42%', d: '0.8s' },
                ].map((p, i) => (
                  <span
                    key={i}
                    className="absolute bottom-[12%] h-1 w-1 rounded-full bg-[#f0a05a]"
                    style={{
                      left: p.l,
                      boxShadow: '0 0 6px 2px rgba(240,140,60,0.8)',
                      animation: `ember-rise 1.6s ease-out ${p.d} infinite`,
                    }}
                  />
                ))}
                <p
                  className="absolute top-[15%] text-[11px] tracking-[0.5em] text-[#c9866a]"
                  style={{ animation: 'fade-in-late 1.8s ease 0.2s both' }}
                >
                  烽火连天 · 岿然不动
                </p>
              </>
            )}
            {/* 梁林测绘（survey 专属）：两位学者的背影，为大殿量一寸山河 */}
            {revealKind === 'survey' && (
              <>
                <img
                  src={revealSurveyors}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="pointer-events-none absolute bottom-[9%] left-[12%] h-[30%] w-auto select-none"
                  style={{ animation: 'fade-in-late 2s ease 0.2s both', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6)) drop-shadow(0 0 12px rgba(224,192,138,0.35))' }}
                />
                <div
                  className="pointer-events-none absolute bottom-[30%] left-[29%] h-px w-[30%] origin-left"
                  style={{
                    background: 'repeating-linear-gradient(90deg, #d43d2a 0 6px, transparent 6px 11px)',
                    animation: 'survey-line 2.4s ease 0.3s both',
                  }}
                />
              </>
            )}
            {/* 黑神话彩蛋（小西天专属）：天命人立于悬塑之前 */}
            {site.id === 'xiaoxitian' && (
              <>
                <img
                  src={revealWukong}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="pointer-events-none absolute bottom-[9%] right-[12%] h-[36%] w-auto select-none"
                  style={{ animation: 'fade-in-late 2s ease 0.35s both', filter: 'drop-shadow(0 0 18px rgba(217,168,78,0.8)) drop-shadow(0 8px 16px rgba(0,0,0,0.7))' }}
                />
                <p
                  className="absolute top-[13%] text-[11px] tracking-[0.5em] text-[#d9a84e]"
                  style={{ animation: 'fade-in-late 1.8s ease 0.6s both', textShadow: '0 0 16px rgba(217,168,78,0.6)' }}
                >
                  既见未来 · 为何不拜
                </p>
              </>
            )}
            {/* 支撑木柱（悬空寺专属）：一根根木柱从崖下生长撑起危楼 */}
            {site.id === 'xuankong' && (
              <>
                {[
                  { l: '38%', h: '26%', d: '0.3s' }, { l: '45%', h: '30%', d: '0.5s' },
                  { l: '52%', h: '28%', d: '0.7s' }, { l: '59%', h: '24%', d: '0.9s' },
                  { l: '66%', h: '20%', d: '1.1s' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="pointer-events-none absolute bottom-[8%] w-[3px] rounded-t bg-[#6b4f2e]"
                    style={{
                      left: p.l,
                      height: p.h,
                      transformOrigin: 'bottom',
                      boxShadow: '0 0 6px rgba(107,79,46,0.6)',
                      animation: `stilt-grow 0.8s cubic-bezier(0.22,1,0.36,1) ${p.d} both`,
                    }}
                  />
                ))}
              </>
            )}
            {/* 战旗猎猎（雁门关 / 娘子关专属） */}
            {(site.id === 'yanmenguan' || site.id === 'niangziguan') && (
              <>
                {[
                  { l: '20%', d: '0s' }, { l: '76%', d: '0.4s' },
                ].map((p, i) => (
                  <div key={i} className="pointer-events-none absolute top-[20%]" style={{ left: p.l, animation: `fade-in-late 1.2s ease ${p.d} both` }}>
                    <div className="h-10 w-[2px] bg-[#4a3a24]" />
                    <div
                      className="absolute left-[2px] top-0 h-5 w-8 bg-[#a53428]"
                      style={{
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                        transformOrigin: 'left center',
                        boxShadow: '0 0 10px rgba(192,58,42,0.5)',
                        animation: 'flag-wave 1.4s ease-in-out infinite',
                      }}
                    />
                  </div>
                ))}
              </>
            )}
            {/* 难老泉涟漪（晋祠专属）：泉水不息，涟漪层层荡开 */}
            {site.id === 'jinci' && (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="pointer-events-none absolute bottom-[10%] left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] border border-[#7fa8a0]"
                    style={{
                      boxShadow: '0 0 12px rgba(127,168,160,0.35)',
                      animation: `ripple-spread 2.4s ease-out ${i * 0.8}s infinite`,
                    }}
                  />
                ))}
              </>
            )}
            {/* 朝代小字 */}
            <p
              className="relative mb-4 text-xs tracking-[0.6em] text-[#a08c5f]"
              style={{ animation: 'building-rise 1s cubic-bezier(0.22,1,0.36,1) 0.15s both' }}
            >
              {site.dynasty} · {site.year} · {site.location}
            </p>
            {/* 主视觉：有抠图则建筑本尊浮现，否则大字名号 */}
            {revealImg ? (
              <img
                src={revealImg}
                alt={site.name}
                draggable={false}
                className="relative max-h-[34vh] w-auto max-w-[82%] select-none object-contain"
                style={{ animation: MAIN_ANIM[revealKind], filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.65))' }}
              />
            ) : (
              <h2
                className="font-kai relative px-4 text-center text-5xl font-black tracking-wide text-[#f3e3c0] sm:text-6xl"
                style={{
                  animation: MAIN_ANIM[revealKind],
                  textShadow: '0 0 40px rgba(201,160,90,0.45), 0 4px 20px rgba(0,0,0,0.8)',
                }}
              >
                {site.name}
              </h2>
            )}
            {/* 有抠图时名字放在建筑下方 */}
            {revealImg && (
              <h2
                className="font-kai relative mt-4 px-4 text-center text-3xl font-black tracking-wide text-[#f3e3c0] sm:text-4xl"
                style={{
                  animation: 'building-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s both',
                  textShadow: '0 0 34px rgba(201,160,90,0.45), 0 4px 18px rgba(0,0,0,0.8)',
                }}
              >
                {site.name}
              </h2>
            )}
            {/* 朱红印章砸下（seal 版式更大、更早砸下） */}
            <div
              className={`relative mt-5 flex items-center justify-center rounded-[6px] border-2 border-[#d84a38] bg-[#a53428] shadow-[0_0_30px_rgba(192,58,42,0.5)] ${
                revealKind === 'seal' ? 'h-[4.5rem] w-[4.5rem]' : 'h-14 w-14'
              }`}
              style={{ animation: `seal-stamp 0.7s cubic-bezier(0.34,1.56,0.64,1) ${revealKind === 'seal' ? '0.15s' : '0.9s'} both` }}
            >
              <span className={`font-kai text-vertical font-bold leading-none text-[#f3e3c0] ${revealKind === 'seal' ? 'text-2xl' : 'text-lg'}`}>
                {site.name.slice(0, 2)}
              </span>
            </div>
            <p className="absolute bottom-6 text-[10px] tracking-[0.4em] text-[#4a4232]">记 忆 浮 现 中 · 点 击 跳 过</p>
          </div>
        )}
        {/* 头部 */}
        <div className="relative shrink-0 border-b border-[#2c2619] bg-gradient-to-br from-[#1d1811] to-[#14100a] px-6 pb-5 pt-6 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] tracking-widest text-[#a08c5f]">
                <span className="rounded border border-[#4a3f2a] px-1.5 py-0.5">{site.dynasty} · {site.year}</span>
                <span className="flex items-center gap-1"><Landmark size={12} />{site.location}</span>
              </div>
              <h2 className="text-3xl font-bold text-[#ece5d8] sm:text-4xl">{site.name}</h2>
              <p className="mt-1 text-sm text-[#8f8672]">{site.alias}</p>
              {site.panorama && (
                <a
                  href={site.panorama}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playClick()}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#c9a05a] bg-[#c9a05a]/10 px-5 py-2 text-sm font-bold text-[#e3c88a] transition hover:bg-[#c9a05a]/25 hover:text-[#f3e3c0]"
                >
                  <Orbit size={15} />
                  全景真实漫游 · 3D 实景
                </a>
              )}
            </div>
            {/* 印章 */}
            <div className="animate-seal flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px] border-2 border-[#c03a2a] bg-[#a53428] text-[#f3e3c0] shadow-lg">
              <span className="font-kai text-vertical text-lg font-bold leading-none">{site.name.slice(0, 2)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-[#8f8672] transition hover:bg-white/5 hover:text-[#ece5d8]"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex shrink-0 gap-1 border-b border-[#2c2619] px-4 sm:px-6">
          {tabs.map(({ key, label, icon: Icon }) => {
            const disabled = key === 'drama' && !site.drama
            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => { playClick(); setTab(key) }}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm transition sm:px-4 ${
                  tab === key
                    ? 'border-[#c03a2a] text-[#ece5d8]'
                    : 'border-transparent text-[#8f8672] hover:text-[#cdbf9f]'
                } ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
                title={disabled ? '该记忆点的 AI 短剧制作中' : undefined}
              >
                <Icon size={14} />
                {label}
                {key === 'drama' && site.drama && (
                  <span className="rounded bg-[#c03a2a] px-1 text-[10px] text-[#f3e3c0]">样例</span>
                )}
              </button>
            )
          })}
        </div>

        {/* 内容 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {tab === 'monologue' && (
            <div className="animate-fade-up space-y-5">
              <p className="text-xs tracking-widest text-[#a08c5f]">AI 生成 · 第一人称叙事语音讲解</p>
              <blockquote className="border-l-2 border-[#c03a2a] pl-5 font-kai text-lg leading-loose text-[#e3d9c4]">
                {site.monologue}
              </blockquote>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => toggleNarration('std')}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition ${
                    playing === 'std'
                      ? 'border-[#c9a05a] bg-[#2a2113] text-[#ece5d8]'
                      : 'border-[#4a3f2a] text-[#cdbf9f] hover:border-[#c9a05a] hover:text-[#ece5d8]'
                  }`}
                >
                  {playing === 'std' ? <Pause size={14} /> : <Play size={14} />}
                  {playing === 'std' ? '暂停普通话讲解' : '播放普通话讲解'}
                </button>
                <button
                  onClick={() => toggleNarration('dia')}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition ${
                    playing === 'dia'
                      ? 'border-[#c03a2a] bg-[#2a1a14] text-[#ece5d8]'
                      : 'border-[#4a3f2a] text-[#cdbf9f] hover:border-[#c03a2a] hover:text-[#ece5d8]'
                  }`}
                >
                  {playing === 'dia' ? <Pause size={14} /> : <Play size={14} />}
                  {playing === 'dia' ? '暂停太原话讲解' : '播放太原话讲解'}
                </button>
              </div>
            </div>
          )}

          {tab === 'drama' && site.drama && (
            <div className="animate-fade-up space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[#ece5d8]">{site.drama.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8f8672]">{site.drama.logline}</p>
              </div>
              {site.drama.scenes.map((sc) => (
                <div key={sc.no} className="rounded-lg border border-[#2c2619] bg-[#1c1710] p-4 sm:p-5">
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="font-mono text-2xl font-bold text-[#c03a2a]">{sc.no}</span>
                    <span className="font-bold text-[#ece5d8]">{sc.title}</span>
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
              <p className="text-xs leading-relaxed text-[#6b6350]">
                制作管线：史料 RAG 检索 → AI 剧本生成 → 文生视频 / 图生视频 → AI 方言配音 → 地图记忆点挂载。
              </p>
            </div>
          )}

          {tab === 'facts' && (
            <div className="animate-fade-up space-y-4">
              {site.facts.map((f) => (
                <div key={f.title} className="rounded-lg border border-[#2c2619] bg-[#1c1710] p-4 sm:p-5">
                  <h4 className="mb-1.5 flex items-center gap-2 font-bold text-[#e3d9c4]">
                    <span className="inline-block h-2 w-2 rotate-45 bg-[#c03a2a]" />
                    {f.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-[#a99c80]">{f.text}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'stats' && (
            <div className="animate-fade-up">
              <div className="grid grid-cols-2 gap-3">
                {site.stats.map((s) => (
                  <div key={s.label} className="rounded-lg border border-[#2c2619] bg-[#1c1710] p-4 text-center">
                    <div className="text-xl font-bold text-[#c9a05a]">{s.value}</div>
                    <div className="mt-1 text-xs tracking-widest text-[#8f8672]">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-[#a99c80]">{site.intro}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
