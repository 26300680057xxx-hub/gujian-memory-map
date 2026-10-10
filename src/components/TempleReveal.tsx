import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * 寺庙模型入场秀：实体 → 全息 → 粒子爆炸散开
 * 滑动到记忆地图（或点「全息入场」按钮）时全屏播放一次。
 */

type Phase = 'loading' | 'solid' | 'holo' | 'explode' | 'done'

const PHASE_TEXT: Record<Exclude<Phase, 'done' | 'loading'>, string> = {
  solid: '实 体 · 千 年 古 刹',
  holo: '全 息 扫 描 中 · · ·',
  explode: '记 忆 · 化 作 漫 天 星 辰',
}

/* ---------- 全息 shader：描边发光 + 扫描线 + 闪烁 ---------- */
const HOLO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const HOLO_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;   // 全息金
  uniform vec3 uColorB;   // 科技青
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.0);
    float scan = 0.55 + 0.45 * sin(vWorldPos.y * 42.0 - uTime * 6.0);
    float flicker = 0.9 + 0.1 * sin(uTime * 37.0) * sin(uTime * 13.7);
    float band = smoothstep(0.02, 0.0, abs(fract(vWorldPos.y * 0.5 - uTime * 0.35) - 0.5) - 0.44);
    vec3 col = mix(uColorB, uColorA, fresnel);
    col += uColorA * band * 1.6;
    float a = (0.10 + fresnel * 0.85) * scan * flicker * uOpacity;
    gl_FragColor = vec4(col * (0.7 + fresnel), a);
  }
`

/* ---------- 粒子爆炸 shader ---------- */
const PTS_VERT = /* glsl */ `
  attribute vec3 aVel;
  attribute float aRand;
  attribute vec3 aColor;
  uniform float uT;      // 0..1 爆炸进度
  uniform float uSize;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float t = uT;
    float ease = 1.0 - pow(1.0 - t, 3.0);            // easeOutCubic
    vec3 pos = position + aVel * ease * (0.7 + aRand * 0.6);
    pos.y += t * t * (0.25 + aRand * 0.4);           // 尾部微微上扬
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.75 + 0.25 * sin(aRand * 40.0 + t * 30.0);
    gl_PointSize = uSize * twinkle * (1.0 + aRand) / max(0.001, -mv.z);
    vColor = aColor;
    vFade = (1.0 - smoothstep(0.55, 1.0, t)) * twinkle;
  }
`
const PTS_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vFade;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = smoothstep(0.5, 0.0, d);
    glow *= glow;
    gl_FragColor = vec4(vColor * (1.0 + glow), glow * vFade);
  }
`

interface Props {
  onDone: () => void
}

/** 模型正面朝向镜头的 Y 轴角度（按截图实测校准：0 为侧棱，-π/2 为有建筑的正面） */
const FRONT_ANGLE = -Math.PI / 2

export default function TempleReveal({ onDone }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [overlayFade, setOverlayFade] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let raf = 0
    const timers: number[] = []

    /* 兜底：任何异常都直接收场，绝不让用户卡在黑屏 */
    const bail = () => { if (!disposed) finish() }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.01, 500)

    const key = new THREE.DirectionalLight(0xffe2b0, 3.4)
    key.position.set(3, 5, 4)
    const fill = new THREE.DirectionalLight(0xfff0d0, 1.6)
    fill.position.set(-2, 1, 5)
    const rim = new THREE.DirectionalLight(0xc03a2a, 1.3)
    rim.position.set(-4, 2, -3)
    scene.add(key, fill, rim, new THREE.AmbientLight(0x9a8a6a, 2.2))

    const loader = new GLTFLoader()
    let solid: THREE.Group | null = null
    let holoMesh: THREE.Mesh | null = null
    let points: THREE.Points | null = null
    let holoMat: THREE.ShaderMaterial | null = null
    let ptsMat: THREE.ShaderMaterial | null = null
    let radius = 1
    let center = new THREE.Vector3()
    let phaseT0 = performance.now()
    let curPhase: Phase = 'loading'

    const setP = (p: Phase) => {
      curPhase = p
      phaseT0 = performance.now()
      setPhase(p)
    }

    function finish() {
      if (doneRef.current) return
      doneRef.current = true
      setOverlayFade(true)
      timers.push(window.setTimeout(() => { disposed = true; onDone() }, 650))
    }

    const norm = (g: THREE.Group) => {
      const box = new THREE.Box3().setFromObject(g)
      const s = new THREE.Vector3(); box.getSize(s)
      box.getCenter(center)
      radius = Math.max(s.x, s.y, s.z) / 2
      g.position.sub(center)
      const k = 1.85 / (radius * 2)
      g.scale.setScalar(k)
      radius *= k
      center.set(0, 0, 0)
    }

    const base = import.meta.env.BASE_URL
    const MODEL_URLS = [
      `${base}models/temple.glb`,
      // 备用：GitHub Release 附件（Cloudflare Pages 等 25MB 限制的平台运行时拉取）
      'https://github.com/26300680057xxx-hub/gujian-memory-map/releases/download/v1.0/temple.glb',
    ]
    const onProgress = (e: ProgressEvent) => setProgress(Math.min(99, Math.round((e.loaded / 6.1e7) * 100)))
    const loadModel = async () => {
      for (const url of MODEL_URLS) {
        try {
          return await loader.loadAsync(url, onProgress)
        } catch {
          /* 换下一个源 */
        }
      }
      throw new Error('model load failed')
    }
    loadModel().then((g1) => {
      const g2 = g1
      if (disposed) return

      // —— 实体模型 ——
      solid = g1.scene
      norm(solid)
      solid.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial
          m.metalness = 0.08
          m.roughness = 0.85
        }
      })
      scene.add(solid)

      // —— 全息模型（用 2 号模型的几何，换全息 shader）——
      let src: THREE.Mesh | null = null
      g2.scene.traverse((o) => { if (!src && (o as THREE.Mesh).isMesh) src = o as THREE.Mesh })
      if (!src) { bail(); return }
      const srcMesh: THREE.Mesh = src
      holoMat = new THREE.ShaderMaterial({
        vertexShader: HOLO_VERT,
        fragmentShader: HOLO_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColorA: { value: new THREE.Color('#e8b85c') },
          uColorB: { value: new THREE.Color('#4ec8c2') },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      holoMesh = new THREE.Mesh(srcMesh.geometry, holoMat)
      // 复用实体模型的归一化变换
      holoMesh.scale.copy(solid.scale)
      holoMesh.position.copy(solid.position)
      holoMesh.visible = false
      scene.add(holoMesh)

      // —— 粒子：从全息模型顶点采样 9 万颗 ——
      const posAttr = (srcMesh.geometry as THREE.BufferGeometry).attributes.position
      const N = 90000
      const step = Math.max(1, Math.floor(posAttr.count / N))
      const count = Math.floor(posAttr.count / step)
      const pos = new Float32Array(count * 3)
      const vel = new Float32Array(count * 3)
      const rnd = new Float32Array(count)
      const col = new Float32Array(count * 3)
      const gold = new THREE.Color('#f0c878')
      const cyan = new THREE.Color('#63e0d8')
      const tmp = new THREE.Vector3()
      for (let i = 0, j = 0; i < posAttr.count && j < count; i += step, j++) {
        tmp.fromBufferAttribute(posAttr, i).multiply(holoMesh.scale).add(holoMesh.position)
        pos[j * 3] = tmp.x; pos[j * 3 + 1] = tmp.y; pos[j * 3 + 2] = tmp.z
        const dir = tmp.clone().normalize()
        const sp = 0.9 + Math.random() * 2.2
        vel[j * 3] = (dir.x + (Math.random() - 0.5) * 0.9) * sp
        vel[j * 3 + 1] = (dir.y + (Math.random() - 0.5) * 0.9) * sp
        vel[j * 3 + 2] = (dir.z + (Math.random() - 0.5) * 0.9) * sp
        rnd[j] = Math.random()
        const c = Math.random() < 0.62 ? gold : cyan
        col[j * 3] = c.r; col[j * 3 + 1] = c.g; col[j * 3 + 2] = c.b
      }
      const pg = new THREE.BufferGeometry()
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      pg.setAttribute('aVel', new THREE.BufferAttribute(vel, 3))
      pg.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
      pg.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
      ptsMat = new THREE.ShaderMaterial({
        vertexShader: PTS_VERT,
        fragmentShader: PTS_FRAG,
        uniforms: { uT: { value: 0 }, uSize: { value: 26 * renderer.getPixelRatio() } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      points = new THREE.Points(pg, ptsMat)
      points.visible = false
      scene.add(points)

      camera.position.set(0, radius * 0.3, radius * 4.6)
      camera.lookAt(0, 0, 0)
      setP('solid')
    }).catch(bail)

    /* 渲染循环 + 相位推进 */
    const tick = () => {
      if (disposed) return
      raf = requestAnimationFrame(tick)
      const t = (performance.now() - phaseT0) / 1000
      const now = performance.now() / 1000

      /* 正面固定朝向镜头，只带轻微呼吸摆动 */
      const sway = Math.sin(now * 0.5) * 0.05
      if (solid) solid.rotation.y = FRONT_ANGLE + sway
      if (holoMesh) holoMesh.rotation.y = FRONT_ANGLE + sway
      if (points) points.rotation.y = FRONT_ANGLE + sway

      if (curPhase === 'solid' && solid) {
        // 实体淡入，停留 3s
        solid.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial
            m.transparent = true
            m.opacity = Math.min(1, t / 0.8)
          }
        })
        if (t > 3.0) setP('holo')
      } else if (curPhase === 'holo') {
        if (holoMesh && holoMat) {
          holoMesh.visible = true
          holoMat.uniforms.uTime.value = now
          holoMat.uniforms.uOpacity.value = Math.min(1, t / 0.7)
        }
        if (solid) {
          const op = Math.max(0, 1 - t / 0.6)
          solid.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = op
          })
          if (op <= 0) solid.visible = false
        }
        if (t > 2.4) setP('explode')
      } else if (curPhase === 'explode') {
        if (holoMesh && holoMat) holoMat.uniforms.uOpacity.value = Math.max(0, 1 - t / 0.5)
        if (points && ptsMat) {
          points.visible = true
          ptsMat.uniforms.uT.value = Math.min(1, t / 2.6)
        }
        if (t > 2.9) { setP('done'); finish() }
      }
      renderer.render(scene, camera)
    }
    tick()

    /* 点击跳过 */
    const skip = () => finish()
    host.addEventListener('click', skip)

    /* 兜底定时器：15s 内必然收场 */
    timers.push(window.setTimeout(finish, 15000))

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      host.removeEventListener('click', skip)
      renderer.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry.dispose()
          const mat = m.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose())
        }
      })
      host.removeChild(renderer.domElement)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-[#0a0805] transition-opacity duration-500 ${
        overlayFade ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div ref={hostRef} className="absolute inset-0 cursor-pointer" />

      {/* 顶部题字已移除（用户要求画面无文字遮挡模型） */}

      {/* 底部相位字幕 / 加载进度 */}
      <div className="pointer-events-none absolute bottom-12 left-0 right-0 text-center">
        {phase === 'loading' ? (
          <>
            <p className="mb-3 text-xs tracking-[0.4em] text-[#a08c5f]">全 息 影 像 加 载 中</p>
            <div className="mx-auto h-px w-56 overflow-hidden rounded bg-[#2c2619]">
              <div className="h-full bg-gradient-to-r from-[#c9a05a] to-[#63e0d8] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <p className="text-xs tracking-[0.5em] text-[#c9a05a]" style={{ textShadow: '0 0 16px rgba(201,160,90,0.5)' }}>
            {phase !== 'done' && PHASE_TEXT[phase]}
          </p>
        )}
        <p className="mt-3 text-[10px] tracking-[0.3em] text-[#4a4232]">点 击 任 意 处 跳 过</p>
      </div>

      {/* 四角科技感框线 */}
      {[
        'top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r',
        'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r',
      ].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-10 w-10 border-[#c9a05a]/40 ${c}`} />
      ))}
    </div>
  )
}
