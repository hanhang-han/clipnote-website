import { motion } from 'motion/react';
import { Layers, Zap, Search, Clipboard, Tag, Cpu } from 'lucide-react';

const features = [
  { icon: Layers, title: "灵动岛交互", desc: "鼠标悬停屏幕顶部自动展开，丝滑体验", gradient: "from-blue-500 to-cyan-500" },
  { icon: Clipboard, title: "智能剪贴板", desc: "自动记录文本、图片、链接、代码", gradient: "from-indigo-500 to-blue-500" },
  { icon: Search, title: "极速搜索", desc: "毫秒级定位历史记录，内联搜索", gradient: "from-purple-500 to-indigo-500" },
  { icon: Tag, title: "智能分类", desc: "自动识别文本、链接、代码、图片", gradient: "from-pink-500 to-rose-500" },
  { icon: Cpu, title: "轻量高效", desc: "菜单栏常驻，内存占用极致优化", gradient: "from-emerald-500 to-teal-500" },
  { icon: Zap, title: "智能便签", desc: "随时记录灵感，即刻沉淀", gradient: "from-amber-500 to-orange-500" },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">核心功能</h2>
        <p className="text-gray-400 text-center mb-16 max-w-lg mx-auto">
          六大核心能力，让剪贴板管理从未如此高效优雅
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/30 transition-all duration-300 hover:bg-gray-900"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
