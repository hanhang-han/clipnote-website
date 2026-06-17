import { useState } from 'react';
import {
  Download, Terminal, ShieldCheck, Apple, GitBranch, Copy, Check,
  History, MousePointerClick, FolderPlus, Rocket, Mail, MessageCircle, Github
} from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';
import Reveal from '../components/Reveal';

export default function DownloadPage() {
  const { lang } = useLang();
  const revealRef = useReveal();
  const [copied, setCopied] = useState<string | null>(null);

  const t = {
    badge: lang === 'zh' ? '下载' : 'Download',
    title: lang === 'zh' ? '下载灵剪' : 'Download CliperX',
    subtitle: lang === 'zh'
      ? '免费版永久免费，Pro 仅 ¥18 一次性买断'
      : 'Free forever. Pro is ¥18 one-time purchase',
    primaryDmg: lang === 'zh' ? '下载 DMG（推荐）' : 'Download DMG (Recommended)',
    brewCmd: 'brew install --cask hanhang-han/tap/clipnote',
    requirements: lang === 'zh' ? '系统要求' : 'System Requirements',
    integrity: lang === 'zh' ? '完整性与安全' : 'Integrity & Security',
    otherMethods: lang === 'zh' ? '其他下载方式' : 'Other Methods',
    versionHistory: lang === 'zh' ? '版本历史' : 'Version History',
    installSteps: lang === 'zh' ? '3 步安装' : '3-Step Install',
    compareTitle: lang === 'zh' ? '免费版 vs Pro' : 'Free vs Pro',
    platformTitle: lang === 'zh' ? '平台支持' : 'Platform Support',
    supportTitle: lang === 'zh' ? '需要帮助？' : 'Need Help?',
    updateCheck: lang === 'zh' ? '检查更新' : 'Check for Updates',
    updateDesc: lang === 'zh'
      ? '已安装？菜单栏灵剪图标 → 检查更新。Sparkle 每日静默检查。'
      : 'Already installed? Menubar CliperX icon → Check for Updates. Sparkle auto-checks daily.',
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const installSteps = lang === 'zh' ? [
    { icon: MousePointerClick, title: '1. 下载 DMG', desc: '点击上方按钮下载，文件约 18 MB' },
    { icon: FolderPlus, title: '2. 拖入应用程序', desc: '双击打开 DMG，将灵剪图标拖到 Applications 文件夹' },
    { icon: Rocket, title: '3. 启动并授权', desc: '从启动台打开，首次需在系统设置授权辅助功能' },
  ] : [
    { icon: MousePointerClick, title: '1. Download DMG', desc: 'Click the button above, ~18 MB file' },
    { icon: FolderPlus, title: '2. Drag to Applications', desc: 'Open DMG, drag CliperX icon to Applications folder' },
    { icon: Rocket, title: '3. Launch & Authorize', desc: 'Open from Launchpad, grant Accessibility on first launch' },
  ];

  const compareRows = lang === 'zh' ? [
    { feature: '剪贴板历史', free: '100 条', pro: '500 条' },
    { feature: '灵动岛交互', free: '✓', pro: '✓' },
    { feature: 'AI 助手', free: '8 积分/天', pro: '80 积分/天' },
    { feature: '置顶和收藏', free: '✓', pro: '✓' },
    { feature: '自动 OCR', free: '✓', pro: '✓' },
    { feature: '导出（TXT/JSON/MD）', free: '✓', pro: '✓' },
    { feature: '价格', free: '免费', pro: '¥18 一次买断' },
  ] : [
    { feature: 'Clipboard history', free: '100 items', pro: '500 items' },
    { feature: 'Dynamic Island UI', free: '✓', pro: '✓' },
    { feature: 'AI Assistant', free: '8 credits/day', pro: '80 credits/day' },
    { feature: 'Pin & Favorite', free: '✓', pro: '✓' },
    { feature: 'Auto OCR', free: '✓', pro: '✓' },
    { feature: 'Export (TXT/JSON/MD)', free: '✓', pro: '✓' },
    { feature: 'Price', free: 'Free', pro: '¥18 one-time' },
  ];

  const platforms = lang === 'zh' ? [
    { name: 'macOS 26 (Tahoe)', status: '✓ 完全支持', color: '#10b981' },
    { name: 'macOS 15 (Sequoia)', status: '✓ 推荐', color: '#10b981' },
    { name: 'macOS 14 (Sonoma)', status: '✓ 最低版本', color: '#F97316' },
    { name: 'macOS 13 及以下', status: '✗ 不支持', color: '#666' },
  ] : [
    { name: 'macOS 26 (Tahoe)', status: '✓ Fully supported', color: '#10b981' },
    { name: 'macOS 15 (Sequoia)', status: '✓ Recommended', color: '#10b981' },
    { name: 'macOS 14 (Sonoma)', status: '✓ Minimum required', color: '#F97316' },
    { name: 'macOS 13 and below', status: '✗ Not supported', color: '#666' },
  ];

  const versions = [
    {
      v: 'v3.5.1', date: '2026-06-13', current: true, size: '8.8 MB',
      changes: lang === 'zh' ? ['修复 Pro 权益恢复问题', '管理后台重设计', '稳定性改进'] : ['Fix Pro entitlement restoration', 'Admin panel redesign', 'Stability improvements'],
      downloadUrl: 'https://github.com/hanhang-han/clipnote-release/releases/download/v3.5.1/v3.5.1.dmg',
      directDownload: true,
    },
    {
      v: 'v3.5.0', date: '2026-06-10', size: '8.5 MB',
      changes: lang === 'zh' ? ['5 步引导重设计', '面板 resize 修复', '状态栏空状态修复'] : ['5-step onboarding redesign', 'Panel resize fix', 'Menubar empty state fix'],
      downloadUrl: 'https://github.com/hanhang-han/clipnote-release/releases/download/v3.5.0/v3.5.0.dmg',
      directDownload: true,
    },
    {
      v: 'v3.4.0', date: '2026-06-05', size: '8.2 MB',
      changes: lang === 'zh' ? ['Pro 无限制', '折叠分组', '状态栏图标控制', '存储概览重设计'] : ['Pro unlimited', 'Collapsible groups', 'Menubar icon control', 'Storage overview redesign'],
      downloadUrl: 'https://github.com/hanhang-han/clipnote-release/releases/download/v3.4.0/v3.4.0.dmg',
      directDownload: true,
    },
  ];

  const otherDownloads = lang === 'zh' ? [
    { icon: GitBranch, title: 'GitHub Release', desc: '查看所有历史版本（公开仓库）', href: 'https://github.com/hanhang-han/clipnote-release/releases' },
    { icon: Terminal, title: 'Homebrew Cask', desc: 'brew install --cask hanhang-han/tap/clipnote', href: 'https://github.com/hanhang-han/homebrew-tap' },
  ] : [
    { icon: GitBranch, title: 'GitHub Release', desc: 'All historical versions (public repo)', href: 'https://github.com/hanhang-han/clipnote-release/releases' },
    { icon: Terminal, title: 'Homebrew Cask', desc: 'brew install --cask hanhang-han/tap/clipnote', href: 'https://github.com/hanhang-han/homebrew-tap' },
  ];

  const supportChannels = lang === 'zh' ? [
    { icon: Mail, title: '邮件支持', desc: 'hanhang789@gmail.com\n一般 24 小时内回复', href: 'mailto:hanhang789@gmail.com' },
    { icon: MessageCircle, title: '小红书 / X', desc: '@Max / @jch47643085\n关注获取免费 Pro 兑换码', href: '#' },
    { icon: Github, title: 'GitHub Issues', desc: 'Bug 报告 / 功能建议\n公开讨论', href: 'https://github.com/hanhang-han/clipnote/issues' },
  ] : [
    { icon: Mail, title: 'Email Support', desc: 'hanhang789@gmail.com\nReplies within 24h', href: 'mailto:hanhang789@gmail.com' },
    { icon: MessageCircle, title: 'Social', desc: 'Xiaohongshu @Max / X @jch47643085\nFollow for free Pro codes', href: '#' },
    { icon: Github, title: 'GitHub Issues', desc: 'Bug reports / feature requests\nPublic discussion', href: 'https://github.com/hanhang-han/clipnote/issues' },
  ];

  return (
    <section className="relative pt-32 pb-32 px-6 min-h-screen overflow-hidden">
      {/* deckclip 风格装饰背景 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 70% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 72%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: '#F97316', transform: 'translate(25%, 25%)' }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Hero */}
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h1 className="hero-title text-[48px] md:text-[60px] font-normal tracking-tight mb-4">{t.title}</h1>
          <p className="hero-subtitle text-[16px] text-[#bbb]">{t.subtitle}</p>
        </div>

        {/* Primary CTA */}
        <div className="hero-cta-enter bg-[#0a0a0a] border border-[#222] p-10 mb-12 text-center" style={{ borderRadius: 2 }}>
          <button
            onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
            className="btn-smooth inline-flex items-center gap-3 bg-[#F97316] text-[#111] border-none px-8 py-4 text-[16px] font-normal tracking-wider cursor-pointer"
            style={{ borderRadius: 2 }}
          >
            <Download size={20} strokeWidth={1.5} />
            <span>{t.primaryDmg}</span>
            <span className="text-[12px] opacity-60 font-mono ml-1">.dmg</span>
          </button>
          <p className="text-[12px] text-[#777] mt-4 font-mono">v3.5.1 · 18.4 MB · Universal Binary · Apple Notarized</p>
        </div>

        {/* 3 步安装 */}
        <Reveal className="mb-12">
          <h2 className="text-[20px] font-normal mb-6 text-center">{t.installSteps}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {installSteps.map((step, i) => (
              <div
                key={i}
                className="feature-card bg-[#0a0a0a] border border-[#222] p-6 text-center transition-all duration-300 hover:border-[#F97316]/40"
                style={{ borderRadius: 2 }}
              >
                <step.icon size={28} className="text-[#F97316] mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-[14px] text-[#ddd] font-normal mb-2">{step.title}</h3>
                <p className="text-[12px] text-[#888] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Homebrew */}
        <Reveal className="bg-[#0a0a0a] border border-[#222] p-8 mb-12" delay={60}>
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={20} className="text-[#F97316]" strokeWidth={1.5} />
            <h2 className="text-[18px] font-normal">Homebrew</h2>
          </div>
          <div className="bg-[#111] border border-[#222] px-4 py-3 flex items-center gap-2 font-mono text-[13px]" style={{ borderRadius: 2 }}>
            <span className="text-[#888] shrink-0">$</span>
            <code className="text-[#bbb] break-all flex-1">{t.brewCmd}</code>
            <button
              onClick={() => copyText('brew', t.brewCmd)}
              aria-label="Copy"
              className="text-[#888] hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-1 shrink-0"
            >
              {copied === 'brew' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-[12px] text-[#777] mt-3">
            {lang === 'zh' ? '需要先安装 Homebrew：' : 'Install Homebrew first:'}{' '}
            <a href="https://brew.sh" target="_blank" rel="noopener" className="text-[#F97316] no-underline hover:underline">brew.sh</a>
            {copied === 'brew' && <span className="ml-2 text-[#F97316]">✓ {lang === 'zh' ? '已复制' : 'Copied'}</span>}
          </p>
        </Reveal>

        {/* 免费 vs Pro 对比 */}
        <Reveal className="bg-[#0a0a0a] border border-[#222] p-8 mb-12" delay={60}>
          <h2 className="text-[18px] font-normal mb-6 text-center">{t.compareTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#222]">
                  <th className="text-left py-3 text-[#888] font-normal">{lang === 'zh' ? '功能' : 'Feature'}</th>
                  <th className="text-center py-3 text-[#888] font-normal">Free</th>
                  <th className="text-center py-3 text-[#F97316] font-normal">Pro</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]">
                    <td className="py-3 text-[#ccc] font-normal">{row.feature}</td>
                    <td className="py-3 text-center text-[#999] font-normal">{row.free}</td>
                    <td className="py-3 text-center text-[#F97316] font-medium">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* 平台支持 */}
        <Reveal className="bg-[#0a0a0a] border border-[#222] p-8 mb-12" delay={60}>
          <div className="flex items-center gap-3 mb-5">
            <Apple size={20} className="text-[#F97316]" strokeWidth={1.5} />
            <h2 className="text-[18px] font-normal">{t.platformTitle}</h2>
          </div>
          <div className="space-y-3">
            {platforms.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                <span className="text-[14px] text-[#ccc] font-mono">{p.name}</span>
                <span className="text-[13px] font-medium" style={{ color: p.color }}>{p.status}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Requirements */}
        <Reveal className="bg-[#0a0a0a] border border-[#222] p-8 mb-8" delay={60}>
          <div className="flex items-center gap-3 mb-5">
            <Apple size={20} className="text-[#F97316]" strokeWidth={1.5} />
            <h2 className="text-[18px] font-normal">{t.requirements}</h2>
          </div>
          <ul className="space-y-2">
            {(lang === 'zh' ? [
              'macOS 14 (Sonoma) 或更高版本',
              'Apple Silicon (M1/M2/M3/M4) 或 Intel',
              '60 MB 磁盘空间',
              '联网（仅 AI 功能需要）',
            ] : [
              'macOS 14 (Sonoma) or later',
              'Apple Silicon (M1/M2/M3/M4) or Intel',
              '60 MB disk space',
              'Internet (only for AI features)',
            ]).map((item, i) => (
              <li key={i} className="text-[14px] text-[#aaa] font-normal flex items-start gap-3">
                <span className="text-[#F97316] mt-1">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Integrity */}
        <Reveal className="bg-[#0a0a0a] border border-[#222] p-8 mb-8" delay={60}>
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck size={20} className="text-[#F97316]" strokeWidth={1.5} />
            <h2 className="text-[18px] font-normal">{t.integrity}</h2>
          </div>
          <ul className="space-y-2">
            {(lang === 'zh' ? [
              '已通过 Apple 公证（Gatekeeper）',
              '已用 Developer ID 签名',
              'Universal Binary（同时支持 arm64 + x86_64）',
              'Sparkle 自动更新，EdDSA 签名验证',
            ] : [
              'Apple Notarized (Gatekeeper)',
              'Signed with Developer ID',
              'Universal Binary (arm64 + x86_64)',
              'Sparkle auto-update with EdDSA verification',
            ]).map((item, i) => (
              <li key={i} className="text-[14px] text-[#aaa] font-normal flex items-start gap-3">
                <span className="text-[#F97316] mt-1">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Other methods */}
        <Reveal className="mb-12">
          <h2 className="text-[18px] font-normal mb-5">{t.otherMethods}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherDownloads.map((m, i) => (
              <a
                key={i}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card bg-[#0a0a0a] border border-[#222] p-6 transition-all duration-300 hover:border-[#F97316]/40 no-underline block"
                style={{ borderRadius: 2 }}
              >
                <m.icon size={20} className="text-[#F97316] mb-3" strokeWidth={1.5} />
                <h3 className="text-[15px] text-[#ddd] font-normal mb-2">{m.title}</h3>
                <p className="text-[13px] text-[#888] font-mono break-all">{m.desc}</p>
              </a>
            ))}
          </div>
        </Reveal>

        {/* Version history */}
        <Reveal className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <History size={20} className="text-[#F97316]" strokeWidth={1.5} />
            <h2 className="text-[18px] font-normal">{t.versionHistory}</h2>
          </div>
          <div className="space-y-4">
            {versions.map((ver, i) => (
              <div
                key={i}
                className="feature-card bg-[#0a0a0a] border border-[#222] p-6 transition-all duration-300 hover:border-[#F97316]/40"
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[18px] font-mono text-[#ddd]">{ver.v}</h3>
                    {ver.current && (
                      <span className="text-[11px] px-2 py-0.5 bg-[#F97316]/20 text-[#F97316] tracking-wider uppercase">
                        {lang === 'zh' ? '当前' : 'Current'}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#777] font-mono">{ver.date} · {ver.size}</span>
                </div>
                <ul className="space-y-1.5 mt-3 mb-4">
                  {ver.changes.map((change, j) => (
                    <li key={j} className="text-[13px] text-[#aaa] font-normal flex items-start gap-2">
                      <span className="text-[#666] mt-0.5">·</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                  <a
                    href={ver.downloadUrl}
                    className={`btn-smooth inline-flex items-center gap-2 px-5 py-2 text-[13px] font-normal tracking-wider no-underline ${
                      ver.current
                        ? 'bg-[#F97316] text-[#111] border-none'
                        : 'bg-transparent border border-[#444] text-[#ccc] hover:border-[#F97316]/60 hover:text-[#F97316]'
                    }`}
                    style={{ borderRadius: 2 }}
                  >
                    <Download size={14} strokeWidth={1.5} />
                    {lang === 'zh' ? '下载此版本' : 'Download this version'}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#777] mt-4 text-center">
            <a href="https://github.com/hanhang-han/clipnote-release/releases" target="_blank" rel="noopener" className="text-[#F97316] no-underline hover:underline">
              {lang === 'zh' ? '查看 GitHub 全部版本 →' : 'View all releases on GitHub →'}
            </a>
          </p>
        </Reveal>

        {/* 支持渠道 */}
        <Reveal className="mb-12">
          <h2 className="text-[18px] font-normal mb-6 text-center">{t.supportTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportChannels.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card bg-[#0a0a0a] border border-[#222] p-6 text-center transition-all duration-300 hover:border-[#F97316]/40 no-underline block"
                style={{ borderRadius: 2 }}
              >
                <s.icon size={24} className="text-[#F97316] mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-[14px] text-[#ddd] font-normal mb-2">{s.title}</h3>
                <p className="text-[12px] text-[#888] whitespace-pre-line">{s.desc}</p>
              </a>
            ))}
          </div>
        </Reveal>

        {/* Update check */}
        <Reveal className="text-center text-[14px] text-[#888] mt-12 pt-8 border-t border-[#222]">
          <p className="font-normal mb-2">{t.updateDesc}</p>
        </Reveal>
      </div>
    </section>
  );
}
