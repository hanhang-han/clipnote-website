import { motion } from 'motion/react';
import { Download, ArrowDown } from 'lucide-react';

export default function Hero() {
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
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">剪贴板已就绪</span>
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
          自动记录每一次复制 · 智能分类 · 极速搜索 · 一键导出
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
      </motion.div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
    </section>
  );
}
