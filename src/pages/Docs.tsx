import { useState, useEffect } from 'react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';
import Reveal from '../components/Reveal';

export default function Docs() {
  const { lang } = useLang();
  const revealRef = useReveal();
  const [activeSection, setActiveSection] = useState('getting-started');

  // 监听滚动激活当前 section
  useEffect(() => {
    const handler = () => {
      const sections = ['getting-started', 'core-features', 'privacy', 'shortcuts', 'ai', 'advanced'];
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const t = {
    badge: lang === 'zh' ? '文档' : 'Docs',
    title: lang === 'zh' ? '使用文档' : 'Documentation',
    subtitle: lang === 'zh'
      ? '从安装到进阶，了解灵剪的每一个能力'
      : 'From installation to advanced usage, learn everything CliperX can do',
    onThisPage: lang === 'zh' ? '本页内容' : 'On this page',
  };

  const sections = lang === 'zh' ? [
    {
      id: 'getting-started',
      icon: '⌘',
      title: '快速上手',
      items: [
        { q: '如何安装？', a: '官网下载 DMG，双击打开后将灵剪拖入「应用程序」文件夹；或 brew install --cask hanhang-han/tap/clipnote。已通过 Apple 公证，双击安装无安全警告。' },
        { q: '如何唤起灵动岛？', a: '鼠标移到屏幕顶部，灵动岛自动展开；或快捷键 ⌘⇧V 任何时候调出，不用移动鼠标。' },
        { q: '为什么没看到灵动岛？', a: '确认 macOS 14 (Sonoma) 或更高。首次启动需在「系统设置 → 隐私与安全性 → 辅助功能」中授权灵剪。' },
        { q: '如何卸载？', a: '将 app 拖入废纸篓即可。数据保存在 ~/Library/Application Support/com.clipnote.app/，可手动清理。' },
      ],
    },
    {
      id: 'core-features',
      icon: '⚡',
      title: '核心功能',
      items: [
        { q: '剪贴板历史条数限制？', a: '免费版 100 条，Pro 版 500 条。Pro 仅 ¥18 一次性买断，永久使用，无订阅。' },
        { q: '支持哪些内容类型？', a: '7 种：纯文本、链接、代码片段、富文本 (RTF)、Markdown、图片、文件路径。复制后自动识别分类。' },
        { q: '如何搜索历史？', a: '灵动岛面板顶部搜索框。支持关键词、正则、自然语言。比如「上周复制的 Swift 函数」能直接匹配。' },
        { q: '如何置顶和收藏？', a: '右键条目 → 置顶 / 收藏。置顶条目永远在顶部，收藏条目不被自动清理。' },
        { q: '能导出数据吗？', a: '可以。选中条目 → 导出为 TXT / JSON / Markdown。换电脑、备份、分享都用得上。' },
      ],
    },
    {
      id: 'ai',
      icon: '✨',
      title: 'AI 助手',
      items: [
        { q: 'AI 助手支持哪些操作？', a: '6 种：翻译、总结、代码分析、OCR、润色、修复代码。根据复制内容智能推荐最合适的操作。' },
        { q: 'AI 会读取我的剪贴板吗？', a: '不会。只有主动点击 AI 功能时，内容才发送到 DeepSeek 处理。后台不扫描，服务端不存储。' },
        { q: 'AI 积分是什么？', a: '免费版 8 积分/天，Pro 版 80 积分/天。不同操作消耗不同：翻译 1 分、总结/解释/润色 2 分、代码分析 3 分。每日重置。' },
        { q: '能继续追问吗？', a: '可以。AI 助手支持多轮对话，选中任意内容发起对话后，可以连续追问，对话历史自动保存。' },
        { q: 'AI 报错怎么办？', a: '检查网络。如果是积分问题，等每日重置或升级 Pro。如果持续报错，菜单栏 → 反馈，附 device ID。' },
      ],
    },
    {
      id: 'shortcuts',
      icon: '⌨️',
      title: '快捷键',
      items: [
        { q: '默认快捷键？', a: '唤起灵动岛：⌘⇧V。AI 助手：⌘⇧A。粘贴队列：⌘⇧Q。所有快捷键都可在设置中自定义。' },
        { q: '快捷键冲突？', a: '设置 → 快捷键，点击对应项重新绑定。常见冲突：与 Raycast / Alfred / 系统截图等。' },
        { q: '能用全局快捷键粘贴吗？', a: '可以。选中条目后按 Return 直接粘贴到当前输入框；或启用「粘贴队列」依次粘贴多条。' },
        { q: '菜单栏图标能隐藏吗？', a: '可以。设置 → 通用 → 隐藏菜单栏图标。隐藏后只能用快捷键唤起。' },
      ],
    },
    {
      id: 'privacy',
      icon: '🔐',
      title: '隐私与安全',
      items: [
        { q: '数据存储在哪？', a: '全部本地存储，零上传。剪贴板数据完全由你掌控。' },
        { q: '支持 Touch ID 吗？', a: '开发中。v3.7 将支持敏感内容 Touch ID 解锁。' },
        { q: '会自动上传崩溃日志吗？', a: '不会。灵剪没有任何遥测。如果你愿意反馈，需主动点击菜单栏 → 反馈。' },
        { q: '能完全离线使用吗？', a: '可以。除 AI 助手外，所有功能完全离线工作。AI 助手需要联网调用 DeepSeek API。' },
      ],
    },
    {
      id: 'advanced',
      icon: '🛠',
      title: '进阶与故障排查',
      items: [
        { q: 'Sparkle 自动更新不工作？', a: '检查系统防火墙 / 网络代理。手动检查更新：菜单栏灵剪图标 → 检查更新。' },
        { q: 'M1/M2/M3/M4 兼容性？', a: 'Universal Binary，同时支持 Apple Silicon 和 Intel。无需选择版本，DMG 自动适配。' },
        { q: '灵动岛不显示怎么办？', a: '1) 确认 macOS 14+；2) 系统设置 → 隐私与安全性 → 辅助功能 授权；3) 重启 app；4) 仍不行邮件反馈。' },
        { q: '数据突然消失？', a: '灵剪有 5 层数据保护（WAL checkpoint / 备份扫描 / 自动恢复）。重启 app 通常能恢复。仍异常邮件 hanhang789@gmail.com。' },
        { q: '能自定义灵动岛位置吗？', a: '默认顶部居中。设置 → 多显示器可切换跟随鼠标。其他位置暂不支持。' },
      ],
    },
  ] : [
    {
      id: 'getting-started',
      icon: '⌘',
      title: 'Getting Started',
      items: [
        { q: 'How to install?', a: 'Download DMG from website, drag to Applications folder; or `brew install --cask hanhang-han/tap/clipnote`. Apple Notarized, no warnings.' },
        { q: 'How to invoke Dynamic Island?', a: 'Hover mouse at top of screen, island auto-expands; or use ⌘⇧V shortcut anytime without moving mouse.' },
        { q: 'Why no Dynamic Island?', a: 'Requires macOS 14 (Sonoma) or later. On first launch, grant access in System Settings → Privacy & Security → Accessibility.' },
        { q: 'How to uninstall?', a: 'Drag app to Trash. Data is in ~/Library/Application Support/com.clipnote.app/, can be manually deleted.' },
      ],
    },
    {
      id: 'core-features',
      icon: '⚡',
      title: 'Core Features',
      items: [
        { q: 'Clipboard history limit?', a: 'Free: 100 items. Pro: 500 items. Pro is ¥18 one-time purchase, lifetime. No subscription.' },
        { q: 'Supported content types?', a: '7 types: plain text, URLs, code snippets, rich text (RTF), Markdown, images, file paths. Auto-detected after copying.' },
        { q: 'How to search history?', a: 'Search bar at top of island panel. Supports keywords, regex, natural language. "That Swift function I copied last week" works.' },
        { q: 'Pin and favorite?', a: 'Right-click item → Pin / Favorite. Pinned items stay at top; favorites are never auto-cleaned.' },
        { q: 'Can I export data?', a: 'Yes. Select items → export as TXT / JSON / Markdown. Useful for backup, switching computers, sharing.' },
      ],
    },
    {
      id: 'ai',
      icon: '✨',
      title: 'AI Assistant',
      items: [
        { q: 'What AI operations?', a: '6 types: translate, summarize, code analysis, OCR, polish, fix code. Auto-recommended based on content type.' },
        { q: 'Does AI read my clipboard?', a: 'No. Content is only sent to DeepSeek when you actively click an AI feature. No background scanning, no server storage.' },
        { q: 'What are AI credits?', a: 'Free: 8 credits/day, Pro: 80 credits/day. Costs: translate 1, summarize/explain/polish 2, code analysis 3. Resets daily.' },
        { q: 'Can I ask follow-ups?', a: 'Yes. AI supports multi-turn conversations. Select any content to start, then ask follow-up questions. History is saved.' },
        { q: 'AI errors?', a: 'Check network. If credit issue, wait for daily reset or upgrade to Pro. For persistent errors: Menubar → Feedback with device ID.' },
      ],
    },
    {
      id: 'shortcuts',
      icon: '⌨️',
      title: 'Shortcuts',
      items: [
        { q: 'Default shortcuts?', a: 'Invoke island: ⌘⇧V. AI assistant: ⌘⇧A. Paste queue: ⌘⇧Q. All customizable in Settings.' },
        { q: 'Shortcut conflicts?', a: 'Settings → Shortcuts, click item to rebind. Common conflicts: Raycast / Alfred / system screenshot.' },
        { q: 'Global paste shortcut?', a: 'Yes. Select item, press Return to paste directly; or enable Paste Queue to paste multiple in order.' },
        { q: 'Hide menubar icon?', a: 'Yes. Settings → General → Hide Menubar Icon. After hiding, only shortcuts can invoke.' },
      ],
    },
    {
      id: 'privacy',
      icon: '🔐',
      title: 'Privacy & Security',
      items: [
        { q: 'Where is data stored?', a: 'All local, zero upload. Clipboard data is fully under your control.' },
        { q: 'Touch ID support?', a: 'In development. v3.7 will support Touch ID unlock for sensitive content.' },
        { q: 'Crash logs uploaded?', a: 'No. CliperX has zero telemetry. Feedback requires manual action via Menubar → Feedback.' },
        { q: 'Fully offline?', a: 'Yes, except AI assistant. All other features work fully offline. AI requires DeepSeek API call.' },
      ],
    },
    {
      id: 'advanced',
      icon: '🛠',
      title: 'Advanced & Troubleshooting',
      items: [
        { q: 'Sparkle auto-update issues?', a: 'Check firewall / network proxy. Manually check: menubar CliperX icon → Check for Updates.' },
        { q: 'M1/M2/M3/M4 compatibility?', a: 'Universal Binary. Supports both Apple Silicon and Intel. No version selection needed.' },
        { q: 'Dynamic Island not showing?', a: '1) Confirm macOS 14+; 2) Grant Accessibility in System Settings → Privacy & Security; 3) Restart app; 4) Email feedback if still broken.' },
        { q: 'Data suddenly disappeared?', a: 'CliperX has 5-layer data protection (WAL checkpoint / backup scan / auto-recovery). Restart usually recovers. Email hanhang789@gmail.com if still broken.' },
        { q: 'Customize island position?', a: 'Default top-center. Settings → Multi-monitor can switch to follow mouse. Other positions not supported yet.' },
      ],
    },
  ];

  return (
    <div className="pt-32 pb-32 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h1 className="text-[48px] md:text-[60px] font-normal tracking-tight mb-4">{t.title}</h1>
          <p className="text-[16px] text-[#bbb]">{t.subtitle}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* 侧边栏目录 */}
          <aside className="md:w-56 shrink-0">
            <div className="md:sticky md:top-32">
              <p className="text-[11px] tracking-widest uppercase text-[#777] mb-4">{t.onThisPage}</p>
              <nav className="space-y-1">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block px-3 py-2 text-[13px] no-underline transition-all border-l-2 ${
                      activeSection === s.id
                        ? 'text-[#F97316] border-[#F97316] bg-[#1a1a1a]'
                        : 'text-[#888] border-transparent hover:text-[#ccc] hover:border-[#444]'
                    }`}
                  >
                    <span className="mr-2">{s.icon}</span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* 主内容 */}
          <div className="flex-1 min-w-0 space-y-20">
            {sections.map((s, idx) => (
              <Reveal key={s.id} as="section" id={s.id} delay={idx * 60} className="scroll-mt-32">
                <h2 className="text-[28px] font-normal mb-8 flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  {s.title}
                </h2>
                <div className="space-y-4">
                  {s.items.map((item, i) => (
                    <div
                      key={i}
                      className="feature-card bg-[#0a0a0a] border border-[#222] p-5 transition-all duration-300 hover:border-[#F97316]/40"
                      style={{ borderRadius: 2 }}
                    >
                      <h3 className="text-[16px] text-[#ddd] font-normal mb-2">{item.q}</h3>
                      <p className="text-[14px] text-[#999] font-normal leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}

            <Reveal className="pt-12 border-t border-[#222] text-center text-[14px] text-[#777]">
              {lang === 'zh'
                ? '没找到答案？邮件联系 hanhang789@gmail.com，一般 24 小时内回复'
                : 'Didn\'t find what you need? Email hanhang789@gmail.com, usually replies within 24h'}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
