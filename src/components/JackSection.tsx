import { Sparkles, Brain, Eye, Zap } from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

const features = [
  {
    key: 'persona',
    Icon: Brain,
    title: { zh: '有记忆的 AI', en: 'AI with Memory' },
    desc: {
      zh: 'Jack 不是普通的 AI 助手。它记得你的使用习惯、工作模式、偏好风格，越用越懂你。',
      en: 'Jack is not an ordinary AI assistant. It remembers your habits, work patterns, and preferences - getting smarter with every interaction.',
    },
  },
  {
    key: 'modes',
    Icon: Eye,
    title: { zh: '三种工作模式', en: 'Three Working Modes' },
    desc: {
      zh: '全局记忆模式搜索全部历史，工作流模式聚焦当前项目，单条模式深度分析一段内容。随时切换，上下文不丢失。',
      en: 'Global mode searches all history, Workflow mode focuses on current project, Single mode deep-dives one item. Switch anytime, context preserved.',
    },
  },
  {
    key: 'push',
    Icon: Zap,
    title: { zh: '主动推送', en: 'Proactive Push' },
    desc: {
      zh: '不等你问。Jack 监测到重要内容时主动弹出建议 — 识别到代码推荐分析、英文推荐翻译、发现重复内容提醒清理。',
      en: 'Jack doesn\'t wait. It proactively suggests actions when it detects code, foreign text, or duplicate content - right where you copy.',
    },
  },
  {
    key: 'soul',
    Icon: Sparkles,
    title: { zh: 'Soul 学习系统', en: 'Soul Learning System' },
    desc: {
      zh: '每次对话 Jack 都在学习。Identity 定义人格，Memory 沉淀认知，Values 调节风格。你的 Jack 独一无二。',
      en: 'Jack learns from every conversation. Identity defines personality, Memory builds understanding, Values tune style. Your Jack is unique.',
    },
  },
];

export default function JackSection() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    badge: 'Jack AI',
    heading: lang === 'zh' ? <>不只是 AI 助手，是<span className="text-[#F97316]">你的记忆管家</span></> : <>Not just an assistant, <span className="text-[#F97316]">your memory管家</span></>,
    desc: lang === 'zh'
      ? 'Jack 是你剪贴板的 AI 大脑。它会记住、理解、预测 — 从被动工具到主动伙伴。'
      : 'Jack is the AI brain of your clipboard. It remembers, understands, and anticipates - from passive tool to proactive partner.',
  };

  return (
    <section id="jack" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-20">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
          <p className="text-[16px] text-[#bbb] max-w-xl mx-auto">{t.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.key}
              className="feature-card bg-[#0a0a0a] border border-[#222] p-8 transition-all duration-500 hover:border-[#F97316]/40 hover:bg-[#0e0e0e]"
              style={{ borderRadius: 2, transitionDelay: `${i * 60}ms` }}
            >
              <div className="feature-icon transition-transform duration-500">
                <f.Icon size={24} strokeWidth={1.5} className="text-[#F97316] mb-4" />
              </div>
              <h3 className="text-[18px] text-[#ccc] font-normal mb-3">{f.title[lang]}</h3>
              <p className="text-[15px] text-[#aaa] font-normal leading-relaxed">{f.desc[lang]}</p>
            </div>
          ))}
        </div>

        {/* Chat mockup */}
        <div className="mt-12 bg-[#0a0a0a] border border-[#222] p-8 max-w-2xl mx-auto" style={{ borderRadius: 2 }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
            <div className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center">
              <span className="text-[14px] text-[#F97316] font-medium">J</span>
            </div>
            <div>
              <p className="text-[13px] text-[#ddd] font-medium">Jack</p>
              <p className="text-[11px] text-[#888]">{lang === 'zh' ? '你的记忆管家' : 'Your memory管家'}</p>
            </div>
          </div>
          <p className="text-[15px] text-[#ccc] leading-relaxed">
            {lang === 'zh'
              ? '你好，我是 Jack。我看到你最近在关注 SwiftUI 的动画系统。你复制的几段代码里都涉及 matchedGeometryEffect 和 phaseAnimator。需要我帮你整理一份 SwiftUI 动画最佳实践吗？'
              : 'Hi, I\'m Jack. I notice you\'ve been looking into SwiftUI animations lately. The code snippets you copied involve matchedGeometryEffect and phaseAnimator. Want me to compile a SwiftUI animation best practices guide for you?'}
          </p>
        </div>
      </div>
    </section>
  );
}
