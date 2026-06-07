import { useLang } from '../i18n';

export default function Scenarios() {
  const { lang } = useLang();

  const scenarios = lang === 'zh' ? [
    { role: '程序员', solution: '灵动岛悬浮管理代码片段 + AI 代码分析' },
    { role: '设计师', solution: '图片自动分类 + AI OCR 提取图中文字' },
    { role: '运营 / 自媒体', solution: '便签记录灵感 + AI 翻译润色文案' },
    { role: '学生', solution: '链接自动保存 + AI 总结论文要点' },
  ] : [
    { role: 'Developer', solution: 'Dynamic Island manages code snippets + AI code analysis' },
    { role: 'Designer', solution: 'Auto image sorting + AI OCR text extraction' },
    { role: 'Marketing / Creator', solution: 'Notes for ideas + AI translate & polish copy' },
    { role: 'Student', solution: 'Auto-save links + AI summarize paper key points' },
  ];

  const t = {
    badge: lang === 'zh' ? '使用场景' : 'use cases',
    heading: lang === 'zh' ? '为你的工作流而生' : 'Built for your workflow',
  };

  return (
    <section id="scenarios" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-light tracking-tight">{t.heading}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#222]">
          {scenarios.map((s, i) => (
            <div key={i} className="bg-[#1a1a1a] p-10 hover:bg-[#1f1f1f] transition-colors">
              <p className="text-[13px] text-[#777] tracking-wider uppercase mb-6">{s.role}</p>
              <p className="text-[16px] text-[#aaa] font-light leading-relaxed">{s.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
