import { useState } from 'react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

const faqs = {
  zh: [
    { q: '灵剪安全吗？会不会上传我的数据？', a: '所有数据仅存储在你的本地 Mac 上，灵剪不会联网上传任何剪贴板内容。你的数据完全由你自己掌控。AI 请求通过加密连接传输，服务端不存储用户内容。' },
    { q: 'Jack AI 是怎么工作的？', a: 'Jack 是你的 AI 记忆管家，基于 DeepSeek 和智谱多模型。它会记住你的使用习惯、自动整理工作流、主动推送建议。你可以和 Jack 多轮对话，也可以让它上网搜索、分析数据、修复代码。' },
    { q: 'AI 会读取我的剪贴板内容吗？', a: '只有在主动点击 AI 功能或与 Jack 对话时，相关内容才会发送到 AI 服务处理。灵剪不会在后台自动扫描或上传你的剪贴板数据。' },
    { q: '什么是工作流？AI 怎么知道我在做什么？', a: 'Jack 观察你的复制行为，自动识别你在做的项目主题。相关内容自动归并到工作流中，形成时间线。比如你复制了 SwiftUI 代码、WWDC 视频转录、StackOverflow 答案 — Jack 会识别出"SwiftUI 动画调研"这个项目。' },
    { q: 'Pro 和 Ultra 有什么区别？免费版够用吗？', a: '免费版包含 100 条历史、基础 AI 功能，日常轻度使用完全够用。Pro（¥8/月或 ¥28 终身）解锁 500 条历史、工作流整理、今日摘要。Ultra（¥25/月）不限历史、不限 AI、含 Agent V2 联网搜索和主动推送。' },
    { q: '灵动岛在所有 Mac 上都能用吗？', a: '灵剪的灵动岛是软件模拟的浮窗交互，不是硬件功能。它支持所有 macOS 14 (Sonoma) 及以上版本的 Mac。推荐使用 macOS 15 (Sequoia) 或更新版本以获得最佳体验，macOS 26 支持 Liquid Glass 玻璃效果。' },
    { q: '和 Mac 自带的剪贴板有什么区别？', a: 'Mac 系统剪贴板只能记住最近 1 条复制内容。灵剪可以记住最多 500 条（Ultra 不限量），自动识别 7 种内容类型，支持全文搜索、AI 分析、工作流自动整理。' },
    { q: '灵剪和 Maccy、Paste 有什么区别？', a: '灵剪独创灵动岛交互，悬停展开、离开收起。配备 Jack AI 记忆管家 — 自动整理工作流、主动推送建议、多轮对话。Maccy 是免费开源极简工具，Paste 是 ¥299/年订阅。灵剪免费版 100 条，Pro ¥8/月或 ¥28 终身 — 性价比最高的选择。' },
    { q: '怎么安装灵剪？', a: '官网下载 DMG 安装包，双击打开后将灵剪拖入「应用程序」文件夹即可。也可用 Homebrew 安装：brew install --cask hanhang-han/tap/clipnote。已通过 Apple 公证，双击安装无安全警告。' },
    { q: '7 天免费试用怎么领取？到期会自动扣费吗？', a: '下载安装后，在 App 内账户页面点击"免费试用 7 天 Pro"即可。到期后自动恢复为免费版，不会自动扣费。如果你想继续使用 Pro，可以随时购买。' },
    { q: 'Jack 会学习我的使用习惯吗？我的数据安全吗？', a: 'Jack 的 Soul 系统会在本地学习你的使用偏好（如简洁度、技术深度偏好），这些学习数据只存储在你的 Mac 上。AI 对话内容在服务端加密传输，不持久化存储用户对话内容。' },
    { q: '灵剪支持哪些内容类型？', a: '灵剪支持 7 种内容类型的自动识别：纯文本、链接（URL）、代码片段、富文本（RTF）、Markdown、图片。复制后自动分类，方便快速查找。图片复制后自动 OCR 提取文字。' },
  ],
  en: [
    { q: 'Is CliperX safe? Will it upload my data?', a: 'All data is stored locally on your Mac. CliperX never uploads clipboard content. Your data is fully under your control. AI requests are encrypted and the server does not store user content.' },
    { q: 'How does Jack AI work?', a: 'Jack is your AI memory管家, powered by DeepSeek and Zhipu models. It remembers your habits, auto-organizes workflows, and proactively pushes suggestions. Have multi-turn conversations, web search, data analysis, code fixes - all through Jack.' },
    { q: 'Does AI read my clipboard content?', a: 'Content is only sent to the AI service when you actively click an AI feature or chat with Jack. CliperX never scans or uploads clipboard data in the background.' },
    { q: 'What are workflows? How does AI know what I am working on?', a: 'Jack observes your copy behavior and auto-detects project themes. Related content groups into workflows with timelines. E.g., if you copy SwiftUI code, WWDC transcripts, and SO answers - Jack recognizes "SwiftUI Animation Research" as a project.' },
    { q: 'What is the difference between Pro and Ultra? Is Free enough?', a: 'Free: 100 history, basic AI - great for light use. Pro (¥8/mo or ¥28 lifetime): 500 history, workflows, daily summary. Ultra (¥25/mo): unlimited history, unlimited AI, Agent V2 web search + proactive push.' },
    { q: 'Does Dynamic Island work on all Macs?', a: 'CliperX\'s Dynamic Island is a software-simulated floating UI, not hardware. It supports all Macs running macOS 14 (Sonoma) or later. macOS 15+ recommended. macOS 26 supports Liquid Glass effect.' },
    { q: 'How is it different from the built-in Mac clipboard?', a: 'Mac system clipboard only remembers the last copied item. CliperX remembers up to 500 items (unlimited for Ultra), auto-detects 7 content types, full-text search, AI analysis, and auto workflow organization.' },
    { q: 'How does CliperX compare to Maccy and Paste?', a: 'CliperX features a unique Dynamic Island UI with Jack AI memory管家 - auto workflow organization, proactive suggestions, multi-turn chat. Maccy is a free open-source minimal tool, Paste is ¥299/year. CliperX Free = 100 items, Pro = ¥8/mo or ¥28 lifetime.' },
    { q: 'How do I install CliperX?', a: 'Download the DMG installer, open it and drag CliperX to your Applications folder. Or via Homebrew: brew install --cask hanhang-han/tap/clipnote. Apple Notarized - no security warnings on install.' },
    { q: 'How does the 7-day trial work? Will I be charged after?', a: 'After installing, go to the Account page in the app and claim "7-day free Pro trial". It auto-reverts to Free after expiry - no auto-charge. You can purchase Pro anytime if you want to continue.' },
    { q: 'Does Jack learn from my usage? Is my data safe?', a: 'Jack\'s Soul system learns your preferences locally (verbosity, technical depth). This data stays on your Mac. AI conversation content is encrypted in transit and not persistently stored on the server.' },
    { q: 'What content types does CliperX support?', a: 'CliperX auto-detects 7 content types: plain text, URLs, code snippets, rich text (RTF), Markdown, and images. Content is auto-categorized after copying. Images get automatic OCR text extraction.' },
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
                <h3 className="text-[16px] text-[#ddd] font-normal pr-4">{faq.q}</h3>
                <span className={`text-[18px] transition-colors shrink-0 ${openIndex === i ? 'text-[#F97316]' : 'text-[#888]'} font-light`}>
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIndex === i ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                <p className="text-[15px] text-[#aaa] font-normal leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-[#888] text-center mt-12 font-normal">
          {lang === 'zh' ? '还有其他问题？邮件联系 hanhang789@gmail.com' : 'More questions? Email hanhang789@gmail.com'}
        </p>
      </div>
    </section>
  );
}
