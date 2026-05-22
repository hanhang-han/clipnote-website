import { useState, useEffect } from 'react';

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
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">功能</a>
          <a href="#mockup" className="hover:text-white transition-colors">演示</a>
          <a href="#comparison" className="hover:text-white transition-colors">版本对比</a>
        </div>
      </div>
    </nav>
  );
}
