import { sites, type Site } from '@/data/sites'

interface Props {
  selected: Site
  onSelect: (s: Site) => void
}

/* ---------- 经纬度 → SVG 坐标（viewBox 0 0 440 640） ---------- */
const X = (lng: number) => 30 + ((lng - 110.2) / 4.5) * 380
const Y = (lat: number) => 30 + ((40.75 - lat) / 6.2) * 580

/** 山西精确省界（按真实边界拐点，顺时针） */
const BORDER: [number, number][] = [
  [111.0, 40.0], [111.8, 40.3], [112.6, 40.4], [113.5, 40.3], [114.4, 40.7], // 北 · 长城线
  [114.5, 40.0], [114.65, 39.5], [114.4, 39.0], [114.5, 38.5], [114.2, 38.0], // 东 · 太行山
  [114.2, 37.4], [114.0, 36.8], [113.7, 36.1], [113.2, 35.5], // 东南 · 晋城
  [112.4, 35.2], [111.7, 35.0], [111.2, 34.7], [110.6, 34.6], // 南 · 中条山—风陵渡
  [110.4, 35.2], [110.5, 36.0], [110.45, 36.8], [110.5, 37.5], // 西 · 黄河晋陕峡谷
  [110.7, 38.3], [111.1, 39.0], [111.3, 39.5], // 西北 · 偏关
]

const borderPath =
  'M ' + BORDER.map(([lng, lat]) => `${X(lng).toFixed(1)} ${Y(lat).toFixed(1)}`).join(' L ') + ' Z'

/** 汾河（自宁武南下，穿太原、临汾，于河津入黄河） */
const FEN: [number, number][] = [
  [112.35, 39.05], [112.6, 38.5], [112.5, 38.0], [112.35, 37.5],
  [112.1, 37.0], [111.7, 36.5], [111.3, 36.0], [110.9, 35.55], [110.62, 35.15],
]
const fenPath =
  'M ' + FEN.map(([lng, lat]) => `${X(lng).toFixed(1)} ${Y(lat).toFixed(1)}`).join(' L ')

/** 黄河（西界 + 南界，贴着省界外侧） */
const HUANGHE: [number, number][] = [
  [111.05, 39.75], [111.15, 39.35], [110.95, 38.85], [110.6, 38.25],
  [110.35, 37.6], [110.3, 36.9], [110.35, 36.1], [110.28, 35.3], [110.5, 34.72],
  [110.95, 34.55], [111.6, 34.82], [112.3, 35.05],
]
const huanghePath =
  'M ' + HUANGHE.map(([lng, lat]) => `${X(lng).toFixed(1)} ${Y(lat).toFixed(1)}`).join(' L ')

/** 山脉意象（太行 / 吕梁 / 五台 / 恒山 / 中条） */
const RANGES: { name?: string; pts: [number, number][] }[] = [
  { name: '太行山', pts: [[114.3, 39.4], [114.25, 38.6], [114.05, 37.8], [113.9, 37.0], [113.6, 36.3]] },
  { name: '吕梁山', pts: [[111.35, 39.0], [111.1, 38.4], [110.9, 37.8], [110.85, 37.2]] },
  { name: '五台山', pts: [[113.45, 39.05], [113.6, 38.95]] },
  { name: '恒山', pts: [[113.75, 39.7]] },
  { name: '中条山', pts: [[111.9, 35.05], [112.3, 35.15]] },
]

/** 11 地市 */
const CITIES: { name: string; lng: number; lat: number; anchor?: 'start' | 'end' }[] = [
  { name: '大同', lng: 113.42, lat: 40.08, anchor: 'start' },
  { name: '朔州', lng: 112.43, lat: 39.5 },
  { name: '忻州', lng: 112.73, lat: 38.35 },
  { name: '太原', lng: 112.5, lat: 37.98 },
  { name: '阳泉', lng: 113.66, lat: 37.86, anchor: 'start' },
  { name: '吕梁', lng: 111.2, lat: 37.52, anchor: 'start' },
  { name: '晋中', lng: 112.82, lat: 37.69, anchor: 'start' },
  { name: '长治', lng: 113.2, lat: 36.2, anchor: 'start' },
  { name: '临汾', lng: 111.58, lat: 36.09, anchor: 'start' },
  { name: '运城', lng: 111.06, lat: 35.12, anchor: 'start' },
  { name: '晋城', lng: 112.92, lat: 35.62, anchor: 'start' },
]

/** 主记忆点标签排布微调 */
const LABEL_POS: Record<string, { anchor?: 'start' | 'end'; dy?: number }> = {
  yungang: { anchor: 'end', dy: -2 },
  hengshan: { anchor: 'start', dy: -6 },
  xuankong: { anchor: 'start', dy: -2 },
  yingxian: { anchor: 'end', dy: -6 },
  yanmenguan: { anchor: 'start', dy: -4 },
  wutaishan: { anchor: 'start', dy: -2 },
  foguang: { anchor: 'end', dy: 6 },
  jinci: { anchor: 'end', dy: 0 },
  niangziguan: { anchor: 'start', dy: 0 },
  qiaojia: { anchor: 'start', dy: 2 },
  shuanglin: { anchor: 'end', dy: 2 },
  xiaoxitian: { anchor: 'start', dy: 0 },
  hukou: { anchor: 'end', dy: 0 },
  huangcheng: { anchor: 'end', dy: 0 },
  guandimiao: { anchor: 'end', dy: 4 },
  yonglegong: { anchor: 'start', dy: -4 },
}

const GOLD = '#c9a05a'
const RED = '#d43d2a'
const CREAM = '#f3e3c0'
const INK_BG = '#14100a'

export default function ShanxiMap({ selected, onSelect }: Props) {
  return (
    <svg viewBox="0 0 440 640" className="h-full w-full" role="img" aria-label="山西古建记忆地图">
      <defs>
        <radialGradient id="land" cx="46%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#2e2618" />
          <stop offset="55%" stopColor="#262012" />
          <stop offset="100%" stopColor="#1c1710" />
        </radialGradient>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fb3c9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6f93ab" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <filter id="glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 仿古纸底 */}
      <rect x="0" y="0" width="440" height="640" fill="#1a1610" />
      <rect x="0" y="0" width="440" height="640" fill="url(#vignette)" />

      {/* 四角回纹括线 */}
      <g stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.6" fill="none">
        <path d="M 10 26 L 10 10 L 26 10 M 14 30 L 14 14 L 30 14" />
        <path d="M 430 26 L 430 10 L 414 10 M 426 30 L 426 14 L 410 14" />
        <path d="M 10 614 L 10 630 L 26 630 M 14 610 L 14 626 L 30 626" />
        <path d="M 430 614 L 430 630 L 414 630 M 426 610 L 426 626 L 410 626" />
      </g>

      {/* 黄河（先画，省界之下） */}
      <path d={huanghePath} fill="none" stroke="url(#river)" strokeWidth="6" strokeLinecap="round" />
      <text x={X(110.28)} y={Y(36.5)} fontSize="10" fill="#7d9bb3" opacity="0.9" transform={`rotate(-86 ${X(110.28)} ${Y(36.5)})`} letterSpacing="4">
        黄 河
      </text>

      {/* 省界 · 金色双线 */}
      <path d={borderPath} fill="url(#land)" stroke="#7a663f" strokeWidth="4.5" strokeLinejoin="round" strokeOpacity="0.5" />
      <path d={borderPath} fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={borderPath} fill="none" stroke="#e6d3a3" strokeWidth="0.5" strokeDasharray="3 4" strokeLinejoin="round" strokeOpacity="0.6" />

      {/* 汾河 */}
      <path d={fenPath} fill="none" stroke="url(#river)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.85" />
      <text x={X(111.55)} y={Y(36.4)} fontSize="9" fill="#7d9bb3" opacity="0.8" transform={`rotate(-60 ${X(111.55)} ${Y(36.4)})`} letterSpacing="3">
        汾 河
      </text>

      {/* 山脉 */}
      {RANGES.map((r) => (
        <g key={r.name}>
          {r.pts.map(([lng, lat], i) => (
            <path
              key={i}
              d={`M ${X(lng) - 9} ${Y(lat) + 6} L ${X(lng)} ${Y(lat) - 7} L ${X(lng) + 9} ${Y(lat) + 6}`}
              fill="none"
              stroke="#6b5a3a"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}
          {r.name && (
            <text
              x={X(r.pts[Math.floor(r.pts.length / 2)][0]) + 12}
              y={Y(r.pts[Math.floor(r.pts.length / 2)][1])}
              fontSize="9.5"
              fill="#8a744a"
              letterSpacing="2"
              style={{ paintOrder: 'stroke' }}
              stroke={INK_BG}
              strokeWidth="3"
            >
              {r.name}
            </text>
          )}
        </g>
      ))}

      {/* 地市 */}
      {CITIES.map((c) => (
        <g key={c.name} transform={`translate(${X(c.lng)}, ${Y(c.lat)})`}>
          <rect x="-2.6" y="-2.6" width="5.2" height="5.2" transform="rotate(45)" fill="#17130d" stroke={GOLD} strokeWidth="1" />
          <text
            x={c.anchor === 'end' ? -7 : 7}
            y="3.5"
            textAnchor={c.anchor ?? 'start'}
            fontSize="11"
            fill="#cdbf9f"
            letterSpacing="2"
            style={{ paintOrder: 'stroke' }}
            stroke={INK_BG}
            strokeWidth="3.5"
          >
            {c.name}
          </text>
        </g>
      ))}

      {/* 主记忆点 */}
      {sites.map((s) => {
        const active = s.id === selected.id
        const px = X(s.lng)
        const py = Y(s.lat)
        const lp = LABEL_POS[s.id] ?? {}
        const r = active ? 8.5 : 6
        return (
          <g
            key={s.id}
            transform={`translate(${px}, ${py})`}
            onClick={() => onSelect(s)}
            className="cursor-pointer"
          >
            {/* 扩大点击热区（透明） */}
            <circle r={r + 18} fill="rgba(0,0,0,0)" />
            <circle r={r + 12} fill="none" stroke={active ? RED : GOLD} strokeWidth="1" strokeOpacity="0.3">
              <animate attributeName="r" values={`${r + 5};${r + 24}`} dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.4;0" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle r={r + 5} fill={active ? RED : GOLD} opacity="0.28" filter="url(#glow)" />
            <circle
              r={r}
              fill={active ? RED : '#2a2013'}
              stroke={active ? CREAM : GOLD}
              strokeWidth="1.6"
              style={{ transition: 'all .3s' }}
            />
            <circle r={active ? 2.4 : 1.8} fill={active ? CREAM : GOLD} />
            <text
              x={lp.anchor === 'end' ? -r - 6 : lp.anchor === 'start' ? r + 6 : 0}
              y={lp.anchor ? 4 + (lp.dy ?? 0) : -r - 7 + (lp.dy ?? 0)}
              textAnchor={lp.anchor ?? 'middle'}
              fontSize={active ? 14 : 12}
              fontWeight={active ? 700 : 500}
              fill={active ? CREAM : '#e0d3ae'}
              style={{ transition: 'all .3s', paintOrder: 'stroke' }}
              stroke={INK_BG}
              strokeWidth="3.5"
            >
              {s.name}
            </text>
            {s.hot && active && (
              <text x="0" y={r + 16} textAnchor="middle" fontSize="9.5" fill="#e07a4f" style={{ paintOrder: 'stroke' }} stroke={INK_BG} strokeWidth="3">
                ◈ 悟空足迹
              </text>
            )}
          </g>
        )
      })}

      {/* 罗盘 */}
      <g transform="translate(392, 66)" opacity="0.95">
        <circle r="17" fill={INK_BG} stroke="#8a744a" strokeWidth="1" strokeOpacity="0.8" />
        <circle r="13.5" fill="none" stroke="#8a744a" strokeWidth="0.5" strokeOpacity="0.5" />
        <path d="M 0 -13 L 3.5 0 L 0 13 L -3.5 0 Z" fill={GOLD} />
        <path d="M -13 0 L 0 3.5 L 13 0 L 0 -3.5 Z" fill="#8a744a" opacity="0.55" />
        <circle r="1.6" fill={CREAM} />
        <text y="-24" textAnchor="middle" fontSize="11" fill={GOLD} letterSpacing="1">北</text>
      </g>

      {/* 图名 */}
      <text x="30" y="52" fontSize="17" fill={GOLD} letterSpacing="6" fontWeight="700" style={{ paintOrder: 'stroke' }} stroke={INK_BG} strokeWidth="4">
        三晋记忆图
      </text>
      <text x="30" y="70" fontSize="9.5" fill="#8a744a" letterSpacing="3" style={{ paintOrder: 'stroke' }} stroke={INK_BG} strokeWidth="3">
        表里山河 · 地上文物之省
      </text>

      {/* 图例 */}
      <g transform="translate(30, 604)" fontSize="10" fill="#a08c5f">
        <circle cx="4" cy="-3.5" r="4" fill="#2a2013" stroke={GOLD} strokeWidth="1.4" />
        <text x="14" y="0">15 处记忆点已开放</text>
        <path d="M 128 -3.5 L 150 -3.5" stroke="url(#river)" strokeWidth="3" strokeLinecap="round" />
        <text x="156" y="0">黄河 · 汾河</text>
        <text x="246" y="0" fill="#e07a4f">◈ 黑神话取景地</text>
        <rect x="330" y="-8.5" width="5" height="5" transform="rotate(45 332.5 -6)" fill="#17130d" stroke={GOLD} strokeWidth="0.8" />
        <text x="342" y="0">地市</text>
      </g>
    </svg>
  )
}
