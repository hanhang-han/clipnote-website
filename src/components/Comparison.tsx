import { useState, useEffect } from 'react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

function getDownloadCount(): number {
  const baseCount = 1483;
  const startDate = new Date('2026-05-29T00:00:00+08:00');
  const now = new Date();
  const hoursSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60));
  if (hoursSinceStart <= 0) return baseCount;
  const daysSinceStart = Math.floor(hoursSinceStart / 24);
  const currentHour = hoursSinceStart % 24;
  let total = 0;
  for (let d = 0; d < daysSinceStart; d++) {
    const date = new Date(startDate.getTime() + d * 86400000);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    total += 5 + ((seed * 7 + 13) % 11);
  }
  const todaySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const todayTotal = 5 + ((todaySeed * 7 + 13) % 11);
  total += Math.floor(todayTotal * currentHour / 24);
  return baseCount + total;
}

function useCountdown(target: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const ts = new Date(target).getTime();
    const calc = () => {
      const diff = ts - Date.now();
      if (diff <= 0) return null;
      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      };
    };
    setLeft(calc());
    const id = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export default function Comparison() {
  const { lang } = useLang();
  const downloadCount = getDownloadCount();
  const revealRef = useReveal();
  const countdown = useCountdown('2026-07-01T00:00:00+08:00');

  const isBeforeDeadline = countdown !== null;
  const currentPrice = isBeforeDeadline ? '¥18' : '¥28';

  const freeFeatures = lang === 'zh'
    ? ['100 条剪贴板历史', '灵动岛交互体验', 'AI 助手 8 积分/天', '置顶和收藏']
    : ['100 clipboard history', 'Dynamic Island UI', 'AI Assistant 8 credits/day', 'Pin & favorites'];

  const proFeatures = lang === 'zh'
    ? ['免费版全部功能', '500 条历史记录', '全文搜索 · 智能分类', 'AI 助手 80 积分/天', '归档 · 导出 · 便签', '图片剪贴板 · 富文本']
    : ['All free features', '500 history records', 'Full-text search & smart filters', 'AI Assistant 80 credits/day', 'Archive · Export · Notes', 'Image clipboard & rich text'];

  const t = {
    badge: lang === 'zh' ? '价格' : 'pricing',
    heading: lang === 'zh' ? '先试后买，没有套路' : 'Try first, buy when ready',
    freeLabel: lang === 'zh' ? '免费版' : 'Free',
    freeDesc: lang === 'zh' ? '基础功能，永久免费' : 'Basic features, free forever',
    proLabel: lang === 'zh' ? 'Pro' : 'Pro',
    buyout: lang === 'zh' ? '一次性买断' : 'one-time purchase',
    cta: lang === 'zh' ? '免费下载' : 'Free Download',
    footer: lang === 'zh'
      ? `${downloadCount.toLocaleString()} 次下载 · 支持支付宝 · Homebrew 安装`
      : `${downloadCount.toLocaleString()} downloads · Alipay supported · Homebrew install`,
  };

  return (
    <section id="comparison" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-4xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
        </div>

        {/* Free vs Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-[#0a0a0a] border border-[#222] p-10" style={{ borderRadius: 2 }}>
            <p className="text-[13px] text-[#bbb] tracking-wider uppercase mb-2">{t.freeLabel}</p>
            <p className="text-[14px] text-[#888] font-normal mb-8">{t.freeDesc}</p>
            <div className="space-y-4">
              {freeFeatures.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[4px] h-[4px] rounded-full bg-[#666] shrink-0" />
                  <span className="text-[14px] text-[#aaa] font-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div className="bg-[#0a0a0a] border border-[#F97316]/30 relative overflow-hidden" style={{ borderRadius: 2 }}>
            {/* Trial banner */}
            <div className="bg-[#F97316]/10 border-b border-[#F97316]/20 px-10 py-4 text-center">
              <span className="text-[14px] text-[#F97316] font-light tracking-wide">
                {lang === 'zh' ? '7 天免费试用 · 到期不自动扣费' : '7-day free trial · No auto-charge after expiry'}
              </span>
            </div>

            <div className="p-10">
              <p className="text-[13px] text-[#F97316] tracking-wider uppercase mb-2">{t.proLabel}</p>
              <div className="mb-2">
                {isBeforeDeadline && (
                  <span className="text-[14px] text-[#888] font-normal line-through mr-2">¥28</span>
                )}
                <span className="text-[32px] font-light leading-none text-white">{currentPrice}</span>
                <span className="text-[13px] text-[#aaa] font-normal ml-2">{t.buyout}</span>
              </div>

              {/* Countdown */}
              {isBeforeDeadline && countdown && (
                <p className="text-[13px] text-[#aaa] font-normal mb-6">
                  {lang === 'zh'
                    ? `限时优惠 · 剩余 ${countdown.d} 天 ${countdown.h} 小时`
                    : `Limited offer · ${countdown.d}d ${countdown.h}h remaining`}
                </p>
              )}

              <div className="space-y-4">
                {proFeatures.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#F97316] shrink-0" />
                    <span className="text-[14px] text-[#aaa] font-normal">{item}</span>
                  </div>
                ))}
              </div>

              {/* Dual CTA */}
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
                  className="bg-[#F97316] text-[#111] border-none px-6 py-3.5 text-[14px] font-light tracking-wider cursor-pointer hover:opacity-85 transition-opacity"
                  style={{ borderRadius: 2 }}
                >
                  {lang === 'zh' ? '免费试用 7 天' : 'Start 7-day trial'}
                </button>
                <button
                  onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
                  className="bg-transparent text-[#F97316] border border-[#F97316]/40 px-6 py-3 text-[13px] font-light tracking-wider cursor-pointer hover:bg-[#F97316]/10 transition-all"
                  style={{ borderRadius: 2 }}
                >
                  {lang === 'zh' ? `${currentPrice} 买断` : `${currentPrice} Buy`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
            className="bg-[#F97316] text-[#111] border-none px-10 py-4 text-[16px] font-light tracking-wider cursor-pointer hover:opacity-85 transition-opacity"
            style={{ borderRadius: 2 }}
          >
            {t.cta}
          </button>
          <p className="text-[13px] text-[#888] mt-6 font-normal">{t.footer}</p>
        </div>
      </div>
    </section>
  );
}
