import { useState } from 'react';
import { useLang } from '../i18n';
import { useLazyVideo } from '../hooks/useLazyVideo';
import { useReveal } from '../hooks/useScrollReveal';

export default function MockupSection() {
  const { lang } = useLang();
  const [videoError, setVideoError] = useState(false);
  const { containerRef, videoRef, shouldLoad } = useLazyVideo();
  const revealRef = useReveal();

  const t = {
    badge: lang === 'zh' ? '灵动岛交互' : 'dynamic island',
    heading: lang === 'zh' ? '鼠标移到顶部' : 'Move to the Top',
    desc: lang === 'zh'
      ? '灵动岛常驻屏幕顶部，悬停展开、离开收起，不打断你的工作流。'
      : 'Always at the top. Hover to expand, leave to collapse. Never interrupts your flow.',
    features: lang === 'zh' ? [
      { title: '悬停展开', desc: '鼠标移到屏幕顶部，灵动岛自动展开完整面板' },
      { title: '快捷唤出', desc: '⌘⇧V 随时调出，不用移动鼠标' },
      { title: '自动收起', desc: '鼠标离开即收，不占桌面空间，零干扰' },
    ] : [
      { title: 'Hover to Expand', desc: 'Move mouse to screen top, island auto-expands' },
      { title: 'Quick Summon', desc: '⌘⇧V anytime, no need to move your mouse' },
      { title: 'Auto Collapse', desc: 'Leaves when you leave. Zero desktop footprint' },
    ],
  };

  return (
    <section id="island" className="py-32 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <div ref={revealRef} className="reveal text-center mb-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#F97316] mb-4">{t.badge}</p>
          <h2 className="text-[48px] font-normal tracking-tight mb-4">{t.heading}</h2>
          <p className="text-[16px] text-[#bbb] max-w-lg mx-auto">{t.desc}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Video */}
          <div ref={containerRef} className="w-full md:w-3/5 shrink-0">
            {!videoError && shouldLoad ? (
              <video
                ref={videoRef}
                src="/videos/island-interaction.mp4"
                muted
                loop
                playsInline
                onError={() => setVideoError(true)}
                className="w-full block"
                style={{ borderRadius: 2 }}
              />
            ) : !shouldLoad ? (
              <div className="w-full bg-[#0a0a0a]" style={{ aspectRatio: '1280/832', borderRadius: 2 }} />
            ) : (
              <div className="w-full bg-[#0a0a0a] flex items-center justify-center" style={{ aspectRatio: '1280/832', borderRadius: 2 }}>
                <span className="text-[14px] text-[#888] font-normal">
                  {lang === 'zh' ? '灵动岛交互预览' : 'Dynamic Island Preview'}
                </span>
              </div>
            )}
          </div>

          {/* Feature list */}
          <div className="w-full md:w-2/5 flex flex-col gap-8">
            {t.features.map((f, i) => (
              <div key={i}>
                <h3 className="text-[16px] text-[#ddd] font-medium mb-1">{f.title}</h3>
                <p className="text-[15px] text-[#aaa] font-normal leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
