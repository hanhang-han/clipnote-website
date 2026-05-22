/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import MockupSection from './components/MockupSection';
import Comparison from './components/Comparison';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MockupSection />
        <Comparison />
      </main>
      <footer className="py-12 text-center text-gray-500 border-t border-white/5">
        <p className="mb-2">© 2026 灵剪 (ClipNote). 版权所有.</p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="mailto:support@clipnote.app" className="hover:text-blue-400">联系我们</a>
          <span className="text-gray-700">|</span>
          <span>隐私政策</span>
          <span className="text-gray-700">|</span>
          <span>用户协议</span>
        </div>
      </footer>
    </div>
  );
}
