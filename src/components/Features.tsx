import { Infinity, Archive, ScanText, ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

export default function Features() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const features = lang === 'zh' ? [
    { Icon: Infinity, title: '永远存在岛上', desc: '复制即保存，永不丢失。重启 Mac 也在，换天也在。你的复制记录，一直都在灵动岛上等你。' },
    { Icon: Archive, title: '归档', desc: '重要内容一键归档，和日常复制区分开。项目代码、常用链接、重要文本，归档后随时找回。' },
    { Icon: ScanText, title: '自动 OCR', desc: '复制截图，文字自动提取。终端报错、设计稿里的文案、PDF 里没法选中的文字，复制图片就有了。' },
    { Icon: ArrowUpRight, title: '记录导出', desc: '选中的剪贴板内容一键导出为 TXT、JSON、Markdown。换电脑、做备份、分享给同事，数据永远在你手里。' },
  ] : [
    { Icon: Infinity, title: 'Always on the Island', desc: 'Copy to save, never lose. Survives restarts, survives days. Your clips are always there on the Dynamic Island.' },
    { Icon: Archive, title: 'Archive', desc: 'One-click archive for important content. Project code, frequent links, key text — archived items are always findable.' },
    { Icon: ScanText, title: 'Auto OCR', desc: 'Copy a screenshot, text is extracted automatically. Terminal errors, design copy, unselectable PDF text — just copy the image.' },
    { Icon: ArrowUpRight, title: 'Export', desc: 'Export selected clips as TXT, JSON, or Markdown. Switch computers, back up, share with teammates — your data stays yours.' },
  ];

  const more = lang === 'zh'
    ? ['7 种内容类型自动识别', '全文检索，毫秒响应', '自定义快捷键', '开机自启动', '纯本地存储，隐私安全']
    : ['7 content types auto-detected', 'Full-text search, millisecond response', 'Custom keyboard shortcuts', 'Launch at login', 'Local storage, privacy first'];

  const t = {
    badge: lang === 'zh' ? '基础能力' : 'core',
    heading: lang === 'zh' ? '复制，永远存在岛上' : 'Copy once, always on the island',
    desc: lang === 'zh'
      ? '你只管复制，灵剪帮你记住一切'
      : 'Just copy. ClipNote remembers everything.',
    more: lang === 'zh' ? '更多' : 'More',
  };

  return (
    <section id="features" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-4xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
          <p className="text-[16px] text-[#888]">{t.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-[#222] p-8" style={{ borderRadius: 2 }}>
              <f.Icon size={24} strokeWidth={1.5} className="text-[#F97316] mb-4" />
              <h3 className="text-[18px] text-[#ccc] font-normal mb-3">{f.title}</h3>
              <p className="text-[14px] text-[#999] font-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* More features */}
        <div className="text-center">
          <p className="text-[13px] text-[#666] font-light mb-4">{t.more}</p>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
            {more.map((item, i) => (
              <span key={i} className="text-[13px] text-[#999] font-light">
                {i > 0 && <span className="text-[#444] mx-2">·</span>}
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
