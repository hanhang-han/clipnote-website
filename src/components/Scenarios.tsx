import { motion } from 'motion/react';
import { Code2, Palette, PenTool, GraduationCap } from 'lucide-react';

const scenarios = [
  {
    icon: Code2,
    role: '程序员',
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'hover:border-purple-500/30',
    pain: '反复复制的代码片段，切窗口翻半天找不到',
    solution: '智能分类「代码」一键定位，3 秒找到 3 天前的那段函数',
    tag: '代码片段',
  },
  {
    icon: Palette,
    role: '设计师',
    color: 'from-pink-500 to-rose-500',
    borderColor: 'hover:border-pink-500/30',
    pain: '收集的素材链接和配色散落在各个聊天记录里',
    solution: '图片剪贴板 + 链接自动归类，素材一键导出',
    tag: '素材收集',
  },
  {
    icon: PenTool,
    role: '运营 / 自媒体',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'hover:border-amber-500/30',
    pain: '收集文案参考素材，复制粘贴来回切换太痛苦',
    solution: '便签功能随时记录灵感，全文搜索秒级定位',
    tag: '文案灵感',
  },
  {
    icon: GraduationCap,
    role: '学生',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'hover:border-emerald-500/30',
    pain: '写论文收集资料，参考文献链接总是丢失',
    solution: '自动保存所有链接，一键导出 Markdown 整理',
    tag: '论文资料',
  },
];

export default function Scenarios() {
  return (
    <section id="scenarios" className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">谁在用灵剪？</h2>
        <p className="text-gray-400 text-center mb-16 max-w-lg mx-auto">
          无论你做什么工作，只要用过「复制粘贴」，灵剪都能帮到你
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group p-6 rounded-2xl bg-gray-900/80 border border-gray-800 ${s.borderColor} transition-all duration-300 hover:bg-gray-900`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{s.role}</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                  {s.tag}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3 flex items-start gap-2">
                <span className="text-red-400/60 shrink-0 mt-0.5">✕</span>
                {s.pain}
              </p>
              <p className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                {s.solution}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
