import { motion } from 'motion/react';
import { Layers, Zap, Search, Clipboard, Tag, FileDown } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: "灵动岛交互",
    desc: "悬停即开，离开即收。不占屏幕空间，鼠标移到顶部自动展开管理面板",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clipboard,
    title: "智能剪贴板",
    desc: "复制即保存，最多记录 500 条历史。文本、链接、代码、图片全自动识别",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Search,
    title: "极速搜索",
    desc: "3 秒找到 3 天前复制的那段话。输入关键词，毫秒级定位历史记录",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Tag,
    title: "智能分类",
    desc: "文本、链接、代码、图片、富文本、Markdown…7 种类型自动归类，支持自定义排序",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: FileDown,
    title: "多格式导出",
    desc: "一键导出为 TXT、JSON、Markdown。资料永不丢失，随时备份整理",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "便签预览",
    desc: "点击任意记录弹出便签预览，不用来回切窗口。写代码、查链接、看图片一目了然",
    gradient: "from-amber-500 to-orange-500",
  },
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
