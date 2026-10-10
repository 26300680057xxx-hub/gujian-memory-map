# 华流古建 · 记忆地图

> 携程首届高校 AI HACKATHON ·「目的地出圈计划」赛道参赛作品（502.5 队）
> 用技术让"华流"成为世界"顶流"——一款能"看见"山西古建筑的互动记忆地图。

## 在线访问

本仓库开启 GitHub Pages 后，访问地址为：

```
https://26300680057xxx-hub.github.io/gujian-memory-map/
```

每次推送到 `main` 分支，GitHub Actions 会自动重新构建并发布，无需手动操作。

## 这是什么

一个以山西古建筑为主题的古风互动网站：

- **古画立体记忆地图**：手绘山西古画地图，15 个记忆点（应县木塔、云冈石窟、悬空寺、佛光寺、隰县小西天、晋祠、乔家大院、雁门关、娘子关、壶口瀑布、双林寺、皇城相府、解州关帝庙、永乐宫、北岳恒山、五台山）以立体抠图嵌入画卷，点击即可"翻开记忆"
- **古刹全息入场**：滚动到记忆地图时，3D 古刹地图模型依次呈现 实体 → 金色全息扫描 → 9 万颗粒子爆炸散开（Three.js）
- **每个建筑都有自己的出场动画**：小西天×黑神话悟空彩蛋、佛光寺×梁思成林徽因测绘剪影、云冈大佛×烽火挺立、乔家大院×穿越牌坊运镜、悬空寺×木柱生长、晋祠×难老泉涟漪……
- **AI 双语音讲解**：每个记忆点配普通话 + 太原话（方言文本）两版 AI 语音独白，全局古风点击音效
- **AI 短剧分镜**：每个记忆点附四幕短剧脚本（史料 RAG → 文生视频管线的演示）

## 技术栈

Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Three.js（纯前端单页应用，无后端）

## 如何参与修改

```bash
# 1. 克隆仓库
git clone https://github.com/26300680057xxx-hub/gujian-memory-map.git
cd gujian-memory-map

# 2. 安装依赖（Node 18+ / 20+）
npm install

# 3. 本地开发预览
npm run dev        # 默认 http://localhost:3000

# 4. 构建验证（提交前请确保通过）
npm run build

# 5. 提交推送，Pages 会自动重新发布
git add -A && git commit -m "你的修改说明" && git push
```

### 改需求该动哪里

| 需求 | 文件 |
|---|---|
| 记忆点文案 / 独白 / 短剧 / 档案数据 | `src/data/sites.ts` |
| 弹窗与 10 余种出场动画逻辑 | `src/components/SiteDialog.tsx` |
| 全部 CSS 动画 keyframes | `src/index.css` |
| 古画地图与光点定位、壶口水流 | `src/components/PaintingMap.tsx` |
| 3D 全息入场（实体→全息→粒子） | `src/components/TempleReveal.tsx` |
| 应县木塔全屏「营造」动画 | `src/components/PagodaShowcase.tsx` |
| 音效与语音播放 | `src/lib/sound.ts`、`src/components/SiteDialog.tsx` |

更详细的交接说明见仓库根目录《GPT交接说明.md》。

### 设计规范（改动请保持一致）

- 宣纸 + 墨色 + 朱砂的暗色古风：背景 `#17130d`，文字 `#ece5d8`，朱砂 `#c03a2a`，金色 `#c9a05a`
- 标题书法体 `font-kai`，文案用中文，文风克制有文化感

## 素材说明

- `public/models/`：古刹地图 3D 模型（.glb，全息入场用）
- `public/audio/`：AI 生成的点击音效与 32 条讲解语音
- `src/assets/`：底图与各建筑抠图（均已去水印处理）

> 语音讲解的"太原话版"为方言文本 + 普通话音色合成，真人方言配音是下一步计划。
