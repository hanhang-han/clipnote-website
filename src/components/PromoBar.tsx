import { useState, useEffect } from 'react';
import { useLang } from '../i18n';

// 全局：让 Navbar 知道公告条是否可见
let _visible = true;
const listeners = new Set<() => void>();
export function isPromoVisible() { return _visible; }
export function onPromoChange(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); }

export default function PromoBar() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    _visible = visible;
    listeners.forEach(fn => fn());
  }, [visible]);

  if (!visible) return null;

  return (
    <div data-promo-bar className="fixed top-0 w-full z-[60] bg-[#1a1a1a] border-b border-[#F97316]/25">
      <div className="max-w-6xl mx-auto px-6 h-10 flex items-center justify-center gap-3 relative">
        <span className="text-[13px] text-[#ccc]">
          {lang === 'zh' ? '🎁 关注' : '🎁 Follow'}
        </span>
        <a
          href="https://xhslink.com/m/7OAhON5Terr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#F97316] no-underline hover:underline font-medium"
        >
          {lang === 'zh' ? '小红书「麦克斯」' : 'Xiaohongshu @Max'}
        </a>
        <span className="text-[13px] text-[#666]">{lang === 'zh' ? '或' : 'or'}</span>
        <a
          href="https://x.com/jch47643085"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#F97316] no-underline hover:underline font-medium"
        >
          X @jch47643085
        </a>
        <span className="text-[13px] text-[#ccc]">
          {lang === 'zh' ? '免费领取 Pro 激活码' : 'for a free Pro code'}
        </span>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-6 text-[#666] hover:text-white transition-colors bg-transparent border-none cursor-pointer text-[14px] leading-none"
          aria-label={lang === 'zh' ? '关闭' : 'Close'}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
