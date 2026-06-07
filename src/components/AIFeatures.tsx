import { useState, useRef, useEffect } from 'react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

function useLazyVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
  }, [shouldLoad]);

  return { containerRef, videoRef, shouldLoad };
}

interface CoreFeature {
  key: string;
  video?: string;
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
  details: { zh: string[]; en: string[] };
}

interface Capability {
  title: { zh: string; en: string };
  scenario: { zh: string; en: string };
}

const coreFeatures: CoreFeature[] = [
  {
    key: 'recommend',
    video: '/videos/ai-recommend.mp4',
    title: { zh: '智能推荐', en: 'Smart Recommend' },
    desc: { zh: '复制后自动推荐最合适的 AI 操作', en: 'Auto-suggests the best AI action after copying' },
    details: {
      zh: ['代码 → 推荐分析', '英文 → 推荐翻译', '长文 → 推荐总结', '图片 → 推荐 OCR'],
      en: ['Code → Suggest analyze', 'English → Suggest translate', 'Long text → Suggest summarize', 'Image → Suggest OCR'],
    },
  },
  {
    key: 'chat',
    title: { zh: 'AI 对话', en: 'AI Chat' },
    desc: { zh: '侧边栏多轮对话，连续追问不断线', en: 'Multi-turn conversation in sidebar, keep asking' },
    details: {
      zh: ['选中任意内容发起对话', '支持上下文连续追问', '对话历史自动保存', '随时回看之前的讨论'],
      en: ['Start chat from any content', 'Context-aware follow-up questions', 'Chat history auto-saved', 'Review past discussions anytime'],
    },
  },
  {
    key: 'search',
    video: '/videos/ai-search.mp4',
    title: { zh: '智能搜索', en: 'Smart Search' },
    desc: { zh: '自然语言搜索剪贴板历史，不用精确匹配', en: 'Search clipboard history in natural language' },
    details: {
      zh: ['说人话就能找到内容', '"上周复制的那个 Swift 函数"', '自动匹配语义，不只是关键词', '搜一次就能定位'],
      en: ['Just describe what you need', '"That Swift function from last week"', 'Semantic matching, not just keywords', 'Find it in one search'],
    },
  },
  {
    key: 'cleanup',
    video: '/videos/ai-cleanup.mp4',
    title: { zh: 'AI 清理', en: 'AI Cleanup' },
    desc: { zh: 'AI 理解内容含义，智能判断哪些该留、哪些该清', en: 'AI understands content semantics, decides what to keep and what to clean' },
    details: {
      zh: ['AI 语义识别重复内容，不只看文本相同', '智能判断临时验证码、一次性链接等过期内容', '保留重要代码片段和常用文本', '清理前 AI 分类展示，确认后一键清理'],
      en: ['AI semantic deduplication, not just text matching', 'Smart detection of expired content like verification codes', 'Keep important code snippets and frequent texts', 'AI categorizes items before cleanup, one-click confirm'],
    },
  },
];

const capabilities: Capability[] = [
  {
    title: { zh: '翻译', en: 'Translate' },
    scenario: {
      zh: '你在调一个英文 SDK 的 API，复制了文档里的一段说明。AI 识别到是英文技术文档，推荐翻译——点击后直接看到中文，代码格式和参数名完整保留，不用切到浏览器查翻译。',
      en: 'Working with an English SDK docs, you copy a paragraph. AI detects English technical text and suggests translate — one click gets you Chinese with code formatting intact. No browser switching.',
    },
  },
  {
    title: { zh: '总结', en: 'Summarize' },
    scenario: {
      zh: '产品经理发了一份 2000 字的需求文档，你只想快速了解要点。复制全文后 AI 推荐总结，3 秒提炼出 3 个核心需求项，附带优先级判断，不用逐字通读。',
      en: 'PM sends a 2000-word spec, you just need the gist. Copy all, AI suggests summarize — 3 key requirements extracted in 3 seconds with priority notes. No need to read every word.',
    },
  },
  {
    title: { zh: '代码分析', en: 'Code Analysis' },
    scenario: {
      zh: '从 GitHub Issue 里复制了一段报错的 Swift 代码，不知道哪行有问题。AI 分析后逐行标注——第 3 行的 force unwrap 会导致崩溃，建议改成 guard let 安全解包。',
      en: 'Copied crashing Swift code from a GitHub Issue, unsure which line. AI analyzes and marks line 3 — force unwrap causes the crash, suggests guard let for safe unwrapping.',
    },
  },
  {
    title: { zh: 'OCR', en: 'OCR' },
    scenario: {
      zh: '截了一张终端报错的图发给同事，但对方需要文字版才能搜索。复制截图后 AI 自动识别出文字，报错信息、堆栈路径一个不漏，直接粘贴就能用。',
      en: 'Screenshot a terminal error to share, but teammate needs text to search. Copy the image, AI extracts every character — error message, stack trace, file paths — ready to paste.',
    },
  },
  {
    title: { zh: '润色', en: 'Polish' },
    scenario: {
      zh: '写好的周报总觉得不够正式，"这周做了很多事，修了几个 bug" 太口语化了。AI 润色后变成"本周完成核心功能迭代，修复 3 项关键缺陷"，语气专业多了。',
      en: 'Weekly report feels too casual — "did a lot this week, fixed some bugs." AI polishes it to "Completed core feature iteration and resolved 3 critical defects." Much more professional.',
    },
  },
  {
    title: { zh: '修复代码', en: 'Fix Code' },
    scenario: {
      zh: '从博客复制了一段排序算法的代码，运行后数组越界崩溃。AI 定位到 for 循环里 i <= arr.count 应该是 i < arr.count，off-by-one 的经典错误，一行搞定。',
      en: 'Copied a sorting algorithm from a blog, crashes with index out of bounds. AI finds the classic off-by-one — i <= arr.count should be i < arr.count. One line fix.',
    },
  },
];

function FeatureShowcase({ feat, index, lang }: { feat: CoreFeature; index: number; lang: 'zh' | 'en' }) {
  const isEven = index % 2 === 1;
  const [videoError, setVideoError] = useState(false);
  const { containerRef, videoRef, shouldLoad } = useLazyVideo();

  const videoEl = feat.video && !videoError ? (
    <>
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={feat.video}
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          className="w-full block"
          style={{ borderRadius: 2 }}
        />
      ) : (
        <div className="w-full bg-[#0a0a0a]" style={{ aspectRatio: '1664/1080', borderRadius: 2 }} />
      )}
    </>
  ) : feat.key === 'chat' ? (
    <div className="w-full bg-[#0a0a0a] border border-[#222] p-6" style={{ borderRadius: 2, aspectRatio: '1664/1080' }}>
      <div className="flex flex-col gap-3 h-full justify-between">
        <div className="text-[11px] text-[#F97316] tracking-wider uppercase mb-2">AI Chat</div>
        <div className="flex flex-col gap-2.5">
          <div className="self-end bg-[#1a1a1a] border border-[#222] px-4 py-2 max-w-[75%]" style={{ borderRadius: 2 }}>
            <span className="text-[12px] text-[#888] font-light">{lang === 'zh' ? '这段代码的闭包是什么意思？' : 'What does the closure mean here?'}</span>
          </div>
          <div className="self-start bg-[#141414] border border-[#222] px-4 py-2 max-w-[85%]" style={{ borderRadius: 2 }}>
            <span className="text-[12px] text-[#777] font-light">{lang === 'zh' ? '这是一个逃逸闭包（@escaping），用于异步回调。当网络请求完成后...' : 'This is an escaping closure (@escaping), used for async callbacks. When the network request completes...'}</span>
          </div>
          <div className="self-end bg-[#1a1a1a] border border-[#222] px-4 py-2 max-w-[65%]" style={{ borderRadius: 2 }}>
            <span className="text-[12px] text-[#888] font-light">{lang === 'zh' ? '那 weak self 是必须的吗？' : 'Is weak self required?'}</span>
          </div>
          <div className="self-start bg-[#141414] border border-[#222] px-4 py-2 max-w-[80%]" style={{ borderRadius: 2 }}>
            <span className="text-[12px] text-[#777] font-light">{lang === 'zh' ? '在逃逸闭包中推荐使用 weak self 避免循环引用...' : 'Recommended in escaping closures to avoid retain cycles...'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#222]">
          <span className="text-[11px] text-[#666] font-mono">{lang === 'zh' ? '输入追问...' : 'Type follow-up...'}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full bg-[#0a0a0a] flex items-center justify-center" style={{ borderRadius: 2 }}>
      <span className="text-[14px] text-[#666] font-light">{feat.title[lang]}</span>
    </div>
  );

  const textEl = (
    <div className="flex flex-col justify-center">
      <h3 className="text-[24px] font-normal mb-3">{feat.title[lang]}</h3>
      <p className="text-[16px] text-[#888] font-light leading-relaxed mb-6">{feat.desc[lang]}</p>
      <div className="flex flex-col gap-2.5">
        {feat.details[lang].map((d, j) => (
          <div key={j} className="flex items-center gap-3">
            <div className="w-[4px] h-[4px] rounded-full bg-[#F97316] shrink-0" />
            <span className="text-[14px] text-[#777] font-light">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div ref={containerRef} className="w-full md:w-3/5">{videoEl}</div>
      <div className="w-full md:w-2/5">{textEl}</div>
    </div>
  );
}

export default function AIFeatures() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    badge: lang === 'zh' ? 'AI 助手' : 'AI Assistant',
    heading: lang === 'zh' ? <>你的剪贴板，<span className="text-[#F97316]">AI 来理解</span></> : <>Your clipboard, <span className="text-[#F97316]">understood by AI</span></>,
    desc: lang === 'zh'
      ? '复制内容后，AI 浮窗自动出现。根据内容类型智能推荐操作。'
      : 'AI popup appears after copying. Smart recommendations based on content type.',
    capabilitiesBadge: lang === 'zh' ? 'AI 能力' : 'AI Capabilities',
  };

  return (
    <section id="ai" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div ref={revealRef} className="reveal text-center mb-20">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
          <p className="text-[16px] text-[#888] max-w-lg mx-auto">{t.desc}</p>
        </div>

        {/* Core interaction showcases */}
        <div className="flex flex-col gap-24 mb-32">
          {coreFeatures.map((feat, i) => (
            <FeatureShowcase key={feat.key} feat={feat} index={i} lang={lang} />
          ))}
        </div>

        {/* AI capabilities grid */}
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-10 text-center">{t.capabilitiesBadge}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#222] p-8" style={{ borderRadius: 2 }}>
                <h4 className="text-[16px] text-[#ccc] font-light mb-3">{cap.title[lang]}</h4>
                <p className="text-[14px] text-[#777] font-light leading-relaxed">{cap.scenario[lang]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="text-center mt-20">
          <p className="text-[20px] text-[#aaa] font-light leading-relaxed max-w-2xl mx-auto md:whitespace-nowrap">
            {lang === 'zh'
              ? '所有 AI 能力，就在你复制的地方。不用打开任何其他工具。'
              : 'All AI capabilities, right where you copy. No need to open anything else.'}
          </p>
        </div>
      </div>
    </section>
  );
}
