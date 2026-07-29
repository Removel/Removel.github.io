# 图片加载优化设计

## 背景

博客需要继续保存并提供高清原图，优化目标不是删除原图或降低下载质量，而是把“页面预览”和“查看原图”拆成两个加载阶段。

当前实现存在以下问题：

- 首页配置了 13 张桌面壁纸和 13 张移动壁纸，两组文件目前内容相同。
- 全屏壁纸组件会为两组图片直接创建全部 `<img>`。CSS 隐藏和 `loading="lazy"` 不能可靠阻止这些位于视口内的绝对定位图片下载。
- 横幅和全屏壁纸组件始终同时渲染，隐藏其中一套只改变视觉状态，不代表未启用的资源没有被浏览器加载。
- 本地相册瀑布流直接使用高清原图作为 `<img src>`。Fancybox 也引用同一原图，导致页面预览阶段就下载全部高清照片。
- 相册图片没有预先提供宽高，浏览器在图片下载前无法稳定计算瀑布流高度，也会削弱原生懒加载的判断效果。
- 通用图片组件使用过宽的 `import.meta.glob`。当前 `gh-pages` 产物中，同一相册原图同时出现在 `/images/albums/` 和 `/_astro/`，需要在实施阶段缩小 glob 范围并验证产物去重。

线上基线数据：

| 场景 | 传输量 | `load` 时间 |
| --- | ---: | ---: |
| 手机首页 | 约 68 MB | 约 3.9 秒 |
| 桌面首页 | 约 132 MB | 约 8 秒 |
| `bw2026` 相册 | 约 430 MB | 约 20 秒 |

## 目标

- 所有高清原图继续保存在现有路径，不改变原图内容。
- 对桌面和移动目录中内容完全相同的重复文件，仅在校验哈希一致后保留一份规范源图；不会删除任何唯一图片内容。
- 用户点击照片后，Fancybox 加载并展示对应高清原图。
- 页面列表、相册瀑布流、壁纸和横幅使用适配屏幕的 WebP 预览图。
- 壁纸轮播任意时刻最多维护当前图和下一张图，不一次创建全部轮播图片。
- 当前壁纸模式只加载对应组件；用户切换模式后再初始化另一套资源。
- 图片生成流程可重复执行，只重新处理新增或变化的源图。
- 单张图片处理失败不阻塞全部构建，并自动回退到原图。

## 非目标

- 不删除或覆盖高清原图。
- 不删除任何唯一图片；允许清理经过哈希校验的字节级重复副本。
- 不引入付费图片 CDN、对象存储或新的后端服务。
- 不改变相册现有目录和 `info.json` 的基本使用方式。
- 不在本次工作中重构博客的导航、音乐播放器、文章目录或整体视觉设计。
- 不修改第三方外链图片本身；外链相册优先使用已经配置的 `thumbnail`。

## 总体方案

采用“源图 + 生成预览图 + 运行时按需加载”的三层结构：

```text
高清源图
  ├─ 壁纸：public/assets/desktop-banner、public/assets/mobile-banner
  └─ 相册：public/images/albums
          ↓ sharp 构建脚本
可重建的 WebP 预览图和 manifest
          ↓ 页面首次展示
当前壁纸 / 相册预览图
          ↓ 用户点击照片
原始高清图片
```

源图是唯一真实数据。预览图和 manifest 都是构建产物，可以随时删除并重新生成。

## 预览图生成

### 输出位置

生成资产放在：

```text
public/generated/image-previews/
  manifest.json
  wallpapers/
  albums/
```

目录结构保留源图片的相对路径，并在文件名中增加宽度：

```text
public/generated/image-previews/albums/bw2026/DSC03207-480.webp
public/generated/image-previews/albums/bw2026/DSC03207-960.webp
public/generated/image-previews/albums/bw2026/DSC03207-1920.webp
```

### 规格

统一生成以下 WebP 版本：

| 用途 | 宽度 | 质量 |
| --- | ---: | ---: |
| 手机缩略图 | 480 px | 78 |
| 常规预览 | 960 px | 82 |
| 桌面壁纸/大预览 | 1920 px | 84 |

处理规则：

- 保持原始宽高比，不放大尺寸小于目标宽度的图片。
- 自动根据 EXIF 方向旋转。
- 移除不影响显示的元数据，源文件不变。
- 支持当前扫描器已经接受的常见位图格式；SVG 和 GIF 不转换，直接回退源文件。
- manifest 记录原图路径、原始宽高、预览路径、源文件大小和修改时间。

manifest 示例：

```json
{
  "/images/albums/bw2026/DSC03207.jpg": {
    "width": 4000,
    "height": 6000,
    "previews": {
      "480": "/generated/image-previews/albums/bw2026/DSC03207-480.webp",
      "960": "/generated/image-previews/albums/bw2026/DSC03207-960.webp",
      "1920": "/generated/image-previews/albums/bw2026/DSC03207-1920.webp"
    }
  }
}
```

### 增量策略

脚本通过源文件相对路径、文件大小和 `mtime` 判断是否需要重新生成。满足以下任一条件时重建：

- 源图是新增文件。
- 源图大小或修改时间变化。
- 所需预览尺寸缺失。
- 生成配置版本变化。

源图被删除后，脚本清理对应的预览图和 manifest 记录。生成目录提交到 Git，使 GitHub Pages 不需要在部署时重复处理全部照片；同时脚本保持幂等，作者也可以在本地通过一条命令刷新预览图。

## 相册数据流

### 本地相册

`album-scanner` 扫描原图时读取 manifest，并为每张照片返回：

```ts
interface Photo {
  src: string;
  thumbnail?: string;
  srcset?: string;
  width?: number;
  height?: number;
}
```

字段含义：

- `src`：高清原图，供 Fancybox 和直接打开原图使用。
- `thumbnail`：默认预览图，优先使用 960 px 版本。
- `srcset`：480、960、1920 px 预览图集合。
- `width`、`height`：原图固有尺寸，用于提前保留布局空间。

若 manifest 缺失或单图生成失败：

- `thumbnail` 回退为 `src`。
- 页面仍能正常显示和打开原图。
- 构建输出明确警告，但不因单张图片失败而中断。

### 外链相册

沿用现有 `info.json`：

- 有 `thumbnail` 时，瀑布流使用 `thumbnail`，Fancybox 使用 `src`。
- 没有 `thumbnail` 时，两者都使用 `src`。
- 不自动下载或转换第三方图片。

### 页面渲染

`PhotoCard` 调整为：

```html
<div data-fancybox data-src="高清原图">
  <img
    src="960px 预览图"
    srcset="480px ..., 960px ..., 1920px ..."
    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
    width="原始宽度"
    height="原始高度"
    loading="lazy"
    decoding="async"
  />
</div>
```

用户滚动相册时只加载接近视口的预览图。点击照片后，Fancybox 才请求当前高清原图；切换到相邻照片时沿用 Fancybox 自身的邻图加载行为。

## 壁纸与横幅数据流

### 单一图片清单

壁纸源文件不需要同时复制到桌面和移动目录。配置最终使用同一组逻辑图片，设备差异由生成的 `srcset` 和 `sizes` 解决。为了保持兼容，实施时允许旧的 `desktop/mobile` 配置继续工作；对于内容完全相同的两个文件，先校验哈希，再保留一份规范源图并让两种设备配置引用该路径。

### 轮播状态

轮播组件只维护两个图片槽位：

- `current`：当前显示图片。
- `next`：下一张预加载图片。

切换流程：

1. 首次进入时，根据设备宽度选择合适预览尺寸并加载当前图。
2. 当前图完成加载后，以低优先级加载下一张。
3. 到达轮播时间后执行交叉淡入淡出。
4. 动画完成后复用旧槽位加载再下一张。
5. 页面隐藏时暂停计时器和下一张预加载。

DOM 中不会存在完整的 13 或 26 张 `<img>`。

### 模式隔离

`banner`、`fullscreen`、`none` 三种模式共享一个模式控制器：

- 初始模式来自 `localStorage`，没有存储值时使用 `siteConfig.wallpaperMode.defaultMode`。
- `banner` 模式只初始化横幅图片。
- `fullscreen` 模式只初始化全屏壁纸。
- `none` 模式不初始化任何壁纸图片。
- 用户切换到尚未初始化的模式时，再创建对应的两个轮播槽位。
- 模式离开时停止该模式的计时器、移除图片节点并释放解码资源；再次进入时重新初始化。
- Swup 页面切换时复用全局状态并清理旧监听器，避免重复计时器和重复图片请求。

这样可以避免当前“配置默认是 `fullscreen`，组件内部却默认按 `banner` 判断”的不一致。

## 构建与开发流程

新增命令：

```json
{
  "images:generate": "node scripts/generate-image-previews.mjs",
  "images:check": "node scripts/generate-image-previews.mjs --check"
}
```

流程约束：

- `predev` 和 `prebuild` 在内容同步后运行增量图片生成。
- `--check` 只验证 manifest 与预览图是否同步，不写文件，用于 CI 或发布前检查。
- 构建脚本打印新增、更新、跳过、删除和失败数量。
- 首次全量生成耗时可以较长，后续内容更新只处理变化图片。

生成目录提交到 Git 的原因：

- GitHub Pages 发布只复制现成静态资源。
- 避免每次部署对数百 MB 原图重复执行图像转换。
- 本地开发启动后立即可以使用预览图。

代价是仓库会新增一批较小的派生文件；这些文件可以通过脚本可靠重建，不影响原图权威性。

## 构建产物去重

实施时缩小所有图片 `import.meta.glob` 的范围，只允许扫描真正需要 Astro 处理的 `src` 图片，禁止覆盖项目根目录和 `public`：

- 文章封面只扫描 `src/content/posts`。
- 头像只扫描 `src/assets/images`。
- RSS、Atom 和分享海报使用同样的明确范围。
- `public/images/albums` 始终作为原样静态文件引用，不进入 Astro 资产管线。

验收时检查同一相册原图不能同时出现在 `/images/albums/` 和 `/_astro/`。本次只避免新产物重复，不重写 Git 历史。

## 错误处理

- 单图转换失败：记录源路径和 Sharp 错误，保留旧预览；没有旧预览则回退原图。
- manifest 无法解析：构建失败，防止生成错误映射覆盖现有文件。
- 预览图线上 404：图片元素通过 `error` 事件回退高清 `src`。
- 高清原图加载失败：Fancybox 显示失败状态并提供“直接打开原图”和“重试”入口。
- 用户启用节省流量模式时，不预加载轮播下一张；轮播切换时再加载。
- `prefers-reduced-motion` 生效时禁用 Ken Burns，保留静态切换或缩短淡入淡出。

## 测试与验收

### 自动验证

- 对临时图片运行生成脚本，验证 480、960、1920 输出、宽高和 manifest。
- 第二次运行不修改任何输出，验证增量幂等。
- 修改一张源图后只重建对应预览。
- 删除一张源图后清理对应输出。
- `pnpm check` 通过。
- `pnpm build` 通过。
- 构建后搜索重复的大型相册原图，确认不再进入 `/_astro`。

### 浏览器验证

- 桌面和手机首页的 DOM 中，活动壁纸最多两个 `<img>`。
- 当前模式之外的壁纸组件没有图片请求。
- 切换模式不刷新页面，且不会产生重复计时器。
- 相册初始请求只包含预览图，不包含所有高清原图。
- 点击任意照片后才出现该原图网络请求。
- 键盘可以打开和关闭 Fancybox，图片 `alt` 保持有效。
- Swup 前进、后退和跨页面切换后轮播、相册、Fancybox 均正常。

### 性能目标

使用与基线相同的网络环境验证：

| 场景 | 目标 |
| --- | ---: |
| 手机首页图片传输 | 不高于 3 MB |
| 桌面首页图片传输 | 不高于 5 MB |
| `bw2026` 相册首次加载图片传输 | 不高于 8 MB |
| 首页初始壁纸节点 | 最多 2 个 |
| 相册首次加载高清原图 | 0 张 |

性能目标是验收阈值，不以牺牲高清原图下载和查看能力为代价。

## 预计修改范围

- `scripts/generate-image-previews.mjs`
- `package.json`
- `src/types/album.ts`
- `src/utils/album-scanner.ts`
- `src/components/features/albums/PhotoCard.astro`
- `src/components/misc/FullscreenWallpaper.astro`
- `src/components/layout/Banner.astro`
- `src/layouts/MainGridLayout.astro`
- `src/layouts/partials/GridScripts.astro`
- 图片 glob 相关的文章、RSS、Atom 和分享海报文件
- `public/generated/image-previews/`

## 实施顺序

1. 建立预览图脚本、manifest 和增量检查。
2. 接入相册预览图，验证点击后仍加载原图。
3. 重写壁纸/横幅为双槽位轮播，并隔离模式加载。
4. 收窄图片 glob，验证构建产物不重复复制相册原图。
5. 执行类型检查、构建和浏览器性能回归。
