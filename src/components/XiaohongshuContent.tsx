import { motion } from 'motion/react';

/**
 * 小红书第一篇笔记内容包
 * 复制下方文案到小红书发布即可
 */

// ==========================================
// 标题选项（A/B 测试，选一个用）
// ==========================================
export const titles = [
  "我做了一款 Mac 剪贴板工具，用了就回不去了",
  "程序员最崩溃的瞬间：3天前复制的代码找不到了",
  "Mac 效率神器 | 这个剪贴板工具让我每天省 30 分钟",
  "独立开发 100 天，我终于上线了自己的第一个产品",
  "2026 年我离不开的 Mac 效率工具（第 1 个是我自己做的）",
];

// ==========================================
// 笔记正文（直接复制到小红书）
// ==========================================
export const postContent = `作为程序员，每天复制粘贴上百次，但 Mac 只能记住最近 1 条 😤

所以我自己做了一款叫「灵剪」的剪贴板工具👇

🖱️ 像灵动岛一样，鼠标移到屏幕顶部自动弹出
🔍 自动分类代码、链接、文本、图片
⚡ 3秒搜到3天前复制的那段代码
📋 一键导出 TXT/Markdown，资料不丢失
📌 支持置顶、收藏、便签预览

用了灵剪之后，复制过的东西再也不用找第二次 ✨

🎁 限时福利：关注我 + 点赞这条笔记
评论区留言「想要」，我私信送 Pro 兑换码（价值¥18免费领）！

📥 搜索 funbox.chat 免费下载

#独立开发者 #Mac效率工具 #程序员 #剪贴板 #效率神器 #macOS #开发者日常 #生产力工具 #Mac应用推荐`;

// ==========================================
// 后续笔记选题（前 2 周内容计划）
// ==========================================
export const contentPlan = [
  {
    day: 1,
    title: "我做了一款 Mac 剪贴板工具，用了就回不去了",
    type: "产品介绍",
    images: "灵动岛动画 GIF + 功能截图 3-4 张",
  },
  {
    day: 2,
    title: "独立开发第 1 天：从想法到代码",
    type: "开发日记",
    images: "代码截图 + 开发环境 + 思维导图",
  },
  {
    day: 3,
    title: "程序员效率工具箱 | 5 个我每天都在用的 Mac 应用",
    type: "工具合集",
    images: "5 个工具的截图拼图",
  },
  {
    day: 5,
    title: "Mac 上这个灵动岛效果，居然是一个剪贴板工具做的",
    type: "视觉展示",
    images: "灵动岛展开/收起 GIF（重点推这个）",
  },
  {
    day: 7,
    title: "送 20 个 Pro 兑换码！我的剪贴板工具免费送",
    type: "福利互动",
    images: "app 截图 + 兑换码展示",
  },
  {
    day: 9,
    title: "用灵剪前 vs 用灵剪后的剪贴板",
    type: "对比反差",
    images: "左右对比图（混乱 vs 整洁）",
  },
  {
    day: 11,
    title: "独立开发者的一天 | 从写代码到上线全过程",
    type: "Vlog/日常",
    images: "工作台照片 + 时间线 + 产品截图",
  },
  {
    day: 14,
    title: "一个独立开发者的收入报告 | 第 1 个月",
    type: "数据分享",
    images: "收入截图 + 下载量 + 用户反馈",
  },
];

// ==========================================
// 配图建议（小红书图片尺寸 3:4 竖图最佳）
// ==========================================
export const imageGuide = `
第 1 张（封面，最重要！）：
- 灵动岛展开动画截图，加上大字标题
- 红底白字或黑底蓝字，视觉冲击力强
- 可以加「免费送 Pro」的标签

第 2-4 张（功能展示）：
- 智能分类截图（不同颜色标签）
- 搜索功能截图
- 便签预览截图

第 5 张（福利引导）：
- 「关注 + 点赞 = 免费 Pro」
- 加下载地址 funbox.chat
`;

// 这是一个用于渲染内容的预览组件（可选）
export default function XiaohongshuContentPreview() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">小红书内容预览</h2>

        {/* 标题选项 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">标题选项（选一个）</h3>
          <div className="space-y-2">
            {titles.map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-300">
                <span className="text-blue-400 font-medium mr-2">#{i + 1}</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* 正文预览 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">笔记正文</h3>
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
            {postContent}
          </div>
        </div>

        {/* 内容计划 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">前 2 周内容计划</h3>
          <div className="space-y-3">
            {contentPlan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    Day {item.day}
                  </span>
                  <span className="text-xs text-gray-500">{item.type}</span>
                </div>
                <p className="text-sm font-medium text-gray-200">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">📷 {item.images}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
