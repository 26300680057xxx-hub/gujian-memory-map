import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { useTranslation } from '@/lib/language'
import { publicAsset } from '@/lib/assets'

type Phase = 'loading' | 'assemble' | 'solid' | 'holo' | 'crystallize' | 'explode' | 'done'
const CAPTIONS: Record<Phase, string> = {
  loading: '全 息 影 像 加 载 中',
  assemble: '粒 子 · 凝 聚 千 年 记 忆',
  solid: '实 体 · 千 年 古 刹',
  holo: '全 息 扫 描 中 · · ·',
  crystallize: '记 忆 · 重 构 千 年 古 刹',
  explode: '记 忆 · 化 作 漫 天 星 辰',
  done: '',
}

const SURFACE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = world.xyz;
    vView = normalize(cameraPosition - world.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`
const HOLO_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uScan;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.55);
    float beam = exp(-pow((vWorld.y - uScan) / 0.042, 2.0));
    float lines = pow(0.5 + 0.5 * sin(vWorld.y * 185.0), 8.0);
    float facets = 0.5 + 0.5 * abs(dot(normalize(vNormal), normalize(vec3(0.4, 0.8, 0.7))));
    vec3 cyan = vec3(0.22, 0.64, 0.58);
    vec3 gold = vec3(1.0, 0.76, 0.35);
    vec3 color = mix(cyan, gold, rim * 0.88);
    color *= 0.65 + facets * 0.32 + lines * 0.18;
    color += mix(cyan, gold, 0.55) * beam * 1.4;
    float alpha = (0.25 + rim * 0.62 + beam * 0.28) * uOpacity;
    gl_FragColor = vec4(color, min(0.97, alpha));
  }
`
const TERRAIN_FRAG = /* glsl */ `
  uniform sampler2D uMask;
  uniform float uOpacity;
  uniform float uHolo;
  uniform float uScan;
  varying vec2 vUv;
  varying vec3 vWorld;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  void main() {
    if (texture2D(uMask, vUv).r < 0.5) discard;
    float n=noise(vUv*30.0)*0.62+noise(vUv*95.0)*0.25+noise(vUv*240.0)*0.13;
    vec3 earth=mix(vec3(0.23,0.18,0.09),vec3(0.53,0.40,0.20),n);
    float beam=exp(-pow((vWorld.y-uScan)/0.045,2.0));
    float contour=pow(0.5+0.5*sin(n*38.0+vUv.y*28.0),14.0);
    vec3 hologram=vec3(0.08,0.24,0.21)+vec3(0.16,0.36,0.29)*contour+vec3(0.58,0.66,0.32)*beam;
    gl_FragColor=vec4(mix(earth,hologram,uHolo),uOpacity);
  }
`
const PARTICLE_VERT = /* glsl */ `
  attribute vec3 aOrigin;
  attribute vec3 aVelocity;
  attribute vec3 aColor;
  attribute float aRandom;
  uniform float uTime;
  uniform float uAssembly;
  uniform float uBurst;
  uniform float uOpacity;
  uniform float uSize;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float gather=smoothstep(0.0,1.0,uAssembly);
    vec3 p=mix(aOrigin,position,gather);
    float swirl=(1.0-gather)*uTime*0.55 + uBurst*(1.0-uBurst)*1.5;
    mat2 rotation=mat2(cos(swirl),-sin(swirl),sin(swirl),cos(swirl));
    p.xz=rotation*p.xz;
    float burst=pow(uBurst,0.9);
    p+=aVelocity*burst;
    p.y+=uBurst*uBurst*(0.25+aRandom*0.85);
    vec4 mv=modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mv;
    float shimmer=0.84+0.16*sin(uTime*3.0+aRandom*47.0);
    gl_PointSize=clamp(uSize*(0.65+aRandom*0.8),1.0,4.5);
    vColor=aColor;
    vAlpha=uOpacity*shimmer*(1.0-smoothstep(0.55,1.0,uBurst));
  }
`
const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 q=gl_PointCoord-0.5;
    float d=length(q);
    if(d>0.5) discard;
    float glow=exp(-d*d*18.0);
    gl_FragColor=vec4(vColor*(1.0+glow*0.6),glow*vAlpha);
  }
`

interface Props { onDone: () => void }
let cachedModel: Promise<GLTF> | undefined

function loadModel(onProgress: (event: ProgressEvent) => void) {
  if (!cachedModel) {
    cachedModel = new GLTFLoader().loadAsync(publicAsset('models/temple.glb'), onProgress)
      .catch((error: unknown) => { cachedModel = undefined; throw error })
  }
  return cachedModel
}

export default function TempleReveal({ onDone }: Props) {
  const { t } = useTranslation()
  const hostRef = useRef<HTMLDivElement>(null)
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])
  const finishRef = useRef<() => void>(() => {})
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false, finishing = false, raf = 0
    const timers: number[] = []
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    const geometry = <T extends THREE.BufferGeometry>(value: T) => { geometries.add(value); return value }
    const material = <T extends THREE.Material>(value: T) => { materials.add(value); return value }
    const finish = () => {
      if (disposed || finishing) return
      finishing = true
      setFading(true)
      timers.push(window.setTimeout(() => onDoneRef.current(), 550))
    }
    finishRef.current = finish
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      const fallback = window.setTimeout(() => onDoneRef.current(), 0)
      return () => clearTimeout(fallback)
    }
    const mobile = matchMedia('(max-width: 640px)').matches
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const stage = new THREE.Group()
    scene.add(stage)
    const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, 0.1, 100)
    camera.position.set(0, 0, 8)
    camera.lookAt(0, 0, 0)
    const resize = () => {
      const width = host.clientWidth || 1, height = host.clientHeight || 1
      const aspect = width / height
      const halfHeight = Math.max(1.93, 1.906 / (aspect * 1.56))
      camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect
      camera.top = halfHeight; camera.bottom = -halfHeight
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    resize()
    window.addEventListener('resize', resize)
    const key = new THREE.DirectionalLight(0xffe7c0, 2.4); key.position.set(-2, 3, 5)
    const fill = new THREE.DirectionalLight(0xcce9e1, 0.8); fill.position.set(3, 0, 3)
    scene.add(key, fill, new THREE.AmbientLight(0xc5b58d, 1.55))

    // Sparse stars fill the stage without competing with the architecture.
    const starPositions = new Float32Array((mobile ? 130 : 280) * 3)
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 11
      starPositions[i + 1] = (Math.random() - 0.5) * 6
      starPositions[i + 2] = -2 - Math.random() * 3
    }
    const starsGeometry = geometry(new THREE.BufferGeometry())
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(starsGeometry, material(new THREE.PointsMaterial({ color: '#c9a05a', size: 0.014, transparent: true, opacity: 0.38, depthWrite: false })))
    scene.add(stars)
    const orbits = new THREE.Group(); orbits.position.z = -1.4
    scene.add(orbits)
    for (let index = 0; index < 3; index++) {
      const radius = 1.56 + index * 0.21
      const vertices: THREE.Vector3[] = []
      for (let step = 0; step <= 180; step++) {
        const angle = step / 180 * Math.PI * 2
        vertices.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
      }
      const circle = new THREE.Line(geometry(new THREE.BufferGeometry().setFromPoints(vertices)), material(new THREE.LineBasicMaterial({ color: index === 1 ? '#5da79d' : '#c9a05a', transparent: true, opacity: index === 1 ? 0.13 : 0.21 })))
      circle.rotation.z = index * 0.9
      orbits.add(circle)
    }

    const holoUniforms = { uTime: { value: 0 }, uScan: { value: -1.45 }, uOpacity: { value: 0 } }
    const hologramMaterial = material(new THREE.ShaderMaterial({
      vertexShader: SURFACE_VERT, fragmentShader: HOLO_FRAG, uniforms: holoUniforms,
      transparent: true, depthWrite: true, side: THREE.DoubleSide,
    }))
    const particleUniforms = {
      uTime: { value: 0 }, uAssembly: { value: 0 }, uBurst: { value: 0 },
      uOpacity: { value: 0 }, uSize: { value: (mobile ? 2.0 : 2.55) * renderer.getPixelRatio() },
    }
    const particleMaterial = material(new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG, uniforms: particleUniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    const solid = new THREE.Group(), hologram = new THREE.Group()
    stage.add(solid, hologram)
    hologram.visible = false
    const solidMaterials: THREE.MeshStandardMaterial[] = []
    let particles: THREE.Points | null = null
    let terrain: THREE.Mesh | null = null
    const terrainUniforms = { uMask: { value: new THREE.Texture() }, uOpacity: { value: 0 }, uHolo: { value: 0 }, uScan: holoUniforms.uScan }
    const scanRing = new THREE.Mesh(geometry(new THREE.TorusGeometry(1.15, 0.007, 6, 120)), material(new THREE.MeshBasicMaterial({ color: '#ead7a0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })))
    scanRing.rotation.x = Math.PI / 2
    stage.add(scanRing)
    const ringMaterial = scanRing.material as THREE.MeshBasicMaterial
    let phaseStart = performance.now(), currentPhase: Phase = 'loading'
    const setPhaseNow = (next: Phase) => { currentPhase = next; phaseStart = performance.now(); setPhase(next); host.dataset.phase = next }
    const opacity = (value: number) => solidMaterials.forEach((surface) => { surface.opacity = value })
    const started = performance.now()
    const report = (event: ProgressEvent) => {
      if (disposed) return
      const total = event.total || 13978232
      setProgress(Math.min(98, Math.round(event.loaded / total * 100)))
    }

    Promise.all([
      loadModel(report),
      new THREE.TextureLoader().loadAsync(publicAsset('models/terrain-mask.png')),
    ]).then(([gltf, mask]) => {
      if (disposed || finishing) { mask.dispose(); return }
      textures.add(mask)
      mask.minFilter = THREE.LinearFilter; mask.magFilter = THREE.LinearFilter
      terrainUniforms.uMask.value.dispose()
      terrainUniforms.uMask.value = mask

      // Preserve every mesh and all nested transforms, centred before scaling.
      const model = gltf.scene.clone(true)
      const box = new THREE.Box3().setFromObject(model)
      const scale = 2.65 / box.getSize(new THREE.Vector3()).y
      const modelRoot = new THREE.Group()
      model.position.sub(box.getCenter(new THREE.Vector3()))
      modelRoot.add(model); modelRoot.scale.setScalar(scale); modelRoot.rotation.y = -Math.PI / 2
      modelRoot.updateMatrixWorld(true)
      const surfaces: { sampler: MeshSurfaceSampler; area: number }[] = []
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        const baked = geometry(object.geometry.clone().applyMatrix4(object.matrixWorld))
        const originals = Array.isArray(object.material) ? object.material : [object.material]
        const copies = originals.map((original) => {
          const copy = material(original.clone() as THREE.MeshStandardMaterial)
          copy.transparent = true; copy.opacity = 0; copy.metalness = 0.03; copy.roughness = 0.91
          solidMaterials.push(copy)
          return copy
        })
        solid.add(new THREE.Mesh(baked, Array.isArray(object.material) ? copies : copies[0]))
        hologram.add(new THREE.Mesh(baked, hologramMaterial))
        const sampler = new MeshSurfaceSampler(new THREE.Mesh(baked)).build()
        const distribution = sampler.distribution
        if (distribution) surfaces.push({ sampler, area: distribution[distribution.length - 1] })
      })

      // The mask follows the original silhouette and fills enclosed terrain holes.
      terrain = new THREE.Mesh(geometry(new THREE.PlaneGeometry(1.90632216, 2.65, 1, 1)), material(new THREE.ShaderMaterial({
        vertexShader: SURFACE_VERT, fragmentShader: TERRAIN_FRAG, uniforms: terrainUniforms,
        transparent: true, depthWrite: true,
      })))
      terrain.position.z = -1.02
      stage.add(terrain)

      // Sample triangle surfaces by area, rather than every nth vertex; this
      // avoids sparse patches and uneven bright clusters in the particle model.
      const count = mobile ? 30000 : 56000
      const positions = new Float32Array(count * 3), origins = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3), colors = new Float32Array(count * 3), random = new Float32Array(count)
      const area = surfaces.reduce((total, surface) => total + surface.area, 0)
      const sample = new THREE.Vector3(), color = new THREE.Color()
      for (let index = 0; index < count; index++) {
        let selection = Math.random() * area
        const surface = surfaces.find((item) => { selection -= item.area; return selection <= 0 }) ?? surfaces[0]
        surface.sampler.sample(sample)
        sample.toArray(positions, index * 3)
        const seed = Math.random(), angle = Math.random() * Math.PI * 2
        const radius = 2.2 + Math.random() * 1.75
        origins[index * 3] = Math.cos(angle) * radius
        origins[index * 3 + 1] = (Math.random() - 0.5) * 5.6
        origins[index * 3 + 2] = Math.sin(angle) * radius * 0.75
        const direction = sample.clone().normalize()
        velocities[index * 3] = direction.x * (1.8 + seed * 2.4) + Math.cos(angle) * 0.65
        velocities[index * 3 + 1] = direction.y * (1.2 + seed * 1.5)
        velocities[index * 3 + 2] = direction.z * (1.4 + seed * 1.6) + Math.sin(angle) * 0.8
        color.set(seed < 0.79 ? '#eac181' : '#77cfc1').multiplyScalar(0.88 + Math.random() * 0.35)
        color.toArray(colors, index * 3); random[index] = seed
      }
      const pointsGeometry = geometry(new THREE.BufferGeometry())
      pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      pointsGeometry.setAttribute('aOrigin', new THREE.BufferAttribute(origins, 3))
      pointsGeometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))
      pointsGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
      pointsGeometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 1))
      particles = new THREE.Points(pointsGeometry, particleMaterial)
      particles.frustumCulled = false
      stage.add(particles)
      setProgress(100)
      setPhaseNow(reducedMotion ? 'solid' : 'assemble')
    }).catch(finish)

    const tick = () => {
      if (disposed) return
      raf = requestAnimationFrame(tick)
      const elapsed = (performance.now() - phaseStart) / 1000
      const time = (performance.now() - started) / 1000
      particleUniforms.uTime.value = time
      holoUniforms.uTime.value = time
      stage.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.32) * 0.022
      orbits.rotation.z = reducedMotion ? 0 : time * 0.018
      stars.rotation.z = reducedMotion ? 0 : time * 0.003
      if (currentPhase === 'assemble') {
        particleUniforms.uAssembly.value = Math.min(1, elapsed / 1.7)
        particleUniforms.uOpacity.value = Math.min(0.72, elapsed * 1.2)
        if (elapsed > 1.75) setPhaseNow('solid')
      } else if (currentPhase === 'solid') {
        opacity(Math.min(1, elapsed / 0.75))
        terrainUniforms.uOpacity.value = Math.min(1, elapsed / 0.75)
        particleUniforms.uOpacity.value = Math.max(0, 0.72 - elapsed * 0.95)
        if (reducedMotion) { if (elapsed > 2) finish() }
        else if (elapsed > 1.6) setPhaseNow('holo')
      } else if (currentPhase === 'holo') {
        hologram.visible = true
        const blend = Math.min(1, elapsed / 0.7)
        opacity(1 - blend)
        solid.visible = blend < 1
        holoUniforms.uOpacity.value = blend
        holoUniforms.uScan.value = -1.45 + Math.min(1, elapsed / 2.7) * 2.9
        terrainUniforms.uHolo.value = blend
        ringMaterial.opacity = Math.sin(Math.min(1, elapsed / 2.8) * Math.PI) * 0.45
        scanRing.position.y = holoUniforms.uScan.value
        particleUniforms.uOpacity.value = 0.035
        if (elapsed > 2.8) setPhaseNow('crystallize')
      } else if (currentPhase === 'crystallize') {
        ringMaterial.opacity = Math.max(0, 0.3 - elapsed)
        particleUniforms.uOpacity.value = Math.min(0.78, elapsed * 0.75)
        holoUniforms.uOpacity.value = Math.max(0, 1 - elapsed / 1.15)
        terrainUniforms.uOpacity.value = Math.max(0, 1 - elapsed / 1.15)
        if (elapsed > 1.2) { hologram.visible = false; if (terrain) terrain.visible = false; setPhaseNow('explode') }
      } else if (currentPhase === 'explode') {
        particleUniforms.uBurst.value = Math.min(1, elapsed / 3.2)
        if (elapsed > 3.35) { setPhaseNow('done'); finish() }
      }
      renderer.render(scene, camera)
    }
    tick()
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') finish() }
    window.addEventListener('keydown', escape)
    const contextLost = (event: Event) => { event.preventDefault(); finish() }
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    timers.push(window.setTimeout(finish, 22000))
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', escape)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      geometries.forEach((value) => value.dispose())
      materials.forEach((value) => value.dispose())
      textures.forEach((value) => value.dispose())
      terrainUniforms.uMask.value.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[70] overflow-hidden bg-[#080a09] transition-opacity duration-500 ${fading ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="dialog" aria-label={t('全息入场')}
      data-testid="temple-reveal" data-phase={phase}
      onClick={() => finishRef.current()}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 47%, rgba(67,59,35,0.3), transparent 61%), radial-gradient(ellipse at 50% 52%, rgba(50,109,96,0.09), transparent 70%)' }} />
      <div ref={hostRef} className="absolute inset-0 cursor-pointer" />
      <div className="pointer-events-none absolute bottom-10 left-5 right-5 text-center sm:bottom-12">
        <p className="text-xs tracking-[0.3em] text-[#e1c48b]" style={{ textShadow: '0 0 14px rgba(201,160,90,0.32)' }}>{t(CAPTIONS[phase])}</p>
        {phase === 'loading' && (
          <div className="mx-auto mt-4 h-px w-48 overflow-hidden bg-[#2c3026]">
            <div className="h-full bg-gradient-to-r from-[#c9a05a] to-[#77cfc1] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <p className="mt-3 text-[10px] tracking-[0.2em] text-[#857a61]">{t('点 击 任 意 处 跳 过')}</p>
      </div>
      {['top-6 left-6 border-t border-l','top-6 right-6 border-t border-r','bottom-6 left-6 border-b border-l','bottom-6 right-6 border-b border-r'].map((corner) => (
        <span key={corner} className={`pointer-events-none absolute h-8 w-8 border-[#c9a05a]/35 ${corner}`} />
      ))}
    </div>
  )
}
