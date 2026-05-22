import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const clipboardItems = [
  { icon: "📋", text: "智能剪贴板管理工具" },
  { icon: "🔗", text: "https://github.com/clipnote" },
  { icon: "💻", text: "func copyItem(_ item: Clipboard)" },
  { icon: "🖼️", text: "[图片] 截图 2026-05-22" },
];

export default function MockupSection() {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // 自动循环展开/收起
  useEffect(() => {
    const cycle = setInterval(() => {
      setExpanded(prev => !prev);
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  // 切换剪贴板条目
  useEffect(() => {
    if (!expanded) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % clipboardItems.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [expanded]);

  return (
    <section id="mockup" className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">灵动岛交互体验</h2>
        <p className="text-gray-400 mb-16 max-w-xl mx-auto">
          鼠标悬停自动展开，丝滑动画，高效操作。就像 iPhone 上的灵动岛一样。
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
          <div className="bg-[#1a1a2e] rounded-b-2xl border border-gray-800 border-t-0 relative overflow-hidden" style={{ height: 320 }}>
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
                <span>搜索</span>
              </div>
            </div>

            {/* 灵动岛 */}
            <div className="flex justify-center mt-2">
              <motion.div
                animate={{
                  width: expanded ? 400 : 180,
                  height: expanded ? 220 : 36,
                  borderRadius: expanded ? 24 : 18,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-black border border-gray-700/50 flex flex-col items-center justify-start overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                {/* 岛顶部 */}
                <div className="w-full flex items-center justify-center py-2 px-4">
                  <motion.div
                    animate={{ opacity: expanded ? 1 : 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-white">灵剪</span>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-gray-400 ml-auto"
                      >
                        剪贴板
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
                    className="w-full px-3 pb-3 space-y-1.5"
                  >
                    {clipboardItems.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: activeIndex === i ? 1 : 0.4,
                          x: 0,
                          backgroundColor: activeIndex === i ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)",
                        }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                      >
                        <span>{item.icon}</span>
                        <span className="truncate text-gray-300">{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* 桌面提示 */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-gray-600 text-sm">
                {expanded ? "👆 展开态 — 浏览和管理剪贴板" : "👆 紧凑态 — 自动收起节省空间"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
