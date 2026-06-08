import { useState } from 'react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

const faqs = {
  zh: [
    { q: '灵剪安全吗？会不会上传我的数据？', a: '所有数据仅存储在你的本地 Mac 上，灵剪不会联网上传任何内容。剪贴板数据完全由你自己掌控。' },
    { q: 'AI 助手是怎么工作的？', a: 'AI 助手基于 DeepSeek 大模型，在剪贴板内容旁以浮窗形式出现。它根据内容类型自动推荐操作：代码推荐分析、英文推荐翻译、长文推荐总结、图片推荐 OCR。支持多轮对话，可以继续追问。' },
    { q: 'AI 会读取我的剪贴板内容吗？', a: '只有在主动点击 AI 功能时，内容才会发送到 AI 服务进行处理。灵剪不会在后台自动扫描或上传你的剪贴板数据。AI 请求通过加密连接传输，服务端不存储用户内容。' },
    { q: 'AI 积分是什么？免费版有多少？', a: 'AI 功能使用积分制。免费用户每天获得 8 积分，Pro 用户每天 80 积分。不同操作消耗不同积分：翻译 1 分、总结/解释/润色 2 分、代码分析 3 分。积分每日重置，也可以购买额外积分。' },
    { q: '灵动岛在所有 Mac 上都能用吗？', a: '灵剪的灵动岛是软件模拟的浮窗交互，不是硬件功能。它支持所有 macOS 14 (Sonoma) 及以上版本的 Mac。推荐使用 macOS 15 (Sequoia) 以获得最佳体验。' },
    { q: '和 Mac 自带的剪贴板有什么区别？', a: 'Mac 系统剪贴板只能记住最近 1 条复制内容。灵剪可以记住最多 500 条，并且自动识别内容类型（文本、链接、代码、图片等）进行智能分类。' },
    { q: '灵剪和 Maccy、Paste 有什么区别？', a: '灵剪独创灵动岛交互，鼠标移到屏幕顶部自动展开，离开自动收起，不占桌面空间。Maccy 是免费开源的极简工具，Paste 是 ¥299/年的订阅制。灵剪免费版 100 条记录，Pro 仅 ¥18 一次买断，是 macOS 剪贴板工具中性价比最高的选择。' },
    { q: '¥18 是一次性买断吗？有订阅吗？', a: '是的，¥18 是一次性买断，永久使用所有 Pro 功能，没有任何订阅费用。' },
    { q: '怎么安装灵剪？', a: '官网下载 DMG 安装包，双击打开后将灵剪拖入「应用程序」文件夹即可。也可以用 Homebrew 安装：brew install --cask hanhang-han/tap/clipnote。已通过 Apple 公证，双击安装无安全警告。' },
    { q: '灵剪支持哪些内容类型？', a: '灵剪支持 7 种内容类型的自动识别：纯文本、链接（URL）、代码片段、富文本（RTF）、Markdown、图片。复制后自动分类，方便快速查找。' },
  ],
  en: [
    { q: 'Is CliperX safe? Will it upload my data?', a: 'All data is stored locally on your Mac. CliperX never uploads any content online. Your clipboard data is fully under your control.' },
    { q: 'How does the AI Assistant work?', a: 'The AI Assistant is powered by DeepSeek and appears as a popup next to your clipboard content. It auto-recommends actions based on content type: code → analyze, English → translate, long text → summarize, image → OCR. Supports multi-turn conversations.' },
    { q: 'Does AI read my clipboard content?', a: 'Content is only sent to the AI service when you actively click an AI feature. CliperX never scans or uploads clipboard data in the background. AI requests are encrypted and the server does not store user content.' },
    { q: 'What are AI credits? How many for free users?', a: 'AI features use a credit system. Free users get 8 credits/day, Pro users get 80/day. Different actions cost different credits: translate 1, summarize/explain/polish 2, code analysis 3. Credits reset daily, extra credits can be purchased.' },
    { q: 'Does Dynamic Island work on all Macs?', a: 'CliperX\'s Dynamic Island is a software-simulated floating UI, not a hardware feature. It supports all Macs running macOS 14 (Sonoma) or later. macOS 15 (Sequoia) is recommended for the best experience.' },
    { q: 'How is it different from the built-in Mac clipboard?', a: 'The Mac system clipboard only remembers the last copied item. CliperX remembers up to 500 items and auto-categorizes content types (text, links, code, images, etc.).' },
    { q: 'How does CliperX compare to Maccy and Paste?', a: 'CliperX features a unique Dynamic Island UI that auto-expands at the top of your screen. Maccy is a free open-source minimal tool, Paste is ¥299/year subscription. CliperX free = 100 items, Pro = ¥18 one-time purchase — the best value macOS clipboard manager.' },
    { q: 'Is ¥18 a one-time purchase? Any subscriptions?', a: 'Yes, ¥18 is a one-time purchase for permanent access to all Pro features. No subscriptions whatsoever.' },
    { q: 'How do I install CliperX?', a: 'Download the DMG installer from the website, open it and drag CliperX to your Applications folder. Or install via Homebrew: brew install --cask hanhang-han/tap/clipnote. Apple Notarized — no security warnings on install.' },
    { q: 'What content types does CliperX support?', a: 'CliperX auto-detects 7 content types: plain text, URLs, code snippets, rich text (RTF), Markdown, and images. Content is auto-categorized after copying for quick retrieval.' },
  ],
};

export default function FAQ() {
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const revealRef = useReveal();

  const items = faqs[lang];

  return (
    <section id="faq" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-3xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">faq</p>
          <h2 className="text-[48px] font-normal tracking-tight">{lang === 'zh' ? '常见问题' : 'FAQ'}</h2>
        </div>
        <div className="divide-y divide-[#222]">
          {items.map((faq, i) => (
            <div key={i} id={`faq-${i}`}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left cursor-pointer bg-transparent border-none"
              >
                <h3 className="text-[16px] text-[#ccc] font-light pr-4">{faq.q}</h3>
                <span className={`text-[18px] transition-colors shrink-0 ${openIndex === i ? 'text-[#F97316]' : 'text-[#666]'} font-light`}>
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIndex === i ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                <p className="text-[14px] text-[#888] font-light leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-[#666] text-center mt-12 font-light">
          {lang === 'zh' ? '还有其他问题？邮件联系 hanhang789@gmail.com' : 'More questions? Email hanhang789@gmail.com'}
        </p>
      </div>
    </section>
  );
}
