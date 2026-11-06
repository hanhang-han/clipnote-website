# CliperX 官网改版 · 2026-11-06

## 结果

按用户选定的 https://mymind.com/ 视觉方向，改造首页、下载页、使用指南：暖白底、橙粉柔光、衬线大标题、彩色内容标签、瀑布流记忆墙、克制的圆角与留白。保留 CliperX 自己的品牌、产品内容和真实演示视频。

- 线上：https://cliperx.com/
- 源码分支：`codex/mymind-website-redesign`
- 基线：`origin/redesign-v5` 的 `982d4ab`
- 独立工作目录：`website-redesign`；原 `website` 目录和已有未提交修改未覆盖。
- 价格与原线上 bundle 核对：Free ¥0、Pro ¥8/月或 ¥28 终身、Ultra ¥25/月。
- 移除首页模拟下载量；图库明确标注交互示例；云端 AI 的数据发送与本地历史存储分开说明。

## 交互及实现

首页示例支持关键词搜索、内容类型筛选、无结果重置、记忆展开。演示视频按需播放，提供暂停与加载失败入口。导航支持锚点、手机菜单与 Escape；中英文偏好可保存；下载页可复制 Homebrew 命令。

沿用 React 19 / Vite 6 / Tailwind 4。静态预渲染使用 ReactDOMServer + esbuild，不再在构建中启动浏览器。删除退役 Cloudflare Functions 和生产 routes 配置；移除误入 public 的 `.omc` 状态文件。

## 线上源码差异和兼容

线上应用另外具有 `/store`、`/checkout`、`/account` 路由，但本次可用 Git 分支中没有这些路由源码。部署时将原首页应用壳保存为这三个路由的 `.html` 文件，并保留原 hashed assets。新页中的商店和账户使用整页导航进入原应用。

这三页保持原有设计和逻辑；本次未测试登录后下单或支付，不应把 HTTP 可访问当作支付完成验证。后续改造这部分前，应先找回与线上 bundle 对应的源码。

法律、博客、对比页面及其他子应用均未覆盖。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过；首页、docs、download、404 静态内容已输出。
- 构建资源引用和文件存在性检查：通过；无隐藏文件、无退役 API 域名进入新 JS bundle。
- Chrome 桌面检查：搜索“设计”显示 3 条，图片分类 4 条，无结果和重置正常，记忆展开正常。
- 视频：readyState 4，播放和暂停正常。
- FAQ、英文切换、页面导航、Homebrew 复制反馈：通过。
- 手机 390px 英文和 360px 中文：无横向溢出；菜单可展开并进入指南。
- 本地浏览器控制台：无 error/warn。
- 线上首页、docs、download：HTTP 200，并包含新版标记；Chrome 实际加载首页，标题、首屏和全部主要内容已确认。
- 线上首屏截图：`/Users/hanhang/.codex/visualizations/2026/11/05/01a1abef-0293-7671-b9e8-2e44fe677d4b/cliperx-live-redesign.png`。
- 线上 JS、CSS、图片：SHA-256 与构建产物一致。
- 线上 store、checkout、account：HTTP 200，原应用资源可加载。
- 下载接口 GET 返回 302 至 `https://update.cliperx.com/CliperX-4.0.15.dmg`，未下载完整安装包。

## 部署与回滚

执行 `node scripts/deploy.mjs` 完成部署。脚本先验证整站 tar 备份，再按明确文件清单上传资源，最后原子替换首页；不使用 rsync --delete。

本次服务器备份：

`/var/backups/cliperx-web/20261106022908833-85017/site.tar.gz`

同目录的 `manifest.txt` 记录本次替换路径，`protected-before.txt` 记录 appcast 与 DMG 的原校验值。部署后两类文件校验值完全一致。

回滚时先把备份解压到新的暂存目录并核对。按 manifest 恢复原有页面；若 docs/download 的目录版或 `.html` 文件在备份中不存在，移走该次新建文件，使原路由重新走旧首页。保留 assets，避免已打开页面加载失败。最后恢复原 `index.html`。不覆盖更新文件，不删除其他业务目录，不改 nginx。

## 图片素材

- 最终项目素材：`public/images/memory-collection.jpg`，约 417 KB。
- 来源：本会话使用内置 `image_gen` 生成，非复制 mymind 图片；生成 PNG 保存在 `/Users/hanhang/.codex/generated_images/01a1abef-0293-7671-b9e8-2e44fe677d4b/exec-21ead0f7-deb2-4871-b263-58e24908a3b9.png`。
- 用法：四宫格图片以 CSS background-position 显示不同区域，仅需请求一张图片。
- 提示词内容摘要（非逐字调用记录）：生成四宫格高端生活方式摄影素材，无文字、无标识；暖色雕塑感橙色椅子、地中海风格建筑与蓝天、深绿色植物叶片、咖啡和书本的桌面。自然光、真实材质、温暖平静的编辑摄影氛围，用作个人记忆工具官网的内容收藏卡片。
- 生成后使用系统 sips 转 JPEG，质量 82；网站引用已复制进仓库的素材，不依赖会话临时路径。
