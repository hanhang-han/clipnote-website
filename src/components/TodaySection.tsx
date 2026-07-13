import { CalendarDays, ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

export default function TodaySection() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    badge: lang === 'zh' ? '今日' : 'Today',
    heading: lang === 'zh' ? <>每天早上，<span className="text-[#F97316]">看看昨天都做了什么</span></> : <>Every morning, <span className="text-[#F97316]">see what you did yesterday</span></>,
    desc: lang === 'zh'
      ? '今日视图自动生成每日摘要 — 活跃项目、关键内容、继续工作的入口。打开灵动岛，昨天的一切都在。'
      : 'Today view auto-generates daily summaries - active projects, key items, and jump-back-in entry points. Open the island, yesterday is all there.',
  };

  return (
    <section id="today" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Text side */}
          <div className="flex-1">
            <div ref={revealRef} className="reveal">
              <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
              <h2 className="text-[48px] font-normal tracking-tight mb-4 leading-[1.1]">{t.heading}</h2>
              <p className="text-[16px] text-[#bbb] leading-relaxed mb-8">{t.desc}</p>

              <div className="space-y-4">
                {[
                  { title: lang === 'zh' ? '每日智能摘要' : 'Daily Smart Summary', sub: lang === 'zh' ? 'AI 提炼昨天复制的核心内容，3 秒了解要点' : 'AI extracts key content from yesterday, 3s overview' },
                  { title: lang === 'zh' ? '活跃项目一览' : 'Active Projects at a Glance', sub: lang === 'zh' ? '哪些工作流更新了、哪些需要继续跟进' : 'Which workflows updated, which need follow-up' },
                  { title: lang === 'zh' ? '继续工作卡片' : 'Continue Working Cards', sub: lang === 'zh' ? '一键回到上次停下的地方，上下文全部恢复' : 'One-click back to where you left off, full context restored' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#F97316] shrink-0 mt-2" />
                    <div>
                      <p className="text-[15px] text-[#ddd] font-normal">{item.title}</p>
                      <p className="text-[13px] text-[#888] font-normal mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual side - daily summary mockup */}
          <div className="flex-1">
            <div className="bg-[#0a0a0a] border border-[#222] p-8" style={{ borderRadius: 2 }}>
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays size={16} strokeWidth={1.5} className="text-[#F97316]" />
                <span className="text-[13px] text-[#F97316] font-medium tracking-wider uppercase">
                  {lang === 'zh' ? '2026年7月12日 周一' : 'Mon, Jul 12, 2026'}
                </span>
              </div>
              <div className="space-y-4">
                <div className="bg-[#111] border border-[#1a1a1a] p-4" style={{ borderRadius: 2 }}>
                  <p className="text-[11px] text-[#888] uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '活跃项目' : 'Active Project'}
                  </p>
                  <p className="text-[15px] text-[#ddd] font-normal">
                    {lang === 'zh' ? 'SwiftUI 动画调研' : 'SwiftUI Animation Research'}
                  </p>
                  <p className="text-[12px] text-[#666] mt-1">
                    {lang === 'zh' ? '8 条新内容 · 2 小时活跃' : '8 new items · 2h active'}
                  </p>
                </div>
                <div className="bg-[#111] border border-[#1a1a1a] p-4" style={{ borderRadius: 2 }}>
                  <p className="text-[11px] text-[#888] uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '继续工作' : 'Continue Working'}
                  </p>
                  <p className="text-[15px] text-[#ddd] font-normal">
                    {lang === 'zh' ? 'API 文档翻译' : 'API Doc Translation'}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[12px] text-[#F97316]">
                    <ArrowRight size={12} strokeWidth={1.5} />
                    <span>{lang === 'zh' ? '继续对话' : 'Continue chat'}</span>
                  </div>
                </div>
                <div className="bg-[#111] border border-[#1a1a1a] p-4" style={{ borderRadius: 2 }}>
                  <p className="text-[11px] text-[#888] uppercase tracking-wider mb-2">
                    {lang === 'zh' ? '昨日统计' : 'Yesterday Stats'}
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[20px] text-[#ddd] font-light">47</p>
                      <p className="text-[11px] text-[#666]">{lang === 'zh' ? '条复制' : 'copies'}</p>
                    </div>
                    <div>
                      <p className="text-[20px] text-[#ddd] font-light">3</p>
                      <p className="text-[11px] text-[#666]">{lang === 'zh' ? '个项目' : 'projects'}</p>
                    </div>
                    <div>
                      <p className="text-[20px] text-[#ddd] font-light">12</p>
                      <p className="text-[11px] text-[#666]">{lang === 'zh' ? '次 AI 对话' : 'AI chats'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
