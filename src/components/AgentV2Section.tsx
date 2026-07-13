import { Globe, Wrench, Cpu, ChevronRight } from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

const tools = [
  { key: 'web', title: { zh: '联网搜索', en: 'Web Search' }, desc: { zh: '实时搜索最新文档、GitHub Issue、StackOverflow 答案', en: 'Real-time search for latest docs, GitHub issues, StackOverflow answers' } },
  { key: 'calc', title: { zh: '数据分析', en: 'Data Analysis' }, desc: { zh: '粘贴数据，AI 自动分析趋势、生成图表解读', en: 'Paste data, AI analyzes trends and generates chart interpretations' } },
  { key: 'code', title: { zh: '代码执行', en: 'Code Execution' }, desc: { zh: '复制代码片段，AI 帮你跑一遍、定位问题、给出修复', en: 'Copy code, AI runs it, finds issues, suggests fixes' } },
  { key: 'translate', title: { zh: '深度翻译', en: 'Deep Translate' }, desc: { zh: '不只是翻译 — 保留技术术语、代码格式、文档结构', en: 'Not just translate - preserves tech terms, code format, document structure' } },
];

export default function AgentV2Section() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    badge: 'Agent V2',
    heading: lang === 'zh' ? <>Jack 可以<span className="text-[#F97316]">上网搜索、分析数据、写代码</span></> : <>Jack can <span className="text-[#F97316]">search the web, analyze data, write code</span></>,
    desc: lang === 'zh'
      ? '第二代 Agent 系统 — 不只是聊天，Jack 能主动使用工具、联网搜索、执行代码，像真正的开发者伙伴一样工作。'
      : 'Second-gen Agent system - beyond chat, Jack actively uses tools, searches the web, executes code, working like a real dev partner.',
    thinking: lang === 'zh' ? '思考过程透明可见' : 'Transparent thinking process',
    thinkingDesc: lang === 'zh'
      ? '每一步推理、每一个工具调用都有清晰的展示。你知道 Jack 是怎么得出结论的。'
      : 'Every reasoning step, every tool call is clearly shown. You know how Jack reached its conclusion.',
    models: lang === 'zh' ? '多模型可选' : 'Multiple Models',
    modelsDesc: lang === 'zh'
      ? '快速模式用 DeepSeek v4-flash，深度分析用 v4-pro，图片识别用智谱 GLM-4V。不同场景，不同模型。'
      : 'Fast mode with DeepSeek v4-flash, deep analysis with v4-pro, image recognition with GLM-4V. Different scenarios, different models.',
  };

  return (
    <section id="agent" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-20">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
          <p className="text-[16px] text-[#bbb] max-w-xl mx-auto">{t.desc}</p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {tools.map((tool, i) => (
            <div
              key={tool.key}
              className="bg-[#0a0a0a] border border-[#222] p-6 transition-all duration-500 hover:border-[#F97316]/40"
              style={{ borderRadius: 2, transitionDelay: `${i * 60}ms` }}
            >
              <h4 className="text-[16px] text-[#ddd] font-normal mb-2">{tool.title[lang]}</h4>
              <p className="text-[14px] text-[#888] font-normal leading-relaxed">{tool.desc[lang]}</p>
            </div>
          ))}
        </div>

        {/* Two features side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] border border-[#222] p-8" style={{ borderRadius: 2 }}>
            <div className="flex items-center gap-3 mb-4">
              <Cpu size={24} strokeWidth={1.5} className="text-[#F97316]" />
              <h3 className="text-[18px] text-[#ccc] font-normal">{t.thinking}</h3>
            </div>
            <p className="text-[15px] text-[#aaa] font-normal leading-relaxed">{t.thinkingDesc}</p>
            {/* Thinking chain mockup */}
            <div className="mt-6 space-y-2">
              {[
                lang === 'zh' ? '分析用户问题：需要查找最新的 SwiftUI 动画 API' : 'Analyzing: need latest SwiftUI animation API',
                lang === 'zh' ? '决定使用联网搜索 → 搜索 "SwiftUI animation WWDC 2025"' : 'Decision: web search "SwiftUI animation WWDC 2025"',
                lang === 'zh' ? '找到 3 个相关结果 → 提取关键信息 → 组织回答' : 'Found 3 results → extracted key info → composed answer',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-[#888]">
                  <ChevronRight size={12} className="text-[#F97316] shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222] p-8" style={{ borderRadius: 2 }}>
            <div className="flex items-center gap-3 mb-4">
              <Globe size={24} strokeWidth={1.5} className="text-[#F97316]" />
              <h3 className="text-[18px] text-[#ccc] font-normal">{t.models}</h3>
            </div>
            <p className="text-[15px] text-[#aaa] font-normal leading-relaxed">{t.modelsDesc}</p>
            {/* Model badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: lang === 'zh' ? '快速 · DeepSeek v4-flash' : 'Fast · DS v4-flash', color: '#3fb950' },
                { label: lang === 'zh' ? '智能 · DeepSeek v4-pro' : 'Smart · DS v4-pro', color: '#58a6ff' },
                { label: lang === 'zh' ? '视觉 · 智谱 GLM-4V' : 'Vision · GLM-4V', color: '#a371f7' },
              ].map((m, i) => (
                <span
                  key={i}
                  className="text-[11px] px-3 py-1 border font-normal"
                  style={{ borderRadius: 2, color: m.color, borderColor: `${m.color}40`, background: `${m.color}10` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
