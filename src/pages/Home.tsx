import { useState } from 'react'
import Hero from '@/sections/Hero'
import MapSection from '@/sections/MapSection'
import DramaSection from '@/sections/DramaSection'
import TimelineSection from '@/sections/TimelineSection'
import Footer from '@/sections/Footer'
import SiteDialog from '@/components/SiteDialog'
import PagodaShowcase from '@/components/PagodaShowcase'
import BgmPlayer from '@/components/BgmPlayer'
import { sites, type Site } from '@/data/sites'

export default function Home() {
  const [selected, setSelected] = useState<Site>(sites[0])
  const [opened, setOpened] = useState<Site | null>(null)
  // 支持 ?showcase=1 直接打开木塔「营造」全屏动画（便于调试与录屏）
  const [showcase, setShowcase] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('showcase') === '1',
  )

  const handleSelect = (s: Site) => {
    setSelected(s)
    // 应县木塔：点击后先全屏上演「木塔搭建」小动画
    if (s.id === 'yingxian') setShowcase(true)
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <MapSection
        selected={selected}
        onSelect={handleSelect}
        onOpen={(s) => {
          setSelected(s)
          // 应县木塔：红色按钮同样先走全屏「营造」开场
          if (s.id === 'yingxian') setShowcase(true)
          else setOpened(s)
        }}
      />
      <DramaSection />
      <TimelineSection />
      <Footer />
      {showcase && (
        <PagodaShowcase
          onDone={() => {
            setShowcase(false)
            setOpened(sites[0])
          }}
        />
      )}
      <SiteDialog site={opened} onClose={() => setOpened(null)} />
      <BgmPlayer />
    </main>
  )
}
