import { sites } from '@/data/sites'

const order = ['北魏', '唐', '辽', '北宋', '元', '明', '清']
const dynastyColor: Record<string, string> = {
  北魏: '#8a9a5b',
  唐: '#c9a05a',
  辽: '#c05a3a',
  北宋: '#7d9bb3',
  元: '#9a7ab0',
  明: '#b0483f',
  清: '#5f8a7d',
}

export default function TimelineSection() {
  const items = order
    .map((d) => ({ dynasty: d, sites: sites.filter((s) => s.dynasty === d) }))
    .filter((g) => g.sites.length > 0)

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs tracking-[0.4em] text-[#a08c5f]">TIMELINE</p>
        <h2 className="text-3xl font-bold text-[#ece5d8] sm:text-4xl">一条跨越 1500 年的中轴线</h2>
        <p className="mt-3 text-sm text-[#8f8672]">从北魏的石窟到明代的悬塑，山西保存了半部中国建筑史</p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#4a3f2a] to-transparent sm:left-1/2" />
        <div className="space-y-10">
          {items.map((g, gi) => (
            <div
              key={g.dynasty}
              className={`relative flex flex-col gap-3 pl-12 sm:w-1/2 sm:pl-0 ${
                gi % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:ml-auto sm:pl-12'
              }`}
            >
              <span
                className={`absolute top-1 h-3 w-3 rounded-full border-2 border-[#14100a] left-[11px] ${
                  gi % 2 === 0 ? 'sm:-right-1.5 sm:left-auto' : 'sm:-left-1.5'
                }`}
                style={{ background: dynastyColor[g.dynasty] }}
              />
              <div
                className="inline-block text-xs font-bold tracking-[0.3em]"
                style={{ color: dynastyColor[g.dynasty] }}
              >
                {g.dynasty}
              </div>
              {g.sites.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-[#2c2619] bg-[#17130d] p-4 transition hover:border-[#4a3f2a]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-[#ece5d8]">{s.name}</span>
                    <span className="shrink-0 text-[11px] text-[#6b6350]">{s.year}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#8f8672]">{s.alias} · {s.location}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
