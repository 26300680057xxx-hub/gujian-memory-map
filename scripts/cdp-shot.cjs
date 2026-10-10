/* 验证新特效：小西天黑神话 / 五台山梁林剪影可见性 / 悬空寺木柱 / 晋祠涟漪 / 雁门关战旗 */
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
  await sleep(4500)
  const shot = async (p) => {
    const r = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(p, Buffer.from(r.data, 'base64'))
    console.log('saved', p)
  }
  const click = async (name) =>
    (await send('Runtime.evaluate', {
      expression: `(() => { const b = document.querySelector('button[aria-label="${name}"]'); if (b) { b.scrollIntoView({block:'center'}); b.click(); return true } return false })()`,
      returnByValue: true,
    })).result.value
  const close = async () =>
    (await send('Runtime.evaluate', {
      expression: `(() => { const d = document.querySelector('[role="dialog"]'); if (d) { d.parentElement.click(); return true } return false })()`,
      returnByValue: true,
    })).result.value

  await click('隰县小西天'); await sleep(2200); await shot('reference/fx-xiaoxitian.png'); await sleep(1600); await close()
  await sleep(700)
  await click('五台山寺庙群'); await sleep(1900); await shot('reference/fx-wutaishan.png'); await sleep(1900); await close()
  await sleep(700)
  await click('悬空寺'); await sleep(1600); await shot('reference/fx-xuankong.png'); await sleep(1600); await close()
  await sleep(700)
  await click('晋祠'); await sleep(1600); await shot('reference/fx-jinci.png'); await sleep(1400); await close()
  await sleep(700)
  await click('雁门关'); await sleep(1500); await shot('reference/fx-yanmenguan.png')

  ws.close()
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
