export type Language = "zh" | "en";
export const ORIGIN = "https://cliperx.com";
export function pagePath(pathname: string) {
  return pathname.replace(/^\/en(?=\/|$)/, "").replace(/\.html$/, "").replace(/\/$/, "") || "/";
}
export function localizedPath(path: string, lang: Language) {
  const [pathname, hash] = path.split("#");
  const base = pagePath(pathname || "/");
  return (lang === "en" ? `/en${base === "/" ? "/" : base + "/"}` : base) + (hash ? `#${hash}` : "");
}
export function languageForPath(path: string): Language {
  return /^\/en(?:\/|$)/.test(path) ? "en" : "zh";
}
export function seoFor(pathname: string) {
  const lang = languageForPath(pathname);
  const path = pagePath(pathname);
  const workshop = path === "/workshop" || path.startsWith("/workshop/");
  const account = path === "/account" || path === "/checkout";
  const admin = path === "/admin" || path.startsWith("/admin/");
  const known = ["/", "/docs", "/download"].includes(path) || workshop || account || admin;
  const privateWorkshop = /^\/workshop\/(submit|mine|review|authorize|submissions)(\/|$)/.test(path);
  const indexable = known && !privateWorkshop && !account && !admin;
  const titles = lang === "zh" ? {
    "/": "灵剪 CliperX — Mac 剪贴板管理工具与 AI 记忆空间",
    "/docs": "CliperX 使用指南：安装、快捷键与剪贴板搜索",
    "/download": "免费下载灵剪 CliperX — Mac 剪贴板管理工具",
    "/workshop": "灵剪创意工坊 — 开放小组件与 AI 工具",
    "/workshop/develop": "灵剪组件开发指南 — SDK 与 Codex Skill",
  } : {
    "/": "CliperX — AI Clipboard Manager for Mac",
    "/docs": "CliperX Guide: Installation, Shortcuts & Clipboard Search",
    "/download": "Download CliperX — AI Clipboard Manager for Mac",
    "/workshop": "CliperX Workshop — Community Widgets & AI Tools",
    "/workshop/develop": "Build CliperX Widgets — SDK & Codex Skill",
  };
  const descriptions = lang === "zh" ? {
    "/": "灵剪 CliperX 是 Mac 剪贴板管理工具，保存文字、链接、图片与代码。通过灵动岛、全文搜索和 AI 翻译总结，找回并复用复制记录。免费下载，支持 macOS 14+。",
    "/docs": "学习使用灵剪 CliperX 保存和搜索 Mac 剪贴板历史，通过灵动岛与快捷键找回文字、图片、链接和代码，并使用 AI 处理内容。",
    "/download": "下载灵剪 CliperX Mac 剪贴板管理工具。支持 macOS 14 及以上、Apple Silicon 与 Intel，提供 DMG 安装说明和 Homebrew 安装命令。",
    "/workshop": "发现、安装和分享灵剪社区小组件。使用收集篮、文本处理、AI 和效率工具，或通过 SDK 与 Codex Skill 开发自己的组件。",
    "/workshop/develop": "使用灵剪 Widget SDK 和开发 Skill 创建、预览、打包并提交小组件，了解原生组件能力、权限与审核流程。",
  } : {
    "/": "Save and search clipboard history on your Mac with CliperX. Find text, links, images and code with Dynamic Island, full-text search and AI tools. Free download for macOS 14+.",
    "/docs": "Learn to save and search Mac clipboard history with CliperX. Use Dynamic Island, keyboard shortcuts and AI to find and reuse text, links, images and code.",
    "/download": "Download CliperX for macOS 14 or later, on Apple Silicon and Intel Macs. Follow the DMG installation guide or install with Homebrew.",
    "/workshop": "Discover, install and share community widgets for CliperX. Find clipboard, text, AI and productivity tools, or build your own with the SDK and Codex Skill.",
    "/workshop/develop": "Create, preview, package and submit CliperX widgets with the Widget SDK and development Skill. Learn about native capabilities, permissions and review.",
  };
  return {
    lang, path, known, indexable,
    title: admin ? "管理后台 — 灵剪 CliperX" : account ? "账户与会员 — 灵剪 CliperX" : titles[path as keyof typeof titles] || (workshop ? titles["/workshop"] : (lang === "zh" ? "页面未找到 — 灵剪 CliperX" : "Page not found — CliperX")),
    description: account || admin ? "登录灵剪管理账户、会员和工坊。" : descriptions[path as keyof typeof descriptions] || (workshop ? descriptions["/workshop"] : (lang === "zh" ? "此页面不存在，请返回灵剪首页。" : "This page does not exist. Return to CliperX home.")),
    canonical: ORIGIN + localizedPath(pathname, lang),
    alternates: { "zh-CN": ORIGIN + localizedPath(pathname, "zh"), en: ORIGIN + localizedPath(pathname, "en"), "x-default": ORIGIN + localizedPath(pathname, "zh") },
  };
}
