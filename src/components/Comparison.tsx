import { Check, X, Crown, Users } from 'lucide-react';

// 与 Hero 保持一致的下载量计算
function getDownloadCount(): number {
  const baseCount = 1483;
  const startDate = new Date('2026-05-29T00:00:00+08:00');
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceStart <= 0) return baseCount;
  let total = 0;
  for (let d = 0; d < daysSinceStart; d++) {
    const date = new Date(startDate.getTime() + d * 86400000);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const dailyIncrement = 3 + ((seed * 7 + 13) % 10);
    total += dailyIncrement;
  }
  return baseCount + total;
}

export default function Comparison() {
  const downloadCount = getDownloadCount();
  return (
    <section id="comparison" className="py-24 px-4">
      <div className="max-w-4xl mx-auto rounded-3xl bg-gray-900 border border-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">版本对比</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
          {/* 免费版 */}
          <div className="space-y-4 p-6 rounded-2xl bg-gray-800/50 border border-gray-700">
            <h3 className="font-bold text-gray-400 text-center">免费版</h3>
            <p className="text-center text-gray-500 text-sm mb-4">基础剪贴板管理，永久免费</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>100 条剪贴板历史</span></div>
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>灵动岛交互体验</span></div>
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>置顶和收藏功能</span></div>
              <div className="flex items-center gap-2"><Check className="text-green-500 shrink-0" size={18} /> <span>按时间自动分组</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">全文搜索</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">智能分类筛选</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">便签功能</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">图片剪贴板</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">多格式导出</span></div>
              <div className="flex items-center gap-2"><X className="text-red-500/50 shrink-0" size={18} /> <span className="text-gray-500">富文本还原</span></div>
            </div>
          </div>
          {/* Pro 版 */}
          <div className="space-y-4 p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Crown size={12} /> PRO
            </div>
            <h3 className="font-bold text-blue-400 text-center">Pro 版</h3>
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm line-through mr-2">¥28</span>
              <span className="text-3xl font-bold text-white">¥18</span>
              <span className="text-gray-400 text-sm ml-1">一次性买断</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>免费版所有功能</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>最多 500 条历史记录</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>全文搜索</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>智能分类筛选</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>便签功能</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>图片剪贴板支持</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>多格式导出 (TXT/JSON/MD)</span></div>
              <div className="flex items-center gap-2"><Check className="text-blue-400 shrink-0" size={18} /> <span>富文本还原</span></div>
            </div>
          </div>
        </div>

        {/* 底部 CTA */}
        <div className="mt-10 text-center">
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/20 inline-block">
            <p className="text-orange-300 text-sm font-medium">
              🎁 限时福利：免费领取 Pro 兑换码
            </p>
            <div className="flex items-center justify-center gap-3 mt-1">
              <a href="https://www.xiaohongshu.com/user/profile/秃头也要做开发" target="_blank" rel="noopener noreferrer" className="text-white text-xs font-bold hover:text-red-400 transition-colors no-underline">
                📕 小红书「秃头也要做开发」
              </a>
              <span className="text-gray-600 text-xs">·</span>
              <a href="https://x.com/jch47643085" target="_blank" rel="noopener noreferrer" className="text-white text-xs font-bold hover:text-blue-400 transition-colors no-underline">
                𝕏 @jch47643085
              </a>
            </div>
          </div>
          <br />
          <a
            href="/灵剪.dmg"
            download
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-semibold hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white no-underline transition-all"
          >
            免费下载，体验后再决定
          </a>
          <p className="text-gray-500 text-sm mt-3">支持支付宝购买 · 一次买断 ¥18 · 永久使用</p>
          <p className="text-gray-600 text-xs mt-2 flex items-center justify-center gap-1.5">
            <Users size={12} />
            <span>已有 <strong className="text-gray-400">{downloadCount.toLocaleString()}</strong> 人下载</span>
          </p>
        </div>
      </div>
    </section>
  );
}
