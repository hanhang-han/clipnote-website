import { FolderKanban, ArrowRightLeft, Clock, Lightbulb, Eye } from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

const steps = [
  {
    key: 'detect',
    Icon: Eye,
    title: { zh: '自动识别主题', en: 'Auto-detect Topics' },
    desc: {
      zh: '复制代码片段、产品文档、设计规范 — Jack 自动识别你在做什么项目，不需要手动分类。',
      en: 'Copy code snippets, product docs, design specs - Jack auto-detects what project you\'re working on. No manual categorization.',
    },
  },
  {
    key: 'group',
    Icon: FolderKanban,
    title: { zh: '智能归并内容', en: 'Smart Content Grouping' },
    desc: {
      zh: '相关内容自动归到同一个工作流。Bug 修复的报错信息、StackOverflow 方案、GitHub PR 链接 — 都在一个地方。',
      en: 'Related content auto-grouped into one workflow. Error logs, StackOverflow solutions, GitHub PR links - all in one place.',
    },
  },
  {
    key: 'timeline',
    Icon: Clock,
    title: { zh: '时间线回顾', en: 'Timeline Review' },
    desc: {
      zh: '每个工作流都有完整的时间线。周一复制的需求文档、周三的代码参考、周五的测试用例 — 脉络清晰。',
      en: 'Every workflow has a complete timeline. Monday\'s requirements doc, Wednesday\'s code reference, Friday\'s test cases - all connected.',
    },
  },
  {
    key: 'context',
    Icon: Lightbulb,
    title: { zh: '一键恢复上下文', en: 'One-click Context Restore' },
    desc: {
      zh: '打开工作流，Jack 自动加载全部相关上下文。不用回忆"那个链接是什么时候复制的"，直接开始工作。',
      en: 'Open a workflow and Jack loads all related context instantly. No more "when did I copy that link" - just start working.',
    },
  },
];

export default function WorkflowSection() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    badge: lang === 'zh' ? '工作流' : 'Workflows',
    heading: lang === 'zh' ? <>复制着复制着，<span className="text-[#F97316]">项目就自动整理好了</span></> : <>Keep copying, <span className="text-[#F97316]">projects organize themselves</span></>,
    desc: lang === 'zh'
      ? '不用手动创建项目、不用打标签。Jack 默默观察你的复制行为，自动发现你在做什么，把相关内容归到一起。'
      : 'No manual projects, no tagging. Jack quietly observes your copy behavior, auto-discovers what you\'re working on, and groups related content together.',
  };

  return (
    <section id="workflows" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-20">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
          <p className="text-[16px] text-[#bbb] max-w-xl mx-auto">{t.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className="feature-card bg-[#0a0a0a] border border-[#222] p-8 transition-all duration-500 hover:border-[#F97316]/40 hover:bg-[#0e0e0e]"
              style={{ borderRadius: 2, transitionDelay: `${i * 60}ms` }}
            >
              <div className="feature-icon transition-transform duration-500">
                <s.Icon size={24} strokeWidth={1.5} className="text-[#F97316] mb-4" />
              </div>
              <h3 className="text-[18px] text-[#ccc] font-normal mb-3">{s.title[lang]}</h3>
              <p className="text-[15px] text-[#aaa] font-normal leading-relaxed">{s.desc[lang]}</p>
            </div>
          ))}
        </div>

        {/* Workflow timeline mockup */}
        <div className="mt-12 bg-[#0a0a0a] border border-[#222] p-8 max-w-2xl mx-auto" style={{ borderRadius: 2 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="text-[13px] text-[#F97316] font-medium tracking-wider uppercase">
              {lang === 'zh' ? '活跃工作流' : 'Active Workflow'}
            </span>
          </div>
          <h4 className="text-[20px] text-[#ddd] font-normal mb-2">
            {lang === 'zh' ? 'SwiftUI 动画系统调研' : 'SwiftUI Animation Research'}
          </h4>
          <p className="text-[13px] text-[#888] mb-6">
            {lang === 'zh' ? '12 条剪贴板记录 · 3 天前开始 · 最近活跃 2 小时前' : '12 clipboard items · Started 3d ago · Active 2h ago'}
          </p>
          <div className="space-y-3">
            {[
              { t: zh => zh ? 'Apple WWDC 2025 动画专场转录' : 'WWDC 2025 Animation Session Transcript', time: zh => zh ? '3 天前' : '3d ago' },
              { t: zh => zh ? 'matchedGeometryEffect 官方文档片段' : 'matchedGeometryEffect Official Docs', time: zh => zh ? '2 天前' : '2d ago' },
              { t: zh => zh ? 'StackOverflow: phaseAnimator 最佳实践' : 'SO: phaseAnimator Best Practices', time: zh => zh ? '2 小时前' : '2h ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#666]" />
                  <span className="text-[14px] text-[#bbb] font-normal">{item.t(lang === 'zh')}</span>
                </div>
                <span className="text-[12px] text-[#666]">{item.time(lang === 'zh')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
