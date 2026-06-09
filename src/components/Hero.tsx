import { Download } from 'lucide-react';
import { useState, useRef } from 'react';
import { useLang } from '../i18n';

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

export default function Hero() {
  const { lang } = useLang();
  const downloadCount = getDownloadCount();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const t = {
    heading: lang === 'zh' ? '灵动岛上的 AI 剪贴板' : 'AI Clipboard on Dynamic Island',
    subtitle: lang === 'zh'
      ? '复制即保存，AI 自动翻译、总结、分析。灵动岛交互，不占桌面空间。'
      : 'Copy to save. AI translates, summarizes, analyzes. Dynamic Island UI, zero footprint.',
    cta: lang === 'zh' ? '免费下载' : 'Free Download',
    downloads: lang === 'zh' ? '次下载' : 'downloads',
    scrollHint: lang === 'zh' ? '下滑看更多' : 'Scroll for more',
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28">
      <div className="max-w-[640px] mx-auto mb-10">
        <h1 className="text-[48px] md:text-[60px] font-normal leading-[1.12] tracking-tight mb-6">
          {t.heading}
        </h1>
        <p className="text-[16px] text-[#bbb] mb-10 leading-relaxed">{t.subtitle}</p>

        {/* Download area */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => window.location.href = 'https://clipnote-api.renqingbu.workers.dev/api/stats/dl'}
            className="flex items-center gap-3 bg-[#F97316] text-[#111] border-none px-8 py-4 text-[15px] font-light tracking-wider cursor-pointer hover:opacity-85 transition-opacity"
            style={{ borderRadius: 2 }}
          >
            <Download size={18} strokeWidth={1.5} />
            <span>{t.cta}</span>
            <span className="text-[11px] opacity-60 font-mono ml-1">.dmg</span>
          </button>

          <div className="flex items-center gap-4 text-[13px] text-[#999] font-normal">
            <span>{downloadCount.toLocaleString()} {t.downloads}</span>
            <span className="text-[#444]">·</span>
            <span>macOS 14+</span>
            <span className="text-[#444]">·</span>
            <span>{lang === 'zh' ? 'Apple 公证' : 'Apple Notarized'}</span>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#888] font-mono font-normal mt-1 overflow-x-auto max-w-full">
            <span className="shrink-0">$</span>
            <span className="whitespace-nowrap">brew install --cask hanhang-han/tap/clipnote</span>
          </div>
        </div>
      </div>

      {/* Product showcase */}
      <div className="w-full max-w-[900px] mt-4">
        {!videoError ? (
          <div className="relative hero-video-enter border border-[#222] group" style={{ borderRadius: 2, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <video
              ref={videoRef}
              src="/videos/hero-island.mp4"
              poster="/videos/hero-poster.png"
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              className="w-full block"
              style={{ borderRadius: 2 }}
            />
            {/* Play button overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-[#111]/50 cursor-pointer border-none"
                style={{ borderRadius: 2 }}
                aria-label={lang === 'zh' ? '播放视频' : 'Play video'}
              >
                <div className="w-20 h-20 flex items-center justify-center bg-[#F97316]/90 hover:bg-[#F97316] transition-colors" style={{ borderRadius: '50%' }}>
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-[#111] ml-1.5" />
                </div>
              </button>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" style={{ borderRadius: '0 0 2px 2px' }} />
          </div>
        ) : (
          <div className="w-full bg-[#0a0a0a] flex items-center justify-center border border-[#222]" style={{ aspectRatio: '1280/832', borderRadius: 2 }}>
            <span className="text-[14px] text-[#888] font-normal">
              {lang === 'zh' ? '灵动岛交互预览' : 'Dynamic Island Preview'}
            </span>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <div className="mt-10 scroll-hint flex flex-col items-center gap-1.5">
        <span className="text-[11px] text-[#777] font-light tracking-widest uppercase">{t.scrollHint}</span>
        <span className="text-[12px] text-[#777]">↓</span>
      </div>
    </section>
  );
}
