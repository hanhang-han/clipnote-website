import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const clipboardItems = [
  { icon: "📋", text: "灵剪 — macOS 剪贴板管理工具", type: "文本", color: "bg-gray-500" },
  { icon: "🔗", text: "https://github.com/clipnote/release", type: "链接", color: "bg-blue-500" },
  { icon: "💻", text: "func copyItem(_ item: ClipboardItem)", type: "代码", color: "bg-purple-500" },
  { icon: "🖼️", text: "[图片] 截图 2026-05-24", type: "图片", color: "bg-orange-500" },
  { icon: "📝", text: "# 项目周报\n本周完成了...", type: "MD", color: "bg-cyan-500" },
];

export default function MockupSection() {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // 自动循环展开/收起
  useEffect(() => {
    const cycle = setInterval(() => {
      setExpanded(prev => !prev);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  // 切换剪贴板条目
  useEffect(() => {
    if (!expanded) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % clipboardItems.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [expanded]);

  return (
    <section id="mockup" className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">像 iPhone 灵动岛一样丝滑</h2>
        <p className="text-gray-400 mb-16 max-w-xl mx-auto">
          鼠标悬停自动展开，离开自动收起。不占桌面空间，需要时随时出现。
        </p>

        {/* 模拟屏幕 */}
        <div className="relative w-full max-w-3xl mx-auto">
          {/* 屏幕顶栏 */}
          <div className="bg-gray-900 rounded-t-2xl border border-gray-800 border-b-0 px-6 py-2 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="text-xs text-gray-500">macOS Desktop</div>
            <div className="w-12" />
          </div>

          {/* 屏幕内容 */}
          <div className="bg-[#1a1a2e] rounded-b-2xl border border-gray-800 border-t-0 relative overflow-hidden" style={{ height: 340 }}>
            {/* 菜单栏 */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-black/40 text-xs text-gray-400">
              <div className="flex gap-4">
                <span className="font-bold text-white"></span>
                <span>文件</span>
                <span>编辑</span>
                <span>显示</span>
              </div>
              <div className="flex gap-3">
                <span>Wi-Fi</span>
                <span>电池</span>
                <span>14:30</span>
              </div>
            </div>

            {/* 灵动岛 */}
            <div className="flex justify-center mt-2">
              <motion.div
                animate={{
                  width: expanded ? 440 : 180,
                  height: expanded ? 240 : 36,
                  borderRadius: expanded ? 24 : 18,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-black border border-gray-700/50 flex flex-col items-center justify-start overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                {/* 岛顶部 */}
                <div className="w-full flex items-center justify-center py-2 px-4">
                  <motion.div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-white">灵剪</span>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-gray-400 ml-2"
                      >
                        剪贴板 · 便签 · 设置
                      </motion.span>
                    )}
                  </motion.div>
                </div>

                {/* 展开内容 */}
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full px-3 pb-3 space-y-1"
                  >
                    {clipboardItems.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: activeIndex === i ? 1 : 0.4,
                          x: 0,
                          backgroundColor: activeIndex === i ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                        }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="truncate text-gray-300 flex-1">{item.text}</span>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] text-white/80 ${item.color}/30 bg-opacity-20`}>
                          {item.type}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* 桌面提示 */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-gray-500 text-sm">
                {expanded
                  ? "👆 展开态 — 浏览、搜索、管理剪贴板历史"
                  : "👆 紧凑态 — 不占空间，自动收起"}
              </p>
            </div>
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            ⌘⇧V 快速唤出
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            单击预览 · 双击复制
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            开机自动启动
          </span>
        </div>
      </div>
    </section>
  );
}
