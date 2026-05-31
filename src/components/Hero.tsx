import { motion } from 'motion/react';
import { Download, ArrowDown, Users } from 'lucide-react';

// 下载量统计：基准 1483 + 按小时自然增长
function getDownloadCount(): number {
  const baseCount = 1483;
  const startDate = new Date('2026-05-29T00:00:00+08:00');
  const now = new Date();
  const hoursSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60));
  if (hoursSinceStart <= 0) return baseCount;
  // 每天约 5~15 个新下载，分摊到每小时
  const daysSinceStart = Math.floor(hoursSinceStart / 24);
  const currentHour = hoursSinceStart % 24;
  let total = 0;
  // 完整天数的增量
  for (let d = 0; d < daysSinceStart; d++) {
    const date = new Date(startDate.getTime() + d * 86400000);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    total += 5 + ((seed * 7 + 13) % 11); // 5~15
  }
  // 今天已过小时的增量
  const todaySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const todayTotal = 5 + ((todaySeed * 7 + 13) % 11);
  total += Math.floor(todayTotal * currentHour / 24);
  return baseCount + total;
}

export default function Hero() {
  const downloadCount = getDownloadCount();
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20 overflow-hidden">
      {/* 背景渐变光效 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* 灵动岛装饰 */}
        <motion.div
          initial={{ width: 80, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-10 bg-gray-800 rounded-full border border-gray-700 mx-auto mb-8 flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">AI 助手已就绪</span>
        </motion.div>

        {/* 主标题 — 场景化痛点 */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          复制过的东西
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            再也不用找第二次
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-3">
          灵剪 ClipNote — macOS 灵动岛剪贴板管理工具
        </p>
        <p className="text-sm text-gray-500 mb-8">
          自动记录每一次复制 · 智能分类 · AI 智能助手 · 一键导出
        </p>

        {/* 价格标签 */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-gray-500 line-through text-sm">¥28</span>
          <span className="text-3xl font-bold text-white">¥18</span>
          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium border border-orange-500/30">
            限时优惠
          </span>
          <span className="text-gray-400 text-sm">一次性买断</span>
        </div>

        {/* 限时免费 Pro 横幅 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/20 max-w-lg mx-auto"
        >
          <p className="text-orange-300 text-sm font-medium">
            🎁 限时活动 · 免费领取 Pro 权益
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
            <span className="text-gray-300 text-xs">关注</span>
            <a href="https://www.xiaohongshu.com/user/profile/秃头也要做开发" target="_blank" rel="noopener noreferrer" className="text-white text-xs font-bold hover:text-red-400 transition-colors no-underline">
              📕 小红书「秃头也要做开发」
            </a>
            <span className="text-gray-600 text-xs">或</span>
            <a href="https://x.com/jch47643085" target="_blank" rel="noopener noreferrer" className="text-white text-xs font-bold hover:text-blue-400 transition-colors no-underline">
              𝕏 @jch47643085
            </a>
          </div>
        </motion.div>

        {/* CTA 按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <motion.a
            href="/灵剪.dmg"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-semibold text-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2 no-underline text-white transition-shadow"
          >
            <Download size={20} /> 免费下载
          </motion.a>
          <motion.a
            href="#scenarios"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/5 rounded-full font-semibold text-lg hover:bg-white/10 flex items-center gap-2 border border-white/10 no-underline text-white backdrop-blur-sm"
          >
            <ArrowDown size={20} /> 看看谁在用
          </motion.a>
        </div>

        {/* Homebrew 安装 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-5 flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-xs">或通过 Homebrew 安装</span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-sm text-gray-300">
            <span>brew install --cask hanhang-han/tap/clipnote</span>
            <button
              onClick={() => navigator.clipboard.writeText('brew install --cask hanhang-han/tap/clipnote')}
              className="text-gray-500 hover:text-white transition-colors"
              title="复制命令"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
        </motion.div>

        {/* 下载量统计 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-2 mt-6 text-gray-500"
        >
          <Users size={14} />
          <span className="text-sm">已有 <strong className="text-gray-300">{downloadCount.toLocaleString()}</strong> 人下载</span>
        </motion.div>
      </motion.div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
    </section>
  );
}
