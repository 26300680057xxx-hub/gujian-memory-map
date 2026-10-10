# 华流古建 · 记忆地图 —— GPT 交接说明

> 这份文档是给 ChatGPT（或其他 AI）看的项目说明书。
> 把这个 zip 上传给 GPT 后，对它说：「请先阅读 GPT交接说明.md，然后帮我修改 XXX」即可。

## 项目是什么

携程首届高校 AI HACKATHON 参赛作品（队名 502.5，赛道：目的地出圈计划）。
一个以山西古建筑为主题的互动网站：古风手绘山西地图上散布 15 个"记忆点"（应县木塔、云冈石窟、悬空寺、五台山佛光寺、隰县小西天、晋祠、乔家大院、雁门关、娘子关、壶口瀑布、双林寺、皇城相府、关帝庙、永乐宫、北岳恒山），点击后建筑抠图从地图上凸起，弹出"记忆档案"弹窗，每个记忆点有专属的开场动画（如小西天有黑神话悟空彩蛋、五台山有梁思成林徽因测绘背影、云冈石窟有烽火特效等）。另有 AI 短剧分镜、时间线等版块。

## 技术栈

- Vite + React 18 + TypeScript
- Tailwind CSS 3 + shadcn/ui（`src/components/ui/` 是 shadcn 生成的组件，一般不要动）
- 路径别名：`@/` = `src/`
- 无后端、无路由库（单页应用），全部是静态资源

## 如何运行

```bash
npm install        # 首次或依赖变化后
npm run dev        # 开发预览，默认 http://localhost:5173
npm run build      # 构建到 dist/，可用于验证代码有没有语法/类型错误
```

## 关键文件地图（改需求时先看这里）

| 需求 | 改哪个文件 |
|---|---|
| 增删/修改记忆点的文案、年代、独白、短剧分镜、档案数据 | `src/data/sites.ts`（Site 类型定义也在里面） |
| 点击记忆点后的弹窗、15 种出场动画逻辑 | `src/components/SiteDialog.tsx` |
| 全部 CSS 动画 keyframes（building-rise、reveal-glow-in、stilt-grow、flag-wave、ripple-spread、water-scroll 等） | `src/index.css` |
| 古风手绘地图本体、记忆点气泡定位、壶口水流动效 | `src/components/PaintingMap.tsx` |
| 首页整体结构 | `src/pages/Home.tsx` + `src/sections/*.tsx` |
| 应县木塔全屏"营造"开场动画 | `src/components/PagodaShowcase.tsx` |
| 全局配色 / 字体 | `tailwind.config.js`、`src/index.css` |

## 设计规范（改动时请保持风格统一）

- 整体是「宣纸 + 墨色 + 朱砂」的古风暗色系：
  - 背景深棕黑 `#17130d` / `#0d0b07`，纸色文字 `#ece5d8` / `#e3d9c4`
  - 朱砂红 `#c03a2a` / `#a53428`（印章、强调），金色 `#c9a05a` / `#d9a84e`（光晕、点缀）
  - 辅助灰 `#8f8672`、边框 `#2c2619`
- 标题/书法用 `font-kai`（楷体类），正文用默认 sans
- 动画命名语义化，全部 keyframes 集中在 `src/index.css`
- 弹窗出场动画由 `SiteDialog.tsx` 里的 `REVEAL_KIND` 字典按 site.id 分发

## 图片素材说明

- `src/assets/` 里：
  - `shanxi-map.jpg` 是底图（合成好的最终版）
  - `pop-*.png` 是地图上凸起的建筑抠图（透明底）
  - `reveal-*.png` 是弹窗出场动画用的大图抠图（透明底），包括 `reveal-wukong.png`（黑神话悟空剪影）、`reveal-surveyors.png`（梁林背影，宣纸暖金色）
- 所有素材均已抠好图、去好水印，直接引用即可，不要替换来源

## 注意事项

- 项目里没有 `node_modules`（约几百 MB，本地 `npm install` 自动生成）和 `dist/`（构建产物）
- 改完代码请确保 `npm run build` 能通过
- 地图记忆点的位置是在 `PaintingMap.tsx` 里用百分比坐标定的，调整时注意别让相邻点互相遮挡
- 对话用中文，文案保持现有文风（有文化感、克制、不堆砌辞藻）
