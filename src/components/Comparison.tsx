import { Check, X, Crown } from 'lucide-react';

export default function Comparison() {
  return (
    <section id="comparison" className="py-24 px-4">
      <div className="max-w-4xl mx-auto rounded-3xl bg-gray-900 border border-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">版本对比</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
          {/* 免费版 */}
          <div className="space-y-4 p-6 rounded-2xl bg-gray-800/50 border border-gray-700">
            <h3 className="font-bold text-gray-400 text-center">免费版</h3>
            <p className="text-center text-gray-500 text-sm mb-4">基础剪贴板管理</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>50 条剪贴板历史</span></div>
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>极速搜索</span></div>
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>灵动岛交互</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">无限历史记录</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">便签功能</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">图片剪贴板</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">智能筛选标签</span></div>
            </div>
          </div>
          {/* Pro 版 */}
          <div className="space-y-4 p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Crown size={12} /> PRO
            </div>
            <h3 className="font-bold text-blue-400 text-center">Pro 版</h3>
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-white">¥28</span>
              <span className="text-gray-400 text-sm ml-1">一次性买断</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>免费版所有功能</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>无限历史记录</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>便签功能</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>图片剪贴板支持</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>智能筛选标签</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>iCloud 同步（即将推出）</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
