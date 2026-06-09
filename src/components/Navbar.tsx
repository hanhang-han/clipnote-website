import { useState, useEffect } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { useLang } from '../i18n';
import { isPromoVisible, onPromoChange } from './PromoBar';

const navLinks = [
  { href: '#island', zh: '灵动岛', en: 'Island' },
  { href: '#ai', zh: 'AI 助手', en: 'AI Assistant' },
  { href: '#features', zh: '功能', en: 'Features' },
  { href: '#comparison', zh: '价格', en: 'Price' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLang();
  const [promoUp, setPromoUp] = useState(isPromoVisible());

  useEffect(() => {
    return onPromoChange(() => setPromoUp(isPromoVisible()));
  }, []);

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      promoUp ? 'top-10' : 'top-0'
    } ${scrolled ? 'bg-[#111]/90 backdrop-blur-sm border-b border-[#222]' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <img src="/icon.png?v=3" alt="CliperX" className="w-7 h-7" />
          <span className="text-[15px] font-light tracking-wide text-white">{lang === 'zh' ? '灵剪' : 'CliperX'}</span>
          <span className="text-[11px] font-light tracking-widest uppercase text-[#777] hidden sm:inline">
            {lang === 'zh' ? 'CliperX' : '灵剪'}
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8 text-[15px] font-light">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="text-[#888] hover:text-white transition-colors no-underline">
              {link[lang]}
            </a>
          ))}
          <button
            onClick={toggle}
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            className="text-[12px] text-[#888] hover:text-white transition-colors cursor-pointer bg-transparent border border-[#333] px-2 py-1 tracking-wider"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <button
            onClick={() => window.location.href = 'https://clipnote-api.renqingbu.workers.dev/api/stats/dl'}
            className="flex items-center gap-2 text-[#F97316] border border-[#F97316] px-4 py-1.5 text-[13px] font-light tracking-wider hover:bg-[#F97316] hover:text-[#111] transition-all cursor-pointer bg-transparent"
          >
            <Download size={14} />
            {lang === 'zh' ? '免费下载' : 'Free Download'}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center gap-3">
          <button onClick={toggle} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'} className="text-[12px] text-[#888] hover:text-white transition-colors cursor-pointer bg-transparent border border-[#333] px-2 py-1 tracking-wider">
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? (lang === 'zh' ? '关闭菜单' : 'Close menu') : (lang === 'zh' ? '打开菜单' : 'Open menu')}
            className="text-[#888] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 sm:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#111] border-b border-[#222] px-6 pb-6">
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] text-[#888] hover:text-white transition-colors no-underline font-light"
              >
                {link[lang]}
              </a>
            ))}
            <button
              onClick={() => window.location.href = 'https://clipnote-api.renqingbu.workers.dev/api/stats/dl'}
              className="flex items-center justify-center gap-2 text-[#F97316] border border-[#F97316] px-4 py-2.5 text-[13px] font-light tracking-wider hover:bg-[#F97316] hover:text-[#111] transition-all cursor-pointer bg-transparent mt-2"
            >
              <Download size={14} />
              {lang === 'zh' ? '免费下载' : 'Free Download'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
