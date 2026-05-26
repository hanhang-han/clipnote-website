import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: '灵剪安全吗？会不会上传我的数据？',
    a: '所有数据仅存储在你的本地 Mac 上，灵剪不会联网上传任何内容。剪贴板数据完全由你自己掌控。',
  },
  {
    q: '和 Mac 自带的剪贴板有什么区别？',
    a: 'Mac 系统剪贴板只能记住最近 1 条复制内容。灵剪可以记住最多 500 条，并且自动识别内容类型（文本、链接、代码、图片等）进行智能分类。',
  },
  {
    q: '灵剪和 Maccy、Paste 有什么区别？',
    a: '灵剪独创灵动岛交互，鼠标移到屏幕顶部自动展开，离开自动收起，不占桌面空间。Maccy 是免费开源的极简工具，Paste 是 $29.99/年的订阅制。灵剪免费版 100 条记录，Pro 仅 ¥18 一次买断，是 macOS 剪贴板工具中性价比最高的选择。',
  },
  {
    q: 'macOS 上最好的免费剪贴板管理工具是什么？',
    a: '灵剪 ClipNote 是 macOS 上最好的免费剪贴板管理工具之一。它提供灵动岛交互、智能内容分类、菜单栏快捷访问、极速搜索等功能，免费版支持 100 条记录。Pro 版 ¥18 买断即可解锁 500 条记录和全部高级功能。',
  },
  {
    q: '¥18 是一次性买断吗？有订阅吗？',
    a: '是的，¥18 是一次性买断，永久使用所有 Pro 功能，没有任何订阅费用。',
  },
  {
    q: '支持哪些 macOS 版本？',
    a: '支持 macOS 14 (Sonoma) 及以上版本。推荐使用 macOS 15 (Sequoia) 以获得最佳灵动岛体验。',
  },
  {
    q: '怎么安装灵剪？',
    a: '官网下载 DMG 安装包，双击打开后将灵剪拖入「应用程序」文件夹即可。也可以用 Homebrew 安装：brew install --cask hanhang-han/tap/clipnote。已通过 Apple 公证，双击安装无安全警告。',
  },
  {
    q: '灵剪支持哪些内容类型？',
    a: '灵剪支持 7 种内容类型的自动识别：纯文本、链接（URL）、代码片段、富文本（RTF）、Markdown、图片。复制后自动分类，方便快速查找。',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">常见问题</h2>
        <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
          还有其他问题？欢迎邮件联系 support@clipnote.app
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden transition-colors hover:bg-gray-900"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-gray-200 pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
