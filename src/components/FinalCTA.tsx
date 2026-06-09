import { useLang } from '../i18n';
import { useReveal } from '../hooks/useScrollReveal';

export default function FinalCTA() {
  const { lang } = useLang();
  const revealRef = useReveal();

  const t = {
    heading1: lang === 'zh' ? '试试看，' : 'Try it, ',
    heading2: lang === 'zh' ? '复制第一条就开始了' : 'your first copy starts now',
    desc: lang === 'zh' ? '免费下载，支持 Intel 和 Apple 芯片，复制点什么，灵剪就开始工作了' : 'Free download. Supports Intel & Apple Silicon. Copy something. CliperX starts working.',
    cta: lang === 'zh' ? '免费下载' : 'Free Download',
    xiaohongshu: lang === 'zh' ? '小红书「麦克斯」' : 'Xiaohongshu @Max',
    xNote: 'X @jch47643085',
    proTip: lang === 'zh' ? '关注免费领 Pro' : 'Follow for free Pro code',
  };

  return (
    <section className="py-32 px-6 border-t border-[#222]">
      <div ref={revealRef} className="reveal max-w-3xl mx-auto text-center">
        <h2 className="text-[48px] font-normal tracking-tight mb-4">
          {t.heading1}<span className="text-[#F97316]">{t.heading2}</span>
        </h2>
        <p className="text-[16px] text-[#bbb] font-normal mb-12">{t.desc}</p>

        <button
          onClick={() => window.location.href = 'https://clipnote-api.renqingbu.workers.dev/api/stats/dl'}
          className="bg-[#F97316] text-[#111] border-none px-10 py-4 text-[16px] font-light tracking-wider cursor-pointer hover:opacity-85 transition-opacity"
          style={{ borderRadius: 2 }}
        >
          {t.cta}
        </button>

        <div className="mt-10 flex justify-center gap-6">
          <a href="https://xhslink.com/m/7OAhON5Terr" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#aaa] font-normal no-underline hover:text-white transition-colors">
            {t.xiaohongshu}
          </a>
          <span className="text-[13px] text-[#444]">·</span>
          <a href="https://x.com/jch47643085" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#aaa] font-normal no-underline hover:text-white transition-colors">
            {t.xNote}
          </a>
          <span className="text-[13px] text-[#444]">·</span>
          <span className="text-[13px] text-[#999] font-normal">{t.proTip}</span>
        </div>
      </div>
    </section>
  );
}
