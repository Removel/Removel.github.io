# 日记 JSON 内容集合设计

## 背景

当前日记数据集中定义在 `src/data/diary.ts`。每条日记内容较短，不需要 Markdown 正文能力，但内容和 TypeScript 代码混在同一个文件中，新增日记时必须修改代码文件。

本次改造将日记迁移为 Astro Content Collection，每条日记对应一个 JSON 文件。现有日记页面、卡片样式、标签筛选和图片灯箱保持不变。

## 目标

- 每条日记使用独立 JSON 文件。
- 新增日记只需新增 JSON，不修改 TypeScript 数据数组。
- 使用 Astro schema 校验字段。
- 生产环境隐藏 `draft: true` 的日记，开发环境可以预览。
- 日记按发布时间倒序展示。
- 标签继续自动汇总并用于现有筛选 UI。
- 日记图片继续统一存放在 `public/images/diary/`。
- 支持现有独立内容仓库同步模式。

## 非目标

- 不新增日记详情页。
- 不支持 Markdown 或 MDX 正文。
- 不为每条日记创建独立图片目录。
- 不新增 diary service、manager、loader 工具或缓存层。
- 不修改现有日记页面视觉设计。
- 不调整现有图片文件。
- 不修改 About 页面内容。

## 文件结构

```text
src/content/diary/
├── 2025-08-20-sakura.json
├── 2026-04-20-running-award.json
└── 2026-04-25-computer-maintenance.json

public/images/diary/
├── 1.webp
├── chat_picture.jpg
├── computer-maintenance-activity.jpg
├── sakura.jpg
└── sakura.webp
```

图片仍通过站点绝对路径引用：

```json
{
  "images": [
    "/images/diary/computer-maintenance-activity.jpg"
  ]
}
```

## JSON 格式

```json
{
  "content": "今天又参加了电脑维护活动呀~",
  "published": "2026-04-25T15:00:00+08:00",
  "images": [
    "/images/diary/computer-maintenance-activity.jpg"
  ],
  "location": "学校",
  "mood": "充实",
  "tags": ["社团活动", "电脑维护"],
  "draft": false
}
```

字段定义：

| 字段 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `content` | 是 | string | 日记正文 |
| `published` | 是 | ISO 日期字符串 | 发布时间，包含时区 |
| `images` | 否 | string[] | `public/images/diary/` 中的图片 URL |
| `location` | 否 | string | 地点 |
| `mood` | 否 | string | 心情 |
| `tags` | 否 | string[] | 标签 |
| `draft` | 否 | boolean | 是否为草稿，默认 `false` |

文件名作为稳定 ID，不在 JSON 中重复维护 `id`。

## Content Collection

在 `src/content.config.ts` 中增加 `diary` collection：

```ts
const diaryCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/diary"
  }),
  schema: z.object({
    content: z.string().min(1),
    published: z.coerce.date(),
    images: z.array(z.string()).optional().default([]),
    location: z.string().optional(),
    mood: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false)
  })
});
```

不增加额外数据访问文件。`src/pages/diary.astro` 直接调用 `getCollection("diary")`。

## 页面数据流

`src/pages/diary.astro` 负责：

1. 读取 `diary` collection。
2. 生产环境过滤草稿。
3. 按 `published` 倒序排序。
4. 从所有日记中汇总标签。
5. 将 collection entry 转为现有 `MomentCard` 所需数据。

示意：

```ts
const entries = await getCollection("diary", ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
});

const moments = entries
  .sort(
    (a, b) =>
      b.data.published.getTime() - a.data.published.getTime()
  )
  .map((entry) => ({
    id: entry.id,
    content: entry.data.content,
    date: entry.data.published.toISOString(),
    images: entry.data.images,
    location: entry.data.location,
    mood: entry.data.mood,
    tags: entry.data.tags
  }));
```

标签在页面内直接通过 `Set` 汇总，不新增 `getAllTags` helper。

## 类型

删除 `src/data/diary.ts` 后，日记类型从 Content Collection 推导：

```ts
type DiaryEntry = CollectionEntry<"diary">;
```

`MomentCard` 可以接收页面映射后的轻量对象。类型定义继续放在现有 `src/components/features/diary/types.ts` 中，不新建公共类型文件。

## 内容仓库同步

现有独立内容仓库结构增加：

```text
content/
├── posts/
├── spec/
├── diary/
├── data/
└── images/
    └── diary/
```

`scripts/sync-content.js` 增加映射：

```ts
{ src: "diary", dest: "src/content/diary" }
```

更新 `docs/CONTENT_REPOSITORY.md` 中的目录结构、初始化命令和迁移命令。

## 迁移

将现有三条数据迁移为三个 JSON 文件：

- `id: 1` → `2025-08-20-sakura.json`
- `id: 2` → `2026-04-20-running-award.json`
- `id: 3` → `2026-04-25-computer-maintenance.json`

日期使用原数据表达的 UTC 时间转换为明确的 `+08:00`：

- `2025-08-20T10:30:00Z` → `2025-08-20T18:30:00+08:00`
- `2026-04-20T08:00:00Z` → `2026-04-20T16:00:00+08:00`
- `2026-04-25T15:00:00Z` → `2026-04-25T23:00:00+08:00`

时间点保持不变，只把时区写清楚。

迁移完成后删除 `src/data/diary.ts`。

## 错误处理

- JSON 格式错误或字段类型错误：Astro 构建时报出 collection schema 错误。
- `content` 为空：schema 校验失败。
- 图片路径不存在：沿用浏览器图片加载行为，本次不增加运行时文件系统校验。
- 缺少可选字段：页面不显示对应区域。
- 所有日记为草稿：显示现有空状态。

## 测试与验收

### 数据

- 三个 JSON 均被 collection 正确读取。
- 生产环境不展示 `draft: true`。
- 按发布时间倒序展示。
- 标签数量与迁移前一致。
- 日记数量仍为 3 条。

### 页面

- 日记文案、图片、地点、心情和标签与迁移前一致。
- 标签筛选正常。
- 图片灯箱正常。
- 桌面和移动端无横向溢出。
- Swup 进入和离开日记页正常。

### 工程

- `astro check` 通过。
- `pnpm build` 通过。
- `src/data/diary.ts` 已删除且无残余引用。
- 独立内容仓库同步模式能够映射 `diary/`。

## 预计修改范围

- `src/content/diary/2025-08-20-sakura.json`
- `src/content/diary/2026-04-20-running-award.json`
- `src/content/diary/2026-04-25-computer-maintenance.json`
- `src/content.config.ts`
- `src/pages/diary.astro`
- `src/components/features/diary/types.ts`
- `scripts/sync-content.js`
- `docs/CONTENT_REPOSITORY.md`
- 删除 `src/data/diary.ts`

## 实施顺序

1. 增加 diary collection schema。
2. 创建并迁移三个 JSON。
3. 页面改为直接读取 collection。
4. 更新 MomentCard 类型。
5. 删除旧 TS 数据文件。
6. 更新内容仓库同步和文档。
7. 执行类型、构建和浏览器回归。
