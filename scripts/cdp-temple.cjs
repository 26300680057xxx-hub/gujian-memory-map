/* 验证寺庙全息入场：滚到记忆地图 → 实体 → 全息 → 粒子爆炸，连拍 6 张 */
const fs = require('fs')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const res = await fetch('http://localhost:9223/json/new?about:blank', { method: 'PUT' })
  const tab = await res.json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  const send = (m, pa = {}) =>
    new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: pa })) })
  ws.onmessage = (ev) => {
    const g = JSON.parse(ev.data)
    if (g.id && pending.has(g.id)) { pending.get(g.id)(g.result); pending.delete(g.id) }
  }
  await new Promise((r) => (ws.onopen = r))
  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: 'http://localhost:5177/' })
  await sleep(4000)
  const shot = async (p) => {
    const r = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(p, Buffer.from(r.data, 'base64'))
    console.log('saved', p)
  }
  // 滚动到记忆地图触发入场秀
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#map').scrollIntoView({block:'start'})`,
  })
  const times = [2500, 5000, 7000, 8000, 9500, 11000]
  let prev = 0
  for (let i = 0; i < times.length; i++) {
    await sleep(times[i] - prev)
    prev = times[i]
    await shot(`reference/fx-temple-${i + 1}.png`)
  }
  ws.close()
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
