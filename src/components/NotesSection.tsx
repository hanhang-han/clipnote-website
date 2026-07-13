import { StickyNote, Palette } from 'lucide-react';
import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

const colors = ['#F97316', '#3fb950', '#58a6ff', '#a371f7', '#f85149', '#d29922'];

export default function NotesSection() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    badge: lang === 'zh' ? '便签' : 'Notes',
    heading: lang === 'zh' ? <>随手记，<span className="text-[#F97316]">彩色标签</span>，永不丢失</> : <>Jot it down, <span className="text-[#F97316]">color-coded</span>, never lost</>,
    desc: lang === 'zh'
      ? '剪贴板内容一键转为便签。六种颜色分类，富文本编辑。临时灵感、代码备忘、待办清单 — 都在便签里。'
      : 'One-click convert clipboard items to notes. Six colors, rich text editing. Quick ideas, code memos, todo lists - all in notes.',
  };

  return (
    <section id="notes" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Text side */}
          <div className="flex-1">
            <div ref={revealRef} className="reveal">
              <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
              <h2 className="text-[48px] font-normal tracking-tight mb-4 leading-[1.1]">{t.heading}</h2>
              <p className="text-[16px] text-[#bbb] leading-relaxed mb-8">{t.desc}</p>

              <div className="flex items-center gap-2 mb-4">
                <Palette size={14} strokeWidth={1.5} className="text-[#888]" />
                <span className="text-[12px] text-[#888] tracking-wider uppercase">
                  {lang === 'zh' ? '6 种颜色分类' : '6 color categories'}
                </span>
              </div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <div
                    key={c}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-125"
                    style={{ background: c, opacity: 0.85 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Visual side - notes mockup */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              {[
                { text: lang === 'zh' ? 'WWDC 动画 API 备忘\nmatchedGeometryEffect\nphaseAnimator\nkeyframeAnimator' : 'WWDC Animation API Notes\nmatchedGeometryEffect\nphaseAnimator\nkeyframeAnimator', color: '#58a6ff' },
                { text: lang === 'zh' ? 'TODO\n- 更新 README\n- 写 Release Notes\n- 测试 iPad 适配' : 'TODO\n- Update README\n- Write Release Notes\n- Test iPad layout', color: '#3fb950' },
                { text: lang === 'zh' ? '会议记录 7/10\n讨论了 v4.1 的设计方向\n决定用新配色方案' : 'Meeting 7/10\nDiscussed v4.1 design\nDecided on new palette', color: '#a371f7' },
                { text: lang === 'zh' ? '灵感\n做个 Mac 剪贴板工具\n用灵动岛交互\nAI 自动分类内容' : 'Inspiration\nBuild a Mac clipboard tool\nDynamic Island interaction\nAI auto-categorize', color: '#F97316' },
              ].map((note, i) => (
                <div
                  key={i}
                  className="p-4 text-[12px] leading-relaxed text-[#ddd] border border-[#222] whitespace-pre-line font-normal"
                  style={{ borderRadius: 2, background: `${note.color}0a`, borderColor: `${note.color}30`, borderLeftWidth: 3, borderLeftColor: note.color }}
                >
                  {note.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
