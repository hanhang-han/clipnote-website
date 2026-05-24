import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
            <span className="text-xs font-bold text-white">剪</span>
          </div>
          <span className="text-lg font-bold">灵剪</span>
          <span className="text-xs text-gray-500 hidden sm:inline">ClipNote</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors hidden sm:inline">功能</a>
          <a href="#scenarios" className="hover:text-white transition-colors hidden sm:inline">场景</a>
          <a href="#mockup" className="hover:text-white transition-colors hidden sm:inline">演示</a>
          <a href="#comparison" className="hover:text-white transition-colors hidden sm:inline">价格</a>
          <a
            href="/灵剪.dmg"
            download
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600/80 hover:bg-blue-500 rounded-full text-white text-sm font-medium transition-colors no-underline"
          >
            <Download size={14} />
            <span className="hidden sm:inline">免费下载</span>
            <span className="sm:hidden">下载</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
