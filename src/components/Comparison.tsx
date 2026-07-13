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

export default function Comparison() {
  const { lang } = useLang();
  const downloadCount = getDownloadCount();
  const revealRef = useReveal();

  const freeFeatures = lang === 'zh'
    ? ['100 条剪贴板历史', '灵动岛交互体验', 'AI 对话基础额度', '置顶和收藏', '基础 AI 能力（翻译/总结/OCR）']
    : ['100 clipboard history', 'Dynamic Island UI', 'Basic AI chat quota', 'Pin & favorites', 'Basic AI (translate/summarize/OCR)'];

  const proFeatures = lang === 'zh'
    ? ['免费版全部功能', '500 条历史记录', '30 天全文搜索', 'AI 对话充足额度', '归档 / 导出 / 便签', '图片剪贴板 / 富文本', '工作流自动整理', '今日摘要']
    : ['All free features', '500 history records', '30-day full-text search', 'Generous AI quota', 'Archive / Export / Notes', 'Image clipboard & rich text', 'Auto workflow organization', 'Daily summary'];

  const ultraFeatures = lang === 'zh'
    ? ['Pro 版全部功能', '无限剪贴板历史', '无限全文搜索', 'AI 对话不限量', 'Agent V2（联网搜索+工具）', 'Jack 主动推送', '优先客服支持']
    : ['All Pro features', 'Unlimited clipboard history', 'Unlimited full-text search', 'Unlimited AI chat', 'Agent V2 (web search+tools)', 'Jack proactive push', 'Priority support'];

  const t = {
    badge: lang === 'zh' ? '价格' : 'Pricing',
    heading: lang === 'zh' ? '简单定价，没有套路' : 'Simple pricing, no tricks',
    freeLabel: lang === 'zh' ? '免费版' : 'Free',
    freeDesc: lang === 'zh' ? '基础功能，永久免费' : 'Basic features, free forever',
    proLabel: 'Pro',
    proMonthly: lang === 'zh' ? '月度' : '/mo',
    proLifetime: lang === 'zh' ? '终身买断' : 'lifetime',
    ultraLabel: 'Ultra',
    ultraMonthly: lang === 'zh' ? '月度' : '/mo',
    trial: lang === 'zh' ? '7 天免费试用 Pro · 到期不自动扣费' : '7-day free Pro trial · No auto-charge',
    cta: lang === 'zh' ? '免费下载' : 'Free Download',
    startTrial: lang === 'zh' ? '免费试用 7 天' : 'Start 7-day trial',
    buy: lang === 'zh' ? '买断' : 'Buy',
    mostPopular: lang === 'zh' ? '最受欢迎' : 'Most popular',
    perMonth: lang === 'zh' ? '/月' : '/mo',
    footer: lang === 'zh'
      ? `${downloadCount.toLocaleString()} 次下载 · 支持支付宝 · Homebrew 安装`
      : `${downloadCount.toLocaleString()} downloads · Alipay · Homebrew install`,
  };

  return (
    <section id="comparison" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-[#0a0a0a] border border-[#222] p-10" style={{ borderRadius: 2 }}>
            <p className="text-[13px] text-[#bbb] tracking-wider uppercase mb-2">{t.freeLabel}</p>
            <p className="text-[14px] text-[#888] font-normal mb-8">{t.freeDesc}</p>
            <div className="mb-6">
              <span className="text-[32px] font-light text-white">¥0</span>
            </div>
            <div className="space-y-3">
              {freeFeatures.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[4px] h-[4px] rounded-full bg-[#666] shrink-0" />
                  <span className="text-[14px] text-[#aaa] font-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div className="bg-[#0a0a0a] border border-[#F97316]/40 relative" style={{ borderRadius: 2 }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-[#111] px-4 py-0.5 text-[11px] font-medium tracking-wider" style={{ borderRadius: 2 }}>
              {t.mostPopular}
            </div>
            <div className="bg-[#F97316]/10 border-b border-[#F97316]/20 px-10 py-4 text-center">
              <span className="text-[14px] text-[#F97316] font-light tracking-wide">{t.trial}</span>
            </div>

            <div className="p-10">
              <p className="text-[13px] text-[#F97316] tracking-wider uppercase mb-2">{t.proLabel}</p>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-[32px] font-light text-white">¥8</span>
                <span className="text-[13px] text-[#aaa] font-normal">{t.perMonth}</span>
              </div>
              <div className="mb-6">
                <span className="text-[14px] text-[#888] font-normal">
                  {lang === 'zh' ? '或 ¥28 终身买断' : 'or ¥28 lifetime'}
                </span>
              </div>

              <div className="space-y-3">
                {proFeatures.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#F97316] shrink-0" />
                    <span className="text-[14px] text-[#aaa] font-normal">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
                  className="bg-[#F97316] text-[#111] border-none px-6 py-3.5 text-[14px] font-light tracking-wider cursor-pointer hover:opacity-85 transition-opacity"
                  style={{ borderRadius: 2 }}
                >
                  {t.startTrial}
                </button>
              </div>
            </div>
          </div>

          {/* Ultra */}
          <div className="bg-[#0a0a0a] border border-[#222] p-10" style={{ borderRadius: 2 }}>
            <p className="text-[13px] text-[#bbb] tracking-wider uppercase mb-2">{t.ultraLabel}</p>
            <p className="text-[14px] text-[#888] font-normal mb-8">
              {lang === 'zh' ? '重度用户，火力全开' : 'Power users, full throttle'}
            </p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-[32px] font-light text-white">¥25</span>
              <span className="text-[13px] text-[#aaa] font-normal">{t.perMonth}</span>
            </div>

            <div className="space-y-3">
              {ultraFeatures.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[4px] h-[4px] rounded-full bg-[#F97316] shrink-0" />
                  <span className="text-[14px] text-[#aaa] font-normal">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
                className="w-full bg-transparent text-[#F97316] border border-[#F97316]/40 px-6 py-3.5 text-[14px] font-light tracking-wider cursor-pointer hover:bg-[#F97316]/10 transition-all"
                style={{ borderRadius: 2 }}
              >
                {t.cta}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => window.location.href = 'https://api.cliperx.com/api/stats/dl'}
            className="btn-smooth flex items-center gap-3 bg-[#F97316] text-[#111] border-none px-10 py-4 text-[16px] font-light tracking-wider cursor-pointer mx-auto"
            style={{ borderRadius: 2 }}
          >
            {t.startTrial}
          </button>
          <p className="text-[13px] text-[#888] mt-6 font-normal">{t.footer}</p>
        </div>
      </div>
    </section>
  );
}
