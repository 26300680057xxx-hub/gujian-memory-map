/** 全局古风点击音效（木鱼 + 笔锋，轻量单例） */
let clickAudio: HTMLAudioElement | null = null

export function playClick() {
  try {
    if (!clickAudio) {
      clickAudio = new Audio(`${import.meta.env.BASE_URL}audio/click.mp3`)
      clickAudio.volume = 0.45
    }
    clickAudio.currentTime = 0
    void clickAudio.play().catch(() => {})
  } catch {
    /* 浏览器未允许发声时静默 */
  }
}
